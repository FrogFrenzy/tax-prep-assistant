import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { documents, personalInfo } = await request.json()

    // Generate sophisticated tax return with detailed analysis
    const taxReturn = generateSophisticatedTaxReturn(documents, personalInfo)

    return NextResponse.json({
      success: true,
      taxReturn,
      generatedAt: new Date().toISOString(),
      message: '🐔 Tax Chicken has generated your sophisticated IRS Form 1040 worksheet!'
    })

  } catch (error) {
    console.error('Tax return generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Tax Chicken failed to generate tax return: ' + (error as Error).message
    })
  }
}

function generateSophisticatedTaxReturn(documents: any[], personalInfo: any): string {
  const currentYear = new Date().getFullYear()
  const taxYear = personalInfo.taxYear || currentYear - 1

  let report = `🐔 TAX CHICKEN SOPHISTICATED IRS FORM 1040 PREPARATION WORKSHEET\n`
  report += `${'='.repeat(75)}\n`
  report += `TAX YEAR ${taxYear} - COMPREHENSIVE ANALYSIS\n`
  report += `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`
  report += `Filing Status: ${personalInfo.filingStatus || 'Single'}\n`
  report += `Prepared using Tax Chicken v1.0 - Vibe Coded Tax Intelligence\n`
  report += `${'='.repeat(75)}\n\n`

  // DOCUMENT ANALYSIS SUMMARY
  report += `📋 DOCUMENT ANALYSIS SUMMARY\n`
  report += `${'─'.repeat(35)}\n`
  let totalDocuments = 0
  let analyzedDocuments = 0
  let documentsWithText = 0

  documents.forEach(doc => {
    totalDocuments++
    if (doc.analysis) {
      analyzedDocuments++
      report += `✓ ${doc.name}: ANALYZED\n`
      if (doc.analysis.includes('characters)') && !doc.analysis.includes('(0 characters)')) {
        documentsWithText++
        report += `  └─ Text extracted and processed\n`
      }
    } else {
      report += `○ ${doc.name}: PENDING ANALYSIS\n`
    }
  })

  report += `\nDocument Statistics:\n`
  report += `• Total Documents: ${totalDocuments}\n`
  report += `• Analyzed Documents: ${analyzedDocuments}\n`
  report += `• Documents with Text Extraction: ${documentsWithText}\n`
  report += `• Completion Rate: ${Math.round((analyzedDocuments / totalDocuments) * 100)}%\n\n`

  // SOPHISTICATED INCOME ANALYSIS (Form 1040 Lines 1-8)
  report += `💰 PART I - INCOME ANALYSIS (Form 1040, Lines 1-8)\n`
  report += `${'─'.repeat(50)}\n`
  
  let totalIncome = 0
  let wagesIncome = 0
  let interestIncome = 0
  let dividendIncome = 0
  let businessIncome = 0
  let otherIncome = 0
  let federalWithholding = 0

  documents.forEach(doc => {
    if (doc.analysis && doc.category === 'Income') {
      // Extract sophisticated income data from analysis
      const wageMatch = doc.analysis.match(/Wages[,\s]*Tips[,\s]*Other Compensation[:\s]*\$?([\d,]+\.?\d*)/i)
      const federalMatch = doc.analysis.match(/Federal Income Tax Withheld[:\s]*\$?([\d,]+\.?\d*)/i)
      const interestMatch = doc.analysis.match(/Interest Income[:\s]*\$?([\d,]+\.?\d*)/i)
      const dividendMatch = doc.analysis.match(/Ordinary Dividends[:\s]*\$?([\d,]+\.?\d*)/i)

      if (wageMatch) {
        const amount = parseFloat(wageMatch[1].replace(/,/g, ''))
        wagesIncome += amount
        report += `Line 1a - Wages, Salaries, Tips (${doc.name}):\n`
        report += `         $${amount.toLocaleString()}\n`
      }

      if (federalMatch) {
        const amount = parseFloat(federalMatch[1].replace(/,/g, ''))
        federalWithholding += amount
      }

      if (interestMatch) {
        const amount = parseFloat(interestMatch[1].replace(/,/g, ''))
        interestIncome += amount
        report += `Line 2b - Taxable Interest (${doc.name}):\n`
        report += `         $${amount.toLocaleString()}\n`
      }

      if (dividendMatch) {
        const amount = parseFloat(dividendMatch[1].replace(/,/g, ''))
        dividendIncome += amount
        report += `Line 3b - Ordinary Dividends (${doc.name}):\n`
        report += `         $${amount.toLocaleString()}\n`
      }

      // Look for other income patterns
      const amounts = doc.analysis.match(/\$[\d,]+\.?\d*/g) || []
      amounts.forEach((amountStr: string) => {
        const amount = parseFloat(amountStr.replace(/[$,]/g, ''))
        if (amount > 100 && !wageMatch && !interestMatch && !dividendMatch) {
          otherIncome += amount
        }
      })
    }
  })

  totalIncome = wagesIncome + interestIncome + dividendIncome + businessIncome + otherIncome

  if (otherIncome > 0) {
    report += `Line 8 - Other Income: $${otherIncome.toLocaleString()}\n`
  }

  report += `\n📊 INCOME SUMMARY:\n`
  report += `Line 9 - Total Income: $${totalIncome.toLocaleString()}\n`
  if (federalWithholding > 0) {
    const effectiveWithholdingRate = (federalWithholding / totalIncome) * 100
    report += `Federal Tax Withheld: $${federalWithholding.toLocaleString()}\n`
    report += `Effective Withholding Rate: ${effectiveWithholdingRate.toFixed(1)}%\n`
  }
  report += `\n`

  // ADJUSTMENTS TO INCOME (Form 1040 Lines 10-22)
  report += `⚖️ PART II - ADJUSTMENTS TO INCOME (Form 1040, Lines 10-22)\n`
  report += `${'─'.repeat(55)}\n`
  let totalAdjustments = 0

  // Look for common adjustments in document analysis
  documents.forEach(doc => {
    if (doc.analysis) {
      if (doc.analysis.includes('IRA') || doc.analysis.includes('RETIREMENT')) {
        report += `Line 10a - IRA Deduction: $0 (Review retirement contributions)\n`
      }
      if (doc.analysis.includes('STUDENT LOAN') || doc.analysis.includes('EDUCATION')) {
        report += `Line 11 - Student Loan Interest: $0 (Review education expenses)\n`
      }
    }
  })

  report += `\nTotal Adjustments to Income (Line 22): $${totalAdjustments.toLocaleString()}\n`
  const adjustedGrossIncome = totalIncome - totalAdjustments
  report += `ADJUSTED GROSS INCOME (Line 11): $${adjustedGrossIncome.toLocaleString()}\n\n`

  // SOPHISTICATED DEDUCTIONS ANALYSIS (Form 1040 Lines 12-14)
  report += `🏠 PART III - DEDUCTIONS ANALYSIS (Form 1040, Lines 12-14)\n`
  report += `${'─'.repeat(55)}\n`
  
  let itemizedDeductions = 0
  let mortgageInterest = 0
  let propertyTaxes = 0
  let charitableContributions = 0
  let medicalExpenses = 0
  let stateLocalTaxes = 0

  documents.forEach(doc => {
    if (doc.analysis && doc.category === 'Deductions') {
      // Extract sophisticated deduction data
      const mortgageMatch = doc.analysis.match(/Mortgage Interest Paid[:\s]*\$?([\d,]+\.?\d*)/i)
      const propertyMatch = doc.analysis.match(/Property Tax[:\s]*\$?([\d,]+\.?\d*)/i)
      const charityMatch = doc.analysis.match(/Charitable Contributions[:\s]*\$?([\d,]+\.?\d*)/i)
      const medicalMatch = doc.analysis.match(/Medical Expenses[:\s]*\$?([\d,]+\.?\d*)/i)

      if (mortgageMatch) {
        const amount = parseFloat(mortgageMatch[1].replace(/,/g, ''))
        mortgageInterest += amount
        report += `Schedule A, Line 8a - Mortgage Interest:\n`
        report += `                     $${amount.toLocaleString()} (${doc.name})\n`
      }

      if (propertyMatch) {
        const amount = parseFloat(propertyMatch[1].replace(/,/g, ''))
        propertyTaxes += amount
        report += `Schedule A, Line 5b - Property Taxes:\n`
        report += `                     $${amount.toLocaleString()} (${doc.name})\n`
      }

      if (charityMatch) {
        const amount = parseFloat(charityMatch[1].replace(/,/g, ''))
        charitableContributions += amount
        report += `Schedule A, Line 11 - Charitable Contributions:\n`
        report += `                     $${amount.toLocaleString()} (${doc.name})\n`
      }

      if (medicalMatch) {
        const amount = parseFloat(medicalMatch[1].replace(/,/g, ''))
        medicalExpenses += amount
        const medicalThreshold = adjustedGrossIncome * 0.075
        const deductibleMedical = Math.max(0, amount - medicalThreshold)
        report += `Schedule A, Line 1 - Medical Expenses:\n`
        report += `                    $${amount.toLocaleString()} (${doc.name})\n`
        report += `                    Less 7.5% AGI threshold: $${medicalThreshold.toLocaleString()}\n`
        report += `                    Deductible amount: $${deductibleMedical.toLocaleString()}\n`
        medicalExpenses = deductibleMedical
      }
    }
  })

  // SALT deduction cap
  stateLocalTaxes = Math.min(propertyTaxes, 10000)
  if (propertyTaxes > 10000) {
    report += `\n⚠️ SALT Deduction Cap Applied:\n`
    report += `Property taxes limited to $10,000 SALT cap\n`
  }

  itemizedDeductions = mortgageInterest + stateLocalTaxes + charitableContributions + medicalExpenses

  // Standard vs Itemized Decision
  const standardDeduction2024 = personalInfo.filingStatus === 'married' ? 29200 : 14600
  const useItemized = itemizedDeductions > standardDeduction2024

  report += `\n📋 DEDUCTION ANALYSIS:\n`
  report += `Itemized Deductions Total: $${itemizedDeductions.toLocaleString()}\n`
  report += `Standard Deduction (${taxYear}): $${standardDeduction2024.toLocaleString()}\n`
  report += `\n🎯 TAX CHICKEN RECOMMENDATION: ${useItemized ? 'ITEMIZE' : 'STANDARD'} DEDUCTION\n`
  report += `Savings by ${useItemized ? 'itemizing' : 'taking standard'}: $${Math.abs(itemizedDeductions - standardDeduction2024).toLocaleString()}\n`

  const finalDeduction = useItemized ? itemizedDeductions : standardDeduction2024
  report += `\nLine 12 - Deduction Amount: $${finalDeduction.toLocaleString()}\n\n`

  // SOPHISTICATED TAX CALCULATION
  const taxableIncome = Math.max(0, adjustedGrossIncome - finalDeduction)
  report += `💸 PART IV - TAX CALCULATION (2024 Tax Brackets)\n`
  report += `${'─'.repeat(45)}\n`
  report += `Line 15 - Taxable Income: $${taxableIncome.toLocaleString()}\n\n`

  // 2024 Tax Brackets with detailed calculation
  let federalTax = 0
  let marginalRate = 0
  let taxBreakdown = ''

  if (personalInfo.filingStatus === 'single' || !personalInfo.filingStatus) {
    if (taxableIncome <= 11600) {
      federalTax = taxableIncome * 0.10
      marginalRate = 10
      taxBreakdown = `10% on $${taxableIncome.toLocaleString()}`
    } else if (taxableIncome <= 47150) {
      federalTax = 1160 + (taxableIncome - 11600) * 0.12
      marginalRate = 12
      taxBreakdown = `10% on $11,600 + 12% on $${(taxableIncome - 11600).toLocaleString()}`
    } else if (taxableIncome <= 100525) {
      federalTax = 5426 + (taxableIncome - 47150) * 0.22
      marginalRate = 22
      taxBreakdown = `$5,426 + 22% on $${(taxableIncome - 47150).toLocaleString()}`
    } else if (taxableIncome <= 191950) {
      federalTax = 17168.50 + (taxableIncome - 100525) * 0.24
      marginalRate = 24
      taxBreakdown = `$17,169 + 24% on $${(taxableIncome - 100525).toLocaleString()}`
    } else {
      federalTax = 39110.50 + (taxableIncome - 191950) * 0.32
      marginalRate = 32
      taxBreakdown = `$39,111 + 32% on $${(taxableIncome - 191950).toLocaleString()}`
    }
  }

  report += `Tax Calculation Breakdown:\n`
  report += `${taxBreakdown}\n`
  report += `Line 16 - Federal Income Tax: $${Math.round(federalTax).toLocaleString()}\n`
  report += `Marginal Tax Rate: ${marginalRate}%\n`
  report += `Effective Tax Rate: ${((federalTax / adjustedGrossIncome) * 100).toFixed(1)}%\n\n`

  // PAYMENTS AND REFUND CALCULATION
  report += `💳 PART V - PAYMENTS AND REFUND CALCULATION\n`
  report += `${'─'.repeat(45)}\n`
  report += `Line 25a - Federal Tax Withheld: $${federalWithholding.toLocaleString()}\n`
  report += `Line 25b - Estimated Tax Payments: $0\n`
  report += `Line 33 - Total Payments: $${federalWithholding.toLocaleString()}\n\n`

  const refundOrOwed = federalWithholding - federalTax
  if (refundOrOwed > 0) {
    report += `🎉 LINE 34 - REFUND DUE: $${Math.round(refundOrOwed).toLocaleString()}\n`
    report += `Expected refund processing: 21 days (e-file) or 6-8 weeks (paper)\n`
  } else {
    report += `💸 LINE 37 - AMOUNT YOU OWE: $${Math.round(Math.abs(refundOrOwed)).toLocaleString()}\n`
    report += `Payment due: April 15, ${taxYear + 1}\n`
    if (Math.abs(refundOrOwed) > 1000) {
      report += `⚠️ Consider quarterly estimated payments for next year\n`
    }
  }

  // SOPHISTICATED RECOMMENDATIONS
  report += `\n🐔 TAX CHICKEN SOPHISTICATED RECOMMENDATIONS\n`
  report += `${'─'.repeat(50)}\n`

  if (adjustedGrossIncome > 100000) {
    report += `• High income earner - consider tax professional consultation\n`
  }
  if (useItemized) {
    report += `• Itemizing saves $${(itemizedDeductions - standardDeduction2024).toLocaleString()} vs standard deduction\n`
  }
  if (marginalRate >= 22) {
    report += `• Consider tax-advantaged retirement contributions\n`
  }
  if (federalWithholding / totalIncome < 0.15) {
    report += `• Low withholding rate - consider increasing withholding\n`
  }
  if (businessIncome > 0) {
    report += `• Business income requires Schedule C filing\n`
  }
  if (interestIncome > 1500 || dividendIncome > 1500) {
    report += `• Must file Schedule B for interest/dividend details\n`
  }

  // REQUIRED FORMS AND SCHEDULES
  report += `\n📋 REQUIRED FORMS AND SCHEDULES\n`
  report += `${'─'.repeat(35)}\n`
  report += `• Form 1040 - U.S. Individual Income Tax Return\n`
  if (useItemized) {
    report += `• Schedule A - Itemized Deductions\n`
  }
  if (businessIncome > 0) {
    report += `• Schedule C - Profit or Loss from Business\n`
  }
  if (interestIncome > 1500 || dividendIncome > 1500) {
    report += `• Schedule B - Interest and Ordinary Dividends\n`
  }

  // FILING INFORMATION
  report += `\n📅 FILING INFORMATION\n`
  report += `${'─'.repeat(20)}\n`
  report += `• Filing Deadline: April 15, ${taxYear + 1}\n`
  report += `• Extension Deadline: October 15, ${taxYear + 1}\n`
  report += `• Record Retention: Keep for 3-7 years\n`
  report += `• E-file for faster processing and confirmation\n\n`

  // FINAL DISCLAIMER
  report += `${'='.repeat(75)}\n`
  report += `🐔 TAX CHICKEN LEGAL DISCLAIMER\n`
  report += `${'='.repeat(75)}\n`
  report += `This sophisticated worksheet is for informational purposes only and\n`
  report += `does not constitute professional tax advice. Tax Chicken uses advanced\n`
  report += `pattern recognition and document analysis, but all calculations should\n`
  report += `be verified by a qualified tax professional.\n\n`
  report += `The IRS requires accurate reporting of all income and deductions.\n`
  report += `Verify all extracted amounts against original documents before filing.\n`
  report += `Tax Chicken provides vibe-coded intelligence, not official tax advice.\n\n`
  report += `Generated by Tax Chicken v1.0 - Vibe Coded Tax Return Assistant\n`
  report += `© ${new Date().getFullYear()} - Making taxes less scary, one document at a time! 🐔\n`

  return report
}