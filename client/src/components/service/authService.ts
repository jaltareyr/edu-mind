import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.SERVER_URL

const API_URL = `http://localhost:5000/api/auth/`

class AuthService {

    async check(token: String, clerkid: String): Promise<any> {
        try {
            const response = await axios.get(`${API_URL}check?clerkid=${clerkid}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            return response
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'User ID checking failed. Please try again.';
            throw new Error(errorMessage);
        }
    }
    
    async signup(clerkid: string, email: string, name: string): Promise<any> {
        try {
            const response = await axios.post(`${API_URL}signup`, { clerkid, email, name });
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            throw new Error(errorMessage);
        }
    }

    async login(email: string, password: string): Promise<any> {
        try {
            const response = await fetch(`${API_URL}login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            // Check if the response is OK (status in the range 200-299)
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Login failed. Please try again.';
                throw new Error(errorMessage);
            }

            // Parse and return the JSON response
            const data = await response.json();
            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Login failed. Please try again.');
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