'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import EmotionDetail from '@/components/EmotionDetail';
import { categoryColors, categoryLabels, emotions } from '@/lib/emotions';
import type { EmotionCategory } from '@/lib/emotions';
import { contributeToTwin } from '@/lib/contribute';

const EmotionGraph = dynamic(() => import('@/components/EmotionGraph'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <p className="text-slate-500 text-sm animate-pulse">グラフを読み込み中…</p>
    </div>
  ),
});

const categories: { value: EmotionCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'basic', label: categoryLabels.basic },
  { value: 'positive', label: categoryLabels.positive },
  { value: 'negative', label: categoryLabels.negative },
  { value: 'social', label: categoryLabels.social },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<EmotionCategory | 'all'>('all');
  const [exploredIds, setExploredIds] = useState<string[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem('hfw_contributed')) return;
    sessionStorage.setItem('hfw_contributed', '1');
    contributeToTwin('how-feelings-work', { explored: true, totalEmotions: emotions.length });
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id || null);
    if (id && !exploredIds.includes(id)) {
      setExploredIds((prev) => {
        const next = [...prev, id];
        if (next.length % 5 === 0) {
          contributeToTwin('how-feelings-work', { exploredEmotions: next });
        }
        return next;
      });
    }
  };

  const counts = {
    all: emotions.length,
    basic: emotions.filter((e) => e.category === 'basic').length,
    positive: emotions.filter((e) => e.category === 'positive').length,
    negative: emotions.filter((e) => e.category === 'negative').length,
    social: emotions.filter((e) => e.category === 'social').length,
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-800 px-5 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">
              感情の科学
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              状態遷移ネットワーク ── 場面・プロセス・フロンティア
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {(Object.entries(categoryLabels) as [EmotionCategory, string][]).map(([cat, label]) => (
              <div key={cat} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: categoryColors[cat] }}
                />
                <span className="text-xs text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-1 mt-2">
          {categories.map(({ value, label }) => {
            const isActive = filterCategory === value;
            const color =
              value === 'all' ? '#94a3b8' : categoryColors[value as EmotionCategory];
            return (
              <button
                key={value}
                onClick={() => {
                  setFilterCategory(value);
                  setSelectedId(null);
                }}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: isActive ? `${color}22` : 'transparent',
                  color: isActive ? color : '#64748b',
                  border: `1px solid ${isActive ? color : 'transparent'}`,
                }}
              >
                {label}
                <span className="text-xs opacity-60" style={{ color: isActive ? color : '#475569' }}>
                  {counts[value]}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 relative">
          <EmotionGraph
            selectedId={selectedId}
            filterCategory={filterCategory}
            onSelectEmotion={handleSelect}
          />
          <div className="absolute bottom-3 left-3 text-xs text-slate-600 select-none pointer-events-none">
            スクロール：ズーム ／ ドラッグ：移動 ／ ノードをクリック：詳細表示
          </div>
        </div>

        <aside className="w-80 flex-shrink-0 border-l border-slate-800 flex flex-col min-h-0">
          <EmotionDetail emotionId={selectedId} onSelectEmotion={handleSelect} />
        </aside>
      </div>
    </div>
  );
}
