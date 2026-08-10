import api from "./api";

export const sendPayment = async (senderId: string, receiverId: string, amount: number) => {
  const response = await api.post("/payments/send", {
    sender_id: senderId,
    receiver_id: receiverId,
    amount: amount
  });
  return response.data;
};

export const getTransactionsByCustomer = async (customerId: string) => {
  const response = await api.get(`/payments/history/${customerId}`);
  return response.data;
};