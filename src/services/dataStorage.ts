import { PostcardLog, Destination, Festival } from "../types";

const STORAGE_POSTCARDS = "corea_labs_postcards";
const STORAGE_POSTCARDS_BACKUP = "corea_labs_postcards_backup_v2";
const STORAGE_DESTINATIONS = "corea_labs_custom_destinations";
const STORAGE_DESTINATIONS_BACKUP = "corea_labs_custom_destinations_backup_v2";
const STORAGE_DELETED_DESTINATIONS = "corea_labs_deleted_destinations";
const STORAGE_FESTIVALS = "corea_labs_custom_festivals";
const STORAGE_FESTIVALS_BACKUP = "corea_labs_custom_festivals_backup_v2";
const STORAGE_DELETED_FESTIVALS = "corea_labs_deleted_festivals";

const IDB_NAME = "corea_labs_persistent_db_v1";
const IDB_STORE = "kv_store";

function isJsonResponse(res: Response): boolean {
  const ct = res.headers.get("content-type");
  return Boolean(ct && ct.includes("application/json"));
}

// --- IndexedDB Helper (prevents 5MB localStorage quota loss for custom high-res festival images) ---
function openPersistentIdb(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbGet<T>(key: string): Promise<T | null> {
  const db = await openPersistentIdb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readonly");
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet<T>(key: string, value: T): Promise<void> {
  const db = await openPersistentIdb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

function safeReadLocalArray<T>(primaryKey: string, backupKey?: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(primaryKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  if (backupKey) {
    try {
      const rawBackup = localStorage.getItem(backupKey);
      if (rawBackup) {
        const parsedBackup = JSON.parse(rawBackup);
        if (Array.isArray(parsedBackup) && parsedBackup.length > 0) return parsedBackup;
      }
    } catch {}
  }
  return [];
}

function safeWriteLocalArray<T>(primaryKey: string, items: T[], backupKey?: string): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(items);
  try {
    localStorage.setItem(primaryKey, serialized);
  } catch {}
  if (backupKey) {
    try {
      localStorage.setItem(backupKey, serialized);
    } catch {}
  }
}

function mergeById<T extends { id: string }>(localItems: T[], serverItems: T[], deletedIds: string[] = []): T[] {
  const deletedSet = new Set(deletedIds);
  const map = new Map<string, T>();
  // Server items first
  for (const item of serverItems) {
    if (item && item.id && !deletedSet.has(item.id)) {
      map.set(item.id, item);
    }
  }
  // Local items override or add so manual registrations/edits in the browser are never lost on publish
  for (const item of localItems) {
    if (item && item.id && !deletedSet.has(item.id)) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
}

// --- Postcards ---
export async function getPostcards(): Promise<PostcardLog[]> {
  const localItems = safeReadLocalArray<PostcardLog>(STORAGE_POSTCARDS, STORAGE_POSTCARDS_BACKUP);
  const idbItems = (await idbGet<PostcardLog[]>(STORAGE_POSTCARDS)) || [];
  const combinedLocal = mergeById(localItems, idbItems);

  try {
    const res = await fetch("/api/postcards");
    if (res.ok && isJsonResponse(res)) {
      const serverData = await res.json();
      if (Array.isArray(serverData)) {
        const merged = mergeById(combinedLocal, serverData);
        safeWriteLocalArray(STORAGE_POSTCARDS, merged, STORAGE_POSTCARDS_BACKUP);
        await idbSet(STORAGE_POSTCARDS, merged);
        return merged;
      }
    }
  } catch {
    // fallback to local + idb
  }
  return combinedLocal;
}

export async function addPostcard(card: Omit<PostcardLog, "id" | "createdAt">): Promise<PostcardLog> {
  const newCard: PostcardLog = {
    ...card,
    id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  const existing = await getPostcards();
  const updated = [newCard, ...existing.filter((c) => c.id !== newCard.id)];
  safeWriteLocalArray(STORAGE_POSTCARDS, updated, STORAGE_POSTCARDS_BACKUP);
  await idbSet(STORAGE_POSTCARDS, updated);

  try {
    const res = await fetch("/api/postcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard),
    });
    if (res.ok && isJsonResponse(res)) {
      const data = await res.json();
      if (data && data.id) {
        return data;
      }
    }
  } catch {
    // fallback already saved locally
  }

  return newCard;
}

export async function deletePostcard(id: string, token?: string | null): Promise<boolean> {
  try {
    await fetch(`/api/postcards/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-token": token || "",
      },
    });
  } catch {
    // ignore
  }

  const local = safeReadLocalArray<PostcardLog>(STORAGE_POSTCARDS, STORAGE_POSTCARDS_BACKUP);
  const idbItems = (await idbGet<PostcardLog[]>(STORAGE_POSTCARDS)) || [];
  const merged = mergeById(local, idbItems).filter((c) => c.id !== id);
  safeWriteLocalArray(STORAGE_POSTCARDS, merged, STORAGE_POSTCARDS_BACKUP);
  await idbSet(STORAGE_POSTCARDS, merged);
  return true;
}

// --- Destinations (추천명소) ---
export function getDeletedDestinationIds(): string[] {
  return safeReadLocalArray<string>(STORAGE_DELETED_DESTINATIONS);
}

export async function getCustomDestinations(): Promise<Destination[]> {
  const deletedIds = getDeletedDestinationIds();
  const localItems = safeReadLocalArray<Destination>(STORAGE_DESTINATIONS, STORAGE_DESTINATIONS_BACKUP);
  const idbItems = (await idbGet<Destination[]>(STORAGE_DESTINATIONS)) || [];
  const combinedLocal = mergeById(localItems, idbItems, deletedIds);

  try {
    const res = await fetch("/api/destinations");
    if (res.ok && isJsonResponse(res)) {
      const serverData = await res.json();
      if (Array.isArray(serverData)) {
        const merged = mergeById(combinedLocal, serverData, deletedIds);
        safeWriteLocalArray(STORAGE_DESTINATIONS, merged, STORAGE_DESTINATIONS_BACKUP);
        await idbSet(STORAGE_DESTINATIONS, merged);

        // If local had custom destinations that were missing on a freshly published server, sync them back!
        if (merged.length > serverData.length) {
          fetch("/api/destinations/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ destinations: merged, deletedIds }),
          }).catch(() => {});
        }
        return merged;
      }
    }
  } catch {
    // fallback
  }

  if (combinedLocal.length > 0) {
    safeWriteLocalArray(STORAGE_DESTINATIONS, combinedLocal, STORAGE_DESTINATIONS_BACKUP);
    await idbSet(STORAGE_DESTINATIONS, combinedLocal);
  }
  return combinedLocal;
}

export async function addDestination(dest: Destination, token?: string | null): Promise<Destination> {
  const newDest: Destination = {
    ...dest,
    isCustom: true,
  };

  // Undelete if previously deleted
  const deleted = getDeletedDestinationIds();
  if (deleted.includes(newDest.id)) {
    const remaining = deleted.filter((id) => id !== newDest.id);
    safeWriteLocalArray(STORAGE_DELETED_DESTINATIONS, remaining);
  }

  const existing = await getCustomDestinations();
  const updated = [...existing.filter((d) => d.id !== newDest.id), newDest];
  safeWriteLocalArray(STORAGE_DESTINATIONS, updated, STORAGE_DESTINATIONS_BACKUP);
  await idbSet(STORAGE_DESTINATIONS, updated);

  try {
    const res = await fetch("/api/destinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token || "",
      },
      body: JSON.stringify(newDest),
    });
    if (res.ok && isJsonResponse(res)) {
      const data = await res.json();
      if (data && data.id) {
        return data;
      }
    }
  } catch {
    // fallback already saved
  }

  return newDest;
}

export async function deleteDestination(id: string, token?: string | null): Promise<boolean> {
  try {
    await fetch(`/api/destinations/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-token": token || "",
      },
    });
  } catch {
    // ignore
  }

  const localItems = safeReadLocalArray<Destination>(STORAGE_DESTINATIONS, STORAGE_DESTINATIONS_BACKUP);
  const idbItems = (await idbGet<Destination[]>(STORAGE_DESTINATIONS)) || [];
  const updated = mergeById(localItems, idbItems).filter((d) => d.id !== id);
  safeWriteLocalArray(STORAGE_DESTINATIONS, updated, STORAGE_DESTINATIONS_BACKUP);
  await idbSet(STORAGE_DESTINATIONS, updated);

  const deleted = getDeletedDestinationIds();
  if (!deleted.includes(id)) {
    const updatedDeleted = [...deleted, id];
    safeWriteLocalArray(STORAGE_DELETED_DESTINATIONS, updatedDeleted);
  }

  return true;
}

// --- Festivals (전국 축제 - 수동 등록 및 이미지 수정 영구 보존) ---
export function getDeletedFestivalIds(): string[] {
  return safeReadLocalArray<string>(STORAGE_DELETED_FESTIVALS);
}

export async function getCustomFestivals(): Promise<Festival[]> {
  const deletedIds = getDeletedFestivalIds();
  const localItems = safeReadLocalArray<Festival>(STORAGE_FESTIVALS, STORAGE_FESTIVALS_BACKUP);
  const idbItems = (await idbGet<Festival[]>(STORAGE_FESTIVALS)) || [];
  const combinedLocal = mergeById(localItems, idbItems, deletedIds);

  try {
    const res = await fetch("/api/festivals");
    if (res.ok && isJsonResponse(res)) {
      const serverData = await res.json();
      if (Array.isArray(serverData)) {
        // Non-destructive union merge: NEVER overwrite existing custom/edited festival cards with an empty [] after publish!
        const merged = mergeById(combinedLocal, serverData, deletedIds);
        safeWriteLocalArray(STORAGE_FESTIVALS, merged, STORAGE_FESTIVALS_BACKUP);
        await idbSet(STORAGE_FESTIVALS, merged);

        // Automatically sync local custom/edited festivals back to the server if the server was freshly published
        const serverIds = new Set(serverData.map((s: Festival) => s?.id));
        const hasUnsyncedLocal = combinedLocal.some((item) => {
          if (!serverIds.has(item.id)) return true;
          const serverMatch = serverData.find((s: Festival) => s?.id === item.id);
          return serverMatch && (serverMatch.image !== item.image || serverMatch.name !== item.name || serverMatch.description !== item.description);
        });

        if (hasUnsyncedLocal && merged.length > 0) {
          fetch("/api/festivals/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ festivals: merged, deletedIds }),
          }).catch(() => {});
        }

        return merged;
      }
    }
  } catch {
    // fallback to combinedLocal
  }

  if (combinedLocal.length > 0) {
    safeWriteLocalArray(STORAGE_FESTIVALS, combinedLocal, STORAGE_FESTIVALS_BACKUP);
    await idbSet(STORAGE_FESTIVALS, combinedLocal);
  }
  return combinedLocal;
}

export async function addFestival(festival: Festival, token?: string | null): Promise<Festival> {
  const newFest: Festival = {
    ...festival,
    isCustom: true,
  };

  const deleted = getDeletedFestivalIds();
  if (deleted.includes(newFest.id)) {
    const remainingDeleted = deleted.filter((id) => id !== newFest.id);
    safeWriteLocalArray(STORAGE_DELETED_FESTIVALS, remainingDeleted);
  }

  // Persist immediately in localStorage, backup key, and IndexedDB
  const localItems = safeReadLocalArray<Festival>(STORAGE_FESTIVALS, STORAGE_FESTIVALS_BACKUP);
  const idbItems = (await idbGet<Festival[]>(STORAGE_FESTIVALS)) || [];
  const existing = mergeById(localItems, idbItems);
  const updated = [...existing.filter((f) => f.id !== newFest.id), newFest];
  safeWriteLocalArray(STORAGE_FESTIVALS, updated, STORAGE_FESTIVALS_BACKUP);
  await idbSet(STORAGE_FESTIVALS, updated);

  try {
    const res = await fetch("/api/festivals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token || "",
      },
      body: JSON.stringify(newFest),
    });
    if (res.ok && isJsonResponse(res)) {
      const data = await res.json();
      if (data && data.id) {
        return data;
      }
    }
  } catch {
    // fallback already saved in localStorage + IndexedDB
  }

  return newFest;
}

