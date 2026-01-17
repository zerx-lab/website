import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Code2 } from 'lucide-react';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2 font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-fd-primary text-fd-primary-foreground">
            <Code2 className="h-4 w-4" />
          </span>
          <span className="text-gradient-primary">zerx</span>
          <span className="text-fd-foreground">.dev</span>
        </span>
      ),
    },
    links: [
      {
        text: '博客',
        url: '/blog',
        active: 'nested-url',
      },
      {
        text: '文档',
        url: '/docs',
        active: 'nested-url',
      },
      {
        text: '关于',
        url: '/about',
      },
    ],
    githubUrl: 'https://github.com/zerx-lab',
  };
}
