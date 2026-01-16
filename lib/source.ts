import { docs, blog } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { getWolaiArticles, type WolaiArticle } from './wolai';

// 文档数据源
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// 博客数据源 (MDX files)
export const blogSource = loader({
  baseUrl: '/blog',
  source: blog.toFumadocsSource(),
});

export type BlogPage = InferPageType<typeof blogSource>;

// 统一的博客文章类型
export interface BlogPost {
  id: string;
  slug: string;
  url: string;
  source: 'mdx' | 'wolai';
  data: {
    title: string;
    description?: string;
    date?: string;
    tags?: string[];
  };
}

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}

// 获取所有博客文章（MDX + Wolai）
export async function getBlogPosts(): Promise<BlogPost[]> {
  // 获取 MDX 文章
  const mdxPages = blogSource.getPages();
  const mdxPosts: BlogPost[] = mdxPages.map((page) => ({
    id: page.slugs.join('/'),
    slug: page.slugs[0],
    url: page.url,
    source: 'mdx',
    data: {
      title: page.data.title,
      description: page.data.description,
    },
  }));

  // 获取 Wolai 文章
  let wolaiPosts: BlogPost[] = [];
  try {
    const wolaiArticles = await getWolaiArticles();
    wolaiPosts = wolaiArticles.map((article: WolaiArticle) => ({
      id: article.id,
      slug: `wolai-${article.id}`,
      url: `/blog/wolai/${article.id}`,
      source: 'wolai',
      data: {
        title: article.title,
        description: article.description,
        date: article.createdAt,
        tags: article.tags,
      },
    }));
  } catch (error) {
    console.warn('[Blog] Failed to fetch wolai articles:', error);
  }

  // 合并并按日期排序（如果有日期的话）
  const allPosts = [...mdxPosts, ...wolaiPosts];

  return allPosts;
}

// 获取仅 MDX 博客文章（同步版本，用于静态生成）
export function getMdxBlogPosts() {
  const pages = blogSource.getPages();
  return pages;
}
