import { getWolaiArticles, getWolaiArticleContent } from '@/lib/wolai';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import type { TOCItemType } from 'fumadocs-core/toc';
import { WolaiContent } from '@/components/blog/wolai-content';
import { codeToHtml } from 'shiki';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WolaiArticlePage({ params }: PageProps) {
  const { id } = await params;

  const articles = await getWolaiArticles();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  const content = await getWolaiArticleContent(id);
  const { html, toc } = await processMarkdown(content);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <div className="mx-auto max-w-4xl lg:max-w-6xl">
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
          {/* 主内容 */}
          <article className="min-w-0">
            {/* 返回链接 */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono">BACK_TO_BLOG</span>
            </Link>

            {/* 标题 */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
              {article.title}
            </h1>

            {/* 描述 */}
            {article.description && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {article.description}
              </p>
            )}

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6 mb-8 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-mono">Zerx</span>
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <a
                href={`https://www.wolai.com/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                在 wolai 中查看 →
              </a>
            </div>

            {/* 移动端 TOC */}
            {toc.length > 0 && (
              <div className="lg:hidden mb-8">
                <InlineTOC items={toc} />
              </div>
            )}

            {/* 文章内容 */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <WolaiContent html={html} />
            </div>

            {/* 底部返回 */}
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-mono">BACK_TO_BLOG</span>
              </Link>
            </div>
          </article>

          {/* 桌面端 TOC */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-4 font-mono">
                  ON_THIS_PAGE
                </p>
                <InlineTOC items={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}

// 生成 slug（用于标题 ID）
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 处理 Markdown，返回 HTML 和 TOC
async function processMarkdown(markdown: string): Promise<{ html: string; toc: TOCItemType[] }> {
  const toc: TOCItemType[] = [];
  const codeBlocks: { lang: string; code: string }[] = [];

  // 提取代码块信息
  let processed = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const index = codeBlocks.length;
    codeBlocks.push({ lang: lang || 'text', code: code.trimEnd() });
    return `__CODE_BLOCK_${index}__`;
  });

  // 处理标题并提取 TOC
  processed = processed.replace(/^(#{1,3}) (.+)$/gm, (_, hashes, title) => {
    const depth = hashes.length;
    const id = slugify(title);

    if (depth >= 2 && depth <= 3) {
      toc.push({
        title,
        url: `#${id}`,
        depth,
      });
    }

    return `<h${depth} id="${id}">${title}</h${depth}>`;
  });

  // 处理其他元素
  processed = processed
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/<(https?:\/\/[^>]+)>/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^---$/gm, '<hr />');

  // 处理段落
  const lines = processed.split('\n');
  const htmlLines: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      continue;
    }
    if (trimmed.startsWith('<') && !trimmed.startsWith('<li>')) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      htmlLines.push(trimmed);
      continue;
    }
    if (trimmed.startsWith('<li>')) {
      if (!inList) { htmlLines.push('<ul>'); inList = true; }
      htmlLines.push(trimmed);
      continue;
    }
    if (trimmed.startsWith('__CODE_BLOCK_')) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      htmlLines.push(trimmed);
      continue;
    }
    if (inList) { htmlLines.push('</ul>'); inList = false; }
    htmlLines.push(`<p>${trimmed}</p>`);
  }
  if (inList) htmlLines.push('</ul>');

  // 使用 shiki 高亮代码块
  const highlightedBlocks = await Promise.all(
    codeBlocks.map(async ({ lang, code }) => {
      try {
        const highlighted = await codeToHtml(code, {
          lang,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        });
        return `<figure class="code-block not-prose my-6">
          <div class="code-header">
            <span class="text-fd-muted-foreground">${lang}</span>
          </div>
          <div class="shiki-wrapper">${highlighted}</div>
        </figure>`;
      } catch {
        const escapedCode = code
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `<figure class="code-block not-prose my-6">
          <div class="code-header">
            <span class="text-fd-muted-foreground">${lang}</span>
          </div>
          <pre><code>${escapedCode}</code></pre>
        </figure>`;
      }
    })
  );

  // 还原代码块
  let html = htmlLines.join('\n');
  highlightedBlocks.forEach((block, index) => {
    html = html.replace(`__CODE_BLOCK_${index}__`, block);
  });

  return { html, toc };
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const articles = await getWolaiArticles();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return { title: '文章未找到' };
  }

  return {
    title: `${article.title} - Blog`,
    description: article.description,
  };
}
