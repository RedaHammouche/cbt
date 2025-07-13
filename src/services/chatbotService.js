// src/services/chatbotService.js
import axios from 'axios';

class ChatbotService {
  constructor() {
    this.baseURL = 'http://localhost:5000';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Envoyer un message au chatbot
  async sendMessage(message, conversationId = null, patientInfo = {}) {
    try {
      const response = await this.api.post('/api/chat', {
        message,
        conversationId,
        patientInfo,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur de connexion',
      };
    }
  }

  // Récupérer l'historique d'une conversation
  async getConversationHistory(conversationId) {
    try {
      const response = await this.api.get(`/api/conversation/${conversationId}`);
      return {
        success: true,
        data: response.data.history,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur de connexion',
      };
    }
  }

  // Supprimer une conversation
  async deleteConversation(conversationId) {
    try {
      await this.api.delete(`/api/conversation/${conversationId}`);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de la conversation:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur de connexion',
      };
    }
  }

  // Vérifier l'état de l'API
  async checkHealth() {
    try {
      const response = await this.api.get('/api/health');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'état:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Service indisponible',
      };
    }
  }
}

export default new ChatbotService();