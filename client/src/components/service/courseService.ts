import axios from "axios";

const API_URL = `http://localhost:5000/api/course/`;

class CourseService {
  async get(token: any): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Failed to fetch courses:",
        error.response?.data?.message || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch courses.",
      );
    }
  }

  async getById(token: any, id: string): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}getById?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Failed to fetch course by ID:",
        error.response?.data?.message || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch course by ID.",
      );
    }
  }

  async create(
    token: any,
    name: string,
    courseId: string,
    instructor: string,
    term: string,
    description: string,
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${API_URL}create`,
        { name, courseId, instructor, term, description },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data; // Return the created course
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create course.",
      );
    }
  }

  async updateByModuleId(
    token: any,
    courseId: string,
    moduleId: string,
  ): Promise<any> {
    try {
      const response = await axios.patch(
        `${API_URL}updateModuleId/${courseId}`,
        { moduleId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Failed to update course with module ID:",
        error.response?.data?.message || error.message,
      );
      throw new Error(
        error.response?.data?.message ||
          "Failed to update course with module ID.",
      );
    }
  }

  async delete(token: any, courseId: string): Promise<any> {
    try {
      const response = await axios.delete(`${API_URL}${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Failed to delete course:",
        error.response?.data?.message || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Failed to delete course.",
      );
    }
  }

  async edit(
    token: any,
    id: string,
    name: string,
    courseId: string,
    instructor: string,
    term: string,
    description: string,
  ): Promise<any> {
    try {
      const response = await axios.patch(
        `${API_URL}edit/${id}`, // Backend expects ID in the route
        { name, courseId, instructor, term, description }, // Payload
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data; // Return the updated course
    } catch (error: any) {
      console.error(
        "Failed to update course:",
        error.response?.data?.message || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Failed to update course.",
      );
    }
  }
}

export default new CourseService();
