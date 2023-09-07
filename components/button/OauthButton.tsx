"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";

const OauthButton = () => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex w-full justify-between text-black bg-white border hover:bg-white hover:border-neutral-500 border-neutral-300"
      >
        <FcGoogle className="text-xl" />
        <span className="mx-auto">Google</span>
      </Button>
      <Button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="flex w-full justify-between text-black bg-white border hover:bg-white hover:border-neutral-500 border-neutral-300"
      >
        <BsGithub className="text-xl text-[#3b5998]" />
        <span className="mx-auto">Github</span>
      </Button>
    </div>
  );
};

export default OauthButton;
