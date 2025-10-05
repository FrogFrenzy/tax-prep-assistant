import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

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
    
    // Save file with document ID prefix
    const filename = `${documentId}_${file.name}`
    const path = join(uploadsDir, filename)
    
    await writeFile(path, buffer)

    return NextResponse.json({ 
      success: true, 
      filename,
      message: 'File uploaded successfully' 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload file' 
    })
  }
}