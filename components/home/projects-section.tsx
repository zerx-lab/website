import { cn } from '@/lib/cn';
import type { RepoStars } from '@/lib/github';
import { Github, Star, ArrowUpRight, Terminal, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Project {
  name: string;
  description: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  stars?: number;
  forks?: number;
  id: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 'PRJ-001',
    name: 'wordZero',
    description: 'High-performance Go library for .docx manipulation. Supports read/write operations with zero dependencies. Optimized for cloud-native environments.',
    tags: ['GO_LANG', 'DOCUMENT_PARSER', 'IO_STREAM', 'ZERO_DEPENDENCY'],
    githubUrl: 'https://github.com/zerx-lab/wordZero',
    featured: true
  },
  {
    id: 'PRJ-002',
    name: 'PenBridge',
    description: 'Multi-platform content distribution system. Synchronizes articles across WeChat, Juejin, and Zhihu with automated formatting adaptation.',
    tags: ['TYPESCRIPT', 'AUTOMATION_BOT', 'PUBLISHING_PIPELINE'],
    githubUrl: 'https://github.com/zerx-lab/PenBridge',
  },
  {
    id: 'PRJ-003',
    name: 'axon-ai',
    description: 'Autonomous AI agent framework for constructing LLM-based workflow automation systems with self-correcting capabilities.',
    tags: ['LLM_ORCHESTRATION', 'AGENTS', 'WORKFLOW_ENGINE'],
    githubUrl: 'https://github.com/zerx-lab/axon-ai',
  },
  {
    id: 'PRJ-004',
    name: 'siyuan-share',
    description: 'SiYuan Note plugin for public sharing. Exposes local notes as accessible web endpoints with customizable themes.',
    tags: ['PLUGIN_ARCH', 'NOTE_SYNC', 'WEB_INTERFACE'],
    githubUrl: 'https://github.com/zerx-lab/siyuan-share',
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block h-full group relative",
        project.featured ? "md:col-span-2" : "md:col-span-1"
      )}
    >
      <div
        className={cn(
          "relative h-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 p-6 sm:p-8 transition-all duration-500 overflow-hidden rounded-xl backdrop-blur-sm card-hover-lift",
          "hover:border-cyan-500/30 hover:bg-gray-50 dark:hover:bg-black/60",
          project.featured && "bg-cyan-50 dark:bg-cyan-900/10"
        )}
        style={{ animationDelay: `${0.1 * index}s` }}
      >
        <div className="absolute top-0 right-0 p-4 opacity-30 font-mono text-[10px] text-cyan-600 dark:text-cyan-500 tracking-widest border-l border-b border-gray-100 dark:border-white/5 rounded-bl-lg">
          {project.id} // {project.featured ? 'PRIORITY_HIGH' : 'STANDARD'}
        </div>
        
        <div className="absolute -left-[1px] top-8 h-12 w-[3px] bg-cyan-500/30 group-hover:h-24 group-hover:bg-cyan-500 transition-all duration-500" />
        
        <div className="flex flex-col h-full relative z-10">
          <div className="flex items-start justify-between mb-6 pt-2">
            <div className="flex items-center gap-4">
               <div className={cn(
                 "p-2.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 group-hover:border-cyan-500/30 transition-all duration-300",
                 project.featured ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500 dark:text-gray-400"
               )}>
                 <Terminal className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-mono group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors tracking-tight">
                  {project.name}
                </h3>
                {project.featured && (
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-500/70 font-mono tracking-widest">
                    RECOMMENDED_REPO
                  </span>
                )}
               </div>
            </div>
            
            <div className="flex items-center gap-3 pr-12 md:pr-0">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              {project.stars !== undefined && project.stars > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/30 px-2.5 py-1 rounded border border-cyan-200 dark:border-cyan-500/20">
                  <Star className="w-3 h-3 fill-cyan-200 dark:fill-cyan-900/50" />
                  {project.stars}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-8 leading-relaxed font-light pl-2 border-l border-gray-200 dark:border-white/10 group-hover:border-cyan-500/30 transition-colors">
            {project.description}
          </p>

          <div className="mt-auto space-y-4">
            <div className="h-px w-full bg-gray-200 dark:bg-white/10 group-hover:bg-cyan-500/30 transition-colors" />
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-[10px] uppercase tracking-wider text-cyan-700 dark:text-cyan-300/80 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/30 rounded font-mono group-hover:text-cyan-600 dark:group-hover:text-cyan-300 group-hover:border-cyan-300 dark:group-hover:border-cyan-500/30 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      </Link>
    );
  }

interface ProjectsSectionProps {
  repoStars: RepoStars;
}

export function ProjectsSection({ repoStars }: ProjectsSectionProps) {
  const projectsWithStars = projects.map((project) => ({
    ...project,
    stars: repoStars[project.name]?.stars,
    forks: repoStars[project.name]?.forks,
  }));

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
            <div className="text-cyan-600 dark:text-cyan-500/50">{'>>'} 4 PROJECTS FOUND</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {projectsWithStars.map((project, idx) => (
            <div key={project.name} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.1 * idx}s` }}>
              <ProjectCard project={project} index={idx} />
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
