'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { storeSchema } from '@/app/onboarding/schemas/onboardingSchema';
import { updateStore } from '@/app/service/storeService';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { FileImage, X } from 'lucide-react';
import Input from '../../components/form/Input';
import Button from '../../components/form/Button';
import { uploadImage } from '@/app/service/uploadService';

type StoreForm = z.infer<typeof storeSchema>;

export default function StoreSettings({ storeData, user }: { storeData: any, user: any }) {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<StoreForm>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            storeName: storeData?.name || '',
            description: storeData?.description || '',
            instagram: storeData?.igNickname || '',
            whatsapp: storeData?.whatsappNumber || '',
            logo: storeData?.image || '',
        },
    });

    const logo = watch('logo');

    useEffect(() => {
        if (storeData) {
            reset({
                storeName: storeData.name || '',
                description: storeData.description || '',
                instagram: storeData.igNickname || '',
                whatsapp: storeData.whatsappNumber || '',
                logo: storeData.image || '',
            });
            if (storeData.image) {
                setPreview(storeData.image);
            }
        }
    }, [storeData, reset]);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                setValue('logo', base64);
                setPreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 1,
    });

    const removeImage = () => {
        setValue('logo', '');
        setPreview(null);
    };

    console.log(user)

    const onSubmit = async (data: StoreForm) => {
        if (!session?.user?.id) return;

        setIsLoading(true);

        let imageUrl = ''

        if (logo) {
            const response = await fetch(logo);
            const blob = await response.blob();
            const fileToUpload = new File([blob], 'store-logo.jpg', { type: 'image/jpeg' });
            const uploadResponse = await uploadImage(fileToUpload);
            imageUrl = uploadResponse.imageUrl;
        }

        try {
            await updateStore(user?.store, {
                name: data.storeName,
                description: data.description,
                igNickname: data.instagram,
                whatsappNumber: data.whatsapp,
                image: imageUrl,
            });
            toast.success('Dados da loja atualizados com sucesso!');
        } catch (error) {
            console.error('Error updating store:', error);
            toast.error('Erro ao atualizar dados da loja');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Informações da Loja</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Logo da Loja
                        </label>
                        {preview ? (
                            <div className="relative w-40 h-40">
                                <img
                                    src={preview}
                                    alt="Logo da loja"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-1 text-sm text-gray-600">
                                    {isDragActive
                                        ? 'Solte a imagem aqui...'
                                        : 'Arraste uma imagem ou clique para selecionar'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (máx. 2MB)</p>
                            </div>
                        )}
                    </div>

                    <Input
                        label="Nome da Loja"
                        type="text"
                        placeholder="Nome da sua loja"
                        {...register('storeName')}
                    />

                    <Input
                        label="Instagram"
                        type="text"
                        placeholder="@sualoja"
                        {...register('instagram')}
                    />

                    <Input
                        label="WhatsApp"
                        type="text"
                        placeholder="(00) 00000-0000"
                        {...register('whatsapp')}
                    />

                    <div className="md:col-span-2">
                        <Input
                            label="Descrição da Loja"
                            type="textarea"
                            placeholder="Conte um pouco sobre sua loja..."
                            {...register('description')}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        text="Salvar Alterações"
                        isLoading={isLoading}
                        className="px-6"
                        color='primary'
                    />
                </div>
            </form>
        </div>
    );
}
