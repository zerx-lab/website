import { getWolaiArticles, getWolaiArticleContent } from '@/lib/wolai';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WolaiArticlePage({ params }: PageProps) {
  const { id } = await params;

  // Get all articles to find metadata
  const articles = await getWolaiArticles();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  // Get article content
  const content = await getWolaiArticleContent(id);

  return (
    <main className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden section-bg selection:bg-cyan-500/30 selection:text-cyan-200 border-b border-gray-200 dark:border-white/10">
        <div className="absolute inset-0 bg-grid-cyber opacity-[0.1] dark:opacity-[0.05]" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-mono text-gray-500 dark:text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>BACK_TO_BLOG</span>
            </Link>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold font-mono text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              {article.title}
            </h1>

            {/* Description */}
            {article.description && (
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {article.description}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Zerx
              </span>
              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded"
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
                className="flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>VIEW_IN_WOLAI</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="py-16 relative section-bg">
        <div className="container mx-auto px-4">
          <article className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-mono prose-headings:tracking-tight prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-code:text-cyan-600 dark:prose-code:text-cyan-400 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-500 font-mono">
                // CONTENT_LOADING_FROM_WOLAI
              </div>
            )}
          </article>
        </div>
      </section>

      {/* Bottom navigation */}
      <section className="py-12 border-t border-gray-200 dark:border-white/10 section-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 font-mono transition-all border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 card-hover-lift"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="tracking-wider">BACK_TO_BLOG</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// Markdown to HTML converter with proper code block handling
function markdownToHtml(markdown: string): string {
  // 先提取代码块，用占位符替换
  const codeBlocks: string[] = [];
  let processed = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const index = codeBlocks.length;
    // HTML 转义代码内容
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    codeBlocks.push(`<pre><code class="language-${lang || 'text'}">${escapedCode}</code></pre>`);
    return `__CODE_BLOCK_${index}__`;
  });

  // 处理其他 Markdown 元素
  processed = processed
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Auto-link URLs
    .replace(/<(https?:\/\/[^>]+)>/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr />');

  // 处理段落 - 分割成行，智能处理
  const lines = processed.split('\n');
  const htmlLines: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      continue;
    }

    // 跳过已经是 HTML 标签的行
    if (trimmed.startsWith('<') && !trimmed.startsWith('<li>')) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      htmlLines.push(trimmed);
      continue;
    }

    // 处理列表项
    if (trimmed.startsWith('<li>')) {
      if (!inList) {
        htmlLines.push('<ul>');
        inList = true;
      }
      htmlLines.push(trimmed);
      continue;
    }

    // 处理占位符
    if (trimmed.startsWith('__CODE_BLOCK_')) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      htmlLines.push(trimmed);
      continue;
    }

    // 普通文本变成段落
    if (inList) {
      htmlLines.push('</ul>');
      inList = false;
    }
    htmlLines.push(`<p>${trimmed}</p>`);
  }

  if (inList) {
    htmlLines.push('</ul>');
  }

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
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${article.title} - ZERX_LAB Blog`,
    description: article.description,
  };
}
