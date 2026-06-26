"use client";

import { useCallback, useEffect, useState } from "react";
import { initLiff, LiffSession } from "@/lib/liff";
import {
  fetchProgress,
  submitAnswer as apiSubmit,
  registerName as apiRegister,
} from "@/lib/api";
import { PlayerProgress, PuzzleMeta } from "@/lib/types";
import {
  getPuzzleMeta,
  mainByOrder,
  bonusByOrder,
  MAIN_COUNT,
  BONUS_COUNT,
} from "@/lib/puzzles";
import { celebrate } from "@/lib/confetti";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type Screen =
  | "loading"
  | "home"
  | "top"
  | "notice"
  | "puzzle"
  | "incorrect"
  | "mainClear"
  | "finalClear";

export type NoticeNext = "main" | "bonus";

export interface GameApi {
  session: LiffSession | null;
  progress: PlayerProgress | null;
  screen: Screen;
  currentPuzzle: PuzzleMeta | null;
  submitting: boolean;
  /** 正解演出（「正解！」＋紙吹雪）の表示中フラグ */
  celebrating: boolean;
  error: string | null;
  // 遷移
  tapHome: () => void;
  startMain: () => void;
  startBonus: () => void;
  proceedFromNotice: () => void;
  submit: (answer: string) => Promise<void>;
  closeIncorrect: () => void;
  afterMainClear: () => void;
  register: (name: string) => Promise<void>;
  backToTop: () => void;
  reload: () => Promise<void>;
}

export function useGame(): GameApi {
  const [session, setSession] = useState<LiffSession | null>(null);
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [screen, setScreen] = useState<Screen>("loading");
  const [currentPuzzleId, setCurrentPuzzleId] = useState<number>(1);
  const [noticeNext, setNoticeNext] = useState<NoticeNext>("main");
  const [submitting, setSubmitting] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初期化：LIFF → 進捗取得
  useEffect(() => {
    let mounted = true;
    (async () => {
      const s = await initLiff();
      if (!mounted) return;
      setSession(s);
      if (!s.ready) return; // ログインへリダイレクト中
      if (s.error) {
        setError(s.error);
        return;
      }
      try {
        const p = await fetchProgress(s);
        if (!mounted) return;
        setProgress(p);
        setScreen("home");
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "読み込みに失敗しました");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const reload = useCallback(async () => {
    if (!session) return;
    const p = await fetchProgress(session);
    setProgress(p);
  }, [session]);

  const tapHome = useCallback(() => setScreen("top"), []);

  const startMain = useCallback(() => {
    setNoticeNext("main");
    setScreen("notice");
  }, []);

  // おまけ謎は注意事項画面を挟まず、直接おまけ謎01の問題へ進む
  const startBonus = useCallback(() => {
    if (!progress) return;
    const order = Math.min(progress.bonusSolved + 1, BONUS_COUNT);
    const meta = bonusByOrder(order);
    if (meta) setCurrentPuzzleId(meta.id);
    setScreen("puzzle");
  }, [progress]);

  const proceedFromNotice = useCallback(() => {
    if (!progress) return;
    if (noticeNext === "main") {
      const order = Math.min(progress.mainSolved + 1, MAIN_COUNT);
      const meta = mainByOrder(order);
      if (meta) setCurrentPuzzleId(meta.id);
    } else {
      const order = Math.min(progress.bonusSolved + 1, BONUS_COUNT);
      const meta = bonusByOrder(order);
      if (meta) setCurrentPuzzleId(meta.id);
    }
    setScreen("puzzle");
  }, [progress, noticeNext]);

  const submit = useCallback(
    async (answer: string) => {
      if (!session || submitting) return;
      const meta = getPuzzleMeta(currentPuzzleId);
      if (!meta) return;
      setSubmitting(true);
      setError(null);
      try {
        const { correct, progress: next } = await apiSubmit(
          session,
          currentPuzzleId,
          answer
        );
        setProgress(next);
        if (!correct) {
          setScreen("incorrect");
          return;
        }

        // 正解 → 「正解！」演出＋紙吹雪を見せてから次へ進む
        celebrate("correct");
        setCelebrating(true);
        await sleep(1100);
        setCelebrating(false);

        // 次の遷移を決定
        if (meta.group === "main") {
          if (next.mainCleared) {
            setScreen("mainClear");
          } else {
            const nm = mainByOrder(next.mainSolved + 1);
            if (nm) setCurrentPuzzleId(nm.id);
            setScreen("puzzle");
          }
        } else {
          if (next.bonusCleared) {
            setScreen("finalClear");
          } else {
            const nb = bonusByOrder(next.bonusSolved + 1);
            if (nb) setCurrentPuzzleId(nb.id);
            setScreen("puzzle");
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "送信に失敗しました");
      } finally {
        setSubmitting(false);
      }
    },
    [session, submitting, currentPuzzleId]
  );

  const closeIncorrect = useCallback(() => setScreen("puzzle"), []);
  const afterMainClear = useCallback(() => setScreen("top"), []);
  const backToTop = useCallback(() => setScreen("top"), []);

  const register = useCallback(
    async (name: string) => {
      if (!session) return;
      const next = await apiRegister(session, name);
      setProgress(next);
    },
    [session]
  );

  return {
    session,
    progress,
    screen,
    currentPuzzle: getPuzzleMeta(currentPuzzleId) ?? null,
    submitting,
    celebrating,
    error,
    tapHome,
    startMain,
    startBonus,
    proceedFromNotice,
    submit,
    closeIncorrect,
    afterMainClear,
    register,
    backToTop,
    reload,
  };
}
