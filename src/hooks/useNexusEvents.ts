import { useEffect, useState } from "react";
import { type NexusEvent, type NexusEventType } from "../types/nexus";

/**
 * Hook for listening to Nexus SDK events
 */
export function useNexusEvents() {
  const [events, setEvents] = useState<NexusEvent[]>([]);

  useEffect(() => {
    const handleNexusEvent = (event: CustomEvent) => {
      const nexusEvent = event.detail as NexusEvent;
      setEvents(prev => [nexusEvent, ...prev.slice(0, 99)]); // Keep last 100 events
    };

    window.addEventListener('nexus-event', handleNexusEvent as EventListener);
    
    return () => {
      window.removeEventListener('nexus-event', handleNexusEvent as EventListener);
    };
  }, []);

  const getEventsByType = (type: NexusEventType) => {
    return events.filter(event => event.type === type);
  };

  const getLatestEvent = () => {
    return events[0] || null;
  };

  const getEventsByTimeRange = (startTime: number, endTime: number) => {
    return events.filter(event => 
      event.timestamp >= startTime && event.timestamp <= endTime
    );
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return {
    events,
    getEventsByType,
    getLatestEvent,
    getEventsByTimeRange,
    clearEvents,
    eventCount: events.length,
  };
}
