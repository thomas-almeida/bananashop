import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/app/types/Product';

type Step = 1 | 2 | 3

interface StoreData {
    storeName: string;
    description: string;
    instagram: string;
    whatsapp: string;
    logo?: string;
}

interface ProductsData {
    csvFile: File | null;
    products: Product[];
}

interface BankingData {
    taxID: string;
    pixKey: string;
    rate: string;
}

interface OnboardingState {
    step: Step;
    store: StoreData;
    products: ProductsData;
    banking: BankingData;
    setStep: (step: Step) => void;
    setStore: (store: StoreData) => void;
    setProducts: (products: ProductsData) => void;
    setBanking: (banking: BankingData) => void;
    reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            step: 1,
            store: { storeName: "", description: "", instagram: "", whatsapp: "" },
            products: { csvFile: null, products: [] },
            banking: { taxID: "", pixKey: "", rate: 'IMEDIATO', simulationValue: 0 },
            setStep: (step) => set({ step }),
            setStore: (data) => set((state) => ({ store: { ...state.store, ...data } })),
            setProducts: (data) => set((state) => ({ products: { ...state.products, ...data } })),
            setBanking: (data) => set((state) => ({ banking: { ...state.banking, ...data } })),
            reset: () =>
                set({
                    step: 1,
                    store: { storeName: "", description: "", instagram: "", whatsapp: "", logo: "" },
                    products: { csvFile: null, products: [] },
                    banking: { taxID: "", pixKey: "", rate: 'IMEDIATO' },
                }),
        }),
        { name: "onboarding-storage" }
    )
);