import { Metadata } from "next";
import Link from "next/link";

import { ArrowLeft } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { buttonVariants } from "@/components/ui/button";

// TODO: Update metadata
export const metadata: Metadata = {
  title: "Authentication | NextPro",
  description: "Authenticate to access your account",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="absolute top-5 left-5">
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          <HugeiconsIcon icon={ArrowLeft} className="size-4" />
          Back to Home
        </Link>
      </div>
      <div className="mx-auto w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
