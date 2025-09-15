'use client';

import { Client } from '@pusher/push-notifications-web';

// Pusher Beams configuration
const PUSHER_BEAMS_INSTANCE_ID = process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID;

class PusherBeamsService {
  private beamsClient: Client | null = null;
  private initialized = false;

  // Initialize Pusher Beams client
  init() {
    if (typeof window === 'undefined' || this.initialized) {
      return;
    }

    if (!PUSHER_BEAMS_INSTANCE_ID) {
      console.warn('Pusher Beams Instance ID is not configured');
      return;
    }

    try {
      this.beamsClient = new Client({
        instanceId: PUSHER_BEAMS_INSTANCE_ID,
      });
      this.initialized = true;
      console.log('Pusher Beams initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Pusher Beams:', error);
    }
  }

  // Request notification permission from user
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification permissions denied by user');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
        return true;
      } else {
        console.warn('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Start Pusher Beams and subscribe to admin notifications
  async startBeams(userId?: string) {
    if (!this.beamsClient) {
      this.init();
    }

    if (!this.beamsClient) {
      console.error('Pusher Beams client not initialized');
      return;
    }

    try {
      // First request notification permission
      const hasPermission = await this.requestNotificationPermission();

      if (!hasPermission) {
        console.warn('Cannot start Pusher Beams without notification permission');
        return;
      }

      // Start the service
      await this.beamsClient.start();
      console.log('Pusher Beams started successfully');

      // Subscribe to general admin notifications
      await this.beamsClient.addDeviceInterest('admin-notifications');
      console.log('Subscribed to admin-notifications');

      // Subscribe to user-specific notifications if userId is provided
      if (userId) {
        await this.beamsClient.addDeviceInterest(`admin-user-${userId}`);
        console.log(`Subscribed to admin-user-${userId}`);
      }

      // Get device interests
      const interests = this.beamsClient.getDeviceInterests();
      console.log('Current device interests:', interests);

      // Show a test notification to confirm it's working
      this.showTestNotification();

    } catch (error) {
      console.error('Failed to start Pusher Beams:', error);
    }
  }

  // Show a test notification to confirm permissions are working
  private showTestNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('LifeConnect Admin', {
        body: 'Push notifications are now enabled for admin updates!',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'welcome-notification'
      });
    }
  }

  // Stop Pusher Beams
  async stopBeams() {
    if (!this.beamsClient) {
      return;
    }

    try {
      await this.beamsClient.stop();
      console.log('Pusher Beams stopped');
    } catch (error) {
      console.error('Failed to stop Pusher Beams:', error);
    }
  }

  // Clear all device interests
  async clearAllInterests() {
    if (!this.beamsClient) {
      return;
    }

    try {
      await this.beamsClient.clearDeviceInterests();
      console.log('All device interests cleared');
    } catch (error) {
      console.error('Failed to clear device interests:', error);
    }
  }

  // Subscribe to a specific interest
  async subscribeToInterest(interest: string) {
    if (!this.beamsClient) {
      console.error('Pusher Beams client not initialized');
      return;
    }

    try {
      await this.beamsClient.addDeviceInterest(interest);
      console.log(`Subscribed to interest: ${interest}`);
    } catch (error) {
      console.error(`Failed to subscribe to interest ${interest}:`, error);
    }
  }

  // Unsubscribe from a specific interest
  async unsubscribeFromInterest(interest: string) {
    if (!this.beamsClient) {
      console.error('Pusher Beams client not initialized');
      return;
    }

    try {
      await this.beamsClient.removeDeviceInterest(interest);
      console.log(`Unsubscribed from interest: ${interest}`);
    } catch (error) {
      console.error(`Failed to unsubscribe from interest ${interest}:`, error);
    }
  }

  // Get current device interests
  getDeviceInterests() {
    if (!this.beamsClient) {
      return [];
    }
    return this.beamsClient.getDeviceInterests();
  }
}

// Export singleton instance
export const pusherBeamsService = new PusherBeamsService();