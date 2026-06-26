"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import LoadingScreen from "@/components/screens/LoadingScreen";
import HomeScreen from "@/components/screens/HomeScreen";
import TopScreen from "@/components/screens/TopScreen";
import NoticeScreen from "@/components/screens/NoticeScreen";
import PuzzleScreen from "@/components/screens/PuzzleScreen";
import IncorrectScreen from "@/components/screens/IncorrectScreen";
import MainClearScreen from "@/components/screens/MainClearScreen";
import FinalClearScreen from "@/components/screens/FinalClearScreen";
import PracticeScreen from "@/components/screens/PracticeScreen";
import BonusUnlockModal from "@/components/screens/BonusUnlockModal";
import CorrectOverlay from "@/components/ui/CorrectOverlay";

export default function GameApp() {
  const game = useGame();
  const [bonusModalOpen, setBonusModalOpen] = useState(false);

  const { screen, session, progress, currentPuzzle } = game;

  let content: React.ReactNode = null;

  switch (screen) {
    case "loading":
      content = (
        <LoadingScreen error={game.error} mock={session?.mock} />
      );
      break;

    case "home":
      content = <HomeScreen key="home" onTap={game.tapHome} />;
      break;

    case "top":
      content = (
        <TopScreen
          key="top"
          bonusUnlocked={Boolean(progress?.mainCleared)}
          onStartMain={game.startMain}
          onTapBonus={() => setBonusModalOpen(true)}
        />
      );
      break;

    case "notice":
      content = <NoticeScreen key="notice" onNext={game.proceedFromNotice} />;
      break;

    case "puzzle":
      content = currentPuzzle ? (
        <PuzzleScreen
          key={`puzzle-${currentPuzzle.id}`}
          puzzle={currentPuzzle}
          session={session}
          progress={progress}
          submitting={game.submitting}
          onSubmit={game.submit}
          onBackToTop={game.backToTop}
          onChallenge={game.startPractice}
        />
      ) : null;
      break;

    case "incorrect":
      content = (
        <IncorrectScreen key="incorrect" onClose={game.closeIncorrect} />
      );
      break;

    case "mainClear":
      content = (
        <MainClearScreen key="mainClear" onNext={game.afterMainClear} />
      );
      break;

    case "practice":
      content = game.practicePuzzle ? (
        <PracticeScreen
          key={`practice-${game.practicePuzzle.id}`}
          puzzle={game.practicePuzzle}
          session={session}
          onExit={game.exitPractice}
        />
      ) : null;
      break;

    case "finalClear":
      content = (
        <FinalClearScreen
          key="finalClear"
          defaultName={
            progress?.registeredName || session?.profile?.displayName || ""
          }
          alreadyName={progress?.registeredName}
          onRegister={game.register}
          onBackToTop={game.backToTop}
        />
      );
      break;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="app-frame">
        <AnimatePresence mode="wait">{content}</AnimatePresence>

        {/* 正解時の全画面演出 */}
        <CorrectOverlay open={game.celebrating} />

        {/* おまけ謎の解放メッセージ → おまけ謎へ */}
        <BonusUnlockModal
          open={bonusModalOpen}
          onProceed={() => {
            setBonusModalOpen(false);
            game.startBonus();
          }}
        />
      </div>
    </MotionConfig>
  );
}
