// Client registry. To add a client:
//   1. copy _template.ts to <clientid>.ts and edit it
//   2. add one line to each of the two maps below
// The client is then live at /chat?client=<clientid>
import example from './example';

// Used by the API route (server side). Add every client here.
export const CLIENT_CONFIGS: Record<string, any> = {
  example,
};

// Used by the chat page (client side, lazy loaded). Add every client here too.
export const CLIENT_LOADERS: Record<string, () => Promise<{ default: any }>> = {
  example: () => import('./example'),
};
