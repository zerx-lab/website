/**
 * wolai API Client
 *
 * API Base URL: https://openapi.wolai.com/v1/
 *
 * Available Endpoints:
 * - POST /token - Get access token
 * - GET /blocks/{id}/children - Query block children
 * - GET /blocks/{id} - Get block details
 * - POST /blocks - Create blocks
 * - GET /databases/{id} - Get database data (rows)
 */

const WOLAI_API_BASE = 'https://openapi.wolai.com/v1';

// Cache token in memory (token doesn't expire: expire_time = -1)
let cachedToken: string | null = null;

interface WolaiTokenResponse {
  data: {
    app_id: string;
    app_token: string;
    expire_time: number;
    update_time: number;
    create_time: number;
  };
}

interface WolaiBlockContent {
  title?: string;
  text?: string;
  type?: string;
}

interface WolaiBlock {
  id: string;
  type: string;
  content?: WolaiBlockContent[];
  language?: string;
  parent_id?: string;
  page_id?: string;
  children?: {
    ids: string[];
    api_url: string | null;
  };
}

interface WolaiDatabaseRow {
  page_id: string;
  data: Record<string, { type: string; value: string }>;
}

interface WolaiDatabaseResponse {
  data: {
    column_order: string[];
    rows: WolaiDatabaseRow[];
  };
}

interface WolaiBlockChildrenResponse {
  data: WolaiBlock[];
  next_cursor: string | null;
  has_more: boolean;
}

interface WolaiError {
  message: string;
  error_code: number;
  status_code: number;
}

export interface WolaiArticle {
  id: string;
  title: string;
  description?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  status?: string;
}

/**
 * Get access token from wolai API
 */
async function getToken(): Promise<string> {
  if (cachedToken) {
    return cachedToken;
  }

  const appId = process.env.WOLAI_APP_ID;
  const appSecret = process.env.WOLAI_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('WOLAI_APP_ID and WOLAI_APP_SECRET environment variables are required');
  }

  const response = await fetch(`${WOLAI_API_BASE}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      appId,
      appSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get wolai token: ${response.status}`);
  }

  const data: WolaiTokenResponse = await response.json();
  cachedToken = data.data.app_token;

  return cachedToken;
}

/**
 * Make authenticated request to wolai API
 */
async function wolaiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();

  const response = await fetch(`${WOLAI_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || data.error_code) {
    const error = data as WolaiError;
    throw new Error(`Wolai API Error: ${error.message} (code: ${error.error_code})`);
  }

  return data;
}

/**
 * Get database data (rows)
 */
export async function getDatabase(databaseId: string): Promise<WolaiDatabaseResponse> {
  return wolaiRequest<WolaiDatabaseResponse>(`/databases/${databaseId}`);
}

/**
 * Get block children
 */
export async function getBlockChildren(blockId: string): Promise<WolaiBlockChildrenResponse> {
  return wolaiRequest<WolaiBlockChildrenResponse>(`/blocks/${blockId}/children`);
}

/**
 * Get block details
 */
export async function getBlock(blockId: string): Promise<{ data: WolaiBlock }> {
  return wolaiRequest(`/blocks/${blockId}`);
}

/**
 * Get articles from wolai database
 * This function fetches articles from a wolai database and transforms them
 * into a format suitable for the blog
 */
export async function getWolaiArticles(databaseId?: string): Promise<WolaiArticle[]> {
  const dbId = databaseId || process.env.WOLAI_DATABASE_ID;

  if (!dbId) {
    console.warn('[Wolai] No database ID provided');
    return [];
  }

  try {
    const response = await getDatabase(dbId);

    // Transform database rows to articles
    const articles: WolaiArticle[] = response.data.rows.map((row) => {
      const data = row.data;

      // Extract title from the data - wolai uses { type, value } format
      const titleField = data['标题'] || data['title'] || data['Title'];
      const title = titleField?.value || '';

      // Extract other fields if they exist
      const descField = data['描述'] || data['description'] || data['Description'];
      const description = descField?.value;

      const tagsField = data['标签'] || data['tags'] || data['Tags'];
      const tags = tagsField?.value ? tagsField.value.split(',').map((t: string) => t.trim()) : undefined;

      const statusField = data['状态'] || data['status'] || data['Status'];
      const status = statusField?.value;

      return {
        id: row.page_id,
        title,
        description,
        tags,
        status,
      };
    });

    // Filter out articles without title and draft articles
    return articles.filter(
      (article) => article.title && (!article.status || article.status === '已发布' || article.status === 'Published')
    );
  } catch (error) {
    console.error('[Wolai] Error fetching articles:', error);
    return [];
  }
}

/**
 * Get article content by block ID
 */
export async function getWolaiArticleContent(blockId: string): Promise<string> {
  try {
    const response = await getBlockChildren(blockId);
    return blocksToMarkdown(response.data);
  } catch (error) {
    console.error('[Wolai] Error fetching article content:', error);
    return '';
  }
}

/**
 * Convert wolai blocks to markdown
 */
function blocksToMarkdown(blocks: WolaiBlock[]): string {
  if (!blocks || blocks.length === 0) return '';

  return blocks
    .map((block) => {
      // wolai content is an array of { title/text, type } objects
      const contentArray = block.content || [];
      const text = contentArray.map((c) => c.title || c.text || '').join('');

      switch (block.type) {
        case 'heading':
        case 'heading_1':
          return `# ${text}\n`;
        case 'heading_2':
          return `## ${text}\n`;
        case 'heading_3':
          return `### ${text}\n`;
        case 'paragraph':
        case 'text':
          return text ? `${text}\n` : '';
        case 'bulleted_list_item':
        case 'bullet_list':
          return `- ${text}\n`;
        case 'numbered_list_item':
        case 'numbered_list':
          return `1. ${text}\n`;
        case 'code':
          // wolai puts language at block level, not in content
          const language = block.language?.toLowerCase() || '';
          return `\`\`\`${language}\n${text}\n\`\`\`\n`;
        case 'quote':
        case 'callout':
          return `> ${text}\n`;
        case 'divider':
          return `---\n`;
        case 'image':
          // Handle image blocks
          const imgContent = contentArray[0];
          const imgUrl = (imgContent as Record<string, unknown>)?.url as string | undefined;
          return imgUrl ? `![${text || 'image'}](${imgUrl})\n` : '';
        default:
          return text ? `${text}\n` : '';
      }
    })
    .filter(Boolean)
    .join('\n');
}

// Re-export types
export type { WolaiBlock, WolaiDatabaseRow };
