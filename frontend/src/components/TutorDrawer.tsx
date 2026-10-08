import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, Lightbulb } from 'lucide-react';
import { sendTutorMessage, fetchHint } from '../services/api';

interface TutorDrawerProps {
  sessionId: string;
  challengeId?: string;
  topic: string;
  currentConcept?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  actions?: string[];
}

export const TutorDrawer: React.FC<TutorDrawerProps> = ({
  sessionId,
  challengeId,
  topic,
  currentConcept
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'tutor',
      text: `Hello! I'm your ConceptForge Socratic Coach for ${topic}. Rather than giving away answers directly, I'm here to help guide your reasoning. Ask me anything or request a hint!`,
      actions: ['What is the core intuition?', 'Give me a hint for this challenge', 'How does this connect to real life?']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      if (query.toLowerCase().includes('hint') && challengeId) {
        const hintRes = await fetchHint(sessionId, challengeId, hintLevel);
        setHintLevel(prev => (prev >= 3 ? 1 : prev + 1));
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'tutor',
            text: `💡 **${hintRes.context_note}**:\n${hintRes.hint}`,
            actions: ['Ask follow-up question', 'Explain my intuition so far']
          }
        ]);
      } else {
        const data = await sendTutorMessage(sessionId, query, currentConcept);
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'tutor',
            text: data.response + (data.follow_up_question ? `\n\n🤔 *${data.follow_up_question}*` : ''),
            actions: data.suggested_actions
          }
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: "I'm having a brief connection pause, but let's break down the scenario step-by-step. What input parameters are you modifying?"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer glow-pill"
      >
        <Bot className="w-5 h-5 animate-bounce" />
        <span>Socratic AI Coach</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    Socratic AI Coach <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">Contextual</span>
                  </h3>
                  <p className="text-[11px] text-gray-400">Guiding reasoning for {topic}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Graduated Hint Bar */}
            {challengeId && (
              <div className="px-4 py-2.5 bg-indigo-950/40 border-b border-indigo-900/40 flex items-center justify-between">
                <span className="text-xs text-indigo-300 font-medium flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Challenge Graduated Hints:
                </span>
                <button
                  onClick={() => handleSend('Request hint for current challenge')}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-600/40 hover:bg-indigo-600 text-indigo-200 border border-indigo-500/40 transition-colors"
                >
                  Get Hint {hintLevel}/3
                </button>
              </div>
            )}

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-800/90 text-gray-200 border border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Suggested Prompt Chips */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(act)}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/20 transition-colors text-left"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-800/50 p-3 rounded-xl w-max border border-slate-700">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Socratic coach is formulating a guiding question...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question or explain your reasoning..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
