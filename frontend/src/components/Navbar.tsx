import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const session = sessionStorage.getItem("userSession");
      setIsLoggedIn(!!session);
    };
    checkSession();
    router.events.on("routeChangeComplete", checkSession);
    return () => {
      router.events.off("routeChangeComplete", checkSession);
    };
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("userSession");
    setIsLoggedIn(false);
    router.push("/login");
  };

  if (!isLoggedIn) return null;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center space-x-2 font-bold text-lg text-indigo-600 tracking-tight">
            <span className="text-xl">🏦</span>
            <span>BillingEngine</span>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2 text-sm font-semibold">
            <Link 
              href="/payments" 
              className={`px-3 py-2 rounded-md transition-all ${router.pathname === "/payments" ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              Payments
            </Link>
            
            <Link 
              href="/profile" 
              className={`px-3 py-2 rounded-md transition-all ${router.pathname === "/profile" ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              My Profile
            </Link>

            <Link 
              href="/customers" 
              className={`px-3 py-2 rounded-md transition-all ${router.pathname === "/customers" ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              Register
            </Link>
          </div>

          <div>
            <button 
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-3.5 py-2 rounded-lg transition-colors border border-rose-200"
            >
              Log Out
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
