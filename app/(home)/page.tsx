import { HeroSection } from '@/components/home/hero-section';
import { SkillsSection } from '@/components/home/skills-section';
import { ProjectsSection } from '@/components/home/projects-section';
import { getGitHubData } from '@/lib/github';

export default async function HomePage() {
  const githubData = await getGitHubData();

  return (
    <main>
      <HeroSection />
      <SkillsSection />
      <ProjectsSection repositories={githubData.repositories} maxDisplay={6} />
    </main>
  );
}
