// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Send, Trash2, User, Bot, AlertCircle, CheckCircle } from 'lucide-react';
import ChatbotService from '../services/chatbotService';

export function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    history: '',
    medications: '',
  });
  
  const messagesEndRef = useRef(null);

  // Vérifier l'état de l'API au chargement
  useEffect(() => {
    checkApiHealth();
  }, []);

  // Faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkApiHealth = async () => {
    const result = await ChatbotService.checkHealth();
    setApiStatus(result);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const result = await ChatbotService.sendMessage(
        currentMessage,
        conversationId,
        showPatientForm ? patientInfo : {}
      );

      if (result.success) {
        const assistantMessage = {
          role: 'assistant',
          content: result.data.response,
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setConversationId(result.data.conversationId);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur inattendue lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = async () => {
    if (conversationId) {
      await ChatbotService.deleteConversation(conversationId);
    }
    setMessages([]);
    setConversationId(null);
    setError(null);
    setPatientInfo({
      age: '',
      gender: '',
      history: '',
      medications: '',
    });
  };

  const togglePatientForm = () => {
    setShowPatientForm(!showPatientForm);
  };

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatMessage = (content) => {
    // Formater le contenu avec des sauts de ligne et mise en forme simple
    return content.split('\n').map((line, index) => (
      <p key={index} className="mb-2 last:mb-0">
        {line}
      </p>
    ));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assistant Médical IA</h1>
        <p className="text-gray-600">Assistance pour les professionnels de santé</p>
        
     
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  
        {/* Zone de chat */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle>Consultation IA</CardTitle>
                <div className="flex items-center space-x-2">
                  {conversationId && (
                    <Badge variant="secondary" className="text-xs">
                      ID: {conversationId.slice(0, 8)}...
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearConversation}
                    disabled={messages.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Effacer
                  </Button>
                </div>
              </div>
            </CardHeader>

            <Separator />

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Décrivez les symptômes ou posez votre question médicale</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          {message.role === 'user' ? (
                            <User className="h-4 w-4 mr-2" />
                          ) : (
                            <Bot className="h-4 w-4 mr-2" />
                          )}
                          <span className="text-sm opacity-75">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm">
                          {formatMessage(message.content)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span className="text-sm">L'IA analyse votre question...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Zone de saisie */}
            <Separator />
            <div className="p-4 flex-shrink-0">
              {error && (
                <Alert className="mb-4 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Tapez votre question médicale..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !currentMessage.trim()}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}