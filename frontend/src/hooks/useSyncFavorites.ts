import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../api/apiClient';

export const useSyncFavorites = (serverIds: Set<number>, loaded: boolean) => {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  // Refs give stable callbacks access to the latest state without re-creates.
  const favoriteIdsRef = useRef<Set<number>>(new Set());
  const initialIdsRef = useRef<Set<number>>(new Set()); // DB  at last sync
  const initializedRef = useRef(false);

  // Keep the ref in sync with state after every toggle.
  useEffect(() => {
    favoriteIdsRef.current = favoriteIds;
  }, [favoriteIds]);

  useEffect(() => {
    if (loaded && !initializedRef.current) {
      const ids = new Set(serverIds);
      setFavoriteIds(ids);
      favoriteIdsRef.current = ids;
      initialIdsRef.current = ids;   // record DB truth
      initializedRef.current = true;
    }
  }, [loaded, serverIds]);

  // Toggle a property's favourite status in local state only.
  const toggleFavorite = useCallback((propertyId: number) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      // Update the ref immediately so syncWithBackend always sees current state.
      favoriteIdsRef.current = next;
      return next;
    });
  }, []);

  const syncWithBackend = useCallback(async (keepalive = false) => {
    const current = favoriteIdsRef.current;
    const initial = initialIdsRef.current;

    const added   = [...current].filter(id => !initial.has(id));
    const removed = [...initial].filter(id => !current.has(id));

    if (added.length === 0 && removed.length === 0) return;

    try {
      await apiClient.post('/favorites/sync', { added, removed }, keepalive);
      // Advance DB truth so the next diff is relative to what was just saved.
      initialIdsRef.current = new Set(current);
    } catch (error) {
      console.error('Failed to sync favorites:', error);
    }
  }, []); 

  //  background sync (every 30 s).
  useEffect(() => {
    const id = setInterval(() => syncWithBackend(false), 30_000);
    return () => clearInterval(id);
  }, [syncWithBackend]);

  // Sync when the user navigates away or closes the tab.
  useEffect(() => {
    const handleBeforeUnload = () => syncWithBackend(true);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      syncWithBackend(false);
    };
  }, [syncWithBackend]);

  return { favoriteIds, toggleFavorite };
};
