"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus } from "lucide-react";
import UploadPostCarousel from "../carousel/UploadPostCarousel";

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="yjp4nbzb">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <div className="relative transition border-dashed border-2 py-40 rounded-sm border-neutral-300 flex justify-center">
              <Button
                type="button"
                onClick={onClick}
                className="text-center px-2 py-1 text-white text-sm rounded-md bg-blue-500 hover:bg-blue-400"
              >
                Choose an image
              </Button>
              {value.length > 0 && (
                <div className="absolute inset-0 w-full h-full">
                  <UploadPostCarousel images={value} />
                </div>
              )}
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
