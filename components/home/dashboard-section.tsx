'use client';

import { cn } from '@/lib/cn';
import type { GitHubActivity, GitHubStats } from '@/lib/github';
import {
  Activity,
  Calendar,
  Flame,
  GitCommit,
  Star,
  GitFork,
  Users,
  Code2,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { useMemo } from 'react';

// 热力图颜色级别
const levelColors = {
  0: 'bg-gray-100 dark:bg-gray-800/50',
  1: 'bg-cyan-200 dark:bg-cyan-900/60',
  2: 'bg-cyan-400 dark:bg-cyan-700/80',
  3: 'bg-cyan-500 dark:bg-cyan-500',
  4: 'bg-cyan-600 dark:bg-cyan-400',
};

interface ContributionGraphProps {
  contributions: GitHubActivity['contributions'];
}

function ContributionGraph({ contributions }: ContributionGraphProps) {
  // 将贡献数据按周组织
  const weeks = useMemo(() => {
    const result: typeof contributions[] = [];
    for (let i = 0; i < contributions.length; i += 7) {
      result.push(contributions.slice(i, i + 7));
    }
    return result;
  }, [contributions]);

  // 月份标签
  const months = useMemo(() => {
    const monthLabels: { month: string; index: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      if (week.length > 0) {
        const date = new Date(week[0].date);
        const month = date.getMonth();
        if (month !== lastMonth) {
          monthLabels.push({
            month: date.toLocaleString('en-US', { month: 'short' }),
            index: weekIndex,
          });
          lastMonth = month;
        }
      }
    });

    return monthLabels;
  }, [weeks]);

  const dayLabels = ['Sun', '', 'Tue', '', 'Thu', '', 'Sat'];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-[720px]">
        {/* 月份标签 */}
        <div className="flex mb-2 pl-8">
          {months.map((m, i) => (
            <div
              key={`${m.month}-${i}`}
              className="text-[10px] font-mono text-gray-500 dark:text-gray-500"
              style={{
                marginLeft: i === 0 ? `${m.index * 13}px` : `${(m.index - months[i - 1].index - 4) * 13}px`,
              }}
            >
              {m.month}
            </div>
          ))}
        </div>

        <div className="flex gap-0.5">
          {/* 星期标签 */}
          <div className="flex flex-col gap-0.5 mr-2">
            {dayLabels.map((day, i) => (
              <div
                key={i}
                className="h-[11px] text-[9px] font-mono text-gray-400 dark:text-gray-600 flex items-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 热力图网格 */}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={cn(
                      'w-[11px] h-[11px] rounded-sm transition-all duration-200 hover:scale-125 hover:ring-1 hover:ring-cyan-500/50 cursor-pointer',
                      levelColors[day.level]
                    )}
                    title={`${day.date}: ${day.count} contributions`}
                  />
                ))}
                {/* 补齐不足7天的周 */}
                {week.length < 7 &&
                  Array(7 - week.length)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={`empty-${weekIndex}-${i}`}
                        className="w-[11px] h-[11px] rounded-sm bg-transparent"
                      />
                    ))}
              </div>
            ))}
          </div>
        </div>

        {/* 图例 */}
        <div className="flex items-center justify-end gap-2 mt-4 text-[10px] font-mono text-gray-500 dark:text-gray-500">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn('w-[11px] h-[11px] rounded-sm', levelColors[level as keyof typeof levelColors])}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
  delay?: number;
}

