import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const documentId = data.get('documentId') as string

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Save file with document ID prefix and timestamp
    const timestamp = Date.now()
    const filename = `${documentId}_${timestamp}_${file.name}`
    const path = join(uploadsDir, filename)
    
    await writeFile(path, buffer)

    return NextResponse.json({ 
      success: true, 
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      message: '🐔 File uploaded successfully to Tax Chicken!' 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload file to Tax Chicken servers' 
    })
  }
}