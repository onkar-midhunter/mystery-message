"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignOutBtn() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/signout", {
      method: "POST",
    });

    router.replace("/sign-in");
  };

  return (
    <Button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Sign Out
    </Button>
  );
}
