import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Wallet, ArrowRight,Eye,EyeOff } from "lucide-react";

const api = axios.create({ baseURL: "http://127.0.0.1:8000" });

export default function LoginPage() {
  const [customerIdInput, setCustomerIdInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerIdInput.trim() || !passwordInput.trim()) {
      setErrorMsg("Please enter both your Customer ID and Password.");
      return;
    }

    try {
      const response = await api.post("/customers/login", {
        customer_id: customerIdInput.trim(),
        password: passwordInput.trim()
      });

      const matchedUser = response.data;
      sessionStorage.setItem("userSession", JSON.stringify(matchedUser));
      router.push("/");
    } catch (err: any) {
      console.error(err);
      const backendError = err.response?.data?.detail;
      setErrorMsg(backendError || "Authentication Failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-indigo-600/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
            <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Access Your Billing Ledger</h1>
          <p className="text-xs text-slate-400">Enter your custom credentials to log into your account securely.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Tracking Identifier</label>
            <input
              type="text"
              value={customerIdInput}
              onChange={(e) => setCustomerIdInput(e.target.value)}
              placeholder="CUST-1785..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Password</label>
            
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"} 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl shadow-lg shadow-indigo-600/10 transition-colors group mt-2"
          >
            <span>Authenticate Secure Session</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
          </button>
          {errorMsg && (
            <p className="text-xs font-medium text-rose-400 bg-rose-500/5 border border-rose-500/10 p-3 rounded-lg text-center animate-fadeIn">
              {errorMsg}
            </p>
          )}
        </form>
        <div className="border-t border-slate-800/60 pt-4 text-center">
          <p className="text-xs text-slate-500">
            Need a profile? Navigate to{" "}
            <a href="/customers" className="text-indigo-400 hover:underline">
              Register Customer
            </a>{" "}
            to generate an identifier.
          </p>
        </div>

      </div>
    </div>
  );
}
