import { useState, useEffect } from "react";
import { getCustomers } from "../services/customers";

interface UserProfile {
  name: string;
  email: string;
  customer_id: string;
  balance: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 1. Read active user info from sessionStorage (populated by login page)
        const sessionData = sessionStorage.getItem("userSession");
        
        if (!sessionData) {
          setLoading(false);
          return;
        }

        const loggedInUser = JSON.parse(sessionData);
        const currentId = loggedInUser.customer_id;

        if (currentId) {
          // 2. Query your backend to fetch up-to-date account metrics
          const allCustomers = await getCustomers();
          const freshData = allCustomers.find((c: any) => c.customer_id === currentId);
          
          if (freshData) {
            setProfile({
              name: freshData.name,
              email: freshData.email,
              customer_id: freshData.customer_id,
              balance: freshData.balance,
            });
          }
        }
      } catch (error) {
        console.error("Failed to load profile settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500 font-medium">Loading your profile data...</div>;
  }

  if (!profile) {
    return (
      <div className="p-6 max-w-md mx-auto mt-10 bg-red-50 border border-red-200 text-red-700 rounded-md">
        ⚠️ No active user session found. Please head back to the login page to authenticate.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Details</h1>
      
    
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
            <p className="text-base font-medium text-gray-900 mt-0.5">{profile.name}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
            <p className="text-base font-medium text-gray-900 mt-0.5">{profile.email || "No email provided"}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Unique Customer ID:</label>
            <code className="inline-block bg-gray-100 font-mono text-sm px-2 py-1 rounded text-gray-800 border mt-1 font-bold">
              {profile.customer_id}
            </code>
          </div>
        </div>
      </div>

      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Wallet Insight</h2>
        <p className="text-sm text-blue-700 mb-4">Your current available account balance tracked in the master ledger:</p>
        <div className="text-3xl font-bold text-blue-900">
          ₹{profile.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}
