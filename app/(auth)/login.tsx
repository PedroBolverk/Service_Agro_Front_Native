// app/(auth)/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../src/store/auth';

export default function Login() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!email || !password) return alert('Informe email e senha');
        try {
            setLoading(true);
            await signIn(email.trim(), password);
        } catch (e: any) {
            alert(e?.message || 'Falha na conexão com o servidor');
        } finally {
            setLoading(false);
        }
    };



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Entrar</Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <TextInput
                placeholder="Senha"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
            </TouchableOpacity>

            <Link href="/signup" style={styles.link}>
                Não tem conta? Cadastrar
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 20, color: '#111', textAlign: 'center' },
    input: { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12, color: '#111' },
    button: { backgroundColor: '#0a84ff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 4 },
    buttonText: { color: '#fff', fontWeight: '600' },
    link: { marginTop: 16, textAlign: 'center', color: '#0a84ff' },
});