function StatCard({ icon, label, value, subValue, color = 'text-cyan-500', delay = 0 }: StatCardProps) {
  return (
    <div
      className="group relative bg-white dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-5 hover:border-cyan-500/50 transition-all duration-300 card-hover-lift opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gray-200 dark:border-white/10 group-hover:border-cyan-500/50 transition-colors" />

      <div className="flex items-start justify-between">
        <div className={cn('p-2 rounded-lg bg-gray-100 dark:bg-white/5', color)}>
          {icon}
        </div>
        {subValue && (
          <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600 tracking-widest">
            {subValue}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="text-3xl font-bold font-mono text-gray-900 dark:text-white tracking-tight">
          {value}
        </div>
        <div className="text-xs font-mono text-gray-500 dark:text-gray-500 tracking-wider mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}

interface DashboardSectionProps {
  activity: GitHubActivity;
  stats: GitHubStats;
}

export function DashboardSection({ activity, stats }: DashboardSectionProps) {
  const hasContributions = activity.contributions.length > 0;

  return (
    <section className="py-24 relative overflow-hidden section-bg selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="absolute inset-0 bg-grid-cyber opacity-5 dark:opacity-10" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 dark:bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* 标题区域 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 opacity-0 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/10 rounded-full backdrop-blur-sm">
              <Activity className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 tracking-widest">
                LIVE_METRICS
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono tracking-tighter">
              <span className="text-cyan-600 dark:text-cyan-400">DASHBOARD</span>
            </h2>
          </div>

          <div className="font-mono text-sm text-gray-500 text-right hidden md:block">
            <div className="mb-1">{'//'} REAL_TIME_SYNC</div>
            <div className="text-cyan-600 dark:text-cyan-500/50">
              {'>>'} DATA_STREAM_ACTIVE
            </div>
          </div>
        </div>

        {/* 统计卡片网格 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Star className="w-5 h-5" />}
            label="TOTAL_STARS"
            value={stats.totalStars}
            subValue="EARNED"
            color="text-yellow-500"
            delay={0.1}
          />
          <StatCard
            icon={<GitFork className="w-5 h-5" />}
            label="TOTAL_FORKS"
            value={stats.totalForks}
            subValue="REPOS"
            color="text-blue-500"
            delay={0.15}
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="FOLLOWERS"
            value={stats.followers}
            subValue="GITHUB"
            color="text-purple-500"
            delay={0.2}
          />
          <StatCard
            icon={<Code2 className="w-5 h-5" />}
            label="REPOSITORIES"
            value={stats.totalRepos}
            subValue="PUBLIC"
            color="text-cyan-500"
            delay={0.25}
          />
        </div>

        {/* 活动统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Flame className="w-5 h-5" />}
            label="CURRENT_STREAK"
            value={activity.currentStreak}
            subValue="DAYS"
            color="text-orange-500"
            delay={0.3}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="LONGEST_STREAK"
            value={activity.longestStreak}
            subValue="DAYS"
            color="text-green-500"
            delay={0.35}
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="THIS_WEEK"
            value={activity.thisWeekCommits}
            subValue="COMMITS"
            color="text-yellow-500"
            delay={0.4}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="THIS_MONTH"
            value={activity.thisMonthCommits}
            subValue="COMMITS"
            color="text-pink-500"
            delay={0.45}
          />
        </div>

        {/* GitHub 贡献热力图 */}
        {hasContributions && (
          <div
            className="bg-white dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-cyan-500">
                  <GitCommit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-gray-900 dark:text-white tracking-tight">
                    CONTRIBUTION_GRAPH
                  </h3>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-500">
                    {activity.totalContributions} contributions in the last year
                  </p>
                </div>
              </div>
            </div>

            <ContributionGraph contributions={activity.contributions} />
          </div>
        )}

        {/* 语言分布条 */}
        <div
          className="mt-8 bg-white dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-cyan-500">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-gray-900 dark:text-white tracking-tight">
                LANGUAGE_DISTRIBUTION
              </h3>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-500">
                Primary languages across repositories
              </p>
            </div>
          </div>

          <LanguageBar languages={stats.languages} />
        </div>
      </div>
    </section>
  );
}

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
  Shell: 'bg-gray-500',
};

function LanguageBar({ languages }: { languages: Record<string, number> }) {
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const total = sortedLanguages.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div>
      {/* 进度条 */}
      <div className="h-3 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-800/50 mb-4">
        {sortedLanguages.map(([lang, count]) => (
          <div
            key={lang}
            className={cn('h-full transition-all duration-500', languageBarColors[lang] || 'bg-gray-500')}
            style={{ width: `${(count / total) * 100}%` }}
            title={`${lang}: ${count} repos (${((count / total) * 100).toFixed(1)}%)`}
          />
        ))}
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4">
        {sortedLanguages.map(([lang, count]) => (
          <div key={lang} className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-sm', languageBarColors[lang] || 'bg-gray-500')} />
            <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
              {lang}
            </span>
            <span className="text-xs font-mono text-gray-400 dark:text-gray-600">
              {((count / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
