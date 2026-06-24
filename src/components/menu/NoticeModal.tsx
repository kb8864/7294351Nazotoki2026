"use client";

import Modal from "@/components/ui/Modal";
import SaveableImage from "@/components/ui/SaveableImage";

/** 注意事項をみる（謎解き注意事項.png をポップアップ表示） */
export default function NoticeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} title="注意事項" onClose={onClose}>
      <SaveableImage
        src="/images/intro.png"
        alt="謎解き注意事項"
        hint={false}
      />
    </Modal>
  );
}
