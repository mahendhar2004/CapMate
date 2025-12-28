import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { processImage } from '../utils/image';
import { listingApi } from '../api/client';

const listingSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.number().positive(),
    category: z.string(),
    condition: z.string(),
    visibilityMode: z.enum(['PUBLIC', 'ANONYMOUS']),
});

type ListingFormData = z.infer<typeof listingSchema>;

export const CreateListingScreen = ({ navigation }: any) => {
    const [images, setImages] = useState<string[]>([]);
    const { control, handleSubmit, formState: { errors } } = useForm<ListingFormData>({
        resolver: zodResolver(listingSchema),
        defaultValues: { visibilityMode: 'PUBLIC', condition: 'New', category: 'General' },
    });

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const processedUri = await processImage(result.assets[0].uri);
            setImages([...images, processedUri]);
        }
    };

    const onSubmit = async (data: ListingFormData) => {
        try {
            const uploadedImageKeys = [];
            for (const uri of images) {
                // 1. Get Presigned URL
                const { data: { url, key } } = await listingApi.getPresignedUrl('image/jpeg');
                // 2. Upload to S3
                await listingApi.uploadToS3(url, uri, 'image/jpeg');
                uploadedImageKeys.push(key);
            }

            // 3. Create Listing
            await listingApi.create({ ...data, images: uploadedImageKeys });
            Alert.alert('Success', 'Listing created!');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', 'Failed to create listing');
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Listing</Text>

            <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput style={styles.input} placeholder="Title" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
            />

            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput style={styles.input} placeholder="Description" onBlur={onBlur} onChangeText={onChange} value={value} multiline />
                )}
            />

            <Controller
                control={control}
                name="price"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Price"
                        onBlur={onBlur}
                        onChangeText={(t) => onChange(parseFloat(t))}
                        value={value ? value.toString() : ''}
                        keyboardType="numeric"
                    />
                )}
            />

            <Button title="Add Image" onPress={pickImage} />
            <View style={styles.imageContainer}>
                {images.map((uri, index) => (
                    <Image key={index} source={{ uri }} style={styles.image} />
                ))}
            </View>

            <Button title="Create Listing" onPress={handleSubmit(onSubmit)} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
    imageContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 },
    image: { width: 100, height: 100, marginRight: 10, marginBottom: 10 },
});
