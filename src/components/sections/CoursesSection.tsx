import type { Translations } from '../../i18n/translations'

interface Props {
  courses: string[]
  onChange: (courses: string[]) => void
  t: Translations
}

export function CoursesSection({ courses, onChange, t }: Props) {
  const update = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...courses]
    updated[index] = e.target.value
    onChange(updated)
  }

  const remove = (index: number) => onChange(courses.filter((_, i) => i !== index))
  const add = () => onChange([...courses, ''])

  return (
    <div id="coursesContainer" className="entry-list">
      {courses.map((course, i) => (
        <div key={i} className="multi-entry entry-row entry-row--inline">
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor={`course-extra-${i}`}>{t.courseLabel}</label>
            <input
              id={`course-extra-${i}`}
              value={course}
              onChange={update(i)}
              placeholder={t.courseNamePlaceholder}
            />
          </div>
          {courses.length > 1 && (
            <button className="btn-remove" onClick={() => remove(i)}>−</button>
          )}
        </div>
      ))}
      <button id="btnAddCourse" className="btn-add" onClick={add}>{t.addCourse}</button>
    </div>
  )
}
