import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import QRCode from "qrcode";
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Globe, 
  MessageCircle, 
  Send, 
  Sparkles, 
  Download,
  ExternalLink,
  Mail,
  FileText,
  Camera,
  Layers,
  Heart
} from "lucide-react";
import { useTranslation, Translate, LANGUAGES } from "../context/LanguageContext";

interface GlobalShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "social" | "campaign" | "qr" | "flyer";
}

export default function GlobalShareModal({ isOpen, onClose, initialTab = "social" }: GlobalShareModalProps) {
  const { language, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"social" | "campaign" | "qr" | "flyer">(initialTab);
  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedCampaign, setCopiedCampaign] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [flyerDataUrl, setFlyerDataUrl] = useState<string>("");
  const [isGeneratingFlyer, setIsGeneratingFlyer] = useState<boolean>(false);
  const [selectedLangPromo, setSelectedLangPromo] = useState<string>("en");
  
  const siteUrl = "https://corea-labs.com";

  // Pre-configured engaging messages for foreign travelers
  const promoMessages: Record<string, { title: string; text: string }> = {
    en: {
      title: "English (영어)",
      text: "🇰🇷 Planning a trip to South Korea? Explore corea-labs.com — the ultimate curated guide to seasonal festivals, royal palaces, UNESCO heritage, and hidden gems across Korea! Free & available in 11 languages: https://corea-labs.com"
    },
    ja: {
      title: "日本語 (일본어)",
      text: "🇰🇷 韓国旅行の計画なら corea-labs.com がおすすめ！全国の季節のお祭り、5大古宮、世界遺産、おすすめグルメ名所まで11言語で完全網羅！無料ガイドはこちら: https://corea-labs.com"
    },
    zh: {
      title: "中文 (중국어)",
      text: "🇰🇷 计划前往韩国旅行吗？欢迎访问 corea-labs.com — 全方位探索韩国四季传统庆典、五大古宫、联合国教科文组织世界遗产与精选景点！支持11种语言免费查阅: https://corea-labs.com"
    },
    es: {
      title: "Español (스페인어)",
      text: "🇰🇷 ¿Planeas viajar a Corea del Sur? ¡Descubre corea-labs.com! Tu guía esencial y gratuita de festivales tradicionales, palacios reales, gastronomía y patrimonio cultural en 11 idiomas: https://corea-labs.com"
    },
    fr: {
      title: "Français (프랑스어)",
      text: "🇰🇷 Vous préparez un voyage en Corée du Sud ? Explorez corea-labs.com : festivals traditionnels, palais royaux de Séoul, sites UNESCO et conseils de voyage en 11 langues : https://corea-labs.com"
    },
    th: {
      title: "ไทย (태국어)",
      text: "🇰🇷 วางแผนเที่ยวเกาหลีใต้? แนะนำ corea-labs.com แหล่งรวมข้อมูลเทศกาลประจำฤดู พระราชวัง แหล่งมรดกโลก และสถานที่ท่องเที่ยว พร้อมใช้งาน 11 ภาษา: https://corea-labs.com"
    },
    ru: {
      title: "Русский (러시아어)",
      text: "🇰🇷 Планируете поездку в Южную Корею? Откройте для себя corea-labs.com — бесплатный путеводитель по сезонным фестивалям, дворцам Сеула и культурному наследию ЮНЕСКО: https://corea-labs.com"
    },
    pt: {
      title: "Português (포르투갈어)",
      text: "🇰🇷 Planejando viajar para a Coreia do Sul? Descubra o corea-labs.com — seu guia gratuito com festivais sazonais, palácios reais de Seul e dicas essenciais em 11 idiomas: https://corea-labs.com"
    },
    ko: {
      title: "한국어",
      text: "🇰🇷 외국인 친구와 함께 즐기는 대한민국 문화유산 & 전국 축제 가이드 corea-labs.com! 11개 언어로 제공되는 생생한 한국 여행의 모든 것: https://corea-labs.com"
    }
  };

  // Pre-formatted viral promotion campaign templates
  const campaignKits = [
    {
      id: "reddit_travel",
      platform: "Reddit (r/koreatravel & r/solotravel)",
      icon: "r/",
      badge: "High Conversion",
      title: "Curated Free Korea Travel & Festival Resource (11 Languages)",
      content: `Hey everyone! For anyone planning a trip to South Korea this year, check out https://corea-labs.com — it's an interactive web guide built specifically for foreign travelers.

Key features:
• 🌸 Nationwide Seasonal Festivals (exact dates, locations, English transport info)
• 🏯 5 Grand Joseon Royal Palaces (entry hours, secret night openings, free Hanbok entry tips)
• 🗺️ Curated City Itineraries (Seoul, Busan, Jeju, Gyeongju, Gangneung, Jeonju)
• 🌐 Full 11 languages supported with on-the-fly translation
• 🎫 Essential Arrival & Currency Guide (T-Money, SIM/eSIM, 1330 24/7 Helpline)

100% free, no account or app install needed: https://corea-labs.com`
    },
    {
      id: "instagram_tiktok",
      platform: "Instagram & TikTok Captions",
      icon: "📸",
      badge: "Social Viral",
      title: "Aesthetic Korea Travel Guide & Hidden Gems",
      content: `Save this for your next trip to Korea! 🇰🇷✨

If you're visiting Seoul or exploring regional cities, @corea-labs (https://corea-labs.com) is the prettiest & most comprehensive interactive guide out there:
🌸 12+ Seasonal Festivals with real dates
🏯 Secret palace viewing tips & free Hanbok entry
🍜 Street food & cultural immersion guides
🌐 Available in 11 languages!

Link: https://corea-labs.com
#VisitKorea #KoreaTravel #SeoulTravel #CoreaLabs #KoreaFestivals #Gyeongbokgung #TravelKorea #KCulture #HiddenKorea`
    },
    {
      id: "xiaohongshu",
      platform: "Xiaohongshu (小红书) / Weibo (微博)",
      icon: "📕",
      badge: "China Travelers",
      title: "韩国自由行必备宝藏网站 (四季庆典 + 五大古宫 + 交通指南)",
      content: `🇰🇷 韩国自由行一定要收藏的神仙指南网站：corea-labs.com ！

🌟 亮点超全：
1. 韩国全境四季庆典日程（镇海樱花、保宁泥浆、安东假面节等中韩双语指南）
2. 首尔五大古宫穿韩服免费入场攻略与守门将交接仪式时间
3. 仁川机场入境、T-Money交通卡、WOWPASS换钱完全指南
4. 支持中文、英语、韩语等11种语言极速切换，免下载APP直接打开！

🔗 网址：https://corea-labs.com`
    },
    {
      id: "japanese_travel",
      platform: "X (Twitter) & Note (Japan)",
      icon: "🇯🇵",
      badge: "Japan Community",
      title: "韓国旅行・ソウル観光に超役立つ無料ガイドサイト",
      content: `韓国旅行を計画中の方へおすすめ！🇰🇷
11言語に対応した韓国観光ガイド「corea-labs.com」が本当に便利です。

🌸 全国の季節のお祭り完全まとめ（日程・アクセス）
🏯 5大古宮（景福宮・昌徳宮など）の韓服無料入場ガイド
🗺️ ソウル・釜山・済州島の厳選モデルコース
✨ 1330観光案内電話や両替・交通カード情報も網羅

無料ですぐ見られます👉 https://corea-labs.com
#韓国旅行 #ソウル旅行 #韓国情報 #corealabs`
    }
  ];

  // Generate QR Code data URL
  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(siteUrl, {
        width: 380,
        margin: 2,
        color: {
          dark: "#1c1917",
          light: "#ffffff"
        }
      })
      .then(url => {
        setQrDataUrl(url);
        generateFlyer(url);
      })
      .catch(err => console.error("QR Code generation error:", err));
    }
  }, [isOpen]);

  // Generate Digital Promotional Poster (Flyer Card) on Canvas
  const generateFlyer = (qrUrl: string) => {
    setIsGeneratingFlyer(true);
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background Gradient (Luxury Dark Tone)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1200);
    bgGrad.addColorStop(0, "#1c1917");
    bgGrad.addColorStop(0.5, "#292524");
    bgGrad.addColorStop(1, "#0c0a09");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 900, 1200);

    // Decorative Gold Outer Border
    ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 840, 1140);

    ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(38, 38, 824, 1124);

    // Header Tag
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 18px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText("✦ OFFICIAL GLOBAL TOURISM GUIDE ✦", 450, 90);

    // Main Logo & Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px 'Cinzel', 'Noto Serif', serif";
    ctx.fillText("COREA LABS", 450, 155);

    ctx.fillStyle = "#d6d3d1";
    ctx.font = "italic 20px 'Cinzel', 'Noto Serif', serif";
    ctx.fillText("Echoes of Time • Eternal Korean Heritage & Festivals", 450, 195);

    // Divider Line
    ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 220);
    ctx.lineTo(650, 220);
    ctx.stroke();

    // 4 Key Value Pillars
    const pillars = [
      "🏯 5 Grand Joseon Palaces & Free Hanbok Entry",
      "🌸 Nationwide Seasonal Festivals with Real Dates",
      "🗺️ Handpicked City Itineraries & Transit Tips",
      "🌐 11 World Languages with Real-time Translation"
    ];

    ctx.fillStyle = "#fafaf9";
    ctx.font = "18px 'Noto Sans', sans-serif";
    ctx.textAlign = "left";
    pillars.forEach((p, idx) => {
      ctx.fillText(p, 180, 280 + idx * 45);
    });

    // QR Code Container Box
    const qrSize = 340;
    const qrX = (900 - qrSize) / 2;
    const qrY = 470;

    ctx.fillStyle = "#ffffff";
    ctx.roundRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 28);
    ctx.fill();

    // Draw the QR Code image
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // QR Instruction Text
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 24px 'Noto Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SCAN WITH SMARTPHONE CAMERA", 450, 890);

      ctx.fillStyle = "#e7e5e4";
      ctx.font = "bold 20px 'Courier New', monospace";
      ctx.fillText("https://corea-labs.com", 450, 925);

      ctx.fillStyle = "#a8a29e";
      ctx.font = "16px 'Noto Sans', sans-serif";
      ctx.fillText("No App Download Required • 100% Free • Works in Any Browser", 450, 960);

      // 11 Flags Bar
      ctx.fillStyle = "#ffffff";
      ctx.font = "26px 'Noto Color Emoji', sans-serif";
      ctx.fillText("🇺🇸 🇰🇷 🇯🇵 🇨🇳 🇹🇭 🇫🇷 🇪🇸 🇷🇺 🇺🇦 🇬🇪 🇵🇹", 450, 1020);

      // Footer
      ctx.fillStyle = "#78716c";
      ctx.font = "14px 'Noto Sans', sans-serif";
      ctx.fillText("Crafted with Love for South Korea's Living Culture & Global Travelers", 450, 1080);
      ctx.fillText("© Corea Labs. All rights reserved.", 450, 1110);

      const finalData = canvas.toDataURL("image/png");
      setFlyerDataUrl(finalData);
      setIsGeneratingFlyer(false);
    };
    qrImg.src = qrUrl;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyMessage = () => {
    const text = promoMessages[selectedLangPromo]?.text || promoMessages.en.text;
    navigator.clipboard.writeText(text);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const handleCopyCampaign = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedCampaign(id);
    setTimeout(() => setCopiedCampaign(null), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Corea Labs | South Korea Travel Guide & Festivals",
          text: promoMessages[language] ? promoMessages[language].text : promoMessages.en.text,
          url: siteUrl
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  const downloadQrCode = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "corea-labs-qr-code.png";
    a.click();
  };

  const downloadFlyer = () => {
    if (!flyerDataUrl) return;
    const a = document.createElement("a");
    a.href = flyerDataUrl;
    a.download = "corea-labs-global-promo-flyer.png";
    a.click();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 max-h-[92vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 md:p-6 relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-lg md:text-xl text-white">
                      <Translate>corea-labs.com 전세계 글로벌 홍보 센터</Translate>
                    </h3>
                    <span className="text-[10px] bg-amber-400 text-stone-950 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                      Worldwide
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 font-sans mt-0.5">
                    <Translate>전 세계 외국인 관광객과 여행 커뮤니티에 corea-labs.com을 알리고 공유하세요</Translate>
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-1.5 mt-5 border-t border-white/10 pt-4 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("social")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "social"
                    ? "bg-white text-stone-900 font-semibold shadow-xs"
                    : "text-stone-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <Translate>글로벌 SNS 채널</Translate>
              </button>

              <button
                onClick={() => setActiveTab("campaign")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "campaign"
                    ? "bg-white text-stone-900 font-semibold shadow-xs"
                    : "text-stone-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <Translate>포럼·바이럴 홍보 문구</Translate>
              </button>

              <button
                onClick={() => setActiveTab("flyer")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "flyer"
                    ? "bg-white text-stone-900 font-semibold shadow-xs"
                    : "text-stone-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <Translate>홍보 포스터 카드</Translate>
              </button>

              <button
                onClick={() => setActiveTab("qr")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "qr"
                    ? "bg-white text-stone-900 font-semibold shadow-xs"
                    : "text-stone-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <Translate>QR 코드</Translate>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Quick URL Copy Box (Always Visible) */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-mono text-xs font-semibold text-stone-900 truncate">
                  {siteUrl}
                </span>
                <span className="hidden sm:inline-block text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-md font-mono">
                  11 Languages
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span><Translate>복사 완료!</Translate></span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span><Translate>링크 복사</Translate></span>
                  </>
                )}
              </button>
            </div>

            {/* TAB 1: SOCIAL CHANNELS */}
            {activeTab === "social" && (
              <div className="space-y-4">
                <div className="text-xs text-stone-500 font-medium">
                  <Translate>글로벌 관광객들이 가장 많이 이용하는 전 세계 주요 플랫폼에 1-클릭으로 바로 공유하세요:</Translate>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* WhatsApp (World's #1 Traveler App) */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(promoMessages.en.text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      WA
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">WhatsApp</div>
                      <div className="text-[10px] text-emerald-700/80 mt-1">글로벌 1위 메신저</div>
                    </div>
                  </a>

                  {/* Reddit (r/Korea, r/koreatravel) */}
                  <a
                    href={`https://www.reddit.com/submit?url=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent("Corea Labs – Interactive South Korea Travel, Heritage & Seasonal Festival Guide (11 Languages)")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-orange-100 bg-orange-50/50 hover:bg-orange-100/70 text-orange-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      r/
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">Reddit</div>
                      <div className="text-[10px] text-orange-700/80 mt-1">r/koreatravel 커뮤니티</div>
                    </div>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Exploring South Korea's vibrant seasonal festivals, palaces & UNESCO heritage at corea-labs.com 🇰🇷✨ Check it out:")}&url=${encodeURIComponent(siteUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      𝕏
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">X (Twitter)</div>
                      <div className="text-[10px] text-stone-500 mt-1">글로벌 바이럴 트렌드</div>
                    </div>
                  </a>

                  {/* Pinterest */}
                  <a
                    href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(siteUrl)}&description=${encodeURIComponent("Discover South Korea's vibrant festivals, royal palaces and travel itineraries in 11 languages at corea-labs.com")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-rose-100 bg-rose-50/50 hover:bg-rose-100/70 text-rose-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      P
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">Pinterest</div>
                      <div className="text-[10px] text-rose-700/80 mt-1">글로벌 여행 핀/무드보드</div>
                    </div>
                  </a>

                  {/* Line (Japan, Taiwan, Thailand) */}
                  <a
                    href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(siteUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-green-100 bg-green-50/50 hover:bg-green-100/70 text-green-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#06C755] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      L
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">LINE</div>
                      <div className="text-[10px] text-green-700/80 mt-1">일본 / 대만 / 태국</div>
                    </div>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(promoMessages.en.text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-sky-100 bg-sky-50/50 hover:bg-sky-100/70 text-sky-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <Send className="w-4 h-4 ml-0.5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">Telegram</div>
                      <div className="text-[10px] text-sky-700/80 mt-1">글로벌 여행자 그룹</div>
                    </div>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100/70 text-blue-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      in
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">LinkedIn</div>
                      <div className="text-[10px] text-blue-700/80 mt-1">문화·관광 비즈니스</div>
                    </div>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100/70 text-indigo-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      f
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">Facebook</div>
                      <div className="text-[10px] text-indigo-700/80 mt-1">페이스북 여행 그룹</div>
                    </div>
                  </a>

                  {/* Email / Newsletter */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent("Discover South Korea with corea-labs.com (11 Languages)")}&body=${encodeURIComponent(promoMessages.en.text)}`}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-amber-100 bg-amber-50/50 hover:bg-amber-100/70 text-amber-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">Email 추천</div>
                      <div className="text-[10px] text-amber-700/80 mt-1">외국인 친구 초대</div>
                    </div>
                  </a>
                </div>

                {/* Device Native Share API button */}
                <div className="pt-2">
                  <button
                    onClick={handleNativeShare}
                    className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-stone-200"
                  >
                    <Share2 className="w-4 h-4 text-stone-600" />
                    <Translate>기기 기본 공유 메뉴 열기 (AirDrop, 카카오톡, 메시지 등)</Translate>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: VIRAL PRESS & FORUM CAMPAIGN KITS */}
            {activeTab === "campaign" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600 font-medium">
                    <Translate>해외 주요 여행 포럼 및 SNS에 바로 게시할 수 있는 완성형 홍보 문구:</Translate>
                  </span>
                </div>

                <div className="space-y-3">
                  {campaignKits.map((camp) => (
                    <div key={camp.id} className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-900">{camp.icon}</span>
                          <span className="font-semibold text-xs text-stone-900">{camp.platform}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                            {camp.badge}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyCampaign(camp.id, camp.content)}
                          className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedCampaign === camp.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>복사됨!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>문구 복사</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-[11px] font-semibold text-stone-700">
                        {camp.title}
                      </div>

                      <pre className="text-[11px] text-stone-600 bg-white p-3 rounded-xl border border-stone-200/80 font-mono whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed select-all">
                        {camp.content}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PROMO POSTER CARD GENERATOR */}
            {activeTab === "flyer" && (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="max-w-md space-y-1">
                  <h4 className="text-sm font-bold text-stone-900">
                    <Translate>인스타그램 스토리 / 핀터레스트용 고화질 디지털 홍보 카드</Translate>
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    <Translate>외국인 친구, 게스트하우스, 여행자 단체방에 바로 전송하거나 출력 가능한 공식 홍보 카드입니다.</Translate>
                  </p>
                </div>

                {/* Poster Preview */}
                <div className="relative p-2 bg-stone-900 rounded-3xl shadow-xl border border-stone-800 max-w-xs w-full overflow-hidden">
                  {flyerDataUrl ? (
                    <img
                      src={flyerDataUrl}
                      alt="Corea Labs Global Promotion Flyer"
                      className="w-full h-auto rounded-2xl shadow-inner"
                    />
                  ) : (
                    <div className="w-full h-72 flex flex-col items-center justify-center text-stone-400 text-xs space-y-2">
                      <Sparkles className="w-6 h-6 animate-spin text-amber-400" />
                      <span>포스터 렌더링 중...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={downloadFlyer}
                    disabled={!flyerDataUrl || isGeneratingFlyer}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 text-stone-950" />
                    <span><Translate>홍보 포스터 다운로드 (PNG)</Translate></span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: QR CODE */}
            {activeTab === "qr" && (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-white border border-stone-200 rounded-3xl shadow-md inline-block">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="corea-labs.com QR Code"
                      className="w-52 h-52 object-contain"
                    />
                  ) : (
                    <div className="w-52 h-52 flex items-center justify-center text-stone-400 font-mono text-xs">
                      Generating QR...
                    </div>
                  )}
                  <div className="mt-2 text-[11px] font-mono text-stone-700 font-bold tracking-tight">
                    https://corea-labs.com
                  </div>
                </div>

                <div className="max-w-sm space-y-1">
                  <h4 className="text-sm font-bold text-stone-900">
                    <Translate>외국인 관광객 현장 즉시 스캔용 모바일 QR</Translate>
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    <Translate>공항, 지하철, 게스트하우스에서 스마트폰 카메라로 비추면 별도 앱 설치 없이 corea-labs.com이 즉각 11개 언어로 실행됩니다.</Translate>
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={downloadQrCode}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <Translate>QR 코드 다운로드 (PNG)</Translate>
                  </button>
                </div>
              </div>
            )}

            {/* Traveler Benefits / Why Foreigners Love Corea Labs */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-800 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="font-semibold text-xs text-amber-950">
                    <Translate>전 세계 관광객들이 corea-labs.com을 추천하는 이유</Translate>
                  </div>
                  <div className="text-[11px] text-amber-900/80 leading-relaxed space-y-1">
                    <div>• <Translate>전국 축제 실시간 일정, 위치, 영어 대중교통 이동 팁 제공</Translate></div>
                    <div>• <Translate>한국어, 영어, 일본어, 중국어, 스페인어 등 11개국 언어 지원</Translate></div>
                    <div>• <Translate>24시간 대한민국 1330 관광통역 긴급 콜센터 원터치 직통 연결</Translate></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
            <span className="font-mono text-[11px] font-semibold text-stone-700">corea-labs.com</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Translate>닫기</Translate>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
