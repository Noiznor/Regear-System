import { Thread } from '../types';

const STORAGE_KEY = 'regear_threads';

export const saveThreads = (threads: Thread[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
};

export const loadThreads = (): Thread[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const threads = JSON.parse(stored);
    return threads.map((thread: any) => ({
      ...thread,
      createdAt: new Date(thread.createdAt),
      lastModified: new Date(thread.lastModified)
    }));
  } catch {
    return [];
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};