import { cn } from "@/lib/cn";
import {
  Package,
  ExternalLink,
  ArrowUpRight,
  Terminal,
  CheckCircle2,
  Download,
} from "lucide-react";
import Link from "next/link";

interface AurPackage {
  name: string;
  description: string;
  aurUrl: string;
  upstreamUrl: string;
  version?: string;
  status: "maintained" | "testing";
  tags: string[];
}

const aurPackages: AurPackage[] = [
  {
    name: "zerx-lab-dida365-bin",
    description:
      "滴答清单（Dida365/TickTick）Linux 桌面客户端，由 sec-lab 打包维护的 AUR 预编译二进制包。",
    aurUrl: "https://aur.archlinux.org/packages/zerx-lab-dida365-bin",
    upstreamUrl: "https://www.dida365.com",
    status: "maintained",
    tags: ["BIN", "PRODUCTIVITY", "ELECTRON"],
  },
  {
    name: "zerx-lab-hexhub-bin",
    description:
      "HexHub Git 桌面客户端 Linux 版本，由 sec-lab 打包维护的 AUR 预编译二进制包。",
    aurUrl: "https://aur.archlinux.org/packages/zerx-lab-hexhub-bin",
    upstreamUrl: "https://hexhub.app",
    status: "maintained",
    tags: ["BIN", "GIT", "DEVELOPER"],
  },
];

function AurPackageCard({ pkg, index }: { pkg: AurPackage; index: number }) {
  return (
    <div
      className="group relative opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${0.15 * index + 0.1}s` }}
    >
      <div
        className={cn(
          "relative h-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 p-6 sm:p-8 transition-all duration-500 overflow-hidden rounded-xl backdrop-blur-sm card-hover-lift",
          "hover:border-cyan-500/30 hover:bg-gray-50 dark:hover:bg-black/60",
        )}
      >
        {/* 角标 */}
        <div className="absolute top-0 right-0 p-3 opacity-30 font-mono text-[10px] text-cyan-600 dark:text-cyan-500 tracking-widest border-l border-b border-gray-100 dark:border-white/5 rounded-bl-lg">
          AUR-{String(index + 1).padStart(3, "0")}
        </div>

        {/* 左侧竖线装饰 */}
        <div className="absolute -left-[1px] top-8 h-12 w-[3px] bg-cyan-500/30 group-hover:h-24 group-hover:bg-cyan-500 transition-all duration-500" />

        <div className="flex flex-col h-full relative z-10">
          {/* 头部 */}
          <div className="flex items-start justify-between mb-5 pt-1">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 group-hover:border-cyan-500/30 transition-all duration-300 text-cyan-600 dark:text-cyan-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-mono group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors tracking-tight break-all">
                  {pkg.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span className="text-[10px] font-mono tracking-widest text-green-600 dark:text-green-400 uppercase">
                    {pkg.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 描述 */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed font-light pl-2 border-l border-gray-200 dark:border-white/10 group-hover:border-cyan-500/30 transition-colors">
            {pkg.description}
          </p>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {pkg.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-[10px] uppercase tracking-wider text-cyan-700 dark:text-cyan-300/80 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/30 rounded font-mono group-hover:text-cyan-600 dark:group-hover:text-cyan-300 group-hover:border-cyan-300 dark:group-hover:border-cyan-500/30 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 分隔线 + 链接 */}
          <div className="mt-auto space-y-4">
            <div className="h-px w-full bg-gray-200 dark:bg-white/10 group-hover:bg-cyan-500/30 transition-colors" />
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href={pkg.aurUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded hover:bg-cyan-100 dark:hover:bg-cyan-900/40 hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                AUR_PAGE
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href={pkg.upstreamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                UPSTREAM
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AurSection() {
  return (
    <section
      id="aur"
      className="py-32 relative section-bg overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-grid-cyber opacity-5 dark:opacity-10" />
      <div className="absolute inset-0 bg-scanline opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />
      <div className="absolute top-0 left-0 w-1/2 h-full bg-cyan-500/5 dark:bg-cyan-900/5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* 标题区域 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 opacity-0 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/10 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 tracking-widest">
                OPEN_SOURCE_CONTRIB
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono tracking-tighter">
              <span className="text-cyan-600 dark:text-cyan-400">
                AUR_PACKAGES
              </span>
            </h2>

            <p className="mt-4 text-gray-600 dark:text-gray-400 text-base max-w-xl leading-relaxed font-light">
              为 Arch Linux 用户维护的 AUR 软件包，让优质应用触手可及。
            </p>
          </div>

          <div className="font-mono text-sm text-gray-500 text-right hidden md:block">
            <div className="mb-1">{"//"} PACKAGE_REGISTRY</div>
            <div className="text-cyan-600 dark:text-cyan-500/50">
              {">>"} {aurPackages.length} PACKAGES MAINTAINED
            </div>
          </div>
        </div>

        {/* 安装提示横幅 */}
        <div className="opacity-0 animate-fade-in-up animation-delay-100 mb-10 max-w-6xl mx-auto">
          <div className="flex items-start gap-3 px-5 py-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-mono text-xs text-gray-500 dark:text-gray-400 overflow-x-auto">
            <Terminal className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div>
                <span className="text-cyan-600 dark:text-cyan-400">$</span>{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  yay -S zerx-lab-dida365-bin
                </span>
                <span className="ml-4 text-gray-400 dark:text-gray-600">
                  {"# 使用 yay 安装"}
                </span>
              </div>
              <div>
                <span className="text-cyan-600 dark:text-cyan-400">$</span>{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  paru -S zerx-lab-hexhub-bin
                </span>
                <span className="ml-4 text-gray-400 dark:text-gray-600">
                  {"# 使用 paru 安装"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 包卡片网格 */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {aurPackages.map((pkg, idx) => (
            <AurPackageCard key={pkg.name} pkg={pkg} index={idx} />
          ))}
        </div>

        {/* 底部链接 */}
        <div className="text-center mt-20 opacity-0 animate-fade-in animation-delay-500">
          <Link
            href="https://aur.archlinux.org/packages?K=sec-lab&SeB=m"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white dark:bg-black border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 transition-all rounded-full overflow-hidden hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          >
            <div className="absolute inset-0 bg-cyan-50 dark:bg-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Package className="w-5 h-5 text-cyan-600 dark:text-gray-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors relative z-10" />
            <span className="font-mono text-gray-800 dark:text-gray-300 tracking-widest text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors relative z-10">
              VIEW_ALL_AUR_PACKAGES
            </span>
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 dark:bg-white/5 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-500/20 transition-colors relative z-10">
              <ExternalLink className="w-3 h-3 text-cyan-600 dark:text-gray-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
