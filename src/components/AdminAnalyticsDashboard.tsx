import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Users,
  Globe,
  TrendingUp,
  Clock,
  Smartphone,
  Monitor,
  RefreshCw,
  Download,
  Calendar,
  Sparkles,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Eye,
  Activity,
  Info,
  RotateCcw,
  Database,
  Trash2,
  AlertTriangle
} from "lucide-react";
import {
  fetchAnalyticsStats,
  resetAnalyticsData,
  AnalyticsStatsResponse,
  CountryStat
} from "../services/analytics";
import { Translate, useTranslation } from "../context/LanguageContext";

interface AdminAnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminAnalyticsDashboard({ isOpen, onClose }: AdminAnalyticsDashboardProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<AnalyticsStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    mode: "zero" | "seed";
    title: string;
    description: string;
    actionText: string;
    isDestructive: boolean;
  } | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const loadData = async (showLoadingState = true) => {
    if (showLoadingState) setLoading(true);
    setIsRefreshing(true);
    const data = await fetchAnalyticsStats();
    if (data) {
      setStats(data);
    }
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadData(true);
    }
  }, [isOpen]);

  const requestReset = (mode: "zero" | "seed" = "seed") => {
    if (mode === "zero") {
      setConfirmModal({
        mode: "zero",
        title: "데모 방문자 데이터 삭제 (0부터 시작)",
        description:
          "기존의 14,821명 시연용 데모 통계를 모두 삭제하고, 순수 실제 접속자(0부터)만 100% 실시간으로 집계하시겠습니까?\n\n(언제든지 다시 '데모 기준치 복원' 버튼을 눌러 시연용 데이터로 복원할 수 있습니다.)",
        actionText: "데모 데이터 지우기 (0부터 시작)",
        isDestructive: true,
      });
    } else {
      setConfirmModal({
        mode: "seed",
        title: "데모 시연용 데이터 복원",
        description:
          "시연 및 발표용 기준 데이터(14,821명, 국가별/기기별/일별 예시 통계)를 다시 불러오시겠습니까?",
        actionText: "데모 데이터 복원하기",
        isDestructive: false,
      });
    }
  };

  const executeReset = async (mode: "zero" | "seed") => {
    setIsResetting(true);
    const ok = await resetAnalyticsData(mode);
    setIsResetting(false);
    setConfirmModal(null);
    if (ok) {
      showToast(
        mode === "zero"
          ? "데모 데이터가 모두 삭제되었습니다. 이제 실제 방문자만 0부터 집계됩니다."
          : "통계 데이터가 데모 기준치(시연용 14,821명)로 복원되었습니다."
      );
      await loadData(false);
    } else {
      showToast("데이터 초기화 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportCSV = () => {
    if (!stats) return;
    const rows = [
      ["분류", "항목", "방문수", "비율(%)"],
      ...stats.countries.map(c => ["국가", c.name, c.count.toString(), `${c.percentage}%`]),
      ...stats.languages.map(l => ["언어", l.name, l.count.toString(), `${l.percentage}%`]),
      ...stats.pages.map(p => ["페이지", p.name, p.count.toString(), `${p.percentage}%`]),
      ...stats.devices.map(d => ["기기", d.name, d.count.toString(), `${d.percentage}%`]),
      ...stats.dailyTrend.map(t => ["일별추이", t.date, t.count.toString(), "-"]),
    ];
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `corea-labs-analytics-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV 통계 보고서가 다운로드되었습니다.");
  };

  if (!isOpen) return null;

  const filteredCountries = (stats?.countries || []).filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dailyTrend = stats?.dailyTrend || [];
  const dailyCounts = dailyTrend.map(d => d.count);
  const maxDailyCount = Math.max(...dailyCounts, 10);
  const total14Days = dailyCounts.reduce((a, b) => a + b, 0);
  const avg14Days = dailyCounts.length > 0 ? Math.round(total14Days / dailyCounts.length) : 0;
  const peakItem = dailyTrend.reduce(
    (prev, curr) => (curr.count > (prev?.count || 0) ? curr : prev),
    dailyTrend[0] || { date: "", count: 0 }
  );

  // SVG Chart path calculation (viewBox: 0 0 500 120)
  const svgWidth = 500;
  const svgHeight = 120;
  const paddingX = 18;
  const chartPoints = dailyTrend.map((d, i) => {
    const x = dailyTrend.length > 1
      ? paddingX + (i / (dailyTrend.length - 1)) * (svgWidth - paddingX * 2)
      : svgWidth / 2;
    const y = svgHeight - 15 - (d.count / maxDailyCount) * 85;
    return { x, y, ...d };
  });

  const svgLinePath = chartPoints.length > 0
    ? `M ${chartPoints[0].x} ${chartPoints[0].y} ` +
      chartPoints.slice(1).map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
    : "";

  const svgAreaPath = chartPoints.length > 0
    ? `${svgLinePath} L ${chartPoints[chartPoints.length - 1].x} ${svgHeight - 10} L ${chartPoints[0].x} ${svgHeight - 10} Z`
    : "";

  const isPureRealOnly = Boolean(stats?.summary?.isPureRealOnly);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-6xl bg-stone-50 rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 md:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md shrink-0">
                <Globe className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg md:text-xl text-white">
                    <Translate>방문자 및 국가별 통계 분석 대시보드</Translate>
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-stone-300 font-sans mt-0.5">
                  <Translate>corea-labs.com 실시간 방문자 수, 외국인 유입 국가별 통계 및 인기 콘텐츠 모니터링</Translate>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {isPureRealOnly ? (
                <button
                  onClick={() => requestReset("seed")}
                  disabled={isResetting || isRefreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-amber-400/30"
                  title="데모 기준치 복원 (시연용 14,821명)"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline"><Translate>데모 데이터 복원</Translate></span>
                </button>
              ) : (
                <button
                  onClick={() => requestReset("zero")}
                  disabled={isResetting || isRefreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-rose-500/30"
                  title="데모 데이터 삭제 (실제 0부터 시작)"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline"><Translate>데모 데이터 지우기</Translate></span>
                </button>
              )}

              <button
                onClick={() => loadData(false)}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-stone-200 rounded-xl text-xs font-medium transition-colors cursor-pointer border border-white/10"
                title="통계 새로고침"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-amber-400" : ""}`} />
                <span className="hidden md:inline"><Translate>새로고침</Translate></span>
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-stone-200 rounded-xl text-xs font-medium transition-colors cursor-pointer border border-white/10"
                title="CSV 다운로드"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline"><Translate>CSV 내보내기</Translate></span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-emerald-600 text-white text-xs px-4 py-2 flex items-center justify-between font-medium">
              <span>{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="text-emerald-100 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Content Body (Scrollable) */}
          <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                <p className="text-xs font-medium text-stone-500 font-mono">
                  <Translate>방문자 및 국가별 통계 집계 중...</Translate>
                </p>
              </div>
            ) : !stats ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3 text-stone-500 text-xs">
                <p><Translate>통계 데이터를 불러오는 중 지연이 발생했습니다.</Translate></p>
                <button
                  onClick={() => loadData(true)}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span><Translate>통계 다시 불러오기</Translate></span>
                </button>
              </div>
            ) : (
              <>
                {/* Data Transparency & Pure-Real Toggle Banner */}
                <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs ${
                  isPureRealOnly
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                    : "bg-amber-50/70 border-amber-200 text-stone-800"
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isPureRealOnly ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
                    }`}>
                      <Database className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-sm font-semibold">
                          {isPureRealOnly ? "🌱 순수 실제 방문객 유입 집계 모드 (100% Genuine Real)" : "📊 실시간 실제 방문 추적 + 기준 시드 모드"}
                        </strong>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isPureRealOnly ? "bg-emerald-200 text-emerald-800" : "bg-amber-200 text-amber-800"
                        }`}>
                          {isPureRealOnly ? "PURE REAL-ONLY" : "HYBRID TRACKING"}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        {isPureRealOnly
                          ? "인위적인 샘플 데이터를 배제하고, 실제 접속자의 세션, 국가, 언어, 페이지 클릭만 0부터 100% 실시간 누적 기록 중입니다."
                          : "현재 통계는 사이트 개설 시 초기 레이아웃 예시(시드 데이터) 위에 실제 사용자의 접속(국가/기기/페이지)이 1건씩 실시간 누적 가산되고 있습니다."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {isPureRealOnly ? (
                      <button
                        onClick={() => requestReset("seed")}
                        disabled={isResetting}
                        className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-700 rounded-xl font-semibold border border-stone-200 transition-colors cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                        <span><Translate>데모 데이터 복원 (14,821명)</Translate></span>
                      </button>
                    ) : (
                      <button
                        onClick={() => requestReset("zero")}
                        disabled={isResetting}
                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all cursor-pointer text-xs flex items-center gap-1.5 shadow-xs active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                        <span><Translate>데모버전 지우기 (0부터 시작)</Translate></span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 1. Summary KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                  
                  {/* Total Visitors */}
                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-stone-500 text-xs">
                      <span className="font-semibold text-stone-600"><Translate>총 누적 방문자</Translate></span>
                      <Users className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold font-mono text-stone-900 tracking-tight">
                      {stats.summary.totalVisits.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      <span>{isPureRealOnly ? "실제 유입 누적" : "+18.4% 전주 대비"}</span>
                    </div>
                  </div>

                  {/* Today Visitors */}
                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-stone-500 text-xs">
                      <span className="font-semibold text-stone-600"><Translate>오늘 방문자 (Today)</Translate></span>
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold font-mono text-stone-900 tracking-tight">
                      {stats.summary.todayVisits.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      {new Date().toISOString().split("T")[0]}
                    </div>
                  </div>

                  {/* International Ratio */}
                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-stone-500 text-xs">
                      <span className="font-semibold text-stone-600"><Translate>해외 방문객 비율</Translate></span>
                      <Globe className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold font-mono text-emerald-700 tracking-tight">
                      {stats.summary.intlRatio}%
                    </div>
                    <div className="text-[11px] text-emerald-600/80 font-sans">
                      <Translate>글로벌 관광객 유입 현황</Translate>
                    </div>
                  </div>

                  {/* Unique Devices */}
                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-stone-500 text-xs">
                      <span className="font-semibold text-stone-600"><Translate>순 방문자 (Unique)</Translate></span>
                      <Smartphone className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold font-mono text-stone-900 tracking-tight">
                      {stats.summary.uniqueVisitors.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-stone-400 font-sans">
                      <Translate>고유 디바이스 기준</Translate>
                    </div>
                  </div>

                  {/* Live Active */}
                  <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white p-4 md:p-5 rounded-2xl border border-stone-800 shadow-2xs space-y-2 col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between text-stone-300 text-xs">
                      <span className="font-semibold text-amber-300"><Translate>실시간 접속자</Translate></span>
                      <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
                      <span>{stats.summary.onlineNow}</span>
                      <span className="text-xs font-normal text-stone-400">명</span>
                    </div>
                    <div className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span><Translate>평균 체류</Translate>: {stats.summary.avgDuration}</span>
                    </div>
                  </div>

                </div>

                {/* 2. Main Two Columns: Country Breakdown + Trend Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* LEFT: Country Statistics Breakdown (7 cols) */}
                  <div className="lg:col-span-7 bg-white p-5 md:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <Globe className="w-4 h-4 text-amber-600" />
                          <Translate>국가별 방문자 분포 (Top Countries)</Translate>
                        </h4>
                        <p className="text-[11px] text-stone-400">
                          <Translate>전 세계 접속자들의 국가별 방문 수치 및 점유율 현황</Translate>
                        </p>
                      </div>

                      {/* Search box for countries */}
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="국가 검색 (예: US, Japan, 한국)"
                        className="text-xs px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-amber-400 w-44"
                      />
                    </div>

                    {/* Countries List with Progress Bars */}
                    {filteredCountries.length === 0 ? (
                      <div className="py-12 text-center text-xs text-stone-400">
                        {isPureRealOnly ? "아직 등록된 국가별 유입 데이터가 없습니다." : "검색된 국가가 없습니다."}
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {filteredCountries.map((c) => (
                          <div key={c.code} className="group hover:bg-stone-50/80 p-2 rounded-xl transition-colors">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <div className="flex items-center gap-2 font-medium text-stone-800">
                                <span className="text-base">{c.flag}</span>
                                <span className="font-semibold">{c.name}</span>
                                <span className="text-[10px] text-stone-400 font-mono">({c.code})</span>
                              </div>
                              <div className="flex items-center gap-3 font-mono">
                                <span className="font-bold text-stone-900">{c.count.toLocaleString()}회</span>
                                <span className="w-12 text-right text-stone-500 font-semibold">{c.percentage}%</span>
                              </div>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(c.percentage * 2.8, 100)}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className={`h-full rounded-full ${
                                  c.code === "US"
                                    ? "bg-blue-600"
                                    : c.code === "JP"
                                    ? "bg-red-500"
                                    : c.code === "CN" || c.code === "TW"
                                    ? "bg-amber-500"
                                    : c.code === "KR"
                                    ? "bg-stone-800"
                                    : "bg-teal-500"
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Daily Traffic Chart & Popular Pages (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Daily Visitors Trend Chart (SVG Curve + Bars) */}
                    <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <Translate>최근 일별 방문자 추이 (14일)</Translate>
                          </h4>
                          <p className="text-[11px] text-stone-400">
                            14일 누적: <strong className="text-stone-700">{total14Days.toLocaleString()}명</strong> (일평균 {avg14Days.toLocaleString()}명)
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                            최고치: {peakItem?.count || 0}명 ({peakItem?.date?.slice(5)})
                          </span>
                        </div>
                      </div>

                      {/* Interactive Visual Arena */}
                      <div className="relative pt-2 pb-1">
                        {/* Background Grid Guide Lines */}
                        <div className="absolute inset-x-0 top-3 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
                          <div className="border-b border-dashed border-stone-200 flex justify-between text-[9px] text-stone-400 font-mono pr-1">
                            <span></span>
                            <span>{maxDailyCount}명</span>
                          </div>
                          <div className="border-b border-dashed border-stone-200 flex justify-between text-[9px] text-stone-400 font-mono pr-1">
                            <span></span>
                            <span>{Math.round(maxDailyCount / 2)}명</span>
                          </div>
                          <div className="border-b border-stone-200 flex justify-between text-[9px] text-stone-400 font-mono pr-1">
                            <span></span>
                            <span>0명</span>
                          </div>
                        </div>

                        {/* SVG Trend Area Curve Overlay */}
                        <div className="relative h-44 w-full">
                          <svg
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                            preserveAspectRatio="none"
                          >
                            <defs>
                              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
                                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
                              </linearGradient>
                            </defs>
                            {svgAreaPath && (
                              <path d={svgAreaPath} fill="url(#trendGradient)" />
                            )}
                            {svgLinePath && (
                              <path
                                d={svgLinePath}
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            )}
                          </svg>

                          {/* 14 Interactive Pillar Columns with Guaranteed Pixel Heights */}
                          <div className="absolute inset-0 flex items-end justify-between gap-1 px-1">
                            {dailyTrend.map((d, idx) => {
                              const isToday = idx === dailyTrend.length - 1;
                              const isHovered = hoveredIdx === idx;
                              // Pixel height calculation based on 110px max height
                              const barHeightPx = Math.max(
                                Math.round((d.count / maxDailyCount) * 110),
                                d.count > 0 ? 8 : 3
                              );
                              const dayLabel = d.date.slice(8); // Day of month e.g. "11", "24"
                              const fullDateShort = d.date.slice(5); // e.g. "10-24"

                              return (
                                <div
                                  key={d.date}
                                  onMouseEnter={() => setHoveredIdx(idx)}
                                  onMouseLeave={() => setHoveredIdx(null)}
                                  className="flex-1 h-full flex flex-col justify-end items-center relative group cursor-pointer"
                                >
                                  {/* Floating Info Tooltip */}
                                  <div
                                    className={`absolute -top-10 bg-stone-900 text-white text-[10px] font-mono px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap z-30 transition-all pointer-events-none ${
                                      isHovered
                                        ? "opacity-100 scale-100 -translate-y-1"
                                        : "opacity-0 scale-95 pointer-events-none"
                                    }`}
                                  >
                                    <div className="font-bold text-amber-300">
                                      {fullDateShort} {isToday ? "(오늘)" : ""}
                                    </div>
                                    <div className="text-stone-200">
                                      방문자: <strong>{d.count.toLocaleString()}명</strong>
                                    </div>
                                  </div>

                                  {/* Top dot on the curve */}
                                  <div
                                    className={`w-2 h-2 rounded-full mb-1 transition-all z-20 ${
                                      isToday
                                        ? "bg-amber-500 ring-2 ring-amber-300 animate-pulse"
                                        : isHovered
                                        ? "bg-amber-600 ring-2 ring-amber-200"
                                        : "bg-stone-300 opacity-60"
                                    }`}
                                  />

                                  {/* Bar Pillar */}
                                  <div
                                    style={{ height: `${barHeightPx}px` }}
                                    className={`w-full max-w-[16px] sm:max-w-[20px] rounded-t-md transition-all duration-300 shadow-2xs ${
                                      isToday
                                        ? "bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 group-hover:brightness-110"
                                        : isHovered
                                        ? "bg-stone-500"
                                        : "bg-stone-300 group-hover:bg-stone-400"
                                    }`}
                                  />

                                  {/* Day label */}
                                  <div className="mt-1.5 text-center">
                                    <span
                                      className={`text-[9px] font-mono block leading-none ${
                                        isToday
                                          ? "text-amber-700 font-bold bg-amber-100/80 px-1 py-0.5 rounded"
                                          : "text-stone-400 group-hover:text-stone-700"
                                      }`}
                                    >
                                      {dayLabel}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Bottom Chart Footer Legend */}
                        <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono mt-3 px-2 border-t border-stone-100 pt-2">
                          <span>📅 {dailyTrend[0]?.date.slice(5)} (14일 전)</span>
                          <span className="flex items-center gap-1.5 text-stone-500">
                            <span className="w-2.5 h-2.5 rounded-xs bg-stone-300 inline-block" />
                            <span>일반 방문</span>
                            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block ml-1" />
                            <span className="text-amber-700 font-semibold">오늘 ({dailyTrend[dailyTrend.length - 1]?.date.slice(5)})</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Popular Content Sections */}
                    <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
                      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <Compass className="w-4 h-4 text-purple-600" />
                        <Translate>가장 인기 있는 섹션 (Top Pages)</Translate>
                      </h4>

                      <div className="space-y-2.5">
                        {stats.pages.map((p) => (
                          <div key={p.path} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-stone-800">{p.name}</span>
                              <span className="font-mono text-stone-500 font-bold">{p.count.toLocaleString()}회 ({p.percentage}%)</span>
                            </div>
                            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${p.percentage}%` }}
                                className="bg-purple-600 h-full rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 3. Bottom Row: Languages, Devices & Referral Channels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Languages Breakdown */}
                  <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
                    <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-stone-500">
                      <Translate>사용자 선택 언어 (Languages)</Translate>
                    </h4>
                    <div className="space-y-2">
                      {stats.languages.map((l) => (
                        <div key={l.code} className="flex items-center justify-between text-xs">
                          <span className="font-medium text-stone-700">{l.name}</span>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="text-stone-900 font-semibold">{l.count.toLocaleString()}</span>
                            <span className="text-stone-400 text-[11px]">({l.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Devices Breakdown */}
                  <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
                    <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-stone-500">
                      <Translate>접속 기기 분석 (Devices)</Translate>
                    </h4>
                    <div className="space-y-2.5">
                      {stats.devices.map((d) => (
                        <div key={d.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-stone-700 font-medium">
                            {d.name.includes("모바일") ? <Smartphone className="w-4 h-4 text-stone-500" /> : <Monitor className="w-4 h-4 text-stone-500" />}
                            <span>{d.name}</span>
                          </div>
                          <span className="font-mono font-bold text-stone-900">{d.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Referral Channels */}
                  <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
                    <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-stone-500">
                      <Translate>주요 유입 경로 (Traffic Sources)</Translate>
                    </h4>
                    <div className="space-y-2">
                      {stats.referrers.map((r) => (
                        <div key={r.name} className="flex items-center justify-between text-xs">
                          <span className="font-medium text-stone-700 truncate pr-2">{r.name}</span>
                          <span className="font-mono font-bold text-stone-900">{r.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* 4. Live Real-Time Recent Visitor Logs */}
                <div className="bg-white p-5 md:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <Translate>실시간 접속자 로그 (Recent Live Visitors)</Translate>
                      </h4>
                      <p className="text-[11px] text-stone-400">
                        <Translate>전 세계에서 corea-labs.com으로 유입된 최근 방문 세션</Translate>
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">
                      {stats.recentVisitors.length} <Translate>기록</Translate>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-100 text-[11px] text-stone-400 uppercase font-mono">
                          <th className="py-2 px-3">국가 / 위치</th>
                          <th className="py-2 px-3">방문 페이지</th>
                          <th className="py-2 px-3">언어</th>
                          <th className="py-2 px-3">기기</th>
                          <th className="py-2 px-3 text-right">방문 시간</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50 font-sans">
                        {stats.recentVisitors.slice(0, 10).map((v) => (
                          <tr key={v.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="py-2.5 px-3 flex items-center gap-2 font-medium text-stone-800">
                              <span className="text-base">{v.flag}</span>
                              <span>{v.country}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[11px]">
                                /{v.path}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 uppercase font-mono text-stone-600 font-semibold">
                              {v.language}
                            </td>
                            <td className="py-2.5 px-3 text-stone-600 capitalize">
                              {v.device}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-stone-400 text-[11px]">
                              {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </>
            )}
          </div>

          {/* Footer Bar */}
          <div className="bg-stone-100 px-6 py-3.5 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 shrink-0">
            <div className="flex flex-wrap items-center gap-3 text-stone-400">
              <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span><Translate>관리자 전용 통계 시스템</Translate></span>
              </div>
              <span className="hidden sm:inline text-stone-300">•</span>
              <button
                onClick={() => requestReset("zero")}
                disabled={isResetting}
                className="text-stone-500 hover:text-rose-600 transition-colors cursor-pointer text-[11px] font-medium underline flex items-center gap-1"
                title="인위적 시드를 모두 지우고 실제 유입자만 0부터 집계"
              >
                <Trash2 className="w-3 h-3 text-rose-500" />
                <Translate>데모 데이터 지우기 (순수 실제 0부터 집계)</Translate>
              </button>
              <span className="text-stone-300">|</span>
              <button
                onClick={() => requestReset("seed")}
                disabled={isResetting}
                className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer text-[11px] underline flex items-center gap-1"
                title="데모 기준치 시드로 복원"
              >
                <RotateCcw className="w-3 h-3 text-stone-400" />
                <Translate>데모 기준치 복구</Translate>
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Translate>닫기</Translate>
            </button>
          </div>

          {/* In-App Confirmation Modal (Eliminates blocked window.confirm in iframe) */}
          {confirmModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 10 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 text-stone-900 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    confirmModal.isDestructive ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                  }`}>
                    {confirmModal.isDestructive ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <RotateCcw className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-stone-900">
                      {confirmModal.title}
                    </h4>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {confirmModal.mode === "zero" ? "RESET_TO_REAL_TRAFFIC" : "RESTORE_SAMPLE_SEED"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 whitespace-pre-line leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                  {confirmModal.description}
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    disabled={isResetting}
                    onClick={() => setConfirmModal(null)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Translate>취소</Translate>
                  </button>
                  <button
                    type="button"
                    disabled={isResetting}
                    onClick={() => executeReset(confirmModal.mode)}
                    className={`px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                      confirmModal.isDestructive
                        ? "bg-rose-600 hover:bg-rose-700 active:scale-95"
                        : "bg-amber-600 hover:bg-amber-700 active:scale-95"
                    }`}
                  >
                    {isResetting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span><Translate>처리 중...</Translate></span>
                      </>
                    ) : (
                      <>
                        {confirmModal.isDestructive ? <Trash2 className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                        <span>{confirmModal.actionText}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
