"use client";

import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { CldUploadButton } from "next-cloudinary";
import { cn } from "@/lib/utils";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import useConversation from "@/hooks/useConversation";

const InputMessage = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId: conversationId,
    });
  };

  const handleUpload = (result: any) => {
    axios.post("/api/messages", {
      image: result.info.secure_url,
      conversationId: conversationId,
    });
  };

  return (
    <div className="flex items-center gap-2 w-full py-4">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="yjp4nbzb"
        className={cn(buttonVariants({ size: "icon" }), "px-3")}
      >
        <HiPhoto size={20} />
      </CldUploadButton>
      <form className="w-full flex itc gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="message"
          placeholder="Write a message"
          {...register("message", { required: true })}
          autoComplete="off"
          className="border-black border-2 dark:border-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button size="icon" className="px-3" type="submit">
          <HiPaperAirplane size={20} />
        </Button>
      </form>
    </div>
  );
};

export default InputMessage;
