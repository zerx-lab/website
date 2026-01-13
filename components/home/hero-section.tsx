import { CodeDemo } from './code-demo';
import { CodeRainBackground } from './code-rain-bg';
import { ArrowRight, Github, Terminal, Cpu, Activity, Command, ExternalLink, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden section-bg selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.15] dark:opacity-[0.1]" />
      <div className="absolute inset-0 bg-scanline opacity-[0.02] dark:opacity-[0.05] z-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-blue-500/5 dark:bg-blue-600/10 blur-[150px]" />
      </div>
      
      <div className="dark:block hidden">
        <CodeRainBackground />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col gap-8 relative">
            <div className="animate-slide-in-left opacity-0">
              <Link 
                href="/docs"
                className="group inline-flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-black/40 backdrop-blur-md border border-gray-200 dark:border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 w-fit rounded-sm"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 tracking-widest">SYSTEM_STATUS: ONLINE</span>
                <ChevronRight className="w-3 h-3 text-cyan-600 group-hover:translate-x-0.5 group-hover:text-cyan-500 transition-all" />
              </Link>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] font-mono">
                <span className="block opacity-0 animate-slide-in-left animation-delay-100 text-gray-900 dark:text-white">
                  ZERX_
                </span>
                <span className="block text-cyan-600 dark:text-cyan-400 opacity-0 animate-slide-in-left animation-delay-200 animate-glitch">
                  LAB
                </span>
              </h1>
              
              <div className="flex items-center gap-4 opacity-0 animate-fade-in animation-delay-300">
                <div className="h-px w-12 bg-cyan-500/50" />
                <span className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 font-mono tracking-widest">
                  // FULL_STACK_DEV
                </span>
              </div>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed font-light pl-6 border-l-2 border-cyan-500/20 opacity-0 animate-fade-in-up animation-delay-400">
                <span className="text-cyan-600 dark:text-cyan-500 font-mono text-xs block mb-3 tracking-widest">
                  {'>'} INITIATING_PROTOCOL...
                </span>
                构建 <span className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-500 transition-colors cursor-default">高性能</span> 应用,
                探索 <span className="text-cyan-600 dark:text-cyan-400 font-medium hover:text-cyan-500 transition-colors cursor-default">现代</span> 技术架构,
                分享 <span className="text-teal-600 dark:text-teal-400 font-medium hover:text-teal-500 transition-colors cursor-default">核心</span> 技术洞见。
                致力于打造极致的用户体验与代码质量。
              </p>
            </div>

            <div className="flex flex-wrap gap-5 opacity-0 animate-fade-in-up animation-delay-500 pt-4">
              <Link
                href="/docs"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-mono text-lg transition-all border border-cyan-500/30 overflow-hidden card-hover-lift"
              >
                <span className="absolute inset-0 w-0 bg-cyan-500/10 group-hover:w-full transition-all duration-300 ease-out" />
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <Terminal className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10 tracking-wider">EXECUTE_DOCS</span>
              </Link>
              
              <Link
                href="https://github.com/zerx-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 font-mono text-lg transition-all border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 card-hover-lift"
              >
                <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="tracking-wider">ACCESS_REPO</span>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6 opacity-0 animate-fade-in animation-delay-600">
              {[
                { label: 'TS_RUNTIME', status: 'ACTIVE', color: 'bg-blue-500' },
                { label: 'RUST_CORE', status: 'ONLINE', color: 'bg-orange-500' },
                { label: 'GO_SERVICE', status: 'READY', color: 'bg-cyan-500' }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-[10px] font-mono text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20 transition-colors cursor-default rounded-sm">
                  <div className={`w-1.5 h-1.5 ${item.color} rounded-full animate-pulse`} />
                  <span>{item.label}: <span className="text-gray-700 dark:text-gray-300">{item.status}</span></span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative opacity-0 animate-fade-in-scale animation-delay-300 hidden lg:block">
             <div className="absolute inset-0 bg-cyan-500/10 dark:bg-cyan-500/20 blur-3xl -z-10 rounded-full opacity-40" />
             
             <div className="absolute -top-12 -right-12 text-gray-200 dark:text-cyan-900/20 animate-float pointer-events-none select-none">
               <Cpu size={120} strokeWidth={1} />
             </div>
             <div className="absolute -bottom-8 -left-8 text-gray-200 dark:text-blue-900/20 animate-float animation-delay-500 pointer-events-none select-none">
               <Command size={100} strokeWidth={1} />
             </div>

             <div className="relative z-10 transform transition-transform hover:scale-[1.02] duration-500">
                <div className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-cyan-900/20">
                  <CodeDemo />
                </div>
                
                <div className="absolute -z-10 top-1/2 -right-4 w-20 h-[1px] bg-cyan-500/30" />
                <div className="absolute -z-10 top-1/2 -right-4 w-1 h-20 bg-cyan-500/30" />
                <div className="absolute -bottom-4 right-10 text-[10px] font-mono text-gray-400 dark:text-cyan-500/40">
                  // RENDER_ENGINE_V2.0
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
