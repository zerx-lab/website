import { getBlogPosts } from '@/lib/source';
import { ArrowRight, Rss, PenLine } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Blog - ZERX_LAB',
  description: '技术博客，分享全栈开发、开源项目和技术探索的心得。',
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden section-bg selection:bg-cyan-500/30 selection:text-cyan-200">
        <div className="absolute inset-0 bg-grid-cyber opacity-[0.15] dark:opacity-[0.1]" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/30 rounded-full bg-cyan-50 dark:bg-cyan-900/10 mb-6 backdrop-blur-sm opacity-0 animate-fade-in">
              <PenLine className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-mono text-cyan-700 dark:text-cyan-300 tracking-widest">
                BLOG_SYSTEM
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-mono tracking-tight mb-6 opacity-0 animate-slide-in-left animation-delay-100">
              <span className="text-gray-900 dark:text-white">TECH_</span>
              <span className="text-cyan-600 dark:text-cyan-400">BLOG</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8 opacity-0 animate-fade-in-up animation-delay-200">
              技术探索、开源实践、架构设计的心得分享。
            </p>

            <div className="flex items-center gap-6 text-sm font-mono text-gray-500 dark:text-gray-500 opacity-0 animate-fade-in animation-delay-300">
              <span className="flex items-center gap-2">
                <Rss className="w-4 h-4" />
                {posts.length} POSTS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts List */}
      <section className="py-16 relative section-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-500 font-mono">
                  // NO_POSTS_FOUND
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, idx) => (
                  <Link
                    key={post.url}
                    href={post.url}
                    className="group block opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${0.1 * idx}s` }}
                  >
                    <article className="relative bg-white dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 sm:p-8 hover:border-cyan-500/50 transition-all duration-300 card-hover-lift">
                      {/* 角落装饰 */}
                      <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-gray-200 dark:border-white/10 group-hover:border-cyan-500/50 transition-colors" />
                      <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-gray-200 dark:border-white/10 group-hover:border-cyan-500/50 transition-colors" />

                      {/* 标题 */}
                      <h2 className="text-2xl sm:text-3xl font-bold font-mono text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors tracking-tight">
                        {post.data.title}
                      </h2>

                      {/* 描述 */}
                      {post.data.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed line-clamp-2">
                          {post.data.description}
                        </p>
                      )}

                      {/* 阅读更多 */}
                      <div className="flex items-center gap-2 text-sm font-mono text-cyan-600 dark:text-cyan-400">
                        <span className="tracking-wider">READ_MORE</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
