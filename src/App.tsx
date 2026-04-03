import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, RefreshCw, Sparkles, LayoutGrid, List, Info, AlertCircle } from 'lucide-react';
import { Event } from './types';
import { fetchEvents } from './services/eventService';
import { EventCard } from './components/EventCard';
import { cn } from './lib/utils';

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'AI' | 'IT' | 'Development'>('all');
  const [onlyFree, setOnlyFree] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      setError('행사 정보를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' || event.category === filter;
      const matchesFree = !onlyFree || event.isFree;
      return matchesSearch && matchesFilter && matchesFree;
    });
  }, [events, searchQuery, filter, onlyFree]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">K-Event Finder</h1>
              <p className="text-xs text-slate-500 font-medium">IT & AI 행사 실시간 탐색</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="행사명, 주최사 검색..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
              title="새로고침"
            >
              <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-indigo-600 transition-all active:scale-95">
              행사 등록 문의
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
              새로운 기회를 <span className="text-indigo-600">발견하세요</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              국내의 다양한 IT 컨퍼런스, AI 세미나, 개발자 미트업 정보를 한눈에 확인하세요. 
              Gemini AI가 실시간으로 웹을 탐색하여 가장 최신의 정보를 제공합니다.
            </p>
          </motion.div>
        </section>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 mr-2" />
            {(['all', 'AI', 'IT', 'Development'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  filter === cat 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {cat === 'all' ? '전체' : cat}
              </button>
            ))}
            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyFree}
                onChange={(e) => setOnlyFree(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-600">무료 행사만</span>
            </label>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'list' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">최신 행사 정보를 탐색 중입니다...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-red-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{error}</h3>
              <button
                onClick={loadData}
                className="text-indigo-600 font-semibold hover:underline"
              >
                다시 시도하기
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="text-slate-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-slate-500">다른 키워드로 검색하거나 필터를 조정해 보세요.</p>
            </div>
          ) : (
            <motion.div
              layout
              className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}
            >
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-16 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
            <Info className="text-indigo-600 w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900 mb-1">정보 안내</h4>
            <p className="text-sm text-indigo-700 leading-relaxed">
              본 서비스는 Gemini AI를 활용하여 실시간으로 웹상의 행사 정보를 수집합니다. 
              행사 일정 및 등록 가능 여부는 주최측의 사정에 따라 변경될 수 있으므로, 반드시 공식 홈페이지를 통해 최종 확인하시기 바랍니다.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-indigo-600 w-5 h-5" />
            <span className="font-bold text-slate-900">K-Event Finder</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 K-Event Finder. Powered by Google Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
