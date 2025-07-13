// src/components/FloatingChatButton.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import ChatbotService from '../services/chatbotService';

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Vérifier l'état de l'API au chargement
  useEffect(() => {
    checkApiHealth();
  }, []);

  // Faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
        {} // Pas d'infos patient dans le chat rapide
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

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => (
      <p key={index} className="mb-1 last:mb-0 text-sm">
        {line}
      </p>
    ));
  };

  return (
    <>
      {/* Bouton flottant */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 relative"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {/* Indicateur de statut */}
          {apiStatus && (
            <div 
              className={`absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                apiStatus.success ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
          )}
        </Button>
      </div>

      {/* Dialog/Modal du chat */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          {/* Overlay pour fermer */}
          <div 
            className="absolute inset-0 bg-black/20" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Fenêtre de chat */}
          <Card className="relative w-96 h-[500px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 slide-in-from-right-5 duration-300">
            <CardHeader className="flex-shrink-0 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  <CardTitle className="text-lg">Assistant IA</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {conversationId && (
                    <Badge variant="secondary" className="text-xs">
                      Chat actif
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    disabled={messages.length === 0}
                    className="h-8 w-8 p-0"
                  >
                    <span className="text-xs">🗑️</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Statut API */}
              {apiStatus && !apiStatus.success && (
                <Alert className="mt-2 py-2">
                  <AlertDescription className="text-xs text-red-800">
                    Service temporairement indisponible
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>

            {/* Zone des messages */}
            <CardContent className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <Bot className="h-12 w-12 mb-3 text-gray-400" />
                  <p className="text-sm">Bonjour ! Je suis votre assistant médical.</p>
                  <p className="text-xs mt-1">Posez-moi vos questions médicales.</p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          {message.role === 'user' ? (
                            <User className="h-3 w-3 mr-1" />
                          ) : (
                            <Bot className="h-3 w-3 mr-1" />
                          )}
                          <span className="text-xs opacity-75">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div>{formatMessage(message.content)}</div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-2 rounded-lg rounded-bl-sm">
                        <div className="flex items-center">
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          <span className="text-xs">En cours d'analyse...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Zone de saisie */}
            <div className="flex-shrink-0 p-3 border-t">
              {error && (
                <Alert className="mb-2 py-1">
                  <AlertDescription className="text-xs text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Votre question médicale..."
                  disabled={isLoading}
                  className="flex-1 text-sm"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !currentMessage.trim()}
                  className="h-10 w-10 p-0"
                >
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
      )}
    </>
  );
}