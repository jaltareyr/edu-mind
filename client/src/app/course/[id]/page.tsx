'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


interface Module {
  id: string;
  name: string;
  content: string;
  quizzes: Quiz[];
  assignments: Assignment[];
}

interface Quiz {
  id: string;
  name: string;
}

interface Assignment {
  id: string;
  name: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  file: File;
}

export default function CoursePage() {
  const params = useParams()
  const courseId = params.id as string
  const router = useRouter()

  const [course, setCourse] = useState({
    id: courseId,
    name: `Course ${courseId}`,
    instructor: 'TBA',
    term: 'Current Term',
    description: 'This is a placeholder description for the course.',
  })

  const [modules, setModules] = useState<Module[]>([
    { 
      id: '1', 
      name: 'Introduction', 
      content: 'Welcome to the course!',
      quizzes: [{ id: 'q1', name: 'Intro Quiz' }],
      assignments: [{ id: 'a1', name: 'Intro Assignment' }]
    },
    { 
      id: '2', 
      name: 'Week 1', 
      content: 'First week materials',
      quizzes: [{ id: 'q2', name: 'Week 1 Quiz' }],
      assignments: [{ id: 'a2', name: 'Week 1 Assignment' }]
    },
    { 
      id: '3', 
      name: 'Week 2', 
      content: 'Second week materials',
      quizzes: [{ id: 'q3', name: 'Week 2 Quiz' }],
      assignments: [{ id: 'a3', name: 'Week 2 Assignment' }]
    },
  ])

  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [newModuleName, setNewModuleName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const toggleAllModules = () => {
    setExpandedModules(prev =>
      prev.length === modules.length ? [] : modules.map(m => m.id)
    )
  }

  const addNewModule = () => {
    if (newModuleName.trim() !== '') {
      const newModule: Module = {
        id: `${modules.length + 1}`,
        name: newModuleName,
        content: 'New module content',
        quizzes: [],
        assignments: []
      }
      setModules([...modules, newModule])
      setNewModuleName('')
      setIsDialogOpen(false)
    }
  }

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        file: file,
      }))
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }, [])

  const addNewItem = (type: 'quiz' | 'assignment') => {
    router.push(`/course/${courseId}/create-item?type=${type}`)
  }

  const deleteItem = (moduleId: string, itemId: string, type: 'quiz' | 'assignment') => {
    setModules(prevModules => prevModules.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          [type === 'quiz' ? 'quizzes' : 'assignments']: module[type === 'quiz' ? 'quizzes' : 'assignments'].filter(item => item.id !== itemId)
        }
      }
      return module
    }))
  }

  const deleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const uploadFiles = async () => {
    const formData = new FormData()
    uploadedFiles.forEach(file => {
      formData.append('files', file.file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        console.log('Files uploaded successfully')
        setUploadedFiles([]) // Clear the list after successful upload
      } else {
        console.error('File upload failed')
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black">{course.name}</h1>
          <div className="space-x-4">
            <Button onClick={toggleAllModules} className="bg-black text-white hover:bg-gray-800">
              {expandedModules.length === modules.length ? 'Collapse All' : 'Expand All'}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">
                  Add New Module
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="text-black">Create New Module</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="moduleName" className="text-right text-black">
                      Module Name
                    </Label>
                    <Input
                      id="moduleName"
                      value={newModuleName}
                      onChange={(e) => setNewModuleName(e.target.value)}
                      className="col-span-3 border-black"
                    />
                  </div>
                </div>
                <Button onClick={addNewModule} className="bg-black text-white hover:bg-gray-800">
                  Create Module
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {modules.map((module) => (
              <Collapsible
                key={module.id}
                open={expandedModules.includes(module.id)}
                onOpenChange={() => toggleModule(module.id)}
              >
                <Card className="w-full bg-white">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-lg font-semibold text-black">{module.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => addNewItem('quiz')}
                        className="text-black border-black hover:bg-gray-100"
                      >
                        <span className="h-4 w-4 mr-1">+</span> Quiz
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => addNewItem('assignment')}
                        className="text-black border-black hover:bg-gray-100"
                      >
                        <span className="h-4 w-4 mr-1">+</span> Assignment
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                          {expandedModules.includes(module.id) ? (
                            <span className="h-4 w-4 text-black">▲</span>
                          ) : (
                            <span className="h-4 w-4 text-black">▼</span>
                          )}
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="p-4">
                      <p className="text-black mb-4">{module.content}</p>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-black font-semibold mb-2">Quizzes</h4>
                          {module.quizzes.length > 0 ? (
                            <ul className="space-y-2">
                              {module.quizzes.map(quiz => (
                                <li key={quiz.id} className="flex items-center justify-between">
                                  <span className="text-black">{quiz.name}</span>
                                  <div>
                                    <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                                      <span className="h-4 w-4 mr-1">📄</span> Open
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => deleteItem(module.id, quiz.id, 'quiz')}
                                      className="text-red-500 hover:bg-red-100"
                                    >
                                      <span className="h-4 w-4 mr-1">🗑️</span> Delete
                                    </Button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No quizzes yet</p>
                          )}
                        </div>
                        <div>
                          <h4 className="text-black font-semibold mb-2">Assignments</h4>
                          {module.assignments.length > 0 ? (
                            <ul className="space-y-2">
                              {module.assignments.map(assignment => (
                                <li key={assignment.id} className="flex items-center justify-between">
                                  <span className="text-black">{assignment.name}</span>
                                  <div>
                                    <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                                      <span className="h-4 w-4 mr-1">✏️</span> Open
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => deleteItem(module.id, assignment.id, 'assignment')}
                                      className="text-red-500 hover:bg-red-100"
                                    >
                                      <span className="h-4 w-4 mr-1">🗑️</span> Delete
                                    </Button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No assignments yet</p>
                          )}
                        </div>
                      </div>
                      <Button className="mt-4 bg-black text-white hover:bg-gray-800">
                        Go to Module
                      </Button>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
          <div>
            <Card className="w-full bg-white">
              <CardHeader>
                <CardTitle className="text-black">Upload Files</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="file-upload" className="block mb-2">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    <span className="mr-2 h-4 w-4">↑</span> Select Files
                  </Button>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  accept=".doc,.docx,.pdf,.ppt,.pptx"
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-black">Selected Files:</h3>
                  {uploadedFiles.length > 0 ? (
                    <ul className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <li key={file.id} className="flex items-center justify-between">
                          <div>
                            <span className="mr-2 text-black">{file.name}</span>
                            <span className="text-sm text-gray-500">({file.type})</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteFile(file.id)}
                            className="text-red-500 hover:bg-red-100"
                          >
                            <span className="h-4 w-4 mr-1">🗑️</span> Delete
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-black">No files selected yet.</p>
                  )}
                </div>
                {uploadedFiles.length > 0 && (
                  <Button 
                    onClick={uploadFiles} 
                    className="mt-4 bg-black text-white hover:bg-gray-800"
                  >
                    Upload Files
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}