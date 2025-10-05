'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { FileText, Upload, CheckCircle, AlertCircle, Calculator, DollarSign, FileUp, Brain, Download } from 'lucide-react'
import AuthButton from './components/AuthButton'

interface Document {
    id: string
    name: string
    category: string
    status: 'pending' | 'uploaded' | 'analyzed' | 'verified'
    required: boolean
    filename?: string
    analysis?: string
    uploadedAt?: string
}

const TAX_DOCUMENTS: Document[] = [
    { id: '1', name: 'W-2 Forms', category: 'Income', status: 'pending', required: true },
    { id: '2', name: '1099-INT (Interest)', category: 'Income', status: 'pending', required: false },
    { id: '3', name: '1099-DIV (Dividends)', category: 'Income', status: 'pending', required: false },
    { id: '4', name: 'Mortgage Interest (1098)', category: 'Deductions', status: 'pending', required: false },
    { id: '5', name: 'Property Tax Records', category: 'Deductions', status: 'pending', required: false },
    { id: '6', name: 'Charitable Donations', category: 'Deductions', status: 'pending', required: false },
    { id: '7', name: 'Medical Expenses', category: 'Deductions', status: 'pending', required: false },
    { id: '8', name: 'Business Expenses', category: 'Business', status: 'pending', required: false },
]

