'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import courseService from '@/components/service/courseService'
import moduleService from '@/components/service/moduleService'
import materialService from '@/components/service/materialService'

interface Course {
  _id: string;
  name: string;
  courseId: string;
  instructor: string;
  term: string;
  description: string;
  modules: Module[];
}

interface Module {
  _id: string;
  name: string;
  courseId: string;
  quizId: { _id: number; name: string }[];
  assignmentId: { _id: number; name: string }[];
}

interface Quiz {
  _id: string;
  name: string;
}

interface Assignment {
  _id: string;
  name: string;
}

interface Material {
  _id: string;
  name: string;
  type: string;
  file: File;
}

export default function CoursePage() {

  const params = useParams()
  const courseId = params.id as string
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [newModuleName, setNewModuleName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false)
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Material[]>([])

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getById(courseId);
        if (response && response.course) {
          setCourse(response.course);
          setModules(response.course.modules || []);
        } else {
          console.error("Course data is missing or undefined:", response);
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
      }
    };
    fetchCourse();
  }, []);

    // useEffect used to fetch all modules under the given course id
    useEffect(() => {
      const fetchModulesAndRelatedData = async () => {
        if (courseId) {
          try {
            const moduleData = await moduleService.getByCourseId(courseId);
  
            const modulesWithDetails = await Promise.all(
              moduleData.map(async (module: Module) => {
                // const [quizzes, assignments] = await Promise.all([
                //   quizsService.getByModuleId(module._id),
                //   assignmentsService.getByModuleId(module._id)
                // ]);
                return {
                  ...module,
                  // quizId: quizzes || [],
                  // assignmentId: assignments || [],
                  quizId: [],
                  assignmentId: [],
                };
              })
            );
  
            setModules(modulesWithDetails);
  
            const uploadedFiles = await materialService.getByCourseId(courseId as string);
  
            if (uploadedFiles) {
              setUploadedFiles(uploadedFiles);
            }
  
          } catch (error) {
            console.error("Error fetching modules and related data:", error);
          }
        }
      };
  
      fetchModulesAndRelatedData();
    }, [courseId]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(_id => _id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const toggleAllModules = () => {
    setExpandedModules(prev =>
      prev.length === modules.length ? [] : modules.map(m => m._id)
    )
  }

  const addNewModule = async () => {
    if (newModuleName.trim() !== "") {
      try {
        const newModule = await moduleService.create(newModuleName.trim(), courseId);

        if (newModule) {
          setModules(prevModules => [
            ...prevModules,
            {
              _id: newModule._id,
              name: newModule.name,
              courseId: courseId,
              quizId: [],
              assignmentId: []
            }
          ]);
          console.log("Module added:", newModule.name);
          setNewModuleName("");
          setIsModuleDialogOpen(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleFileUpload = async (filesToUpload: FileList, courseId: string) => {

    const file = filesToUpload[0];
    if (!file) return;

    try {
      const files = Array.from(filesToUpload).map(file => file);

      const uploadedFileData = await Promise.all(
        files.map(async (file) => {
          const response = await materialService.uploadFile(file, courseId);
          return { ...response.data, _id: response.material._id, name: file.name };
        }));
      
      console.log('File uploaded successfully:', uploadedFileData);

      setUploadedFiles((prevUploadedFiles) => [
        ...prevUploadedFiles,
        ...uploadedFileData,
      ]);

    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  const deleteItem = (moduleId: string, itemId: string, type: 'quiz' | 'assignment') => {
    setModules(prevModules => prevModules.map(module => {
      if (module._id === moduleId) {
        return {
          ...module,
          [type === 'quiz' ? 'quizId' : 'assignmentId']: module[type === 'quiz' ? 'quizId' : 'assignmentId'].filter(item => item._id.toString() !== itemId)
        }
      }
      return module
    }))
  }

  const deleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file._id !== fileId))
  }

  const uploadFiles = async () => {
    try {

      const formData = new FormData()
      
      uploadedFiles.forEach(file => {
      formData.append('files', file.file)
      })

      // Iterate over uploaded files and send them to the API
      // const uploadedFileResponses = await Promise.all(
        
      //   uploadedFiles.map(async (file) => {

      //     const formData = new FormData();
      //     formData.append('file', file.file);
      //     formData.append('name', file.name);
      //     formData.append('type', file.type);
      //     formData.append('courseId', courseId);
  
      //     const response = await materialService.uploadFile(formData);
  
      //     // Return the updated file object including all necessary properties
      //     return {
      //       _id: response.material._id,
      //       name: file.name,
      //       type: file.type,
      //       file: file.file, // Include the original File object
      //     };
      //   })
      // );
  
      // console.log('File(s) uploaded successfully:', uploadedFileResponses);
  
      // Update the state with the uploaded file metadata, preserving existing file objects
      // setUploadedFiles((prevUploadedFiles) => [
      //   ...prevUploadedFiles,
      //   ...uploadedFileResponses,
      // ]);
  
      // Optionally, clear the file input field or reset state
      setUploadedFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };
  
  

  
  const updateCourse = async (updatedCourse: Course) => {
    try {
      await courseService.edit(courseId, 
        updatedCourse.name,
        updatedCourse.courseId,
        updatedCourse.instructor,
        updatedCourse.term,
        updatedCourse.description);
      setCourse(updatedCourse);
      setIsCourseDialogOpen(false);
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  }

  if (!course) {
    return <div>Loading...</div>;
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
            <Button onClick={() => setIsCourseDialogOpen(true)} className="bg-black text-white hover:bg-gray-800">
              Edit Course
            </Button>
            <Button onClick={() => setIsModuleDialogOpen(true)} className="bg-black text-white hover:bg-gray-800">
              Add New Module
            </Button>
          </div>
        </div>

        <Card className="w-full bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-black">Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Instructor:</p>
                <p className="text-black">{course.instructor}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Term:</p>
                <p className="text-black">{course.term}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-semibold text-gray-600">Description:</p>
                <p className="text-black">{course.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {modules.map((module) => (
              <Collapsible
                key={module._id}
                open={expandedModules.includes(module._id)}
                onOpenChange={() => toggleModule(module._id)}
              >
                <Card className="w-full bg-white">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-lg font-semibold text-black">{module.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {/* <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => addNewItem('quiz')}
                        className="text-black border-black hover:bg-gray-100"
                      >
                        <span className="h-4 w-4 mr-1">+</span> Quiz
                      </Button> */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => router.push(`/create-item?courseId=${courseId}&moduleId=${module._id}`)}
                        className="text-black border-black hover:bg-gray-100"
                      >
                        <span className="h-4 w-4 mr-1">+</span> Quiz/Assignment
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                          {expandedModules.includes(module._id) ? (
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
                      {/* <p className="text-black mb-4">{module.content}</p> */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-black font-semibold mb-2">Quizzes</h4>
                          {module.quizId.length > 0 ? (
                            <ul className="space-y-2">
                              {module.quizId.map(quiz => (
                                <li key={quiz._id} className="flex items-center justify-between">
                                  <span className="text-black">{quiz.name}</span>
                                  <div>
                                    <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                                      <span className="h-4 w-4 mr-1">📄</span> Open
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => deleteItem(module._id, quiz._id.toString(), 'quiz')}
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
                          {module.assignmentId.length > 0 ? (
                            <ul className="space-y-2">
                              {module.assignmentId.map(assignment => (
                                <li key={assignment._id} className="flex items-center justify-between">
                                  <span className="text-black">{assignment.name}</span>
                                  <div>
                                    <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                                      <span className="h-4 w-4 mr-1">✏️</span> Open
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => deleteItem(module._id, assignment._id.toString(), 'assignment')}
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
              <label className="text-sm text-gray-500">Upload files in the following formats only: PDF, TXT, or Word Documents</label>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mt-2">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                  Upload File
                </Button>
                <Input
                  id="file-upload"
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileUpload(e.target.files, courseId)
                    }
                  }}
                  accept=".doc,.docx,.pdf,.ppt,.pptx"
                  aria-label="Upload files"
                />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-black">Uploaded Files:</h3>
                  {uploadedFiles.length > 0 ? (
                    <ul className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <li key={file._id} className="flex items-center justify-between">
                          <div>
                            <span className="mr-2 text-black">{file.name}</span>
                            <span className="text-sm text-gray-500">({file.type})</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteFile(file._id)}
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

      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
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

      <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">Edit Course</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseName" className="text-right text-black">
                Course Name
              </Label>
              <Input
                id="courseName"
                value={course.name}
                onChange={(e) => setCourse({...course, name: e.target.value})}
                className="col-span-3 border-black"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructor" className="text-right text-black">
                Instructor
              </Label>
              <Input
                id="instructor"
                value={course.instructor}
                onChange={(e) => setCourse({...course, instructor: e.target.value})}
                className="col-span-3 border-black"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term" className="text-right text-black">
                Term
              </Label>
              <Input
                id="term"
                value={course.term}
                onChange={(e) => setCourse({...course, term: e.target.value})}
                className="col-span-3 border-black"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-black">
                Description
              </Label>
              <Input
                id="description"
                value={course.description}
                onChange={(e) => setCourse({...course, description: e.target.value})}
                className="col-span-3 border-black"
              />
            </div>
          </div>
          <Button onClick={() => updateCourse(course)} className="bg-black text-white hover:bg-gray-800">
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}