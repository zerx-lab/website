import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import type { MenuItemType } from "@fumadocs/ui/link-item";

function ZLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      fill="none"
      width={28}
      height={28}
    >
      <rect width="28" height="28" rx="5" fill="#030712" />

      {/* 左上角装饰 */}
      <rect x="2" y="2" width="6" height="1.5" fill="#06B6D4" />
      <rect x="2" y="2" width="1.5" height="6" fill="#06B6D4" />

      {/* 右下角装饰 */}
      <rect x="20" y="24.5" width="6" height="1.5" fill="#06B6D4" />
      <rect x="24.5" y="20" width="1.5" height="6" fill="#06B6D4" />

      {/* Z 字形 */}
      <path
        d="M7.5 8.5 H20.5 L7.5 19.5 H20.5"
        stroke="#06B6D4"
        strokeWidth="2.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2.5 font-bold font-mono tracking-tight">
          <ZLogo />
          <span className="text-gray-900 dark:text-white">zerx</span>
          <span className="text-cyan-500 dark:text-cyan-400">.dev</span>
        </span>
      ),
    },
    links: [
      {
        type: "menu",
        text: "项目",
        items: [
          {
            text: "代码仓库",
            description: "维护的开源代码仓库",
            url: "/#projects",
          },
          {
            text: "AUR 软件包",
            description: "为 Arch Linux 维护的 AUR 包",
            url: "/#aur",
          },
        ],
      } satisfies MenuItemType,
      {
        text: "博客",
        url: "/blog",
        active: "nested-url",
      },
      {
        text: "文档",
        url: "/docs",
        active: "nested-url",
      },
      {
        text: "关于",
        url: "/about",
      },
    ],
    githubUrl: "https://github.com/zerx-lab",
  };
}
