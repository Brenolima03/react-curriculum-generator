import { Input } from '../form/FormPrimitives'
import { maskDate } from '../../utils/masks'
import type { Translations } from '../../i18n/translations'
import type { EducationEntry } from '../../types'

interface Props {
  entries: EducationEntry[]
  onChange: (entries: EducationEntry[]) => void
  t: Translations
}

function newEntry(): EducationEntry {
  return { id: crypto.randomUUID(), institution: '', course: '', start: '', end: '' }
}

export function EducationSection({ entries, onChange, t }: Props) {
  const update = (id: string, field: keyof EducationEntry) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(entries.map(entry => entry.id === id ? { ...entry, [field]: e.target.value } : entry))
  }

  const updateMasked = (id: string, field: keyof EducationEntry) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(entries.map(entry =>
      entry.id === id ? { ...entry, [field]: maskDate(e.target.value) } : entry
    ))
  }

  const remove = (id: string) => onChange(entries.filter(e => e.id !== id))
  const add = () => onChange([...entries, newEntry()])

  return (
    <div id="educationContainer" className="entry-list">
      {entries.map(entry => (
        <div key={entry.id} className="multi-entry entry-row">
          <div className="field-row">
            <Input
              label={t.institution} id={`inst-${entry.id}`}
              value={entry.institution}
              onChange={update(entry.id, 'institution')}
            />
            <Input
              label={t.course}
              id={`course-${entry.id}`}
              value={entry.course}
              onChange={update(entry.id, 'course')}
            />
          </div>
          <div className="field-row">
            <Input
              label={t.startDate} id={`edu-start-${entry.id}`}
              value={entry.start}
              onChange={updateMasked(entry.id, 'start')}
          />
            <Input
              label={t.endDate}
              id={`edu-end-${entry.id}`}
              value={entry.end}
              onChange={updateMasked(entry.id, 'end')}
            />
          </div>
          {entries.length > 1 && (
            <button className="btn-remove" onClick={() => remove(entry.id)}>−</button>
          )}
        </div>
      ))}
      <button id="btnAddEducation" className="btn-add" onClick={add}>{t.addEducation}</button>
    </div>
  )
}
