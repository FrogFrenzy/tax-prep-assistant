import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please sign in to generate tax return' 
      })
    }

    const { documents, personalInfo } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'AI service not configured' 
      })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Compile all document analyses
    const documentSummary = documents.map((doc: any) => 
      `${doc.name}: ${doc.analysis || 'Not analyzed'}`
    ).join('\n\n')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
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

    const taxReturn = completion.choices[0]?.message?.content || 'Generation failed'

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