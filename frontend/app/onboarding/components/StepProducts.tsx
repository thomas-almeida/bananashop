"use client";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { FileSpreadsheet, PackagePlus } from "lucide-react";
import Button from "../../components/form/Button";

export default function StepProducts() {
    const { setStep, setProducts } = useOnboardingStore();

    const handleManual = () => {
        setProducts({ products: [], csvFile: null });
        setStep(3);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold">Traga seus produtos!</h2>
                <p className="text-sm text-gray-500">Você pode adicionar manualmente ou importar um CSV.</p>
            </div>

            <div
                onClick={handleManual}
                className="w-full h-48 border border-gray-300 shadow-md p-3 rounded-lg text-left hover:bg-gray-100 flex flex-col justify-end cursor-pointer"
            >
                <PackagePlus className="w-12 h-12" />
                <h3 className="font-semibold text-xl">Criar Manualmente</h3>
                <p className="text-sm text-gray-500">Adicione um a um com Nome, Preço, Descrição dentre outros dados para começar a vender</p>
            </div>

            <div
                onClick={handleManual}
                className="w-full h-48 border border-gray-300 shadow-md p-3 rounded-lg text-left hover:bg-gray-100 flex flex-col justify-end cursor-pointer"
            >
                <FileSpreadsheet className="w-12 h-12" />
                <div className="flex items-center justify-start gap-3 my-2">
                    <h3 className="font-semibold text-xl">Importar CSV</h3>
                    <div className="text-sm bg-green-500 text-white font-medium px-1 py-0.5 rounded w-fit">Mais Rápido</div>
                </div>
                <p className="text-sm text-gray-500">Envie um <b>arquivo CSV</b> com seus produtos todos juntos e ganhe mais tempo na hora de trazer seus produtos</p>
            </div>

            <h2 className="text-lg font-semibold flex justify-center">Ou</h2>

            <Button
                onClick={() => setStep(3)}
                text="Fazer isso depois"
                color="secondary"
            />
        </div>
    );
}
