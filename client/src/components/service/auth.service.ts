import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth/';

class AuthService {
    async signup(name: string, email: string, password: string): Promise<any> {
        try {
            const response = await axios.post(`${API_URL}signup`, { name, email, password }, { withCredentials: true });
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            throw new Error(errorMessage);
        }
    }

    async login(email: string, password: string): Promise<any> {
        try {
            const response = await axios.post(`${API_URL}login`, { email, password }, { withCredentials: true });
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            throw new Error(errorMessage);
        }
    }

    async logout(): Promise<void> {
        try {
            await axios.post(`${API_URL}logout`, {}, { withCredentials: true });
        } catch (error: any) {
            console.error('Logout failed:', error);
        }
    }

    async getCurrentUser(): Promise<any> {
        try {
            const response = await axios.get(`${API_URL}profile`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch current user:', error);
            return null;
        }
    }
}

export default new AuthService();