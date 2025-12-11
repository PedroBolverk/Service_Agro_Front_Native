// src/config.ts
import { Platform } from 'react-native';

const LAN = 'http://192.168.0.73:3000';   // IP da sua máquina onde está o Docker
const ANDROID_EMULATOR = 'http://10.0.2.2:3000'; // Android AVD

export const API_HOST = Platform.select({
  android: LAN,  // AVD
  ios: LAN,                   // ✅ iPhone físico (e simulador também funciona)
  default: LAN,               // web / outros
});

