import React, { useState } from "react";
import { useNexusEvents } from "../hooks/useNexusEvents";
import { useNexusWalletContext } from "./NexusWalletProvider";
import { nexusLogger } from "../utils/nexusLogger";
import { NEXUS_CONSTANTS } from "../constants/nexusConstants";

export function NexusDebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'logs' | 'config'>('events');
  const { events, clearEvents } = useNexusEvents();
  const { isNexusReady, nexusError } = useNexusWalletContext();

  const logs = nexusLogger.getLogs();
  const stats = nexusLogger.getStats();

  const tabs = [
    { id: 'events', label: 'Events', count: events.length },
    { id: 'logs', label: 'Logs', count: logs.length },
    { id: 'config', label: 'Config', count: 0 },
  ] as const;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-lg transition-all border border-gray-600"
      >
        🔧 Debug Panel
      </button>
      
      {isExpanded && (
        <div className="absolute bottom-12 left-0 w-96 h-96 bg-gray-900 border border-gray-600 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-gray-600 bg-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Nexus SDK Debug</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-1 mt-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
          
          {/* Content */}
          <div className="h-80 overflow-y-auto p-3">
            {activeTab === 'events' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm font-medium">Recent Events</span>
                  <button
                    onClick={clearEvents}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Clear
                  </button>
                </div>
                {events.slice(0, 10).map((event, index) => (
                  <div key={index} className="bg-gray-800 rounded p-2 text-xs">
                    <div className="text-purple-400 font-medium">{event.type}</div>
                    <div className="text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                    {event.data && (
                      <div className="text-gray-300 mt-1 font-mono">
                        {JSON.stringify(event.data, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'logs' && (
              <div className="space-y-2">
                <div className="text-white text-sm font-medium mb-2">Log Statistics</div>
                <div className="bg-gray-800 rounded p-2 text-xs">
                  <div>Total Logs: {stats.totalLogs}</div>
                  <div>Levels: {JSON.stringify(stats.levels)}</div>
                </div>
                
                <div className="text-white text-sm font-medium mt-3">Recent Logs</div>
                {logs.slice(-10).map((log, index) => (
                  <div key={index} className="bg-gray-800 rounded p-2 text-xs">
                    <div className={`font-medium ${
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warn' ? 'text-yellow-400' :
                      log.level === 'info' ? 'text-blue-400' :
                      'text-gray-400'
                    }`}>
                      [{log.level.toUpperCase()}] {log.message}
                    </div>
                    <div className="text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'config' && (
              <div className="space-y-2">
                <div className="text-white text-sm font-medium mb-2">Configuration</div>
                <div className="bg-gray-800 rounded p-2 text-xs space-y-1">
                  <div>Nexus Ready: {isNexusReady ? '✅' : '❌'}</div>
                  <div>Error: {nexusError || 'None'}</div>
                  <div>Supported Chains: {Object.keys(NEXUS_CONSTANTS.CHAIN_IDS).length}</div>
                  <div>Timeout: {NEXUS_CONSTANTS.TIMEOUTS.TRANSACTION}ms</div>
                  <div>Retry Max: {NEXUS_CONSTANTS.RETRY.MAX_ATTEMPTS}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
