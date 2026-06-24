// アプリ全体で共有する型定義

export type PuzzleGroup = "main" | "bonus";

/** クライアントに渡してよい問題メタ情報（正解は含まない） */
export interface PuzzleMeta {
  /** 一意なID。main: 1〜10 / bonus: 101, 102 */
  id: number;
  /** グループ */
  group: PuzzleGroup;
  /** 同グループ内での並び順（1始まり） */
  order: number;
  /** 表示ラベル（例：問題１ / おまけ謎１） */
  label: string;
  /** 回答時に頭につける番号（例：1, 10, 0） */
  code: string;
  /** 問題画像のパス */
  image: string;
  /** ヒント本文（空配列ならヒントボタンを出さない） */
  hints: string[];
  /** 赤字「回答時、問題番号を頭につけてください」を表示するか */
  showNumberNotice: boolean;
}

/** サーバーが返すプレイヤー進捗 */
export interface PlayerProgress {
  displayName: string;
  /** 正解済みメイン問題数（0〜10） */
  mainSolved: number;
  /** 正解済みおまけ問題数（0〜2） */
  bonusSolved: number;
  mainCleared: boolean;
  bonusCleared: boolean;
  /** 最終クリア時に登録した名前 */
  registeredName?: string;
  /** 正解した問題と入力した答え（本人のみ閲覧） */
  answered: AnsweredEntry[];
}

export interface AnsweredEntry {
  puzzleId: number;
  label: string;
  answer: string;
  /** 正解日時(epoch ms) */
  at: number;
}

/** 全問正解者一覧の1件 */
export interface WinnerEntry {
  name: string;
  clearedAt: number;
}
