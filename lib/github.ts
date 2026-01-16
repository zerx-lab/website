interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

interface GitHubUser {
  public_repos: number;
  followers: number;
}

export interface Repository {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
}

export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  followers: number;
  languages: Record<string, number>;
}

export interface GitHubData {
  repositories: Repository[];
  stats: GitHubStats;
}

const OWNER = 'zerx-lab';

// 缓存时间：1 小时（更频繁地更新以保持实时性）
const REVALIDATE_SECONDS = 3600;

// 回退数据（API 失败时使用）
const FALLBACK_DATA: GitHubData = {
  repositories: [
    {
      name: 'wordZero',
      description: 'High-performance Go library for .docx manipulation. Supports read/write operations with zero dependencies.',
      url: 'https://github.com/zerx-lab/wordZero',
      stars: 612,
      forks: 42,
      language: 'Go',
      topics: ['go', 'docx', 'document'],
      updatedAt: new Date().toISOString(),
    },
    {
      name: 'PenBridge',
      description: 'Multi-platform content distribution system for automated publishing.',
      url: 'https://github.com/zerx-lab/PenBridge',
      stars: 15,
      forks: 2,
      language: 'TypeScript',
      topics: ['typescript', 'automation', 'publishing'],
      updatedAt: new Date().toISOString(),
    },
    {
      name: 'axon-ai',
      description: 'Autonomous AI agent framework for LLM-based workflow automation.',
      url: 'https://github.com/zerx-lab/axon-ai',
      stars: 8,
      forks: 1,
      language: 'TypeScript',
      topics: ['ai', 'llm', 'agents'],
      updatedAt: new Date().toISOString(),
    },
    {
      name: 'siyuan-share',
      description: 'SiYuan Note plugin for public sharing.',
      url: 'https://github.com/zerx-lab/siyuan-share',
      stars: 5,
      forks: 0,
      language: 'TypeScript',
      topics: ['plugin', 'siyuan'],
      updatedAt: new Date().toISOString(),
    },
  ],
  stats: {
    totalStars: 640,
    totalForks: 45,
    totalRepos: 24,
    followers: 9,
    languages: {
      TypeScript: 6,
      Go: 3,
      JavaScript: 1,
      'C#': 1,
      Lua: 1,
      Others: 12,
    },
  },
};

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'zerx-website',
  };

  // 支持可选的 Token（提高限额：60 -> 5000 请求/小时）
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchUserInfo(): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${OWNER}`, {
      headers: getHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      console.warn(`[GitHub API] Failed to fetch user info: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('[GitHub API] Error fetching user info:', error);
    return null;
  }
}

async function fetchAllRepos(): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  try {
    while (true) {
      const res = await fetch(
        `https://api.github.com/users/${OWNER}/repos?per_page=${perPage}&page=${page}&sort=pushed&direction=desc`,
        {
          headers: getHeaders(),
          next: { revalidate: REVALIDATE_SECONDS },
        }
      );

      if (!res.ok) {
        console.warn(`[GitHub API] Failed to fetch repos page ${page}: ${res.status}`);
        break;
      }

      const repos: GitHubRepo[] = await res.json();

      if (repos.length === 0) {
        break;
      }

      allRepos.push(...repos);

      // 如果返回的数量少于 perPage，说明已经是最后一页
      if (repos.length < perPage) {
        break;
      }

      page++;
    }

    return allRepos;
  } catch (error) {
    console.error('[GitHub API] Error fetching repos:', error);
    return [];
  }
}

export async function getGitHubData(): Promise<GitHubData> {
  try {
    // 并行获取用户信息和仓库列表
    const [userInfo, allRepos] = await Promise.all([
      fetchUserInfo(),
      fetchAllRepos(),
    ]);

    if (allRepos.length === 0) {
      console.warn('[GitHub API] No repos fetched, using fallback data');
      return FALLBACK_DATA;
    }

    // 筛选有 star 的非 fork、非归档仓库
    const starredRepos = allRepos
      .filter((repo) => repo.stargazers_count > 0 && !repo.fork && !repo.archived)
      .sort((a, b) => b.stargazers_count - a.stargazers_count);

    // 转换为 Repository 格式
    const repositories: Repository[] = starredRepos.map((repo) => ({
      name: repo.name,
      description: repo.description || '',
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      updatedAt: repo.pushed_at || repo.updated_at,
    }));

    // 计算语言统计（所有仓库，不只是有 star 的）
    const languageCount: Record<string, number> = {};
    for (const repo of allRepos) {
      if (repo.language && !repo.fork) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    }

    // 计算统计数据
    const totalStars = starredRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = starredRepos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const nonForkRepos = allRepos.filter((repo) => !repo.fork);

    const stats: GitHubStats = {
      totalStars,
      totalForks,
      totalRepos: nonForkRepos.length,
      followers: userInfo?.followers ?? FALLBACK_DATA.stats.followers,
      languages: languageCount,
    };

    return {
      repositories,
      stats,
    };
  } catch (error) {
    console.error('[GitHub API] Error in getGitHubData:', error);
    return FALLBACK_DATA;
  }
}

