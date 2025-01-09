'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CourseService from '@/components/service/courseService'
interface Course {
  _id: string;
  courseId: string,
  name: string;
  instructor: string;
  term: string;
  description: string;
}

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState({
    name: '',
    courseId: '',
    instructor: '',
    term: '',
    description: '',
  });  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await CourseService.get();
        setCourses(response || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const addNewCourse = async () => {
    if (newCourse.name.trim() !== '') {
      try {
        // Send the new course to the backend
        const createdCourse = await CourseService.create(newCourse.name, newCourse.courseId, newCourse.instructor, newCourse.term, newCourse.description);
        
        // Add the new course returned from the backend to the state
        setCourses((prevCourses) => [...prevCourses, createdCourse]);
  
        // Reset the new course input
        setNewCourse({
          name: '',
          courseId: '',
          instructor: '',
          term: '',
          description: '',
        });
  
        setIsDialogOpen(false); // Close the dialog
      } catch (error) {
        console.error('Failed to add new course:', error);
      }
    } else {
      alert('Course name is required!');
    }
  };
  
  const deleteCourse = async (_id: string) => {
    try {
      // Call the delete API to remove the course from the backend
      await CourseService.delete(_id);
  
      // Update the state to remove the deleted course from the UI
      setCourses((prevCourses) => prevCourses.filter((course) => course._id !== _id));
  
      console.log(`Course with ID ${_id} deleted successfully.`);
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete the course. Please try again.');
    }
  };
    
  const editCourse = async (course: Course) => {

    setEditingCourse(course);
    setNewCourse({
      name: course.name,
      courseId: course.courseId,
      instructor: course.instructor,
      term: course.term,
      description: course.description,
    });
    setIsDialogOpen(true);
  };

  const saveCourseEdit = async () => {
    if (editingCourse && newCourse.name.trim() !== '') {
      try {
        // Call the update API to save the changes
        const updatedCourse = await CourseService.edit(
          editingCourse._id,
          newCourse.name,
          newCourse.courseId,
          newCourse.instructor,
          newCourse.term,
          newCourse.description
        );
  
        // Update the state with the updated course
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === editingCourse._id ? updatedCourse : course
          )
        );
  
        // Reset editing state and close dialog
        setEditingCourse(null);
        setNewCourse({ name: '', courseId: '', instructor: '', term: '', description: '' });
        setIsDialogOpen(false);
  
        console.log(`Course ${updatedCourse.name} updated successfully.`);
      } catch (error) {
        console.error('Failed to update course:', error);
        alert('Failed to save the changes. Please try again.');
      }
    } else {
      alert('Course name is required!');
    }
  };  

  const shareCourse = (_id: string) => {
    // Implement sharing functionality here
    console.log(`Sharing course ${_id}`);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black">{isLoading ? "Loading..." : "My Courses"}</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) {
              setEditingCourse(null); // Clear editing state when dialog is closed
              setNewCourse({ name: '', courseId: '', instructor: '', term: '', description: '' });
            }
            setIsDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-black">{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="courseName" className="text-right text-black">
                    Course Name
                  </Label>
                  <Input
                    id="courseName"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    className="col-span-3 border-black"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="courseId" className="text-right text-black">
                    Course ID
                  </Label>
                  <Input
                    id="courseId"
                    value={newCourse.courseId}
                    onChange={(e) => setNewCourse({ ...newCourse, courseId: e.target.value })}
                    className="col-span-3 border-black"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="instructor" className="text-right text-black">
                    Instructor
                  </Label>
                  <Input
                    id="instructor"
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                    className="col-span-3 border-black"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="term" className="text-right text-black">
                    Term
                  </Label>
                  <Input
                    id="term"
                    value={newCourse.term}
                    onChange={(e) => setNewCourse({ ...newCourse, term: e.target.value })}
                    className="col-span-3 border-black"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right text-black">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="col-span-3 border-black"
                  />
                </div>
              </div>
              <Button
                onClick={editingCourse ? saveCourseEdit : addNewCourse}
                className="bg-black text-white hover:bg-gray-800"
              >
                {editingCourse ? 'Save Changes' : 'Create Course'}
              </Button>
            </DialogContent>
          </Dialog>;
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course._id} className="w-full overflow-hidden transition-shadow duration-300 hover:shadow-lg border-black">
              <CardHeader className="bg-black text-white p-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {course.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <span aria-hidden="true">⋮</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white text-black">
                    <DropdownMenuItem onClick={() => editCourse(course)}>
                      <span className="mr-2">✏️</span>
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => shareCourse(course._id)}>
                      <span className="mr-2">🔗</span>
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteCourse(course._id)}>
                      <span className="mr-2">🗑️</span>
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600"><strong>Course ID:</strong> {course.courseId}</p>
                  <p className="text-sm text-gray-600"><strong>Instructor:</strong> {course.instructor}</p>
                  <p className="text-sm text-gray-600"><strong>Term:</strong> {course.term}</p>
                </div>
                <div className="flex justify-between items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-black hover:bg-gray-200"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <span className="mr-1">ℹ️</span>
                        More Info
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-black">{course.name}</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 text-black">
                        <p><strong>Course ID:</strong> {course.courseId}</p>
                        <p><strong>Instructor:</strong> {course.instructor}</p>
                        <p><strong>Term:</strong> {course.term}</p>
                        <p className="mt-4"><strong>Description:</strong></p>
                        <p>{course.description}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                    <Link href={`/course/${course._id}`} className="flex items-center">
                      <span className="mr-1">📚</span>
                      Enter Course
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}