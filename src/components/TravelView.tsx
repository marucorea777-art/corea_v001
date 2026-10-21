import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Globe, 
  PlaneLanding, 
  Coins, 
  ExternalLink, 
  Info, 
  CheckCircle, 
  ArrowRight, 
  CheckSquare, 
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { useTranslation, Translate } from "../context/LanguageContext";

interface ChecklistItem {
  id: string;
  text: string;
  category: "visa" | "arrival" | "finance";
  completed: boolean;
}

type SupportedCurrency = 
  | "USD" | "JPY" | "EUR" | "CNY" 
  | "GBP" | "AUD" | "CAD" | "SGD" 
  | "HKD" | "TWD" | "THB" | "VND";

const DEFAULT_RATES: Record<SupportedCurrency, number> = {
  USD: 1380,
  JPY: 8.85,
  EUR: 1500,
  CNY: 190,
  GBP: 1780,
  AUD: 910,
  CAD: 1010,
  SGD: 1020,
  HKD: 177,
  TWD: 42,
  THB: 38,
  VND: 0.055,
};

export default function TravelView() {
  const { language, t } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState<"visa" | "arrival" | "finance">("visa");
  
  // Interactive Checklist State
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "1", text: "여권 유효기간 확인 (최소 6개월 이상 권장)", category: "visa", completed: true },
    { id: "2", text: "국적에 따른 무비자 여부 확인 및 K-ETA 신청", category: "visa", completed: false },
    { id: "3", text: "Q-Code 검역 사전 입력 및 QR코드 다운로드", category: "arrival", completed: false },
    { id: "4", text: "기내 입국신고서 작성법 미리 숙지하기", category: "arrival", completed: false },
    { id: "5", text: "원화 환전 비율 결정 (소액 현금 + 선불카드 조합)", category: "finance", completed: false },
    { id: "6", text: "WOWPASS 또는 NAMANE 외국인 선불카드 사전 예약", category: "finance", completed: false },
  ]);

  // Currency Converter State
  const [amountInForeign, setAmountInForeign] = useState<string>("100");
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>("USD");
  const [rates, setRates] = useState<Record<SupportedCurrency, number>>(DEFAULT_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);

  const fetchLiveRates = async () => {
    setIsLoadingRates(true);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!res.ok) throw new Error("Primary API request failed");
      const data = await res.json();
      if (data && data.result === "success" && data.rates && data.rates.KRW) {
        const krwUsd = data.rates.KRW;
        const updatedRates: Record<SupportedCurrency, number> = {
          USD: krwUsd,
          JPY: data.rates.JPY ? krwUsd / data.rates.JPY : DEFAULT_RATES.JPY,
          EUR: data.rates.EUR ? krwUsd / data.rates.EUR : DEFAULT_RATES.EUR,
          CNY: data.rates.CNY ? krwUsd / data.rates.CNY : DEFAULT_RATES.CNY,
          GBP: data.rates.GBP ? krwUsd / data.rates.GBP : DEFAULT_RATES.GBP,
          AUD: data.rates.AUD ? krwUsd / data.rates.AUD : DEFAULT_RATES.AUD,
          CAD: data.rates.CAD ? krwUsd / data.rates.CAD : DEFAULT_RATES.CAD,
          SGD: data.rates.SGD ? krwUsd / data.rates.SGD : DEFAULT_RATES.SGD,
          HKD: data.rates.HKD ? krwUsd / data.rates.HKD : DEFAULT_RATES.HKD,
          TWD: data.rates.TWD ? krwUsd / data.rates.TWD : DEFAULT_RATES.TWD,
          THB: data.rates.THB ? krwUsd / data.rates.THB : DEFAULT_RATES.THB,
          VND: data.rates.VND ? krwUsd / data.rates.VND : DEFAULT_RATES.VND,
        };
        setRates(updatedRates);
        setIsLive(true);
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString(language === "ko" ? "ko-KR" : "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      }
    } catch (err) {
      console.warn("Failed to fetch live exchange rates, trying fallback endpoint:", err);
      try {
        const resFallback = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const dataFallback = await resFallback.json();
        if (dataFallback && dataFallback.rates && dataFallback.rates.KRW) {
          const krwUsd = dataFallback.rates.KRW;
          const updatedRates: Record<SupportedCurrency, number> = {
            USD: krwUsd,
            JPY: dataFallback.rates.JPY ? krwUsd / dataFallback.rates.JPY : DEFAULT_RATES.JPY,
            EUR: dataFallback.rates.EUR ? krwUsd / dataFallback.rates.EUR : DEFAULT_RATES.EUR,
            CNY: dataFallback.rates.CNY ? krwUsd / dataFallback.rates.CNY : DEFAULT_RATES.CNY,
            GBP: dataFallback.rates.GBP ? krwUsd / dataFallback.rates.GBP : DEFAULT_RATES.GBP,
            AUD: dataFallback.rates.AUD ? krwUsd / dataFallback.rates.AUD : DEFAULT_RATES.AUD,
            CAD: dataFallback.rates.CAD ? krwUsd / dataFallback.rates.CAD : DEFAULT_RATES.CAD,
            SGD: dataFallback.rates.SGD ? krwUsd / dataFallback.rates.SGD : DEFAULT_RATES.SGD,
            HKD: dataFallback.rates.HKD ? krwUsd / dataFallback.rates.HKD : DEFAULT_RATES.HKD,
            TWD: dataFallback.rates.TWD ? krwUsd / dataFallback.rates.TWD : DEFAULT_RATES.TWD,
            THB: dataFallback.rates.THB ? krwUsd / dataFallback.rates.THB : DEFAULT_RATES.THB,
            VND: dataFallback.rates.VND ? krwUsd / dataFallback.rates.VND : DEFAULT_RATES.VND,
          };
          setRates(updatedRates);
          setIsLive(true);
          const now = new Date();
          setLastUpdated(now.toLocaleTimeString(language === "ko" ? "ko-KR" : "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        }
      } catch (e) {
        console.error("Fallback exchange rate API also failed:", e);
      }
    } finally {
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchLiveRates();
  }, []);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const handleConvert = () => {
    const amt = parseFloat(amountInForeign) || 0;
    const rate = rates[selectedCurrency] || DEFAULT_RATES[selectedCurrency];
    return Math.round(amt * rate).toLocaleString();
  };

  const getSingleRateLabel = () => {
    const rate = rates[selectedCurrency] || DEFAULT_RATES[selectedCurrency];
    if (selectedCurrency === "JPY") {
      return `100 JPY ≒ ${(rate * 100).toLocaleString(undefined, { maximumFractionDigits: 1 })} KRW`;
    }
    if (selectedCurrency === "VND") {
      return `1,000 VND ≒ ${(rate * 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} KRW`;
    }
    return `1 ${selectedCurrency} ≒ ${rate.toLocaleString(undefined, { maximumFractionDigits: 2 })} KRW`;
  };

  return (
    <div className="space-y-10">
      {/* Visual Header Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-stone-900 text-stone-100 p-8 md:p-12 flex flex-col justify-end min-h-[220px] shadow-lg border border-stone-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-25 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-[11px] font-mono font-medium border border-amber-500/30">
            <Translate>TRAVELER ESSENTIALS</Translate>
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">
            <Translate>대한민국 입국 & 환전 가이드</Translate>
          </h1>
          <p className="text-stone-300 text-xs md:text-sm max-w-2xl font-sans leading-relaxed">
            <Translate>비자 발급 방법부터 입국 심사, 세관 한도 및 현명한 환전과 대중교통 이용을 위한 선불카드 혜택까지 성공적인 한국 여행을 위한 핵심 정보만을 모았습니다.</Translate>
          </p>
        </div>
      </section>

      {/* Main Grid: Guide & Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Core Travel Guides */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Sub-Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200/50">
            <button
              onClick={() => setActiveSubTab("visa")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === "visa" 
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200/40" 
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Globe className="w-4 h-4" />
              <Translate>비자 & K-ETA</Translate>
            </button>
            <button
              onClick={() => setActiveSubTab("arrival")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === "arrival" 
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200/40" 
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <PlaneLanding className="w-4 h-4" />
              <Translate>입국 절차 & 서류</Translate>
            </button>
            <button
              onClick={() => setActiveSubTab("finance")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === "finance" 
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200/40" 
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Coins className="w-4 h-4" />
              <Translate>환전 & 현지 결제</Translate>
            </button>
          </div>

          {/* Guide Content Panel */}
          <div className="bg-white rounded-3xl border border-stone-200/60 p-6 md:p-8 shadow-xs">
            {activeSubTab === "visa" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-600" />
                    <Translate>비자 발급 및 K-ETA 가이드</Translate>
                  </h2>
                  <p className="text-xs text-stone-500 font-mono tracking-tight mt-1">Visa Application & K-ETA (Korea Electronic Travel Authorization)</p>
                </div>

                <div className="space-y-6 text-sm text-stone-600 leading-relaxed font-sans">
                  
                  {/* K-ETA Detail Card */}
                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500 text-stone-900 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md">CORE INFO</span>
                      <h3 className="font-bold text-stone-900"><Translate>K-ETA (대한민국 전자여행허가제)란?</Translate></h3>
                    </div>
                    <p className="text-stone-700 text-xs md:text-sm">
                      <Translate>대한민국에 무비자 입국이 가능한 국가의 외국인 관광객이 출발 전 웹사이트나 모바일 앱을 통해 사전에 개인 및 여행 관련 정보를 입력해 여행 허가를 받는 제도입니다.</Translate>
                    </p>
                    <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1.5 mt-2">
                      <li><strong><Translate>신청 기한</Translate>:</strong> <Translate>항공기 탑승 최소 72시간 전까지 신청 완료 권장</Translate></li>
                      <li><strong><Translate>유효 기간</Translate>:</strong> <Translate>발급일로부터 3년 (기간 내 반복 입국 가능)</Translate></li>
                      <li><strong><Translate>신청 수수료</Translate>:</strong> <Translate>한화 10,000원 (온라인 카드 결제)</Translate></li>
                      <li><strong><Translate>주의사항</Translate>:</strong> <Translate>여권 갱신 시 K-ETA도 재발급받아야 합니다.</Translate></li>
                    </ul>
                    <div className="pt-2">
                      <a 
                        href="https://www.k-eta.go.kr" 
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
                      >
                        <Translate>공식 K-ETA 신청 누리집 바로가기</Translate>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Visa Exempt Temporary Waiver Notice */}
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <Translate>일부 국가 대상 K-ETA 한시적 면제 안내</Translate>
                    </div>
                    <p className="text-stone-700 text-xs leading-relaxed">
                      <Translate>현재 관광 산업 활성화를 위해 미국, 일본, 캐나다, 영국, 독일, 프랑스 등 22개 국가 및 지역의 여행객에 대해서는 K-ETA 신청이 한시적으로 면제됩니다. 대상 여부를 미리 공식 웹사이트에서 확인해 보세요.</Translate>
                    </p>
                  </div>

                  {/* Standard Tourist Visa */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-stone-900 text-base border-l-2 border-stone-800 pl-2"><Translate>단기 일반 관광 비자 (C-3-9)</Translate></h3>
                    <p className="text-stone-700 text-xs md:text-sm">
                      <Translate>무비자 협정이 체결되어 있지 않거나 K-ETA 신청이 반려된 국가의 국민은 거주지 관할 대한민국 대사관 또는 영사관(재외공관)을 통해 직접 종이 비자를 신청하여 승인을 받아야 합니다.</Translate>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/50 text-xs">
                        <strong className="block text-stone-900 mb-1"><Translate>제출 필요 서류</Translate></strong>
                        <Translate>사전 비자 신청 시 여권 원본, 비자신청서, 반명함판 사진, 항공권 및 숙박 예약 확인서, 재정 능력을 증명할 수 있는 서류(은행 잔고증명서 등)가 필요합니다.</Translate>
                      </div>
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/50 text-xs">
                        <strong className="block text-stone-900 mb-1"><Translate>소요 기간 및 팁</Translate></strong>
                        <Translate>국가별 공관 업무 상황에 따라 보통 1주에서 3주 이상 소요될 수 있으므로, 여행 예정일보다 충분히 앞서 신청하는 것이 안전합니다.</Translate>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeSubTab === "arrival" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <PlaneLanding className="w-5 h-5 text-amber-600" />
                    <Translate>안전하고 신속한 입국 절차</Translate>
                  </h2>
                  <p className="text-xs text-stone-500 font-mono tracking-tight mt-1">Arrival Step-by-Step Guide & Customs Policy</p>
                </div>

                <div className="space-y-6 text-sm text-stone-600 leading-relaxed font-sans">
                  
                  {/* Step List */}
                  <div className="space-y-4">
                    <div className="relative pl-8 before:absolute before:left-3.5 before:top-8 before:bottom-0 before:w-0.5 before:bg-stone-200">
                      <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center text-white font-mono text-xs font-bold">1</div>
                      <h3 className="font-bold text-stone-900 text-sm"><Translate>출발 전: Q-CODE 건강상태 입력</Translate></h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        <Translate>한국 도착 후 빠른 검역 심사를 위해 출발 전에 Q-CODE 웹사이트에 검역 및 건강 정보를 입력한 뒤 생성되는 QR코드를 저장해 두세요. 비행기에서 내린 후 간편한 태그만으로 신속하게 전용 통로를 통과할 수 있습니다.</Translate>
                      </p>
                    </div>

                    <div className="relative pl-8 before:absolute before:left-3.5 before:top-8 before:bottom-0 before:w-0.5 before:bg-stone-200">
                      <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center text-white font-mono text-xs font-bold">2</div>
                      <h3 className="font-bold text-stone-900 text-sm"><Translate>도착 후: 검역 심사 (Quarantine)</Translate></h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        <Translate>비행기에서 하기한 후, 검역대를 거치게 됩니다. 사전에 등록한 Q-CODE의 QR코드를 스캔하거나 기내에서 배부해 준 노란색 건강상태 질문서를 서면으로 작성해 제출해야 합니다.</Translate>
                      </p>
                    </div>

                    <div className="relative pl-8 before:absolute before:left-3.5 before:top-8 before:bottom-0 before:w-0.5 before:bg-stone-200">
                      <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center text-white font-mono text-xs font-bold">3</div>
                      <h3 className="font-bold text-stone-900 text-sm"><Translate>도착 후: 입국 심사 (Immigration)</Translate></h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        <Translate>지문 등록과 얼굴 인식을 실시하는 자동 또는 대면 심사대를 통과합니다. 대한민국 비자(또는 K-ETA 허가서)를 미리 준비해야 하며, K-ETA 승인을 받지 않은 외국인의 경우 기내에서 작성한 흰색 종이 '입국신고서(Arrival Card)'를 제출해야 합니다.</Translate>
                      </p>
                    </div>

                    <div className="relative pl-8">
                      <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center text-white font-mono text-xs font-bold">4</div>
                      <h3 className="font-bold text-stone-900 text-sm"><Translate>마지막 단계: 세관 심사 (Customs Declaration)</Translate></h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        <Translate>위탁 수하물을 찾은 후 세관 통로를 지납니다. 현재는 신고할 물품이 없는 경우 '세관신고서'를 제출할 필요가 전혀 없습니다. 면세 한도를 초과하거나 신고 대상 물품이 있는 여행객만 자진 신고 전용 통로로 이동해 서면 또는 앱을 통해 신고하면 됩니다.</Translate>
                      </p>
                    </div>
                  </div>

                  {/* Duty Free Limits */}
                  <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/50 space-y-3 mt-4">
                    <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs tracking-tight">
                      <Info className="w-4 h-4 text-stone-600" />
                      <Translate>대한민국 면세점 구매 및 입국 반입 한도</Translate>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-stone-600">
                      <div className="bg-white p-3 rounded-xl border border-stone-100">
                        <span className="block font-bold text-stone-800 mb-1"><Translate>기본 면세 범위</Translate></span>
                        <Translate>총액 합산 USD $800 이하의 물품 (국내 면세점 및 해외 구매 물품 포함)</Translate>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-stone-100">
                        <span className="block font-bold text-stone-800 mb-1"><Translate>주류 및 향수</Translate></span>
                        <Translate>주류 총 2병 (합산 2리터 이하, USD $400 이하) 및 향수 60ml 이하</Translate>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-stone-100">
                        <span className="block font-bold text-stone-800 mb-1"><Translate>담배</Translate></span>
                        <Translate>일반 담배 200개비 (1보루), 전자담배 등의 경우 기준량 별도 적용</Translate>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeSubTab === "finance" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-600" />
                    <Translate>현명한 환전 기법과 대중교통 선불카드</Translate>
                  </h2>
                  <p className="text-xs text-stone-500 font-mono tracking-tight mt-1">Currency Exchange Tips & Smart Payment cards in Korea</p>
                </div>

                <div className="space-y-6 text-sm text-stone-600 leading-relaxed font-sans">
                  
                  {/* Exchange Tips Card */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-stone-900 text-base border-l-2 border-stone-800 pl-2"><Translate>대한민국 환전 팁</Translate></h3>
                    <p className="text-stone-700 text-xs md:text-sm">
                      <Translate>대한민국은 상용화된 카드 문화 덕에 많은 환전이 불필요합니다. 단, 일부 전통시장, 길거리 간식, 지하철 승차권 구매 등을 위한 소액의 원화(KRW) 현금만 준비하시는 것이 경제적입니다.</Translate>
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2 bg-amber-500/[0.03] p-4 rounded-2xl border border-stone-200/50">
                        <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <Translate>최상의 환율 명동 사설 환전소</Translate>
                        </div>
                        <p className="text-stone-600 text-xs leading-relaxed">
                          <Translate>서울의 명동 구역(명동 대사관 앞 환전소, 머니박스 등)은 수수료 우대율이 매우 높아 가장 우수한 환율로 외화를 원화로 바꿀 수 있어 여행객들에게 전설적인 명소입니다.</Translate>
                        </p>
                      </div>
                      <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200/50">
                        <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                          <span className="w-2 h-2 rounded-full bg-stone-400" />
                          <Translate>공항 & 은행 모바일 신청 환전</Translate>
                        </div>
                        <p className="text-stone-600 text-xs leading-relaxed">
                          <Translate>인천공항 내 오프라인 부스는 급한 경우가 아니면 피하는 것이 유리합니다. 대신, 신한·하나·우리 등 시내 주요 은행의 모바일 전용 앱을 활용해 사전 신청 후 인천공항 창구에서 수령하면 수수료를 아낄 수 있습니다.</Translate>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Systems (WOWPASS / NAMANE) */}
                  <div className="space-y-4 pt-2">
                    <h3 className="font-bold text-stone-900 text-base border-l-2 border-stone-800 pl-2"><Translate>외국인 전용 스마트 선불카드</Translate></h3>
                    <p className="text-stone-700 text-xs md:text-sm">
                      <Translate>대한민국은 '현금 없는 사회'에 가깝습니다. 작은 분식점이나 택시에서도 해외 신용카드 결제가 가능하지만, 결제 수수료 부담과 대중교통 이용 편의를 위해 외국인 관광객 전용 선불카드를 사용하는 것이 압도적으로 편리합니다.</Translate>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* WOWPASS Detail */}
                      <div className="p-5 rounded-2xl border border-stone-200 bg-white shadow-2xs space-y-3 hover:border-stone-400 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 font-mono tracking-widest bg-stone-100 px-2 py-1 rounded">WOWPASS</span>
                          <span className="text-[10px] text-amber-600 font-bold bg-amber-100/40 px-2 py-0.5 rounded-full"><Translate>추천</Translate> ★★★</span>
                        </div>
                        <h4 className="font-bold text-stone-900 text-sm"><Translate>외국인 전용 올인원 카드</Translate></h4>
                        <p className="text-stone-500 text-xs leading-relaxed">
                          <Translate>주요 지하철역 및 호텔에 비치된 무인 키오스크(자판기)에서 즉시 발급받아 자국 통화(USD, JPY 등)를 직접 입금해 원화로 카드에 바로 충전해 온·오프라인 매장에서 일반 신용카드처럼 긁을 수 있습니다.</Translate>
                        </p>
                        <ul className="text-xs text-stone-600 list-disc pl-4 space-y-1">
                          <li><Translate>티머니(T-money) 교통카드 기능 내장</Translate></li>
                          <li><Translate>키오스크에서 남은 잔액을 즉시 원화 현금으로 출금 가능</Translate></li>
                          <li><Translate>모바일 앱 연동 실시간 알림 제공</Translate></li>
                        </ul>
                      </div>

                      {/* NAMANE Detail */}
                      <div className="p-5 rounded-2xl border border-stone-200 bg-white shadow-2xs space-y-3 hover:border-stone-400 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 font-mono tracking-widest bg-stone-100 px-2 py-1 rounded">NAMANE CARD</span>
                          <span className="text-[10px] text-stone-500 font-bold bg-stone-150 px-2 py-0.5 rounded-full"><Translate>나만의 디자인</Translate></span>
                        </div>
                        <h4 className="font-bold text-stone-900 text-sm"><Translate>커스터마이징 포토 카드</Translate></h4>
                        <p className="text-stone-500 text-xs leading-relaxed">
                          <Translate>모바일 앱에서 자신이 좋아하는 이미지나 사진(K-pop 아티스트, 가족, 반려동물 등)을 올려 카드 앞면을 예쁘게 디자인한 뒤 편의점이나 키오스크에서 직접 실물로 인쇄할 수 있어 소장 가치가 큽니다.</Translate>
                        </p>
                        <ul className="text-xs text-stone-600 list-disc pl-4 space-y-1">
                          <li><Translate>교통카드 및 쇼핑 카드 별도 충전/전환 가능</Translate></li>
                          <li><Translate>해외 신용카드나 모바일 페이(WeChat 등)로 간편 충전 가능</Translate></li>
                          <li><Translate>한국 여행 기념품 및 커스텀 인쇄에 탁월</Translate></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Travel Tools (Checklist & Converter) */}
        <div className="space-y-6">
          
          {/* Real-time Currency Converter */}
          <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 border border-stone-800 shadow-lg space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 flex items-center gap-1.5 font-bold">
                  <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                  {isLive ? <Translate>LIVE EXCHANGE RATES</Translate> : <Translate>REALTIME ESTIMATOR</Translate>}
                </span>
                <button
                  onClick={fetchLiveRates}
                  disabled={isLoadingRates}
                  title={language === "ko" ? "실시간 환율 새로고침" : "Refresh live rates"}
                  className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRates ? "animate-spin text-amber-400" : ""}`} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-white mt-2 flex items-center gap-1.5">
                <Coins className="w-4.5 h-4.5 text-amber-400" />
                <Translate>실시간 원화 환산기</Translate>
              </h3>
              <p className="text-stone-400 text-[11px] font-sans mt-1">
                <Translate>실시간 매매기준율 환율 정보로 정확한 원화 가치를 계산합니다.</Translate>
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[10px] text-stone-400 font-mono uppercase">
                  <Translate>FOREIGN CURRENCY</Translate>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={amountInForeign}
                    onChange={(e) => setAmountInForeign(e.target.value)}
                    className="flex-1 bg-stone-800 border border-stone-700/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value as SupportedCurrency)}
                    className="bg-stone-800 border border-stone-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500 font-mono font-bold cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="SGD">SGD ($)</option>
                    <option value="HKD">HKD ($)</option>
                    <option value="TWD">TWD (NT$)</option>
                    <option value="THB">THB (฿)</option>
                    <option value="VND">VND (₫)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center text-stone-500">
                <ArrowRight className="w-5 h-5 rotate-90 lg:rotate-0" />
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-center space-y-0.5">
                <span className="text-[10px] text-amber-500 font-mono tracking-widest block uppercase">
                  <Translate>REALTIME KRW (원화 가치)</Translate>
                </span>
                <span className="text-xl font-mono font-extrabold text-white">₩ {handleConvert()}</span>
                <span className="text-[10px] text-emerald-400/90 font-mono block pt-1">
                  {getSingleRateLabel()}
                </span>
              </div>
            </div>
            
            <div className="space-y-1.5 pt-1">
              {lastUpdated && (
                <div className="text-[10px] text-stone-400 font-mono flex items-center justify-between">
                  <span><Translate>실시간 업데이트</Translate>:</span>
                  <span className="text-emerald-400 font-bold">{lastUpdated}</span>
                </div>
              )}
              <div className="text-[10px] text-stone-500 font-sans leading-relaxed flex items-start gap-1">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  <Translate>글로벌 실시간 매매기준율이 적용되며, 카드사/환전소 우대율 및 결제 수수료에 따라 실제 청구액은 다소 차이가 있을 수 있습니다.</Translate>
                </span>
              </div>
            </div>
          </div>

          {/* Travel Prep Interactive Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <CheckSquare className="w-4.5 h-4.5 text-amber-600" />
                <Translate>입국 준비 체크리스트</Translate>
              </h3>
              <span className="text-[10px] font-mono text-stone-400">
                {checklist.filter(item => item.completed).length} / {checklist.length} <Translate>완료</Translate>
              </span>
            </div>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className="w-full flex items-start gap-2.5 p-3 rounded-xl hover:bg-stone-50 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {item.completed ? (
                      <CheckCircle className="w-4.5 h-4.5 text-stone-900 fill-stone-900 text-white" />
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-md border border-stone-300 group-hover:border-stone-500 transition-colors" />
                    )}
                  </div>
                  <span className={`text-xs font-sans leading-tight ${
                    item.completed ? "text-stone-400 line-through" : "text-stone-700"
                  }`}>
                    <Translate>{item.text}</Translate>
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button 
                onClick={() => setChecklist(prev => prev.map(item => ({ ...item, completed: false })))}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <Translate>체크리스트 초기화하기</Translate>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
