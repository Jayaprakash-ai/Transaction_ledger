import { useEffect } from "react";
import { useRouter } from "next/router";

export default function HomeRouteController() {
  const router = useRouter();

  useEffect(() => {
    const session = sessionStorage.getItem("userSession");

    if (session) {
      router.replace("/profile");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-500">
      Loading secure session terminal...
    </div>
  );
}
