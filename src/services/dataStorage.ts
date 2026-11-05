import { PostcardLog, Destination, Festival, QnaPost, QnaReply } from "../types";

const STORAGE_POSTCARDS = "corea_labs_postcards";
const STORAGE_POSTCARDS_BACKUP = "corea_labs_postcards_backup_v2";
const STORAGE_DESTINATIONS = "corea_labs_custom_destinations";
const STORAGE_DESTINATIONS_BACKUP = "corea_labs_custom_destinations_backup_v2";
const STORAGE_DELETED_DESTINATIONS = "corea_labs_deleted_destinations";
const STORAGE_FESTIVALS = "corea_labs_custom_festivals";
const STORAGE_FESTIVALS_BACKUP = "corea_labs_custom_festivals_backup_v2";
const STORAGE_DELETED_FESTIVALS = "corea_labs_deleted_festivals";
const STORAGE_QNA = "corea_labs_qna_posts";
const STORAGE_QNA_BACKUP = "corea_labs_qna_posts_backup_v2";
const STORAGE_DELETED_QNA = "corea_labs_deleted_qna_ids";

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

// --- Traveler Q&A Board (여행자 질문 & 답변 게시판) ---
export const DEFAULT_QNA_POSTS: QnaPost[] = [
  {
    id: "qna_default_1",
    category: "festival",
    title: "진해군항제나 보령머드축제에 외국인도 렌터카 없이 KTX와 버스로 갈 수 있나요?",
    content:
      "한국에서 렌터카 운전이 부담스러운데 서울에서 출발해 진해군항제나 보령머드축제에 대중교통만으로 당일치기나 1박 2일 방문이 가능한지 궁금합니다!",
    author: "Sakura_Traveler",
    countryFlag: "🇯🇵",
    createdAt: "2025-03-18T09:30:00.000Z",
    likes: 42,
    views: 318,
    isPinned: true,
    replies: [
      {
        id: "reply_default_1",
        author: "Corea Labs 공식 컨시어지",
        countryFlag: "🇰🇷",
        content:
          "네, 한국은 KTX 고속열차와 시외·고속버스, 축제 전용 무료 셔틀버스망이 매우 잘 갖추어져 있어 렌터카 없이도 편리하게 방문할 수 있습니다! 예를 들어 진해군항제는 서울역에서 KTX로 창원중앙역(약 3시간) 이동 후 시내버스나 축제 무료 셔틀버스로 바로 연결되며, 보령머드축제는 용산역에서 장항선 열차로 대천역에 하차 후 시내버스로 15분이면 해변 축제장에 도착합니다. 본 사이트의 [Festivals] 메뉴에서 각 축제 카드를 클릭하시면 KTX·고속버스·시내버스 상세 노선 번호를 확인하실 수 있습니다.",
        createdAt: "2025-03-18T10:05:00.000Z",
        isOfficial: true,
      },
    ],
  },
  {
    id: "qna_default_2",
    category: "finance",
    title: "한국 여행 시 현금 환전과 WOWPASS / T-money 카드 중 무엇을 준비하는 게 좋나요?",
    content:
      "일주일 동안 서울, 경주, 부산을 여행할 예정입니다. 공항에서 현금을 많이 환전해야 할지, 아니면 외국인 전용 선불카드(WOWPASS, NAMANE)로 충분한지 조언 부탁드립니다.",
    author: "Lucas_M",
    countryFlag: "🇺🇸",
    createdAt: "2025-03-16T14:20:00.000Z",
    likes: 37,
    views: 274,
    isPinned: true,
    replies: [
      {
        id: "reply_default_2",
        author: "Corea Labs 공식 컨시어지",
        countryFlag: "🇰🇷",
        content:
          "한국은 백화점, 식당, 카페, 택시 등 95% 이상의 매장에서 신용카드 및 선불카드 결제가 가능합니다. 따라서 [카드로 85% + 소액 현금 15%(약 5만~10만 원)] 비율을 가장 추천합니다. 인천공항이나 주요 지하철역 키오스크에서 WOWPASS 또는 NAMANE 카드를 발급받으시면 외화로 바로 충전해 일반 결제와 지하철·버스 교통카드(T-money) 기능을 한 장으로 모두 사용하실 수 있습니다. 전통시장 길거리 간식이나 노점 이용 시에만 소액 현금을 사용하세요!",
        createdAt: "2025-03-16T15:00:00.000Z",
        isOfficial: true,
      },
    ],
  },
  {
    id: "qna_default_3",
    category: "visa",
    title: "K-ETA 신청 기한과 Q-Code 사전 등록은 입국 며칠 전에 해야 하나요?",
    content:
      "다음 주 인천국제공항을 통해 입국합니다. K-ETA 전자여행허가와 Q-Code 검역 QR코드는 출발 몇 시간 전까지 신청해야 안전할까요?",
    author: "Somchai_BKK",
    countryFlag: "🇹🇭",
    createdAt: "2025-03-14T11:15:00.000Z",
    likes: 29,
    views: 215,
    replies: [
      {
        id: "reply_default_3",
        author: "Corea Labs 공식 컨시어지",
        countryFlag: "🇰🇷",
        content:
          "K-ETA(전자여행허가)는 심사 시간을 고려해 항공기 탑승 최소 72시간 전까지 공식 웹사이트(k-eta.go.kr)에서 신청하시는 것을 권장합니다(유효기간 3년, 수수료 10,000원). Q-Code(검역정보 사전입력시스템)는 입국 3일 전부터 등록 가능하며, 미리 QR코드를 발급받아 스마트폰에 저장해 두시면 인천공항 도착 후 검역 게이트를 대기 없이 빠르게 통과하실 수 있습니다.",
        createdAt: "2025-03-14T11:48:00.000Z",
        isOfficial: true,
      },
    ],
  },
  {
    id: "qna_default_4",
    category: "places",
    title: "경복궁과 창덕궁 방문 시 한복을 입으면 정말 입장료가 무료인가요?",
    content:
      "서울 고궁 투어를 계획 중인데 한복 대여점에서 한복을 입고 가면 사전 예약 없이도 무료 입장이 가능한지, 그리고 화요일 휴궁일이 맞는지 궁금합니다.",
    author: "Marie_Paris",
    countryFlag: "🇫🇷",
    createdAt: "2025-03-11T16:40:00.000Z",
    likes: 34,
    views: 249,
    replies: [
      {
        id: "reply_default_4",
        author: "Corea Labs 공식 컨시어지",
        countryFlag: "🇰🇷",
        content:
          "네, 맞습니다! 전통 한복 또는 생활 한복 규정에 맞는 한복을 착용하시면 경복궁, 창덕궁, 창경궁, 덕수궁, 종묘 모두 입장료가 무료입니다(단, 창덕궁 후원 특별관람은 별도 예약 및 요금 필요). 참고로 경복궁은 매주 화요일이 정기 휴궁일이며, 창덕궁·덕수궁·창경궁은 매주 월요일이 휴궁일이니 방문 요일을 꼭 확인하세요!",
        createdAt: "2025-03-11T17:10:00.000Z",
        isOfficial: true,
      },
    ],
  },
];

