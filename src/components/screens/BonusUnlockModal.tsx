"use client";

import Modal from "@/components/ui/Modal";

/** おまけ謎を開くときの説明ポップアップ。「次へ」で注意事項へ進む。 */
export default function BonusUnlockModal({
  open,
  onProceed,
}: {
  open: boolean;
  onProceed: () => void;
}) {
  return (
    <Modal open={open} title="おまけ謎" onClose={onProceed} closeLabel="次へ">
      <div className="flex flex-col gap-3 text-base leading-relaxed">
        <p>
          ・どうやら、これまでお送りした謎に漏れがあったため、最後の謎の答えがまだ途中のようです。
        </p>
        <p>
          ・漏れていた謎の断片をお送りしますので、まだ解けていない謎を探して解いてください。
        </p>
        <p>・その謎が解けましたら、問題番号10の残りをお送りします。</p>
      </div>
    </Modal>
  );
}
