export interface PersonalData {
  fullname: string
  city: string
  state: string
  telephone: string
  email: string
  objective: string
  summary: string
  technology: string
  link: string
}

export interface EducationEntry {
  id: string
  institution: string
  course: string
  start: string
  end: string
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  activities: string
  start: string
  end: string
}

export interface CurriculumData {
  personal: PersonalData
  education: EducationEntry[]
  experience: ExperienceEntry[]
  languages: LanguageEntry[]
  courses: string[]
  links: string[]
}

export const PROFICIENCY_LEVELS = ['basic', 'intermediate', 'advanced', 'fluent', 'native'] as const
export type ProficiencyLevel = typeof PROFICIENCY_LEVELS[number]

export interface LanguageEntry {
  id: string
  name: string
  level: ProficiencyLevel
}

export const BRAZILIAN_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO',
  'MA','MT','MS','MG','PA','PB','PR','PE','PI',
  'RJ','RN','RS','RO','RR','SC','SP','SE','TO',
] as const
