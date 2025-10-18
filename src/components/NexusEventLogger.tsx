import React, { useState, useEffect } from "react";
import { type NexusEvent } from "../types/nexus";

export function NexusEventLogger() {
  const [events, setEvents] = useState<NexusEvent[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleNexusEvent = (event: CustomEvent) => {
      const nexusEvent = event.detail as NexusEvent;
      setEvents(prev => [nexusEvent, ...prev.slice(0, 49)]); // Keep last 50 events
    };

    window.addEventListener('nexus-event', handleNexusEvent as EventListener);
    
    return () => {
      window.removeEventListener('nexus-event', handleNexusEvent as EventListener);
    };
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'WALLET_CONNECTED': return '🔗';
      case 'WALLET_DISCONNECTED': return '🔌';
      case 'CHAIN_CHANGED': return '🔄';
      case 'TRANSACTION_STARTED': return '⏳';
      case 'TRANSACTION_COMPLETED': return '✅';
      case 'TRANSACTION_FAILED': return '❌';
      case 'BRIDGE_STARTED': return '🌉';
      case 'BRIDGE_COMPLETED': return '🎯';
      case 'BRIDGE_FAILED': return '💥';
      default: return '📝';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'WALLET_CONNECTED':
      case 'TRANSACTION_COMPLETED':
      case 'BRIDGE_COMPLETED': return 'text-green-400';
      case 'TRANSACTION_FAILED':
      case 'BRIDGE_FAILED':
      case 'WALLET_DISCONNECTED': return 'text-red-400';
      case 'CHAIN_CHANGED':
      case 'BRIDGE_STARTED': return 'text-blue-400';
      case 'TRANSACTION_STARTED': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-all"
      >
        📋 Nexus Events ({events.length})
      </button>
      
      {isExpanded && (
        <div className="w-96 max-h-96 bg-gray-900 border border-purple-500/50 rounded-lg shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-purple-500/30 bg-purple-600/20">
            <h3 className="text-white font-semibold">Nexus SDK Event Log</h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {events.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No events yet
              </div>
            ) : (
              <div className="space-y-1">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="p-2 border-b border-gray-700/50 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getEventIcon(event.type)}</span>
                      <span className={`text-sm font-medium ${getEventColor(event.type)}`}>
                        {event.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {event.data && (
                      <div className="mt-1 text-xs text-gray-400 font-mono">
                        {JSON.stringify(event.data, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-gray-700/50 bg-gray-800/50">
            <button
              onClick={() => setEvents([])}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Clear Events
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
