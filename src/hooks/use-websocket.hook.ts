import { useCallback, useMemo, useRef, useState } from "react";

export default function useWebsocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [messageListeners, setMessageListeners] = useState<((message: MessageEvent) => void)[]>([]);
  const [errorListeners, setErrorListeners] = useState<((error: Event) => void)[]>([]);
  const wsRef = useRef<WebSocket>(null);
  
  const connect = useCallback((url: string) => {
    return new Promise<void>(resolve => {
      wsRef.current = new WebSocket(url);
      wsRef.current.onmessage = (message) => {
        messageListeners.forEach(listener => listener(message));
      }

      wsRef.current.onopen = () => {
        resolve();
      };
      wsRef.current.onerror = (err) => {
        errorListeners.forEach(listener => listener(err));
      };
      wsRef.current.onclose = () => {
        if(wsRef.current) {
          wsRef.current.onmessage = null;
          wsRef.current.onopen = null;
          wsRef.current.onerror = null;
          wsRef.current.onclose = null;
        }
        setIsConnected(false);
        wsRef.current = null;
      }

      setIsConnected(true);
    })
  }, [errorListeners, messageListeners]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
  }, []);

  const listenMessage = useMemo(() => (listener: (message: MessageEvent) => void) => {
    setMessageListeners((prev) => [...prev, listener]);
    return () => setMessageListeners((prev) => prev.splice(prev.indexOf(listener), 1) && prev);
  }, [])

  const listenError = useMemo(() => (listener: (error: Event) => void) => {
    setErrorListeners((prev) => [...prev, listener]);
    return () => setErrorListeners((prev) => prev.splice(prev.indexOf(listener), 1) && prev);
  }, [])

  const sendMessage = useCallback((message: Parameters<WebSocket['send']>[number]) => {
    wsRef.current?.send(message);
  }, [])

  return { isConnected, connect, disconnect, listenMessage, listenError, sendMessage };
}