import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string }[]
}

export function Input({ label, id, ...props }: InputProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </div>
  )
}

export function Textarea({ label, id, ...props }: TextareaProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} rows={4} {...props} />
    </div>
  )
}

export function Select({ label, id, options, ...props }: SelectProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} {...props}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

interface FormSectionProps {
  title: string
  children: React.ReactNode
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <section className="form-section">
      <h2>{title}</h2>
      <div className="section-body">{children}</div>
    </section>
  )
}
