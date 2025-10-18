import { type NexusEvent, type NexusEventType } from "../types/nexus";

interface LogEntry {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  event?: NexusEvent;
}

class NexusLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  log(level: LogEntry['level'], message: string, data?: any, event?: NexusEvent) {
    const logEntry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      data,
      event,
    };

    this.logs.push(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = level === 'error' ? 'error' : 
                           level === 'warn' ? 'warn' : 
                           level === 'debug' ? 'debug' : 'log';
      
      console[consoleMethod](`[Nexus SDK] ${message}`, data || '', event || '');
    }
  }

  info(message: string, data?: any, event?: NexusEvent) {
    this.log('info', message, data, event);
  }

  warn(message: string, data?: any, event?: NexusEvent) {
    this.log('warn', message, data, event);
  }

  error(message: string, data?: any, event?: NexusEvent) {
    this.log('error', message, data, event);
  }

  debug(message: string, data?: any, event?: NexusEvent) {
    this.log('debug', message, data, event);
  }

  logEvent(event: NexusEvent) {
    const level = event.type.includes('FAILED') ? 'error' :
                  event.type.includes('COMPLETED') || event.type.includes('CONNECTED') ? 'info' :
                  'debug';
    
    this.log(level, `Nexus Event: ${event.type}`, event.data, event);
  }

  getLogs(level?: LogEntry['level'], limit?: number): LogEntry[] {
    let filteredLogs = level ? this.logs.filter(log => log.level === level) : this.logs;
    
    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }
    
    return filteredLogs;
  }

  getLogsByTimeRange(startTime: number, endTime: number): LogEntry[] {
    return this.logs.filter(log => 
      log.timestamp >= startTime && log.timestamp <= endTime
    );
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  getStats() {
    const levels = this.logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalLogs: this.logs.length,
      levels,
      oldestLog: this.logs[0]?.timestamp,
      newestLog: this.logs[this.logs.length - 1]?.timestamp,
    };
  }
}

// Export singleton instance
export const nexusLogger = new NexusLogger();
