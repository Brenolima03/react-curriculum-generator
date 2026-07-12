import { useEffect, useState } from 'react'
import { FormSection, Select, Textarea } from '../components/form/FormPrimitives'
import { CoursesSection } from '../components/sections/CoursesSection'
import { EducationSection } from '../components/sections/EducationSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { LanguagesSection } from '../components/sections/LanguagesSection'
import { PersonalInfo } from '../components/sections/PersonalInfo'
import { translations, type Language } from '../i18n/translations'
import type { CurriculumData, EducationEntry, ExperienceEntry, LanguageEntry, PersonalData } from '../types'
import { generatePdf } from '../utils/generatePdf'
import { LinksSection } from '@/components/sections/LinksSection'

const INITIAL_STATE: CurriculumData = {
  personal: {
    fullname: '', city: '', state: '', telephone: '',
    email: '', objective: '', summary: '', technology: '', link: ''
  },
  education: [{ id: crypto.randomUUID(), institution: '', course: '', start: '', end: '' }],
  experience: [{ id: crypto.randomUUID(), company: '', role: '', activities: '', start: '', end: '' }],
  languages: [{ id: crypto.randomUUID(), name: '', level: 'basic' }],
  courses: [''],
  links: [''],
}

const languageOptions = [
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
]

const Index = () => {
  const [data, setData] = useState<CurriculumData>(INITIAL_STATE)
  const [curriculumLanguage, setCurriculumLanguage] = useState<Language>('pt')
  const t = translations[curriculumLanguage]
  const handleLanguageChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setCurriculumLanguage(e.target.value as Language)
  }
  const updatePersonal = (personal: PersonalData) => setData(d => ({ ...d, personal }))
  const updateEducation = (education: EducationEntry[]) => setData(d => ({ ...d, education }))
  const updateExperience = (experience: ExperienceEntry[]) => setData(d => ({ ...d, experience }))
  const updateLanguages = (languages: LanguageEntry[]) => setData(d => ({ ...d, languages }))
  const updateCourses = (courses: string[]) => setData(d => ({ ...d, courses }))
  const updateLinks = (links: string[]) => setData(d => ({ ...d, links }))
  const updateTechnology = (e: React.ChangeEvent<HTMLTextAreaElement>) => setData(d => ({
    ...d, personal: { ...d.personal, technology: e.target.value }
  }))

  useEffect(() => {
    document.title = t.appTitle
  }, [t])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 py-8 bg-background">
        <div className="mx-auto max-w-3xl px-4 text-center relative">
          <h1 className="text-3xl font-bold text-foreground">{t.appTitle}</h1>
          <p className="mt-2 text-muted-foreground">{t.appSubtitle}</p>
          <div className="mt-6 w-full md:w-auto md:mt-0 md:absolute md:right-4 md:top-1/2 md:-translate-y-1/2">
            <Select
              label={t.languageLabel}
              id="curriculumLanguage"
              value={curriculumLanguage}
              onChange={handleLanguageChange}
              options={languageOptions}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-8">
        <FormSection title={t.sectionPersonal}>
          <PersonalInfo data={data.personal} onChange={updatePersonal} t={t} />
        </FormSection>

        <FormSection title={t.sectionEducation}>
          <EducationSection entries={data.education} onChange={updateEducation} t={t} />
        </FormSection>

        <FormSection title={t.sectionExperience}>
          <ExperienceSection entries={data.experience} onChange={updateExperience} t={t} />
        </FormSection>

        <FormSection title={t.sectionLanguages}>
          <LanguagesSection entries={data.languages} onChange={updateLanguages} t={t} />
        </FormSection>

        <FormSection title={t.sectionCourses}>
          <CoursesSection courses={data.courses} onChange={updateCourses} t={t} />
        </FormSection>

        <FormSection title={t.sectionTechnology}>
          <Textarea
            label={t.technologyLabel}
            id="technology"
            value={data.personal.technology}
            onChange={updateTechnology}
            rows={3}
          />
        </FormSection>

        <FormSection title={t.sectionLink}>
          <LinksSection links={data.links} onChange={updateLinks} t={t} />
        </FormSection>
      </main>

      <footer className="pb-10 text-center">
        <button id="btnGenerate" className="btn-generate" onClick={
          () => generatePdf(data, curriculumLanguage)
        }>
          {t.generateButton}
        </button>
      </footer>
    </div>
  )
}

export default Index
