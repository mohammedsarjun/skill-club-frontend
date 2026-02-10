'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSocket } from './useSocket';
import { INotification } from '@/types/interfaces/INotification';

const NOTIFICATION_SOUND_URL = '/audios/notification-sound-1.mp3';;

interface UseNotificationOptions {
  onNotification?: (notification: INotification) => void;
}

export const useNotification = (options?: UseNotificationOptions) => {
  const { socket } = useSocket();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [latestNotification, setLatestNotification] = useState<INotification | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
      audioRef.current.volume = 0.5;
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: INotification) => {
      setLatestNotification(notification);
      playNotificationSound();
      options?.onNotification?.(notification);
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, playNotificationSound, options]);

  return {
    latestNotification,
    playNotificationSound,
  };
};
