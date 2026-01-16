import { getWolaiArticles, getWolaiArticleContent } from '@/lib/wolai';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import type { TOCItemType } from 'fumadocs-core/toc';
import { WolaiContent } from '@/components/blog/wolai-content';
import { codeToHtml } from 'shiki';

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
    <DocsPage toc={toc}>
      <DocsTitle>{article.title}</DocsTitle>
      {article.description && (
        <DocsDescription>{article.description}</DocsDescription>
      )}
      <div className="flex flex-wrap items-center gap-4 border-b pb-6 text-sm text-fd-muted-foreground">
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
      <DocsBody>
        <WolaiContent html={html} />
      </DocsBody>
      <div className="mt-8 border-t pt-6">
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
    </DocsPage>
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
        // 包装在 figure 中并添加语言标签
        return `<figure class="code-block not-prose my-6">
          <div class="code-header">
            <span class="text-fd-muted-foreground">${lang}</span>
          </div>
          <div class="shiki-wrapper">${highlighted}</div>
        </figure>`;
      } catch {
        // 如果语言不支持，回退到纯文本
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
