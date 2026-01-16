import { HeroSection } from '@/components/home/hero-section';
import { SkillsSection } from '@/components/home/skills-section';
import { ProjectsSection } from '@/components/home/projects-section';
import { DashboardSection } from '@/components/home/dashboard-section';
import { getGitHubData, getGitHubActivity } from '@/lib/github';

export default async function HomePage() {
  // 并行获取 GitHub 数据和活动数据
  const [githubData, activity] = await Promise.all([
    getGitHubData(),
    getGitHubActivity(),
  ]);

  return (
    <main>
      <HeroSection />
      <DashboardSection activity={activity} stats={githubData.stats} />
      <SkillsSection />
      <ProjectsSection repositories={githubData.repositories} maxDisplay={6} />
    </main>
  );
}
