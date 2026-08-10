import { useEffect } from "react";
import { useRouter } from "next/router";

export default function HomeRouteController() {
  const router = useRouter();

  useEffect(() => {
    // Read user authentication status from browser session storage
    const session = sessionStorage.getItem("userSession");

    if (session) {
      // 1. If authenticated, route them instantly to our clean profile panel
      router.replace("/profile");
    } else {
      // 2. If no session exists, push them cleanly to the login viewport
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-500">
      Loading secure session terminal...
    </div>
  );
}
