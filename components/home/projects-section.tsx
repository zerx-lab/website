import { cn } from '@/lib/cn';
import type { Repository } from '@/lib/github';
import { Github, Star, ArrowUpRight, Terminal, ArrowRight, GitFork } from 'lucide-react';
import Link from 'next/link';

// 语言对应的颜色配置
const languageColors: Record<string, { text: string; bg: string }> = {
  Go: { text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  TypeScript: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  JavaScript: { text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  Rust: { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  Python: { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
  'C#': { text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  Lua: { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
};

const defaultColor = { text: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-900/20' };

function getLanguageColor(language: string | null) {
  return language ? (languageColors[language] || defaultColor) : defaultColor;
}

function formatTopics(topics: string[]): string[] {
  // 转换为大写下划线格式，最多显示4个
  return topics.slice(0, 4).map((topic) =>
    topic.toUpperCase().replace(/-/g, '_')
  );
}

function ProjectCard({ repo, index, isFeatured }: { repo: Repository; index: number; isFeatured: boolean }) {
  const langColor = getLanguageColor(repo.language);
  const topics = formatTopics(repo.topics);

  return (
    <Link
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block h-full group relative",
        isFeatured ? "md:col-span-2" : "md:col-span-1"
      )}
    >
      <div
        className={cn(
          "relative h-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 p-6 sm:p-8 transition-all duration-500 overflow-hidden rounded-xl backdrop-blur-sm card-hover-lift",
          "hover:border-cyan-500/30 hover:bg-gray-50 dark:hover:bg-black/60",
          isFeatured && "bg-cyan-50/50 dark:bg-cyan-900/10"
        )}
        style={{ animationDelay: `${0.1 * index}s` }}
      >
        <div className="absolute top-0 right-0 p-4 opacity-30 font-mono text-[10px] text-cyan-600 dark:text-cyan-500 tracking-widest border-l border-b border-gray-100 dark:border-white/5 rounded-bl-lg">
          PRJ-{String(index + 1).padStart(3, '0')} // {isFeatured ? 'PRIORITY_HIGH' : 'STANDARD'}
        </div>

        <div className="absolute -left-[1px] top-8 h-12 w-[3px] bg-cyan-500/30 group-hover:h-24 group-hover:bg-cyan-500 transition-all duration-500" />

        <div className="flex flex-col h-full relative z-10">
          <div className="flex items-start justify-between mb-6 pt-2">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-2.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 group-hover:border-cyan-500/30 transition-all duration-300",
                isFeatured ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500 dark:text-gray-400"
              )}>
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-mono group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors tracking-tight">
                  {repo.name}
                </h3>
                {repo.language && (
                  <span className={cn("text-[10px] font-mono tracking-widest", langColor.text)}>
                    {repo.language.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pr-12 md:pr-0">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/30 px-2.5 py-1 rounded border border-cyan-200 dark:border-cyan-500/20">
                <Star className="w-3 h-3 fill-cyan-200 dark:fill-cyan-900/50" />
                {repo.stars}
              </span>
              {repo.forks > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-mono text-gray-500 dark:text-gray-400">
                  <GitFork className="w-3 h-3" />
                  {repo.forks}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-8 leading-relaxed font-light pl-2 border-l border-gray-200 dark:border-white/10 group-hover:border-cyan-500/30 transition-colors line-clamp-2">
            {repo.description || 'No description available.'}
          </p>

          <div className="mt-auto space-y-4">
            <div className="h-px w-full bg-gray-200 dark:bg-white/10 group-hover:bg-cyan-500/30 transition-colors" />
            <div className="flex flex-wrap gap-2">
              {topics.length > 0 ? (
                topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 text-[10px] uppercase tracking-wider text-cyan-700 dark:text-cyan-300/80 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/30 rounded font-mono group-hover:text-cyan-600 dark:group-hover:text-cyan-300 group-hover:border-cyan-300 dark:group-hover:border-cyan-500/30 transition-colors"
                  >
                    {topic}
                  </span>
                ))
              ) : (
                repo.language && (
                  <span className="px-2 py-1 text-[10px] uppercase tracking-wider text-cyan-700 dark:text-cyan-300/80 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/30 rounded font-mono">
                    {repo.language.toUpperCase()}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ProjectsSectionProps {
  repositories: Repository[];
  maxDisplay?: number;
}

export function ProjectsSection({ repositories, maxDisplay = 6 }: ProjectsSectionProps) {
  // 显示前 maxDisplay 个仓库
  const displayRepos = repositories.slice(0, maxDisplay);
  const repoCount = repositories.length;

  return (
    <section id="projects" className="py-32 relative section-bg overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="absolute inset-0 bg-grid-cyber opacity-5 dark:opacity-10" />
      <div className="absolute inset-0 bg-scanline opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />

      <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-500/5 dark:bg-cyan-900/5 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 opacity-0 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/10 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 tracking-widest">SECURE_ARCHIVE</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono tracking-tighter">
              <span className="text-cyan-600 dark:text-cyan-400">
                MISSION_LOGS
              </span>
            </h2>
          </div>

          <div className="font-mono text-sm text-gray-500 text-right hidden md:block">
            <div className="mb-1">{'//'} ACCESSING REPOSITORY...</div>
            <div className="text-cyan-600 dark:text-cyan-500/50">{'>>'} {repoCount} PROJECTS FOUND</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {displayRepos.map((repo, idx) => (
            <div
              key={repo.name}
              className={cn(
                "opacity-0 animate-fade-in-up",
                idx === 0 && "md:col-span-2"
              )}
              style={{ animationDelay: `${0.1 * idx}s` }}
            >
              <ProjectCard repo={repo} index={idx} isFeatured={idx === 0} />
            </div>
          ))}
        </div>

        <div className="text-center mt-20 opacity-0 animate-fade-in animation-delay-500">
          <Link
            href="https://github.com/zerx-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white dark:bg-black border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 transition-all rounded-full overflow-hidden hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          >
            <div className="absolute inset-0 bg-cyan-50 dark:bg-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <Github className="w-5 h-5 text-cyan-600 dark:text-gray-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors relative z-10" />
            <span className="font-mono text-gray-800 dark:text-gray-300 tracking-widest text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors relative z-10">
              ACCESS_FULL_DATABASE
            </span>
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 dark:bg-white/5 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-500/20 transition-colors relative z-10">
              <ArrowRight className="w-3 h-3 text-cyan-600 dark:text-gray-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
