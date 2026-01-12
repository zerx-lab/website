import { cn } from '@/lib/cn';
import { ExternalLink, Github, Star, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Project {
  name: string;
  description: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  stars?: number;
}

const projects: Project[] = [
  {
    name: 'wordZero',
    description: '使用 Go 语言操作 Word 文档的高性能库，支持创建、读取、修改 .docx 文件',
    tags: ['Go', 'Word', 'Document'],
    githubUrl: 'https://github.com/zerx-lab/wordZero',
    stars: 612,
  },
  {
    name: 'PenBridge',
    description: '一键发布多个平台文章，支持微信公众号、掘金、知乎等主流平台同步发布',
    tags: ['TypeScript', 'Automation', 'Publishing'],
    githubUrl: 'https://github.com/zerx-lab/PenBridge',
    stars: 15,
  },
  {
    name: 'axon-ai',
    description: 'AI 智能体框架，用于构建和部署基于大语言模型的自动化工作流',
    tags: ['TypeScript', 'AI', 'LLM'],
    githubUrl: 'https://github.com/zerx-lab/axon-ai',
    stars: 8,
  },
  {
    name: 'siyuan-share',
    description: '思源笔记分享插件，支持将笔记一键分享为公开可访问的网页',
    tags: ['TypeScript', 'SiYuan', 'Plugin'],
    githubUrl: 'https://github.com/zerx-lab/siyuan-share',
    stars: 5,
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div
        className="feature-card group relative p-6 rounded-xl opacity-0 animate-fade-in-up cursor-pointer"
        style={{ animationDelay: `${0.1 * index}s` }}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors">
            {project.name}
          </h3>
          <div className="flex items-center gap-2">
            {project.stars !== undefined && project.stars > 0 && (
              <span className="inline-flex items-center gap-1 text-sm text-fd-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                {project.stars}
              </span>
            )}
            <ArrowUpRight className="w-4 h-4 text-fd-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <p className="text-fd-muted-foreground text-sm mb-4 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs rounded-full bg-fd-primary/10 text-fd-primary font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="absolute inset-0 bg-hero-gradient opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-fd-foreground mb-4">
            开源项目
          </h2>
          <p className="text-fd-muted-foreground text-lg max-w-2xl mx-auto">
            持续构建有价值的开源工具与应用
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {projects.map((project, idx) => (
            <ProjectCard key={project.name} project={project} index={idx} />
          ))}
        </div>

        <div className="text-center mt-12 opacity-0 animate-fade-in animation-delay-500">
          <Link
            href="https://github.com/zerx-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-fd-foreground font-medium"
          >
            <Github className="w-5 h-5" />
            查看更多项目
          </Link>
        </div>
      </div>
    </section>
  );
}
