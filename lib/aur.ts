// AUR RPC v5 接口：获取 sec-lab 维护的包列表
// 缓存 12 小时（Next.js fetch revalidate）

const AUR_MAINTAINER = 'sec-lab';
const REVALIDATE_SECONDS = 12 * 60 * 60; // 12 小时

// AUR RPC v5 返回的原始包数据结构
interface AurRpcPackage {
  ID: number;
  Name: string;
  PackageBase: string;
  PackageBaseID: number;
  Version: string;
  Description: string;
  URL: string;
  URLPath: string;
  Maintainer: string;
  NumVotes: number;
  Popularity: number;
  OutOfDate: number | null;
  FirstSubmitted: number;
  LastModified: number;
}

interface AurRpcResponse {
  version: number;
  type: string;
  resultcount: number;
  results: AurRpcPackage[];
  error?: string;
}

// 对外暴露的包数据结构
export interface AurPackage {
  name: string;
  description: string;
  version: string;
  aurUrl: string;
  upstreamUrl: string;
  status: 'maintained' | 'outdated';
  numVotes: number;
  popularity: number;
  lastModified: number;
  tags: string[];
}

// 根据包名推断标签
function inferTags(name: string, description: string): string[] {
  const tags: string[] = [];
  const nameLower = name.toLowerCase();
  const descLower = description.toLowerCase();

  // 预编译二进制包
  if (nameLower.endsWith('-bin')) {
    tags.push('BIN');
  }

  // 语言 / 运行时特征
  if (descLower.includes('rust') || descLower.includes('rust-driven') || descLower.includes('rust 驱动')) {
    tags.push('RUST');
  }
  if (descLower.includes('electron')) {
    tags.push('ELECTRON');
  }
  if (descLower.includes('go ') || descLower.includes('golang')) {
    tags.push('GO');
  }

  // 功能分类
  if (
    descLower.includes('todo') ||
    descLower.includes('task') ||
    descLower.includes('清单') ||
    descLower.includes('ticktick') ||
    descLower.includes('dida')
  ) {
    tags.push('PRODUCTIVITY');
  }
  if (
    descLower.includes('git') ||
    descLower.includes('github') ||
    descLower.includes('version control')
  ) {
    tags.push('GIT');
  }
  if (
    descLower.includes('download') ||
    descLower.includes('下载') ||
    descLower.includes('bittorrent') ||
    descLower.includes('ftp') ||
    descLower.includes('http')
  ) {
    tags.push('DOWNLOAD');
  }
  if (
    descLower.includes('database') ||
    descLower.includes('docker') ||
    descLower.includes('ssh') ||
    descLower.includes('sftp') ||
    descLower.includes('devops') ||
    descLower.includes('运维')
  ) {
    tags.push('DEVOPS');
  }
  if (
    descLower.includes('developer') ||
    descLower.includes('开发') ||
    descLower.includes('程序员')
  ) {
    tags.push('DEVELOPER');
  }

  // 去重，最多返回 4 个标签
  return [...new Set(tags)].slice(0, 4);
}

// 将 AUR RPC 原始数据转换为统一格式
function transformPackage(pkg: AurRpcPackage): AurPackage {
  return {
    name: pkg.Name,
    description: pkg.Description ?? '',
    version: pkg.Version ?? '',
    aurUrl: `https://aur.archlinux.org/packages/${pkg.Name}`,
    upstreamUrl: pkg.URL ?? `https://aur.archlinux.org/packages/${pkg.Name}`,
    status: pkg.OutOfDate ? 'outdated' : 'maintained',
    numVotes: pkg.NumVotes ?? 0,
    popularity: pkg.Popularity ?? 0,
    lastModified: pkg.LastModified ?? 0,
    tags: inferTags(pkg.Name, pkg.Description ?? ''),
  };
}

// 回退数据：API 不可用时展示已知包
const FALLBACK_PACKAGES: AurPackage[] = [
  {
    name: 'zerx-lab-dida365-bin',
    description: '滴答清单（Dida365/TickTick）Linux 桌面客户端，由 sec-lab 打包维护的 AUR 预编译二进制包。',
    version: '8.0.0-1',
    aurUrl: 'https://aur.archlinux.org/packages/zerx-lab-dida365-bin',
    upstreamUrl: 'https://www.dida365.com',
    status: 'maintained',
    numVotes: 0,
    popularity: 0,
    lastModified: 0,
    tags: ['BIN', 'PRODUCTIVITY', 'ELECTRON'],
  },
  {
    name: 'zerx-lab-hexhub-bin',
    description: 'HexHub Git 桌面客户端 Linux 版本，由 sec-lab 打包维护的 AUR 预编译二进制包。',
    version: '1.3.1-1',
    aurUrl: 'https://aur.archlinux.org/packages/zerx-lab-hexhub-bin',
    upstreamUrl: 'https://www.hexhub.cn',
    status: 'maintained',
    numVotes: 0,
    popularity: 0,
    lastModified: 0,
    tags: ['BIN', 'GIT', 'DEVELOPER'],
  },
  {
    name: 'zerx-lab-fluxdown-bin',
    description: 'FluxDown - Rust 驱动的多协议下载管理器（HTTP/FTP/BitTorrent）。',
    version: '0.1.26-1',
    aurUrl: 'https://aur.archlinux.org/packages/zerx-lab-fluxdown-bin',
    upstreamUrl: 'https://fluxdown.zerx.dev',
    status: 'maintained',
    numVotes: 0,
    popularity: 0,
    lastModified: 0,
    tags: ['BIN', 'RUST', 'DOWNLOAD'],
  },
];

export async function getAurPackages(): Promise<AurPackage[]> {
  try {
    const url = `https://aur.archlinux.org/rpc/v5/search/${AUR_MAINTAINER}?by=maintainer`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'zerx-lab-website/1.0 (https://zerx.dev)',
        Accept: 'application/json',
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      console.warn(`[AUR API] 请求失败，状态码：${res.status}，使用回退数据`);
      return FALLBACK_PACKAGES;
    }

    const data: AurRpcResponse = await res.json();

    if (data.error) {
      console.warn(`[AUR API] 接口返回错误：${data.error}，使用回退数据`);
      return FALLBACK_PACKAGES;
    }

    if (!data.results || data.results.length === 0) {
      console.warn('[AUR API] 未查询到任何包，使用回退数据');
      return FALLBACK_PACKAGES;
    }

    // 按最后修改时间降序排列（最新修改的排在前面）
    const sorted = [...data.results].sort((a, b) => b.LastModified - a.LastModified);

    return sorted.map(transformPackage);
  } catch (error) {
    console.error('[AUR API] 获取包列表异常：', error);
    return FALLBACK_PACKAGES;
  }
}
