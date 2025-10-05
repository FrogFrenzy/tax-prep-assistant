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
    } else if (filename.toLowerCase().match(/\.(txt|csv)$/)) {
      extractedText = fileBuffer.toString('utf-8')
    } else {
      extractedText = 'File type not supported for text extraction. Tax Chicken will analyze based on document type.'
    }

    // Sophisticated analysis based on extracted text and document type
    const analysis = performSophisticatedAnalysis(extractedText, documentType, filename)

    return NextResponse.json({
      success: true,
      analysis,
      extractedText: extractedText.substring(0, 1000) + (extractedText.length > 1000 ? '...' : ''),
      textLength: extractedText.length,
      message: '🐔 Tax Chicken has analyzed your document with vibe-coded intelligence!'
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({
      success: false,
      error: 'Tax Chicken failed to analyze document: ' + (error as Error).message
    })
  }
}

function performSophisticatedAnalysis(text: string, documentType: string, filename: string): string {
  const upperText = text.toUpperCase()
  let analysis = `🐔 Tax Chicken Sophisticated Analysis for ${documentType}:\n`
  analysis += `${'='.repeat(50)}\n\n`

  // Detect tax year
  const yearMatches = text.match(/20\d{2}/g)
  const taxYear = yearMatches ? Math.max(...yearMatches.map(y => parseInt(y))) : new Date().getFullYear() - 1
  analysis += `📅 Tax Year Detected: ${taxYear}\n\n`

  // W-2 Form Analysis
  if (upperText.includes('W-2') || upperText.includes('WAGE') || documentType.includes('W-2')) {
    analysis += `✓ W-2 WAGE AND TAX STATEMENT DETECTED\n`
    analysis += `${'─'.repeat(35)}\n`
    
    // Extract wage information with sophisticated regex
    const wagePatterns = [
      /wages[,\s]*tips[,\s]*other compensation[:\s]*\$?([\d,]+\.?\d*)/i,
      /federal income tax withheld[:\s]*\$?([\d,]+\.?\d*)/i,
      /social security wages[:\s]*\$?([\d,]+\.?\d*)/i,
      /medicare wages[:\s]*\$?([\d,]+\.?\d*)/i,
      /box\s*1[:\s]*\$?([\d,]+\.?\d*)/i,
      /box\s*2[:\s]*\$?([\d,]+\.?\d*)/i
    ]

    let totalWages = 0
    let federalWithheld = 0

    wagePatterns.forEach((pattern, index) => {
      const match = text.match(pattern)
      if (match) {
        const amount = parseFloat(match[1].replace(/,/g, ''))
        if (index === 0 || index === 4) { // Wages
          totalWages = Math.max(totalWages, amount)
          analysis += `• Wages, Tips, Other Compensation: $${amount.toLocaleString()}\n`
        } else if (index === 1 || index === 5) { // Federal withholding
          federalWithheld = Math.max(federalWithheld, amount)
          analysis += `• Federal Income Tax Withheld: $${amount.toLocaleString()}\n`
        }
      }
    })

    // Look for employer information
    const employerMatch = text.match(/employer['\s]*s?\s*name[,\s]*address[,\s]*and\s*zip\s*code[:\s]*([^\n]+)/i)
    if (employerMatch) {
      analysis += `• Employer: ${employerMatch[1].trim()}\n`
    }

    analysis += `\n🐔 Tax Chicken W-2 Insights:\n`
    if (totalWages > 0) {
      const effectiveRate = federalWithheld / totalWages * 100
      analysis += `• Effective withholding rate: ${effectiveRate.toFixed(1)}%\n`
      if (effectiveRate < 10) {
        analysis += `• ⚠️ Low withholding - you may owe taxes\n`
      } else if (effectiveRate > 25) {
        analysis += `• 💰 High withholding - likely refund coming\n`
      }
    }
    analysis += `• Required for Form 1040, Line 1a\n`
    analysis += `• Keep for 7 years after filing\n\n`
  }

  // 1099 Form Analysis
  else if (upperText.includes('1099') || documentType.includes('1099')) {
    analysis += `✓ 1099 INFORMATION RETURN DETECTED\n`
    analysis += `${'─'.repeat(35)}\n`

    // Detect 1099 type
    if (upperText.includes('1099-INT') || upperText.includes('INTEREST')) {
      analysis += `• Form Type: 1099-INT (Interest Income)\n`
      const interestMatch = text.match(/interest income[:\s]*\$?([\d,]+\.?\d*)/i)
      if (interestMatch) {
        const amount = parseFloat(interestMatch[1].replace(/,/g, ''))
        analysis += `• Interest Income: $${amount.toLocaleString()}\n`
        analysis += `• Report on Form 1040, Line 2b\n`
        if (amount > 1500) {
          analysis += `• ⚠️ Must file Schedule B (over $1,500)\n`
        }
      }
    } else if (upperText.includes('1099-DIV') || upperText.includes('DIVIDEND')) {
      analysis += `• Form Type: 1099-DIV (Dividend Income)\n`
      const dividendMatch = text.match(/total ordinary dividends[:\s]*\$?([\d,]+\.?\d*)/i)
      if (dividendMatch) {
        const amount = parseFloat(dividendMatch[1].replace(/,/g, ''))
        analysis += `• Ordinary Dividends: $${amount.toLocaleString()}\n`
        analysis += `• Report on Form 1040, Line 3b\n`
      }
    } else if (upperText.includes('1099-MISC') || upperText.includes('MISCELLANEOUS')) {
      analysis += `• Form Type: 1099-MISC (Miscellaneous Income)\n`
      analysis += `• May require Schedule C if business income\n`
    }

    analysis += `\n🐔 Tax Chicken 1099 Insights:\n`
    analysis += `• Additional income beyond wages\n`
    analysis += `• May affect your tax bracket\n`
    analysis += `• No taxes withheld - plan accordingly\n\n`
  }

  // Mortgage Interest (1098) Analysis
  else if (upperText.includes('1098') || upperText.includes('MORTGAGE') || documentType.includes('Mortgage')) {
    analysis += `✓ MORTGAGE INTEREST STATEMENT (1098) DETECTED\n`
    analysis += `${'─'.repeat(45)}\n`

    const mortgageInterestMatch = text.match(/mortgage interest received[:\s]*\$?([\d,]+\.?\d*)/i)
    if (mortgageInterestMatch) {
      const amount = parseFloat(mortgageInterestMatch[1].replace(/,/g, ''))
      analysis += `• Mortgage Interest Paid: $${amount.toLocaleString()}\n`
      analysis += `• Deductible on Schedule A, Line 8a\n`
      
      if (amount > 14600) { // 2024 standard deduction single
        analysis += `• 💰 Likely beneficial to itemize deductions\n`
      } else {
        analysis += `• Compare with standard deduction ($14,600 single)\n`
      }
    }

    const pointsMatch = text.match(/points paid on purchase[:\s]*\$?([\d,]+\.?\d*)/i)
    if (pointsMatch) {
      const points = parseFloat(pointsMatch[1].replace(/,/g, ''))
      analysis += `• Points Paid: $${points.toLocaleString()}\n`
      analysis += `• May be deductible in year paid\n`
    }

    analysis += `\n🐔 Tax Chicken Mortgage Insights:\n`
    analysis += `• Mortgage interest is tax-deductible\n`
    analysis += `• Consider itemizing if total deductions > standard\n`
    analysis += `• Keep records for home sale basis calculation\n\n`
  }

  // Property Tax Analysis
  else if (upperText.includes('PROPERTY TAX') || upperText.includes('REAL ESTATE TAX') || documentType.includes('Property Tax')) {
    analysis += `✓ PROPERTY TAX RECORDS DETECTED\n`
    analysis += `${'─'.repeat(35)}\n`

    const taxAmounts = text.match(/\$[\d,]+\.?\d*/g)
    if (taxAmounts) {
      const amounts = taxAmounts.map(amt => parseFloat(amt.replace(/[$,]/g, ''))).filter(amt => amt > 100)
      const maxAmount = Math.max(...amounts)
      analysis += `• Estimated Property Tax: $${maxAmount.toLocaleString()}\n`
      analysis += `• Deductible on Schedule A, Line 5b\n`
      analysis += `• Limited to $10,000 SALT deduction cap\n`
    }

    analysis += `\n🐔 Tax Chicken Property Tax Insights:\n`
    analysis += `• State and Local Tax (SALT) deduction\n`
    analysis += `• Combined limit of $10,000 with state income tax\n`
    analysis += `• Consider timing of payments for tax planning\n\n`
  }

  // Charitable Donations Analysis
  else if (upperText.includes('CHARITABLE') || upperText.includes('DONATION') || upperText.includes('CONTRIBUTION') || documentType.includes('Charitable')) {
    analysis += `✓ CHARITABLE CONTRIBUTION RECORDS DETECTED\n`
    analysis += `${'─'.repeat(45)}\n`

    const donationAmounts = text.match(/\$[\d,]+\.?\d*/g)
    if (donationAmounts) {
      const amounts = donationAmounts.map(amt => parseFloat(amt.replace(/[$,]/g, ''))).filter(amt => amt > 0)
      const totalDonations = amounts.reduce((sum, amt) => sum + amt, 0)
      analysis += `• Total Charitable Contributions: $${totalDonations.toLocaleString()}\n`
      analysis += `• Deductible on Schedule A, Line 11\n`
      
      if (amounts.some(amt => amt >= 250)) {
        analysis += `• ⚠️ Need written acknowledgment for donations ≥ $250\n`
      }
      if (amounts.some(amt => amt >= 500)) {
        analysis += `• ⚠️ Need Form 8283 for non-cash donations ≥ $500\n`
      }
    }

    analysis += `\n🐔 Tax Chicken Charity Insights:\n`
    analysis += `• Deductible up to 60% of AGI for cash donations\n`
    analysis += `• Keep detailed records and receipts\n`
    analysis += `• Consider bunching donations in alternate years\n\n`
  }

  // Medical Expenses Analysis
  else if (upperText.includes('MEDICAL') || upperText.includes('HEALTH') || documentType.includes('Medical')) {
    analysis += `✓ MEDICAL EXPENSE RECORDS DETECTED\n`
    analysis += `${'─'.repeat(35)}\n`

    const medicalAmounts = text.match(/\$[\d,]+\.?\d*/g)
    if (medicalAmounts) {
      const amounts = medicalAmounts.map(amt => parseFloat(amt.replace(/[$,]/g, ''))).filter(amt => amt > 0)
      const totalMedical = amounts.reduce((sum, amt) => sum + amt, 0)
      analysis += `• Total Medical Expenses: $${totalMedical.toLocaleString()}\n`
      analysis += `• Deductible on Schedule A, Line 1\n`
      analysis += `• Only amount exceeding 7.5% of AGI is deductible\n`
    }

    analysis += `\n🐔 Tax Chicken Medical Insights:\n`
    analysis += `• High threshold makes deduction difficult\n`
    analysis += `• Include insurance premiums, prescriptions, travel\n`
    analysis += `• Consider HSA contributions for tax savings\n\n`
  }

  // Business Expenses Analysis
  else if (upperText.includes('BUSINESS') || upperText.includes('EXPENSE') || documentType.includes('Business')) {
    analysis += `✓ BUSINESS EXPENSE RECORDS DETECTED\n`
    analysis += `${'─'.repeat(35)}\n`

    analysis += `• Business expenses may be deductible\n`
    analysis += `• Report on Schedule C (sole proprietorship)\n`
    analysis += `• Keep detailed records and receipts\n`

    // Look for common business expense categories
    if (upperText.includes('TRAVEL') || upperText.includes('MILEAGE')) {
      analysis += `• Travel/Transportation expenses found\n`
    }
    if (upperText.includes('OFFICE') || upperText.includes('SUPPLIES')) {
      analysis += `• Office supplies/equipment expenses found\n`
    }
    if (upperText.includes('MEAL') || upperText.includes('ENTERTAINMENT')) {
      analysis += `• Meal/entertainment expenses (50% deductible)\n`
    }

    analysis += `\n🐔 Tax Chicken Business Insights:\n`
    analysis += `• Must be ordinary and necessary for business\n`
    analysis += `• Consider home office deduction if applicable\n`
    analysis += `• Separate business and personal expenses\n\n`
  }

  // Generic document analysis
  else {
    analysis += `✓ TAX DOCUMENT PROCESSED\n`
    analysis += `${'─'.repeat(25)}\n`
    analysis += `• Document appears to be tax-related\n`
    analysis += `• Tax Chicken has catalogued this document\n`
    
    // Look for any dollar amounts
    const amounts = text.match(/\$[\d,]+\.?\d*/g)
    if (amounts && amounts.length > 0) {
      const values = amounts.map(amt => parseFloat(amt.replace(/[$,]/g, ''))).filter(amt => amt > 0)
      if (values.length > 0) {
        analysis += `• Financial amounts detected: ${amounts.slice(0, 5).join(', ')}\n`
      }
    }

    analysis += `\n🐔 Tax Chicken General Insights:\n`
    analysis += `• Keep all tax documents organized\n`
    analysis += `• Verify accuracy of all information\n`
    analysis += `• Consult tax professional for complex situations\n\n`
  }

  // File information
  analysis += `📄 DOCUMENT DETAILS:\n`
  analysis += `${'─'.repeat(20)}\n`
  analysis += `• File: ${filename}\n`
  analysis += `• Text extracted: ${text.length > 0 ? 'Yes' : 'No'} (${text.length} characters)\n`
  analysis += `• Processing date: ${new Date().toLocaleDateString()}\n\n`

  // Tax Chicken recommendations
  analysis += `🐔 TAX CHICKEN RECOMMENDATIONS:\n`
  analysis += `${'─'.repeat(35)}\n`
  analysis += `• Verify all extracted information for accuracy\n`
  analysis += `• Keep original documents for IRS records\n`
  analysis += `• Consider professional review for complex returns\n`
  analysis += `• File before April 15th deadline\n`
  analysis += `• Tax Chicken provides guidance, not official tax advice\n`

  return analysis
}