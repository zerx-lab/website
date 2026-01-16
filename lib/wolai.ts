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
 * - GET /databases/{id} - Get database structure
 * - POST /databases/{id}/rows - Query database rows
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

interface WolaiBlock {
  id: string;
  type: string;
  content?: unknown;
  children?: WolaiBlock[];
}

interface WolaiDatabaseRow {
  id: string;
  data: Record<string, unknown>;
}

interface WolaiDatabaseResponse {
  data: {
    rows: WolaiDatabaseRow[];
    page_id?: string;
    has_more?: boolean;
  };
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
async function wolaiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const response = await fetch(`${WOLAI_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': token,
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
 * Query database rows
 */
export async function getDatabaseRows(
  databaseId: string,
  options?: {
    page_size?: number;
    start_cursor?: string;
  }
): Promise<WolaiDatabaseResponse> {
  return wolaiRequest<WolaiDatabaseResponse>(
    `/databases/${databaseId}/rows`,
    {
      method: 'POST',
      body: JSON.stringify(options || {}),
    }
  );
}

/**
 * Get block children
 */
export async function getBlockChildren(blockId: string): Promise<{ data: WolaiBlock[] }> {
  return wolaiRequest(`/blocks/${blockId}/children`);
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
    const response = await getDatabaseRows(dbId);

    // Transform database rows to articles
    // Note: The exact field mapping depends on your wolai database structure
    const articles: WolaiArticle[] = response.data.rows.map((row) => {
      const data = row.data;

      return {
        id: row.id,
        title: extractTextValue(data['标题'] || data['title'] || data['Title'] || ''),
        description: extractTextValue(data['描述'] || data['description'] || data['Description'] || ''),
        createdAt: extractDateValue(data['创建时间'] || data['created_at'] || data['Created']),
        updatedAt: extractDateValue(data['更新时间'] || data['updated_at'] || data['Updated']),
        tags: extractMultiSelectValue(data['标签'] || data['tags'] || data['Tags']),
        status: extractSelectValue(data['状态'] || data['status'] || data['Status']),
      };
    });

    // Filter out draft articles (only return published ones)
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
    const { data: children } = await getBlockChildren(blockId);
    return blocksToMarkdown(children);
  } catch (error) {
    console.error('[Wolai] Error fetching article content:', error);
    return '';
  }
}

// Helper functions to extract values from wolai data types

function extractTextValue(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === 'string' ? v : v?.text || '')).join('');
  }
  if (typeof value === 'object' && value !== null) {
    const v = value as Record<string, unknown>;
    return (v.text || v.value || v.title || '') as string;
  }
  return String(value);
}

function extractDateValue(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const v = value as Record<string, unknown>;
    return (v.start || v.date || v.value) as string | undefined;
  }
  return undefined;
}

function extractMultiSelectValue(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === 'string' ? v : v?.name || v?.value || '')).filter(Boolean);
  }
  return [];
}

function extractSelectValue(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const v = value as Record<string, unknown>;
    return (v.name || v.value) as string | undefined;
  }
  return undefined;
}

/**
 * Convert wolai blocks to markdown
 */
function blocksToMarkdown(blocks: WolaiBlock[]): string {
  if (!blocks || blocks.length === 0) return '';

  return blocks
    .map((block) => {
      const content = block.content as Record<string, unknown> | undefined;
      const text = extractTextValue(content?.rich_text || content?.text || content?.title || '');

      switch (block.type) {
        case 'heading_1':
        case 'heading':
          return `# ${text}\n`;
        case 'heading_2':
          return `## ${text}\n`;
        case 'heading_3':
          return `### ${text}\n`;
        case 'paragraph':
        case 'text':
          return `${text}\n`;
        case 'bulleted_list_item':
        case 'bullet_list':
          return `- ${text}\n`;
        case 'numbered_list_item':
        case 'numbered_list':
          return `1. ${text}\n`;
        case 'code':
          const language = (content?.language as string) || '';
          return `\`\`\`${language}\n${text}\n\`\`\`\n`;
        case 'quote':
        case 'callout':
          return `> ${text}\n`;
        case 'divider':
          return `---\n`;
        case 'image':
          const fileObj = content?.file as Record<string, unknown> | undefined;
          const url = (content?.url || fileObj?.url) as string | undefined;
          return url ? `![${text || 'image'}](${url})\n` : '';
        default:
          return text ? `${text}\n` : '';
      }
    })
    .join('\n');
}

// Re-export types
export type { WolaiBlock, WolaiDatabaseRow };
