export interface Profile {
  name: string;
  displayName: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  github: string;
  about: string;
  photoUrl: string;
  heroGreeting: string;
  heroDescription: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  technologies: string[];
  image: string;
  screenshots: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Languages & Core' | 'Libraries & Frameworks' | 'Styling & Design' | 'Tools & Environment';
  description?: string;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
}

