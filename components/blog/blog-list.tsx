'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ExternalLink, Loader2 } from 'lucide-react';
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
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, totalCount));
      setIsLoading(false);
    }, 300);
  };

  if (initialPosts.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-500 font-mono text-sm">
          // NO_POSTS_FOUND
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visiblePosts.map((post, idx) => (
        <Link
          key={post.url}
          href={post.url}
          className="group block"
        >
          <article className="relative p-5 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:border-cyan-500/50 dark:hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5">
            {/* 顶部装饰线 */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-500/0 group-hover:via-cyan-500/50 to-transparent transition-all duration-300" />

            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* 序号 */}
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-mono text-sm shrink-0 group-hover:bg-cyan-500/10 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {String(idx + 1).padStart(2, '0')}
              </div>

              <div className="flex-1 min-w-0">
                {/* 标题行 */}
                <div className="flex items-start gap-3 mb-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {post.data.title}
                  </h2>
                  {post.source === 'wolai' && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-mono">
                      <ExternalLink className="w-3 h-3" />
                      wolai
                    </span>
                  )}
                </div>

                {/* 描述 */}
                {post.data.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">
                    {post.data.description}
                  </p>
                )}

                {/* 底部信息 */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* 标签 */}
                  {post.data.tags && post.data.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.data.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.data.tags.length > 3 && (
                        <span className="text-xs text-gray-400 dark:text-gray-600">
                          +{post.data.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 阅读更多 */}
                  <div className="ml-auto flex items-center gap-1.5 text-sm text-cyan-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-mono text-xs">READ</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </Link>
      ))}

      {/* 加载更多 */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:border-cyan-500/50 dark:hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>LOADING...</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                <span>LOAD_MORE</span>
                <span className="text-gray-400 dark:text-gray-600">
                  [{displayCount}/{totalCount}]
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 加载完成 */}
      {!hasMore && totalCount > PAGE_SIZE && (
        <div className="text-center pt-8">
          <span className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            ALL_LOADED [{totalCount}]
          </span>
        </div>
      )}
    </div>
  );
}
