import {
  Code2,
  Layers,
  Server,
  Cpu,
  Cloud,
  Brain,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const skills = [
  {
    icon: <Code2 className="w-8 h-8" />,
    title: 'TypeScript',
    description: '构建大型应用的首选语言，类型安全与开发体验的完美平衡。',
    tech: 'TYPE_SAFE',
    className: "md:col-span-2 md:row-span-2",
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: 'React / Next.js',
    description: '深耕 React 生态，精通 Next.js 全栈开发与性能优化。',
    tech: 'MODERN_UI',
    className: "md:col-span-1 md:row-span-2",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20"
  },
  {
    icon: <Server className="w-6 h-6" />,
    title: 'Node.js',
    description: '高性能服务端运行时',
    tech: 'RUNTIME',
    className: "md:col-span-1",
    iconColor: "text-green-600 dark:text-green-400",
    bgColor: ""
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'Rust',
    description: '系统级编程与高性能计算',
    tech: 'SYSTEM',
    className: "md:col-span-1",
    iconColor: "text-orange-600 dark:text-orange-400",
    bgColor: ""
  },
  {
    icon: <Cloud className="w-6 h-6" />,
    title: 'DevOps',
    description: '自动化部署与云原生架构',
    tech: 'INFRA',
    className: "md:col-span-1",
    iconColor: "text-sky-600 dark:text-sky-400",
    bgColor: ""
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI / LLM',
    description: '大模型集成与 Agent 开发',
    tech: 'INTELLIGENCE',
    className: "md:col-span-3",
    iconColor: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-900/20"
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 relative overflow-hidden section-bg selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="absolute inset-0 bg-grid-cyber opacity-5 dark:opacity-10" />
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white dark:from-black to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-black to-transparent z-10" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-cyan-500/5 dark:bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/30 rounded-full bg-cyan-50 dark:bg-cyan-900/10 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs font-mono text-cyan-700 dark:text-cyan-300 tracking-widest">CAPABILITY_MATRIX</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono tracking-tighter mb-4">
            <span className="text-cyan-600 dark:text-cyan-400">
              SYSTEM_MODULES
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            全栈技术储备，构建高性能、高可用的数字体验
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {skills.map((skill, idx) => (
            <div 
              key={skill.title} 
              className={cn(
                "group relative overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 backdrop-blur-sm transition-all duration-500 hover:border-cyan-500/50 hover:bg-gray-50 dark:hover:bg-white/5 opacity-0 animate-fade-in-up card-hover-lift",
                skill.className,
                skill.bgColor
              )}
              style={{ animationDelay: `${0.1 * idx}s` }}
            >
              <div className="absolute inset-0 bg-cyan-500/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-gray-200 dark:border-white/10 rounded-tl-xl group-hover:border-cyan-500/50 transition-colors" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-gray-200 dark:border-white/10 rounded-br-xl group-hover:border-cyan-500/50 transition-colors" />

              <div className="relative p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "p-3 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 group-hover:scale-110 transition-transform duration-300",
                    skill.iconColor
                  )}>
                    {skill.icon}
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-gray-500 border border-gray-200 dark:border-white/10 px-2 py-1 rounded bg-gray-50 dark:bg-black/50">
                    {skill.tech}
                  </span>
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors font-mono tracking-tight">
                    {skill.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {skill.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
