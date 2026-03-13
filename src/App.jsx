import React, { useMemo, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   インラインSVGアイコンシステム（lucide-react不使用）
   24x24 viewBox、ストロークベース、2pxストローク
   ───────────────────────────────────────────── */
const ICON_PATHS = {
  bookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  brain: "M9.5 2a3.5 3.5 0 0 0-3 5.1A3.5 3.5 0 0 0 5 10.5 3.5 3.5 0 0 0 6 14a3.5 3.5 0 0 0 2.8 4A3.5 3.5 0 0 0 12 21a3.5 3.5 0 0 0 3.2-3 3.5 3.5 0 0 0 2.8-4 3.5 3.5 0 0 0 1-3.5 3.5 3.5 0 0 0-1.5-3.4A3.5 3.5 0 0 0 14.5 2 3.5 3.5 0 0 0 12 3.5 3.5 3.5 0 0 0 9.5 2zM12 3.5v17.5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  folderOpen: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2zM2 10h20",
  settings: "M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  settingsGear: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  bot: "M12 8V4H8M8 2h8M2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM9 16h.01M15 16h.01",
  penTool: "M12 19l7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18z M2 2l7.586 7.586M11 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  checkCircle: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9 12l2 2 4-4",
  sparkles: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8",
  imagePlus: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7M16 5h6M19 2v6M21 15l-5-5L5 21",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  panelsTopLeft: "M3 3h18a0 0 0 0 1 0 0v18a0 0 0 0 1 0 0H3a0 0 0 0 1 0 0V3zM3 9h18M9 21V9",
  workflow: "M3 3h4v4H3zM17 3h4v4h-4zM10 17h4v4h-4zM5 7v3a4 4 0 0 0 4 4h2M19 7v3a4 4 0 0 1-4 4h-2",
  laptop: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9M2 20h20M12 16v4",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  compass: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  refreshCcw: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  link2: "M9 17H7a5 5 0 0 1 0-10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  headphones: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
  table2: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  layoutGrid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  school: "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5",
  share2: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
  lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
  chevronDown: "M6 9l6 6 6-6",
  alertTriangle: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  layers: "M12 2l10 6.5v7L12 22 2 15.5v-7zM2 8.5l10 6.5 10-6.5M12 22V15",
  messageSquare: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5",
};

function Ico({ name, className = "", style = {} }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={d} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   フォント + グローバルスタイル
   ───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Fraunces', Georgia, serif; }
    .ff-body { font-family: 'DM Sans', system-ui, sans-serif; }
    .ff-mono { font-family: 'JetBrains Mono', monospace; }
    * { font-family: 'DM Sans', system-ui, sans-serif; }
    .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `}</style>
);

/* ─────────────────────────────────────────────
   カラー
   ───────────────────────────────────────────── */
const C = {
  cream: "#FAF8F4", creamDark: "#F0EDE6", ink: "#1A1A1A", inkLight: "#6B6B6B",
  inkMuted: "#9B9B9B", border: "#E2DFD8", borderLight: "#ECEAE4",
  greenDeep: "#0A3D2E", greenMid: "#10a37f", greenLight: "#E8F5EE", roseAccent: "#E11D48",
};

/* ─────────────────────────────────────────────
   データ
   ───────────────────────────────────────────── */
const VERIFIED_DATE = "2026年3月12日";
const LEVELS = [
  { key: "all", label: "すべて" }, { key: "foundation", label: "基礎" },
  { key: "core", label: "中核" }, { key: "power", label: "上級機能" }, { key: "expert", label: "エキスパート" },
];

const CORE_FEATURES = [
  { title: "検索", ico: "globe", color: "#0284c7", description: "現在の事実、価格、ニュース、法規制など、変化する情報をリアルタイムのウェブ結果で確認できます。", when: "モデルの学習時点以降に変わっている可能性があるもの全般。" },
  { title: "ディープリサーチ", ico: "search", color: "#4f46e5", description: "ウェブソース、ファイル、接続済みアプリを横断して行う、複数段階の文書化されたリサーチ。", when: "簡単な回答ではなく、出典付きのレポートが必要なとき。" },
  { title: "プロジェクト", ico: "folderOpen", color: "#059669", description: "共有ファイル、カスタム指示、会話の記憶をまとめて保持できる継続型ワークスペース。", when: "授業、クライアント案件、スタートアップなど、何度も見返す作業。" },
  { title: "メモリ", ico: "database", color: "#d97706", description: "継続的な好みや文脈を会話をまたいで保存します。", when: "好みや傾向の保持向き。文書そのものの保存向きではありません。" },
  { title: "カスタム指示", ico: "settingsGear", color: "#57534e", description: "口調、書式、回答構成などのルールを常時適用します。", when: "すべてのチャットで自分のルールを標準適用したいとき。" },
  { title: "キャンバス", ico: "panelsTopLeft", color: "#334155", description: "文章やコードを、狙いを絞ってインライン編集できる可視的な作業面。", when: "長文テキストやコードを反復的に編集するとき。" },
  { title: "タスク", ico: "clock", color: "#7c3aed", description: "後で実行される出力を予約し、通知を受け取れます。", when: "リマインダー、日次ブリーフ、定期要約。" },
  { title: "アプリ（コネクタ）", ico: "wrench", color: "#0d9488", description: "外部ツールを接続し、ChatGPT があなたのデータを読み取って活用できるようにします。", when: "最も重要な文脈がチャットの外にあるとき。" },
  { title: "エージェント", ico: "workflow", color: "#16a34a", description: "ブラウザ、ファイル、コード、接続アプリを横断して自律実行します。", when: "複数サイトや複数アクションにまたがる作業。" },
  { title: "カスタムGPT", ico: "bot", color: "#44403c", description: "安定した指示と知識ファイルを備えた、再利用可能な専用アシスタント。", when: "同じワークフローを十分な回数繰り返すとき。" },
  { title: "音声", ico: "mic", color: "#e11d48", description: "摩擦の少ない思考整理や探索のための音声対話。", when: "声に出して考えたいときや、ながら作業をしたいとき。" },
  { title: "画像", ico: "imagePlus", color: "#c026d3", description: "アップロードした画像の解析、説明文からの生成、インライン編集に対応。", when: "視覚情報の理解、作成、修正が必要なとき。" },
  { title: "ファイルとデータ", ico: "fileText", color: "#0891b2", description: "PDF、表計算ファイル、文書をアップロードして、コード実行を含む分析ができます。", when: "グラフ、要約、計算が必要なとき。" },
  { title: "モデル", ico: "brain", color: "#65a30d", description: "速度重視、バランス型、推論重視などのモードを選択できます。", when: "作業の複雑さに合わせて性能を選びたいとき。" },
];

const ADDITIONAL_FEATURES = [
  { title: "学習モード", ico: "school", color: "#059669", description: "質問や理解確認を交えながら学べるガイド付き学習。" },
  { title: "録音", ico: "headphones", color: "#0284c7", description: "会議などの音声を記録し、あとで要約を作成できます。" },
  { title: "グループチャット", ico: "users", color: "#7c3aed", description: "会話に他の人を招待し、共同で計画できます。" },
  { title: "共有リンク", ico: "link2", color: "#57534e", description: "会話をURLで共有できます。" },
  { title: "画像編集", ico: "camera", color: "#c026d3", description: "生成画像の特定領域を選んで調整できます。" },
  { title: "インタラクティブ表", ico: "table2", color: "#0891b2", description: "アップロードしたデータを分析前に視覚的に確認できます。" },
  { title: "スキル", ico: "share2", color: "#0d9488", description: "繰り返し作業を安定して実行するための再利用可能なワークフロー。" },
  { title: "Pulse", ico: "sparkles", color: "#4f46e5", description: "視覚的な要約付きで結果を返す非同期リサーチ。" },
];

const TOOL_CHOOSER = [
  { goal: "手早く答えや下書きを作る", tool: "通常チャット", ico: "messageSquare", reason: "最も手軽だから。" },
  { goal: "最新情報を知る", tool: "検索", ico: "globe", reason: "更新されている可能性がある情報向き。" },
  { goal: "ファイル付きの継続作業", tool: "プロジェクト", ico: "folderOpen", reason: "セッションをまたいで文脈を保持できる。" },
  { goal: "長い文書を編集する", tool: "キャンバス", ico: "panelsTopLeft", reason: "細かく狙った修正に向いている。" },
  { goal: "複数ソースのレポート", tool: "ディープリサーチ", ico: "search", reason: "引用付きで複数段階の統合ができる。" },
  { goal: "複雑なオンライン作業", tool: "エージェント", ico: "workflow", reason: "複数のサイトと操作をまたげる。" },
  { goal: "定期的に出力したい", tool: "タスク", ico: "clock", reason: "非同期で実行され、通知も届く。" },
  { goal: "同じ作業を何度も行う", tool: "GPT または スキル", ico: "bot", reason: "繰り返しを仕組みにできる。" },
];

const PROMPT_BLOCKS = [
  { label: "目的", example: "投資家向けミーティング用に、1ページのプロジェクト概要を書いてください。", color: "#10a37f" },
  { label: "背景", example: "このスタートアップは売上前、シリーズA段階、気候テック分野です。", color: "#0284c7" },
  { label: "制約", example: "400語以内。専門用語なし。箇条書きなし。", color: "#7c3aed" },
  { label: "形式", example: "構成は「課題、解決策、実績、要望」の順。", color: "#d97706" },
  { label: "品質", example: "テンプレートっぽくではなく、McKinsey のアソシエイト水準で書いてください。", color: "#e11d48" },
  { label: "検証", example: "出典が必要な主張は必ず指摘してください。", color: "#334155" },
];

const GUIDE_SECTIONS = [
  { id:"mental-model", level:"foundation", number:"01", title:"まずは正しい捉え方を持つ", ico:"brain", color:"#65a30d",
    summary:"ChatGPT を万能の正解装置ではなく、推論のパートナーとして扱ってください。最初の回答は便利な下書きであって、最終的な真実ではありません。確認するまでは、すべて仮の出力として扱うべきです。",
    whyItMatters:"多くの失望は、期待の置き方を誤ることから生まれます。確実性ではなく、質の高い初稿が返るものだと考える方が適切です。",
    beginnerMoves:["最初の回答は下書きだと考える。批判的に読む。","どのような前提で答えたかを尋ねる。","判断を置き換えるのではなく、判断を速めるために使う。"],
    advancedMoves:["最も強い反対意見を出させる。","探索、推奨、リスク確認を段階に分けて進める。","重要な意思決定では第二の意見として使う。"],
    commonMistakes:["数値の主張を検証せずに信じる。","何も言わないことを自信の表れだと誤解する。","出力をそのまま貼り付ける。"],
    promptExamples:[{prompt:"どんな前提を置きましたか。",why:"隠れた前提を表に出せる。"},{prompt:"懐疑的な専門家なら何を問題視しますか。",why:"反対側からの自己点検になる。"},{prompt:"あなたの提案に対する最も強い反論を示してください。",why:"確証バイアスを防ぐ。"},{prompt:"各主張の確信度を1〜5で評価してください。",why:"事実と推測を切り分けられる。"}],
    beforeAfter:{before:"コーヒーショップの事業計画を書いて。",after:"ボストン中心部のスペシャルティコーヒーショップについて、1ページの事業計画を作成してください。対象は大学院生とリモートワーカーです。推定に基づく部分は、出典のある内容と分けて明示してください。",improvement:"背景、対象、場所、検証ルールが加わり、精度が上がる。"},
    visual:"mental" },
  { id:"workspace", level:"foundation", number:"02", title:"プロンプトにこだわる前に、作業場所を理解する", ico:"laptop", color:"#059669",
    summary:"今の ChatGPT は多層的なワークスペースです。作業ごとに適した層があります。間違った場所で巧妙なプロンプトを書くより、正しい場所で普通のプロンプトを書く方が成果は上がります。",
    whyItMatters:"入力前に最も効果が大きい判断は、どの作業場所を使うかを選ぶことです。",
    beginnerMoves:["単発の作業には通常チャット。","あとで見返す作業にはプロジェクト。","まっさらな状態で始めたいときは Temporary Chat。"],
    advancedMoves:["授業、クライアント、施策ごとにプロジェクトを分ける。","プロジェクトを長期的な知識ハブとして使う。","戦略はチャット、反復編集はキャンバスで行う。"],
    commonMistakes:["毎回新しいチャットを始めて、文脈を失う。","長文文書をキャンバスではなくチャットで扱う。","タスクやエージェントをまったく使わない。"],
    promptExamples:[{prompt:"これはチャット、プロジェクト、GPT のどれで進めるのが最適ですか。",why:"作業場所の選択をモデルに手伝わせる。"},{prompt:"今学期の理想的なプロジェクト構成を提案してください。",why:"先に設計を固められる。"},{prompt:"追加すべきファイルと指示は何ですか。",why:"プロジェクト文脈を最適化できる。"}],
    beforeAfter:{before:"毎回新しいチャットを始めて、文脈が消えてしまう。",after:"プロジェクトを作成する。参考資料をアップロードする。指示を設定する。同じプロジェクトに戻って使う。",improvement:"一時的なチャットが、継続的な作業場に変わる。"},
    visual:"layers" },
  { id:"prompting", level:"foundation", number:"03", title:"プロンプト設計では、巧さより明確さ", ico:"penTool", color:"#0284c7",
    summary:"良いプロンプトは、作業指示書です。言い回しの巧みさは必須ではありませんが、条件の明確さは不可欠です。頭の中にある基準を書かなければ、モデルには見えません。",
    whyItMatters:"曖昧なプロンプトは、無難で一般的な出力につながります。多くの不満は、入力条件の不足が原因です。",
    beginnerMoves:["対象読者と用途を明示する。","成功の定義を書く。","形式、口調、長さ、避けたいものを指定する。"],
    advancedMoves:["まずアウトラインを出させ、承認後に本文を書かせる。","事実と解釈を分ける。","自己採点用の評価基準を与える。"],
    commonMistakes:["3語程度のプロンプトで、個別最適化された結果を期待する。","制約を一度に詰め込みすぎる。","'Can you...?' のような依頼口調にして、指示が弱くなる。"],
    promptExamples:[{prompt:"Goal: ___. Context: ___. Constraints: ___. Produce: ___.",why:"汎用的に使える基本形。"},{prompt:"まずアウトラインだけ出してください。本文はまだ書かないでください。",why:"構成違いの書き直しを防げる。"},{prompt:"書き始める前に、必要な情報を教えてください。",why:"モデル側に確認質問をさせられる。"},{prompt:"[役割] として、[対象読者] に説明する文体で書いてください。",why:"口調と深さを安定させる。"}],
    beforeAfter:{before:"カバーレターを書いて。",after:"McKinsey の Strategy Analyst 職向けのカバーレターを書いてください。私は International Management の大学院生で、SOP と CRM の実務経験があります。自信はあるが傲慢ではないトーンで。350語以内。『I am passionate about』は使わないでください。",improvement:"職種、背景、口調、長さ、禁止表現が明確になる。"},
    visual:"prompt" },
  { id:"revision", level:"core", number:"04", title:"一発完璧より、修正の流れを作る", ico:"refreshCcw", color:"#7c3aed",
    summary:"うまい使い方は反復です。枠組みを決め、下書きを作り、批評し、修正し、仕上げる。多くの人は磨くべき場面で最初からやり直しています。",
    whyItMatters:"一発回答に頼ると品質は最初の出来で頭打ちになります。修正工程を入れる方が、安定して良い結果になります。",
    beginnerMoves:["下書きの後に『何が弱いか、何が足りないか』と聞く。","修正の狙いを絞る。","方向性が根本的に違わない限り、最初からやり直さない。"],
    advancedMoves:["構成、正確性、トーン、圧縮、仕上げの順で固定パスを作る。","書き直し前に自己批評させる。","何割圧縮するかまで指定する。"],
    commonMistakes:["モデルに自己診断させず、自分で全部直し始める。","『もっと良くして』のように曖昧な指示を出す。","焦点のない修正を何度も重ねる。"],
    promptExamples:[{prompt:"なぜこの回答は目的を満たしていないのですか。",why:"修正前に自己診断できる。"},{prompt:"構成は変えず、論理だけをより鋭くしてください。",why:"修正範囲を限定できる。"},{prompt:"本質を落とさずに35%圧縮してください。",why:"優先順位付けを強制できる。"},{prompt:"この基準で自己採点してください。4/5 未満の箇所はどこですか。",why:"構造化された自己評価になる。"}],
    beforeAfter:{before:"違います。もう一度やって。",after:"第2節の議論が循環しています。アップロードしたレポートのデータを1点入れて、その箇所だけ書き直してください。他はそのままで結構です。",improvement:"どこが問題か、何を直すか、何を残すかが明確になる。"},
    visual:"workflow" },
  { id:"writing", level:"core", number:"05", title:"執筆、書き換え、変換", ico:"fileText", color:"#57534e",
    summary:"ChatGPT が特に得意なのは変換です。対象読者に合わせた書き換え、トーン変更、要約、再構成など。ゼロから書くより、既存の文章を整える方が強い場面が多くあります。",
    whyItMatters:"実務の文章の多くは、ゼロから作るより変換です。ここは AI の費用対効果が高い領域です。",
    beginnerMoves:["元文を貼り、残すものと変えるものを明示する。","対象読者、チャネル、トーンを指定する。","トーンに迷うなら複数案を出させる。"],
    advancedMoves:["フォーマル、簡潔、説得的など、対照的な複数案を出す。","文単位で問題点を診断させる。","事実を保ったまま文体だけ移し替える。"],
    commonMistakes:["メモや草稿があるのに最初から書かせる。","最初のトーン案を比較せずに採用する。","何を保持すべきかを指定しない。"],
    promptExamples:[{prompt:"教授宛てメール用に書き換えてください。丁寧、簡潔、冗長さなしで。",why:"変換条件が明確。"},{prompt:"フォーマル、簡潔、説得的の3案を出してください。",why:"比較して選べる。"},{prompt:"どの文がありきたりに感じるか、その理由も示してください。",why:"行単位で診断できる。"},{prompt:"事実と構成は維持し、トーンだけを変えてください。",why:"修正範囲を限定できる。"}],
    beforeAfter:{before:"このメールを良くして。",after:"プログラムディレクター宛てに書き換えてください。丁寧かつ率直に。専門用語は削除。150語以内。行動項目は残してください。",improvement:"相手、トーン、避けたい要素、長さ、保持項目が明確になる。"},
    visual:"writing" },
  { id:"files-data", level:"core", number:"06", title:"ファイル、PDF、表計算、データ", ico:"table2", color:"#0891b2",
    summary:"ChatGPT はファイルを読み取り、文書を要約し、データに対してコードを実行し、グラフまで作れます。基本は、まず記述、次に分析、最後に結論です。",
    whyItMatters:"解釈の前にデータを確認するだけで、よくある誤りの多くを防げます。",
    beginnerMoves:["『何が入っているか』を先に聞き、『何を意味するか』は後に聞く。","まず項目監査を依頼する。","PDF は構造、主張、根拠に分けて見る。"],
    advancedMoves:["どんな前提を置いたかを必ず列挙させる。","表を抽出した後に結論を出させる。","大きなデータセットではコード実行を使う。"],
    commonMistakes:["いきなり『主要な示唆』を聞く。","グラフのラベルを確認せず信じる。","PDF の解析精度を過信する。"],
    promptExamples:[{prompt:"項目、期間、欠損値、分析可能な方向性を説明してください。",why:"分析前の監査になる。"},{prompt:"批評の前に、まず中心的な主張を抽出してください。",why:"理解してから判断できる。"},{prompt:"このグラフで使った前提をすべて列挙してください。",why:"監査可能性が上がる。"},{prompt:"これを整形する Python を書いて実行し、結果を見せてください。",why:"再現可能な分析になる。"}],
    beforeAfter:{before:"この表計算ファイルの主な示唆は？",after:"まず監査してください。列名、型、期間、欠損値を確認し、有用性の高い分析案を3つ優先順位付きで提案してください。私が承認するまで実行はしないでください。",improvement:"点検、提案、承認の流れが入る。"},
    visual:"data" },
  { id:"search-research", level:"core", number:"07", title:"検索、ディープリサーチ、引用", ico:"search", color:"#4f46e5",
    summary:"最新情報には検索を使います。複数段階のレポートにはディープリサーチを使います。現行性が重要なもの、規制が関わるもの、変化が速いものは、固定記憶に頼るべきではありません。",
    whyItMatters:"検索を使わない場合、ChatGPT は固定時点の知識から答えます。",
    beginnerMoves:["変わっている可能性があるものは必ず検索する。","引用元が、その主張を本当に支えているか確認する。","重要度が高い内容では一次情報を優先する。"],
    advancedMoves:["『確認済みの事実と、あなたの推論を分けてください』と指示する。","求めるソースの種類、地域、対象期間を指定する。","ディープリサーチには範囲を定義してから使う。"],
    commonMistakes:["現在の出来事に対して、モデルの内蔵知識だけを信じる。","『出典付き』と書かれているだけで検証しない。","単純な事実確認にディープリサーチを使う。"],
    promptExamples:[{prompt:"検索してください。一次情報のみで。",why:"ライブ検索に品質条件を付けられる。"},{prompt:"事実と推論を分けて、ラベルを付けてください。",why:"認識の状態が透明になる。"},{prompt:"この内容のうち、6か月以内に古くなる可能性があるものは何ですか。",why:"時間感度を把握できる。"},{prompt:"ディープリサーチ: [topic]. Scope: [region, dates].",why:"仕事の範囲を定義できる。"}],
    beforeAfter:{before:"AI規制の最新情報を教えて。",after:"検索してください。EU と米国の AI 規制について、過去30日分。一次情報のみ。施行済みのものと提案段階のものを分けてください。",improvement:"範囲、期間、ソース品質、分類が明確になる。"},
    visual:"research" },
  { id:"multimodal", level:"core", number:"08", title:"音声、画像、マルチモーダル活用", ico:"imagePlus", color:"#c026d3",
    summary:"音声対話、画像理解、画像生成、画像編集は今や標準機能です。重要なのは具体性です。曖昧な視覚指示では、曖昧な結果しか返りません。",
    whyItMatters:"マルチモーダル機能によって、ChatGPT は視覚分析ツール、画像制作環境、ハンズフリーの思考補助として使えます。",
    beginnerMoves:["画像をアップロードしたら、何をしてほしいかを明確に伝える。","仕上がりより速度を優先したいときは音声を使う。","画像生成では、被写体、構図、雰囲気、スタイルを指定する。"],
    advancedMoves:["解析、説明、ノート化の順にモードをつなぐ。","デザインレビューに画像批評を使う。","編集では領域を指定し、変更点を明示する。"],
    commonMistakes:["画像だけ上げて、指示を書かない。","曖昧な説明で写実性を期待する。","音声でもテキストと同じ文脈を共有していることを忘れる。"],
    promptExamples:[{prompt:"メニュー項目を抽出して、カテゴリ別に整理してください。",why:"具体的な抽出指示になる。"},{prompt:"このグラフを、非技術系の役員向けに120語で説明してください。",why:"条件付きの説明にできる。"},{prompt:"生成してください: 縦長9:16、シネマティック、ゴールデンアワー。",why:"撮影スタイルを具体化できる。"},{prompt:"背景を白いスタジオ風に変えてください。被写体はそのままで。",why:"編集範囲を限定できる。"}],
    beforeAfter:{before:"かっこいい画像を作って。",after:"16:9。夕暮れの現代的な東京のコーヒーショップ。建築写真風、浅い被写界深度、温かい雰囲気。木製カウンター、エスプレッソマシン、街の灯り。人物なし。",improvement:"比率、主題、スタイル、雰囲気、要素、除外条件が明確になる。"},
    visual:"multimodal" },
  { id:"study-collab", level:"power", number:"09", title:"学習、録音、共同作業、共有、スキル", ico:"layoutGrid", color:"#0d9488",
    summary:"学習支援、音声内容の記録、共同作業、共有、ワークフローの定式化に役立つ機能群です。",
    whyItMatters:"学ぶことは答えを受け取ることと違います。共同作業も、一人でのプロンプト利用とは別物です。",
    beginnerMoves:["答えをもらうだけでなく、学ぶなら学習モードを使う。","会議や講義には録音を使う。","共有リンクやグループチャットで共同作業を整理する。"],
    advancedMoves:["録音要約をプロジェクトのソースファイルとして蓄積する。","繰り返し作業をスキル化する。","グループチャットとプロジェクトを組み合わせて共有文脈を作る。"],
    commonMistakes:["勉強に通常チャットだけを使い、学習機会を失う。","録音機能の存在を忘れる。","共有リンクではなくスクリーンショットで済ませる。"],
    promptExamples:[{prompt:"答えを言わずに、私にクイズを出してください。",why:"学習向きの進め方になる。"},{prompt:"この録音を、要点・アクション項目・フォローアップ案に変換してください。",why:"一度で複数成果物にできる。"},{prompt:"この作業手順をスキルに変換してください。",why:"プロセスを定型化できる。"}],
    beforeAfter:{before:"光合成を説明して。",after:"生物の試験勉強中です。説明はせず、基本から応用まで理解確認の質問を出してください。間違えたら短く補足してください。",improvement:"一方的な説明ではなく、理解確認型の学習になる。"},
    visual:"collab" },
  { id:"personalization", level:"power", number:"10", title:"メモリ、指示、パーソナリティ、Temporary Chat", ico:"database", color:"#d97706",
    summary:"メモリは文脈を保存し、指示はルールを定め、パーソナリティは雰囲気を調整し、Temporary Chat はまっさらな環境を提供します。これらは同じものではありません。",
    whyItMatters:"個人設定を誤ると、役立つどころか結果が不安定になります。",
    beginnerMoves:["メモリには広く安定した好みを入れる。","指示には全体に共通する書き方ルールを入れる。","引き継ぎなしで始めたいときは Temporary Chat を使う。"],
    advancedMoves:["パーソナリティは質感調整であり、指示の代替ではない。","全体設定よりプロジェクト別指示を優先する。","定期的にメモリを監査する。"],
    commonMistakes:["本来は指示に書くべきことまで全部メモリに入れる。","古いメモリが溜まり続ける。","能力を変えたいのに、パーソナリティで何とかしようとする。"],
    promptExamples:[{prompt:"私について何を記憶していますか。",why:"メモリの監査になる。"},{prompt:"フォーマルトーンに関する好みは忘れてください。",why:"狙った内容だけ整理できる。"},{prompt:"保存済み設定なしの状態で始めてください。",why:"クリーンルームで始められる。"}],
    beforeAfter:{before:"好みはメモリに入っているのに、結果が一貫しない。",after:"行動ルールは指示へ。事実はメモリへ。分野別ルールはプロジェクト指示へ。",improvement:"入れる場所を分けることで安定する。"},
    visual:"memory" },
  { id:"projects", level:"power", number:"11", title:"プロジェクトを自分の OS として使う", ico:"folderOpen", color:"#16a34a",
    summary:"プロジェクトを使うと、ChatGPT は文脈を把握した作業台になります。設定されたプロジェクトは、単発チャットよりはるかに強力です。",
    whyItMatters:"複数回にわたる作業では、プロジェクトが最も効果の大きい整理手段です。",
    beginnerMoves:["作業単位ごとにプロジェクトを1つ作り、分かりやすく命名する。","関連するファイルだけを入れる。","プロジェクト指示を書く。"],
    advancedMoves:["会話要約をソースファイルとして追加する。","週ごとの作業を、毎回新規チャットではなく1つのプロジェクトで回す。","個人の生産性向上用にメタプロジェクトを作る。"],
    commonMistakes:["細かすぎるプロジェクトを作りすぎる。","何でもかんでもアップロードして文脈を膨らませる。","プロジェクト指示を書かない。"],
    promptExamples:[{prompt:"今学期向けの理想的なプロジェクト構成を提案してください。",why:"作業場を先に設計できる。"},{prompt:"これまでの作業内容と整合するメモを作成してください。",why:"蓄積文脈を活用できる。"},{prompt:"直近5回の会話から重要な決定事項を要約してください。",why:"生きた要約を作れる。"}],
    beforeAfter:{before:"ファイルが散らばっていて追えない。",after:"分野ごとにプロジェクトを1つ作る。参考資料、指示、継続利用、定期要約を組み込む。",improvement:"散在した会話が構造化された作業環境になる。"},
    visual:"project" },
  { id:"gpts", level:"power", number:"12", title:"GPT を作るべき時、まだ早い時", ico:"bot", color:"#44403c",
    summary:"ワークフローが繰り返され、指示が安定し、再利用価値があるなら GPT は有効です。ただし、多くの人は早すぎる段階で作ってしまいます。",
    whyItMatters:"未成熟な手順を GPT 化すると、不完全な流れが固定されます。逆に、十分に固まった手順なら、ワンクリックで使える仕組みにできます。",
    beginnerMoves:["まずはプロンプトを保存する。プロンプトは原型です。","3回以上繰り返してから定式化する。","目的は狭く、仕事は1つに絞る。"],
    advancedMoves:["役割、指示、知識、ツールの4層で設計する。","失敗時のルールを明示する。","意地悪なケースでテストする。"],
    commonMistakes:["一度しか使わない作業のために GPT を作る。","『何でもやる』のように広げすぎる。","知識ファイルを入れない。"],
    promptExamples:[{prompt:"私たちの作業手順を GPT の設計図にしてください。",why:"経験から仕様を起こせる。"},{prompt:"指示、入出力スキーマ、失敗時ルールまで含めてください。",why:"仕様が完成形に近づく。"},{prompt:"この GPT が扱うべき例外ケースは何ですか。",why:"堅牢性を高められる。"}],
    beforeAfter:{before:"メール全部に対応する GPT を作りたい。",after:"教授返信専用の GPT。丁寧かつ率直。150語以内。最初に必要な文脈を確認する。確認なしでは送信文を確定しない。スタイルガイドを知識ファイルとして追加する。",improvement:"範囲、安全策、参照資料が明確な設計になる。"},
    visual:"gpt" },
  { id:"canvas", level:"power", number:"13", title:"文章とコードの修正にはキャンバス", ico:"panelsTopLeft", color:"#334155",
    summary:"チャットの横に出る可視的な作業面です。長い成果物に対して狙いを絞った修正が必要な場合、直線的な会話より適しています。",
    whyItMatters:"長い成果物はチャットだと扱いにくくなります。キャンバスでは文書そのものが中心になります。",
    beginnerMoves:["長い成果物にはキャンバスを使う。","目的ごとにファイルを分ける。","曖昧な全面改稿ではなく、狙いを絞った修正を行う。"],
    advancedMoves:["戦略はチャット、実作業はキャンバス。","まず設計、その後で差分を小さく直す。","版の比較には履歴を使う。"],
    commonMistakes:["長文文書をチャットだけで処理する。","1段落の修正で十分なのに全文を書き直す。","デバッグにコード用キャンバスを使わない。"],
    promptExamples:[{prompt:"ライティング用キャンバスを開いてください。導入文だけを書き直してください。",why:"修正範囲を限定できる。"},{prompt:"論理エラーを見つけて、その行だけ修正してください。",why:"ピンポイントのコード修正になる。"},{prompt:"第3節を第2節の前に移動し、第4節と第5節を統合してください。",why:"構造変更に向いている。"}],
    beforeAfter:{before:"このエッセイを書き直して。 [2000 words in chat]",after:"キャンバスで開いてください。まだ書き換えず、強い部分と弱い部分に注釈を付けてください。その後で修正指示を出します。",improvement:"いきなり変更する前に、診断から入れる。"},
    visual:"canvas" },
  { id:"tasks-apps-agent", level:"expert", number:"14", title:"タスク、アプリ、Pulse、エージェント", ico:"workflow", color:"#16a34a",
    summary:"運用レイヤーです。タスクは後で実行され、アプリはデータを取り込み、Pulse は非同期で調査し、エージェントは複数段階の作業を自律実行します。",
    whyItMatters:"多くの人はリアルタイムのQ&Aだけで終わっています。この層を使うと、ChatGPT が自分の代わりに動く仕組みになります。",
    beginnerMoves:["タスクはリマインダー、ブリーフ、定期要約に使う。","情報が Drive、Slack、メールなどにあるならアプリを接続する。","15分以上の手作業はエージェント候補。"],
    advancedMoves:["エージェントへの指示は、停止点付きの業務ブリーフとして書く。","Pulse は定期的な話題追跡に使う。","タスクとプロジェクトを組み合わせて週次自動要約を作る。"],
    commonMistakes:["エージェント機能の存在を知らない。","止まる条件を書かずに曖昧なエージェント指示を出す。","タスクを単なるリマインダーにしか使わない。"],
    promptExamples:[{prompt:"毎朝8時に [topic] の上位3件をまとめたブリーフを配信してください。",why:"能動的な情報収集になる。"},{prompt:"接続済みソースと公開情報の両方で競合分析をしてください。",why:"社内外データを統合できる。"},{prompt:"エージェント: この手順で進めてください。提出前で一度停止してください。",why:"自律実行に確認ポイントを入れられる。"}],
    beforeAfter:{before:"5つのサイトを見て価格を比較して。",after:"エージェントで実行してください。競合5社の価格を確認し、表に整理してください。ログインが必要なら停止し、古い価格の可能性があれば明示してください。",improvement:"範囲と例外処理を含めて委任できる。"},
    visual:"agent" },
  { id:"model-choice", level:"expert", number:"15", title:"モデル選択とモード選択", ico:"compass", color:"#65a30d",
    summary:"モードごとに、速度、推論の深さ、ツール対応が異なります。作業に合わせて使い分けることが重要です。",
    whyItMatters:"常に最上位モードを使うと時間を無駄にし、逆に上げるべき場面で上げないと深さが不足します。",
    beginnerMoves:["日常作業は Auto で十分。","複雑な論理や統合が必要なら上位モードへ。","最強モードが常に最適とは限らない。"],
    advancedMoves:["下書きは速いモード、重要な見直しは深いモード。","推論モードではツール制限も確認する。","軽く始めて、必要なら途中で上げる。"],
    commonMistakes:["何でも一番強いモードで処理する。","問題をモデルのせいにし、モード選択を見直さない。","契約プランによる利用可否を確認しない。"],
    promptExamples:[{prompt:"まず簡潔に答え、その後で詳しく再検討してください。",why:"速度と深さを両立できる。"},{prompt:"複雑な論理です。段階的に深く考えてください。",why:"深い推論を明示できる。"},{prompt:"この作業には高速ドラフトと慎重な推論のどちらが適しますか。",why:"モード選択自体を相談できる。"}],
    beforeAfter:{before:"いつでも一番高度なモデルを使う。",after:"簡単な作業は Auto、論理中心は推論モード、発散には高速モード。",improvement:"作業の種類に合わせた使い分けになる。"},
    visual:"models" },
  { id:"privacy-risk", level:"expert", number:"16", title:"プライバシー、データ管理、リスク", ico:"shield", color:"#e11d48",
    summary:"能力が増えるほど、境界管理も重要になります。機微情報は慎重に扱い、高リスクな出力は人間が必ず見直すべきです。",
    whyItMatters:"境界のない活用は、情報漏えいや過信につながります。",
    beginnerMoves:["機微情報を気軽にアップロードしない。","アップロード前に識別子を消す。","最もクリーンな状態が必要なら Temporary Chat を使う。"],
    advancedMoves:["赤・黄・緑のアップロード基準を作る。","高リスク領域では専門家の確認を挟む。","定期的にデータ監査を行う。"],
    commonMistakes:["サンプルで足りるのに全データベースを入れる。","Temporary Chat なら何も処理されないと誤解する。","規制領域で AI 出力を最終判断として使う。"],
    promptExamples:[{prompt:"この内容のうち、人間の専門家確認が必要な部分はどこですか。",why:"限界を明示できる。"},{prompt:"本アップロード前に、匿名化を手伝ってください。",why:"安全な前処理になる。"},{prompt:"ここで個人識別情報に当たる部分を見つけて削除してください。",why:"PII の検出に使える。"}],
    beforeAfter:{before:"顧客一覧全体を使って傾向分析して。",after:"氏名、メール、電話番号を削除し、企業名も匿名化した上で、セグメント別売上を分析してください。",improvement:"識別情報を落としつつ、分析価値は残せる。"},
    visual:"privacy" },
];

/* ─────────────────────────────────────────────
   セクション用SVGビジュアル
   ───────────────────────────────────────────── */
function SectionVisual({ type }) {
  const s = "fill-none stroke-current";
  const cls = "h-36 w-full";
  const col = C.greenDeep;
  const tx = (x, y, label, opts = {}) => <text x={x} y={y} textAnchor="middle" fill={col} style={{ fontSize: opts.size || 10, fontWeight: opts.bold ? 600 : 400, opacity: opts.dim ? 0.4 : 1 }}>{label}</text>;
  const V = {
    mental: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}><rect x="24" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="216" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="120" y="110" width="120" height="44" rx="12" className={s} strokeWidth="2"/><path d="M144 34h72" className={s} strokeWidth="1.5"/><path d="M84 56l60 54M276 56l-60 54" className={s} strokeWidth="1.5"/>{tx(84,39,"あなたの目的",{bold:true})}{tx(276,39,"AIの下書き",{bold:true})}{tx(180,137,"あなたの判断",{bold:true})}{tx(180,84,"確認し、判断し、実行する",{dim:true,size:9})}</svg>,
    layers: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["40","8","280","24","通常チャット"],["54","38","252","24","プロジェクト + キャンバス"],["68","68","224","24","メモリ + 指示"],["82","98","196","24","GPT + 学習 + スキル"],["96","128","168","24","タスク + アプリ + エージェント"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(180,Number(y)+16,l,{bold:true,size:9})}</g>)}{tx(336,22,"シンプル",{dim:true,size:8})}{tx(336,146,"高機能",{dim:true,size:8})}</svg>,
    prompt: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["18","8","目的"],["126","8","背景"],["234","8","ルール"],["18","92","形式"],["126","92","品質"],["234","92","検証"]].map(([x,y,l])=><g key={l}><rect x={x} y={y} width="102" height="50" rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+51,Number(y)+30,l,{bold:true,size:11})}</g>)}</svg>,
    workflow: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["30","設計"],["100","下書き"],["170","批評"],["240","修正"],["310","完成"]].map(([x,l],i)=><g key={l}><circle cx={x} cy="60" r="22" className={s} strokeWidth="2"/>{tx(Number(x),64,l,{bold:true,size:9})}{i<4&&<path d={`M${Number(x)+22} 60h26`} className={s} strokeWidth="1.5"/>}</g>)}{tx(170,112,"各段階で精度が上がる",{dim:true,size:9})}</svg>,
    writing: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="134" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="248" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><path d="M112 59h22M226 59h22" className={s} strokeWidth="1.5"/>{tx(66,38,"原文",{bold:true})}{tx(180,38,"変換",{bold:true})}{tx(294,38,"出力",{bold:true})}</svg>,
    data: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="10" width="116" height="96" rx="10" className={s} strokeWidth="2"/><path d="M20 36h116M48 10v96M76 10v96M104 10v96M20 62h116M20 88h116" className={s} strokeWidth="1"/><rect x="186" y="18" width="24" height="70" rx="6" className={s} strokeWidth="2"/><rect x="220" y="40" width="24" height="48" rx="6" className={s} strokeWidth="2"/><rect x="254" y="28" width="24" height="60" rx="6" className={s} strokeWidth="2"/><rect x="288" y="48" width="24" height="40" rx="6" className={s} strokeWidth="2"/><path d="M182 100h136" className={s} strokeWidth="1.5"/>{tx(78,126,"1. まず確認",{dim:true,size:9})}{tx(252,126,"2. 次に結論",{dim:true,size:9})}</svg>,
    research: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><circle cx="66" cy="58" r="32" className={s} strokeWidth="2"/><path d="M90 82l22 22" className={s} strokeWidth="2"/><rect x="170" y="10" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="50" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="90" width="144" height="28" rx="8" className={s} strokeWidth="2"/>{tx(242,29,"一次情報",{bold:true})}{tx(242,69,"二次情報",{bold:true})}{tx(242,109,"推論",{bold:true})}<circle cx="326" cy="24" r="4" fill="#10a37f" stroke="none"/><circle cx="326" cy="64" r="4" fill="#F59E0B" stroke="none"/><circle cx="326" cy="104" r="4" fill="#E11D48" stroke="none" opacity="0.5"/></svg>,
    multimodal: <svg viewBox="0 0 360 130" className={cls} style={{ color: col }}>{[["36","文字"],["120","画像"],["204","音声"],["288","編集"]].map(([x,l])=><g key={l}><rect x={x} y="20" width="52" height="52" rx="12" className={s} strokeWidth="2"/>{tx(Number(x)+26,50,l,{bold:true,size:9})}</g>)}<path d="M88 46h32M172 46h32M256 46h32" className={s} strokeWidth="1.5"/>{tx(180,102,"モードをつなげて使う",{dim:true,size:9})}</svg>,
    collab: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["18","24","64","42","録音"],["100","6","120","42","学習"],["100","78","120","42","共同"],["238","24","80","42","共有"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M82 45h18M220 27h18M220 99h18" className={s} strokeWidth="1.5"/></svg>,
    memory: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["14","10","74","40","メモリ"],["100","10","120","40","指示"],["232","10","108","40","個性"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<rect x="60" y="88" width="240" height="40" rx="12" className={s} strokeWidth="2"/>{tx(180,113,"一貫した出力",{bold:true})}<path d="M51 50l38 38M160 50v38M286 50l-38 38" className={s} strokeWidth="1.5"/></svg>,
    project: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="28" y="4" width="304" height="132" rx="16" className={s} strokeWidth="2"/><rect x="46" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="130" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="214" y="28" width="100" height="40" rx="8" className={s} strokeWidth="2"/><rect x="214" y="76" width="100" height="40" rx="8" className={s} strokeWidth="2"/>{tx(82,76,"チャット",{bold:true})}{tx(166,76,"ファイル",{bold:true})}{tx(264,52,"ソース",{bold:true,size:9})}{tx(264,100,"ルール",{bold:true,size:9})}</svg>,
    gpt: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["16","48","78","42","役割"],["116","4","96","42","知識"],["116","94","96","42","ツール"],["234","48","110","42","ルール"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M94 69h22M212 25h22M212 115h22" className={s} strokeWidth="1.5"/><path d="M164 46v48" className={s} strokeWidth="1.5"/></svg>,
    canvas: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="4" width="320" height="132" rx="14" className={s} strokeWidth="2"/><path d="M20 32h320" className={s} strokeWidth="1.5"/><path d="M132 32v104M248 32v104" className={s} strokeWidth="1.2"/>{tx(76,22,"構成",{bold:true,size:10})}{tx(190,22,"草稿",{bold:true,size:10})}{tx(290,22,"修正",{bold:true,size:10})}</svg>,
    agent: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["10","48","60","40","目的"],["90","6","64","40","閲覧"],["90","94","64","40","ファイル"],["174","6","64","40","アプリ"],["174","94","64","40","コード"],["258","48","80","40","完了"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+24,l,{bold:true,size:9})}</g>)}<path d="M70 68h20M122 46v48M154 26h20M154 114h20M238 26l20 40M238 114l20-40" className={s} strokeWidth="1.5"/></svg>,
    models: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["20","48","72","40","Auto"],["116","4","72","40","Fast"],["116","96","72","40","Deep"],["268","48","72","40","Pro"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<path d="M92 68h24M188 24h80M188 116h80" className={s} strokeWidth="1.5"/><path d="M152 44v52" className={s} strokeWidth="1.5"/></svg>,
    privacy: <svg viewBox="0 0 360 150" className={cls} style={{ color: col }}><path d="M180 8l88 32v44c0 34-26 62-88 80-62-18-88-46-88-80V40l88-32z" className={s} strokeWidth="2"/><path d="M150 82l18 18 40-42" className={s} strokeWidth="2.2"/>{tx(180,142,"高機能ほど境界管理が必要",{dim:true,size:9})}</svg>,
  };
  return V[type] || null;
}

/* ─────────────────────────────────────────────
   サブコンポーネント
   ───────────────────────────────────────────── */
function FeatureCard({ title, ico, color, description, when }) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-4 w-4" style={{ color }} /></div>
        <span className="ff-display text-[15px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
      {when && <div className="mt-3 rounded-xl px-3 py-2 text-[12px] leading-relaxed" style={{ backgroundColor: C.cream, color: C.inkLight }}><span className="font-semibold" style={{ color: C.greenDeep }}>使う場面: </span>{when}</div>}
    </div>
  );
}

function MiniFeature({ title, ico, color, description }) {
  return (
    <div className="rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm" style={{ borderColor: C.border }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-3.5 w-3.5" style={{ color }} /></div>
        <span className="text-[13px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
    </div>
  );
}

function BeforeAfterBlock({ data }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: C.border, backgroundColor: C.cream }}>
      <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Before vs. After</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-400">弱い例</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.before}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">良い例</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.after}</div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: C.greenDeep }}>
        <Ico name="lightbulb" className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span className="font-medium">{data.improvement}</span>
      </div>
    </div>
  );
}

function PromptExample({ prompt, why }) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3" style={{ borderColor: C.borderLight }}>
      <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{prompt}</div>
      <div className="mt-1.5 text-[11px] leading-snug" style={{ color: C.inkMuted }}>{why}</div>
    </div>
  );
}

function GuideSectionCard({ section, isExpanded, onToggle }) {
  return (
    <section id={section.id} className="scroll-mt-28 overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <button onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left md:items-center md:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: section.color }}><Ico name={section.ico} className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>{section.number} &middot; {section.level.charAt(0).toUpperCase() + section.level.slice(1)}</div>
          <h3 className="ff-display text-[17px] font-semibold leading-snug md:text-[19px]" style={{ color: C.ink }}>{section.title}</h3>
          {!isExpanded && <p className="clamp-2 mt-1 text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{section.summary}</p>}
        </div>
        <Ico name="chevronDown" className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} style={{ color: C.inkMuted }} />
      </button>
      {isExpanded && (
        <div className="border-t px-5 pb-7 pt-6 md:px-6" style={{ borderColor: C.borderLight }}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-[14px] leading-[1.8]" style={{ color: C.ink }}>{section.summary}</p>
              <div className="rounded-xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>なぜ重要か</div>
                <p className="mt-2 text-[13px] leading-[1.75]" style={{ color: C.ink }}>{section.whyItMatters}</p>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.greenDeep }}>まずここから</div>
                <div className="space-y-2.5">{section.beginnerMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.greenMid }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>上級者向け</div>
                <div className="space-y-2.5">{section.advancedMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="arrowRight" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.inkMuted }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.roseAccent }}>よくある失敗</div>
                <div className="space-y-2.5">{section.commonMistakes.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="alertTriangle" className="mt-0.5 h-4 w-4 shrink-0 opacity-60" style={{ color: C.roseAccent }} /><span>{m}</span></div>)}</div>
              </div>
              <BeforeAfterBlock data={section.beforeAfter} />
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>ビジュアルモデル</div>
                <SectionVisual type={section.visual} />
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>プロンプト例</div>
                <div className="space-y-2.5">{section.promptExamples.map((p, i) => <PromptExample key={i} {...p} />)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   メイン
   ───────────────────────────────────────────── */
export default function ChatGPTMasterGuide() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [expanded, setExpanded] = useState(new Set(["mental-model"]));
  const toggleSection = useCallback((id) => { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }, []);
  const expandAll = useCallback(() => setExpanded(new Set(GUIDE_SECTIONS.map(s => s.id))), []);
  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  const filteredSections = useMemo(() => GUIDE_SECTIONS.filter(s => {
    if (level !== "all" && s.level !== level) return false;
    if (!query.trim()) return true;
    return [s.title, s.summary, s.whyItMatters, ...s.beginnerMoves, ...s.advancedMoves, ...s.commonMistakes, ...s.promptExamples.map(p => p.prompt), s.beforeAfter.before, s.beforeAfter.after].join(" ").toLowerCase().includes(query.toLowerCase());
  }), [level, query]);

  const sectionsByLevel = useMemo(() => {
    const g = { foundation: [], core: [], power: [], expert: [] };
    filteredSections.forEach(s => g[s.level]?.push(s));
    return g;
  }, [filteredSections]);
  const levelLabels = { foundation: "基礎", core: "中核スキル", power: "上級機能", expert: "エキスパート" };

  return (
    <div className="ff-body min-h-screen" style={{ backgroundColor: C.cream, color: C.ink }}>
      <GlobalStyles />
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">

        {/* ヘッダー */}
        <header className="overflow-hidden rounded-3xl border" style={{ borderColor: C.borderLight, background: `linear-gradient(135deg, ${C.greenLight} 0%, ${C.cream} 40%, ${C.creamDark} 100%)` }}>
          <div className="grid gap-6 p-6 md:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest" style={{ borderColor: C.borderLight, color: C.greenDeep }}><Ico name="bookOpen" className="h-3.5 w-3.5" /> 実用リファレンス</div>
              <h1 className="ff-display text-3xl font-medium leading-tight tracking-tight md:text-[44px] md:leading-tight" style={{ color: C.ink }}>ChatGPT 完全ガイド</h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8]" style={{ color: C.inkLight }}>各ツールで何ができるのか、いつ使うべきか、どうすれば結果を着実に良くできるのかを整理したガイドです。まずは一般ユーザー向けに分かりやすく、そのうえで必要な人のために一段深い内容も用意しています。</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="lightbulb" className="h-3 w-3" style={{ color: C.greenMid }} /> 確認日 {VERIFIED_DATE}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="layers" className="h-3 w-3" style={{ color: C.greenMid }} /> 全16章 &middot; 60以上のプロンプト例</span>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: C.borderLight }}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>現在の ChatGPT でできること</div>
              <svg viewBox="0 0 420 190" className="w-full" style={{ color: C.greenDeep }}>
                {[["16","4","120","38","回答する","チャット、検索"],["150","4","120","38","整理する","プロジェクト、メモリ"],["284","4","120","38","作る","キャンバス、画像"],["16","120","120","38","学ぶ","学習、録音"],["150","120","120","38","共有する","グループ、リンク"],["284","120","120","38","実行する","タスク、エージェント"]].map(([x,y,w,h,l,sub])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className="fill-none stroke-current" strokeWidth="1.6"/><text x={Number(x)+Number(w)/2} y={Number(y)+18} textAnchor="middle" fill={C.greenDeep} style={{fontSize:10,fontWeight:600}}>{l}</text><text x={Number(x)+Number(w)/2} y={Number(y)+30} textAnchor="middle" fill={C.greenDeep} style={{fontSize:7,opacity:0.4}}>{sub}</text></g>)}
                <text x="210" y="84" textAnchor="middle" fill={C.greenDeep} style={{fontSize:9,fontWeight:600,opacity:0.25}}>全体像</text>
                {[[136,23,150,23],[270,23,284,23],[76,42,76,120],[210,42,210,120],[344,42,344,120]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.greenDeep} strokeWidth="1" opacity="0.15"/>)}
              </svg>
            </div>
          </div>
        </header>

        {/* 6つの原則 */}
        <section className="mt-8">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>6つの原則</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[{ico:"penTool",t:"明確に頼む",d:"目的、背景、制約、形式を書く。"},
              {ico:"layoutGrid",t:"正しい層を選ぶ",d:"チャット、プロジェクト、キャンバス、検索、エージェント。"},
              {ico:"shield",t:"重要なものは確認する",d:"最新情報や高リスク分野では検証する。"},
              {ico:"refreshCcw",t:"やり直さず、修正する",d:"良い結果は2回目以降で育つ。"},
              {ico:"bot",t:"うまくいったら仕組みにする",d:"プロジェクト、GPT、タスク、スキルへ。"},
              {ico:"eye",t:"視覚化で考えやすくする",d:"表、図、スクリーンショットを使う。"}].map(({ico,t,d})=>(
              <div key={t} className="flex gap-3 rounded-2xl border bg-white p-4" style={{borderColor:C.border}}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name={ico} className="h-4 w-4"/></div>
                <div><div className="text-[13px] font-semibold" style={{color:C.ink}}>{t}</div><div className="mt-0.5 text-[12px] leading-relaxed" style={{color:C.inkLight}}>{d}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* ツール選び */}
        <section className="mt-8 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>判断表</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>どのツールを使うべきか</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{borderColor:C.borderLight}}>
            <table className="min-w-full text-left text-[13px]">
              <thead><tr style={{backgroundColor:C.cream}}><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>やりたいこと</th><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>最適なツール</th><th className="hidden whitespace-nowrap px-4 py-3 font-semibold sm:table-cell" style={{color:C.ink}}>理由</th></tr></thead>
              <tbody>{TOOL_CHOOSER.map((r,i)=><tr key={r.goal} style={{backgroundColor:i%2===0?"#fff":C.cream}}><td className="px-4 py-3 font-medium" style={{color:C.ink}}>{r.goal}</td><td className="whitespace-nowrap px-4 py-3"><span className="inline-flex items-center gap-1.5 font-semibold" style={{color:C.greenDeep}}><Ico name={r.ico} className="h-3.5 w-3.5"/>{r.tool}</span></td><td className="hidden px-4 py-3 sm:table-cell" style={{color:C.inkLight}}>{r.reason}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {/* プロンプトの型 */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>プロンプトの型</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>どんなプロンプトでも良くする6つの要素</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPT_BLOCKS.map((b,i)=><div key={b.label} className="rounded-xl border p-4" style={{borderColor:C.borderLight,backgroundColor:C.cream}}>
              <div className="mb-1.5 flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{backgroundColor:b.color}}>{i+1}</span><span className="text-[13px] font-semibold" style={{color:C.ink}}>{b.label}</span></div>
              <p className="ff-mono text-[11px] leading-relaxed" style={{color:C.inkLight}}>{b.example}</p>
            </div>)}
          </div>
        </section>

        {/* 中核機能 */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>機能スタック</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>ChatGPT の中核ツール</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{CORE_FEATURES.map(f=><FeatureCard key={f.title} {...f}/>)}</div>
        </section>

        {/* 見落とされがちな機能 */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>見落とされがちな機能</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>多くの人が使いこなせていない機能</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{ADDITIONAL_FEATURES.map(f=><MiniFeature key={f.title} {...f}/>)}</div>
        </section>

        {/* ナビゲーター */}
        <section className="sticky top-0 z-20 mt-8 rounded-2xl border bg-white p-4 shadow-lg md:p-5" style={{borderColor:C.border}}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative mr-auto">
              <Ico name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:C.inkMuted}}/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="検索..." className="w-full rounded-xl border py-2 pl-10 pr-3 text-[13px] outline-none sm:w-48" style={{borderColor:C.border,backgroundColor:C.cream}}/>
            </div>
            {LEVELS.map(l=><button key={l.key} onClick={()=>setLevel(l.key)} className="rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all" style={level===l.key?{backgroundColor:C.greenDeep,color:"#fff"}:{border:`1px solid ${C.border}`,color:C.inkLight}}>{l.label}</button>)}
            <button onClick={expandAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>すべて展開</button>
            <button onClick={collapseAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>すべて折りたたむ</button>
          </div>
        </section>

        {/* ガイド本文 */}
        <main className="mt-8 space-y-10">
          {Object.entries(sectionsByLevel).map(([lev, sections]) => {
            if (!sections.length) return null;
            return (<div key={lev}>
              <div className="mb-4 flex items-center gap-3"><div className="h-px flex-1" style={{backgroundColor:C.border}}/><span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>{levelLabels[lev]}</span><div className="h-px flex-1" style={{backgroundColor:C.border}}/></div>
              <div className="space-y-4">{sections.map(s=><GuideSectionCard key={s.id} section={s} isExpanded={expanded.has(s.id)} onToggle={()=>toggleSection(s.id)}/>)}</div>
            </div>);
          })}
        </main>

        {/* 範囲 + 総まとめ */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{borderColor:C.border}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>対象範囲</div>
            <h3 className="ff-display mt-2 text-[18px] font-medium" style={{color:C.ink}}>このガイドが扱う内容</h3>
            <div className="mt-4 space-y-2 text-[13px] leading-relaxed" style={{color:C.inkLight}}>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>企業管理者向けではなく、ユーザー向け機能を中心に扱います。</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>製品の豆知識より、実用的な使い方を優先します。</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>利用可否はプランやプラットフォームによって異なります。</div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 p-5 shadow-sm" style={{background:`linear-gradient(135deg, ${C.greenLight}, #F0FAF5)`}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.greenDeep}}>最大のアップグレード</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name="sparkles" className="h-5 w-5"/></div>
              <div>
                <div className="ff-display text-[16px] font-semibold" style={{color:C.greenDeep}}>「どうやってプロンプトを良くするか」だけを考えない</div>
                <p className="mt-2 text-[13px] leading-[1.75] opacity-80" style={{color:C.greenDeep}}>それより、「この作業には ChatGPT のどの層が合うか」を考える方が、結果は大きく改善します。</p>
              </div>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="mt-8 overflow-hidden rounded-3xl p-6 text-white shadow-lg md:p-10" style={{background:"linear-gradient(135deg, #0A2A1F, #0D3B2E 40%, #143D30)"}}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300">最後の要点</div>
              <h2 className="ff-display mt-2 text-2xl font-medium tracking-tight md:text-[28px]">使いこなせている状態とは</h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.85] text-emerald-100" style={{opacity:0.8}}>適切なモードを選び、作業内容を明確に定義し、重要な点は検証し、賢く修正し、うまくいった方法を再利用可能な仕組みに変えることです。使いこなしている人とは、AIを使うクリアな思考者です。</p>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              <br />
              ChatGPTユーザーガイド
              <br />
              © 2026 EugeneYip.com All Rights Reserved. 
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[13px] font-semibold">継続的に確認すべき項目</div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] leading-relaxed text-emerald-200" style={{opacity:0.7}}>
                {["機能","料金","リリースノート","プロジェクト","メモリFAQ","キャンバス","タスク","アプリ","検索","ディープリサーチ","学習モード","録音","共有リンク","グループ","スキル","エージェント","音声","画像FAQ"].map(i=><div key={i} className="flex items-center gap-1.5"><div className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" style={{opacity:0.5}}/>{i}</div>)}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
