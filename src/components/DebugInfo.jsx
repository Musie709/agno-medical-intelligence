import React from 'react';

const DebugInfo = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const hasUrl = !!supabaseUrl;
  const hasKey = !!supabaseAnonKey;
  const keyLength = supabaseAnonKey ? supabaseAnonKey.length : 0;
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div>🔧 Debug Info:</div>
      <div>URL: {hasUrl ? '✅' : '❌'} {hasUrl ? 'Set' : 'Missing'}</div>
      <div>Key: {hasKey ? '✅' : '❌'} {hasKey ? `Set (${keyLength} chars)` : 'Missing'}</div>
      <div>Env: {import.meta.env.MODE}</div>
    </div>
  );
};

export default DebugInfo; 