import { HeroSection } from '@/components/home/hero-section';
import { SkillsSection } from '@/components/home/skills-section';
import { ProjectsSection } from '@/components/home/projects-section';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
    </main>
  );
}
