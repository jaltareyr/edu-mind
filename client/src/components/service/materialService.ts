import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.SERVER_URL

const API_URL = `http://localhost:5000/api/material/`;

class MaterialService {
  
  async getById(token: any, _id: string) {
    try {
      const response = await axios.get(`${API_URL}getById?_id=${_id}`, {headers: {Authorization: `Bearer ${token}`}});
      return response.data;
    } catch (error) {
      console.error("Error fetching Materials data:", error);
      return null;
    }
  }

  async getByCourseId(token: any, courseId: string) {
    try {
      const response = await axios.get(`${API_URL}getByCourseId?courseId=${courseId}`, {headers: {Authorization: `Bearer ${token}`}});
      return response.data;
    } catch (error) {
      console.error("Error fetching Materials data:", error);
      return null;
    }
  }

  async uploadFile(token: any, file: File, courseId: string) {
    try {

      const formData = new FormData();

      formData.append('file', file);
      formData.append('courseId', courseId);

      const response = await axios.post(`${API_URL}upload`, formData, {headers: {Authorization: `Bearer ${token}`}});
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async deleteFile(token: any, fileId: string, fileURL: string) {
    try {
        const response = await axios.post(`${API_URL}/delete`, {
            fileId,
            fileURL,
        }, {headers: {Authorization: `Bearer ${token}`}});
        return response.data;
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
  }
}

export default new MaterialService();