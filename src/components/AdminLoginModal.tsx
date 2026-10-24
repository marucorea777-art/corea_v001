import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Lock, X, KeyRound, AlertCircle, CheckCircle, RefreshCw, BarChart3 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { Translate } from "../context/LanguageContext";

export default function AdminLoginModal() {
  const { showLoginModal, setShowLoginModal, login, changePassword, isAdmin, logout, setShowAnalyticsModal } = useAdmin();
  
  const [activeTab, setActiveTab] = useState<"login" | "changePassword">("login");
  const [password, setPassword] = useState("");
  
  // Change password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!showLoginModal) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }
    setError(null);
    setIsLoading(true);
    const res = await login(password.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg("관리자로 로그인되었습니다.");
      setTimeout(() => {
        setSuccessMsg(null);
        setPassword("");
        setShowLoginModal(false);
      }, 700);
    } else {
      setError(res.message || "비밀번호가 올바르지 않습니다.");
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!currentPassword.trim()) {
      setError("현재 비밀번호를 입력해 주세요.");
      return;
    }
    if (!newPassword.trim()) {
      setError("새 비밀번호를 입력해 주세요.");
      return;
    }
    if (newPassword.trim().length < 4) {
      setError("새 비밀번호는 4자리 이상이어야 합니다.");
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setError("새 비밀번호와 확인 입력이 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    const res = await changePassword(currentPassword.trim(), newPassword.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg("관리자 비밀번호가 성공적으로 변경되었습니다!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setSuccessMsg(null);
        if (!isAdmin) {
          setActiveTab("login");
        }
      }, 1500);
    } else {
      setError(res.message || "비밀번호 변경에 실패했습니다.");
    }
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setError(null);
    setSuccessMsg(null);
    setPassword("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setActiveTab("login");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-stone-900 text-white p-6 relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  <Translate>관리자 모드 설정</Translate>
                </h3>
                <p className="text-xs text-stone-300 font-sans">
                  <Translate>추천명소 및 전국 축제 관리 & 비밀번호 설정</Translate>
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-850 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-stone-200 bg-stone-50">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === "login"
                  ? "border-amber-500 text-stone-900 bg-white font-bold"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAdmin ? <Translate>관리자 상태</Translate> : <Translate>관리자 로그인</Translate>}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("changePassword");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === "changePassword"
                  ? "border-amber-500 text-stone-900 bg-white font-bold"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
              <span><Translate>비밀번호 변경</Translate></span>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {activeTab === "login" ? (
              isAdmin ? (
                <div className="space-y-4 text-center py-2">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-stone-900 text-base">
                      <Translate>관리자로 이미 로그인되어 있습니다</Translate>
                    </h4>
                    <p className="text-xs text-stone-500">
                      <Translate>추천명소 및 전국 축제의 수동 등록, 편집, 삭제 권한이 활성화되어 있습니다.</Translate>
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        setShowAnalyticsModal(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <BarChart3 className="w-4 h-4 text-stone-950" />
                      <span><Translate>방문자 및 국가별 통계 대시보드 열기</Translate></span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("changePassword")}
                      className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                      <span><Translate>관리자 비밀번호 변경하기</Translate></span>
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleClose}
                        className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        <Translate>확인 (닫기)</Translate>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          handleClose();
                        }}
                        className="py-2.5 px-4 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Translate>로그아웃</Translate>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                      <span><Translate>관리자 비밀번호</Translate></span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        placeholder="비밀번호 입력 (기본: admin1234)"
                        autoFocus
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-mono"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-stone-400" />
                        <span><Translate>기본 비밀번호</Translate>: <strong className="text-stone-600 font-mono">admin1234</strong></span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("changePassword");
                          setError(null);
                        }}
                        className="text-amber-600 hover:text-amber-700 font-semibold hover:underline cursor-pointer"
                      >
                        <Translate>비밀번호 변경</Translate>
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{successMsg}</span>
                    </motion.div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-stone-900 hover:bg-stone-850 text-white rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-60"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>{isLoading ? <Translate>확인 중...</Translate> : <Translate>관리자 로그인</Translate>}</span>
                    </button>
                  </div>
                </form>
              )
            ) : (
              /* Change Password Form */
              <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    <Translate>현재 비밀번호</Translate> *
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="현재 관리자 비밀번호 (기본: admin1234)"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    <Translate>새 비밀번호</Translate> * (4자리 이상)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="새로운 비밀번호 입력"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    <Translate>새 비밀번호 확인</Translate> *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="새 비밀번호 다시 한 번 입력"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-mono"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setError(null);
                    }}
                    className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Translate>취소</Translate>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                    <span>{isLoading ? <Translate>변경 처리 중...</Translate> : <Translate>비밀번호 변경하기</Translate>}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
