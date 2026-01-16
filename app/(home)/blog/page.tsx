import { getBlogPosts } from '@/lib/source';
import { BlogList } from '@/components/blog/blog-list';
import { FileText, Rss } from 'lucide-react';

export const metadata = {
  title: 'Blog - ZERX_LAB',
  description: '技术博客，分享全栈开发、开源项目和技术探索的心得。',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="relative min-h-screen section-bg">
      {/* 背景效果 */}
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.08] dark:opacity-[0.05]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 dark:bg-blue-600/10 blur-[100px] pointer-events-none" />

      <div className="container relative z-10 px-4 sm:px-6 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          {/* 页面头部 */}
          <header className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tight mb-4">
              <span className="text-gray-900 dark:text-white">BLOG</span>
              <span className="text-cyan-600 dark:text-cyan-400">_</span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-2xl">
              <span className="text-cyan-600 dark:text-cyan-500 font-mono text-sm">{'>'}</span>{' '}
              技术探索、开源实践、架构设计的心得分享
            </p>

            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 font-mono">
                <Rss className="w-4 h-4" />
                <span>TOTAL_POSTS: {posts.length}</span>
              </div>
            </div>
          </header>

          {/* 文章列表 */}
          <BlogList initialPosts={posts} totalCount={posts.length} />
        </div>
      </div>
    </main>
  );
}
