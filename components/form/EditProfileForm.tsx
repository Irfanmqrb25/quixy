"use client";

import { User } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { editProfileSchema } from "@/lib/validation/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import { Button, buttonVariants } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface EditProfileFormProps {
  user: User;
}

type Inputs = z.infer<typeof editProfileSchema>;

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      image: user.image || "/assets/default-user.jpg",
      username: user.username ?? user.name!,
      description: user.description ?? "",
    },
  });

  const image = form.watch("image");

  const handleImageUpload = (result: any) => {
    form.setValue("image", result?.info?.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    try {
      await axios.post("/api/settings/profile", data);
      toast.success("Profile updated");
      router.refresh();
    } catch (error: any) {
      toast.error("Something went wrong");
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center mt-2 gap-x-3">
                  <Image
                    alt="Profile Image"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                    src={image || user.image || "/assets/default-user.jpg"}
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleImageUpload}
                    uploadPreset="uyrkoug9"
                    className={cn(buttonVariants({ variant: "outline" }))}
                    {...field}
                  >
                    Change image
                  </CldUploadButton>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button
            disabled={loading}
            variant="secondary"
            className="w-full"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </Button>
          <Button disabled={loading} className="w-full">
            {loading && (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileForm;
