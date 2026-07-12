import type { Translations } from '../../i18n/translations'

interface Props {
  links: string[]
  onChange: (links: string[]) => void
  t: Translations
}

export function LinksSection({ links, onChange, t }: Props) {
  const update = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...links]
    updated[index] = e.target.value
    onChange(updated)
  }

  const remove = (index: number) => onChange(links.filter((_, i) => i !== index))
  const add = () => onChange([...links, ''])

  return (
    <div id="linksContainer" className="entry-list">
      {links.map((link, i) => (
        <div key={i} className="multi-entry entry-row entry-row--inline">
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor={`link-extra-${i}`}>{t.linkLabel}</label>
            <input
              id={`link-extra-${i}`}
              value={link}
              onChange={update(i)}
              placeholder={t.linkPlaceholder}
            />
          </div>
          {links.length > 1 && (
            <button className="btn-remove" onClick={() => remove(i)}>−</button>
          )}
        </div>
      ))}
      <button id="btnAddLink" className="btn-add" onClick={add}>{t.addLink}</button>
    </div>
  )
}
