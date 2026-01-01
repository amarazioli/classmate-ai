import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set, remove, update } from 'firebase/database';

// ============================================
// FIREBASE CONFIGURATION
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyBq1QOaMCYaG-y-VQiJ_VOKozBr-8Rs2gc",
  authDomain: "classmate-ai-41020.firebaseapp.com",
  databaseURL: "https://classmate-ai-41020-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "classmate-ai-41020",
  storageBucket: "classmate-ai-41020.firebasestorage.app",
  messagingSenderId: "130597552476",
  appId: "1:130597552476:web:372cdabf885161870c0199"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const SESSION_ID = "class-session-1";

// ============================================
// HELPER FUNCTIONS
// ============================================
const isLikelyQuestion = (text) => {
  if (!text) return false;
  const trimmed = text.trim().toLowerCase();
  
  // Check if ends with question mark
  const hasQuestionMark = trimmed.endsWith('?');
  
  // Check if starts with common question words
  const questionStarters = [
    'what', 'why', 'how', 'when', 'where', 'who', 'which', 'whose',
    'is', 'are', 'was', 'were', 'do', 'does', 'did', 'can', 'could',
    'would', 'should', 'will', 'shall', 'may', 'might', 'have', 'has',
    'am', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 'don\'t', 'doesn\'t'
  ];
  
  const firstWord = trimmed.split(/\s+/)[0];
  const startsWithQuestionWord = questionStarters.includes(firstWord);
  
  // Return true if EITHER condition is met (OR logic)
  return hasQuestionMark || startsWithQuestionWord;
};

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [view, setView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['student', 'operator', 'teacher', 'all'].includes(hash) ? hash : 'landing';
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      setView(['student', 'operator', 'teacher', 'all'].includes(hash) ? hash : 'landing');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (view === 'landing') return <LandingPage />;
  if (view === 'student') return <StudentPage />;
  if (view === 'operator') return <OperatorPage />;
  if (view === 'teacher') return <TeacherPage />;
  if (view === 'all') return <AllViewsPage />;
  return <LandingPage />;
}

// ============================================
// LANDING PAGE
// ============================================
function LandingPage() {
  return (
    <div className="min-h-screen p-6" style={{background: '#eff3f7'}}>
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 mb-4 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-slate-600">AI-Powered Classroom Assistant</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Class<span style={{background: 'linear-gradient(to right, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Mate</span> AI
          </h1>
          <p className="text-slate-600 text-lg">Ask freely. Teach smarter.</p>
          <p className="text-slate-400 text-sm mt-1">Select your role to continue</p>
        </div>

        <div className="space-y-3">
          <a href="#student" className="block group">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" style={{background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)'}}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">I'm a Student</p>
                  <p className="text-sm text-slate-500">Ask questions anonymously during class</p>
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>

          <a href="#teacher" className="block group">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" style={{background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)'}}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">I'm a Teacher</p>
                  <p className="text-sm text-slate-500">View live insights & confusion hotspots</p>
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>

          <a href="#operator" className="block group">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" style={{background: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)'}}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">Wizard of Oz Operator</p>
                  <p className="text-sm text-slate-500">Respond as AI (hidden from students)</p>
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>

          <a href="#all" className="block group">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">All Views (Demo Mode)</p>
                  <p className="text-sm text-slate-400">See all interfaces side-by-side</p>
                </div>
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>
        </div>
        <p className="text-center text-slate-400 text-xs mt-8">Share this link with class participants</p>
      </div>
    </div>
  );
}

// ============================================
// STUDENT PAGE & VIEW
// ============================================
function StudentPage() {
  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)'}}>
      <div className="max-w-lg mx-auto h-screen">
        <StudentView />
      </div>
    </div>
  );
}

