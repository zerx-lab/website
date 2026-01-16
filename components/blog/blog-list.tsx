'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/lib/source';

const PAGE_SIZE = 10;

interface BlogListProps {
  initialPosts: BlogPost[];
  totalCount: number;
}

export function BlogList({ initialPosts, totalCount }: BlogListProps) {
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);

  const visiblePosts = initialPosts.slice(0, displayCount);
  const hasMore = displayCount < totalCount;

  const loadMore = () => {
    setIsLoading(true);
    // 模拟加载延迟，实际是客户端切片
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, totalCount));
      setIsLoading(false);
    }, 300);
  };

  if (initialPosts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-fd-muted-foreground font-mono">// NO_POSTS_FOUND</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {visiblePosts.map((post, idx) => (
        <Link
          key={post.url}
          href={post.url}
          className="group block"
        >
          <article className="relative bg-fd-card border border-fd-border p-6 sm:p-8 rounded-lg hover:border-fd-primary/50 transition-all duration-300 hover:shadow-lg">
            {/* 来源标签 */}
            {post.source === 'wolai' && (
              <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded bg-fd-secondary text-fd-muted-foreground">
                wolai
              </span>
            )}

            {/* 标题 */}
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 group-hover:text-fd-primary transition-colors pr-16">
              {post.data.title}
            </h2>

            {/* 描述 */}
            {post.data.description && (
              <p className="text-fd-muted-foreground mb-4 leading-relaxed line-clamp-2">
                {post.data.description}
              </p>
            )}

            {/* 标签 */}
            {post.data.tags && post.data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded bg-fd-secondary text-fd-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* 阅读更多 */}
            <div className="flex items-center gap-2 text-sm text-fd-primary">
              <span>阅读更多</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        </Link>
      ))}

      {/* 加载更多按钮 */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-3 rounded-lg border border-fd-border bg-fd-card hover:bg-fd-secondary hover:border-fd-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                加载中...
              </span>
            ) : (
              <span>
                加载更多 ({displayCount}/{totalCount})
              </span>
            )}
          </button>
        </div>
      )}

      {/* 已加载完成提示 */}
      {!hasMore && totalCount > PAGE_SIZE && (
        <div className="text-center pt-8 text-fd-muted-foreground text-sm">
          已加载全部 {totalCount} 篇文章
        </div>
      )}
    </div>
  );
}