export async function updateFestival(festival: Festival, token?: string | null): Promise<Festival> {
  const updatedFest: Festival = {
    ...festival,
    isCustom: true,
  };

  // If this festival was previously marked deleted, undelete it
  const deleted = getDeletedFestivalIds();
  if (deleted.includes(updatedFest.id)) {
    const remainingDeleted = deleted.filter((id) => id !== updatedFest.id);
    safeWriteLocalArray(STORAGE_DELETED_FESTIVALS, remainingDeleted);
  }

  // Persist immediately in localStorage, backup key, and IndexedDB
  const localItems = safeReadLocalArray<Festival>(STORAGE_FESTIVALS, STORAGE_FESTIVALS_BACKUP);
  const idbItems = (await idbGet<Festival[]>(STORAGE_FESTIVALS)) || [];
  const existing = mergeById(localItems, idbItems);
  const updated = [...existing.filter((f) => f.id !== updatedFest.id), updatedFest];
  safeWriteLocalArray(STORAGE_FESTIVALS, updated, STORAGE_FESTIVALS_BACKUP);
  await idbSet(STORAGE_FESTIVALS, updated);

  try {
    const res = await fetch("/api/festivals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token || "",
      },
      body: JSON.stringify(updatedFest),
    });
    if (res.ok && isJsonResponse(res)) {
      const data = await res.json();
      if (data && data.id) {
        return data;
      }
    }
  } catch {
    // fallback already saved in localStorage + IndexedDB
  }

  return updatedFest;
}

export async function deleteFestival(id: string, token?: string | null): Promise<boolean> {
  try {
    await fetch(`/api/festivals/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-token": token || "",
      },
    });
  } catch {
    // ignore
  }

  const localItems = safeReadLocalArray<Festival>(STORAGE_FESTIVALS, STORAGE_FESTIVALS_BACKUP);
  const idbItems = (await idbGet<Festival[]>(STORAGE_FESTIVALS)) || [];
  const updated = mergeById(localItems, idbItems).filter((f) => f.id !== id);
  safeWriteLocalArray(STORAGE_FESTIVALS, updated, STORAGE_FESTIVALS_BACKUP);
  await idbSet(STORAGE_FESTIVALS, updated);

  // Record in deleted list to also hide default festival if deleted
  const deleted = getDeletedFestivalIds();
  if (!deleted.includes(id)) {
    const updatedDeleted = [...deleted, id];
    safeWriteLocalArray(STORAGE_DELETED_FESTIVALS, updatedDeleted);
  }

  return true;
}
