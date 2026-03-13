```jsx
import React, { useMemo, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   インライン SVG アイコンシステム（lucide-react 不使用）
   24x24 viewBox、ストロークベース、2px ストローク
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
   色
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
  { key: "core", label: "中核" }, { key: "power", label: "拡張機能" }, { key: "expert", label: "上級" },
];

const CORE_FEATURES = [
  { title: "検索", ico: "globe", color: "#0284c7", description: "最新の事実、価格、ニュース、法規、その他変化するあらゆる情報について、リアルタイムのウェブ結果を取得します。", when: "モデルの学習時点以降に変わっている可能性がある内容。" },
  { title: "ディープリサーチ", ico: "search", color: "#4f46e5", description: "ウェブソース、ファイル、接続済みアプリを横断した、多段階で記録付きの調査を行います。", when: "素早い回答ではなく、出典付きのレポートが必要なとき。" },
  { title: "プロジェクト", ico: "folderOpen", color: "#059669", description: "共有ファイル、カスタム指示、会話の記憶を備えた継続的な作業空間です。", when: "授業、クライアント、スタートアップなど、再び取り組む仕事全般。" },
  { title: "メモリー", ico: "database", color: "#d97706", description: "会話をまたいで、長期的な好みや繰り返し登場する文脈を保存します。", when: "正確な文書保存ではなく、好みやパターン向け。" },
  { title: "カスタム指示", ico: "settingsGear", color: "#57534e", description: "口調、書式、応答構造を定める常時適用の行動ルールです。", when: "すべてのチャットで既定として自分のルールに従わせたいとき。" },
  { title: "Canvas", ico: "panelsTopLeft", color: "#334155", description: "文章やコードのための可視ドラフト面で、狙いを定めたインライン編集が可能です。", when: "長文やコードを反復的に編集するとき。" },
  { title: "タスク", ico: "clock", color: "#7c3aed", description: "後で実行される出力をスケジュールし、完了時に通知します。", when: "リマインダー、日次ブリーフ、定期的な要約。" },
  { title: "アプリ（コネクタ）", ico: "wrench", color: "#0d9488", description: "外部ツールを接続し、ChatGPT があなたのデータを読み取り、操作できるようにします。", when: "最適な文脈がチャット外にあるとき。" },
  { title: "Agent", ico: "workflow", color: "#16a34a", description: "ブラウザ、ファイル、コード、接続済みアプリをまたいで自律的に実行します。", when: "複数サイトや複数操作にまたがるタスク。" },
  { title: "カスタム GPT", ico: "bot", color: "#44403c", description: "安定した指示と知識ファイルを備えた、再利用可能なアシスタントです。", when: "あるワークフローが十分に繰り返され、仕組み化する価値があるとき。" },
  { title: "音声", ico: "mic", color: "#e11d48", description: "低摩擦で思考や探索を進めるための会話型インタラクションです。", when: "声に出して考えたいとき、またはマルチタスク中。" },
  { title: "画像", ico: "imagePlus", color: "#c026d3", description: "アップロードして分析、説明から生成、そしてインライン編集ができます。", when: "視覚的理解、作成、または洗練が必要なとき。" },
  { title: "ファイルとデータ", ico: "fileText", color: "#0891b2", description: "PDF、表計算、文書をアップロードし、コード実行とともに分析できます。", when: "グラフ、要約、計算。" },
  { title: "モデル", ico: "brain", color: "#65a30d", description: "速度重視、バランス型、推論重視のモードを選択できます。", when: "タスクの複雑さに応じて性能を合わせるとき。" },
];

const ADDITIONAL_FEATURES = [
  { title: "学習モード", ico: "school", color: "#059669", description: "質問と理解チェックによるガイド付き学習。" },
  { title: "録音", ico: "headphones", color: "#0284c7", description: "会議の音声を記録し、その後要約を作成します。" },
  { title: "グループチャット", ico: "users", color: "#7c3aed", description: "共有の計画のために他の人を会話へ招待します。" },
  { title: "共有リンク", ico: "link2", color: "#57534e", description: "URL を通じて会話を共有します。" },
  { title: "画像編集", ico: "camera", color: "#c026d3", description: "生成画像の一部を選択して調整します。" },
  { title: "インタラクティブ表", ico: "table2", color: "#0891b2", description: "分析前にアップロードしたデータを視覚的に確認します。" },
  { title: "スキル", ico: "share2", color: "#0d9488", description: "繰り返し行う仕事を一貫して処理するための再利用可能なワークフロー。" },
  { title: "Pulse", ico: "sparkles", color: "#4f46e5", description: "非同期で調査を行い、視覚要約を持ち帰ります。" },
];

const TOOL_CHOOSER = [
  { goal: "素早い回答または下書き", tool: "通常チャット", ico: "messageSquare", reason: "最も摩擦が少ない。" },
  { goal: "最新情報", tool: "検索", ico: "globe", reason: "変化している可能性がある内容向け。" },
  { goal: "ファイルを伴う継続作業", tool: "プロジェクト", ico: "folderOpen", reason: "セッションをまたいで文脈を保持する。" },
  { goal: "長文ドキュメントを編集する", tool: "Canvas", ico: "panelsTopLeft", reason: "ピンポイントの修正に向いている。" },
  { goal: "複数ソースのレポート", tool: "ディープリサーチ", ico: "search", reason: "引用付きの多段階統合。" },
  { goal: "複雑なオンライン作業", tool: "Agent", ico: "workflow", reason: "複数サイトと複数操作を横断する。" },
  { goal: "定期的な出力", tool: "タスク", ico: "clock", reason: "非同期で実行され、通知される。" },
  { goal: "同じ流れを頻繁に使う", tool: "GPT またはスキル", ico: "bot", reason: "パターンを仕組みに変える。" },
];

const PROMPT_BLOCKS = [
  { label: "目的", example: "投資家向け会議のための 1 ページのプロジェクト概要を書いてください。", color: "#10a37f" },
  { label: "背景", example: "このスタートアップは売上前、シリーズ A、気候テックです。", color: "#0284c7" },
  { label: "制約", example: "400 語以内。専門用語なし。箇条書きなし。", color: "#7c3aed" },
  { label: "形式", example: "問題、解決策、進捗、依頼の順で構成してください。", color: "#d97706" },
  { label: "品質", example: "テンプレートではなく、McKinsey のアソシエイト水準で書いてください。", color: "#e11d48" },
  { label: "検証", example: "出典が必要な主張には印を付けてください。", color: "#334155" },
];

const GUIDE_SECTIONS = [
  { id:"mental-model", level:"foundation", number:"01", title:"正しいメンタルモデルから始める", ico:"brain", color:"#65a30d",
    summary:"ChatGPT を神託ではなく、推論パートナーとして扱いましょう。最初の応答は最終的な真実ではなく、有用な下書きです。すべての出力は確認されるまで暫定的なものと考えるべきです。",
    whyItMatters:"多くの失望は期待のずれから生じます。確実性ではなく、熟練した第一稿を期待してください。",
    beginnerMoves:["最初の答えは下書きだと考え、批判的に読む。","どのような前提が置かれたかを尋ねる。","ChatGPT は判断を置き換えるのではなく、加速するために使う。"],
    advancedMoves:["最も強い反論を出してもらう。","探索、提案、リスク確認を別々のパスに分ける。","重要な判断では第二意見として使う。"],
    commonMistakes:["数値の主張を検証せずに信じる。","沈黙を自信とみなす。","出力をそのままコピーする。"],
    promptExamples:[{prompt:"どのような前提を置きましたか？",why:"隠れた推論を表に出す。"},{prompt:"懐疑的な専門家なら何を問題視しますか？",why:"対抗的な自己レビュー。"},{prompt:"あなたの提案に対する最も強い反論は何ですか。",why:"確証バイアスを防ぐ。"},{prompt:"各主張の確信度を 1〜5 で評価してください。",why:"事実と推測を分ける。"}],
    beforeAfter:{before:"コーヒーショップの事業計画を書いて。",after:"ボストン中心部のスペシャルティコーヒーショップについて、1 ページの計画を作成してください。対象は大学院生とリモートワーカーです。推定に過ぎない内容は、出典付きの事実と区別して示してください。",improvement:"文脈、対象読者、場所、検証ルールが加わる。"},
    visual:"mental" },
  { id:"workspace", level:"foundation", number:"02", title:"プロンプトにこだわる前に、作業空間を理解する", ico:"laptop", color:"#059669",
    summary:"現代の ChatGPT は層状のワークスペースです。仕事ごとに適した層があります。間違った層で巧妙なプロンプトを書くより、正しい層で適切なプロンプトを書く方が効果的です。",
    whyItMatters:"入力を始める前に、適切な作業空間を選ぶことが最も大きなレバレッジになります。",
    beginnerMoves:["単発の簡単な作業は通常チャット。","再訪する仕事はプロジェクト。","まっさらな状態が必要なら一時チャット。"],
    advancedMoves:["授業、クライアント、取り組みごとに 1 プロジェクト。","プロジェクトを長期的な知識ハブとして使う。","反復編集は Canvas、戦略はチャット。"],
    commonMistakes:["プロジェクトに戻らず毎回新しいチャットを始める。","長文を canvas ではなくチャットで扱う。","タスクや agent を完全に無視する。"],
    promptExamples:[{prompt:"これはチャット、プロジェクト、それとも GPT にすべきですか？",why:"モデルに作業空間を選ばせる。"},{prompt:"今学期に最適なプロジェクト構成を考えてください。",why:"まず構造を設計する。"},{prompt:"どのファイルと指示を追加すべきですか？",why:"プロジェクト文脈を最適化する。"}],
    beforeAfter:{before:"毎回新しいチャットを始めてしまい、文脈を失います。",after:"プロジェクトを作成してください。参考資料をアップロードし、指示を設定し、同じプロジェクトに戻り続けてください。",improvement:"一時的なチャットが持続的な作業空間になる。"},
    visual:"layers" },
  { id:"prompting", level:"foundation", number:"03", title:"プロンプト設計：巧妙さより明確さ", ico:"penTool", color:"#0284c7",
    summary:"良いプロンプトは作業指示書です。凝った言い回しは任意ですが、明確な制約は不可欠です。頭の中の基準は、書き出さない限りモデルには見えません。",
    whyItMatters:"曖昧なプロンプトは一般的な出力しか生みません。多くの不満は入力の仕様不足に由来します。",
    beginnerMoves:["対象読者と用途を明示する。","成功の状態を具体的に書く。","形式、口調、長さ、避けるべきことを指定する。"],
    advancedMoves:["まずアウトラインを出し、承認後に全文を書く。","事実と解釈を分ける。","自己採点用の評価基準を与える。"],
    commonMistakes:["3 語程度のプロンプトで個別最適化を期待する。","制約を一度に入れすぎる。","『できますか？』と聞く代わりに直接指示しない。"],
    promptExamples:[{prompt:"目的: ___. 背景: ___. 制約: ___. 出力: ___.",why:"汎用的な骨組み。"},{prompt:"まずアウトラインだけ。まだ本文は書かないでください。",why:"構造違いによる書き直しを防ぐ。"},{prompt:"書き始める前に、何を知る必要があるか教えてください。",why:"モデルに確認質問をさせる。"},{prompt:"[役割] として [対象] に説明する形で書いてください。",why:"口調と深さを固定する。"}],
    beforeAfter:{before:"カバーレターを書いて。",after:"McKinsey の Strategy Analyst 向けのカバーレターを書いてください。国際経営の大学院生で、SOP と CRM の経験があります。自信はあるが傲慢ではない口調で。350 語。'I am passionate about.' は使わないでください。",improvement:"役割、背景、口調、長さ、否定制約が明確。"},
    visual:"prompt" },
  { id:"revision", level:"core", number:"04", title:"ワンショットの完成度より、修正フローが勝る", ico:"refreshCcw", color:"#7c3aed",
    summary:"強い使い方は反復です。枠組みを定め、下書きを作り、批評し、修正し、仕上げます。多くの人は洗練すべき場面で最初からやり直してしまいます。",
    whyItMatters:"一発生成では品質の上限が最初の試みに固定されます。修正は一貫してより良い結果を生みます。",
    beginnerMoves:["下書きの後に『弱い点や欠けている点は？』と聞く。","より狭い目標で修正する。","方向性が根本的に間違っていない限り、最初からやり直さない。"],
    advancedMoves:["構造、正確性、口調、圧縮、仕上げの固定パスを使う。","書き直し前に自己批評させる。","圧縮率を指定する。"],
    commonMistakes:["モデルに自己診断させず、手作業で書き直す。","『もっと良くして』のような曖昧なフィードバック。","焦点のない修正パスを重ねすぎる。"],
    promptExamples:[{prompt:"あなたの回答はなぜ目標を満たしていないのですか？",why:"修正前の自己診断。"},{prompt:"論理をもっと鋭くしてください。構成は維持。",why:"範囲を制限する。"},{prompt:"要点を失わずに 35% 圧縮してください。",why:"優先順位付けを強制する。"},{prompt:"この基準で採点してください。4/5 未満はどこですか？",why:"構造化された自己評価。"}],
    beforeAfter:{before:"違います。もう一度やって。",after:"第 2 セクションの論理が循環しています。アップロードしたレポートのデータ点を 1 つ使って書き直し、他の部分は維持してください。",improvement:"何が問題か、何を直すか、何を残すかが明確。"},
    visual:"workflow" },
  { id:"writing", level:"core", number:"05", title:"執筆、リライト、変換", ico:"fileText", color:"#57534e",
    summary:"ChatGPT は変換が得意です。対象読者に合わせた書き換え、口調変更、要約、再構成などです。ゼロから書くより、既存の文章を改善する方がうまくいくことも多いです。",
    whyItMatters:"多くの実務文章は変換作業です。ここが AI の投資対効果が最も高い領域です。",
    beginnerMoves:["元文を貼り、何を残し何を変えるかを明示する。","対象読者、媒体、口調を指定する。","口調が不確かなら複数案を出す。"],
    advancedMoves:["対照的な版を出す：フォーマル、簡潔、説得型。","文単位の診断。","事実を保ったままスタイル変換する。"],
    commonMistakes:["メモがあるのにゼロから書く。","別案を見ずに最初の口調を受け入れる。","何を保持するかを指定しない。"],
    promptExamples:[{prompt:"教授へのメール向けに書き直してください。礼儀正しく、直接的に、無駄なく。",why:"精密な変換。"},{prompt:"3 つの版をください：フォーマル、簡潔、説得型。",why:"対照で選びやすくする。"},{prompt:"どの文がありきたりに感じられますか？なぜですか？",why:"行レベルの診断。"},{prompt:"事実と構成は保持し、口調だけ変えてください。",why:"変更範囲を限定する。"}],
    beforeAfter:{before:"このメールをもっと良くして。",after:"プログラム責任者向けに書き直してください。礼儀正しく、直接的に。専門用語は削除。150 語以内。アクション項目は残してください。",improvement:"対象、口調、避ける要素、長さ、保持条件が明確。"},
    visual:"writing" },
  { id:"files-data", level:"core", number:"06", title:"ファイル、PDF、表計算、データ", ico:"table2", color:"#0891b2",
    summary:"ChatGPT はファイルを確認し、文書を要約し、データ上でコードを実行し、グラフを作れます。重要なのは、最初に記述し、次に分析し、最後に結論を出すことです。",
    whyItMatters:"解釈の前にデータを確認することで、最もよくある誤りを防げます。",
    beginnerMoves:["そのファイルが何を含むかを、意味づけより先に聞く。","まず項目監査を依頼する。","PDF では構造、主張、証拠を分けて扱う。"],
    advancedMoves:["前提の監査証跡を要求する。","結論の前に抽出表を言い換えさせる。","大規模データではコード実行を使う。"],
    commonMistakes:["すぐに『重要な示唆は？』と聞く。","グラフのラベルを検証せずに信じる。","PDF 解析が完全だと仮定する。"],
    promptExamples:[{prompt:"記述してください：項目、日付範囲、欠損値、分析オプション。",why:"分析前の監査。"},{prompt:"批評する前に核心の主張を抽出してください。",why:"判断前の理解。"},{prompt:"このグラフで使われた前提をすべて列挙してください。",why:"監査証跡。"},{prompt:"これをクリーンにする Python を書いて実行し、結果を見せてください。",why:"再現可能な分析。"}],
    beforeAfter:{before:"この表計算から重要な示唆は？",after:"監査してください：列、型、日付範囲、欠損値。有用性の高い順に 3 つの分析案を提案してください。私が承認するまで実行しないでください。",improvement:"確認、提案、承認ゲートの流れ。"},
    visual:"data" },
  { id:"search-research", level:"core", number:"07", title:"検索、ディープリサーチ、引用", ico:"search", color:"#4f46e5",
    summary:"検索は出典付きの最新回答向けです。ディープリサーチは多段階レポート向けです。最新性が高いもの、規制対象、変化の速いものは、静的メモリーだけに頼るべきではありません。",
    whyItMatters:"検索なしでは、ChatGPT は凍結された時点の知識から答えます。",
    beginnerMoves:["変化している可能性があるものは検索する。","引用元が特定の主張を本当に支えているか確認する。","高リスクでは一次資料を優先する。"],
    advancedMoves:["『確認済み事実とあなたの推論を分けてください』と依頼する。","情報源の種類、地域、日付範囲を指定する。","範囲を定義してからディープリサーチを使う。"],
    commonMistakes:["現在の出来事に対してモデル記憶を信じる。","『出典付き』というだけでクリックせず受け入れる。","単純な事実確認にディープリサーチを使う。"],
    promptExamples:[{prompt:"検索してください。一次資料のみ。",why:"質を制約したライブ取得。"},{prompt:"事実と推論を分け、それぞれラベル付けしてください。",why:"認識上の状態を明確にする。"},{prompt:"6 か月以内に古くなり得るものは何ですか？",why:"時間感応性の警告。"},{prompt:"ディープリサーチ: [トピック]。範囲: [地域、日付]。",why:"定義された作業指示。"}],
    beforeAfter:{before:"AI 規制の最新は？",after:"検索してください：過去 30 日間の EU と米国の AI 規制。一次資料のみ。施行済みと提案段階を分けてください。",improvement:"範囲、期間、品質、分類が明確。"},
    visual:"research" },
  { id:"multimodal", level:"core", number:"08", title:"音声、画像、マルチモーダルなワークフロー", ico:"imagePlus", color:"#c026d3",
    summary:"音声、画像理解、生成、編集は標準機能です。重要なのは具体性です。曖昧な視覚指示は一般的な結果しか生みません。",
    whyItMatters:"マルチモーダルにより、ChatGPT は視覚分析ツール、画像スタジオ、ハンズフリーの発想パートナーになります。",
    beginnerMoves:["アップロードした画像に何をしてほしいかを正確に伝える。","仕上がりより速度が重要なら音声を使う。","画像生成では主題、構図、雰囲気、スタイルを指定する。"],
    advancedMoves:["モードを連鎖させる：分析、説明、ノート化。","デザインレビューに画像批評を使う。","範囲を限定した編集：領域を選び、変更内容を説明する。"],
    commonMistakes:["画像を上げるだけで指示しない。","曖昧な記述で写実性を期待する。","音声でも同じ文脈が引き継がれることを忘れる。"],
    promptExamples:[{prompt:"メニュー項目を抽出し、カテゴリ別に整理してください。",why:"具体的な抽出指示。"},{prompt:"このグラフを非技術系の役員向けに 120 語で説明してください。",why:"制約付きの分析。"},{prompt:"生成：縦長 9:16、シネマティック、ゴールデンアワー。",why:"写真スタイルの指定。"},{prompt:"背景を白いスタジオに置き換え、被写体は維持してください。",why:"範囲を限定した編集。"}],
    beforeAfter:{before:"かっこいい画像を作って。",after:"16:9。夕暮れのモダンな東京のカフェ。建築写真、浅い被写界深度、暖かい雰囲気。木のカウンター、エスプレッソマシン、街の明かり。人物なし。",improvement:"比率、主題、スタイル、雰囲気、要素、除外条件が入る。"},
    visual:"multimodal" },
  { id:"study-collab", level:"power", number:"09", title:"学習、録音、グループ、リンク、スキル", ico:"layoutGrid", color:"#0d9488",
    summary:"学習、音声内容の記録、共同作業、共有、ワークフローの形式化のための機能です。",
    whyItMatters:"学ぶことは答えを得ることとは違います。共同作業は一人でのプロンプト運用とも異なります。",
    beginnerMoves:["学習モードを使って、答えを得るだけでなく学ぶ。","会議や講義には録音を使う。","きれいな共同作業には共有リンクとグループチャットを使う。"],
    advancedMoves:["録音要約をプロジェクトのソースファイルとして扱う。","繰り返し仕事をスキル化する。","共有文脈にはグループチャット + プロジェクトを使う。"],
    commonMistakes:["通常チャットで勉強して学習効果を落とす。","録音機能の存在を忘れる。","共有リンクではなくスクリーンショットで共有する。"],
    promptExamples:[{prompt:"答えを言う代わりに、私にクイズを出してください。",why:"教育的アプローチ。"},{prompt:"この録音をアクション項目とフォローアップ草案に変換してください。",why:"複数出力への変換。"},{prompt:"このワークフローをスキルに変換してください。",why:"手順を形式化する。"}],
    beforeAfter:{before:"光合成を説明して。",after:"生物の試験勉強中です。説明しないでください。理解確認のために、基本から高度まで質問してください。誤答には簡潔な説明で訂正してください。",improvement:"答え提供型からガイド付き学習へ変わる。"},
    visual:"collab" },
  { id:"personalization", level:"power", number:"10", title:"メモリー、指示、人格、一時チャット", ico:"database", color:"#d97706",
    summary:"メモリーは文脈を保存し、指示はルールを設定し、人格はスタイルを調整し、一時チャットはクリーンルームです。これらは互換ではありません。",
    whyItMatters:"個別設定を誤ると、役立つどころか結果を悪化させます。",
    beginnerMoves:["メモリー：広く安定した好み。","指示：全体の文章ルール。","一時チャット：持ち越しゼロ。"],
    advancedMoves:["人格は質感の調整であり、指示の代替ではない。","グローバル設定よりプロジェクト固有の指示を優先する。","定期的にメモリー監査を行う。"],
    commonMistakes:["すべてを指示ではなくメモリーに入れる。","古いメモリーが蓄積する。","人格で能力を変えようとし、スタイルではなく機能を変えようとする。"],
    promptExamples:[{prompt:"私について何を覚えていますか？",why:"メモリー監査。"},{prompt:"フォーマルな口調の好みを忘れてください。",why:"対象を絞った整理。"},{prompt:"白紙の状態で。保存された好みは使わないでください。",why:"クリーンルームモード。"}],
    beforeAfter:{before:"好みはメモリーに入っているのに、結果に一貫性がありません。",after:"行動ルールは指示に。事実はメモリーに。領域ルールはプロジェクト指示に。",improvement:"各情報を正しい層に分離できる。"},
    visual:"memory" },
  { id:"projects", level:"power", number:"11", title:"プロジェクトをあなたの OS にする", ico:"folderOpen", color:"#16a34a",
    summary:"プロジェクトは ChatGPT を文脈認識型の作業台にします。よく設計されたプロジェクトは、単一チャットのやり取りを大きく上回ります。",
    whyItMatters:"複数セッションにまたがる作業では、プロジェクトが最も強力な整理手段です。",
    beginnerMoves:["作業流ごとに 1 プロジェクト。名前は明確に。","関連ファイルだけをアップロードする。","プロジェクト指示を書く。"],
    advancedMoves:["会話要約もソースファイルとして追加する。","週次作業は新規チャットではなく 1 プロジェクト内で行う。","個人生産性のためのメタプロジェクトを作る。"],
    commonMistakes:["狭すぎるプロジェクトを作りすぎる。","何でもアップロードして文脈を膨らませる。","プロジェクト指示がない。"],
    promptExamples:[{prompt:"今学期に最適なプロジェクト構成を考えてください。",why:"まず作業空間を設計する。"},{prompt:"過去の作業に沿ったメモを下書きしてください。",why:"蓄積された文脈を活用する。"},{prompt:"過去 5 回の会話から重要な決定事項を要約してください。",why:"生きた要約になる。"}],
    beforeAfter:{before:"ファイルがあちこちにあり、把握できません。",after:"領域ごとに 1 プロジェクト。参考資料。指示。戻って使う。定期的に要約する。",improvement:"散らばった会話が構造化される。"},
    visual:"project" },
  { id:"gpts", level:"power", number:"12", title:"GPT を作るべき時、作るべきでない時", ico:"bot", color:"#44403c",
    summary:"ワークフローが繰り返され、指示が安定し、再利用の価値があるときに有効です。ただし、多くの人は早すぎる段階で作ってしまいます。",
    whyItMatters:"時期尚早の GPT は未成熟な流れを固定してしまいます。適切なタイミングなら、実証済みの流れをワンクリックの道具に変えられます。",
    beginnerMoves:["まずプロンプトを保存する。プロンプトが原型になる。","3 回繰り返してから正式化する。","目的は狭く。1 つの仕事だけ。"],
    advancedMoves:["4 層で考える：役割、指示、知識、ツール。","失敗時のルールを明示する。","対抗的なテストを行う。"],
    commonMistakes:["一度しかしていない仕事のために GPT を作る。","『全部やる』のように広すぎる。","知識ファイルがない。"],
    promptExamples:[{prompt:"今のワークフローを GPT の設計図にしてください。",why:"実経験から導く。"},{prompt:"指示、入出力スキーマ、失敗ルールを整理してください。",why:"完全な仕様化。"},{prompt:"この GPT が扱うべきエッジケースは何ですか？",why:"耐性テスト。"}],
    beforeAfter:{before:"メール全部用の GPT を作って。",after:"教授への返信専用 GPT を作ってください。礼儀正しく、直接的に。150 語以内。まず文脈を確認する。確認なしでは送信しない。アップロード：スタイルガイド。",improvement:"範囲、安全ルール、参照情報が明確になる。"},
    visual:"gpt" },
  { id:"canvas", level:"power", number:"13", title:"文章とコード修正のための Canvas", ico:"panelsTopLeft", color:"#334155",
    summary:"チャットの横にある可視の作業面です。文書的な成果物で、局所的な修正が必要なときは、線形の会話より適しています。",
    whyItMatters:"長い成果物はチャット内で扱うと不利です。Canvas は文書そのものを重心にします。",
    beginnerMoves:["長い成果物には Canvas を使う。","目的ごとに 1 ファイル。","曖昧な書き直しではなく、狙いを定めた修正を行う。"],
    advancedMoves:["戦略はチャット、実行は canvas。","最初に構造、次に狭い差分。","比較のために履歴を使う。"],
    commonMistakes:["長文をチャットで扱う。","1 段落の修正で済むのに全文を書き直す。","デバッグにコード canvas を使わない。"],
    promptExamples:[{prompt:"文章用 canvas を開いてください。導入だけ書き直してください。",why:"範囲を絞った編集。"},{prompt:"論理エラーを見つけ、その行だけ修正してください。",why:"狙いを絞ったコード修正。"},{prompt:"セクション 3 を 2 の前に移動し、4 と 5 を統合してください。",why:"構造の再編。" }],
    beforeAfter:{before:"エッセイを書き直して。 [チャット内に 2000 語]",after:"canvas で開いてください。まだ変更しないでください。強い部分と弱い部分に注釈を付け、その後で私が修正指示を出します。",improvement:"修正前に観察する流れになる。"},
    visual:"canvas" },
  { id:"tasks-apps-agent", level:"expert", number:"14", title:"タスク、アプリ、Pulse、Agent", ico:"workflow", color:"#16a34a",
    summary:"運用レイヤーです。タスクは後で実行され、アプリはデータを持ち込み、Pulse は非同期に調査し、Agent は自律的に多段階作業を行います。",
    whyItMatters:"多くの人はリアルタイム Q&A しか使いません。この層によって ChatGPT はあなたのために働く仕組みになります。",
    beginnerMoves:["タスク：リマインダー、ブリーフィング、定期要約。","アプリ：情報が Drive、Slack、メールにあるとき。","Agent：手作業で 15 分以上かかる多段階フロー。"],
    advancedMoves:["Agent のプロンプトを停止点付きの業務指示書にする。","Pulse で話題更新を能動的に追う。","タスク + プロジェクトで週次自動要約を回す。"],
    commonMistakes:["Agent の存在を知らない。","停止ルールのない曖昧な agent 指示。","タスクをリマインダー専用だと思う。"],
    promptExamples:[{prompt:"毎日 8 時に [トピック] の上位 3 点を送るタスクを作成してください。",why:"能動的なブリーフィング。"},{prompt:"接続済みソースと公開ソースを使って競合分析をしてください。",why:"内部と外部のデータ統合。"},{prompt:"Agent: この手順で進め、提出前に一度停止してください。",why:"チェックポイント付きの自律実行。" }],
    beforeAfter:{before:"5 つのサイトを見て価格を比較して。",after:"Agent: 5 社の競合サイトを訪問し、価格を抽出して表にまとめてください。ログインが必要なら停止してください。古い価格はフラグを付けてください。",improvement:"委任範囲と例外処理が明確になる。"},
    visual:"agent" },
  { id:"model-choice", level:"expert", number:"15", title:"モデル選択とモード選択", ico:"compass", color:"#65a30d",
    summary:"異なるモードは速度、推論の深さ、ツール対応の間でトレードオフがあります。タスクに合わせてモデルの力を選ぶべきです。",
    whyItMatters:"常に最強モードを使うと時間を無駄にし、まったく引き上げないと深さを逃します。",
    beginnerMoves:["日常作業は Auto。","複雑な論理や統合が必要なときは強化する。","最強が常に最適とは限らない。"],
    advancedMoves:["下書きは速いモード、重要レビューは深いモード。","推論モードごとのツール制限に注意する。","軽く始めて会話の途中で引き上げる。"],
    commonMistakes:["何でも最強モードにする。","モードではなくモデルのせいにする。","プランで使える範囲を確認しない。"],
    promptExamples:[{prompt:"まず素早い答えを、その後でより深い第 2 パスをください。",why:"速度と深さを両立する。"},{prompt:"複雑な論理です。拡張思考で、段階的に考えてください。",why:"深い推論を明示する。"},{prompt:"これは素早い下書き向きですか、それとも慎重な推論向きですか？",why:"モデルにモード選択を手伝わせる。" }],
    beforeAfter:{before:"常に最も高度なモデルを使う。",after:"簡単な作業は Auto。論理は推論モード。発想出しは速いモード。",improvement:"タスク種別に合わせて力を配分できる。"},
    visual:"models" },
  { id:"privacy-risk", level:"expert", number:"16", title:"プライバシー、データ管理、リスク", ico:"shield", color:"#e11d48",
    summary:"能力が高まるほど、より明確な境界が必要です。機微データにはアップロード規律が必要であり、高リスクの出力には人間の確認が必要です。",
    whyItMatters:"境界のない能力は、データ露出や過度な依存につながります。",
    beginnerMoves:["機微な内容を気軽にアップロードしない。","アップロード前に識別情報を削除する。","最もクリーンなプライバシー運用には一時チャット。"],
    advancedMoves:["赤・黄・緑のアップロード方針を作る。","高リスク行動の前に専門家レビューを挟む。","定期的にデータ監査を行う。"],
    commonMistakes:["サンプルで足りるのに全データベースを渡す。","一時チャットなら何も処理されないと思い込む。","規制領域で AI 出力を最終判断にする。"],
    promptExamples:[{prompt:"どの部分に人間の専門家確認が必要ですか？",why:"限界を示す。"},{prompt:"全面アップロードの前に、機密情報を伏せるのを手伝ってください。",why:"安全な準備。"},{prompt:"ここで個人識別情報に当たるものは何ですか？削除してください。",why:"PII の検出。" }],
    beforeAfter:{before:"顧客リスト全体です。傾向を分析して。",after:"名前、メール、電話番号を削除してください。会社名も匿名化してください。その後、セグメント別売上を分析してください。",improvement:"識別情報を削りつつ、分析価値を残す。"},
    visual:"privacy" },
];

/* ─────────────────────────────────────────────
   セクション用 SVG ビジュアル
   ───────────────────────────────────────────── */
function SectionVisual({ type }) {
  const s = "fill-none stroke-current";
  const cls = "h-36 w-full";
  const col = C.greenDeep;
  const tx = (x, y, label, opts = {}) => <text x={x} y={y} textAnchor="middle" fill={col} style={{ fontSize: opts.size || 10, fontWeight: opts.bold ? 600 : 400, opacity: opts.dim ? 0.4 : 1 }}>{label}</text>;
  const V = {
    mental: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}><rect x="24" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="216" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="120" y="110" width="120" height="44" rx="12" className={s} strokeWidth="2"/><path d="M144 34h72" className={s} strokeWidth="1.5"/><path d="M84 56l60 54M276 56l-60 54" className={s} strokeWidth="1.5"/>{tx(84,39,"あなたの目標",{bold:true})}{tx(276,39,"AI の下書き",{bold:true})}{tx(180,137,"あなたの判断",{bold:true})}{tx(180,84,"確認、判断、実行",{dim:true,size:9})}</svg>,
    layers: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["40","8","280","24","通常チャット"],["54","38","252","24","プロジェクト + Canvas"],["68","68","224","24","メモリー + 指示"],["82","98","196","24","GPT + 学習 + スキル"],["96","128","168","24","タスク + アプリ + Agent"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(180,Number(y)+16,l,{bold:true,size:9})}</g>)}{tx(336,22,"シンプル",{dim:true,size:8})}{tx(336,146,"高機能",{dim:true,size:8})}</svg>,
    prompt: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["18","8","目的"],["126","8","背景"],["234","8","ルール"],["18","92","形式"],["126","92","品質"],["234","92","検証"]].map(([x,y,l])=><g key={l}><rect x={x} y={y} width="102" height="50" rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+51,Number(y)+30,l,{bold:true,size:11})}</g>)}</svg>,
    workflow: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["30","構想"],["100","下書き"],["170","批評"],["240","修正"],["310","仕上げ"]].map(([x,l],i)=><g key={l}><circle cx={x} cy="60" r="22" className={s} strokeWidth="2"/>{tx(Number(x),64,l,{bold:true,size:9})}{i<4&&<path d={`M${Number(x)+22} 60h26`} className={s} strokeWidth="1.5"/>}</g>)}{tx(170,112,"各パスで具体性が増す",{dim:true,size:9})}</svg>,
    writing: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="134" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="248" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><path d="M112 59h22M226 59h22" className={s} strokeWidth="1.5"/>{tx(66,38,"元文",{bold:true})}{tx(180,38,"変換",{bold:true})}{tx(294,38,"出力",{bold:true})}</svg>,
    data: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="10" width="116" height="96" rx="10" className={s} strokeWidth="2"/><path d="M20 36h116M48 10v96M76 10v96M104 10v96M20 62h116M20 88h116" className={s} strokeWidth="1"/><rect x="186" y="18" width="24" height="70" rx="6" className={s} strokeWidth="2"/><rect x="220" y="40" width="24" height="48" rx="6" className={s} strokeWidth="2"/><rect x="254" y="28" width="24" height="60" rx="6" className={s} strokeWidth="2"/><rect x="288" y="48" width="24" height="40" rx="6" className={s} strokeWidth="2"/><path d="M182 100h136" className={s} strokeWidth="1.5"/>{tx(78,126,"1. 確認",{dim:true,size:9})}{tx(252,126,"2. 結論",{dim:true,size:9})}</svg>,
    research: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><circle cx="66" cy="58" r="32" className={s} strokeWidth="2"/><path d="M90 82l22 22" className={s} strokeWidth="2"/><rect x="170" y="10" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="50" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="90" width="144" height="28" rx="8" className={s} strokeWidth="2"/>{tx(242,29,"一次情報",{bold:true})}{tx(242,69,"二次情報",{bold:true})}{tx(242,109,"推論",{bold:true})}<circle cx="326" cy="24" r="4" fill="#10a37f" stroke="none"/><circle cx="326" cy="64" r="4" fill="#F59E0B" stroke="none"/><circle cx="326" cy="104" r="4" fill="#E11D48" stroke="none" opacity="0.5"/></svg>,
    multimodal: <svg viewBox="0 0 360 130" className={cls} style={{ color: col }}>{[["36","テキスト"],["120","画像"],["204","音声"],["288","編集"]].map(([x,l])=><g key={l}><rect x={x} y="20" width="52" height="52" rx="12" className={s} strokeWidth="2"/>{tx(Number(x)+26,50,l,{bold:true,size:9})}</g>)}<path d="M88 46h32M172 46h32M256 46h32" className={s} strokeWidth="1.5"/>{tx(180,102,"モードを連鎖させる",{dim:true,size:9})}</svg>,
    collab: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["18","24","64","42","録音"],["100","6","120","42","学習"],["100","78","120","42","グループ"],["238","24","80","42","共有"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M82 45h18M220 27h18M220 99h18" className={s} strokeWidth="1.5"/></svg>,
    memory: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["14","10","74","40","メモリー"],["100","10","120","40","指示"],["232","10","108","40","人格"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<rect x="60" y="88" width="240" height="40" rx="12" className={s} strokeWidth="2"/>{tx(180,113,"一貫した出力",{bold:true})}<path d="M51 50l38 38M160 50v38M286 50l-38 38" className={s} strokeWidth="1.5"/></svg>,
    project: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="28" y="4" width="304" height="132" rx="16" className={s} strokeWidth="2"/><rect x="46" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="130" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="214" y="28" width="100" height="40" rx="8" className={s} strokeWidth="2"/><rect x="214" y="76" width="100" height="40" rx="8" className={s} strokeWidth="2"/>{tx(82,76,"チャット",{bold:true})}{tx(166,76,"ファイル",{bold:true})}{tx(264,52,"ソース",{bold:true,size:9})}{tx(264,100,"ルール",{bold:true,size:9})}</svg>,
    gpt: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["16","48","78","42","役割"],["116","4","96","42","知識"],["116","94","96","42","ツール"],["234","48","110","42","ルール"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M94 69h22M212 25h22M212 115h22" className={s} strokeWidth="1.5"/><path d="M164 46v48" className={s} strokeWidth="1.5"/></svg>,
    canvas: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="4" width="320" height="132" rx="14" className={s} strokeWidth="2"/><path d="M20 32h320" className={s} strokeWidth="1.5"/><path d="M132 32v104M248 32v104" className={s} strokeWidth="1.2"/>{tx(76,22,"アウトライン",{bold:true,size:10})}{tx(190,22,"下書き",{bold:true,size:10})}{tx(290,22,"修正",{bold:true,size:10})}</svg>,
    agent: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["10","48","60","40","目的"],["90","6","64","40","閲覧"],["90","94","64","40","ファイル"],["174","6","64","40","アプリ"],["174","94","64","40","コード"],["258","48","80","40","完了"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+24,l,{bold:true,size:9})}</g>)}<path d="M70 68h20M122 46v48M154 26h20M154 114h20M238 26l20 40M238 114l20-40" className={s} strokeWidth="1.5"/></svg>,
    models: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["20","48","72","40","Auto"],["116","4","72","40","Fast"],["116","96","72","40","Deep"],["268","48","72","40","Pro"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<path d="M92 68h24M188 24h80M188 116h80" className={s} strokeWidth="1.5"/><path d="M152 44v52" className={s} strokeWidth="1.5"/></svg>,
    privacy: <svg viewBox="0 0 360 150" className={cls} style={{ color: col }}><path d="M180 8l88 32v44c0 34-26 62-88 80-62-18-88-46-88-80V40l88-32z" className={s} strokeWidth="2"/><path d="M150 82l18 18 40-42" className={s} strokeWidth="2.2"/>{tx(180,142,"能力には境界が必要",{dim:true,size:9})}</svg>,
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
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">強い例</div>
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
                <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>これが重要な理由</div>
                <p className="mt-2 text-[13px] leading-[1.75]" style={{ color: C.ink }}>{section.whyItMatters}</p>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.greenDeep }}>まずここから</div>
                <div className="space-y-2.5">{section.beginnerMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.greenMid }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>上級</div>
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
  const levelLabels = { foundation: "基礎", core: "中核スキル", power: "拡張機能", expert: "上級" };

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
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8]" style={{ color: C.inkLight }}>各ツールが何をするのか、いつ使うべきか、そしてどうすれば目に見えて良い結果を得られるかをまとめています。まず日常ユーザー向けに書かれ、さらに深く学びたい人のための章も含まれています。</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="lightbulb" className="h-3 w-3" style={{ color: C.greenMid }} /> 確認日 {VERIFIED_DATE}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="layers" className="h-3 w-3" style={{ color: C.greenMid }} /> 16 セクション &middot; 60+ プロンプト</span>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: C.borderLight }}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>現在の ChatGPT ができること</div>
              <svg viewBox="0 0 420 190" className="w-full" style={{ color: C.greenDeep }}>
                {[["16","4","120","38","回答","chat, search"],["150","4","120","38","整理","projects, memory"],["284","4","120","38","作成","canvas, images"],["16","120","120","38","学習","study, record"],["150","120","120","38","共有","groups, links"],["284","120","120","38","実行","tasks, agent"]].map(([x,y,w,h,l,sub])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className="fill-none stroke-current" strokeWidth="1.6"/><text x={Number(x)+Number(w)/2} y={Number(y)+18} textAnchor="middle" fill={C.greenDeep} style={{fontSize:10,fontWeight:600}}>{l}</text><text x={Number(x)+Number(w)/2} y={Number(y)+30} textAnchor="middle" fill={C.greenDeep} style={{fontSize:7,opacity:0.4}}>{sub}</text></g>)}
                <text x="210" y="84" textAnchor="middle" fill={C.greenDeep} style={{fontSize:9,fontWeight:600,opacity:0.25}}>フルスタック</text>
                {[[136,23,150,23],[270,23,284,23],[76,42,76,120],[210,42,210,120],[344,42,344,120]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.greenDeep} strokeWidth="1" opacity="0.15"/>)}
              </svg>
            </div>
          </div>
        </header>

        {/* 6 つの原則 */}
        <section className="mt-8">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>6 つの原則</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[{ico:"penTool",t:"明確に頼む",d:"目的、背景、制約、形式。"}, {ico:"layoutGrid",t:"適切な層を選ぶ",d:"チャット、プロジェクト、canvas、検索、agent。"}, {ico:"shield",t:"重要なら検証する",d:"最新情報や高リスクの内容は検索。"}, {ico:"refreshCcw",t:"やり直さず修正する",d:"良い結果は第 2 パスで出やすい。"}, {ico:"bot",t:"うまくいく流れを仕組みにする",d:"プロジェクト、GPT、タスク、またはスキル。"}, {ico:"eye",t:"可視化で考える速度を上げる",d:"表、図、スクリーンショット。"}].map(({ico,t,d})=>(
              <div key={t} className="flex gap-3 rounded-2xl border bg-white p-4" style={{borderColor:C.border}}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name={ico} className="h-4 w-4"/></div>
                <div><div className="text-[13px] font-semibold" style={{color:C.ink}}>{t}</div><div className="mt-0.5 text-[12px] leading-relaxed" style={{color:C.inkLight}}>{d}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* ツール選択表 */}
        <section className="mt-8 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>判断表</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>どのツールを使うべきか？</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{borderColor:C.borderLight}}>
            <table className="min-w-full text-left text-[13px]">
              <thead><tr style={{backgroundColor:C.cream}}><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>目的</th><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>最適なツール</th><th className="hidden whitespace-nowrap px-4 py-3 font-semibold sm:table-cell" style={{color:C.ink}}>理由</th></tr></thead>
              <tbody>{TOOL_CHOOSER.map((r,i)=><tr key={r.goal} style={{backgroundColor:i%2===0?"#fff":C.cream}}><td className="px-4 py-3 font-medium" style={{color:C.ink}}>{r.goal}</td><td className="whitespace-nowrap px-4 py-3"><span className="inline-flex items-center gap-1.5 font-semibold" style={{color:C.greenDeep}}><Ico name={r.ico} className="h-3.5 w-3.5"/>{r.tool}</span></td><td className="hidden px-4 py-3 sm:table-cell" style={{color:C.inkLight}}>{r.reason}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {/* プロンプトの型 */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>プロンプトの型</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>あらゆるプロンプトを改善する 6 つのブロック</h2>
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

        {/* 追加機能 */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>見落とされがち</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>多くのユーザーが見逃す機能</h2>
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
            <button onClick={expandAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>展開</button>
            <button onClick={collapseAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>折りたたむ</button>
          </div>
        </section>

        {/* ガイドセクション */}
        <main className="mt-8 space-y-10">
          {Object.entries(sectionsByLevel).map(([lev, sections]) => {
            if (!sections.length) return null;
            return (<div key={lev}>
              <div className="mb-4 flex items-center gap-3"><div className="h-px flex-1" style={{backgroundColor:C.border}}/><span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>{levelLabels[lev]}</span><div className="h-px flex-1" style={{backgroundColor:C.border}}/></div>
              <div className="space-y-4">{sections.map(s=><GuideSectionCard key={s.id} section={s} isExpanded={expanded.has(s.id)} onToggle={()=>toggleSection(s.id)}/>)}</div>
            </div>);
          })}
        </main>

        {/* 範囲 + 要点 */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{borderColor:C.border}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>範囲</div>
            <h3 className="ff-display mt-2 text-[18px] font-medium" style={{color:C.ink}}>このガイドが扱うもの</h3>
            <div className="mt-4 space-y-2 text-[13px] leading-relaxed" style={{color:C.inkLight}}>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>企業管理者向けではなく、ユーザー向け機能。</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>製品トリビアより実用性を重視。</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>利用可否はプランとプラットフォームで異なる。</div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 p-5 shadow-sm" style={{background:`linear-gradient(135deg, ${C.greenLight}, #F0FAF5)`}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.greenDeep}}>最大のアップグレード</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name="sparkles" className="h-5 w-5"/></div>
              <div>
                <div className="ff-display text-[16px] font-semibold" style={{color:C.greenDeep}}>「どうすればプロンプトが上手くなるか？」をやめる</div>
                <p className="mt-2 text-[13px] leading-[1.75] opacity-80" style={{color:C.greenDeep}}>代わりに「この仕事には ChatGPT のどの層が合うのか？」と考える。この発想の転換は、プロンプト技巧より大きな改善をもたらします。</p>
              </div>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="mt-8 overflow-hidden rounded-3xl p-6 text-white shadow-lg md:p-10" style={{background:"linear-gradient(135deg, #0A2A1F, #0D3B2E 40%, #143D30)"}}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300">最終的な要点</div>
              <h2 className="ff-display mt-2 text-2xl font-medium tracking-tight md:text-[28px]">熟達とは何か</h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.85] text-emerald-100" style={{opacity:0.8}}>適切なモードを選ぶ。仕事を明確に定義する。重要なことは検証する。賢く修正する。成功した流れを再利用可能な仕組みに変える。最も上手いユーザーとは、AI を使える明晰な思考者です。</p>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              <br />
              ChatGPT User Guide
              <br />
              © 2026 EugeneYip.com All Rights Reserved. 
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[13px] font-semibold">定期的に再確認する</div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] leading-relaxed text-emerald-200" style={{opacity:0.7}}>
                {["機能","価格","リリースノート","プロジェクト","メモリー FAQ","Canvas","タスク","アプリ","検索","ディープリサーチ","学習モード","録音","共有リンク","グループ","スキル","Agent","音声","画像 FAQ"].map(i=><div key={i} className="flex items-center gap-1.5"><div className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" style={{opacity:0.5}}/>{i}</div>)}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
```
