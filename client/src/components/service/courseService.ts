import axios from "axios";

const API_URL = "http://localhost:5000/api/course/";

class CourseService {
    async get(): Promise<any> {
        try {
            const response = await axios.get(`${API_URL}get`, { withCredentials: true });
            return response.data;
        } catch (error: any) {
            console.error("Failed to fetch courses:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || "Failed to fetch courses.");
        }
    }

    async getById(id: string): Promise<any> {
        try {
            const response = await axios.get(`${API_URL}getById?id=${id}`, { withCredentials: true });
            return response.data;
        } catch (error: any) {
            console.error("Failed to fetch course by ID:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || "Failed to fetch course by ID.");
        }
    }

    async create(
        name: string,
        courseId: string,
        instructor: string,
        term: string,
        description: string
      ): Promise<any> {
        try {
          const response = await axios.post(
            `${API_URL}create`,
            { name, courseId, instructor, term, description },
            { withCredentials: true }
          );
          return response.data; // Return the created course
        } catch (error: any) {
          throw new Error(error.response?.data?.message || "Failed to create course.");
        }
    }
    
    async updateByModuleId(courseId: string, moduleId: string): Promise<any> {
        try {
            const response = await axios.patch(
                `${API_URL}updateModuleId/${courseId}`,
                { moduleId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error: any) {
            console.error("Failed to update course with module ID:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || "Failed to update course with module ID.");
        }
    }

    async delete(courseId: string): Promise<any> {
        try {
            const response = await axios.delete(`${API_URL}${courseId}`, { withCredentials: true });
            return response.data;
        } catch (error: any) {
            console.error("Failed to delete course:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || "Failed to delete course.");
        }
    }

    async edit(
        id: string,
        name: string,
        courseId: string,
        instructor: string,
        term: string,
        description: string
      ): Promise<any> {
        try {
          const response = await axios.patch(
            `${API_URL}edit/${id}`, // Backend expects ID in the route
            { name, courseId, instructor, term, description }, // Payload
            { withCredentials: true }
          );
          return response.data; // Return the updated course
        } catch (error: any) {
          console.error("Failed to update course:", error.response?.data?.message || error.message);
          throw new Error(error.response?.data?.message || "Failed to update course.");
        }
    }
      
}

export default new CourseService();