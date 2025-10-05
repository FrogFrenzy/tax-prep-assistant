import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { documents, personalInfo } = await request.json()

    // Generate a simple tax return summary without AI
    const taxReturn = generateSimpleTaxReturn(documents, personalInfo)

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

function generateSimpleTaxReturn(documents: any[], personalInfo: any): string {
  const currentYear = new Date().getFullYear()
  const taxYear = personalInfo.taxYear || currentYear - 1

  let report = `TAX PREPARATION SUMMARY - ${taxYear}\n`
  report += `Generated on: ${new Date().toLocaleDateString()}\n`
  report += `Filing Status: ${personalInfo.filingStatus || 'Single'}\n\n`

  report += `DOCUMENT SUMMARY:\n`
  report += `================\n`
  
  let totalDocuments = 0
  let analyzedDocuments = 0
  let estimatedIncome = 0
  let estimatedDeductions = 0

  documents.forEach(doc => {
    totalDocuments++
    if (doc.analysis) {
      analyzedDocuments++
      report += `✓ ${doc.name}: Analyzed\n`
      
      // Extract estimated amounts from analysis
      const amounts = doc.analysis.match(/\$[\d,]+\.?\d*/g) || []
      amounts.forEach((amount: string) => {
        const value = parseFloat(amount.replace(/[$,]/g, ''))
        if (doc.category === 'Income' && value > 100) {
          estimatedIncome += value
        } else if (doc.category === 'Deductions' && value > 0) {
          estimatedDeductions += value
        }
      })
    } else {
      report += `○ ${doc.name}: Not analyzed\n`
    }
  })

  report += `\nDOCUMENT STATUS:\n`
  report += `===============\n`
  report += `Total Documents: ${totalDocuments}\n`
  report += `Analyzed Documents: ${analyzedDocuments}\n`
  report += `Completion Rate: ${Math.round((analyzedDocuments / totalDocuments) * 100)}%\n\n`

  report += `ESTIMATED FINANCIAL SUMMARY:\n`
  report += `============================\n`
  report += `Estimated Total Income: $${estimatedIncome.toLocaleString()}\n`
  report += `Estimated Deductions: $${estimatedDeductions.toLocaleString()}\n`
  
  const standardDeduction = personalInfo.filingStatus === 'married' ? 27700 : 13850 // 2023 amounts
  const betterDeduction = Math.max(estimatedDeductions, standardDeduction)
  const taxableIncome = Math.max(0, estimatedIncome - betterDeduction)
  
  report += `Standard Deduction (${taxYear}): $${standardDeduction.toLocaleString()}\n`
  report += `Recommended Deduction: $${betterDeduction.toLocaleString()}\n`
  report += `Estimated Taxable Income: $${taxableIncome.toLocaleString()}\n\n`

  // Simple tax calculation (very rough estimate)
  let estimatedTax = 0
  if (taxableIncome > 0) {
    if (taxableIncome <= 11000) {
      estimatedTax = taxableIncome * 0.10
    } else if (taxableIncome <= 44725) {
      estimatedTax = 1100 + (taxableIncome - 11000) * 0.12
    } else if (taxableIncome <= 95375) {
      estimatedTax = 5147 + (taxableIncome - 44725) * 0.22
    } else {
      estimatedTax = 16290 + (taxableIncome - 95375) * 0.24
    }
  }

  report += `ESTIMATED TAX LIABILITY:\n`
  report += `========================\n`
  report += `Estimated Federal Tax: $${estimatedTax.toLocaleString()}\n`
  report += `(This is a rough estimate - actual tax may vary)\n\n`

  report += `NEXT STEPS:\n`
  report += `===========\n`
  report += `1. Review all document analyses for accuracy\n`
  report += `2. Gather any missing required documents\n`
  report += `3. Consider consulting a tax professional\n`
  report += `4. File your return before April 15th\n`
  report += `5. Keep copies of all documents for 7 years\n\n`

  report += `IMPORTANT NOTES:\n`
  report += `================\n`
  report += `• This is an automated summary, not professional tax advice\n`
  report += `• Actual tax calculations may differ significantly\n`
  report += `• State taxes are not included in this estimate\n`
  report += `• Consult a qualified tax professional for complex situations\n`
  report += `• This tool is for organizational purposes only\n\n`

  report += `MISSING DOCUMENTS CHECK:\n`
  report += `========================\n`
  const requiredDocs = documents.filter(doc => doc.required && doc.status === 'pending')
  if (requiredDocs.length > 0) {
    report += `⚠️  Still need these required documents:\n`
    requiredDocs.forEach(doc => {
      report += `   • ${doc.name}\n`
    })
  } else {
    report += `✓ All required documents have been processed\n`
  }

  return report
}