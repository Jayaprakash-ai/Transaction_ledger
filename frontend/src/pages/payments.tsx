import { useState, useEffect } from "react";
import { sendPayment, getTransactionsByCustomer } from "../services/payments";
import { getCustomers } from "../services/customers";

export default function PaymentsPage() {
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userBalance, setUserBalance] = useState<number | null>(null);

  const fetchCurrentBalance = async (customerId: string) => {
    try {
      const allCustomers = await getCustomers();
      const currentMe = allCustomers.find((c: any) => c.customer_id === customerId);
      if (currentMe) {
        setUserBalance(currentMe.balance);
      }
    } catch (error) {
      console.error("Failed to sync balance:", error);
    }
  };

  useEffect(() => {
    try {
      const sessionData = sessionStorage.getItem("userSession");
      if (sessionData) {
        const loggedInUser = JSON.parse(sessionData);
        const customerId = loggedInUser.customer_id;
        if (customerId) {
          setSenderId(customerId);
        }
      }
    } catch (error) {
      console.error("Session retrieval fault:", error);
    }
  }, []);

  const handleSend = async () => {
    const transferAmount = Number(amount);

    if (!receiverId.trim()) {
      alert("Please enter a valid Receiver Customer ID.");
      return;
    }
    if (!amount || amount.trim() === "") {
      alert("Please enter a transaction amount.");
      return;
    }
    if (isNaN(transferAmount) || transferAmount <= 0) {
      alert("❌ Invalid amount. Transfer values must be greater than zero.");
      return;
    }

    try {
      await sendPayment(senderId, receiverId.trim(), transferAmount);
      alert("✅ Transaction successful!");
      setReceiverId("");
      setAmount("");
      fetchTransactions(senderId);     
      fetchCurrentBalance(senderId);   
    } catch (error: any) {
      alert(error.response?.data?.detail || "Transaction failed");
    }
  };

  const fetchTransactions = async (id: string) => {
    if (!id || id.trim() === "") {
      alert("Please log in with a valid Customer ID to view history.");
      return;
    }
    try {
      const data = await getTransactionsByCustomer(id);
      if (Array.isArray(data)) {
        setTransactions(data);
      } else if (data && typeof data === "object") {
        const sent = data.sent || data.sentTx || [];
        const received = data.received || data.recieved || data.receivedTx || [];
        setTransactions([...sent, ...received]);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ledger Operations</h1>
        <p className="text-xs text-slate-500 mt-1">Execute secure inter-account fund transfers and track history.</p>
      </div>

      
      {userBalance !== null && (
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between text-indigo-900 animate-fadeIn">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">Remaining Wallet Balance</span>
            <span className="text-2xl font-black font-mono tracking-tight mt-0.5 block">
              ₹{userBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-3xl select-none">💳</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Execute Transfer</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Sender ID</label>
            <input
              value={senderId}
              disabled
              className="w-full border border-slate-200 bg-slate-50 text-slate-400 font-mono text-xs rounded-lg p-2.5 cursor-not-allowed outline-none font-bold"
              placeholder="Your Session ID"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Receiver ID *</label>
            <input
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              placeholder="CUST-XXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Amount (₹) *</label>
            <input
              type="number"
              min="0"
              onKeyDown={(e) =>{
                if (e.key==="-" || e.key==="e" || e.key==="E"){
                  e.preventDefault();
                }
              }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6 border-t border-slate-100 pt-4">
          <button 
            onClick={handleSend} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            🚀 Send Fund Transfer
          </button>
          
          <button 
            onClick={() => {
              fetchTransactions(senderId);
              fetchCurrentBalance(senderId);
            }} 
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            🔍 View My Transactions
          </button>
        </div>
      </div>

      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-700 tracking-tight">Ledger Logs History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4 font-semibold">Receipt ID</th>
                <th className="p-4 font-semibold">Sender Account</th>
                <th className="p-4 font-semibold">Receiver Account</th>
                <th className="p-4 font-semibold text-right">Amount</th>
                <th className="p-4 font-semibold text-right">Transaction Time</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium font-mono">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-sans font-medium">
                    No active transactional history records loaded in session. Click "View My Transactions" to sync query.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="className=p-4 text-slate-900 font-bold text-indigo-600">{t.id}</td>
                    <td className="p-4 text-slate-500">{t.sender_id || t.senderId}</td>
                    <td className="p-4 text-indigo-600 font-bold">{t.receiver_id || t.receiverId}</td>
                    <td className="p-4 text-right text-slate-900 font-bold text-sm">
                      ₹{Number(t.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right text-slate-400 font-sans">
                      {t.timestamp ? new Date(t.timestamp).toLocaleString("en-IN") : "Pending"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
