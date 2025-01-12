import axios from "axios";

const API_URL = `http://localhost:5000/api/generate/`;

class GenerateService {
  async generateItem(
    token: any,
    itemtype: string,
    topic: string,
    number: string,
    tone: string,
    prompt: string,
  ) {
    try {
      if (itemtype == "quiz") {
        const response = await axios.post(
          `${API_URL}/genquiz`,
          { topic, number, tone, prompt },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return response;
      } else {
        const response = await axios.post(
          `${API_URL}/genassignment`,
          { topic, number, tone, prompt },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return response;
      }
    } catch (error: any) {
      console.error(
        `Failed to generate ${itemtype}:`,
        error.response?.data?.message || error.message,
      );
    }
  }
}

export default new GenerateService();
