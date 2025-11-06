import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL;

interface UploadResponse {
  message: string;
  imageUrl: string;
  // Add other fields that your backend returns
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post<UploadResponse>(
      `${BASE_URL}/upload-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
