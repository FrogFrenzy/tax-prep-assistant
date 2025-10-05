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

  let report = `IRS FORM 1040 PREPARATION WORKSHEET - TAX YEAR ${taxYear}\n`
  report += `${'='.repeat(60)}\n`
  report += `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`
  report += `Filing Status: ${personalInfo.filingStatus || 'Single'}\n`
  report += `Prepared using Tax Chicken v1.0 - a Vibe Coded Tax Return Assistant\n\n`

  // INCOME SECTION (Form 1040 Lines 1-8)
  report += `PART I - INCOME (Form 1040, Lines 1-8)\n`
  report += `${'='.repeat(40)}\n`
  
  let totalIncome = 0
  let wagesIncome = 0
  let interestIncome = 0
  let dividendIncome = 0
  let businessIncome = 0
  
  documents.forEach(doc => {
    if (doc.analysis && doc.category === 'Income') {
      const amounts = doc.analysis.match(/\$[\d,]+\.?\d*/g) || []
      amounts.forEach((amount: string) => {
        const value = parseFloat(amount.replace(/[$,]/g, ''))
        if (value > 100) {
          if (doc.name.includes('W-2')) {
            wagesIncome += value
            report += `Line 1a - Wages (${doc.name}): $${value.toLocaleString()}\n`
          } else if (doc.name.includes('1099-INT')) {
            interestIncome += value
            report += `Line 2a - Interest Income (${doc.name}): $${value.toLocaleString()}\n`
          } else if (doc.name.includes('1099-DIV')) {
            dividendIncome += value
            report += `Line 3a - Dividend Income (${doc.name}): $${value.toLocaleString()}\n`
          } else if (doc.name.includes('Business')) {
            businessIncome += value
            report += `Line 8 - Business Income (${doc.name}): $${value.toLocaleString()}\n`
          }
          totalIncome += value
        }
      })
    }
  })

  report += `\nTOTAL INCOME (Line 9): $${totalIncome.toLocaleString()}\n\n`

  // ADJUSTMENTS TO INCOME (Form 1040 Lines 10-22)
  report += `PART II - ADJUSTMENTS TO INCOME (Form 1040, Lines 10-22)\n`
  report += `${'='.repeat(50)}\n`
  let totalAdjustments = 0
  report += `Line 10a - IRA Deduction: $0 (Not provided)\n`
  report += `Line 11 - Student Loan Interest: $0 (Not provided)\n`
  report += `Line 12 - Tuition and Fees: $0 (Not provided)\n`
  report += `\nTOTAL ADJUSTMENTS (Line 22): $${totalAdjustments.toLocaleString()}\n`
  
  const adjustedGrossIncome = totalIncome - totalAdjustments
  report += `ADJUSTED GROSS INCOME (Line 11): $${adjustedGrossIncome.toLocaleString()}\n\n`

  // DEDUCTIONS (Form 1040 Lines 12-14)
  report += `PART III - DEDUCTIONS (Form 1040, Lines 12-14)\n`
  report += `${'='.repeat(45)}\n`
  
  let itemizedDeductions = 0
  documents.forEach(doc => {
    if (doc.analysis && doc.category === 'Deductions') {
      const amounts = doc.analysis.match(/\$[\d,]+\.?\d*/g) || []
      amounts.forEach((amount: string) => {
        const value = parseFloat(amount.replace(/[$,]/g, ''))
        if (value > 0) {
          itemizedDeductions += value
          if (doc.name.includes('Mortgage')) {
            report += `Schedule A - Mortgage Interest: $${value.toLocaleString()}\n`
          } else if (doc.name.includes('Charitable')) {
            report += `Schedule A - Charitable Contributions: $${value.toLocaleString()}\n`
          } else if (doc.name.includes('Medical')) {
            report += `Schedule A - Medical Expenses: $${value.toLocaleString()}\n`
          } else if (doc.name.includes('Property Tax')) {
            report += `Schedule A - State/Local Taxes: $${value.toLocaleString()}\n`
          }
        }
      })
    }
  })

  const standardDeduction2024 = personalInfo.filingStatus === 'married' ? 29200 : 14600
  const useItemized = itemizedDeductions > standardDeduction2024
  const finalDeduction = useItemized ? itemizedDeductions : standardDeduction2024

  report += `\nItemized Deductions Total: $${itemizedDeductions.toLocaleString()}\n`
  report += `Standard Deduction (${taxYear}): $${standardDeduction2024.toLocaleString()}\n`
  report += `RECOMMENDED: ${useItemized ? 'Itemize' : 'Standard'} Deduction\n`
  report += `Line 12 - Deduction Amount: $${finalDeduction.toLocaleString()}\n\n`

  // TAXABLE INCOME AND TAX CALCULATION
  const taxableIncome = Math.max(0, adjustedGrossIncome - finalDeduction)
  report += `PART IV - TAX CALCULATION\n`
  report += `${'='.repeat(30)}\n`
  report += `Line 15 - Taxable Income: $${taxableIncome.toLocaleString()}\n`

  // 2024 Tax Brackets (Single)
  let federalTax = 0
  if (personalInfo.filingStatus === 'single' || !personalInfo.filingStatus) {
    if (taxableIncome <= 11600) {
      federalTax = taxableIncome * 0.10
    } else if (taxableIncome <= 47150) {
      federalTax = 1160 + (taxableIncome - 11600) * 0.12
    } else if (taxableIncome <= 100525) {
      federalTax = 5426 + (taxableIncome - 47150) * 0.22
    } else if (taxableIncome <= 191950) {
      federalTax = 17168.50 + (taxableIncome - 100525) * 0.24
    } else {
      federalTax = 39110.50 + (taxableIncome - 191950) * 0.32
    }
  }

  report += `Line 16 - Federal Income Tax: $${Math.round(federalTax).toLocaleString()}\n`

  // WITHHOLDING AND PAYMENTS
  let totalWithholding = 0
  documents.forEach(doc => {
    if (doc.analysis && doc.name.includes('W-2')) {
      const withheld = doc.analysis.match(/withheld[:\s]*\$[\d,]+/i)
      if (withheld) {
        const amount = parseFloat(withheld[0].replace(/[^0-9.]/g, ''))
        totalWithholding += amount
      }
    }
  })

  report += `\nPART V - PAYMENTS AND REFUND\n`
  report += `${'='.repeat(35)}\n`
  report += `Line 25a - Federal Tax Withheld: $${totalWithholding.toLocaleString()}\n`
  report += `Line 25b - Estimated Tax Payments: $0\n`
  report += `Line 33 - Total Payments: $${totalWithholding.toLocaleString()}\n\n`

  const refundOrOwed = totalWithholding - federalTax
  if (refundOrOwed > 0) {
    report += `LINE 34 - REFUND DUE: $${Math.round(refundOrOwed).toLocaleString()}\n`
  } else {
    report += `LINE 37 - AMOUNT YOU OWE: $${Math.round(Math.abs(refundOrOwed)).toLocaleString()}\n`
  }

  // IRS FILING REQUIREMENTS
  report += `\n${'='.repeat(60)}\n`
  report += `IRS FILING REQUIREMENTS AND DEADLINES\n`
  report += `${'='.repeat(60)}\n`
  report += `• Filing Deadline: April 15, ${taxYear + 1}\n`
  report += `• Extension Deadline: October 15, ${taxYear + 1}\n`
  report += `• Required if income > $${personalInfo.filingStatus === 'married' ? '29,200' : '14,600'}\n`
  report += `• Keep records for 3-7 years after filing\n`
  report += `• File electronically for faster processing\n\n`

  // REQUIRED FORMS AND SCHEDULES
  report += `REQUIRED FORMS AND SCHEDULES:\n`
  report += `${'='.repeat(35)}\n`
  report += `• Form 1040 - U.S. Individual Income Tax Return\n`
  if (useItemized) {
    report += `• Schedule A - Itemized Deductions\n`
  }
  if (businessIncome > 0) {
    report += `• Schedule C - Business Income/Loss\n`
  }
  if (interestIncome > 1500 || dividendIncome > 1500) {
    report += `• Schedule B - Interest and Dividend Income\n`
  }

  // DOCUMENT VERIFICATION
  report += `\nDOCUMENT VERIFICATION CHECKLIST:\n`
  report += `${'='.repeat(40)}\n`
  documents.forEach(doc => {
    const status = doc.analysis ? '✓ VERIFIED' : '⚠ MISSING'
    report += `${status} - ${doc.name}\n`
  })

  // PROFESSIONAL RECOMMENDATIONS
  report += `\nPROFESSIONAL RECOMMENDATIONS:\n`
  report += `${'='.repeat(35)}\n`
  if (taxableIncome > 100000) {
    report += `• Consider consulting a CPA due to higher income\n`
  }
  if (useItemized) {
    report += `• Review itemized deductions with tax professional\n`
  }
  if (businessIncome > 0) {
    report += `• Business income requires Schedule C filing\n`
  }
  report += `• Double-check all calculations before filing\n`
  report += `• Consider tax software or professional preparation\n`
  report += `• Make estimated payments if you owe > $1,000\n\n`

  // DISCLAIMER
  report += `${'='.repeat(60)}\n`
  report += `IMPORTANT LEGAL DISCLAIMER\n`
  report += `${'='.repeat(60)}\n`
  report += `This worksheet is for informational purposes only and does not\n`
  report += `constitute professional tax advice. Calculations are estimates\n`
  report += `based on available information. Consult a qualified tax\n`
  report += `professional for accurate tax preparation and filing.\n`
  report += `\nThe IRS requires accurate reporting of all income and\n`
  report += `deductions. Verify all amounts before filing your return.\n`

  return report
}