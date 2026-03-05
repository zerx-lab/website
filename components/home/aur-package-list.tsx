"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { AurPackage } from "@/lib/aur";
import {
  Package,
  ExternalLink,
  ArrowUpRight,
  CheckCircle2,
  Download,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

const MAX_VISIBLE = 9;

function AurPackageCard({ pkg, index }: { pkg: AurPackage; index: number }) {
  return (
    <div
      className="group relative opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${0.1 * (index % MAX_VISIBLE) + 0.1}s` }}
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
        <div className="absolute -left-px top-8 h-12 w-[3px] bg-cyan-500/30 group-hover:h-24 group-hover:bg-cyan-500 transition-all duration-500" />

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
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {pkg.status === "maintained" ? (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span className="text-[10px] font-mono tracking-widest text-green-600 dark:text-green-400 uppercase">
                        maintained
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      <span className="text-[10px] font-mono tracking-widest text-yellow-600 dark:text-yellow-400 uppercase">
                        outdated
                      </span>
                    </div>
                  )}
                  {pkg.version && (
                    <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600 tracking-wider">
                      v{pkg.version}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 描述 */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed font-light pl-2 border-l border-gray-200 dark:border-white/10 group-hover:border-cyan-500/30 transition-colors">
            {pkg.description}
          </p>

          {/* 标签 */}
          {pkg.tags.length > 0 && (
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
          )}

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

interface AurPackageListProps {
  packages: AurPackage[];
}

export function AurPackageList({ packages }: AurPackageListProps) {
  const [expanded, setExpanded] = useState(false);

  const total = packages.length;
  const hasMore = total > MAX_VISIBLE;
  const visiblePackages =
    hasMore && !expanded ? packages.slice(0, MAX_VISIBLE) : packages;

  return (
    <>
      {/* 包卡片网格 —— 一行 3 列 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {visiblePackages.map((pkg, idx) => (
          <AurPackageCard key={pkg.name} pkg={pkg} index={idx} />
        ))}
      </div>

      {/* 展开 / 收起按钮（仅当包数量 > MAX_VISIBLE 时显示） */}
      {hasMore && (
        <div className="text-center mt-10 max-w-6xl mx-auto">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="group relative inline-flex items-center gap-3 px-7 py-3 bg-white dark:bg-black border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 transition-all rounded-full overflow-hidden hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] font-mono text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <div className="absolute inset-0 bg-cyan-50 dark:bg-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 tracking-widest">
              {expanded ? "COLLAPSE_PACKAGES" : `SHOW_ALL_${total}_PACKAGES`}
            </span>
            <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 dark:bg-white/5 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-500/20 transition-colors">
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              )}
            </span>
          </button>
          {!expanded && (
            <p className="mt-3 text-xs font-mono text-gray-400 dark:text-gray-600 tracking-wider">
              {`// 还有 ${total - MAX_VISIBLE} 个包未展示`}
            </p>
          )}
        </div>
      )}
    </>
  );
}
