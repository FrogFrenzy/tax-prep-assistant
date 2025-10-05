'use client'

import { useState } from 'react'
import { FileText, Upload, CheckCircle, AlertCircle, Calculator, DollarSign } from 'lucide-react'

interface Document {
  id: string
  name: string
  category: string
  status: 'pending' | 'uploaded' | 'verified'
  required: boolean
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
  const [documents, setDocuments] = useState<Document[]>(TAX_DOCUMENTS)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Income', 'Deductions', 'Business']

  const updateDocumentStatus = (id: string, status: Document['status']) => {
    setDocuments(docs => 
      docs.map(doc => doc.id === id ? { ...doc, status } : doc)
    )
  }

  const filteredDocuments = selectedCategory === 'All' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory)

  const completedCount = documents.filter(doc => doc.status === 'verified').length
  const totalRequired = documents.filter(doc => doc.required).length
  const completedRequired = documents.filter(doc => doc.required && doc.status === 'verified').length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tax Prep Assistant</h1>
          <p className="text-gray-600">Organize and track your tax documents efficiently</p>
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
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
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
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    document.status === 'verified' 
                      ? 'bg-green-100 text-green-800'
                      : document.status === 'uploaded'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {document.status === 'verified' && <CheckCircle className="h-4 w-4 mr-1" />}
                    {document.status === 'uploaded' && <Upload className="h-4 w-4 mr-1" />}
                    {document.status === 'pending' && <AlertCircle className="h-4 w-4 mr-1" />}
                    {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                  </div>
                </div>

                <div className="flex gap-2">
                  {document.status === 'pending' && (
                    <button
                      onClick={() => updateDocumentStatus(document.id, 'uploaded')}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Mark as Uploaded
                    </button>
                  )}
                  {document.status === 'uploaded' && (
                    <button
                      onClick={() => updateDocumentStatus(document.id, 'verified')}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      Mark as Verified
                    </button>
                  )}
                  {document.status === 'verified' && (
                    <button
                      onClick={() => updateDocumentStatus(document.id, 'pending')}
                      className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      Reset Status
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

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
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Don't Forget</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep copies of all filed documents</li>
                <li>• Review last year's return for missed deductions</li>
                <li>• Consider consulting a tax professional for complex situations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}