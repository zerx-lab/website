import { blogSource } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import defaultMdxComponents from 'fumadocs-ui/mdx';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);

  if (!page) {
    notFound();
  }

  const MDXContent = page.data.body;

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
            {/* 返回链接 */}
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-mono text-gray-500 dark:text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>BACK_TO_BLOG</span>
            </Link>

            {/* 标题 */}
            <h1 className="text-4xl sm:text-5xl font-bold font-mono text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              {page.data.title}
            </h1>

            {/* 描述 */}
            {page.data.description && (
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {page.data.description}
              </p>
            )}

            {/* 作者 */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Zerx
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 文章内容 */}
      <section className="py-16 relative section-bg">
        <div className="container mx-auto px-4">
          <article className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-mono prose-headings:tracking-tight prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-code:text-cyan-600 dark:prose-code:text-cyan-400 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800">
            <MDXContent components={defaultMdxComponents} />
          </article>
        </div>
      </section>

      {/* 底部导航 */}
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

export async function generateStaticParams() {
  const pages = blogSource.getPages();
  return pages.map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);

  if (!page) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${page.data.title} - ZERX_LAB Blog`,
    description: page.data.description,
  };
}
