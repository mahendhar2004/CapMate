import React, { useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '../api/client';

const verifySchema = z.object({
    email: z.string().email(),
    code: z.string().min(6, 'Code must be 6 characters'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export const VerifyEmailScreen = ({ route, navigation }: any) => {
    const { email } = route.params || {};

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<VerifyFormData>({
        resolver: zodResolver(verifySchema),
        defaultValues: { email: email || '' },
    });

    useEffect(() => {
        if (email) setValue('email', email);
    }, [email, setValue]);

    const onSubmit = async (data: VerifyFormData) => {
        try {
            await authApi.verifyEmail(data);
            Alert.alert('Success', 'Email verified. You can now login.');
            navigation.navigate('Login');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify Email</Text>

            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                    />
                )}
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            <Controller
                control={control}
                name="code"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Verification Code"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="number-pad"
                    />
                )}
            />
            {errors.code && <Text style={styles.error}>{errors.code.message}</Text>}

            <Button title="Verify" onPress={handleSubmit(onSubmit)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
    error: { color: 'red', marginBottom: 10 },
});
