'use client';

import { getEmotionById, categoryColors, categoryLabels } from '@/lib/emotions';

interface EmotionDetailProps {
  emotionId: string | null;
  onSelectEmotion: (id: string) => void;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-700 pb-1">
      {title}
    </h3>
    {children}
  </div>
);

const Tag = ({ text, color }: { text: string; color: string }) => (
  <span
    className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mr-1 mb-1"
    style={{ backgroundColor: `${color}33`, color, border: `1px solid ${color}66` }}
  >
    {text}
  </span>
);

const ValenceArousal = ({ valence, arousal }: { valence: number; arousal: number }) => {
  const valenceLabel = valence >= 1 ? 'ポジティブ' : valence <= -1 ? 'ネガティブ' : '中性';
  const arousalLabel = arousal >= 1 ? '高覚醒' : arousal <= -1 ? '低覚醒' : '中覚醒';
  const valenceColor = valence >= 1 ? '#4A90D9' : valence <= -1 ? '#E05252' : '#94a3b8';
  const arousalColor = arousal >= 1 ? '#f59e0b' : arousal <= -1 ? '#6366f1' : '#94a3b8';

  return (
    <div className="flex gap-2">
      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${valenceColor}22`, color: valenceColor }}>
        {valenceLabel}
      </span>
      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${arousalColor}22`, color: arousalColor }}>
        {arousalLabel}
      </span>
    </div>
  );
};

export default function EmotionDetail({ emotionId, onSelectEmotion }: EmotionDetailProps) {
  if (!emotionId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-slate-500 text-sm leading-relaxed">
          <p className="text-2xl mb-3">◎</p>
          <p className="font-medium text-slate-400 mb-1">感情ノードをクリック</p>
          <p>場面・トリガー、生起プロセス、</p>
          <p>身体反応、機能、状態遷移が</p>
          <p>ここに表示されます。</p>
        </div>
      </div>
    );
  }

  const emotion = getEmotionById(emotionId);
  if (!emotion) return null;

  const color = categoryColors[emotion.category];
  const catLabel = categoryLabels[emotion.category];

  return (
    <div className="h-full overflow-y-auto px-5 py-5 text-sm text-slate-200">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-start gap-3 mb-2">
          <div
            className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">{emotion.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{emotion.nameEn}</p>
          </div>
        </div>
        <Tag text={catLabel} color={color} />
        <div className="mt-2">
          <ValenceArousal valence={emotion.valence} arousal={emotion.arousal} />
        </div>
        <p className="mt-3 text-slate-300 leading-relaxed text-xs bg-slate-800 rounded p-2 border-l-2" style={{ borderColor: color }}>
          <span className="text-slate-400 font-medium">コア・テーマ：</span>
          {emotion.coreTheme}
        </p>
      </div>

      <Section title="場面・トリガー">
        <ul className="space-y-1">
          {emotion.triggers.map((t, i) => (
            <li key={i} className="flex gap-2 text-slate-300 leading-snug">
              <span className="text-slate-500 flex-shrink-0">▸</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="生起プロセス">
        <ol className="space-y-1">
          {emotion.process.map((p, i) => (
            <li key={i} className="flex gap-2 text-slate-300 leading-snug">
              <span className="text-slate-500 flex-shrink-0 font-mono text-xs pt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="身体反応・神経基盤">
        <ul className="space-y-1">
          {emotion.bodyReactions.map((r, i) => (
            <li key={i} className="flex gap-2 text-slate-300 leading-snug">
              <span className="text-slate-500 flex-shrink-0">·</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="進化的機能">
        <p className="text-slate-300 leading-relaxed">{emotion.function}</p>
      </Section>

      <Section title="状態遷移">
        <div className="space-y-2">
          {emotion.transitions.map((t, i) => {
            const target = getEmotionById(t.to);
            if (!target) return null;
            const targetColor = categoryColors[target.category];
            return (
              <button
                key={i}
                onClick={() => onSelectEmotion(t.to)}
                className="w-full flex items-center gap-2 text-left group"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: targetColor }}
                />
                <span className="text-xs text-slate-400 flex-shrink-0">{t.label}</span>
                <span className="text-slate-500 text-xs">→</span>
                <span
                  className="text-sm font-medium group-hover:underline"
                  style={{ color: targetColor }}
                >
                  {target.name}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {emotion.references.length > 0 && (
        <Section title="主要参考文献">
          <ul className="space-y-0.5">
            {emotion.references.map((r, i) => (
              <li key={i} className="text-xs text-slate-500 font-mono">
                {r}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
