import React from 'react';
import { View, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  style?: ViewStyle;
};

export function Screen({ children, scroll, contentStyle, style }: Props) {
  const insets = useSafeAreaInsets();

  if (scroll) {
    return (
      <SafeAreaView style={[{ flex: 1 }, style]} edges={['top']}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[{ paddingBottom: insets.bottom + 16 }, contentStyle]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[{ flex: 1}, style]}
      edges={['top']}
    >
      {children}
    </SafeAreaView>
  );
}
