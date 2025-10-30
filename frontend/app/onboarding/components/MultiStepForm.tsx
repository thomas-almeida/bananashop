"use client";

import { useOnboardingStore } from "../store/useOnboardingStore";
import ProgressBar from "../../components/ui/ProgressBar";
import StepStoreData from "./StepStoreData";
import StepProducts from "./StepProducts";
import StepBanking from "./StepBanking";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function MultiStepForm() {
    const { step } = useOnboardingStore();

    return (
        <div className="max-w-md mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center text-center text-sm font-medium text-gray-600">
                <div>
                    <div className="flex justify-start items-center">
                        <h3 className="text-lg font-semibold">BananaShop</h3>
                        <Image
                            src={"/logo.png"}
                            alt="Logo"
                            width={45}
                            height={45}
                            className="p-0"
                        />
                    </div>
                </div>
                <div>
                    {step} de 3
                </div>
            </div>
            <ProgressBar />

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                >
                    {step === 1 && <StepStoreData />}
                    {step === 2 && <StepProducts />}
                    {step === 3 && <StepBanking />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
