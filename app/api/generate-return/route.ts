import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { documents, personalInfo } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'API key not configured' 
      })
    }

    // Compile all document analyses
    const documentSummary = documents.map((doc: any) => 
      `${doc.name}: ${doc.analysis || 'Not analyzed'}`
    ).join('\n\n')

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `Based on the following tax documents and personal information, help prepare a tax return summary:

Personal Information:
${JSON.stringify(personalInfo, null, 2)}

Document Analyses:
${documentSummary}

Please provide:
1. A comprehensive tax return summary
2. Calculated totals for income, deductions, and estimated tax liability
3. Recommendations for tax optimization
4. Any missing documents or information needed
5. Important deadlines and next steps

Format this as a detailed tax preparation report that could be used by a tax professional.`
      }]
    })

    const taxReturn = message.content[0].type === 'text' ? message.content[0].text : 'Generation failed'

    return NextResponse.json({
      success: true,
      taxReturn,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Tax return generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate tax return'
    })
  }
}