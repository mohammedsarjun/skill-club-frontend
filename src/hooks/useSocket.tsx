'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // const getAccessToken = () => {
    //   if (typeof document !== 'undefined') {
    //     const cookies = document.cookie.split('; ');
    //     const tokenCookie = cookies.find(row => row.startsWith('accessToken='));
    //     return tokenCookie ? tokenCookie.split('=')[1] : null;
    //   }
    //   return null;
    // };

    // const accessToken = getAccessToken();
    
    // if (!accessToken) {
    //   return;
    // }

const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_URL , {
  withCredentials: true,
});


    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socketInstance.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

