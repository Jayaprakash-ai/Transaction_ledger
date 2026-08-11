import axios from "axios";
 
const api=axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://transaction-ledger-api.onrender.com"
});

export default api;