/**
 * wolai API Client with Caching
 *
 * API Base URL: https://openapi.wolai.com/v1/
 * 支持文件缓存，减少 API 请求，提升响应速度
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const WOLAI_API_BASE = 'https://openapi.wolai.com/v1';
const CACHE_DIR = path.join(process.cwd(), '.wolai-cache');
const CACHE_TTL = 60 * 60 * 1000; // 1 小时缓存过期

// Token 内存缓存
let cachedToken: string | null = null;

// ============== 类型定义 ==============

interface WolaiTokenResponse {
  data: {
    app_id: string;
    app_token: string;
    expire_time: number;
  };
}

interface WolaiBlockContent {
  title?: string;
  text?: string;
  type?: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  inline_code?: boolean;
  link?: string;
  url?: string;
}

interface WolaiBlock {
  id: string;
  type: string;
  content?: WolaiBlockContent[];
  language?: string;
  parent_id?: string;
  page_id?: string;
  children?: { ids: string[]; api_url: string | null };
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

interface CacheEntry<T> {
  data: T;
  hash: string;
  timestamp: number;
}

// ============== 缓存工具函数 ==============

function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function getCachePath(key: string): string {
  const safeKey = key.replace(/[^a-zA-Z0-9]/g, '_');
  return path.join(CACHE_DIR, `${safeKey}.json`);
}

function computeHash(data: unknown): string {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

function readCache<T>(key: string): CacheEntry<T> | null {
  try {
    const cachePath = getCachePath(key);
    if (fs.existsSync(cachePath)) {
      const content = fs.readFileSync(cachePath, 'utf-8');
      const entry: CacheEntry<T> = JSON.parse(content);

      // 检查是否过期
      if (Date.now() - entry.timestamp < CACHE_TTL) {
        return entry;
      }
    }
  } catch {
    // 缓存读取失败，忽略
  }
  return null;
}

function writeCache<T>(key: string, data: T): void {
  try {
    ensureCacheDir();
    const entry: CacheEntry<T> = {
      data,
      hash: computeHash(data),
      timestamp: Date.now(),
    };
    fs.writeFileSync(getCachePath(key), JSON.stringify(entry));
  } catch {
    // 缓存写入失败，忽略
  }
}

// ============== API 请求函数 ==============

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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appId, appSecret }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get wolai token: ${response.status}`);
  }

  const data: WolaiTokenResponse = await response.json();
  cachedToken = data.data.app_token;
  return cachedToken;
}

async function wolaiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30秒超时

  try {
    const response = await fetch(`${WOLAI_API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
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
  } finally {
    clearTimeout(timeout);
  }
}

// ============== 带缓存的 API 函数 ==============

export async function getDatabase(databaseId: string): Promise<WolaiDatabaseResponse> {
  const cacheKey = `db_${databaseId}`;

  // 尝试读取缓存
  const cached = readCache<WolaiDatabaseResponse>(cacheKey);
  if (cached) {
    console.log('[Wolai] 使用缓存的数据库数据');
    return cached.data;
  }

  // 请求 API
  console.log('[Wolai] 请求数据库数据...');
  const data = await wolaiRequest<WolaiDatabaseResponse>(`/databases/${databaseId}`);

  // 写入缓存
  writeCache(cacheKey, data);
  return data;
}

export async function getBlockChildren(blockId: string): Promise<WolaiBlockChildrenResponse> {
  const cacheKey = `block_${blockId}`;

  // 尝试读取缓存
  const cached = readCache<WolaiBlockChildrenResponse>(cacheKey);
  if (cached) {
    console.log(`[Wolai] 使用缓存的文章内容: ${blockId}`);
    return cached.data;
  }

  // 请求 API
  console.log(`[Wolai] 请求文章内容: ${blockId}...`);
  const data = await wolaiRequest<WolaiBlockChildrenResponse>(`/blocks/${blockId}/children`);

  // 写入缓存
  writeCache(cacheKey, data);
  return data;
}

export async function getBlock(blockId: string): Promise<{ data: WolaiBlock }> {
  return wolaiRequest(`/blocks/${blockId}`);
}

// ============== 高级 API 函数 ==============

export async function getWolaiArticles(databaseId?: string): Promise<WolaiArticle[]> {
  const dbId = databaseId || process.env.WOLAI_DATABASE_ID;

  if (!dbId) {
    console.warn('[Wolai] No database ID provided');
    return [];
  }

  try {
    const response = await getDatabase(dbId);

    const articles: WolaiArticle[] = response.data.rows.map((row) => {
      const data = row.data;

      const titleField = data['标题'] || data['title'] || data['Title'];
      const title = titleField?.value || '';

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

    return articles.filter(
      (article) => article.title && (!article.status || article.status === '已发布' || article.status === 'Published')
    );
  } catch (error) {
    console.error('[Wolai] Error fetching articles:', error);
    return [];
  }
}

export async function getWolaiArticleContent(blockId: string): Promise<string> {
  try {
    const response = await getBlockChildren(blockId);
    return blocksToMarkdown(response.data);
  } catch (error) {
    console.error('[Wolai] Error fetching article content:', error);
    return '';
  }
}

// ============== Markdown 转换 ==============

function richTextToMarkdown(content: WolaiBlockContent[]): string {
  if (!content?.length) return '';

  return content
    .map((item) => {
      let text = item.title || item.text || '';
      if (!text) return '';

      if (item.link) text = `[${text}](${item.link})`;
      if (item.inline_code) text = `\`${text}\``;
      if (item.bold) text = `**${text}**`;
      if (item.italic) text = `*${text}*`;
      if (item.strikethrough) text = `~~${text}~~`;

      return text;
    })
    .join('');
}

function blocksToMarkdown(blocks: WolaiBlock[]): string {
  if (!blocks || blocks.length === 0) return '';

  return blocks
    .map((block) => {
      const contentArray = block.content || [];
      const text = richTextToMarkdown(contentArray);

      switch (block.type) {
        case 'heading':
        case 'heading_1':
          return `# ${text}`;
        case 'heading_2':
          return `## ${text}`;
        case 'heading_3':
          return `### ${text}`;
        case 'paragraph':
        case 'text':
          return text || '';
        case 'bulleted_list_item':
        case 'bullet_list':
          return `- ${text}`;
        case 'numbered_list_item':
        case 'enum_list':
          return `1. ${text}`;
        case 'code':
          const language = block.language?.toLowerCase() || '';
          return `\`\`\`${language}\n${text}\n\`\`\``;
        case 'quote':
        case 'callout':
          return text
            .split('\n')
            .map((line) => `> ${line}`)
            .join('\n');
        case 'divider':
          return '---';
        case 'image':
          const imgUrl = contentArray[0]?.url;
          return imgUrl ? `![${text || 'image'}](${imgUrl})` : '';
        default:
          return text || '';
      }
    })
    .filter(Boolean)
    .join('\n\n');
}

// ============== 缓存管理 ==============

/** 清除所有缓存 */
export function clearCache(): void {
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      for (const file of files) {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      }
      console.log('[Wolai] 缓存已清除');
    }
  } catch (error) {
    console.error('[Wolai] 清除缓存失败:', error);
  }
}

/** 清除指定文章的缓存 */
export function clearArticleCache(blockId: string): void {
  try {
    const cachePath = getCachePath(`block_${blockId}`);
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
      console.log(`[Wolai] 已清除文章缓存: ${blockId}`);
    }
  } catch (error) {
    console.error('[Wolai] 清除文章缓存失败:', error);
  }
}

/** 获取缓存状态 */
export function getCacheStats(): { files: number; size: number; entries: string[] } {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      return { files: 0, size: 0, entries: [] };
    }

    const files = fs.readdirSync(CACHE_DIR);
    let totalSize = 0;
    const entries: string[] = [];

    for (const file of files) {
      const filePath = path.join(CACHE_DIR, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
      entries.push(file.replace('.json', ''));
    }

    return { files: files.length, size: totalSize, entries };
  } catch {
    return { files: 0, size: 0, entries: [] };
  }
}

// Re-export types
export type { WolaiBlock, WolaiDatabaseRow };
