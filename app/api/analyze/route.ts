import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { readFile } from 'fs/promises'
import { join } from 'path'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { filename, documentType } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'API key not configured' 
      })
    }

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

    // Analyze document with Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Analyze this ${documentType} tax document and extract key information:

Document Text:
${extractedText}

Please extract and return:
1. Document type and tax year
2. Key financial figures (income, deductions, etc.)
3. Important dates
4. Any missing information or errors
5. Recommendations for tax preparation

Format the response as JSON with clear categories.`
      }]
    })

    const analysis = message.content[0].type === 'text' ? message.content[0].text : 'Analysis failed'

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