export default function Home() {
    const { data: session } = useSession()
    const [documents, setDocuments] = useState<Document[]>(TAX_DOCUMENTS)
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [uploading, setUploading] = useState<string | null>(null)
    const [analyzing, setAnalyzing] = useState<string | null>(null)
    const [taxReturn, setTaxReturn] = useState<string | null>(null)
    const [generatingReturn, setGeneratingReturn] = useState(false)

    const categories = ['All', 'Income', 'Deductions', 'Business']

    const updateDocumentStatus = (id: string, status: Document['status'], additionalData?: Partial<Document>) => {
        setDocuments(docs =>
            docs.map(doc => doc.id === id ? { ...doc, status, ...additionalData } : doc)
        )
    }

    const handleFileUpload = async (documentId: string, file: File) => {
        setUploading(documentId)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('documentId', documentId)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const result = await response.json()

            if (result.success) {
                updateDocumentStatus(documentId, 'uploaded', {
                    filename: result.filename,
                    uploadedAt: new Date().toISOString()
                })
            } else {
                alert('Upload failed: ' + result.error)
            }
        } catch (error) {
            alert('Upload failed: ' + error)
        } finally {
            setUploading(null)
        }
    }

    const handleAnalyzeDocument = async (document: Document) => {
        if (!document.filename) return

        setAnalyzing(document.id)

        try {
            const response = await fetch('/api/analyze-simple', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: document.filename,
                    documentType: document.name
                }),
            })

            const result = await response.json()

            if (result.success) {
                updateDocumentStatus(document.id, 'analyzed', {
                    analysis: result.analysis
                })
            } else {
                alert('Analysis failed: ' + result.error)
            }
        } catch (error) {
            alert('Analysis failed: ' + error)
        } finally {
            setAnalyzing(null)
        }
    }

    const generateTaxReturn = async () => {
        setGeneratingReturn(true)

        try {
            const analyzedDocs = documents.filter(doc => doc.analysis)

            const response = await fetch('/api/generate-return-simple', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documents: analyzedDocs,
                    personalInfo: {
                        filingStatus: 'single', // This could be a form input
                        taxYear: 2024
                    }
                }),
            })

            const result = await response.json()

            if (result.success) {
                setTaxReturn(result.taxReturn)
            } else {
                alert('Tax return generation failed: ' + result.error)
            }
        } catch (error) {
            alert('Tax return generation failed: ' + error)
        } finally {
            setGeneratingReturn(false)
        }
    }

    const filteredDocuments = selectedCategory === 'All'
        ? documents
        : documents.filter(doc => doc.category === selectedCategory)

    const completedCount = documents.filter(doc => doc.status === 'analyzed' || doc.status === 'verified').length
    const totalRequired = documents.filter(doc => doc.required).length
    const completedRequired = documents.filter(doc => doc.required && (doc.status === 'analyzed' || doc.status === 'verified')).length
    const analyzedCount = documents.filter(doc => doc.status === 'analyzed').length

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <header className="text-center mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div></div>
                        <AuthButton />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Tax Prep Assistant</h1>
                    <p className="text-gray-600">Organize and track your tax documents efficiently</p>
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <p className="text-green-800 text-sm">
                            ✨ No setup required! Upload documents and get instant analysis and tax return generation.
                        </p>
                    </div>
                </header>

                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Documents Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{completedCount}/{documents.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <AlertCircle className="h-8 w-8 text-orange-500 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Required Documents</p>
                                <p className="text-2xl font-bold text-gray-900">{completedRequired}/{totalRequired}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <Calculator className="h-8 w-8 text-blue-500 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Progress</p>
                                <p className="text-2xl font-bold text-gray-900">{Math.round((completedCount / documents.length) * 100)}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map(document => (
                        <div key={document.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <FileText className="h-6 w-6 text-gray-400 mr-3" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{document.name}</h3>
                                            <p className="text-sm text-gray-500">{document.category}</p>
                                        </div>
                                    </div>
                                    {document.required && (
                                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                                            Required
                                        </span>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${document.status === 'verified'
                                        ? 'bg-green-100 text-green-800'
                                        : document.status === 'analyzed'
                                            ? 'bg-blue-100 text-blue-800'
                                            : document.status === 'uploaded'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {document.status === 'verified' && <CheckCircle className="h-4 w-4 mr-1" />}
                                        {document.status === 'analyzed' && <Brain className="h-4 w-4 mr-1" />}
                                        {document.status === 'uploaded' && <Upload className="h-4 w-4 mr-1" />}
                                        {document.status === 'pending' && <AlertCircle className="h-4 w-4 mr-1" />}
                                        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {document.status === 'pending' && (
                                        <div>
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png,.txt"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) handleFileUpload(document.id, file)
                                                }}
                                                className="hidden"
                                                id={`file-${document.id}`}
                                            />
                                            <label
                                                htmlFor={`file-${document.id}`}
                                                className={`flex-1 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium cursor-pointer flex items-center justify-center ${uploading === document.id ? 'opacity-50' : ''
                                                    }`}
                                            >
                                                <FileUp className="h-4 w-4 mr-2" />
                                                {uploading === document.id ? 'Uploading...' : 'Upload Document'}
                                            </label>
                                        </div>
                                    )}

                                    {document.status === 'uploaded' && (
                                        <button
                                            onClick={() => handleAnalyzeDocument(document)}
                                            disabled={analyzing === document.id}
                                            className={`w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium flex items-center justify-center ${analyzing === document.id ? 'opacity-50' : ''
                                                }`}
                                        >
                                            <Brain className="h-4 w-4 mr-2" />
                                            {analyzing === document.id ? 'Analyzing...' : 'Analyze Document'}
                                        </button>
                                    )}

                                    {document.status === 'analyzed' && (
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => updateDocumentStatus(document.id, 'verified')}
                                                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                            >
                                                Mark as Verified
                                            </button>
                                            {document.analysis && (
                                                <div className="bg-gray-50 p-3 rounded text-xs">
                                                    <strong>AI Analysis:</strong>
                                                    <p className="mt-1 text-gray-600">{document.analysis.substring(0, 150)}...</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {document.status === 'verified' && (
                                        <button
                                            onClick={() => updateDocumentStatus(document.id, 'pending')}
                                            className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                                        >
                                            Reset Status
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tax Return Generation */}
                {analyzedCount > 0 && (
                    <div className="mt-12 bg-green-50 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Calculator className="h-6 w-6 mr-2" />
                            Generate Tax Return
                        </h2>
                        <p className="text-gray-600 mb-4">
                            You have {analyzedCount} analyzed document{analyzedCount !== 1 ? 's' : ''}.
                            Generate your tax return summary using AI analysis.
                        </p>
                        <button
                            onClick={generateTaxReturn}
                            disabled={generatingReturn}
                            className={`bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center ${generatingReturn ? 'opacity-50' : ''
                                }`}
                        >
                            <Download className="h-5 w-5 mr-2" />
                            {generatingReturn ? 'Generating Tax Return...' : 'Generate Tax Return'}
                        </button>
                    </div>
                )}

                {/* Tax Return Display */}
                {taxReturn && (
                    <div className="mt-8 bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Tax Return Summary</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <pre className="whitespace-pre-wrap text-sm text-gray-700">{taxReturn}</pre>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => {
                                    const blob = new Blob([taxReturn], { type: 'text/plain' })
                                    const url = URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = url
                                    a.download = 'tax-return-summary.txt'
                                    a.click()
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                            >
                                Download Summary
                            </button>
                        </div>
                    </div>
                )}

                {/* Tax Tips */}
                <div className="mt-12 bg-blue-50 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <DollarSign className="h-6 w-6 mr-2" />
                        Tax Preparation Tips
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Before You Start</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Gather all documents from the previous tax year</li>
                                <li>• Organize receipts and records by category</li>
                                <li>• Check for any missing forms from employers</li>
                                <li>• No API keys or setup required</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Don't Forget</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Keep copies of all filed documents</li>
                                <li>• Review document analysis for accuracy</li>
                                <li>• Consider consulting a tax professional for complex situations</li>
                                <li>• This tool provides guidance, not official tax advice</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}