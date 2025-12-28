import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001');

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    register: (data: any) => apiClient.post('/register', data),
    verifyEmail: (data: any) => apiClient.post('/verify-email', data),
    login: (data: any) => apiClient.post('/login', data),
};

export const listingApi = {
    getPresignedUrl: (fileType: string) => apiClient.post('/listings/presigned-url', { fileType }),
    create: (data: any) => apiClient.post('/listings', data),
    uploadToS3: async (url: string, fileUri: string, fileType: string) => {
        const response = await fetch(fileUri);
        const blob = await response.blob();
        await fetch(url, {
            method: 'PUT',
            body: blob,
            headers: { 'Content-Type': fileType },
        });
    },
};

