import React, { useState, useEffect, useRef } from 'react';
import { Send, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import type { Table, ChatMessage, Voice } from '../types';

interface TableChatProps {
  table: Table;
  onUpdateChat: (messages: ChatMessage[]) => void;
}

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyBs0S5P-fln7WlxvJnXVw5sISN4DlmIv74";

export function TableChat({ table, onUpdateChat }: TableChatProps) {
  const [message, setMessage] = useState('');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const voiceSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize speech synthesis and get available voices
    const synth = window.speechSynthesis;
    
    const loadVoices = () => {
      const voices = synth.getVoices();
      // Include all Microsoft voices
      const msVoices = voices
        .filter(voice => voice.name.toLowerCase().includes('microsoft'))
        .map(voice => ({
          name: voice.name,
          lang: voice.lang,
          gender: voice.name.toLowerCase().includes('female') ? 'female' : 'male'
        }));
      
      setAvailableVoices(msVoices);
      if (msVoices.length > 0 && !selectedVoice) {
        // Try to find a female voice first
        const femaleVoice = msVoices.find(v => v.gender === 'female');
        setSelectedVoice(femaleVoice?.name || msVoices[0].name);
      }
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Close voice selector when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (voiceSelectorRef.current && !voiceSelectorRef.current.contains(event.target as Node)) {
        setShowVoiceSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [table.chat]);

  const speakMessage = (text: string) => {
    if (!isSpeechEnabled) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voice = synth.getVoices().find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 1;
    utterance.pitch = 1;
    synth.speak(utterance);
  };

  const generateAIResponse = async (userMessage: string) => {
    try {
      const timeWithoutOrders = Math.floor(
        (Date.now() - new Date(table.lastInteraction).getTime()) / (1000 * 60)
      );

      const prompt = `
        Você é uma assistente virtual de um quiosque de praia chamado Beach Kiosk.
        
        Informações da mesa ${table.number}:
        - Garçom: ${table.waiter}
        - Total de pedidos: ${table.orders.length}
        - Valor total: R$ ${table.total.toFixed(2)}
        - Tempo sem novos pedidos: ${timeWithoutOrders} minutos
        
        Último pedido:
        ${table.orders.length > 0 ? 
          table.orders[table.orders.length - 1].items
            .map(item => `- ${item.quantity}x ${item.product.name}`)
            .join('\n')
          : 'Nenhum pedido ainda'
        }

        ${timeWithoutOrders >= 60 ? 
          '\nALERTA: Mesa sem pedidos há mais de 1 hora!' :
          timeWithoutOrders >= 40 ?
          '\nALERTA: Mesa sem pedidos há mais de 40 minutos!' :
          timeWithoutOrders >= 20 ?
          '\nALERTA: Mesa sem pedidos há mais de 20 minutos!' : ''
        }

        Responda à mensagem do cliente: "${userMessage}"
        
        Seja cordial e profissional. Se houver alertas de tempo, mencione-os educadamente.
      `;

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return 'Desculpe, estou com dificuldades técnicas no momento. Por favor, chame o garçom se precisar de ajuda.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    const newMessages = [...table.chat, userMessage];
    onUpdateChat(newMessages);
    setMessage('');

    const aiResponse = await generateAIResponse(message);
    const aiMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      content: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };

    const updatedMessages = [...newMessages, aiMessage];
    onUpdateChat(updatedMessages);
    speakMessage(aiResponse);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Chat da Mesa {table.number}</h3>
        <div className="flex items-center gap-2 relative" ref={voiceSelectorRef}>
          <button
            onClick={() => setShowVoiceSelector(!showVoiceSelector)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1"
            title="Selecionar voz"
          >
            {isSpeechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <ChevronDown size={16} />
          </button>
          
          {showVoiceSelector && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border p-2 z-10 w-64">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="font-medium">Selecionar Voz</span>
                <button
                  onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {isSpeechEnabled ? 'Desativar' : 'Ativar'}
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {availableVoices.map(voice => (
                  <button
                    key={voice.name}
                    onClick={() => {
                      setSelectedVoice(voice.name);
                      setShowVoiceSelector(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      selectedVoice === voice.name
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{voice.name}</div>
                    <div className="text-xs text-gray-500">
                      {voice.lang} • {voice.gender}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4 px-2"
      >
        {table.chat.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

    <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Send size={20} />
          Enviar
        </button>
      </form>
    </div>
  );
}
