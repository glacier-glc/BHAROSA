import React, { useState } from 'react';
import { 
  Newspaper, 
  ExternalLink, 
  Calendar, 
  Tag, 
  SlidersHorizontal, 
  Check, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function NewsDrawer({
  isOpen,
  onClose,
  newsItems = [],
  sectors = []
}) {
  if (!isOpen) return null;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeInterests, setActiveInterests] = useState(['education', 'civic', 'corporate']);

  const toggleInterest = (secId) => {
    setActiveInterests(prev => 
      prev.includes(secId) ? prev.filter(s => s !== secId) : [...prev, secId]
    );
  };

  const filteredNews = newsItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-50 text-[#ea580c] border border-orange-200 shadow-sm">
                <Newspaper size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ea580c] font-bold">
                  OFFICIAL GAZETTE OF INDIA
                </span>
                <h2 className="font-cinzel text-lg font-bold text-[#002875]">
                  Circulars &amp; Sovereign News
                </h2>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 text-xl font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Interests Customization Matrix */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2">
            <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-[#002875]" /> Customize My Sector Feed
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sectors.map(sec => {
                const isActive = activeInterests.includes(sec.id);
                return (
                  <button
                    key={sec.id}
                    onClick={() => toggleInterest(sec.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-blue-50 text-[#002875] border border-blue-200 font-bold'
                        : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {isActive && '✓ '} {sec.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* News Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredNews.map((news) => (
              <div 
                key={news.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#002875]/40 transition-all space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[#002875] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-semibold">
                    {news.category || 'Gazette'}
                  </span>
                  <span className="text-slate-400 font-mono flex items-center gap-1">
                    <Calendar size={11} /> {news.date || '30-Sep-2026'}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {news.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {news.snippet}
                </p>

                {news.gazetteRef && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Ref: {news.gazetteRef}</span>
                    <span className="text-[#002875] font-semibold flex items-center gap-0.5 cursor-pointer hover:underline">
                      Read Gazette <ChevronRight size={12} />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Gazette Attribution */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>The Gazette of India (e-Gazette)</span>
            <span className="text-[#002875] font-semibold flex items-center gap-1 cursor-pointer hover:underline">
              Official Archive <ExternalLink size={12} />
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
