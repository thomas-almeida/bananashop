"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { storeSchema } from "../schemas/onboardingSchema";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { z } from "zod";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Input from "../../components/form/Input";
import Button from "../../components/form/Button";
import { FileImage, ShoppingBag, Instagram, MessageCircle } from "lucide-react";
import { useState } from "react";
//services
import { createStore, updateStore } from "@/app/service/storeService";
import { uploadImage } from "@/app/service/uploadService";

type StoreFormData = z.infer<typeof storeSchema>;

export default function StepStoreData() {
  const { store, setStore, setStep } = useOnboardingStore();
  const [fetching, setFetching] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: store,
  });

  const logo = watch("logo");

  // Converter imagem para Base64 e salvar no Zustand
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setValue("logo", base64);
          setStore({ ...store, logo: base64 });
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue, setStore]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const { data: session } = useSession();

  const onSubmit = async (data: StoreFormData) => {

    setFetching(true)

    if (!session?.user?.id) {
      console.error('No user session found');
      return;
    }

    try {
      let imageUrl = '';

      if (logo) {
        // Se o logo for uma string base64, converter para File
        let fileToUpload: File;

        if (typeof logo === 'string' && logo.startsWith('data:image')) {
          const response = await fetch(logo);
          const blob = await response.blob();
          fileToUpload = new File([blob], 'store-logo.jpg', { type: 'image/jpeg' });
        } else if (logo instanceof File) {
          fileToUpload = logo;
        } else {
          throw new Error('Formato de imagem não suportado');
        }

        const uploadResponse = await uploadImage(fileToUpload);
        imageUrl = uploadResponse.imageUrl;
      }

      // Criar a loja com os dados e a URL da imagem
      await createStore(session.user.id, {
        name: data.storeName,
        description: data.description,
        igNickname: data.instagram,
        whatsappNumber: data.whatsapp,
        image: imageUrl
      });

      // Atualizar o estado local
      setStore({
        ...data,
        logo: imageUrl || data.logo
      });

      // Ir para o próximo passo
      setStep(2);
    } catch (error) {
      console.error('Failed to create store:', error);
      setFetching(false)
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Traga a sua loja!</h2>
        <p className="text-sm text-gray-500">
          Estamos muito felizes de ter você aqui. Preencha algumas informações
          para começarmos sua loja.
        </p>
      </div>

      <Input
        placeholder="bananashop"
        register={register("storeName")}
        errors={errors.storeName}
        type="text"
        label="Nome da loja"
        className={errors.storeName ? "border-red-500" : ""}
        icon={<ShoppingBag size={20} />}
      />

      <Input
        placeholder="Loja de softwares sob demanda"
        register={register("description")}
        errors={errors.description}
        type="text"
        label="Descrição da loja"
        className={errors.description ? "border-red-500" : ""}
      />

      <Input
        placeholder="bananashop"
        register={register("instagram")}
        errors={errors.instagram}
        type="text"
        label="Instagram da Loja"
        className={errors.instagram ? "border-red-500" : ""}
        icon={<Instagram size={20} />}
      />

      <Input
        placeholder="(00) 0000-0000"
        register={register("whatsapp")}
        errors={errors.whatsapp}
        type="text"
        label="Whatsapp do responsável"
        className={errors.whatsapp ? "border-red-500" : ""}
        icon={<MessageCircle size={20} />}
      />

      {/* Upload da logo */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
          ${isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"}`}
      >
        <input {...getInputProps()} />
        {logo ? (
          <img
            src={logo}
            alt="Logo preview"
            className="mx-auto w-24 h-24 object-cover rounded-full"
          />
        ) : (
          <div className="text-gray-500 text-sm flex flex-col justify-center items-center">
            <FileImage size={24} />
            <span className="block font-bold">Logo da sua loja</span>
            <p>Arraste ou clique para enviar</p>
          </div>
        )}
      </div>

      <Button
        type="submit"
        text={fetching ? "Aguarde..." : "Continuar"}
        color="primary"
        loading={fetching}
      />

    </form>
  );
}
