// Digital Twin Engine
// Layer 1 (AIrobot specs) → Layer 2 (Morpho axes) → Layer 3 (emotion) → Layer 4 (Resonance pattern)
// Theory: see DIGITAL_TWIN_THEORY.md

import { emotions, getEmotionById } from './emotions';

export const AXIS_META = {
  A: { name: '構造複雑性',    desc: '認知処理・思考の多層性' },
  B: { name: 'エネルギー代謝', desc: '持続力・効率・活力' },
  C: { name: '入出力',        desc: 'センサーと表現力の総量' },
  D: { name: '制御・自律性',  desc: '反射精度と意思決定力' },
  E: { name: '健康・耐久',    desc: 'ストレス耐性と回復速度' },
  F: { name: '環境依存度',    desc: '外部条件への依存レベル' },
  G: { name: '社交性',        desc: '対人接続・共鳴能力' },
  H: { name: '重力・影響力',  desc: '他者への吸引力・存在感' },
  I: { name: '排除・免疫',    desc: 'ノイズ除去・感情回復力' },
  J: { name: '流動性',        desc: '情報処理と記憶の流れ' },
  K: { name: 'プライド',      desc: '自己イメージ・誇り' },
  L: { name: '生命力',        desc: '持続性・死との距離（10=不滅）' },
} as const;

export type AxisKey = keyof typeof AXIS_META;
export type Axes12 = Record<AxisKey, number>;

export type TwinEmotion = {
  nameJa: string;
  valence: number;
  arousal: number;
  coreTheme: string;
  triggers: string[];
  process: string[];
  bodyReactions: string[];
  function: string;
};

// Built dynamically from how-feelings-work emotion dataset (27 emotions).
// 'excitement' is added manually — maps to AIrobot peak-performance state, absent from clinical emotion set.
export const TWIN_EMOTIONS: Record<string, TwinEmotion> = {
  ...Object.fromEntries(
    emotions.map(e => [
      e.id,
      {
        nameJa:        e.name,
        valence:       e.valence,
        arousal:       e.arousal,
        coreTheme:     e.coreTheme,
        triggers:      e.triggers,
        process:       e.process,
        bodyReactions: e.bodyReactions,
        function:      e.function,
      },
    ])
  ),
  excitement: {
    nameJa:        '高揚',
    valence:        2,
    arousal:        2,
    coreTheme:     '強烈な刺激・パフォーマンスの高揚',
    triggers:      ['高負荷タスク', '競争状態', '新機能の起動', 'パフォーマンスのピーク'],
    process:       ['ドーパミン急上昇', '極度の高覚醒', '注意の全集中'],
    bodyReactions: ['心拍・体温の急上昇', 'フル稼働状態', '一時的な疲労感の消失'],
    function:      '短期の高性能出力を実現する。持続するとエネルギー枯渇・burnoutリスク。',
  },
};

