// lib/clerk.js
import { Clerk } from '@clerk/nextjs';

const clerkClient = new Clerk({
  apiKey: process.env.CLERK_API_KEY, // Clerk API Key
  frontendApi: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API, // Clerk Frontend API
});

export { clerkClient };
