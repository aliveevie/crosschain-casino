import React, { useState, useEffect } from "react";
import { useNexusEvents } from "../hooks/useNexusEvents";
import { NEXUS_CONSTANTS } from "../constants/nexusConstants";

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: number;
}

export function NexusNotification() {
  const { getLatestEvent, events } = useNexusEvents();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (events.length === 0) return;

    const latestEvent = getLatestEvent();
    if (!latestEvent) return;

    let notification: Notification | null = null;

    switch (latestEvent.type) {
      case 'WALLET_CONNECTED':
        notification = {
          id: `wallet_connected_${latestEvent.timestamp}`,
          type: 'success',
          title: 'Wallet Connected',
          message: NEXUS_CONSTANTS.SUCCESS_MESSAGES.WALLET_CONNECTED,
          timestamp: latestEvent.timestamp,
        };
        break;

      case 'WALLET_DISCONNECTED':
        notification = {
          id: `wallet_disconnected_${latestEvent.timestamp}`,
          type: 'warning',
          title: 'Wallet Disconnected',
          message: 'Your wallet has been disconnected',
          timestamp: latestEvent.timestamp,
        };
        break;

      case 'TRANSACTION_COMPLETED':
        notification = {
          id: `tx_completed_${latestEvent.timestamp}`,
          type: 'success',
          title: 'Transaction Successful',
          message: NEXUS_CONSTANTS.SUCCESS_MESSAGES.TRANSACTION_SUCCESS,
          timestamp: latestEvent.timestamp,
        };
        break;

      case 'TRANSACTION_FAILED':
        notification = {
          id: `tx_failed_${latestEvent.timestamp}`,
          type: 'error',
          title: 'Transaction Failed',
          message: NEXUS_CONSTANTS.ERROR_MESSAGES.TRANSACTION_FAILED,
          timestamp: latestEvent.timestamp,
        };
        break;

      case 'BRIDGE_COMPLETED':
        notification = {
          id: `bridge_completed_${latestEvent.timestamp}`,
          type: 'success',
          title: 'Bridge Successful',
          message: NEXUS_CONSTANTS.SUCCESS_MESSAGES.BRIDGE_SUCCESS,
          timestamp: latestEvent.timestamp,
        };
        break;

      case 'BRIDGE_FAILED':
        notification = {
          id: `bridge_failed_${latestEvent.timestamp}`,
          type: 'error',
          title: 'Bridge Failed',
          message: NEXUS_CONSTANTS.ERROR_MESSAGES.BRIDGE_FAILED,
          timestamp: latestEvent.timestamp,
        };
        break;

      case 'CHAIN_CHANGED':
        notification = {
          id: `chain_changed_${latestEvent.timestamp}`,
          type: 'info',
          title: 'Network Changed',
          message: NEXUS_CONSTANTS.SUCCESS_MESSAGES.CHAIN_SWITCHED,
          timestamp: latestEvent.timestamp,
        };
        break;
    }

    if (notification) {
      setNotifications(prev => [notification!, ...prev.slice(0, 4)]); // Keep last 5 notifications
    }
  }, [events, getLatestEvent]);

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    const timers = notifications.map(notification => 
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, NEXUS_CONSTANTS.UI.NOTIFICATION_DURATION)
    );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500 bg-green-500/20';
      case 'error': return 'border-red-500 bg-red-500/20';
      case 'warning': return 'border-yellow-500 bg-yellow-500/20';
      case 'info': return 'border-blue-500 bg-blue-500/20';
      default: return 'border-gray-500 bg-gray-500/20';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border backdrop-blur-sm max-w-sm transition-all duration-300 ${getNotificationColor(notification.type)}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm">
                {notification.title}
              </h4>
              <p className="text-gray-200 text-xs mt-1">
                {notification.message}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="text-gray-400 hover:text-white text-lg flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
