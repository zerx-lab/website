interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
}

export interface RepoStars {
  [repoName: string]: {
    stars: number;
    forks?: number;
  };
}

// 回退值（API 失败时使用）
const FALLBACK_STARS: RepoStars = {
  wordZero: { stars: 612, forks: 42 },
  PenBridge: { stars: 15 },
  'axon-ai': { stars: 8 },
  'siyuan-share': { stars: 5 },
};

const OWNER = 'zerx-lab';
const REPOS = ['wordZero', 'PenBridge', 'axon-ai', 'siyuan-share'] as const;

// 缓存时间：24 小时
const REVALIDATE_SECONDS = 86400;

export async function getGitHubStars(): Promise<RepoStars> {
  const results: RepoStars = {};

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'zerx-website',
  };

  // 支持可选的 Token（提高限额）
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const fetchPromises = REPOS.map(async (repo) => {
    try {
      const res = await fetch(`https://api.github.com/repos/${OWNER}/${repo}`, {
        headers,
        next: { revalidate: REVALIDATE_SECONDS },
      });

      if (!res.ok) {
        console.warn(`[GitHub API] Failed to fetch ${repo}: ${res.status}`);
        return { repo, data: FALLBACK_STARS[repo] };
      }

      const data: GitHubRepo = await res.json();
      return {
        repo,
        data: {
          stars: data.stargazers_count,
          forks: data.forks_count,
        },
      };
    } catch (error) {
      console.error(`[GitHub API] Error fetching ${repo}:`, error);
      return { repo, data: FALLBACK_STARS[repo] };
    }
  });

  const responses = await Promise.all(fetchPromises);

  for (const { repo, data } of responses) {
    results[repo] = data;
  }

  return results;
}
