import { create } from "zustand";

interface PostUploadModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePostUploadModal = create<PostUploadModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default usePostUploadModal;
