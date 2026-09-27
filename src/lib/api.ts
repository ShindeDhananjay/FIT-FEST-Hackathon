/**
 * EcoLoop Centralized API Resolver
 * 
 * In Production:
 * When frontend is deployed on Netlify, set NEXT_PUBLIC_API_URL to your Render Web Service URL
 * Example: https://ecoloop-backend.onrender.com
 * 
 * In Local Dev / Standalone:
 * If NEXT_PUBLIC_API_URL is empty, it uses relative '/api' endpoints directly.
 */

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) {
    return cleanEndpoint;
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
}
