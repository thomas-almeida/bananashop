"use client";

import { motion } from "framer-motion";
import { useOnboardingStore } from "../../onboarding/store/useOnboardingStore";

export default function ProgressBar() {
    const { step } = useOnboardingStore();
    const progress = (step / 3) * 100;

    return (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
                className="h-2 bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                    duration: 0.5,
                    ease: "easeOut",
                }}
            />
        </div>
    );
}
