
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Category {
  FACULTIES = 'Faculties',
  CUTOFFS = 'Cutoff Points',
  SERVICES = 'Student Services',
  CONTACTS = 'Contacts',
  ANALYSIS = 'Student Analysis'
}

export interface AAUData {
  faculties: string;
  cutoff_points: string;
  student_services: string;
  contacts: string;
  analysis: string;
}
