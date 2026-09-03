
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  blogId?: string;
  isLocalResponse?: boolean;
}

export enum Category {
  UAT = 'UAT Exam Guide',
  FACULTIES = 'Faculties',
  CUTOFFS = 'Cutoff Points',
  SERVICES = 'Student Services',
  CONTACTS = 'Contacts',
  ANALYSIS = 'Student Analysis'
}

export interface AAUData {
  uat: string;
  faculties: string;
  cutoff_points: string;
  student_services: string;
  contacts: string;
  analysis: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  readTime: string;
  date: string;
  author: string;
  summary: string;
  content: string;
  externalLink?: {
    url: string;
    label: string;
  };
  tags: string[];
}

export interface FAQItem {
  id: string;
  keywords: string[];
  question: string;
  shortAnswer: string;
  blogId: string;
}

