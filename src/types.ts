export interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface AnalyticsCategory {
  label: string;
  percentage: number;
  color: string;
}

export interface AnalyticsContent {
  totalTime: string;
  categories: AnalyticsCategory[];
}

export interface ScheduleItem {
  time: string;
  task: string;
  description: string;
  color: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  image: string;
  images: string[];
  link: string;
  tags: string[];
  tools: string[];
  learnings: string;
  results: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface TechSkill {
  label: string;
  level: number; // 0-100
  category: 'Design' | 'Dev' | 'AI';
}

export interface SkillItem {
  label: string;
  status: 'High' | 'Medium' | 'Low';
}

export interface GrowthContent {
  sitesCount: number;
  experienceYears: number;
  projectsCount: number;
}

export interface PortfolioContent {
  hero: HeroContent;
  profilePhoto: string;
  analytics: AnalyticsContent;
  schedule: ScheduleItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  growth: GrowthContent;
  experience: ExperienceItem[];
  techSkills: TechSkill[];
  about: {
    photo: string;
    quote: string;
    description: string;
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'viewer';
}
