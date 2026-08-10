import api from "./api";
 
export const getCustomers = async() =>{
    const response = await api.get("/customers/");
    return response.data;
};

export const createCustomer = async (customer:{ name: string; email: string; balance: number;customer_id:string})=>{
    const response = await api.post("/customers/",customer);
    return response.data;
};