export function getDeletedQnaIds(): string[] {
  return safeReadLocalArray<string>(STORAGE_DELETED_QNA);
}

export async function getQnaPosts(): Promise<QnaPost[]> {
  const deletedIds = getDeletedQnaIds();
  const localItems = safeReadLocalArray<QnaPost>(STORAGE_QNA, STORAGE_QNA_BACKUP);
  const idbItems = (await idbGet<QnaPost[]>(STORAGE_QNA)) || [];
  const combinedLocal = mergeById(localItems, idbItems, deletedIds);

  let serverPosts: QnaPost[] = [];
  try {
    const res = await fetch("/api/qna");
    if (res.ok && isJsonResponse(res)) {
      const data = await res.json();
      if (Array.isArray(data)) {
        serverPosts = data;
      }
    }
  } catch {
    // fallback to local + defaults
  }

  const mergedWithServer = mergeById(combinedLocal, serverPosts, deletedIds);
  const allPosts = mergeById(mergedWithServer, DEFAULT_QNA_POSTS, deletedIds);

  // Sort: pinned first, then newest createdAt
  allPosts.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  safeWriteLocalArray(STORAGE_QNA, allPosts, STORAGE_QNA_BACKUP);
  await idbSet(STORAGE_QNA, allPosts);
  return allPosts;
}