// 为了向后兼容，保留原有的类型和函数
export interface RepoStars {
  [repoName: string]: {
    stars: number;
    forks?: number;
  };
}

export async function getGitHubStars(): Promise<RepoStars> {
  const data = await getGitHubData();
  const result: RepoStars = {};

  for (const repo of data.repositories) {
    result[repo.name] = {
      stars: repo.stars,
      forks: repo.forks,
    };
  }

  return result;
}

// GitHub Events API 用于活动统计
interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubActivity {
  contributions: ContributionDay[];
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  thisWeekCommits: number;
  thisMonthCommits: number;
}

// 生成过去一年的贡献数据（基于 events API）
async function fetchUserEvents(): Promise<GitHubEvent[]> {
  const allEvents: GitHubEvent[] = [];

  try {
    // GitHub Events API 最多返回 300 个事件，分页获取
    for (let page = 1; page <= 3; page++) {
      const res = await fetch(
        `https://api.github.com/users/${OWNER}/events/public?per_page=100&page=${page}`,
        {
          headers: getHeaders(),
          next: { revalidate: REVALIDATE_SECONDS },
        }
      );

      if (!res.ok) {
        console.warn(`[GitHub API] Failed to fetch events page ${page}: ${res.status}`);
        break;
      }

      const events: GitHubEvent[] = await res.json();
      if (events.length === 0) break;
      allEvents.push(...events);
    }

    return allEvents;
  } catch (error) {
    console.error('[GitHub API] Error fetching events:', error);
    return [];
  }
}

// 根据事件生成贡献热力图数据
function generateContributionData(events: GitHubEvent[]): ContributionDay[] {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // 统计每天的事件数量
  const dailyCounts: Record<string, number> = {};

  for (const event of events) {
    const date = event.created_at.split('T')[0];
    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
  }

  // 生成过去一年的所有日期
  const contributions: ContributionDay[] = [];
  const current = new Date(oneYearAgo);

  // 从上一个周日开始
  current.setDate(current.getDate() - current.getDay());

  while (current <= today) {
    const dateStr = current.toISOString().split('T')[0];
    const count = dailyCounts[dateStr] || 0;

    // 计算活跃级别 (0-4)
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0) level = 1;
    if (count >= 3) level = 2;
    if (count >= 6) level = 3;
    if (count >= 10) level = 4;

    contributions.push({
      date: dateStr,
      count,
      level,
    });

    current.setDate(current.getDate() + 1);
  }

  return contributions;
}

// 计算连续贡献天数
function calculateStreaks(contributions: ContributionDay[]): { current: number; longest: number } {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date().toISOString().split('T')[0];
  const reversedContributions = [...contributions].reverse();

  // 计算当前连续天数
  for (const day of reversedContributions) {
    if (day.date > today) continue;
    if (day.count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // 计算最长连续天数
  for (const day of contributions) {
    if (day.count > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { current: currentStreak, longest: longestStreak };
}

export async function getGitHubActivity(): Promise<GitHubActivity> {
  try {
    const events = await fetchUserEvents();
    const contributions = generateContributionData(events);
    const { current, longest } = calculateStreaks(contributions);

    // 计算本周和本月的提交数
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    let thisWeekCommits = 0;
    let thisMonthCommits = 0;

    for (const day of contributions) {
      const date = new Date(day.date);
      if (date >= weekAgo) thisWeekCommits += day.count;
      if (date >= monthAgo) thisMonthCommits += day.count;
    }

    const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);

    return {
      contributions,
      totalContributions,
      currentStreak: current,
      longestStreak: longest,
      thisWeekCommits,
      thisMonthCommits,
    };
  } catch (error) {
    console.error('[GitHub API] Error in getGitHubActivity:', error);
    // 返回空数据
    return {
      contributions: [],
      totalContributions: 0,
      currentStreak: 0,
      longestStreak: 0,
      thisWeekCommits: 0,
      thisMonthCommits: 0,
    };
  }
}
