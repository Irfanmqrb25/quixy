import getCurrentUser from "@/actions/getCurrentUser";
import SignOutButton from "@/components/button/SignOutButton";
import EditProfileForm from "@/components/form/EditProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings } from "lucide-react";
import React from "react";

const SettingsPage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-4">
      <div className="lg:mt-7 flex items-center gap-1 justify-center border rounded-md p-1">
        <Settings />
        <h1 className="text-xl md:text-2xl font-semibold">Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg lg:text-xl">
            Profile
          </CardTitle>
          <CardDescription>Edit your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <EditProfileForm user={user!} />
        </CardContent>
      </Card>
      <SignOutButton />
    </div>
  );
};

export default SettingsPage;
