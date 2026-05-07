'use client';

import {
  getEmotionById,
  categoryColors,
  categoryLabels,
  transitionTypeColors,
  transitionTypeLabels,
  type TransitionType,
} from '@/lib/emotions';

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

const TransitionTypeBadge = ({ type }: { type: TransitionType }) => {
  const color = transitionTypeColors[type];
  const label = transitionTypeLabels[type];
  return (
    <span
      className="text-xs px-1.5 py-0.5 rounded font-mono flex-shrink-0"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {label}
    </span>
  );
};

const DimBar = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number; // -2 to 2
  color: string;
}) => {
  const pct = ((value + 2) / 4) * 100;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-400 w-10 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-slate-500 w-8 text-right font-mono">{value > 0 ? `+${value}` : value}</span>
    </div>
  );
};

const PADDisplay = ({
  valence,
  arousal,
  dominance,
}: {
  valence: number;
  arousal: number;
  dominance: number;
}) => (
  <div className="space-y-1.5">
    <DimBar label="快・不快" value={valence} color={valence >= 0 ? '#4A90D9' : '#E05252'} />
    <DimBar label="覚醒度" value={arousal} color={arousal >= 0 ? '#f59e0b' : '#6366f1'} />
    <DimBar label="支配性" value={dominance} color={dominance >= 0 ? '#10B981' : '#94a3b8'} />
  </div>
);

const AppraisalDisplay = ({
  nov, pleas, goal, cope, norm,
}: {
  nov: number; pleas: number; goal: number; cope: number; norm: number;
}) => (
  <div className="space-y-1.5">
    <DimBar label="新奇性" value={nov} color="#a78bfa" />
    <DimBar label="快適性" value={pleas} color="#4A90D9" />
    <DimBar label="目標整合" value={goal} color="#34d399" />
    <DimBar label="対処力" value={cope} color="#f59e0b" />
    <DimBar label="規範整合" value={norm} color="#fb923c" />
  </div>
);

const TemporalDisplay = ({
  onset, peak, decay, persist,
}: {
  onset: number; peak: number; decay: number; persist: number;
}) => {
  const fmt = (n: number, unit: string) => {
    if (n >= 1440) return `${(n / 1440).toFixed(0)}日`;
    if (n >= 60) return `${(n / 60).toFixed(0)}時間`;
    return `${n}${unit}`;
  };
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      {[
        { label: '発現', val: fmt(onset / 60, '秒') },
        { label: 'ピーク', val: fmt(peak, '分') },
        { label: '半減期', val: fmt(decay, '分') },
        { label: '持続', val: `${persist}時間` },
      ].map(({ label, val }) => (
        <div key={label} className="bg-slate-800 rounded p-2">
          <div className="text-slate-500">{label}</div>
          <div className="text-slate-200 font-mono mt-0.5">{val}</div>
        </div>
      ))}
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
        <p className="mt-3 text-slate-300 leading-relaxed text-xs bg-slate-800 rounded p-2 border-l-2" style={{ borderColor: color }}>
          <span className="text-slate-400 font-medium">コア・テーマ：</span>
          {emotion.coreTheme}
        </p>
      </div>

      {/* PAD Coordinates */}
      <Section title="PAD感情空間">
        <PADDisplay
          valence={emotion.valence}
          arousal={emotion.arousal}
          dominance={emotion.dominance}
        />
      </Section>

      {/* Appraisal Profile */}
      <Section title="評価プロファイル（Scherer CPM）">
        <AppraisalDisplay {...emotion.appraisal} />
      </Section>

      {/* Temporal Profile */}
      <Section title="時間的プロファイル">
        <TemporalDisplay {...emotion.temporal} />
      </Section>

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

      {/* Regulation */}
      <Section title="感情調整方略">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-500 mb-1">適応的方略</p>
            <ul className="space-y-0.5">
              {emotion.regulation.adaptive.map((s, i) => (
                <li key={i} className="flex gap-2 text-slate-300 text-xs leading-snug">
                  <span className="text-emerald-500 flex-shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">再評価の方向性</p>
            <ul className="space-y-0.5">
              {emotion.regulation.reappraisal.map((s, i) => (
                <li key={i} className="flex gap-2 text-slate-300 text-xs leading-snug">
                  <span className="text-violet-400 flex-shrink-0">↺</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          {emotion.regulation.contraindicated.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-1">逆効果な方略</p>
              <ul className="space-y-0.5">
                {emotion.regulation.contraindicated.map((s, i) => (
                  <li key={i} className="flex gap-2 text-slate-300 text-xs leading-snug">
                    <span className="text-red-400 flex-shrink-0">✕</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>

      {/* Transitions */}
      <Section title="状態遷移">
        <div className="space-y-2">
          {emotion.transitions.map((t, i) => {
            const target = getEmotionById(t.to);
            if (!target) return null;
            const targetColor = categoryColors[target.category];
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <TransitionTypeBadge type={t.type} />
                </div>
                <button
                  onClick={() => onSelectEmotion(t.to)}
                  className="w-full flex items-center gap-2 text-left group pl-1"
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
              </div>
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