function StudentView() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [config, setConfig] = useState({ chapter: 'Loading...' });
  const [pendingFeedback, setPendingFeedback] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const messagesRef = ref(db, `sessions/${SESSION_ID}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
        setMessages(arr);
        const lastMsg = arr[arr.length - 1];
        if (lastMsg && lastMsg.type === 'ai' && !lastMsg.feedbackGiven) {
          setPendingFeedback(lastMsg);
        }
      } else {
        // Reset when data is cleared (new class session)
        setMessages([]);
        setPendingFeedback(null);
      }
    });

    const configRef = ref(db, `sessions/${SESSION_ID}/config`);
    onValue(configRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setConfig(data);
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingFeedback]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const msgRef = push(ref(db, `sessions/${SESSION_ID}/messages`));
    const newMsg = { 
      id: msgRef.key, 
      type: 'student', 
      text: message, 
      timestamp: Date.now(),
      status: 'pending'
    };
    set(msgRef, newMsg);
    set(ref(db, `sessions/${SESSION_ID}/queue/${msgRef.key}`), newMsg);
    setMessage('');
  };

  const handleFeedback = (feedbackType) => {
    if (!pendingFeedback) return;
    
    const aiMsg = pendingFeedback;
    const studentMsgId = aiMsg.replyTo;
    const confusionTopic = aiMsg.confusionTopic;
    
    update(ref(db, `sessions/${SESSION_ID}/messages/${aiMsg.id}`), {
      feedbackGiven: true,
      feedbackType: feedbackType
    });

    if (studentMsgId) {
      update(ref(db, `sessions/${SESSION_ID}/messages/${studentMsgId}`), {
        status: feedbackType
      });

      if (feedbackType === 'flagged' && confusionTopic) {
        const confusionRef = ref(db, `sessions/${SESSION_ID}/confusion/${confusionTopic}`);
        onValue(confusionRef, (snapshot) => {
          const current = snapshot.val()?.count || 0;
          set(confusionRef, { count: current + 1 });
        }, { onlyOnce: true });

        const originalQuestion = messages.find(m => m.id === studentMsgId);
        if (originalQuestion) {
          const flagRef = push(ref(db, `sessions/${SESSION_ID}/flagged`));
          set(flagRef, {
            id: flagRef.key,
            questionId: studentMsgId,
            text: originalQuestion.text,
            topic: confusionTopic,
            timestamp: Date.now(),
            aiResponse: aiMsg.text
          });
        }
      }
    }
    
    setPendingFeedback(null);
  };

  const formatTime = (ts) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)'}}></div>
      
      <div className="relative p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)'}}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Class Assistant</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <p className="text-slate-400 text-xs">Anonymous • {config.chapter || 'Connecting...'}</p>
            </div>
          </div>
          <a href="#" className="text-slate-500 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">Exit</a>
        </div>
      </div>
      
      <div className="relative flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-white font-medium mb-1">Ask anything!</p>
            <p className="text-slate-400 text-sm">Your questions are completely anonymous</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id}>
            <div className={`flex ${msg.type === 'student' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 ${
                msg.type === 'student'
                  ? 'text-white rounded-2xl rounded-tr-md shadow-lg'
                  : 'backdrop-blur-sm border border-white/10 rounded-2xl rounded-tl-md'
              }`} style={msg.type === 'student' ? {background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'} : {background: 'rgba(255,255,255,0.1)'}}>
                <p className="text-sm" style={{color: msg.type === 'student' ? 'white' : '#e2e8f0'}}>{msg.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs" style={{color: msg.type === 'student' ? '#bfdbfe' : '#64748b'}}>
                    {formatTime(msg.timestamp)}
                  </p>
                  {msg.type === 'student' && msg.status && msg.status !== 'pending' && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${msg.status === 'solved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {msg.status === 'solved' ? '✓ Solved' : '🚩 Flagged'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {msg.type === 'ai' && pendingFeedback?.id === msg.id && !msg.feedbackGiven && (
              <div className="flex justify-start mt-2 ml-2">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-2">Was this helpful?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFeedback('solved')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Yes, solved!
                    </button>
                    <button
                      onClick={() => handleFeedback('flagged')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-all flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      Flag for teacher
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      
      <div className="relative p-4 border-t border-white/10">
        <div className="flex gap-3">
          <input 
            type="text"
            placeholder="Ask anything..."
            className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-all"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="px-5 py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all text-white"
            style={{background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-slate-500">Your questions are anonymous</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// OPERATOR PAGE & VIEW
// ============================================
function OperatorPage() {
  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)'}}>
      <div className="max-w-2xl mx-auto min-h-screen">
        <OperatorView />
      </div>
    </div>
  );
}

function OperatorView() {
  const [queue, setQueue] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const topics = ["Quadratic Formula", "Factoring", "Variables", "Graph", "Sign changes", "Steps", "Other"];
  const quickReplies = [
    "Great question! The key is...",
    "Think of it this way...",
    "Yes, exactly right!",
    "Not quite - remember...",
    "Let me explain step by step..."
  ];

  useEffect(() => {
    const queueRef = ref(db, `sessions/${SESSION_ID}/queue`);
    onValue(queueRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
        setQueue(arr);
      } else {
        setQueue([]);
      }
    });
  }, []);

  const sendReply = (qId) => {
    if (!reply.trim()) return;
    if (!selectedTopic) {
      alert('Please select a topic before sending!');
      return;
    }
    
    const msgRef = push(ref(db, `sessions/${SESSION_ID}/messages`));
    const response = { 
      id: msgRef.key, 
      type: 'ai', 
      text: reply, 
      timestamp: Date.now(), 
      replyTo: qId,
      confusionTopic: selectedTopic,
      feedbackGiven: false
    };
    set(msgRef, response);
    remove(ref(db, `sessions/${SESSION_ID}/queue/${qId}`));
    setReply('');
    setSelectedTopic('');
    setSelected(null);
  };

  const formatTime = (ts) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Just now';
    return `${Math.floor(diff / 60)}m ago`;
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{background: 'radial-gradient(circle at 50% 20%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)'}}></div>
      
      <div className="relative p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)'}}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Wizard of Oz Panel</h3>
              <p className="text-red-400 text-xs">Hidden from students & teacher</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 bg-red-500/20 text-red-400">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
              {queue.length} pending
            </div>
            <a href="#" className="text-slate-500 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">Exit</a>
          </div>
        </div>
      </div>
      
      <div className="relative flex-1 p-4 space-y-3 overflow-y-auto">
        {queue.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-white font-medium mb-1">No pending questions</p>
            <p className="text-slate-400 text-sm">Questions will appear here in real-time</p>
          </div>
        ) : (
          queue.map((q) => (
            <div 
              key={q.id}
              className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-4 cursor-pointer transition-all ${
                selected?.id === q.id ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => { setSelected(q); setSelectedTopic(''); }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-sm text-white flex-1">"{q.text}"</p>
                <span className="text-xs text-slate-500 whitespace-nowrap">{formatTime(q.timestamp)}</span>
              </div>

              {selected?.id === q.id && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="mb-3">
                    <p className="text-xs text-slate-400 mb-2">Select topic (required):</p>
                    <div className="flex flex-wrap gap-1">
                      {topics.map((topic) => (
                        <button
                          key={topic}
                          onClick={(e) => { e.stopPropagation(); setSelectedTopic(topic); }}
                          className={`px-2 py-1 rounded-lg text-xs transition-all ${
                            selectedTopic === topic
                              ? 'bg-amber-500 text-white'
                              : 'bg-white/10 text-slate-400 hover:bg-white/20'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {quickReplies.map((qr, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setReply(qr); }}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs hover:bg-blue-500/30 transition-all"
                      >
                        {qr.substring(0, 20)}...
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyPress={(e) => e.key === 'Enter' && sendReply(q.id)}
                      placeholder="Type reply as AI..."
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500/50"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); sendReply(q.id); }}
                      disabled={!selectedTopic}
                      className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-all ${
                        selectedTopic 
                          ? 'hover:shadow-lg' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      style={{background: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)'}}
                    >
                      Send
                    </button>
                  </div>
                  {!selectedTopic && (
                    <p className="text-xs text-amber-400 mt-2">⚠️ Select a topic before sending</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="relative p-4 border-t border-white/10">
        <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl flex items-start gap-3">
          <span className="text-lg">💡</span>
          <p className="text-xs text-blue-300">Select a topic before replying. If the student flags the question, only then will it appear in the teacher's confusion matrix.</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TEACHER PAGE & VIEW
// ============================================
function TeacherPage() {
  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)'}}>
      <div className="max-w-2xl mx-auto min-h-screen">
        <TeacherView />
      </div>
    </div>
  );
}

function TeacherView() {
  const [setupStage, setSetupStage] = useState('upload');
  const [viewMode, setViewMode] = useState('live');
  const [todayChapter, setTodayChapter] = useState('');
  const [uploadedBook, setUploadedBook] = useState(null);
  const [messages, setMessages] = useState([]);
  const [confusion, setConfusion] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [stats] = useState({ activeStudents: 18, totalStudents: 24 });

  const chapters = [
    { id: 1, name: "Linear Equations", pages: "1-24" },
    { id: 2, name: "Quadratic Functions", pages: "25-52" },
    { id: 3, name: "Polynomials", pages: "53-78" },
    { id: 4, name: "Quadratic Equations", pages: "155-182" },
    { id: 5, name: "Systems of Equations", pages: "183-210" },
  ];

  const studentEngagement = [
    { name: "Emma V.", active: true }, { name: "Lucas D.", active: true },
    { name: "Sophie M.", active: true }, { name: "Noah B.", active: false },
    { name: "Mila K.", active: true }, { name: "Daan J.", active: true },
    { name: "Julia W.", active: false }, { name: "Sem P.", active: true },
  ];

  useEffect(() => {
    if (setupStage === 'parsing') {
      const timer = setTimeout(() => setSetupStage('confirm'), 2000);
      return () => clearTimeout(timer);
    }
  }, [setupStage]);

  useEffect(() => {
    const messagesRef = ref(db, `sessions/${SESSION_ID}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setMessages(Object.values(data));
    });

    const confusionRef = ref(db, `sessions/${SESSION_ID}/confusion`);
    onValue(confusionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setConfusion(data);
      else setConfusion({});
    });

    const flaggedRef = ref(db, `sessions/${SESSION_ID}/flagged`);
    onValue(flaggedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFlaggedQuestions(Object.values(data).sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setFlaggedQuestions([]);
      }
    });
  }, []);

  const startSession = () => {
    if (!todayChapter) return;
    set(ref(db, `sessions/${SESSION_ID}/config`), {
      chapter: todayChapter,
      book: uploadedBook,
      startedAt: Date.now()
    });
    setSetupStage('live');
  };

  const resetSession = () => {
    if (!window.confirm('Start a new class session? This will clear all current messages and questions.')) return;
    
    // Clear all session data
    remove(ref(db, `sessions/${SESSION_ID}/messages`));
    remove(ref(db, `sessions/${SESSION_ID}/queue`));
    remove(ref(db, `sessions/${SESSION_ID}/confusion`));
    remove(ref(db, `sessions/${SESSION_ID}/flagged`));
    
    // Update config with new start time
    set(ref(db, `sessions/${SESSION_ID}/config`), {
      chapter: todayChapter,
      book: uploadedBook,
      startedAt: Date.now()
    });
    
    // Reset local state
    setMessages([]);
    setConfusion({});
    setFlaggedQuestions([]);
  };

  const sortedConfusion = Object.entries(confusion)
    .sort((a, b) => (b[1]?.count || 0) - (a[1]?.count || 0))
    .slice(0, 5);
  const maxConfusion = Math.max(...sortedConfusion.map(([, d]) => d?.count || 0), 1);
  const topConfusion = sortedConfusion[0];

  // Filter to only count actual questions
  const questionCount = messages.filter(m => m.type === 'student' && isLikelyQuestion(m.text)).length;
  const allStudentMsgCount = messages.filter(m => m.type === 'student').length;
  const solvedCount = messages.filter(m => m.type === 'student' && m.status === 'solved').length;
  const flaggedCount = flaggedQuestions.length;

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{background: 'radial-gradient(circle at 70% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)'}}></div>
      
      <div className="relative p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)'}}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Teacher Dashboard</h3>
              <p className="text-slate-400 text-xs">Mathematics • {setupStage === 'live' ? todayChapter : 'Setup'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${setupStage === 'live' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-400'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${setupStage === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></div>
              {setupStage === 'live' ? 'Live' : 'Setup'}
            </div>
            {setupStage === 'live' && (
              <button 
                onClick={resetSession}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Class
              </button>
            )}
            <a href="#" className="text-slate-500 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">Exit</a>
          </div>
        </div>
      </div>
      
      <div className="relative flex-1 p-4 space-y-4 overflow-y-auto">
        {setupStage === 'upload' && (
          <div className="space-y-4">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 text-xs bg-violet-500/20 text-violet-300 px-3 py-1.5 rounded-full">One-time setup</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl">
              <h4 className="font-semibold text-white text-sm mb-1">Upload Course Textbook</h4>
              <p className="text-xs text-slate-400 mb-4">Upload once, use all year.</p>
              <div 
                className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group"
                onClick={() => { setUploadedBook('Mathematics_Grade9_2024.pdf'); setSetupStage('parsing'); }}
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" style={{background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)'}}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-white text-sm font-medium">Drop your textbook here</p>
                <p className="text-slate-500 text-xs mt-1">PDF format • Max 100MB</p>
              </div>
            </div>
          </div>
        )}

        {setupStage === 'parsing' && (
          <div className="space-y-4 py-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)'}}>
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
              <h4 className="font-semibold text-white mb-1">Analyzing textbook...</h4>
              <p className="text-xs text-slate-400">Identifying chapters</p>
            </div>
          </div>
        )}

        {setupStage === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white text-sm">Chapters Found</h4>
                <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full">{chapters.length} detected</span>
              </div>
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {chapters.map((ch) => (
                  <div key={ch.id} className="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-white font-medium" style={{background: 'linear-gradient(135deg, #475569 0%, #334155 100%)'}}>{ch.id}</span>
                    <span className="text-sm text-slate-200 flex-1">{ch.name}</span>
                    <span className="text-xs text-slate-500">p.{ch.pages}</span>
                  </div>
                ))}
              </div>
            </div>
            <button 
              className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white hover:shadow-lg transition-all hover:-translate-y-0.5"
              style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}
              onClick={() => setSetupStage('ready')}
            >
              Confirm Chapters →
            </button>
          </div>
        )}

        {setupStage === 'ready' && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <h4 className="font-medium text-white text-sm mb-2">Today's Chapter</h4>
              <select 
                className="w-full p-3 bg-white/10 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                value={todayChapter}
                onChange={(e) => setTodayChapter(e.target.value)}
              >
                <option value="" className="bg-slate-800">Select chapter...</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.name} className="bg-slate-800">Ch {ch.id}: {ch.name}</option>
                ))}
              </select>
            </div>
            <button 
              className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${todayChapter ? 'text-white hover:shadow-lg hover:-translate-y-0.5' : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
              style={todayChapter ? {background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'} : {}}
              onClick={startSession}
              disabled={!todayChapter}
            >
              Start Class Session →
            </button>
          </div>
        )}

        {setupStage === 'live' && (
          <>
            <div className="flex gap-2 p-1 bg-white/10 rounded-xl">
              <button onClick={() => setViewMode('live')} className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${viewMode === 'live' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}>
                🔴 Live Class
              </button>
              <button onClick={() => setViewMode('review')} className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${viewMode === 'review' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}>
                📋 Post-Class
              </button>
            </div>

            {viewMode === 'live' && (
              <>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
                    <p className="text-xl font-bold" style={{background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{stats.totalStudents}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Students</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
                    <p className="text-xl font-bold" style={{background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{questionCount}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Questions</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
                    <p className="text-xl font-bold" style={{background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{solvedCount}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Solved</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
                    <p className="text-xl font-bold" style={{background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{flaggedCount}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Flagged</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                    🔥 Confusion Hotspots
                    <span className="text-xs text-slate-500 font-normal">(from flagged questions)</span>
                  </h4>
                  {sortedConfusion.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-slate-400 text-sm">No confusion data yet</p>
                      <p className="text-slate-500 text-xs mt-1">Topics appear when students flag questions</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sortedConfusion.map(([topic, data], i) => (
                        <div key={topic}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-slate-300">{topic}</span>
                            <span className="text-slate-500">{data?.count || 0} flagged</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${((data?.count || 0) / maxConfusion) * 100}%`,
                                background: i === 0 ? 'linear-gradient(90deg, #ef4444, #f87171)' : i === 1 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #10b981, #34d399)'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {topConfusion && topConfusion[1]?.count >= 2 && (
                  <div className="p-4 rounded-2xl border border-amber-500/30" style={{background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(249,115,22,0.2) 100%)'}}>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">⚡</span>
                      <div>
                        <p className="text-sm text-amber-300 font-medium">Suggestion</p>
                        <p className="text-xs text-amber-200/80 mt-0.5">{topConfusion[1].count} students flagged "{topConfusion[0]}" for help. Consider a quick recap!</p>
                      </div>
                    </div>
                  </div>
                )}

                {flaggedQuestions.length > 0 && (
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <h4 className="font-medium text-white text-sm mb-3">🚩 Flagged Questions</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {flaggedQuestions.slice(0, 5).map((q) => (
                        <div key={q.id} className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                          <p className="text-xs text-white">"{q.text}"</p>
                          <p className="text-xs text-amber-400 mt-1">Topic: {q.topic}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {viewMode === 'review' && (
              <>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white text-sm">👥 Engagement</h4>
                    <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">
                      {studentEngagement.filter(s => s.active).length}/{studentEngagement.length} active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {studentEngagement.map((student, i) => (
                      <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${student.active ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                        <span className="text-xs text-slate-300">{student.name}</span>
                        <span className={`text-xs ${student.active ? 'text-emerald-400' : 'text-slate-500'}`}>{student.active ? '✓' : '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Questions - Post Class (filtered to only show actual questions) */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <h4 className="font-medium text-white text-sm mb-3">💬 Questions This Session</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {messages.filter(m => m.type === 'student' && isLikelyQuestion(m.text)).length === 0 ? (
                      <p className="text-slate-400 text-sm text-center py-4">No questions yet</p>
                    ) : (
                      messages.filter(m => m.type === 'student' && isLikelyQuestion(m.text)).map((msg) => (
                        <div key={msg.id} className={`p-3 rounded-xl ${msg.status === 'flagged' ? 'bg-amber-500/10 border border-amber-500/20' : msg.status === 'solved' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'}`}>
                          <p className="text-sm text-slate-300">"{msg.text}"</p>
                          <div className="flex items-center gap-2 mt-1">
                            {msg.status && msg.status !== 'pending' && (
                              <span className={`text-xs px-1.5 py-0.5 rounded ${msg.status === 'solved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {msg.status === 'solved' ? '✓ Solved' : '🚩 Flagged'}
                              </span>
                            )}
                            {(!msg.status || msg.status === 'pending') && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-400">Pending</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                    <p className="text-lg font-bold text-white">{questionCount}</p>
                    <p className="text-xs text-slate-400">Questions</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-center">
                    <p className="text-lg font-bold text-emerald-400">{solvedCount}</p>
                    <p className="text-xs text-emerald-400/70">Solved</p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-center">
                    <p className="text-lg font-bold text-amber-400">{flaggedCount}</p>
                    <p className="text-xs text-amber-400/70">Flagged</p>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ============================================
// ALL VIEWS PAGE
// ============================================
function AllViewsPage() {
  return (
    <div className="min-h-screen p-4" style={{background: '#eff3f7'}}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-slate-800">
            Class<span style={{background: 'linear-gradient(to right, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Mate</span> AI
          </h1>
          <a href="#" className="text-slate-400 hover:text-slate-600 text-xs">← Back</a>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2 text-center font-medium">Student</p>
            <div className="h-[600px] rounded-2xl overflow-hidden" style={{background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)'}}>
              <StudentView />
            </div>
          </div>
          <div>
            <p className="text-red-500 text-xs uppercase tracking-widest mb-2 text-center font-medium">Operator (Hidden)</p>
            <div className="h-[600px] rounded-2xl overflow-hidden" style={{background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)'}}>
              <OperatorView />
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2 text-center font-medium">Teacher</p>
            <div className="h-[600px] rounded-2xl overflow-hidden" style={{background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)'}}>
              <TeacherView />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
