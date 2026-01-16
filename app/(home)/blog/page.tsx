import { getBlogPosts } from '@/lib/source';
import { BlogList } from '@/components/blog/blog-list';

export const metadata = {
  title: 'Blog - ZERX_LAB',
  description: '技术博客，分享全栈开发、开源项目和技术探索的心得。',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="container py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            博客
          </h1>
          <p className="text-fd-muted-foreground text-lg">
            技术探索、开源实践、架构设计的心得分享。共 {posts.length} 篇文章。
          </p>
        </div>

        {/* 文章列表 */}
        <BlogList initialPosts={posts} totalCount={posts.length} />
      </div>
    </main>
  );
}
