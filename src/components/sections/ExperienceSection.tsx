import { Input, Textarea } from '../form/FormPrimitives'
import { maskDate } from '../../utils/masks'
import type { Translations } from '../../i18n/translations'
import type { ExperienceEntry } from '../../types'

interface Props {
  entries: ExperienceEntry[]
  onChange: (entries: ExperienceEntry[]) => void
  t: Translations
}

function newEntry(): ExperienceEntry {
  return { id: crypto.randomUUID(), company: '', role: '', activities: '', start: '', end: '' }
}

export function ExperienceSection({ entries, onChange, t }: Props) {
  const update = (id: string, field: keyof ExperienceEntry) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: e.target.value } : entry
    ))
  }

  const updateMasked = (id: string, field: keyof ExperienceEntry) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(entries.map(entry =>
      entry.id === id ? { ...entry, [field]: maskDate(e.target.value) } : entry
    ))
  }

  const remove = (id: string) => onChange(entries.filter(e => e.id !== id))
  const add = () => onChange([...entries, newEntry()])

  return (
    <div id="experienceContainer" className="entry-list">
      {entries.map(entry => (
        <div key={entry.id} className="multi-entry entry-row">
          <div className="field-row">
            <Input
              label={t.company} id={`comp-${entry.id}`}
              value={entry.company}
              onChange={update(entry.id, 'company')}
            />
            <Input
              label={t.role}
              id={`role-${entry.id}`}
              value={entry.role}
              onChange={update(entry.id, 'role')}
            />
          </div>
          <Textarea
            label={t.activities}
            id={`act-${entry.id}`}
            value={entry.activities}
            onChange={update(entry.id, 'activities')}
            rows={3}
          />
          <div className="field-row">
            <Input
              label={t.startDate}
              id={`exp-start-${entry.id}`}
              value={entry.start}
              onChange={updateMasked(entry.id, 'start')}
            />
            <Input
              label={t.endDate}
              id={`exp-end-${entry.id}`}
              value={entry.end}
              onChange={updateMasked(entry.id, 'end')}
              placeholder={t.currentPlaceholder}
            />
          </div>
          {entries.length > 1 && (
            <button className="btn-remove" onClick={() => remove(entry.id)}>−</button>
          )}
        </div>
      ))}
      <button id="btnAddExperience" className="btn-add" onClick={add}>{t.addExperience}</button>
    </div>
  )
}
