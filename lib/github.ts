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
