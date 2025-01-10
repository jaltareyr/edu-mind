import axios from "axios";

const API_URL = "http://localhost:5000/api/material/";

class MaterialService {
  async getById(_id: string) {
    try {
      const response = await axios.get(`${API_URL}getById?_id=${_id}`, {
        withCredentials: true, // Enable sending cookies with the request
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Materials data:", error);
      return null;
    }
  }

  async getByCourseId(courseId: string) {
    try {
      const response = await axios.get(`${API_URL}getByCourseId?courseId=${courseId}`, {
        withCredentials: true, // Enable sending cookies with the request
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Materials data:", error);
      return null;
    }
  }

  async uploadFile(file: File, courseId: string) {
    try {

      const formData = new FormData();

      formData.append('file', file);
      formData.append('courseId', courseId);

      const response = await axios.post(`${API_URL}upload`, formData,  { withCredentials: true, headers: {
      'enctype': 'multipart/form-data'}
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async delete(fileId: string) {
    try {
      const response = await axios.delete(`${API_URL}${fileId}`, {
        withCredentials: true, // Enable sending cookies with the request
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
}

export default new MaterialService();