import { jsPDF } from 'jspdf'
import { profile, experience, education, skillGroups, certifications } from '../data'

const MARGIN = 50
const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

const INK = '#000000'

export function generateResumePdf() {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  let y = MARGIN

  doc.setTextColor(INK)
  doc.setDrawColor(INK)

  const ensureSpace = (height) => {
    if (y + height > PAGE_HEIGHT - MARGIN) {
      doc.addPage()
      y = MARGIN
    }
  }

  const sectionHeading = (title) => {
    ensureSpace(28)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(title.toUpperCase(), MARGIN, y)
    y += 6
    doc.setLineWidth(0.75)
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
    y += 16
  }

  const roles = profile.role.split('|').map((role) => role.trim())

  // Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(profile.name, MARGIN, y)
  y += 18

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  doc.text(roles.join(' | '), MARGIN, y)
  y += 15

  doc.setFontSize(9.5)
  const contactLine = [profile.location, profile.github.replace('https://', ''), profile.linkedin.replace('https://www.', '')].join(' | ')
  doc.text(contactLine, MARGIN, y)
  y += 16

  doc.setLineWidth(1)
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
  y += 20

  // Summary
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const summaryLines = doc.splitTextToSize(profile.tagline, CONTENT_WIDTH)
  ensureSpace(summaryLines.length * 13 + 10)
  doc.text(summaryLines, MARGIN, y)
  y += summaryLines.length * 13 + 14

  // Experience
  sectionHeading('Experience')
  experience.forEach((job, index) => {
    ensureSpace(32)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.text(`${job.role}, ${job.company}`, MARGIN, y)
    y += 13

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.text(job.period, MARGIN, y)
    y += 13

    if (job.points?.length) {
      job.points.forEach((point) => {
        const lines = doc.splitTextToSize(point, CONTENT_WIDTH - 14)
        ensureSpace(lines.length * 12 + 2)
        doc.text('-', MARGIN, y)
        doc.text(lines, MARGIN + 12, y)
        y += lines.length * 12 + 2
      })
    }

    y += index === experience.length - 1 ? 0 : 10
  })
  y += 12

  // Education
  sectionHeading('Education')
  education.forEach((item) => {
    ensureSpace(28)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.text(`${item.degree}, ${item.school}`, MARGIN, y)
    y += 13

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.text(item.period, MARGIN, y)
    y += 20
  })
  y += 2

  // Skills
  sectionHeading('Skills')
  skillGroups.forEach((group) => {
    const lines = doc.splitTextToSize(`${group.title}: ${group.items.join(', ')}`, CONTENT_WIDTH)
    ensureSpace(lines.length * 13 + 8)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.text(lines, MARGIN, y)
    y += lines.length * 13 + 8
  })
  y += 2

  // Certifications
  sectionHeading('Certifications')
  certifications.forEach((cert) => {
    ensureSpace(16)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.text(`${cert.title}, ${cert.year}`, MARGIN, y)
    y += 16
  })

  doc.save(`${profile.name.replace(/\s+/g, '_')}_Resume.pdf`)
}
