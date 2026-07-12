import { Input, Select, Textarea } from '../form/FormPrimitives'
import { maskTelephone, onlyLetters } from '../../utils/masks'
import type { Translations } from '../../i18n/translations'
import type { PersonalData } from '../../types'
import { BRAZILIAN_STATES } from '../../types'

interface Props {
  data: PersonalData
  onChange: (data: PersonalData) => void
  t: Translations
}

const stateOptions = BRAZILIAN_STATES.map(s => ({ value: s, label: s }))

export function PersonalInfo({ data, onChange, t }: Props) {
  const update = (field: keyof PersonalData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => onChange({ ...data, [field]: e.target.value })

  const updateMasked = (field: keyof PersonalData, mask: (v: string) => string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => onChange({ ...data, [field]: mask(e.target.value) })

  const updateLetters = (field: keyof PersonalData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => onChange({ ...data, [field]: onlyLetters(e.target.value) })

  return (
    <>
      <Input
        label={t.fullname}
        id="fullname"
        value={data.fullname}
        onChange={updateLetters('fullname')}
      />
      <div className="field-row">
        <Input
          label={t.city}
          id="city" value={data.city}
          onChange={updateLetters('city')} />
        <Select
          label={t.state}
          id="state" value={data.state}
          onChange={update('state')}
          options={stateOptions}
        />
      </div>
      <div className="field-row">
        <Input
          label={t.telephone}
          id="telephone"
          value={data.telephone}
          onChange={
          updateMasked('telephone', maskTelephone)
          }
        />
        <Input
          label={t.email}
          id="email"
          type="email"
          value={data.email}
          onChange={update('email')}
        />
      </div>
      <Input
        label={t.objective}
        id="objective"
        value={data.objective}
        onChange={update('objective')}
      />
      <Textarea
        label={t.summary}
        id="summary"
        value={data.summary}
        onChange={update('summary')}
      />
    </>
  )
}
