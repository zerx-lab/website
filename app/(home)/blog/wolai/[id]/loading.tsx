import { ArrowLeft } from 'lucide-react';

export default function Loading() {
  return (
    <main className="container px-4 sm:px-6 py-8 lg:py-12">
      <div className="mx-auto max-w-4xl lg:max-w-6xl">
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
          {/* 主内容骨架 */}
          <article className="min-w-0 animate-pulse">
            {/* 返回链接 */}
            <div className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-600 mb-6">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono">BACK_TO_BLOG</span>
            </div>

            {/* 标题骨架 */}
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mb-4" />

            {/* 描述骨架 */}
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-6" />

            {/* 元信息骨架 */}
            <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6 mb-8">
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-16" />
              <div className="flex gap-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-12" />
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-16" />
              </div>
            </div>

            {/* 内容骨架 */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />

              {/* 代码块骨架 */}
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg mt-6" />

              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mt-6" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
            </div>
          </article>

          {/* 桌面端 TOC 骨架 */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-28 ml-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 ml-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-36" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20 ml-4" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
