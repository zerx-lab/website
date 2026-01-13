import { HeroSection } from '@/components/home/hero-section';
import { SkillsSection } from '@/components/home/skills-section';
import { ProjectsSection } from '@/components/home/projects-section';
import { getGitHubStars } from '@/lib/github';

export default async function HomePage() {
  const repoStars = await getGitHubStars();

  return (
    <main>
      <HeroSection />
      <SkillsSection />
      <ProjectsSection repoStars={repoStars} />
    </main>
  );
}
