import { PDFDocument, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib?dts'

export async function generatePDF(content: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  
  const fontSize = 12
  const margin = 50
  const lineHeight = fontSize * 1.2
  
  // Split content into lines that fit within margins
  const words = content.split(' ')
  let lines: string[] = []
  let currentLine = ''
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const textWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize)
    
    if (textWidth < width - 2 * margin) {
      currentLine = testLine
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) {
    lines.push(currentLine)
  }
  
  // Draw text lines
  lines.forEach((line, index) => {
    const y = height - margin - (index * lineHeight)
    if (y > margin) { // Only draw if within page bounds
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font: timesRomanFont
      })
    }
  })
  
  return pdfDoc.save()
}