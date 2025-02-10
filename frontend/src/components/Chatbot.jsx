import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Mic, 
  X, 
  Loader2, 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  ChevronDown,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 0.9,
    pitch: 1.1,
    volume: 1.0
  });
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Initialize speech synthesis and load voices
  useEffect(() => {
    const loadVoices = () => {
      // Small delay to ensure speech-dispatcher is properly loaded
      setTimeout(() => {
        const availableVoices = speechSynthesis.getVoices();
        console.log("Available voices:", availableVoices);

        // Try to find the festival/speech-dispatcher voice
        const linuxVoice = availableVoices.find(voice => 
          voice.name.toLowerCase().includes('english') || 
          voice.name.toLowerCase().includes('festival') ||
          voice.name.toLowerCase().includes('bengali')
        );

        if (linuxVoice) {
          setSelectedVoice(linuxVoice);
          console.log("Selected voice:", linuxVoice.name);
        } else {
          setSelectedVoice(availableVoices[0]);
        }
      }, 1000);
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Voice Settings Component
  const VoiceSettings = () => (
    <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
      <h3 className="font-semibold mb-3">Voice Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Voice</label>
          <select
            value={selectedVoice?.name || ''}
            onChange={(e) => {
              const newVoice = speechSynthesis.getVoices()
                .find(voice => voice.name === e.target.value);
              if (newVoice) setSelectedVoice(newVoice);
            }}
            className="w-full p-2 rounded border border-gray-200"
          >
            {speechSynthesis.getVoices().map(voice => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Speed</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={voiceSettings.rate}
            onChange={(e) => setVoiceSettings(prev => ({
              ...prev,
              rate: parseFloat(e.target.value)
            }))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Pitch</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={voiceSettings.pitch}
            onChange={(e) => setVoiceSettings(prev => ({
              ...prev,
              pitch: parseFloat(e.target.value)
            }))}
            className="w-full"
          />
        </div>

        <button
          onClick={() => testVoice()}
          className="w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600
            transition-colors duration-200"
        >
          Test Voice
        </button>
      </div>
    </div>
  );

  const testVoice = () => {
    const testText = "Hello, this is a test message. How is the voice quality?";
    speakResponse(testText);
  };

  let recognition = null;

  const initializeRecognition = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'bn-BD';
      recognition.continuous = false;
      recognition.interimResults = false;
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  };

  const startListening = () => {
    if (!recognition) {
      initializeRecognition();
    }

    recognition.start();

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      setMessage(speech);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const speakResponse = (text) => {
    if (speechSynthesis && selectedVoice) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply voice settings
      utterance.voice = selectedVoice;
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;
      utterance.volume = voiceSettings.volume;
      
      // Add natural pauses
      const textWithBreaks = text.replace(/([.,!?])\s*/g, '$1, ');
      utterance.text = textWithBreaks;

      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log("Speaking with voice:", selectedVoice.name);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not available or no voice selected');
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const addMessage = (content, isUser = true) => {
    const newMessage = { content, isUser, timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    
    // If it's a bot message, speak it
    if (!isUser) {
      speakResponse(content);
    }
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;
    
    addMessage(message, true);
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5001/api/chatbot', { message });
      setResponse(res.data.reply);
      addMessage(res.data.reply, false);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Sorry, I encountered an error. Please try again.', false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Message component with voice control
  const Message = ({ msg, index }) => (
    <div className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
      {!msg.isUser && <Bot className="h-6 w-6 text-green-500 mb-2" />}
      <div className={`relative max-w-[80%] p-3 rounded-2xl ${
        msg.isUser
          ? 'bg-green-500 text-white rounded-br-none'
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
      } shadow-sm group`}>
        <p className="text-sm">{msg.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {new Date(msg.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
        
        {!msg.isUser && (
          <button
            onClick={() => isSpeaking ? stopSpeaking() : speakResponse(msg.content)}
            className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 rounded-full
              bg-green-100 hover:bg-green-200 transition-all duration-200
              opacity-0 group-hover:opacity-100"
          >
            {isSpeaking ? (
              <VolumeX className="h-4 w-4 text-green-600" />
            ) : (
              <Volume2 className="h-4 w-4 text-green-600" />
            )}
          </button>
        )}
      </div>
      {msg.isUser && <User className="h-6 w-6 text-green-500 mb-2" />}
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsChatVisible(!isChatVisible)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 
          hover:from-green-600 hover:to-emerald-600 text-white p-4 rounded-full 
          shadow-lg hover:shadow-xl transform transition-all duration-300 
          hover:scale-110 z-50 flex items-center justify-center group"
      >
        {isChatVisible ? (
          <ChevronDown className="h-6 w-6 group-hover:rotate-180 transition-transform duration-300" />
        ) : (
          <MessageCircle className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
        )}
      </button>

      {isChatVisible && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl 
          transform transition-all duration-300 ease-in-out animate-slideUp"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bot className="h-8 w-8 text-white animate-bounce" />
                <div>
                  <h1 className="font-bold text-xl text-white">AI Assistant</h1>
                  <p className="text-green-50 text-sm">Always here to help</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                title="Voice Settings"
              >
                <Settings className="h-5 w-5 text-white" />
              </button>
            </div>
            {showSettings && <VoiceSettings />}
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <Message key={index} msg={msg} index={index} />
              ))}
              {loading && (
                <div className="flex items-center space-x-2">
                  <Bot className="h-6 w-6 text-green-500" />
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white rounded-b-2xl border-t border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 p-3 bg-gray-50 border-2 border-gray-100 rounded-xl 
                    focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200
                    transition-all duration-200"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !message.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 
                    hover:from-green-600 hover:to-emerald-600 text-white p-3 rounded-xl
                    transition-all duration-200 disable transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex justify-center">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700
                      bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-all duration-200
                      transform hover:scale-105 active:scale-95"
                  >
                    <Mic className="h-5 w-5 animate-pulse" />
                    <span>Start Voice Input</span>
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700
                      bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-all duration-200
                      transform hover:scale-105 active:scale-95 animate-pulse"
                  >
                    <X className="h-5 w-5" />
                    <span>Stop Voice Input</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;