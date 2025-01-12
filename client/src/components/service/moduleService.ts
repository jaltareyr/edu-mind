import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.SERVER_URL

const API_URL = `http://localhost:5000/api/module/`;

class ModuleService {

    async getByCourseId(token: any, courseId: string) {
        try {
            const response = await axios.get(`${API_URL}getByCourseId?courseId=${courseId}`, {headers: {Authorization: `Bearer ${token}`}});
            return response.data;
        } catch (error: any) {
            console.error("Error fetching Modules data:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || "Error fetching Modules data.");
        }
    }

    async getById(token: any, id: string) {
        try {
            const response = await axios.get(`${API_URL}getbyId?id=${id}`, {headers: {Authorization: `Bearer ${token}`}});
            return response.data;
        } catch (error: any) {
            console.error("Failed to fetch module by ID:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || "Failed to fetch module by ID.");
        }
    }

    async create(token: any, name: string, courseId: string) {
        try {
            const response = await axios.post(`${API_URL}create`, { name, courseId }, {headers: {Authorization: `Bearer ${token}`}});
            return response.data;
        } catch (error: any) {
            console.error("Failed to create module:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || "Failed to create module.");
        }
    }

    async delete(token: any, id: string) {
        try {
            const response = await axios.delete(`${API_URL}${id}`, {headers: {Authorization: `Bearer ${token}`}});
            return response.data;
        } catch (error: any) {
            console.error("Failed to delete module:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || "Failed to delete module.");
        }
    }
}

export default new ModuleService();