import { useState } from "react";
import { createCustomer } from "../services/customers";
import { Eye,EyeOff } from "lucide-react";

export default function CustomerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState("");
  const [newCustomerInfo, setNewCustomerInfo] = useState<{ id: string; name: string } | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


const handleAdd = async () => {
  if (!name || !balance || !password) {
    alert("Name, Balance, and Password are Required.");
    return;
  }

  if (password.length < 8) {
    alert("❌ Password must be at least 8 characters long.");
    return;
  }

  try {
    const trackingId = `CUST-${Date.now()}`;
    await createCustomer({
      name,
      email,
      balance: Number(balance),
      customer_id: trackingId,
      password: password
    } as any);

    setNewCustomerInfo({ id: trackingId, name: name });
    setName("");
    setEmail("");
    setBalance("");
    setPassword("");
  } catch (error) {
    console.error(error);
    alert("Failed to add customer.");
    setNewCustomerInfo(null);
  }
};


  return (
  <div className="max-w-md mx-auto mt-10 px-4">
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
      
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Register New Customer</h1>
        <p className="text-xs text-slate-500 mt-1">Create a master ledger customer record entry profile securely.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Full Name *</label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 bg-slate-50/50"
            placeholder="e.g. Fedrick" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
          <input 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 bg-slate-50/50"
            placeholder="fred@gmail.com" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Opening Balance (₹) *</label>
          <input 
            type="number"
            min="0"
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault();
            }}
            value={balance} 
            onChange={e => setBalance(e.target.value)} 
            className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 bg-slate-50/50"
            placeholder="0.00" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Set Account Password *
          </label>
          <div className="relative flex items-center">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full border border-slate-200 rounded-xl p-3 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 bg-slate-50/50"
              placeholder="••••••••" 
            />
            
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          onClick={handleAdd}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-sm transition-colors mt-2"
        >
          Create Customer Account
        </button>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500 font-medium">
          Already have an account?{" "}
          <a 
            href="/login" 
            className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-all ml-1"
          >
            Go to Login →
          </a>
        </p>
      </div>
      {newCustomerInfo && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 animate-fadeIn">
          <p className="font-bold text-sm flex items-center gap-1.5">
            <span>✅</span> Customer Created Successfully!
          </p>
          <div className="mt-2 text-xs space-y-1 font-medium text-emerald-700">
            <p>Name: <span className="font-semibold text-slate-900">{newCustomerInfo.name}</span></p>
            <p>Account ID: <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-900">{newCustomerInfo.id}</code></p>
          </div>
        </div>
      )}

    </div>
  </div>
);

}
