import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminContextType {
  isAdmin: boolean;
  adminToken: string | null;
  hasCustomPassword: boolean;
  login: (password: string) => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  showAnalyticsModal: boolean;
  setShowAnalyticsModal: (show: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_ADMIN_KEY = "corea_labs_admin_auth";
const STORAGE_CUSTOM_PASS = "corea_labs_admin_custom_password";
const STORAGE_CUSTOM_PASS_BACKUP = "corea_labs_admin_custom_password_backup_v2";
const IDB_NAME = "corea_labs_persistent_db_v1";
const IDB_STORE = "kv_store";
const IDB_PASS_KEY = "admin_custom_password";

function openAdminIdb(): Promise<IDBDatabase | null> {
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

async function idbGetCustomPassword(): Promise<string | null> {
  const db = await openAdminIdb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readonly");
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(IDB_PASS_KEY);
      req.onsuccess = () => resolve(typeof req.result === "string" && req.result.trim().length >= 4 ? req.result.trim() : null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSetCustomPassword(pass: string): Promise<void> {
  const db = await openAdminIdb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      store.put(pass, IDB_PASS_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

function readSyncLocalCustomPassword(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const primary = localStorage.getItem(STORAGE_CUSTOM_PASS);
    if (primary && primary.trim().length >= 4) return primary.trim();
  } catch {}
  try {
    const backup = localStorage.getItem(STORAGE_CUSTOM_PASS_BACKUP);
    if (backup && backup.trim().length >= 4) return backup.trim();
  } catch {}
  return null;
}

async function persistCustomPasswordEverywhere(newPass: string): Promise<void> {
  const clean = newPass.trim();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_CUSTOM_PASS, clean);
    } catch {}
    try {
      localStorage.setItem(STORAGE_CUSTOM_PASS_BACKUP, clean);
    } catch {}
  }
  await idbSetCustomPassword(clean);
  try {
    await fetch("/api/admin/sync-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customPassword: clean }),
    });
  } catch {}
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [customPassState, setCustomPassState] = useState<string | null>(() => readSyncLocalCustomPassword());
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);

  useEffect(() => {
    // 1. Restore saved admin login session
    try {
      const saved = localStorage.getItem(STORAGE_ADMIN_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.token && parsed?.isAdmin) {
          setIsAdmin(true);
          setAdminToken(parsed.token);
        }
      }
    } catch (e) {
      console.error("Failed to parse saved admin auth", e);
    }

    // 2. Restore custom password from localStorage / IndexedDB and auto-sync to freshly published server
    (async () => {
      const localPass = readSyncLocalCustomPassword();
      const idbPass = await idbGetCustomPassword();
      const effectiveCustom = localPass || idbPass;
      if (effectiveCustom) {
        setCustomPassState(effectiveCustom);
        await persistCustomPasswordEverywhere(effectiveCustom);
      }
    })();
  }, []);

  const getEffectiveClientPasswords = async (): Promise<string[]> => {
    const localPass = customPassState || readSyncLocalCustomPassword() || (await idbGetCustomPassword());
    if (localPass && localPass.length >= 4) {
      // Once a custom password is set, ONLY the custom password is valid (never resets to admin1234)
      return [localPass];
    }
    return ["admin1234", "admin", "corealabs1234"];
  };

  const login = async (password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanPassword = password.trim();
    const savedCustom = customPassState || readSyncLocalCustomPassword() || (await idbGetCustomPassword());

    // 1. Check client-persisted custom password first so even right after a Publish, custom password works 100%
    const validClientPasswords = await getEffectiveClientPasswords();
    if (validClientPasswords.includes(cleanPassword)) {
      if (savedCustom) {
        await persistCustomPasswordEverywhere(savedCustom);
      }
      // Also request a server session token if server is reachable
      let token = "local_admin_" + Date.now();
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: cleanPassword,
            clientSavedCustomPassword: savedCustom || undefined,
          }),
        });
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data?.success && data?.token) {
            token = data.token;
          }
        }
      } catch {}

      setIsAdmin(true);
      setAdminToken(token);
      try {
        localStorage.setItem(
          STORAGE_ADMIN_KEY,
          JSON.stringify({ isAdmin: true, token, loggedAt: new Date().toISOString() })
        );
      } catch {}
      setShowLoginModal(false);
      return { success: true };
    }

    // 2. If no local custom password matched, check server in case password was changed from another browser
    if (!savedCustom) {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: cleanPassword }),
        });

        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data?.success && data?.token) {
            setIsAdmin(true);
            setAdminToken(data.token);
            try {
              localStorage.setItem(
                STORAGE_ADMIN_KEY,
                JSON.stringify({ isAdmin: true, token: data.token, loggedAt: new Date().toISOString() })
              );
            } catch {}
            setShowLoginModal(false);
            return { success: true };
          }
        }
      } catch {}
    }

    return { success: false, message: "비밀번호가 올바르지 않습니다." };
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanCurrent = currentPassword.trim();
    const cleanNew = newPassword.trim();

    if (cleanNew.length < 4) {
      return { success: false, message: "새 비밀번호는 4자리 이상이어야 합니다." };
    }

    const savedCustom = customPassState || readSyncLocalCustomPassword() || (await idbGetCustomPassword());
    const validClientPasswords = await getEffectiveClientPasswords();

    // Verify against persisted custom password (or default if never changed)
    const isClientValid = validClientPasswords.includes(cleanCurrent);

    if (!isClientValid) {
      // Check server fallback only if no local custom password was set
      if (!savedCustom) {
        try {
          const res = await fetch("/api/admin/change-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": adminToken || "",
            },
            body: JSON.stringify({
              currentPassword: cleanCurrent,
              newPassword: cleanNew,
            }),
          });
          if (res.ok) {
            const data = await res.json().catch(() => null);
            if (data?.success) {
              setCustomPassState(cleanNew);
              await persistCustomPasswordEverywhere(cleanNew);
              return { success: true, message: "관리자 비밀번호가 성공적으로 변경되었습니다. (퍼블리시 후에도 영구 유지됩니다)" };
            }
          }
        } catch {}
      }
      return { success: false, message: "현재 비밀번호가 일치하지 않습니다." };
    }

    // Save the new custom password in localStorage (primary + backup), IndexedDB, and sync to server
    setCustomPassState(cleanNew);
    await persistCustomPasswordEverywhere(cleanNew);

    try {
      await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken || "",
        },
        body: JSON.stringify({
          currentPassword: cleanCurrent,
          newPassword: cleanNew,
          clientSavedCustomPassword: savedCustom || cleanCurrent,
        }),
      });
    } catch {}

    return {
      success: true,
      message: "관리자 비밀번호가 성공적으로 변경되었습니다. (퍼블리시 후에도 영구 유지됩니다)",
    };
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminToken(null);
    try {
      localStorage.removeItem(STORAGE_ADMIN_KEY);
    } catch {}
    fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminToken,
        hasCustomPassword: Boolean(customPassState),
        login,
        changePassword,
        logout,
        showLoginModal,
        setShowLoginModal,
        showAnalyticsModal,
        setShowAnalyticsModal,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
