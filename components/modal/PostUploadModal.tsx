"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import Heading from "../Heading";
import ImageUpload from "../input/ImageUpload";
import { Textarea } from "../ui/textarea";
import { Form, FormControl, FormField, FormItem } from "../ui/form";

import usePostUploadModal from "@/hooks/usePostUploadModal";

import axios from "axios";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

enum STEPS {
  IMAGE_UPLOAD = 0,
  CAPTION_UPLOAD = 1,
}

const formSchema = z.object({
  images: z.object({ url: z.string() }).array(),
  caption: z.string(),
});

type PostFormValues = z.infer<typeof formSchema>;

const PostUploadModal = () => {
  const router = useRouter();
  const postUploadModal = usePostUploadModal();
  const [step, setStep] = useState(STEPS.IMAGE_UPLOAD);
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    images: [],
    caption: "",
  };

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.CAPTION_UPLOAD) {
      return "upload";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.IMAGE_UPLOAD) {
      return undefined;
    }
    return "Back";
  }, [step]);

  const onSubmit = async (data: PostFormValues) => {
    if (step !== STEPS.CAPTION_UPLOAD) {
      return onNext();
    }

    setIsLoading(true);

    try {
      await axios.post("/api/post", data);
      router.refresh();
      setStep(STEPS.IMAGE_UPLOAD);
      postUploadModal.onClose();
      router.push("/");
      toast.success("Post Uploaded");
      form.reset();
    } catch (error: any) {
      toast.error("Something went wrong");
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  let bodyContent = (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUpload
                  value={field.value.map((image) => image.url)}
                  onChange={(url) => field.onChange([...field.value, { url }])}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );

  if (step === STEPS.CAPTION_UPLOAD) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Add your captions" subtitle="Step 2 of 2" />
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <Textarea
                    {...field}
                    placeholder="Write a caption for your post"
                    disabled={isLoading}
                  />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    );
  }

  return (
    <Modal
      title="Create a new post"
      isOpen={postUploadModal.isOpen}
      onClose={postUploadModal.onClose}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.IMAGE_UPLOAD ? undefined : onBack}
      body={bodyContent}
      disabled={isLoading}
    />
  );
};

export default PostUploadModal;
