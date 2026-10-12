import {
  AskAstrologyQuestionRequest,
  AskAstrologyQuestionResponse,
  GetChatHistoryResponse
} from '../types/chat.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/AstrologyChat';

export const chatApi = {
  async askQuestion(payload: AskAstrologyQuestionRequest): Promise<AskAstrologyQuestionResponse> {
    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = 'An error occurred while contacting the Sidereal astrology assistant.';
      try {
        const errorJson = await response.json();
        if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        // Fallback to text status
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  },

  async getHistory(userId: number = 1): Promise<GetChatHistoryResponse> {
    const response = await fetch(`${API_BASE_URL}/history/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to load chat history (Status ${response.status})`);
    }
    return await response.json();
  },

  async checkHealth(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('API is currently unreachable.');
    }
    return await response.json();
  }
};
