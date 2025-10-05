import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { filename, documentType } = await request.json()

    // Read the uploaded file
    const filePath = join(process.cwd(), 'uploads', filename)
    const fileBuffer = await readFile(filePath)
    
    let extractedText = ''
    
    // Extract text based on file type
    if (filename.toLowerCase().endsWith('.pdf')) {
      try {
        const pdf = (await import('pdf-parse')).default
        const pdfData = await pdf(fileBuffer)
        extractedText = pdfData.text
      } catch (error) {
        extractedText = 'PDF parsing failed. Please try uploading as text or image.'
      }
    } else {
      // For other file types, convert buffer to string
      extractedText = fileBuffer.toString('utf-8')
    }

    // Simple rule-based analysis (no AI needed)
    const analysis = analyzeDocument(extractedText, documentType)

    return NextResponse.json({
      success: true,
      analysis,
      extractedText: extractedText.substring(0, 500) + '...' // Preview
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze document'
    })
  }
}

function analyzeDocument(text: string, documentType: string): string {
  const upperText = text.toUpperCase()
  let analysis = `Document Analysis for ${documentType}:\n\n`

  // Look for common tax document patterns
  if (upperText.includes('W-2') || upperText.includes('WAGES')) {
    analysis += "✓ W-2 Form Detected\n"
    
    // Extract wage information
    const wageMatch = text.match(/\$[\d,]+\.?\d*/g)
    if (wageMatch) {
      analysis += `• Potential wage amounts found: ${wageMatch.slice(0, 3).join(', ')}\n`
    }
    
    analysis += "• Required for tax filing\n"
    analysis += "• Report all wage income on Form 1040\n\n"
  }

  if (upperText.includes('1099') || upperText.includes('INTEREST') || upperText.includes('DIVIDEND')) {
    analysis += "✓ 1099 Form Detected\n"
    analysis += "• Additional income source\n"
    analysis += "• May affect tax bracket\n"
    analysis += "• Include in total income calculation\n\n"
  }

  if (upperText.includes('MORTGAGE') || upperText.includes('1098')) {
    analysis += "✓ Mortgage Interest Document\n"
    analysis += "• Potential itemized deduction\n"
    analysis += "• Compare with standard deduction\n"
    analysis += "• Keep for tax records\n\n"
  }

  if (upperText.includes('CHARITABLE') || upperText.includes('DONATION')) {
    analysis += "✓ Charitable Donation Record\n"
    analysis += "• Itemized deduction if over $300\n"
    analysis += "• Requires proper documentation\n"
    analysis += "• Keep receipts for audit purposes\n\n"
  }

  // Look for tax year
  const yearMatch = text.match(/20\d{2}/g)
  if (yearMatch) {
    analysis += `• Tax Year: ${yearMatch[0]}\n`
  }

  // Look for dollar amounts
  const amounts = text.match(/\$[\d,]+\.?\d*/g)
  if (amounts && amounts.length > 0) {
    analysis += `• Key amounts found: ${amounts.slice(0, 5).join(', ')}\n`
  }

  analysis += "\nRecommendations:\n"
  analysis += "• Verify all information is accurate\n"
  analysis += "• Keep original documents for records\n"
  analysis += "• Consult tax professional for complex situations\n"
  analysis += "• File before April 15th deadline\n"

  return analysis
}