import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PaymentMethod {
  id: string;
  type: "VISA" | "MASTERCARD" | "AMEX" | "UPI";
  last4: string;
  expiry?: string;
  name: string;
  isDefault: boolean;
}

interface BillingState {
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, "id" | "isDefault">) => void;
  removePaymentMethod: (id: string) => void;
  setDefault: (id: string) => void;
}

export const useBilling = create<BillingState>()(
  persist(
    (set) => ({
      paymentMethods: [],
      addPaymentMethod: (method) => set((state) => {
        const isFirst = state.paymentMethods.length === 0;
        const newMethod: PaymentMethod = {
          ...method,
          id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          isDefault: isFirst,
        };
        return { paymentMethods: [...state.paymentMethods, newMethod] };
      }),
      removePaymentMethod: (id) => set((state) => {
        const filtered = state.paymentMethods.filter((m) => m.id !== id);
        // If we removed the default, make the first remaining one default
        if (state.paymentMethods.find((m) => m.id === id)?.isDefault && filtered.length > 0) {
          filtered[0].isDefault = true;
        }
        return { paymentMethods: filtered };
      }),
      setDefault: (id) => set((state) => ({
        paymentMethods: state.paymentMethods.map((m) => ({
          ...m,
          isDefault: m.id === id,
        })),
      })),
    }),
    {
      name: "cloudcart.billing",
    }
  )
);
