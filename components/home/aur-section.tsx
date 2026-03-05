import { getAurPackages } from "@/lib/aur";
import { AurPackageList } from "@/components/home/aur-package-list";
import { Package, ExternalLink, Terminal } from "lucide-react";
import Link from "next/link";

export async function AurSection() {
  const packages = await getAurPackages();

  // 取前两个包名用于安装示例横幅
  const examplePkgs = packages.slice(0, 2);

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
              {">>"} {packages.length} PACKAGES MAINTAINED
            </div>
          </div>
        </div>

        {/* 安装提示横幅 */}
        {examplePkgs.length > 0 && (
          <div className="opacity-0 animate-fade-in-up animation-delay-100 mb-10 max-w-6xl mx-auto">
            <div className="flex items-start gap-3 px-5 py-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-mono text-xs text-gray-500 dark:text-gray-400 overflow-x-auto">
              <Terminal className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                {examplePkgs[0] && (
                  <div>
                    <span className="text-cyan-600 dark:text-cyan-400">$</span>{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      yay -S {examplePkgs[0].name}
                    </span>
                    <span className="ml-4 text-gray-400 dark:text-gray-600">
                      {"# 使用 yay 安装"}
                    </span>
                  </div>
                )}
                {examplePkgs[1] && (
                  <div>
                    <span className="text-cyan-600 dark:text-cyan-400">$</span>{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      paru -S {examplePkgs[1].name}
                    </span>
                    <span className="ml-4 text-gray-400 dark:text-gray-600">
                      {"# 使用 paru 安装"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 包卡片列表（客户端组件，处理展开/收起交互） */}
        <AurPackageList packages={packages} />

        {/* 底部链接 */}
        <div className="text-center mt-16 opacity-0 animate-fade-in animation-delay-500">
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
