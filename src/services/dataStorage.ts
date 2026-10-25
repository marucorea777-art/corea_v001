import { PostcardLog, Destination, Festival } from "../types";

const STORAGE_POSTCARDS = "corea_labs_postcards";
const STORAGE_DESTINATIONS = "corea_labs_custom_destinations";
const STORAGE_DELETED_DESTINATIONS = "corea_labs_deleted_destinations";
const STORAGE_FESTIVALS = "corea_labs_custom_festivals";
const STORAGE_DELETED_FESTIVALS = "corea_labs_deleted_festivals";

function isJsonResponse(res: Response): boolean {
  const ct = res.headers.get("content-type");
  return Boolean(ct && ct.includes("application/json"));
}

// --- Postcards ---
export async function getPostcards(): Promise<PostcardLog[]> {
  try {
    const res = await fetch("/api/postcards");
    if (res.ok && isJsonResponse(res)) {
      const data = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem(STORAGE_POSTCARDS, JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {
    // fallback to localStorage
  }
  const local = localStorage.getItem(STORAGE_POSTCARDS);
  return local ? JSON.parse(local) : [];
}

export async function addPostcard(card: Omit<PostcardLog, "id" | "createdAt">): Promise<PostcardLog> {
  const newCard: PostcardLog = {
    ...card,
    id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  // Try server first
  try {
    const res = await fetch("/api/postcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard),
    });
    if (res.ok && isJsonResponse(res)) {
      const data = await res.json();
      if (data && data.id) {
        // Update local storage
        const existing = await getPostcards();
        const updated = [data, ...existing.filter((c) => c.id !== data.id)];
        localStorage.setItem(STORAGE_POSTCARDS, JSON.stringify(updated));
        return data;
      }
    }
  } catch (e) {
    // fallback to local
  }

  // Local fallback
  const local = localStorage.getItem(STORAGE_POSTCARDS);
  const existing: PostcardLog[] = local ? JSON.parse(local) : [];
  const updated = [newCard, ...existing];
  localStorage.setItem(STORAGE_POSTCARDS, JSON.stringify(updated));
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
  } catch (e) {
    // ignore
  }

  const local = localStorage.getItem(STORAGE_POSTCARDS);
  if (local) {
    const existing: PostcardLog[] = JSON.parse(local);
    const updated = existing.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_POSTCARDS, JSON.stringify(updated));
  }
  return true;
}

// --- Destinations (추천명소) ---
export async function getCustomDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch("/api/destinations");
    if (res.ok && isJsonResponse(res)) {
      const data = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem(STORAGE_DESTINATIONS, JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {
    // fallback
  }
  const local = localStorage.getItem(STORAGE_DESTINATIONS);
  return local ? JSON.parse(local) : [];
}

export function getDeletedDestinationIds(): string[] {
  const local = localStorage.getItem(STORAGE_DELETED_DESTINATIONS);
  return local ? JSON.parse(local) : [];
}

export async function addDestination(dest: Destination, token?: string | null): Promise<Destination> {
  const newDest: Destination = {
    ...dest,
    isCustom: true,
  };

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
        const local = localStorage.getItem(STORAGE_DESTINATIONS);
        const existing: Destination[] = local ? JSON.parse(local) : [];
        const updated = [...existing.filter((d) => d.id !== data.id), data];
        localStorage.setItem(STORAGE_DESTINATIONS, JSON.stringify(updated));
        return data;
      }
    }
  } catch (e) {
    // fallback
  }

  const local = localStorage.getItem(STORAGE_DESTINATIONS);
  const existing: Destination[] = local ? JSON.parse(local) : [];
  const updated = [...existing.filter((d) => d.id !== newDest.id), newDest];
  localStorage.setItem(STORAGE_DESTINATIONS, JSON.stringify(updated));
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
  } catch (e) {
    // ignore
  }

  // Remove from custom list
  const local = localStorage.getItem(STORAGE_DESTINATIONS);
  if (local) {
    const existing: Destination[] = JSON.parse(local);
    const updated = existing.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_DESTINATIONS, JSON.stringify(updated));
  }

  // Record in deleted list to also hide default preset if deleted
  const deleted = getDeletedDestinationIds();
  if (!deleted.includes(id)) {
    const updatedDeleted = [...deleted, id];
    localStorage.setItem(STORAGE_DELETED_DESTINATIONS, JSON.stringify(updatedDeleted));
  }

  return true;
}

