import { getWolaiArticles, getWolaiArticleContent } from '@/lib/wolai';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import type { TOCItemType } from 'fumadocs-core/toc';

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
  const { html, toc } = processMarkdown(content);

  return (
    <main className="container py-8 lg:py-12">
      <div className="flex gap-12">
        {/* 主内容区 */}
        <article className="min-w-0 flex-1 max-w-3xl">
          {/* 返回链接 */}
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回博客
          </Link>

          {/* 标题 */}
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            {article.title}
          </h1>

          {/* 描述 */}
          {article.description && (
            <p className="mb-6 text-lg text-fd-muted-foreground">
              {article.description}
            </p>
          )}

          {/* 元信息 */}
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-fd-border pb-6 text-sm text-fd-muted-foreground">
            <span>Zerx</span>
            {article.tags && article.tags.length > 0 && (
              <div className="flex gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-fd-secondary px-2 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <a
              href={`https://www.wolai.com/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto hover:text-fd-primary"
            >
              在 wolai 中查看 →
            </a>
          </div>

          {/* 文章内容 */}
          <div
            className="prose prose-fd min-w-0 max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* 底部返回 */}
          <div className="mt-12 border-t border-fd-border pt-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回博客列表
            </Link>
          </div>
        </article>

        {/* 右侧目录 */}
        {toc.length > 0 && (
          <aside className="hidden xl:block w-56 shrink-0">
            <div className="sticky top-20">
              <InlineTOC items={toc} />
            </div>
          </aside>
        )}
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
function processMarkdown(markdown: string): { html: string; toc: TOCItemType[] } {
  const toc: TOCItemType[] = [];
  const codeBlocks: string[] = [];

  // 提取代码块
  let processed = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const index = codeBlocks.length;
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    codeBlocks.push(
      `<figure class="not-prose my-6 overflow-hidden rounded-lg border bg-fd-secondary/50 text-sm">
        <div class="flex items-center gap-2 border-b bg-fd-muted px-4 py-1.5">
          <span class="text-fd-muted-foreground">${lang || 'code'}</span>
        </div>
        <pre class="overflow-x-auto p-4"><code class="grid">${escapedCode}</code></pre>
      </figure>`
    );
    return `__CODE_BLOCK_${index}__`;
  });

  // 处理标题并提取 TOC
  processed = processed.replace(/^(#{1,3}) (.+)$/gm, (_, hashes, title) => {
    const depth = hashes.length;
    const id = slugify(title);

    // 只添加 h2, h3 到 TOC
    if (depth >= 2 && depth <= 3) {
      toc.push({
        title,
        url: `#${id}`,
        depth,
      });
    }

    const classes = depth === 1
      ? 'scroll-m-20 text-3xl font-bold mt-10 mb-4'
      : depth === 2
      ? 'scroll-m-20 text-2xl font-semibold border-b pb-2 mt-10 mb-4'
      : 'scroll-m-20 text-xl font-semibold mt-8 mb-4';

    return `<h${depth} id="${id}" class="${classes}">${title}</h${depth}>`;
  });

  // 处理其他元素
  processed = processed
    .replace(/`([^`]+)`/g, '<code class="rounded bg-fd-secondary px-1.5 py-0.5 text-sm">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-fd-primary underline underline-offset-4 hover:text-fd-primary/80">$1</a>')
    .replace(/<(https?:\/\/[^>]+)>/g, '<a href="$1" target="_blank" rel="noopener" class="text-fd-primary underline underline-offset-4 break-all">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4" loading="lazy" />')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-fd-primary pl-4 italic text-fd-muted-foreground my-4">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^---$/gm, '<hr class="my-8 border-fd-border" />');

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
      if (!inList) { htmlLines.push('<ul class="my-4 list-disc pl-6 space-y-2">'); inList = true; }
      htmlLines.push(trimmed);
      continue;
    }
    if (trimmed.startsWith('__CODE_BLOCK_')) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      htmlLines.push(trimmed);
      continue;
    }
    if (inList) { htmlLines.push('</ul>'); inList = false; }
    htmlLines.push(`<p class="my-4 leading-7">${trimmed}</p>`);
  }
  if (inList) htmlLines.push('</ul>');

  // 还原代码块
  let html = htmlLines.join('\n');
  codeBlocks.forEach((block, index) => {
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
