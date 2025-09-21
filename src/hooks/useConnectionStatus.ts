
// This is a simplified version that doesn't try to connect to Supabase

export type ConnectionStatus = 'checking' | 'connected' | 'error' | null;

export function useConnectionStatus() {
  // Always return connected status since we're not connecting to any backend
  return {
    isOnline: true,
    connectionStatus: 'connected' as ConnectionStatus,
    connectionRetries: 0,
    retryConnection: () => Promise.resolve(),
    checkConnection: () => Promise.resolve()
  };
}