// --- Festivals (전국 축제) ---
export async function getCustomFestivals(): Promise<Festival[]> {
  try {
    const res = await fetch("/api/festivals");
    if (res.ok && isJsonResponse(res)) {
      const data = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem(STORAGE_FESTIVALS, JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {
    // fallback
  }
  const local = localStorage.getItem(STORAGE_FESTIVALS);
  return local ? JSON.parse(local) : [];
}

export function getDeletedFestivalIds(): string[] {
  const local = localStorage.getItem(STORAGE_DELETED_FESTIVALS);
  return local ? JSON.parse(local) : [];
}

export async function addFestival(festival: Festival, token?: string | null): Promise<Festival> {
  const newFest: Festival = {
    ...festival,
    isCustom: true,
  };

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
        const local = localStorage.getItem(STORAGE_FESTIVALS);
        const existing: Festival[] = local ? JSON.parse(local) : [];
        const updated = [...existing.filter((f) => f.id !== data.id), data];
        localStorage.setItem(STORAGE_FESTIVALS, JSON.stringify(updated));
        return data;
      }
    }
  } catch (e) {
    // fallback
  }

  const local = localStorage.getItem(STORAGE_FESTIVALS);
  const existing: Festival[] = local ? JSON.parse(local) : [];
  const updated = [...existing.filter((f) => f.id !== newFest.id), newFest];
  localStorage.setItem(STORAGE_FESTIVALS, JSON.stringify(updated));
  return newFest;
}

export async function updateFestival(festival: Festival, token?: string | null): Promise<Festival> {
  // If this festival was previously marked deleted, undelete it
  const deleted = getDeletedFestivalIds();
  if (deleted.includes(festival.id)) {
    const remainingDeleted = deleted.filter((id) => id !== festival.id);
    localStorage.setItem(STORAGE_DELETED_FESTIVALS, JSON.stringify(remainingDeleted));
  }

  try {
    const res = await fetch("/api/festivals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token || "",
      },
      body: JSON.stringify(festival),
    });
    if (res.ok && isJsonResponse(res)) {
      const data = await res.json();
      if (data && data.id) {
        const local = localStorage.getItem(STORAGE_FESTIVALS);
        const existing: Festival[] = local ? JSON.parse(local) : [];
        const updated = [...existing.filter((f) => f.id !== data.id), data];
        localStorage.setItem(STORAGE_FESTIVALS, JSON.stringify(updated));
        return data;
      }
    }
  } catch (e) {
    // fallback
  }

  const local = localStorage.getItem(STORAGE_FESTIVALS);
  const existing: Festival[] = local ? JSON.parse(local) : [];
  const updated = [...existing.filter((f) => f.id !== festival.id), festival];
  localStorage.setItem(STORAGE_FESTIVALS, JSON.stringify(updated));
  return festival;
}

export async function deleteFestival(id: string, token?: string | null): Promise<boolean> {
  try {
    await fetch(`/api/festivals/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-token": token || "",
      },
    });
  } catch (e) {
    // ignore
  }

  // Remove from custom list
  const local = localStorage.getItem(STORAGE_FESTIVALS);
  if (local) {
    const existing: Festival[] = JSON.parse(local);
    const updated = existing.filter((f) => f.id !== id);
    localStorage.setItem(STORAGE_FESTIVALS, JSON.stringify(updated));
  }

  // Record in deleted list to also hide default festival if deleted
  const deleted = getDeletedFestivalIds();
  if (!deleted.includes(id)) {
    const updatedDeleted = [...deleted, id];
    localStorage.setItem(STORAGE_DELETED_FESTIVALS, JSON.stringify(updatedDeleted));
  }

  return true;
}
