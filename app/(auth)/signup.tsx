import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../src/store/auth';

type Role = 'PRODUCER' | 'MECHANIC';

export default function Signup() { // 👈 default export obrigatório
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('Novo Usuário');
  const [email, setEmail] = useState('novo@teste.com');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState<Role>('PRODUCER');
  const [mechanicSpecialty, setMechanicSpecialty] = useState('Colheitadeira');
  const [loading, setLoading] = useState(false);

  const RoleChip = ({ value, label }: { value: Role; label: string }) => {
    const active = role === value;
    return (
      <Pressable
        onPress={() => setRole(value)}
        style={{
          paddingVertical:8, paddingHorizontal:12, borderRadius:999,
          borderWidth:1, borderColor: active ? '#0a84ff' : '#ccc',
          backgroundColor: active ? '#e6f0ff' : '#fff', marginRight:8
        }}
      >
        <Text style={{ color: active ? '#0a84ff' : '#333' }}>{label}</Text>
      </Pressable>
    );
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      await signUp({
        email: email.trim(),
        password,
        fullName,
        role,
        mechanicSpecialty: role === 'MECHANIC' ? mechanicSpecialty : undefined,
      });
      // após signUp, o signIn é chamado e o guard redireciona por role
    } catch (e: any) {
      Alert.alert('Erro ao cadastrar', e?.message || 'Tente novamente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, padding:16, gap:12, justifyContent:'center' }}>
      <Text style={{ fontSize:20, fontWeight:'600' }}>Criar conta</Text>

      <TextInput
        placeholder="Nome completo"
        value={fullName}
        onChangeText={setFullName}
        style={{ borderWidth:1, borderColor:'#ccc', padding:10, borderRadius:8 }}
      />

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth:1, borderColor:'#ccc', padding:10, borderRadius:8 }}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth:1, borderColor:'#ccc', padding:10, borderRadius:8 }}
      />

      <View style={{ flexDirection:'row', alignItems:'center', marginTop:4 }}>
        <RoleChip value="PRODUCER" label="Produtor" />
        <RoleChip value="MECHANIC" label="Mecânico" />
      </View>

      {role === 'MECHANIC' && (
        <TextInput
          placeholder="Especialidade (ex.: Colheitadeira)"
          value={mechanicSpecialty}
          onChangeText={setMechanicSpecialty}
          style={{ borderWidth:1, borderColor:'#ccc', padding:10, borderRadius:8 }}
        />
      )}

      <Button title={loading ? 'Cadastrando...' : 'Cadastrar'} onPress={onSubmit} disabled={loading} />

      <View style={{ marginTop:12 }}>
        <Link href="/login">Já tenho conta</Link>
      </View>
    </View>
  );
}
