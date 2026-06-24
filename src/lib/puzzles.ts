// クライアント安全な問題メタ情報（画像・ラベル・ヒント）。
// ※ 正解はここには置かない（src/lib/answers.server.ts にサーバー専用で保持）。

import { PuzzleMeta } from "./types";

export const MAIN_PUZZLES: PuzzleMeta[] = [
  {
    id: 1,
    group: "main",
    order: 1,
    label: "問題１",
    code: "1",
    image: "/images/puzzle-01.jpg",
    showNumberNotice: true,
    hints: [
      "①文字の位置関係が重要です。",
      "②青い文字はどこにありますか。",
      "③「た」は「手前」にあるようです。",
      "④「き」は「奥」にあるようです。",
    ],
  },
  {
    id: 2,
    group: "main",
    order: 2,
    label: "問題２",
    code: "2",
    image: "/images/puzzle-02.jpg",
    showNumberNotice: true,
    hints: [
      "①左右の単語は、何らかの法則に従って変化しています。",
      "②各単語をひらがなに直してみましょう。",
      "③こしゅ→こうしゅう、ごしょ→ごうしょう",
      "④左の単語の二文字目と五文字目に「う」を追加しています。",
    ],
  },
  {
    id: 3,
    group: "main",
    order: 3,
    label: "問題３",
    code: "3",
    image: "/images/puzzle-03.jpg",
    showNumberNotice: true,
    hints: [
      "①漢字に関係します。",
      "②漢字の部首に関係します。",
      "③二つ目は「へん」です。",
      "④三つ目は「あし」です。",
      "⑤一つ目は「かんむり」です。",
    ],
  },
  {
    id: 4,
    group: "main",
    order: 4,
    label: "問題４",
    code: "4",
    image: "/images/puzzle-04.jpg",
    showNumberNotice: true,
    hints: [
      "①矢印の向きは、動きを表現しています。",
      "②スマートフォンに関係します。",
      "③今まさに触れているものに関係します",
      "④フリック入力に関係します。",
    ],
  },
  {
    id: 5,
    group: "main",
    order: 5,
    label: "問題５",
    code: "5",
    image: "/images/puzzle-05.jpg",
    showNumberNotice: true,
    hints: [
      "①❶と❷は、書き順を表しています。",
      "②通常の書き順と異なるのには、理由がありそうです。",
      "③この書き順で書くと、3種類のアルファベットの姿を通過するようです。",
      "④最初は、「C(しー)」です。",
    ],
  },
  {
    id: 6,
    group: "main",
    order: 6,
    label: "問題６",
    code: "6",
    image: "/images/puzzle-06.jpg",
    showNumberNotice: true,
    hints: [
      "①二つの向きから見る必要があります。",
      "②縦縞と横縞を表しています。",
      "③縦縞と横縞を、言い換えてみましょう。",
      "④英語に言い換えてみましょう。",
      "⑤ボ○○○とス○○○○",
    ],
  },
  {
    id: 7,
    group: "main",
    order: 7,
    label: "問題７",
    code: "7",
    image: "/images/puzzle-07.jpg",
    showNumberNotice: true,
    hints: [
      "①二つの動きに関する謎です。",
      "②◉は、目を表しています。",
      "③上は、片目を閉じて、開けています。",
      "④下は、両目を閉じて、開けています。",
    ],
  },
  {
    id: 8,
    group: "main",
    order: 8,
    label: "問題８",
    code: "8",
    image: "/images/puzzle-08.jpg",
    showNumberNotice: true,
    hints: [
      "①「やめてしまった前の王様」を言い換えてみましょう。",
      "②「やめてしまった前の王様」は、「元王」と言い換えられます。",
      "③「元王」は「完全」な人だったようです。",
      "④元王=完全、女王=？",
    ],
  },
  {
    id: 9,
    group: "main",
    order: 9,
    label: "問題９",
    code: "9",
    image: "/images/puzzle-09.jpg",
    showNumberNotice: true,
    hints: [
      "①問題番号は、そのままの色で書かれるようです。",
      "②二つの数字が隠れています。",
      "③6の答え→1の答え、5の答え→？？？",
      "④「すたーと」と「きおく」を探してみましょう。",
      "⑤「すたーと」と「きおく」の位置関係には法則がありそうです",
    ],
  },
  {
    id: 10,
    group: "main",
    order: 10,
    label: "問題10",
    code: "10",
    image: "/images/puzzle-10.jpg",
    showNumberNotice: true,
    hints: [
      "①各文字を探して並べてみましょう。",
      "②各文字を並べると「としょかん」となりそうですが、まだ何かが足りないようです。",
      "③この青い矢印には見覚えがありそうです。",
      "④青い矢印は、問題番号2のように変換することを意味します。",
      "⑤二文字目と五文字目に、「う」を入れてみましょう。",
    ],
  },
];

export const BONUS_PUZZLES: PuzzleMeta[] = [
  {
    id: 101,
    group: "bonus",
    order: 1,
    label: "おまけ謎１",
    code: "0",
    image: "/images/bonus-01.jpg",
    showNumberNotice: true,
    hints: [
      "①漏れていた謎の断片は、何かの下半分のようです。",
      "②枠線の形と色に注目してみましょう。",
      "③最初にお送りした注意事項は、漏れていた謎と組み合わせることで、新たな謎になるようです。注意事項は、右上のメニューからも確認できます。",
      "④下線を引かれた赤文字は、五十音表で三文字進んでいるようです。",
      "⑤問題番号は、黒い文字で書かれていて見えませんが、「問題番号は10まで」「問題番号は1ずつ増える」といったルールから導けそうです。",
    ],
  },
  {
    id: 102,
    group: "bonus",
    order: 2,
    label: "おまけ謎２",
    code: "10",
    image: "/images/bonus-02.jpg",
    // この問題のみヒント無し・赤字注意書きも非表示
    showNumberNotice: false,
    hints: [],
  },
];

export const ALL_PUZZLES: PuzzleMeta[] = [...MAIN_PUZZLES, ...BONUS_PUZZLES];

export function getPuzzleMeta(id: number): PuzzleMeta | undefined {
  return ALL_PUZZLES.find((p) => p.id === id);
}

/** メイン問題: order(1始まり) から PuzzleMeta を取得 */
export function mainByOrder(order: number): PuzzleMeta | undefined {
  return MAIN_PUZZLES.find((p) => p.order === order);
}

/** おまけ問題: order(1始まり) から PuzzleMeta を取得 */
export function bonusByOrder(order: number): PuzzleMeta | undefined {
  return BONUS_PUZZLES.find((p) => p.order === order);
}

export const MAIN_COUNT = MAIN_PUZZLES.length; // 10
export const BONUS_COUNT = BONUS_PUZZLES.length; // 2
