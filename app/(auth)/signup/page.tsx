import Link from "next/link";

import Heading from "@/components/Heading";
import OauthButton from "@/components/button/OauthButton";
import SignUpForm from "@/components/form/SignUpForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const SignUpPage = () => {
  return (
    <div className="w-full xl:w-[70%] xl:mx-auto">
      <Card>
        <CardHeader className="space-y-1">
          <Heading title="Sign up" subtitle="Create an account" />
        </CardHeader>
        <CardContent className="grid gap-4">
          <OauthButton />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              aria-label="Sign in"
              href="/signin"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
