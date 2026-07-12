import { useState, useEffect } from 'react'
import type { Translations } from '../../i18n/translations'
import type { LanguageEntry } from '../../types'
import { PROFICIENCY_LEVELS } from '../../types'

interface Props {
  entries: LanguageEntry[]
  onChange: (entries: LanguageEntry[]) => void
  t: Translations
}

function newEntry(): LanguageEntry {
  return { id: crypto.randomUUID(), name: '', level: PROFICIENCY_LEVELS[0] }
}

export function LanguagesSection({ entries, onChange, t }: Props) {
  const [languageOptions, setLanguageOptions] = useState<string[]>([])

  useEffect(() => {
    fetch('/languages.txt')
      .then(r => r.text())
      .then(text => {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
        setLanguageOptions(lines)
      })
      .catch(() => setLanguageOptions([]))
  }, [])

  const update = (id: string, field: keyof LanguageEntry) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange(entries.map(
      entry => entry.id === id ? { ...entry, [field]: e.target.value } : entry
    ))
  }

  const remove = (id: string) => onChange(entries.filter(e => e.id !== id))
  const add = () => onChange([...entries, newEntry()])

  return (
    <div id="languagesContainer" className="entry-list">
      {entries.map(entry => (
        <div key={entry.id} className="multi-entry entry-row entry-row--inline">
          <div className="field" style={{ flex: 2 }}>
            <label htmlFor={`lang-${entry.id}`}>{t.language}</label>
            <select
              id={`lang-${entry.id}`}
              value={entry.name}
              onChange={update(entry.id, 'name')}
            >
              {languageOptions.map((lang, index) => (
                <option key={`${lang}-${index}`} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor={`level-${entry.id}`}>{t.level}</label>
            <select
              id={`level-${entry.id}`}
              value={entry.level}
              onChange={update(entry.id, 'level')}
            >
              {PROFICIENCY_LEVELS.map(l => (
                <option key={l} value={l}>{t.proficiency[l]}</option>
              ))}
            </select>
          </div>
          {entries.length > 1 && (
            <button className="btn-remove" onClick={() => remove(entry.id)}>−</button>
          )}
        </div>
      ))}
      <button id="btnAddLanguage" className="btn-add" onClick={add}>{t.addLanguage}</button>
    </div>
  )
}
