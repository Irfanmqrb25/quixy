"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

const SignOutButton = () => {
  return (
    <Button className="w-full" onClick={() => signOut()}>
      Sign out
    </Button>
  );
};

export default SignOutButton;
