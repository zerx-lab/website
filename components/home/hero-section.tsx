import { CodeDemo } from './code-demo';
import { CodeRainBackground } from './code-rain-bg';
import { ArrowRight, Github, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-grid-pattern" />
      <CodeRainBackground />
      
      <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col gap-6 opacity-0 animate-fade-in-up">
            <Link 
              href="/docs"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fd-accent/80 hover:bg-fd-accent text-fd-foreground text-sm font-medium w-fit transition-colors border border-fd-border/50"
            >
              <Sparkles className="w-4 h-4 text-fd-primary" />
              <span>技术文档已上线</span>
              <ArrowRight className="w-3.5 h-3.5 text-fd-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-gradient-primary">zerx</span>
              <span className="text-fd-foreground">.dev</span>
            </h1>

            <p className="text-lg sm:text-xl text-fd-muted-foreground max-w-lg leading-relaxed">
              全栈开发者的技术空间。探索现代 Web 开发、构建高质量开源项目、分享技术实践与心得。
            </p>

            <div className="flex flex-wrap gap-4 mt-2 opacity-0 animate-fade-in animation-delay-200">
              <Link
                href="/docs"
                className={cn(
                  'btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium'
                )}
              >
                查看文档
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="https://github.com/zerx-lab"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'btn-secondary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-fd-foreground font-medium'
                )}
              >
                <Github className="w-5 h-5" />
                GitHub
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-4 text-sm text-fd-muted-foreground opacity-0 animate-fade-in animation-delay-300">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-fd-foreground">600+</span>
                <span>Stars</span>
              </div>
              <div className="w-px h-4 bg-fd-border" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-fd-foreground">TypeScript</span>
                <span>优先</span>
              </div>
              <div className="w-px h-4 bg-fd-border" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-fd-foreground">Go & Rust</span>
                <span>后端</span>
              </div>
            </div>
          </div>

          <div className="lg:pl-8 opacity-0 animate-fade-in-up animation-delay-200">
            <CodeDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
