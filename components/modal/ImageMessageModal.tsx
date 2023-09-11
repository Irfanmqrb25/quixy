import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

interface ImageMessageModalProps {
  src?: string | null;
  isOpen?: boolean;
  onClose?: () => void;
}

const ImageMessageModal: React.FC<ImageMessageModalProps> = ({
  src,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="px-0 rounded-md h-96 w-96">
        <Image
          src={src!}
          fill
          objectFit="cover"
          className="rounded-md"
          alt="image"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageMessageModal;
