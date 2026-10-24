import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminContextType {
  isAdmin: boolean;
  adminToken: string | null;
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

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);

  useEffect(() => {
    // Check saved session
    const saved = localStorage.getItem(STORAGE_ADMIN_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.token && parsed?.isAdmin) {
          setIsAdmin(true);
          setAdminToken(parsed.token);
        }
      } catch (e) {
        console.error("Failed to parse saved admin auth", e);
      }
    }
  }, []);

  const getEffectiveClientPasswords = () => {
    const custom = localStorage.getItem(STORAGE_CUSTOM_PASS);
    const defaults = ["admin1234", "admin", "corealabs1234"];
    return custom ? [custom, ...defaults] : defaults;
  };

  const login = async (password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanPassword = password.trim();
    try {
      // First attempt server login
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: cleanPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token) {
          setIsAdmin(true);
          setAdminToken(data.token);
          localStorage.setItem(
            STORAGE_ADMIN_KEY,
            JSON.stringify({ isAdmin: true, token: data.token, loggedAt: new Date().toISOString() })
          );
          setShowLoginModal(false);
          return { success: true };
        }
      }
      
      // Fallback for static/offline/client mode
      const validPasswords = getEffectiveClientPasswords();
      if (validPasswords.includes(cleanPassword)) {
        const dummyToken = "local_admin_" + Date.now();
        setIsAdmin(true);
        setAdminToken(dummyToken);
        localStorage.setItem(
          STORAGE_ADMIN_KEY,
          JSON.stringify({ isAdmin: true, token: dummyToken, loggedAt: new Date().toISOString() })
        );
        setShowLoginModal(false);
        return { success: true };
      }

      return { success: false, message: "비밀번호가 올바르지 않습니다." };
    } catch (e: any) {
      // In case server fails or is unreachable, fallback to client verification
      const validPasswords = getEffectiveClientPasswords();
      if (validPasswords.includes(cleanPassword)) {
        const dummyToken = "local_admin_" + Date.now();
        setIsAdmin(true);
        setAdminToken(dummyToken);
        localStorage.setItem(
          STORAGE_ADMIN_KEY,
          JSON.stringify({ isAdmin: true, token: dummyToken, loggedAt: new Date().toISOString() })
        );
        setShowLoginModal(false);
        return { success: true };
      }
      return { success: false, message: e.message || "로그인 요청 중 오류가 발생했습니다." };
    }
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

    try {
      // Attempt server change first
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
        const data = await res.json();
        if (data.success) {
          localStorage.setItem(STORAGE_CUSTOM_PASS, cleanNew);
          return { success: true, message: data.message || "비밀번호가 성공적으로 변경되었습니다." };
        }
      } else {
        const data = await res.json().catch(() => null);
        if (data?.message) {
          return { success: false, message: data.message };
        }
      }
    } catch (e) {
      // Server unreachable, use client-side verification
    }

    // Client-side fallback check
    const validPasswords = getEffectiveClientPasswords();
    if (!validPasswords.includes(cleanCurrent)) {
      return { success: false, message: "현재 비밀번호가 일치하지 않습니다." };
    }

    localStorage.setItem(STORAGE_CUSTOM_PASS, cleanNew);
    return { success: true, message: "관리자 비밀번호가 성공적으로 변경되었습니다." };
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminToken(null);
    localStorage.removeItem(STORAGE_ADMIN_KEY);
    // Notify server asynchronously if possible
    fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminToken,
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
