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
import courseService from '@/components/service/courseService'
interface Course {
  _id: string;
  name: string;
  instructor: string;
  term: string;
  description: string;
}

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);

  const [newCourse, setNewCourse] = useState<Omit<Course, '_id'>>({
    name: '',
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
        const response = await courseService.get();
        setCourses(response || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const addNewCourse = () => {
    if (newCourse.name.trim() !== '') {
      const course: Course = {
        _id: `COURSE${courses.length + 1}`,
        ...newCourse,
      };
      setCourses([...courses, course]);
      setNewCourse({ name: '', instructor: '', term: '', description: '' });
      setIsDialogOpen(false);
    }
  };

  const deleteCourse = (_id: string) => {
    setCourses(courses.filter(course => course._id !== _id));
  };

  const editCourse = (course: Course) => {
    setEditingCourse(course);
    setNewCourse({
      name: course.name,
      instructor: course.instructor,
      term: course.term,
      description: course.description,
    });
    setIsDialogOpen(true);
  };

  const saveCourseEdit = () => {
    if (editingCourse && newCourse.name.trim() !== '') {
      setCourses(courses.map(course => 
        course._id === editingCourse._id ? { ...course, ...newCourse } : course
      ));
      setEditingCourse(null);
      setNewCourse({ name: '', instructor: '', term: '', description: '' });
      setIsDialogOpen(false);
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800">
                Add New Course
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
              <Button onClick={editingCourse ? saveCourseEdit : addNewCourse} className="bg-black text-white hover:bg-gray-800">
                {editingCourse ? 'Save Changes' : 'Create Course'}
              </Button>
            </DialogContent>
          </Dialog>
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
                  <p className="text-sm text-gray-600"><strong>Course ID:</strong> {course._id}</p>
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
                        <p><strong>Course ID:</strong> {course._id}</p>
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