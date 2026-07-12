import { jsPDF } from 'jspdf'
import { translations, type Language } from '../i18n/translations'
import type { CurriculumData, ProficiencyLevel } from '../types'

const PAGE_W = 210, PAGE_H = 297
const MARGIN_L = 20, MARGIN_R = 20, MARGIN_T = 18, MARGIN_B = 15
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

const STYLE = {
  FONT: 'helvetica',
  BOLD: 'bold',
  NORMAL: 'normal',
  BLACK: [0, 0, 0] as [number, number, number],
  SIZE_NAME: 18,
  SIZE_CONTACT: 8,
  SIZE_SECTION: 9,
  SIZE_TEXT: 10,
  SIZE_OBJ: 11,
  GAP_TEXT: 5,
  GAP_SECTION: 5.5,
  GAP_OBJ: 6,
}

export function generatePdf(data: CurriculumData, language: Language = 'pt'): void {
  const t = translations[language]
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  let y = MARGIN_T

  const ensureSpace = (needed = 10) => {
    if (y + needed > PAGE_H - MARGIN_B) {
      doc.addPage()
      y = MARGIN_T
    }
  }

  const drawLine = (width = 0.5) => {
    doc.setDrawColor(STYLE.BLACK[0], STYLE.BLACK[1], STYLE.BLACK[2]).setLineWidth(width)
    doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y)
  }

  const writeText = (text: string, opts: {
    bold?: boolean; size?: number; indent?: number; gap?: number
  } = {}) => {
    const { bold = false, size = STYLE.SIZE_TEXT, indent = 0, gap = STYLE.GAP_TEXT } = opts
    doc.setFont(STYLE.FONT, bold ? STYLE.BOLD : STYLE.NORMAL)
      .setFontSize(size).setTextColor(STYLE.BLACK[0], STYLE.BLACK[1], STYLE.BLACK[2])
    const lines = doc.splitTextToSize(String(text), CONTENT_W - indent)
    lines.forEach((line: string) => {
      ensureSpace(gap + 1)
      doc.text(line, MARGIN_L + indent, y)
      y += gap
    })
  }

  const renderSection = (title: string) => {
    ensureSpace(14)
    y += 3
    doc.setFont(STYLE.FONT, STYLE.BOLD)
      .setFontSize(STYLE.SIZE_SECTION)
      .setTextColor(STYLE.BLACK[0], STYLE.BLACK[1], STYLE.BLACK[2])
    doc.text(title, MARGIN_L, y)
    const tw = doc.getTextWidth(title)
    doc.setLineWidth(0.3).line(MARGIN_L, y + 0.8, MARGIN_L + tw, y + 0.8)
    y += STYLE.GAP_SECTION
  }

  const { personal, education, experience, languages, courses, links } = data

  /* Header */
  const nameLabel = (personal.fullname || 'NOME COMPLETO').toUpperCase()

  const contacts: string[] = []
  if (personal.city || personal.state)
    contacts.push([personal.city, personal.state].filter(Boolean).join(' - '))
  if (personal.telephone || personal.email)
    contacts.push([personal.telephone, personal.email].filter(Boolean).join(' | '))

  const contactTop = MARGIN_T + 5
  const nameY = MARGIN_T + STYLE.SIZE_NAME * 0.352 + 2
  const headerBottom = Math.max(nameY + 6, contactTop + contacts.length * 3 + 3)

  doc.setFont(STYLE.FONT, STYLE.NORMAL)
    .setFontSize(STYLE.SIZE_CONTACT)
    .setTextColor(STYLE.BLACK[0], STYLE.BLACK[1], STYLE.BLACK[2])
  contacts.forEach((line, i) => {
    doc.text(line, PAGE_W - MARGIN_R, contactTop + i * 3, { align: 'right' })
  })

  doc.setFont(STYLE.FONT, STYLE.BOLD)
    .setFontSize(STYLE.SIZE_NAME)
    .setTextColor(STYLE.BLACK[0], STYLE.BLACK[1], STYLE.BLACK[2])
  doc.text(nameLabel, MARGIN_L, nameY)

  y = headerBottom
  drawLine()
  y += 8

  /* Objetivo */
  if (personal.objective) {
    doc.setFont(STYLE.FONT, STYLE.BOLD)
      .setFontSize(STYLE.SIZE_OBJ)
      .setTextColor(STYLE.BLACK[0], STYLE.BLACK[1], STYLE.BLACK[2])
    const label = t.pdfObjectiveLabel
    const lw = doc.getTextWidth(label)
    const lines = doc.splitTextToSize(personal.objective, CONTENT_W - lw)
    const startX = Math.max(MARGIN_L, (PAGE_W - (lw + doc.getTextWidth(lines[0]))) / 2)
    lines.forEach((line: string, i: number) => {
      ensureSpace(STYLE.GAP_OBJ)
      doc.text(i === 0 ? label : '', startX, y)
      doc.text(line, startX + lw, y)
      y += STYLE.GAP_OBJ
    })
    drawLine()
    y += 8
  }

  /* Resumo */
  if (personal.summary) {
    renderSection(t.pdfSummary)
    writeText(personal.summary)
    y += 3
  }

  /* Formação Acadêmica */
  const validEducation = education.filter(e => e.institution || e.course)
  if (validEducation.length) {
    renderSection(t.pdfEducation)
    validEducation.forEach(e => {
      const parts = [
        e.course ? e.course.toUpperCase() : null,
        e.institution || null,
        e.end ? `${t.pdfConcluded}: ${e.end}` : e.start ? `${t.pdfStarted}: ${e.start}` : null,
      ].filter(Boolean)
      const line = parts.join(' - ')
      if (line) writeText(line, { bold: true })
    })
    y += 3
  }

  /* Experiência Profissional */
  const validExperience = experience.filter(e => e.company || e.role)
  if (validExperience.length) {
    renderSection(t.pdfExperience)
    validExperience.forEach(e => {
      ensureSpace(20)
      if (e.company) writeText(e.company.toUpperCase(), { bold: true })

      const separators: Record<Language, string> = {
        pt: ' a ',
        es: ' a ',
        en: ' to ',
      }

      const period = [e.start, e.end || t.pdfToday]
        .filter(Boolean)
        .join(separators[language] ?? ' - ')

      writeText(e.role ? (period ? `${e.role} - ${period}` : e.role) : period)

      if (e.activities) {
        e.activities.split(/\n|;/).map(b => b.trim()).filter(Boolean).forEach(bullet => {
          ensureSpace(6)
          doc.setFillColor(STYLE.BLACK[0], STYLE.BLACK[1], STYLE.BLACK[2]).circle(MARGIN_L + 4.5, y - 1.2, 0.8, 'F')
          doc.setFont(STYLE.FONT, STYLE.NORMAL)
            .setFontSize(STYLE.SIZE_TEXT)
            .setTextColor(STYLE.BLACK[0], STYLE.BLACK[1], STYLE.BLACK[2])
          const wrapped = doc.splitTextToSize(bullet, CONTENT_W - 10)
          wrapped.forEach((wl: string) => {
            ensureSpace(5)
            doc.text(wl, MARGIN_L + 8, y)
            y += 5
          })
        })
      }
      y += 3
    })
  }

  /* Idiomas */
  const validLanguages = languages.filter(l => l.name)
  if (validLanguages.length) {
    renderSection(t.pdfLanguages)
    validLanguages.forEach(l => {
      const levelLabel = t.proficiency[l.level as ProficiencyLevel] ?? l.level
      writeText([l.name, levelLabel].filter(Boolean).join(': '))
    })
    y += 3
  }

  /* Cursos Complementares */
  const validCourses = courses.filter(Boolean)
  if (validCourses.length) {
    renderSection(t.pdfCourses)
    validCourses.forEach(c => writeText(c.toUpperCase(), { bold: true }))
    y += 3
  }

  /* Tecnologias */
  if (personal.technology) {
    renderSection(t.pdfTechnology)
    writeText(personal.technology)
  }

  /* Links */
  const validLinks = links.filter(Boolean)
  if (validLinks.length) {
    renderSection(t.pdfLink)
    validLinks.forEach(link => (writeText(link), doc.line(MARGIN_L, y - 4.2, MARGIN_L + doc.getTextWidth(link), y - 4.2)))
    y += 3
  }


  const slug = (personal.objective || 'geral')
    .split(' ')[0]
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

  doc.save(`${t.pdfFilename}_${slug}.pdf`)
}
