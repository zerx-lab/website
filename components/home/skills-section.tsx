import { FeatureCard } from './feature-card';
import {
  Code2,
  Layers,
  Server,
  Cpu,
  Cloud,
  Brain,
} from 'lucide-react';

const skills = [
  {
    icon: <Code2 className="w-6 h-6" />,
    title: 'TypeScript',
    description: '类型安全的 JavaScript 开发，提升代码质量与开发效率',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'React / Next.js',
    description: '现代 Web 应用开发框架，构建高性能用户界面',
  },
  {
    icon: <Server className="w-6 h-6" />,
    title: 'Node.js',
    description: '服务端 JavaScript 运行时，全栈开发首选',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'Rust',
    description: '高性能系统编程语言，内存安全与并发处理',
  },
  {
    icon: <Cloud className="w-6 h-6" />,
    title: 'DevOps',
    description: 'CI/CD 流水线、容器化部署与云原生架构',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI / LLM',
    description: '大语言模型应用开发、AI 工具链集成',
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-fd-muted/30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-fd-foreground mb-4">
            技术能力
          </h2>
          <p className="text-fd-muted-foreground text-lg max-w-2xl mx-auto">
            专注于现代 Web 技术栈，持续探索前沿领域
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, idx) => (
            <div 
              key={skill.title} 
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * idx}s` }}
            >
              <FeatureCard
                icon={skill.icon}
                title={skill.title}
                description={skill.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