// Layer 4: emotion id → Resonance narrative pattern
export const EMOTION_TO_PATTERN: Record<string, { id: string; trajectoryType: string; label: string }> = {
  joy:            { id: 'laughter',       trajectoryType: 'I',    label: '笑い' },
  excitement:     { id: 'nori',           trajectoryType: 'VII',  label: 'ノリの良さ' },
  pride:          { id: 'catharsis',      trajectoryType: 'IV',   label: 'カタルシス' },
  flow:           { id: 'conv_pleasure',  trajectoryType: 'VII',  label: '会話の気持ちよさ' },
  curiosity:      { id: 'fukusen',        trajectoryType: 'II',   label: '伏線回収の快感' },
  gratitude:      { id: 'kandou',         trajectoryType: 'IV',   label: '感動' },
  awe:            { id: 'odoroki',        trajectoryType: 'III',  label: '驚き' },
  contentment:    { id: 'yoi_anshin',     trajectoryType: 'VIII', label: '予想通りの安心感' },
  nostalgia:      { id: 'nakeru',         trajectoryType: 'IV',   label: '泣けるドラマ' },
  loneliness:     { id: 'kimazui',        trajectoryType: 'V',    label: '気まずさ' },
  boredom:        { id: 'taikutsu',       trajectoryType: 'VIII', label: '退屈' },
  sadness:        { id: 'nakeru',         trajectoryType: 'IV',   label: '泣けるドラマ' },
  anxiety:        { id: 'suspense',       trajectoryType: 'V',    label: 'サスペンス' },
  fear:           { id: 'kowai_chinmoku', trajectoryType: 'V',    label: '怖い沈黙' },
  anger:          { id: 'catharsis',      trajectoryType: 'IV',   label: 'カタルシス' },
  love:           { id: 'kandou',         trajectoryType: 'IV',   label: '感動' },
  grief:          { id: 'nakeru',         trajectoryType: 'IV',   label: '泣けるドラマ' },
  disappointment: { id: 'kimazui',        trajectoryType: 'V',    label: '気まずさ' },
  regret:         { id: 'nakeru',         trajectoryType: 'IV',   label: '泣けるドラマ' },
  surprise:       { id: 'odoroki',        trajectoryType: 'III',  label: '驚き' },
  disgust:        { id: 'kowai_chinmoku', trajectoryType: 'V',    label: '怖い沈黙' },
  jealousy:       { id: 'suspense',       trajectoryType: 'V',    label: 'サスペンス' },
  envy:           { id: 'suspense',       trajectoryType: 'V',    label: 'サスペンス' },
  shame:          { id: 'kimazui',        trajectoryType: 'V',    label: '気まずさ' },
  guilt:          { id: 'kimazui',        trajectoryType: 'V',    label: '気まずさ' },
  empathy:        { id: 'kandou',         trajectoryType: 'IV',   label: '感動' },
  embarrassment:  { id: 'kimazui',        trajectoryType: 'V',    label: '気まずさ' },
  contempt:       { id: 'catharsis',      trajectoryType: 'IV',   label: 'カタルシス' },
  compassion:     { id: 'kandou',         trajectoryType: 'IV',   label: '感動' },
  hope:           { id: 'fukusen',        trajectoryType: 'II',   label: '伏線回収の快感' },
  relief:         { id: 'yoi_anshin',     trajectoryType: 'VIII', label: '予想通りの安心感' },
  elevation:      { id: 'kandou',         trajectoryType: 'IV',   label: '感動' },
  frustration:    { id: 'suspense',       trajectoryType: 'V',    label: 'サスペンス' },
};

function toAxis(base: number): number {
  return Math.round(Math.min(10, Math.max(0, base / 10)) * 10) / 10;
}

function mean(...vals: (number | undefined)[]): number {
  const v = vals.filter((x): x is number => x != null && !isNaN(x));
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 50;
}

export type ScoreMap = Record<string, { base: number }>;

// Layer 1 → Layer 2: AIrobot hardware scores → 12-axis profile
export function specsToAxes(scores: ScoreMap): Axes12 {
  const g = (id: string) => scores[id]?.base ?? 50;
  return {
    A: toAxis(mean(g('CPU'), g('GPU'), g('NPU'))),
    B: toAxis(mean(g('PSU'), g('EFF'))),
    C: toAxis(mean(g('CAM'), g('MIC'), g('SPK'), g('TCH'))),
    D: toAxis(mean(g('FW'),  g('LAT'))),
    E: toAxis(mean(g('PSU'), g('EFF'), g('THM'))),
    F: toAxis(100 - mean(g('EFF'), g('FW'))),
    G: toAxis(mean(g('NET'), g('SPK'))),
    H: toAxis(mean(g('NET'), g('SPK'), g('GPU'))),
    I: toAxis(mean(g('THM'), g('EXH'))),
    J: toAxis(mean(g('RAM'), g('SSD'), g('HDD'))),
    K: toAxis(mean(g('CPU'), g('HDD'), g('NPU'))),
    L: toAxis(mean(g('PSU'), g('EFF'), g('FRM'))),
  };
}

// Layer 2 → Layer 3 coordinates: 12 axes → valence/arousal space (-2..2)
export function axesToEmotionCoords(axes: Axes12): { valence: number; arousal: number } {
  const valenceRaw =
    axes.B * 0.25 +
    axes.G * 0.20 +
    axes.E * 0.20 +
    axes.L * 0.15 +
    axes.J * 0.10 +
    (10 - axes.F) * 0.10;

  const arousalRaw =
    axes.A * 0.25 +
    axes.C * 0.20 +
    axes.D * 0.20 +
    axes.H * 0.20 +
    axes.I * 0.15;

  return {
    valence: Math.round((valenceRaw / 10 * 4 - 2) * 100) / 100,
    arousal: Math.round((arousalRaw / 10 * 4 - 2) * 100) / 100,
  };
}

