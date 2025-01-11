'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface UploadedFile {
  id: string;
  name: string;
  type: string;
}

interface QuizData {
  title: string;
  timeLimit: string;
  passingScore: string;
}

interface AssignmentData {
  title: string;
  dueDate: string;
  maxScore: string;
}

export default function CreateItemPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [itemType, setItemType] = useState<'quiz' | 'assignment'>('quiz')
  const [prompt, setPrompt] = useState('')
  const [quizData, setQuizData] = useState<QuizData>({ title: '', timeLimit: '', passingScore: '' })
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({ title: '', dueDate: '', maxScore: '' })

  useEffect(() => {
    // In a real application, fetch the uploaded files for this course
    // For now, we'll use dummy data
    setUploadedFiles([
      { id: '1', name: 'lecture1.pdf', type: 'application/pdf' },
      { id: '2', name: 'notes.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { id: '3', name: 'slides.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
    ])
  }, [])

  const handleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleQuizDataChange = (field: keyof QuizData, value: string) => {
    setQuizData(prev => ({ ...prev, [field]: value }))
  }

  const handleAssignmentDataChange = (field: keyof AssignmentData, value: string) => {
    setAssignmentData(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerate = () => {
    // In a real application, you would send this data to your backend
    console.log('Generating item with:', {
      courseId,
      selectedFiles,
      itemType,
      prompt,
      itemData: itemType === 'quiz' ? quizData : assignmentData
    })
    // After generation, you might want to redirect back to the course page
    router.push(`/course/${courseId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full bg-white shadow-lg">
          <CardHeader className="bg-black text-white">
            <CardTitle className="text-2xl font-bold">Create New {itemType === 'quiz' ? 'Quiz' : 'Assignment'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Select Files</h3>
              <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`file-${file.id}`} 
                      checked={selectedFiles.includes(file.id)}
                      onCheckedChange={() => handleFileSelection(file.id)}
                      className="border-black text-white"
                    />
                    <Label htmlFor={`file-${file.id}`} className="text-black cursor-pointer">{file.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Item Type</h3>
              <RadioGroup defaultValue="quiz" onValueChange={(value) => setItemType(value as 'quiz' | 'assignment')} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quiz" id="quiz" />
                  <Label htmlFor="quiz" className="text-black">Quiz</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="assignment" id="assignment" />
                  <Label htmlFor="assignment" className="text-black">Assignment</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className={`w-full transition-colors relative ${itemType === 'quiz' ? 'bg-white' : 'bg-gray-100'}`}>
                {itemType !== 'quiz' && <div className="absolute inset-0 bg-gray-200 bg-opacity-50 z-10"></div>}
                <CardHeader className={itemType !== 'quiz' ? 'opacity-50' : ''}>
                  <CardTitle className="text-lg font-semibold text-black">Quiz Details</CardTitle>
                </CardHeader>
                <CardContent className={`space-y-4 ${itemType !== 'quiz' ? 'opacity-50' : ''}`}>
                  <div className="space-y-2">
                    <Label htmlFor="quizTitle" className="text-black">Quiz Title</Label>
                    <Input
                      id="quizTitle"
                      value={quizData.title}
                      onChange={(e) => handleQuizDataChange('title', e.target.value)}
                      className="border-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit" className="text-black">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      value={quizData.timeLimit}
                      onChange={(e) => handleQuizDataChange('timeLimit', e.target.value)}
                      className="border-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passingScore" className="text-black">Passing Score (%)</Label>
                    <Input
                      id="passingScore"
                      type="number"
                      value={quizData.passingScore}
                      onChange={(e) => handleQuizDataChange('passingScore', e.target.value)}
                      className="border-black"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className={`w-full transition-colors relative ${itemType === 'assignment' ? 'bg-white' : 'bg-gray-100'}`}>
                {itemType !== 'assignment' && <div className="absolute inset-0 bg-gray-200 bg-opacity-50 z-10"></div>}
                <CardHeader className={itemType !== 'assignment' ? 'opacity-50' : ''}>
                  <CardTitle className="text-lg font-semibold text-black">Assignment Details</CardTitle>
                </CardHeader>
                <CardContent className={`space-y-4 ${itemType !== 'assignment' ? 'opacity-50' : ''}`}>
                  <div className="space-y-2">
                    <Label htmlFor="assignmentTitle" className="text-black">Assignment Title</Label>
                    <Input
                      id="assignmentTitle"
                      value={assignmentData.title}
                      onChange={(e) => handleAssignmentDataChange('title', e.target.value)}
                      className="border-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-black">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={assignmentData.dueDate}
                      onChange={(e) => handleAssignmentDataChange('dueDate', e.target.value)}
                      className="border-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxScore" className="text-black">Maximum Score</Label>
                    <Input
                      id="maxScore"
                      type="number"
                      value={assignmentData.maxScore}
                      onChange={(e) => handleAssignmentDataChange('maxScore', e.target.value)}
                      className="border-black"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Label htmlFor="prompt" className="text-lg font-semibold text-black block mb-2">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] border-black text-black"
              />
            </div>

            <Button onClick={handleGenerate} className="w-full bg-black text-white hover:bg-gray-800 transition-colors">
              Generate
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}