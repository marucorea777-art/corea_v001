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
  Tablet,
  RefreshCw,
  Download,
  Calendar,
  Sparkles,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Eye,
  Activity
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
  const [timeRange, setTimeRange] = useState<"all" | "30d" | "7d" | "today">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handleReset = async () => {
    if (window.confirm("통계 데이터를 기본 초기 데이터로 재설정하시겠습니까?")) {
      const ok = await resetAnalyticsData();
      if (ok) {
        showToast("통계 데이터가 기본값으로 재설정되었습니다.");
        loadData(false);
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCSV = () => {
    if (!stats) return;
    const rows = [
      ["분류", "항목", "방문수", "비율(%)"],
      ...stats.countries.map(c => ["국가", c.name, c.count.toString(), `${c.percentage}%`]),
      ...stats.languages.map(l => ["언어", l.name, l.count.toString(), `${l.percentage}%`]),
      ...stats.pages.map(p => ["페이지", p.name, p.count.toString(), `${p.percentage}%`]),
      ...stats.devices.map(d => ["기기", d.name, d.count.toString(), `${d.percentage}%`]),
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

  const maxDailyCount = Math.max(...(stats?.dailyTrend.map(d => d.count) || [500]), 1);

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
              <div className="py-20 text-center text-stone-500 text-xs">
                <Translate>통계 데이터를 불러오지 못했습니다.</Translate>
              </div>
            ) : (
              <>
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
                      <span>+18.4% <Translate>전주 대비</Translate></span>
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
                      <Translate>글로벌 관광객 유입 강세</Translate>
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
                  </div>

                  {/* RIGHT: Daily Traffic Chart & Popular Pages (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Daily Visitors Trend Chart (SVG) */}
                    <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          <Translate>최근 일별 방문자 추이 (14일)</Translate>
                        </h4>
                        <span className="text-[10px] font-mono text-stone-400">Daily Volume</span>
                      </div>

                      {/* Bar Visualization */}
                      <div className="pt-2">
                        <div className="h-36 flex items-end gap-1.5 justify-between border-b border-stone-200 pb-1">
                          {stats.dailyTrend.map((d, idx) => {
                            const barHeightPercent = Math.max(Math.round((d.count / maxDailyCount) * 100), 8);
                            const isToday = idx === stats.dailyTrend.length - 1;
                            return (
                              <div
                                key={d.date}
                                className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer"
                              >
                                {/* Tooltip */}
                                <div className="absolute -top-8 bg-stone-900 text-white text-[9px] font-mono px-2 py-0.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                  {d.date}: {d.count}명
                                </div>
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: `${barHeightPercent}%` }}
                                  transition={{ duration: 0.5, delay: idx * 0.03 }}
                                  className={`w-full rounded-t-sm transition-colors ${
                                    isToday
                                      ? "bg-amber-500 group-hover:bg-amber-600"
                                      : "bg-stone-300 group-hover:bg-stone-400"
                                  }`}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-[9px] text-stone-400 font-mono mt-1 px-1">
                          <span>{stats.dailyTrend[0]?.date.slice(5)}</span>
                          <span><Translate>최근 14일</Translate></span>
                          <span className="font-bold text-amber-600">{stats.dailyTrend[stats.dailyTrend.length - 1]?.date.slice(5)} (오늘)</span>
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
            <div className="flex items-center gap-2 text-stone-400">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span><Translate>관리자 전용 통계 시스템</Translate></span>
              <span>•</span>
              <button
                onClick={handleReset}
                className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer text-[11px] underline"
              >
                <Translate>통계 초기화</Translate>
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Translate>닫기</Translate>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