export async function addQnaPost(
  postInput: Omit<QnaPost, "id" | "createdAt" | "likes" | "views" | "replies">
): Promise<QnaPost> {
  const newPost: QnaPost = {
    ...postInput,
    id: `qna_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    likes: 1,
    views: 1,
    replies: [],
  };

  const current = await getQnaPosts();
  const updated = [newPost, ...current];
  safeWriteLocalArray(STORAGE_QNA, updated, STORAGE_QNA_BACKUP);
  await idbSet(STORAGE_QNA, updated);

  try {
    await fetch("/api/qna", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
  } catch {
    // local persistence already completed
  }

  return newPost;
}

export async function addQnaReply(
  postId: string,
  replyInput: Omit<QnaReply, "id" | "createdAt">
): Promise<QnaPost | null> {
  const newReply: QnaReply = {
    ...replyInput,
    id: `reply_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  const current = await getQnaPosts();
  let updatedTarget: QnaPost | null = null;
  const updated = current.map((post) => {
    if (post.id === postId) {
      updatedTarget = {
        ...post,
        replies: [...(post.replies || []), newReply],
      };
      return updatedTarget;
    }
    return post;
  });

  if (updatedTarget) {
    safeWriteLocalArray(STORAGE_QNA, updated, STORAGE_QNA_BACKUP);
    await idbSet(STORAGE_QNA, updated);

    try {
      await fetch(`/api/qna/${postId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReply),
      });
    } catch {
      // local persistence already completed
    }
  }

  return updatedTarget;
}

export async function toggleQnaLike(postId: string): Promise<QnaPost | null> {
  const current = await getQnaPosts();
  let updatedTarget: QnaPost | null = null;
  const updated = current.map((post) => {
    if (post.id === postId) {
      updatedTarget = { ...post, likes: (post.likes || 0) + 1 };
      return updatedTarget;
    }
    return post;
  });

  if (updatedTarget) {
    safeWriteLocalArray(STORAGE_QNA, updated, STORAGE_QNA_BACKUP);
    await idbSet(STORAGE_QNA, updated);

    try {
      await fetch(`/api/qna/${postId}/like`, { method: "POST" });
    } catch {}
  }

  return updatedTarget;
}

export async function deleteQnaPost(postId: string, token?: string | null): Promise<boolean> {
  try {
    await fetch(`/api/qna/${postId}`, {
      method: "DELETE",
      headers: { "x-admin-token": token || "" },
    });
  } catch {}

  const deleted = getDeletedQnaIds();
  if (!deleted.includes(postId)) {
    safeWriteLocalArray(STORAGE_DELETED_QNA, [...deleted, postId]);
  }

  const localItems = safeReadLocalArray<QnaPost>(STORAGE_QNA, STORAGE_QNA_BACKUP);
  const idbItems = (await idbGet<QnaPost[]>(STORAGE_QNA)) || [];
  const remaining = mergeById(localItems, idbItems).filter((p) => p.id !== postId);
  safeWriteLocalArray(STORAGE_QNA, remaining, STORAGE_QNA_BACKUP);
  await idbSet(STORAGE_QNA, remaining);
  return true;
}

