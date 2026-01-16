import { DocsPage } from 'fumadocs-ui/layouts/docs/page';

export default function Loading() {
  return (
    <DocsPage>
      <div className="animate-pulse">
        {/* 标题骨架 */}
        <div className="h-10 w-3/4 bg-fd-muted rounded mb-4" />

        {/* 描述骨架 */}
        <div className="h-6 w-full bg-fd-muted rounded mb-2" />
        <div className="h-6 w-2/3 bg-fd-muted rounded mb-6" />

        {/* 元信息骨架 */}
        <div className="flex gap-4 border-b border-fd-border pb-6 mb-8">
          <div className="h-5 w-16 bg-fd-muted rounded" />
          <div className="h-5 w-12 bg-fd-muted rounded" />
          <div className="h-5 w-12 bg-fd-muted rounded" />
        </div>

        {/* 内容骨架 */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-fd-muted rounded" />
          <div className="h-4 w-full bg-fd-muted rounded" />
          <div className="h-4 w-5/6 bg-fd-muted rounded" />
          <div className="h-4 w-full bg-fd-muted rounded" />
          <div className="h-4 w-4/5 bg-fd-muted rounded" />

          {/* 代码块骨架 */}
          <div className="h-40 w-full bg-fd-muted rounded-lg my-6" />

          <div className="h-4 w-full bg-fd-muted rounded" />
          <div className="h-4 w-3/4 bg-fd-muted rounded" />
          <div className="h-4 w-full bg-fd-muted rounded" />
          <div className="h-4 w-2/3 bg-fd-muted rounded" />
        </div>
      </div>
    </DocsPage>
  );
}
