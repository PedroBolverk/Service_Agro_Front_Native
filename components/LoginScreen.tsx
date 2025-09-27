import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1727037347365-2bff295c562b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGZhcm0lMjBlcXVpcG1lbnQlMjBsb2dvfGVufDF8fHx8MTc1ODU2NTAwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              }}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.logoText}>Service Agro</Text>
          <Text style={styles.subText}>Seu parceiro em serviços agrícolas</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <TouchableOpacity 
            onPress={onLogin}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Entrar no Aplicativo</Text>
          </TouchableOpacity>

          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>
              Gerencie seus serviços de forma simples e rápida
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f7f7f7', // ou qualquer cor que você queira
  },
  formContainer: {
    width: '100%',
    maxWidth: 320,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageWrapper: {
    marginBottom: 16,
  },
  logoImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    resizeMode: 'cover', // Faz a imagem preencher o espaço sem distorção
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4CAF50', // ou a cor que você deseja para o texto
  },
  subText: {
    fontSize: 14,
    color: '#6B7280', // cor de texto sutil
    textAlign: 'center',
  },
  form: {
    marginTop: 32,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  footerTextContainer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280', // cor de texto sutil
  },
});
