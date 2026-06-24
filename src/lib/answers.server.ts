import "server-only";

// ============================================================
//  正解データ（サーバー専用）
//  このファイルはクライアントバンドルに含めない。
//  判定は「全空白(半角/全角)を除去して完全一致」。
//  許容リストは指定された表記ゆれを網羅している。
// ============================================================

const ACCEPTED_ANSWERS: Record<number, string[]> = {
  // 問題1〜10
  1: ["1きおく", "1記憶", "１記憶"],
  2: ["2ふうりょう", "２ふうりょう", "2風量", "２風量"],
  3: ["3かんしゃ", "３かんしゃ", "3感謝", "３感謝"],
  4: ["4ちしき", "４ちしき", "4知識", "４知識"],
  5: ["5おざしき", "５おざしき", "5お座敷", "５お座敷"],
  6: ["6すたーと", "６すたーと", "6スタート", "６スタート"],
  7: ["7しんたい", "７しんたい", "7身体", "７身体", "7進退", "７進退"],
  8: ["8あんぜん", "８あんぜん", "8安全", "８安全"],
  9: ["9はってん", "９はってん", "9発展", "９発展"],
  10: ["10とうしょうかん", "１０とうしょうかん", "10東照館", "１０東照館"],
  // おまけ謎1（id 101）
  101: ["0すてき", "０すてき", "0素敵", "０素敵"],
  // おまけ謎2（id 102）= 最終問題
  102: [
    "10しちてんはっき",
    "１０しちてんはっき",
    "10七天発揮",
    "１０七天発揮",
  ],
};

/** 全ての空白文字（半角・全角含む）を除去 */
function stripSpaces(s: string): string {
  return s.replace(/\s+/g, "");
}

/** 回答が正解かどうか判定する */
export function isCorrectAnswer(puzzleId: number, input: string): boolean {
  const accepted = ACCEPTED_ANSWERS[puzzleId];
  if (!accepted) return false;
  const normalized = stripSpaces(input);
  if (!normalized) return false;
  return accepted.some((a) => stripSpaces(a) === normalized);
}

export function hasAnswerFor(puzzleId: number): boolean {
  return Boolean(ACCEPTED_ANSWERS[puzzleId]);
}
