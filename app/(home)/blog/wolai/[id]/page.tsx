import { getWolaiArticles, getWolaiArticleContent } from '@/lib/wolai';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
  const htmlContent = markdownToHtml(content);

  return (
    <main className="container py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        {/* 返回链接 */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
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
        <article
          className="prose min-w-0 max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
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
      </div>
    </main>
  );
}

// Markdown 转 HTML，使用 fumadocs 兼容的类名
function markdownToHtml(markdown: string): string {
  const codeBlocks: string[] = [];

  // 提取代码块
  let processed = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const index = codeBlocks.length;
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // 使用 fumadocs 风格的代码块
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

  // 处理其他元素
  processed = processed
    .replace(/`([^`]+)`/g, '<code class="rounded bg-fd-secondary px-1.5 py-0.5 text-sm">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="mt-8 mb-4 text-xl font-semibold">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="mt-10 mb-4 text-2xl font-bold border-b pb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="mt-10 mb-4 text-3xl font-bold">$1</h1>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-fd-primary underline underline-offset-4 hover:text-fd-primary/80">$1</a>')
    .replace(/<(https?:\/\/[^>]+)>/g, '<a href="$1" target="_blank" rel="noopener" class="text-fd-primary underline underline-offset-4 break-all">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4" loading="lazy" />')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-fd-primary pl-4 italic text-fd-muted-foreground">$1</blockquote>')
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
  let result = htmlLines.join('\n');
  codeBlocks.forEach((block, index) => {
    result = result.replace(`__CODE_BLOCK_${index}__`, block);
  });

  return result;
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
