'use client';

import { useEffect } from 'react';
import { pusherBeamsService } from '@/lib/pusherBeams';
import { useAuth } from '@/contexts/AuthContext';

export const usePusherBeams = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only initialize for authenticated admin users
    if (isAuthenticated && user?.role === 'admin') {
      console.log('Initializing Pusher Beams for admin user:', user.id);

      // Initialize and start Pusher Beams
      pusherBeamsService.startBeams(user.id.toString());
    }

    // Cleanup on unmount or when user logs out
    return () => {
      if (!isAuthenticated || user?.role !== 'admin') {
        pusherBeamsService.stopBeams();
      }
    };
  }, [isAuthenticated, user]);

  return {
    subscribeToInterest: pusherBeamsService.subscribeToInterest.bind(pusherBeamsService),
    unsubscribeFromInterest: pusherBeamsService.unsubscribeFromInterest.bind(pusherBeamsService),
    getDeviceInterests: pusherBeamsService.getDeviceInterests.bind(pusherBeamsService),
    clearAllInterests: pusherBeamsService.clearAllInterests.bind(pusherBeamsService),
    requestNotificationPermission: pusherBeamsService.requestNotificationPermission.bind(pusherBeamsService),
    startBeams: pusherBeamsService.startBeams.bind(pusherBeamsService),
  };
};