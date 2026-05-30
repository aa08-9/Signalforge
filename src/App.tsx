import React, { useState, useEffect } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  seoKeywords: string[];
  category: string;
  trendScore: number;
  createdAt: string;
}

export default function App() {
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('signalforge_articles');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: '1',
        title: 'Predictive SaaS Analytics: What Data Signals Show',
        content: 'Automated analysis reveals an exponential uptick in metrics related to Predictive SaaS Analytics. Implementing predictive analytics, saas optimization, and data tools ensures complete alignment with current visibility algorithms.',
        seoKeywords: ['predictive analytics', 'saas optimization', 'data tools'],
        category: 'SaaS',
        trendScore: 98,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Autonomous Workspace Engineering: Systematic Structural Growth',
        content: 'Automated discovery workflows tracked a 400% change index in system operational structures across global networks. This signals an immediate requirement for developers to structure modular interfaces dynamically.',
        seoKeywords: ['autonomous workflows', 'ai workspace', 'efficiency'],
        category: 'Automation',
        trendScore: 95,
        createdAt: new Date().toISOString()
      }
    ];
  });
  
  const [emailInput, setEmailInput] = useState('');
  const [userSession, setUserSession] = useState<{ email: string; role: string } | null>(() => {
    const saved = localStorage.getItem('signalforge_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState<'user' | 'admin'>('user');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    localStorage.setItem('signalforge_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    if (userSession) {
      localStorage.setItem('signalforge_session', JSON.stringify(userSession));
    } else {
      localStorage.removeItem('signalforge_session');
    }
  }, [userSession]);

  const handleAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setMessage('Invalid address configuration');
      return;
    }
    if (authMode === 'admin') {
      if (emailInput === 'admin@signalforge.internal') {
        setUserSession({ email: emailInput, role: 'admin' });
        setMessage('Authenticated successfully as master admin');
      } else {
        setMessage('Access denied: Master administrative criteria unmet');
      }
    } else {
      setUserSession({ email: emailInput, role: 'user' });
      setMessage('Subscription added successfully! (Account is completely free)');
    }
    setEmailInput('');
  };

  const executeAutonomousAiPass = () => {
    setIsProcessing(true);
    setMessage('Prompting internal processing core configuration algorithms...');
    setTimeout(() => {
      const globalTrends = [
        { topic: 'Predictive SaaS Analytics', cat: 'SaaS', score: 98, keywords: ['predictive analytics', 'saas optimization', 'data tools'] },
        { topic: 'Autonomous Workspace Engineering', cat: 'Automation', score: 95, keywords: ['autonomous workflows', 'ai workspace', 'efficiency'] },
        { topic: 'Decentralized Data Architectures', cat: 'Technology', score: 91, keywords: ['data architecture', 'scalability', 'cloud systems'] },
        { topic: 'Hyper-Scale Pattern Recognition', cat: 'Algorithms', score: 99, keywords: ['pattern mining', 'neural search', 'seo scaling'] }
      ];
      const selectedTrend = globalTrends[Math.floor(Math.random() * globalTrends.length)];
      const newArticle: Article = {
        id: Math.random().toString(),
        title: `The Rise of ${selectedTrend.topic}: What Data Signals Show`,
        content: `Automated analysis reveals an exponential uptick in metrics related to ${selectedTrend.topic}. By observing ongoing optimization strategies across contemporary digital infrastructure, organizations leveraging these frameworks report substantial gains. Implementing ${selectedTrend.keywords.join(', ')} ensures complete alignment with current visibility algorithms.`,
        category: selectedTrend.cat,
        seoKeywords: selectedTrend.keywords,
        trendScore: selectedTrend.score,
        createdAt: new Date().toISOString()
      };
      setArticles(prev => [newArticle, ...prev]);
      setMessage('Success! New AI Blog Post generated and posted into website.');
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">S</div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Signalforge</span>
              <span className="text-xs block text-slate-500 font-medium tracking-wide uppercase">Autonomous Trend Core</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {userSession ? (
              <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-slate-300">{userSession.email}</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">{userSession.role}</span>
                <button onClick={() => setUserSession(null)} className="text-xs text-rose-400 hover:underline pl-2 border-l border-slate-700">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button onClick={() => setAuthMode('user')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${authMode === 'user' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Subscriber</button>
                <button onClick={() => setAuthMode('admin')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${authMode === 'admin' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Master Admin</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-white">Automated Discovery Feed</h2>
            {userSession?.role === 'admin' && (
              <button 
                onClick={executeAutonomousAiPass}
                disabled={isProcessing}
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md transition-all uppercase tracking-wider disabled:opacity-50"
              >
                {isProcessing ? 'Prompting Engine...' : 'Force Self-Prompt Run'}
              </button>
            )}
          </div>

          {message && <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-xl text-sm text-indigo-300 shadow-inner">{message}</div>}

          <div className="space-y-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">{article.category}</span>
                    <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold px-2.5 py-1 rounded-md">Signal Weight: {article.trendScore}%</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{article.content}</p>
                <div className="flex flex-wrap gap-1.5">
                  {article.seoKeywords.map((keyword, i) => (
                    <span key={i} className="text-xs bg-slate-900 text-slate-500 border border-slate-800 px-2 py-0.5 rounded-md font-mono">#{keyword}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {!userSession && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-1">{authMode === 'admin' ? 'Master Operations Access' : 'Early Access Subscription'}</h3>
              <p className="text-xs text-slate-400 mb-4">{authMode === 'admin' ? 'Input master control terminal identification email below.' : 'All platform subscriptions remain completely free right now.'}</p>
              <form onSubmit={handleAuthentication} className="space-y-3">
                <input 
                  type="text"
                  placeholder={authMode === 'admin' ? 'Enter admin email configuration' : 'Enter personal email coordinates'}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/10">
                  {authMode === 'admin' ? 'Access Master Terminal' : 'Register Free Account'}
                </button>
              </form>
            </div>
          )}

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center space-x-2">
              <span className="h-2 w-2 bg-indigo-500 rounded-full animate-ping"></span>
              <span>Autonomous Engine Health</span>
            </h3>
            <div className="space-y-4 mt-4">
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400 uppercase tracking-wide">Pattern Engine</span>
                  <span className="text-emerald-400 font-mono">ACTIVE</span>
                </div>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400 uppercase tracking-wide">SEO Optimizer</span>
                  <span className="text-emerald-400 font-mono">READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
