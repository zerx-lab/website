import {
  Code2,
  Github,
  Star,
  Users,
  Briefcase,
  Award,
  Cpu,
  Server,
  Layers,
  Brain,
  Cloud,
  Terminal,
  ExternalLink,
  GitFork,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { getGitHubData, type Repository, type GitHubStats } from '@/lib/github';

const coreSkills = [
  {
    icon: <Code2 className="w-6 h-6" />,
    name: 'TypeScript',
    level: 'Expert',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: <Server className="w-6 h-6" />,
    name: 'Go',
    level: 'Advanced',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    name: 'React/Next.js',
    level: 'Expert',
    color: 'text-blue-500 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    name: 'Rust',
    level: 'Intermediate',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    name: 'AI/LLM',
    level: 'Advanced',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
  {
    icon: <Cloud className="w-6 h-6" />,
    name: 'DevOps',
    level: 'Advanced',
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
  },
];

// 语言颜色配置
const languageBarColors: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  Go: 'bg-cyan-500',
  JavaScript: 'bg-yellow-500',
  'C#': 'bg-purple-500',
  Lua: 'bg-blue-400',
  Python: 'bg-green-500',
  Rust: 'bg-orange-500',
  Java: 'bg-red-500',
  HTML: 'bg-orange-400',
  CSS: 'bg-pink-500',
  Vue: 'bg-emerald-500',
};

// 项目颜色配置
const projectColors: Record<string, string> = {
  Go: 'text-cyan-600 dark:text-cyan-400',
  TypeScript: 'text-blue-600 dark:text-blue-400',
  JavaScript: 'text-yellow-600 dark:text-yellow-400',
  Rust: 'text-orange-600 dark:text-orange-400',
  Python: 'text-green-600 dark:text-green-400',
};

function getProjectColor(language: string | null): string {
  return language ? (projectColors[language] || 'text-gray-600 dark:text-gray-400') : 'text-gray-600 dark:text-gray-400';
}

function StatsSection({ stats, repoCount }: { stats: GitHubStats; repoCount: number }) {
  const displayStats = [
    { label: '开源项目', value: stats.totalRepos.toString(), icon: <Briefcase className="w-5 h-5" /> },
    { label: '总Star数', value: stats.totalStars.toString(), icon: <Star className="w-5 h-5" /> },
    { label: 'Followers', value: stats.followers.toString(), icon: <Users className="w-5 h-5" /> },
    { label: '有Star项目', value: repoCount.toString(), icon: <Award className="w-5 h-5" /> },
  ];

  return (
    <section className="py-16 relative section-bg border-t border-gray-200 dark:border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {displayStats.map((stat, idx) => (
            <div
              key={stat.label}
              className="group relative bg-white dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 hover:border-cyan-500/50 transition-all duration-300 card-hover-lift opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * idx}s` }}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold font-mono text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-mono tracking-wider">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjectsSection({ repositories }: { repositories: Repository[] }) {
  // 显示前4个项目
  const featuredProjects = repositories.slice(0, 4);

  return (
    <section className="py-24 relative section-bg border-t border-gray-200 dark:border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/30 rounded-full bg-cyan-50 dark:bg-cyan-900/10 mb-6 backdrop-blur-sm">
            <Award className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs font-mono text-cyan-700 dark:text-cyan-300 tracking-widest">
              FEATURED_WORK
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold font-mono tracking-tight mb-4">
            <span className="text-cyan-600 dark:text-cyan-400">精选项目</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            开源贡献与技术实践
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {featuredProjects.map((project, idx) => (
            <Link
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-8 hover:border-cyan-500/50 transition-all duration-300 card-hover-lift opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * idx}s` }}
            >
              <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-gray-200 dark:border-white/10 group-hover:border-cyan-500/50 transition-colors" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-gray-200 dark:border-white/10 group-hover:border-cyan-500/50 transition-colors" />

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    className={cn(
                      'text-2xl font-bold font-mono mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors',
                      getProjectColor(project.language)
                    )}
                  >
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    {project.language && (
                      <span className="flex items-center gap-1">
                        <Code2 className="w-4 h-4" />
                        {project.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {project.stars}
                    </span>
                    {project.forks > 0 && (
                      <span className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        {project.forks}
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-2">
                {project.description || 'No description available.'}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="text-xs font-mono px-2 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded text-gray-600 dark:text-gray-400"
                  >
                    {topic}
                  </span>
                ))}
                {project.language && project.topics.length === 0 && (
                  <span className="text-xs font-mono px-2 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded text-gray-600 dark:text-gray-400">
                    {project.language}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="https://github.com/zerx-lab?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 font-mono transition-all border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 card-hover-lift"
          >
            <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wider">查看全部项目</span>
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function LanguagesSection({ languages, totalRepos }: { languages: Record<string, number>; totalRepos: number }) {
  // 按数量排序，取前6个
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <section className="py-24 relative section-bg border-t border-gray-200 dark:border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/30 rounded-full bg-cyan-50 dark:bg-cyan-900/10 mb-6 backdrop-blur-sm">
            <Code2 className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs font-mono text-cyan-700 dark:text-cyan-300 tracking-widest">
              LANGUAGE_STATS
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold font-mono tracking-tight mb-4">
            <span className="text-cyan-600 dark:text-cyan-400">技术分布</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sortedLanguages.map(([lang, count], idx) => (
              <div
                key={lang}
                className="bg-white dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 hover:border-cyan-500/50 transition-all duration-300 card-hover-lift opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${0.05 * idx}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-mono text-gray-900 dark:text-white">
                    {lang}
                  </span>
                  <span className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400">
                    {count}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full transition-all duration-1000', languageBarColors[lang] || 'bg-gray-500')}
                    style={{
                      width: `${(count / totalRepos) * 100}%`,
                      animationDelay: `${0.1 * idx}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function AboutPage() {
  const githubData = await getGitHubData();
  const { repositories, stats } = githubData;

  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden section-bg selection:bg-cyan-500/30 selection:text-cyan-200">
        <div className="absolute inset-0 bg-grid-cyber opacity-[0.15] dark:opacity-[0.1]" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/30 rounded-full bg-cyan-50 dark:bg-cyan-900/10 mb-6 backdrop-blur-sm opacity-0 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-xs font-mono text-cyan-700 dark:text-cyan-300 tracking-widest">
                PROFILE_SYSTEM
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-mono tracking-tight mb-6 opacity-0 animate-slide-in-left animation-delay-100">
              <span className="text-gray-900 dark:text-white">关于</span>{' '}
              <span className="text-cyan-600 dark:text-cyan-400">我</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8 opacity-0 animate-fade-in-up animation-delay-200">
              全栈开发工程师，专注于构建高性能、高可用的现代化应用。
              拥有丰富的开源项目经验，在 TypeScript、Go、React 生态系统中积累了深厚的技术实力。
            </p>

            <Link
              href="https://github.com/zerx-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-mono transition-all border border-cyan-500/30 card-hover-lift opacity-0 animate-fade-in-up animation-delay-300"
            >
              <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="tracking-wider">VIEW_GITHUB</span>
              <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - 动态数据 */}
      <StatsSection stats={stats} repoCount={repositories.length} />

      {/* Core Skills Section */}
      <section className="py-24 relative overflow-hidden section-bg">
        <div className="absolute inset-0 bg-grid-cyber opacity-5 dark:opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/30 rounded-full bg-cyan-50 dark:bg-cyan-900/10 mb-6 backdrop-blur-sm">
              <Terminal className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-mono text-cyan-700 dark:text-cyan-300 tracking-widest">
                CORE_COMPETENCIES
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold font-mono tracking-tight mb-4">
              <span className="text-cyan-600 dark:text-cyan-400">核心技能</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              多年积累的技术栈与实战经验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {coreSkills.map((skill, idx) => (
              <div
                key={skill.name}
                className={cn(
                  'group relative bg-white dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 hover:border-cyan-500/50 transition-all duration-300 card-hover-lift opacity-0 animate-fade-in-up',
                  skill.bg
                )}
                style={{ animationDelay: `${0.1 * idx}s` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'p-3 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 group-hover:scale-110 transition-transform',
                      skill.color
                    )}
                  >
                    {skill.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-mono mb-1 text-gray-900 dark:text-white">
                      {skill.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono px-2 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded text-gray-600 dark:text-gray-400">
                        {skill.level}
                      </span>
                      {stats.languages[skill.name] && (
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {stats.languages[skill.name]} 项目
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section - 动态数据 */}
      <FeaturedProjectsSection repositories={repositories} />

      {/* Languages Distribution Section - 动态数据 */}
      <LanguagesSection languages={stats.languages} totalRepos={stats.totalRepos} />
    </main>
  );
}