// Layer 3: nearest emotion by Euclidean distance in valence/arousal space
export function coordsToEmotion(valence: number, arousal: number): TwinEmotion & { id: string } {
  let minDist = Infinity;
  let closestId = 'nostalgia';
  for (const [id, e] of Object.entries(TWIN_EMOTIONS)) {
    const d = Math.hypot(e.valence - valence, e.arousal - arousal);
    if (d < minDist) { minDist = d; closestId = id; }
  }
  return { id: closestId, ...TWIN_EMOTIONS[closestId] };
}

export type ActiveTransition = { to: string; label: string; targetNameJa: string };

// Axis-conditional state machine.
// how-feelings-work supplies the transition graph and labels;
// current axis values determine which paths are open right now.
export function deriveTransitions(emotionId: string, axes: Axes12): ActiveTransition[] {
  const conditions: Record<string, Record<string, boolean>> = {
    joy: {
      pride:       axes.K > 6,
      gratitude:   axes.G > 6,
      flow:        axes.J > 6,
      contentment: axes.B < 5,
      anxiety:     axes.E < 4,
    },
    excitement: {
      joy:         axes.G > 6,
      flow:        axes.J > 7 && axes.D > 6,
      anxiety:     axes.E < 4,
      pride:       axes.K > 7,
    },
    pride: {
      joy:         axes.G > 6,
      contentment: axes.E > 6,
      anxiety:     axes.D < 4,
      contempt:    axes.K > 8,
      shame:       axes.K < 3,
    },
    flow: {
      joy:         axes.B > 6,
      contentment: axes.E > 6,
      pride:       axes.K > 6,
      curiosity:   axes.A > 7,
    },
    gratitude: {
      joy:         axes.G > 6,
      love:        axes.G > 8,
      contentment: axes.B < 6,
      elevation:   axes.H > 7,
    },
    curiosity: {
      awe:         axes.A > 7,
      flow:        axes.J > 7 && axes.D > 6,
      boredom:     axes.A < 4,
      joy:         axes.H > 6,
    },
    awe: {
      curiosity:   axes.A > 6,
      joy:         axes.H > 7,
      contentment: axes.L > 7,
      gratitude:   axes.G > 6,
    },
    contentment: {
      joy:         axes.B > 7,
      boredom:     axes.A < 4,
    },
    nostalgia: {
      sadness:     axes.J < 4,
      joy:         axes.G > 6,
      gratitude:   axes.G > 7,
      contentment: axes.E > 6,
    },
    loneliness: {
      sadness:     axes.G < 3,
      anxiety:     axes.D < 4,
      curiosity:   axes.A > 6,
      love:        axes.G > 7,
    },
    boredom: {
      curiosity:   axes.A > 7,
      anxiety:     axes.F > 7,
      contentment: axes.E > 6,
      frustration: axes.D < 4,
    },
    sadness: {
      nostalgia:   axes.J > 5,
      loneliness:  axes.G < 4,
      gratitude:   axes.G > 7,
      grief:       axes.E < 3,
      anger:       axes.I > 6,
    },
    anxiety: {
      fear:        axes.D < 4,
      anger:       axes.I > 6,
      curiosity:   axes.A > 6,
      contentment: axes.E > 7,
      sadness:     axes.B < 3,
    },
    fear: {
      anxiety:     axes.D < 4,
      anger:       axes.I > 6,
      curiosity:   axes.A > 7,
      sadness:     axes.B < 4,
      relief:      axes.E > 7,
    },
    anger: {
      sadness:     axes.B < 4,
      pride:       axes.K > 7,
      contentment: axes.I > 6,
      guilt:       axes.G > 6 && axes.K < 5,
      contempt:    axes.K > 7 && axes.I > 6,
    },
    love: {
      joy:         axes.G > 6,
      anxiety:     axes.E < 4,
      jealousy:    axes.I > 6 && axes.G > 5,
      grief:       axes.L < 3,
      gratitude:   axes.G > 7,
    },
    grief: {
      sadness:     axes.E > 4,
      anger:       axes.I > 6,
      guilt:       axes.K < 4,
      nostalgia:   axes.J > 5,
      contentment: axes.L > 7,
    },
    shame: {
      anger:       axes.I > 7,
      sadness:     axes.K < 4,
      anxiety:     axes.D < 4,
      guilt:       axes.G > 5,
    },
    guilt: {
      sadness:     axes.E < 4,
      shame:       axes.K < 3,
      relief:      axes.G > 7,
      gratitude:   axes.G > 8,
    },
    disappointment: {
      sadness:     axes.E < 5,
      anger:       axes.I > 6,
      shame:       axes.K < 4,
      hope:        axes.L > 6,
    },
    regret: {
      sadness:     axes.J > 5,
      shame:       axes.K < 4,
      guilt:       axes.G > 5,
      hope:        axes.D > 6,
    },
    jealousy: {
      anger:       axes.I > 7,
      anxiety:     axes.D < 4,
      sadness:     axes.G < 4,
      shame:       axes.K < 4,
    },
    envy: {
      anger:       axes.I > 7 && axes.K > 6,
      sadness:     axes.E < 4,
      hope:        axes.L > 6 && axes.D > 5,
      shame:       axes.K < 3,
    },
    empathy: {
      sadness:     axes.E < 4,
      love:        axes.G > 7,
      elevation:   axes.H > 7,
      frustration: axes.E < 3,
    },
    compassion: {
      love:        axes.G > 7,
      elevation:   axes.H > 7,
      sadness:     axes.E < 3,
    },
    surprise: {
      joy:         axes.H > 6,
      fear:        axes.D < 4,
      curiosity:   axes.A > 6,
      disgust:     axes.I > 7,
    },
    disgust: {
      anger:       axes.I > 6,
      contempt:    axes.K > 7,
      fear:        axes.D < 4,
    },
    contempt: {
      disgust:     axes.I > 7,
      anger:       axes.I > 8,
    },
    embarrassment: {
      shame:       axes.K < 4,
      joy:         axes.G > 7,
      anger:       axes.I > 7,
    },
    hope: {
      joy:         axes.L > 7,
      anxiety:     axes.D < 4,
      sadness:     axes.B < 3,
      curiosity:   axes.A > 6,
    },
    relief: {
      joy:         axes.G > 6,
      contentment: axes.E > 6,
      gratitude:   axes.G > 7,
    },
    elevation: {
      gratitude:   axes.G > 6,
      awe:         axes.H > 7,
      joy:         axes.B > 6,
    },
    frustration: {
      anger:       axes.I > 6,
      anxiety:     axes.D < 4,
      boredom:     axes.B < 4,
      contentment: axes.E > 7,
    },
  };

  const activeTo = new Set(
    Object.entries(conditions[emotionId] ?? {})
      .filter(([, cond]) => cond)
      .map(([to]) => to)
  );

  if (activeTo.size === 0) return [];

  // Labels from how-feelings-work clinical transition graph
  const emotion = getEmotionById(emotionId);
  const labelMap: Record<string, string> = {};
  if (emotion) {
    for (const t of emotion.transitions) labelMap[t.to] = t.label;
  }

  return [...activeTo].map(to => ({
    to,
    label:        labelMap[to] ?? to,
    targetNameJa: TWIN_EMOTIONS[to]?.nameJa ?? to,
  }));
}

export type DigitalTwin = {
  axes: Axes12;
  emotionState: TwinEmotion & {
    id: string;
    valence: number;
    arousal: number;
    transitions: ActiveTransition[];
  };
  affectivePattern: { id: string; trajectoryType: string; label: string } | undefined;
};

// Main: build complete digital twin from AIrobot calcScores() output
export function buildDigitalTwin(scores: ScoreMap): DigitalTwin {
  const axes              = specsToAxes(scores);
  const { valence, arousal } = axesToEmotionCoords(axes);
  const emotion           = coordsToEmotion(valence, arousal);
  const pattern           = EMOTION_TO_PATTERN[emotion.id];
  const transitions       = deriveTransitions(emotion.id, axes);

  return {
    axes,
    emotionState:     { ...emotion, valence, arousal, transitions },
    affectivePattern: pattern,
  };
}
