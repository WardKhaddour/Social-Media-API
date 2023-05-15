import { IncomingHttpHeaders } from 'http';

declare module 'http' {
  interface IncomingHttpHeaders {
    lang?: string;
    socketid?: string;
  }
}
