import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function WolaiArticleLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout
      tree={{ name: '', children: [] }}
      {...baseOptions()}
      sidebar={{ enabled: false }}
    >
      {children}
    </DocsLayout>
  );
}
