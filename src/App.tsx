import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from './lib/firebase';
import { PortfolioContent } from './types';
import { DEFAULT_CONTENT } from './constants';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import { Settings } from 'lucide-react';

export default function App() {
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test connection and fetch initial data
    const unsubscribe = onSnapshot(doc(db, 'content', 'main'), (snapshot) => {
      if (snapshot.exists()) {
        setContent(snapshot.data() as PortfolioContent);
      } else {
        // If no data exists, initialize with default content
        console.log('No content found, using defaults');
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'content/main');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sub font-bold animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppContent content={content} setContent={setContent} />
    </Router>
  );
}

function AppContent({ content, setContent }: { content: PortfolioContent, setContent: (c: PortfolioContent) => void }) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <Routes>
        <Route path="/" element={<Dashboard content={content} />} />
        <Route path="/admin" element={<Admin content={content} onUpdate={setContent} />} />
      </Routes>

      {/* Admin Link Floating Button */}
      <button 
        onClick={() => navigate('/admin')}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 hover:scale-110 transition-transform z-50 group"
      >
        <Settings size={24} className="group-hover:rotate-90 transition-transform duration-500" />
      </button>
    </div>
  );
}
