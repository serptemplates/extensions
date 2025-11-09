// Test setup file
// Load environment variables for testing
import { config } from 'dotenv';
import { vi } from 'vitest';

config({ path: '.env.local' });

// Mock server-only module
vi.mock('server-only', () => ({}));

// Mock React cache for testing
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn, // In tests, just return the function unwrapped
  };
});
