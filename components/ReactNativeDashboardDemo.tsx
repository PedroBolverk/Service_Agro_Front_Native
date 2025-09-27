import React, { useState } from 'react';
import { MechanicDashboardWebNative } from './MechanicDashboardWebNative';
import { ProducerDashboardWebNative } from './ProducerDashboardWebNative';

export function ReactNativeDashboardDemo() {
  const [currentDashboard, setCurrentDashboard] = useState<'mechanic' | 'producer'>('producer');

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation Toggle */}
      <div style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 1000,
        display: 'flex',
        gap: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 8,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <button
          onClick={() => setCurrentDashboard('producer')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: currentDashboard === 'producer' ? '#3b82f6' : 'transparent',
            color: currentDashboard === 'producer' ? 'white' : '#6b7280',
            fontWeight: currentDashboard === 'producer' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          🌾 Produtor
        </button>
        <button
          onClick={() => setCurrentDashboard('mechanic')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: currentDashboard === 'mechanic' ? '#3b82f6' : 'transparent',
            color: currentDashboard === 'mechanic' ? 'white' : '#6b7280',
            fontWeight: currentDashboard === 'mechanic' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          🔧 Mecânico
        </button>
      </div>

      {/* Dashboard Content */}
      <div style={{ 
        flex: 1,
        width: '100%',
        overflow: 'auto'
      }}>
        {currentDashboard === 'producer' ? (
          <ProducerDashboardWebNative />
        ) : (
          <MechanicDashboardWebNative />
        )}
      </div>

      {/* Info Footer */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px 16px',
        borderRadius: 8,
        fontSize: 12,
        maxWidth: 280,
        zIndex: 1000
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
          📱 React Native Dashboards
        </div>
        <div style={{ opacity: 0.9 }}>
          Dashboards criados com componentes nativos do React Native (View, Text, ScrollView, TouchableOpacity)
        </div>
      </div>
    </div>
  );
}