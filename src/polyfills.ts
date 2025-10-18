import { Buffer } from 'buffer';

// Make Buffer available globally for Nexus SDK
(window as any).Buffer = Buffer;
(window as any).global = window;
(window as any).process = (window as any).process || { env: {} };

export {};

