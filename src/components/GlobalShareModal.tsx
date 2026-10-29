import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import QRCode from "qrcode";
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Globe, 
  Send, 
  Sparkles, 
  Download,
  ExternalLink,
  Mail,
  FileText,
  Camera,
  Search,
  TrendingUp,
  CheckCircle2,
  Link2
} from "lucide-react";
import { useTranslation, Translate } from "../context/LanguageContext";

interface GlobalShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "seo" | "social" | "campaign" | "qr" | "flyer";
}

export default function GlobalShareModal({ isOpen, onClose, initialTab = "seo" }: GlobalShareModalProps) {
  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState<"seo" | "social" | "campaign" | "qr" | "flyer">(initialTab);
  const [copied, setCopied] = useState(false);
  const [copiedUtm, setCopiedUtm] = useState(false);
  const [copiedUtmMsg, setCopiedUtmMsg] = useState(false);
  const [copiedCampaign, setCopiedCampaign] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [flyerDataUrl, setFlyerDataUrl] = useState<string>("");
  const [isGeneratingFlyer, setIsGeneratingFlyer] = useState<boolean>(false);
  const [selectedLangPromo, setSelectedLangPromo] = useState<string>("en");
  const [selectedUtmChannel, setSelectedUtmChannel] = useState<string>("reddit");
  
  const siteUrl = "https://corea-labs.com";
  const qrTrackedUrl = `${siteUrl}/?utm_source=qrcode&utm_medium=poster`;

  const utmChannels = [
    { id: "reddit", label: "Reddit (r/koreatravel)", medium: "forum" },
    { id: "whatsapp", label: "WhatsApp 글로벌 공유", medium: "messenger" },
    { id: "x_twitter", label: "X (Twitter) 바이럴", medium: "social" },
    { id: "instagram", label: "Instagram · TikTok", medium: "shortform" },
    { id: "xiaohongshu", label: "Xiaohongshu (중국 샤오홍슈)", medium: "social_cn" },
    { id: "line", label: "LINE (일본·대만·태국)", medium: "messenger_asia" },
    { id: "chatgpt", label: "AI Search / 블로그 추천", medium: "referral" },
    { id: "qrcode", label: "QR 포스터 · 오프라인", medium: "poster" },
  ];

  const customTrackedUrl = `${siteUrl}/?lang=${selectedLangPromo}&utm_source=${selectedUtmChannel}&utm_medium=${
    utmChannels.find((c) => c.id === selectedUtmChannel)?.medium || "social"
  }`;

  // Pre-configured engaging messages for foreign travelers (with dynamic URL injection)
  const getPromoMessage = (langCode: string, targetLink: string = siteUrl): { title: string; flag: string; text: string } => {
    const dict: Record<string, { title: string; flag: string; text: string }> = {
      en: {
        title: "English (미국·영국·글로벌)",
        flag: "🇺🇸",
        text: `🇰🇷 Planning a trip to South Korea? Explore corea-labs.com — the ultimate curated guide to seasonal festivals, 5 royal palaces, UNESCO heritage, and hidden gems across Korea! Free & available in 11 languages: ${targetLink}`
      },
      ja: {
        title: "日本語 (일본)",
        flag: "🇯🇵",
        text: `🇰🇷 韓国旅行の計画なら corea-labs.com がおすすめ！全国の季節のお祭り、ソウル5大古宮の韓服無料入場ガイド、世界遺産、おすすめ名所まで11言語で完全網羅！無料ガイドはこちら: ${targetLink}`
      },
      zh: {
        title: "简体中文 (중국·대만·싱가포르)",
        flag: "🇨🇳",
        text: `🇰🇷 计划前往韩国自由行吗？欢迎访问 corea-labs.com — 全方位探索韩国四季传统庆典、五大古宫韩服免费入场攻略、世界遗产与精选景点！支持11种语言免费查阅: ${targetLink}`
      },
      es: {
        title: "Español (스페인·중남미)",
        flag: "🇪🇸",
        text: `🇰🇷 ¿Planeas viajar a Corea del Sur? ¡Descubre corea-labs.com! Tu guía interactiva y gratuita de festivales tradicionales, palacios reales de Seúl y patrimonio cultural en 11 idiomas: ${targetLink}`
      },
      fr: {
        title: "Français (프랑스·유럽)",
        flag: "🇫🇷",
        text: `🇰🇷 Vous préparez un voyage en Corée du Sud ? Explorez corea-labs.com : festivals saisonniers, palais royaux de Séoul, sites UNESCO et conseils pratiques en 11 langues : ${targetLink}`
      },
      th: {
        title: "ไทย (태국)",
        flag: "🇹🇭",
        text: `🇰🇷 วางแผนเที่ยวเกาหลีใต้? แนะนำ corea-labs.com แหล่งรวมข้อมูลเทศกาลประจำฤดู พระราชวังโซล แหล่งมรดกโลก และสถานที่ท่องเที่ยว พร้อมใช้งาน 11 ภาษาฟรี: ${targetLink}`
      },
      ru: {
        title: "Русский (러시아·중앙아시아)",
        flag: "🇷🇺",
        text: `🇰🇷 Планируете поездку в Южную Корею? Откройте для себя corea-labs.com — бесплатный путеводитель по сезонным фестивалям, дворцам Сеула и наследию ЮНЕСКО на 11 языках: ${targetLink}`
      },
      pt: {
        title: "Português (브라질·포르투갈)",
        flag: "🇧🇷",
        text: `🇰🇷 Planejando viajar para a Coreia do Sul? Descubra o corea-labs.com — seu guia gratuito com festivais sazonais, palácios reais de Seul e dicas essenciais em 11 idiomas: ${targetLink}`
      },
      uk: {
        title: "Українська (우크라이나)",
        flag: "🇺🇦",
        text: `🇰🇷 Плануєте подорож до Південної Кореї? Відкрийте для себе corea-labs.com — безкоштовний путівник сезонними фестивалями, королівськими палацами Сеула та спадщиною ЮНЕСКО: ${targetLink}`
      },
      ka: {
        title: "ქართული (조지아)",
        flag: "🇬🇪",
        text: `🇰🇷 გეგმავთ მოგზაურობას სამხრეთ კორეაში? აღმოაჩინეთ corea-labs.com — სეზონური ფესტივალების, სამეფო სასახლეებისა და იუნესკოს მემკვიდრეობის უფასო გზამკვლევი 11 ენაზე: ${targetLink}`
      },
      ko: {
        title: "한국어 (국내·외국인 친구 초대)",
        flag: "🇰🇷",
        text: `🇰🇷 외국인 친구와 함께 떠나는 대한민국 문화유산 & 전국 축제 가이드 corea-labs.com! 11개 언어로 실시간 번역되는 한국 여행의 모든 것: ${targetLink}`
      }
    };
    return dict[langCode] || dict.en;
  };

  // Pre-formatted viral promotion campaign templates with UTM tracking links
  const campaignKits = [
    {
      id: "reddit_travel",
      platform: "Reddit (r/koreatravel & r/solotravel)",
      icon: "r/",
      badge: "북미·유럽 유입 1위",
      postUrl: `https://www.reddit.com/submit?url=${encodeURIComponent(`${siteUrl}/?lang=en&utm_source=reddit&utm_medium=forum`)}&title=${encodeURIComponent("Curated Free South Korea Travel, Royal Palace & Seasonal Festival Guide (11 Languages)")}`,
      title: "Curated Free Korea Travel & Festival Resource (11 Languages)",
      content: `Hey everyone! For anyone planning a trip to South Korea this year, check out https://corea-labs.com/?lang=en&utm_source=reddit — it's an interactive web guide built specifically for foreign travelers.

Key features:
• 🌸 Nationwide Seasonal Festivals (exact dates, locations, English transport info)
• 🏯 5 Grand Joseon Royal Palaces (entry hours, night openings, free Hanbok entry tips)
• 🗺️ Curated City Itineraries (Seoul, Busan, Jeju, Gyeongju, Gangneung, Jeonju)
• 🌐 Full 11 languages supported with instant translation
• 🎫 Essential Arrival & Currency Guide (T-Money, WOWPASS, eSIM, 1330 24/7 Helpline)

100% free, no account or app install needed: https://corea-labs.com/?lang=en&utm_source=reddit`
    },
    {
      id: "japanese_travel",
      platform: "X (Twitter) & Note / LINE (일본 여행객 타겟)",
      icon: "🇯🇵",
      badge: "일본 유입 핵심",
      postUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent("韓国旅行を計画中の方へおすすめ！🇰🇷 全国の季節のお祭り・5大古宮の韓服無料入場・ソウル/釜山/済州コースを11言語で網羅した無料ガイド：")}&url=${encodeURIComponent(`${siteUrl}/?lang=ja&utm_source=x_twitter&utm_medium=social_jp`)}`,
      title: "韓国旅行・ソウル観光に超役立つ無料ガイドサイト",
      content: `韓国旅行を計画中の方へおすすめ！🇰🇷
11言語に対応した韓国観光ガイド「corea-labs.com」が本当に便利です。

🌸 全国の季節のお祭り完全まとめ（日程・アクセス）
🏯 5大古宮（景福宮・昌徳宮など）の韓服無料入場ガイド
🗺️ ソウル・釜山・済州島の厳選モデルコース
✨ 1330観光案内電話やWOWPASS両替・交通カード情報も網羅

アプリ不要・無料ですぐ見られます👉 https://corea-labs.com/?lang=ja&utm_source=x_twitter
#韓国旅行 #ソウル旅行 #韓国情報 #渡韓 #corealabs`
    },
    {
      id: "xiaohongshu",
      platform: "Xiaohongshu (小红书) / Weibo (중화권 자유여행 타겟)",
      icon: "📕",
      badge: "중화권 유입 핵심",
      postUrl: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(`${siteUrl}/?lang=zh&utm_source=xiaohongshu&utm_medium=social_cn`)}&title=${encodeURIComponent("🇰🇷 韩国自由行一定要收藏的神仙指南网站 corea-labs.com（四季庆典+五大古宫+入境交通指南）")}`,
      title: "韩国自由行必备宝藏网站 (四季庆典 + 五大古宫 + 交通指南)",
      content: `🇰🇷 韩国自由行一定要收藏的神仙指南网站：corea-labs.com ！

🌟 亮点超全：
1. 韩国全境四季庆典日程（镇海樱花、保宁泥浆、晋州南江流灯节等中文指南）
2. 首尔五大古宫穿韩服免费入场攻略与守门将交接仪式时间
3. 仁川机场入境、T-Money交通卡、WOWPASS换钱完全指南
4. 支持中文、英语、韩语等11种语言极速切换，免下载APP直接打开！

🔗 网址：https://corea-labs.com/?lang=zh&utm_source=xiaohongshu`
    },
    {
      id: "instagram_tiktok",
      platform: "Instagram Reels & TikTok / YouTube Shorts",
      icon: "📸",
      badge: "글로벌 MZ 바이럴",
      postUrl: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(`${siteUrl}/?lang=en&utm_source=instagram&utm_medium=shortform`)}&description=${encodeURIComponent("Save this for your next trip to South Korea! 12+ Seasonal Festivals, 5 Royal Palaces & City Itineraries in 11 Languages at corea-labs.com")}`,
      title: "Aesthetic Korea Travel Guide & Hidden Gems",
      content: `Save this for your next trip to Korea! 🇰🇷✨

If you're visiting Seoul or exploring regional cities, https://corea-labs.com/?utm_source=instagram is the most comprehensive interactive guide out there:
🌸 12+ Seasonal Festivals with real dates
🏯 Secret palace viewing tips & free Hanbok entry
🍜 Street food & cultural immersion guides
🌐 Available in 11 languages!

Link in bio: https://corea-labs.com/?utm_source=instagram
#VisitKorea #KoreaTravel #SeoulTravel #CoreaLabs #KoreaFestivals #Gyeongbokgung #TravelKorea #KCulture`
    }
  ];

  // Generate QR Code data URL with UTM tracking (?utm_source=qrcode)
  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(qrTrackedUrl, {
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

  const handleCopyUtmLink = () => {
    navigator.clipboard.writeText(customTrackedUrl);
    setCopiedUtm(true);
    setTimeout(() => setCopiedUtm(false), 2500);
  };

  const handleCopyUtmMessage = () => {
    const msg = getPromoMessage(selectedLangPromo, customTrackedUrl).text;
    navigator.clipboard.writeText(msg);
    setCopiedUtmMsg(true);
    setTimeout(() => setCopiedUtmMsg(false), 2500);
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
          text: getPromoMessage(language, `${siteUrl}/?lang=${language}&utm_source=native_share`).text,
          url: `${siteUrl}/?lang=${language}&utm_source=native_share`
        });
      } catch {
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

  const activePromoObj = getPromoMessage(selectedLangPromo, customTrackedUrl);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 max-h-[92vh] flex flex-col"
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-lg md:text-xl text-white">
                      <Translate>corea-labs.com 유입 경로 분석 & 전세계 홍보 센터</Translate>
                    </h3>
                    <span className="text-[10px] bg-amber-400 text-stone-950 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                      Global SEO + UTM
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 font-sans mt-0.5">
                    <Translate>해외 유입 경로(검색·AI·SNS·QR)를 자동 추적하고 11개국어 맞춤형 링크로 전 세계에 홍보하세요</Translate>
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
                onClick={() => setActiveTab("seo")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "seo"
                    ? "bg-amber-400 text-stone-950 font-bold shadow-xs"
                    : "text-stone-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <Translate>유입 경로 파악 & 국가별 홍보 빌더</Translate>
              </button>

              <button
                onClick={() => setActiveTab("social")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "social"
                    ? "bg-white text-stone-900 font-semibold shadow-xs"
                    : "text-stone-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <Translate>글로벌 SNS 원클릭 발송</Translate>
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
                <Translate>해외 포럼·바이럴 캠페인</Translate>
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
            
            {/* TAB 0: TRAFFIC CHANNELS DIAGNOSIS & GLOBAL UTM PROMO BUILDER */}
            {activeTab === "seo" && (
              <div className="space-y-6">
                {/* Section 1: 5 Core Traffic Acquisition Channels Diagnosis */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Search className="w-4 h-4 text-amber-600" />
                      <Translate>1. corea-labs.com 5대 해외 유입 경로 아키텍처 (실시간 가동 중)</Translate>
                    </h4>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      ACTIVE TRACKING
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-1">
                      <div className="flex items-center justify-between font-bold text-stone-900">
                        <span>🔍 1. 글로벌 검색엔진 (Google / Bing / Yahoo JP)</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        11개국어 <code className="font-mono bg-white px-1 rounded">hreflang</code> 태그, <code className="font-mono bg-white px-1 rounded">/sitemap.xml</code>, <code className="font-mono bg-white px-1 rounded">TouristInformationCenter</code> JSON-LD 스키마가 탑재되어 해외에서 한국 축제·고궁 검색 시 유입됩니다.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-1">
                      <div className="flex items-center justify-between font-bold text-stone-900">
                        <span>🤖 2. 글로벌 AI 검색 (ChatGPT / Perplexity / Claude)</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        공식 <code className="font-mono bg-white px-1 rounded">/llms.txt</code> AI 매니페스트와 크롤러 허용 규칙(<code className="font-mono bg-white px-1 rounded">GPTBot</code>, <code className="font-mono bg-white px-1 rounded">PerplexityBot</code>)을 적용해 외국인 AI 여행 질문 시 추천 출처로 인용됩니다.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-1">
                      <div className="flex items-center justify-between font-bold text-stone-900">
                        <span>💬 3. 영미·유럽 자유여행 포럼 (Reddit / TripAdvisor)</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        <code className="font-mono bg-white px-1 rounded">r/koreatravel</code> 등 영미권 최대 한국 여행 커뮤니티 유입을 <code className="font-mono bg-white px-1 rounded">utm_source=reddit</code>으로 자동 식별하여 통계 대시보드에 기록합니다.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-1">
                      <div className="flex items-center justify-between font-bold text-stone-900">
                        <span>📱 4. 아시아·글로벌 메신저 & QR (LINE / 샤오홍슈 / WA)</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        일본(X·LINE), 중화권(샤오홍슈), 동남아·유럽(WhatsApp) 공유 링크 클릭 시 <code className="font-mono bg-white px-1 rounded">?lang=</code> 파라미터로 즉시 해당 국가 언어로 열리며 유입 채널이 자동 집계됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Interactive Target Country + Channel UTM Promo Generator */}
                <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white p-5 rounded-3xl border border-stone-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-amber-400" />
                        <Translate>2. 국가별 언어 자동전환 + 유입경로(UTM) 추적 홍보 링크 생성기</Translate>
                      </h4>
                      <p className="text-[11px] text-stone-300 mt-0.5">
                        타겟 국가 언어와 홍보 채널을 선택하면, 외국인이 클릭하는 순간 해당 언어로 사이트가 열리고 관리자 대시보드에 유입 경로가 정확히 집계됩니다.
                      </p>
                    </div>
                  </div>

                  {/* Step A: Choose Target Language */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-stone-400 uppercase block">
                      STEP 1. 타겟 해외 국가 / 언어 선택 (클릭 시 해당 언어로 자동 실행)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { code: "en", label: "🇺🇸 English" },
                        { code: "ja", label: "🇯🇵 日本語" },
                        { code: "zh", label: "🇨🇳 中文" },
                        { code: "es", label: "🇪🇸 Español" },
                        { code: "fr", label: "🇫🇷 Français" },
                        { code: "th", label: "🇹🇭 ไทย" },
                        { code: "ru", label: "🇷🇺 Русский" },
                        { code: "pt", label: "🇧🇷 Português" },
                        { code: "uk", label: "🇺🇦 Українська" },
                        { code: "ka", label: "🇬🇪 ქართული" },
                        { code: "ko", label: "🇰🇷 한국어" },
                      ].map((l) => (
                        <button
                          key={l.code}
                          onClick={() => setSelectedLangPromo(l.code)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            selectedLangPromo === l.code
                              ? "bg-amber-400 text-stone-950 font-bold shadow-xs"
                              : "bg-white/10 text-stone-300 hover:bg-white/20"
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step B: Choose Promotion Channel */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-stone-400 uppercase block">
                      STEP 2. 홍보할 해외 채널 선택 (통계 대시보드 '주요 유입 경로'에 자동 기록됨)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {utmChannels.map((ch) => (
                        <button
                          key={ch.id}
                          onClick={() => setSelectedUtmChannel(ch.id)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            selectedUtmChannel === ch.id
                              ? "bg-emerald-500 text-stone-950 font-bold shadow-xs"
                              : "bg-white/10 text-stone-300 hover:bg-white/20"
                          }`}
                        >
                          {ch.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generated Link & Native Promo Copy */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="font-mono text-xs text-amber-300 break-all">
                        {customTrackedUrl}
                      </div>
                      <button
                        onClick={handleCopyUtmLink}
                        className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                      >
                        {copiedUtm ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUtm ? "추적 링크 복사됨!" : "추적 링크만 복사"}</span>
                      </button>
                    </div>

                    <div className="text-xs text-stone-200 bg-white/5 p-3 rounded-xl border border-white/10 leading-relaxed font-sans">
                      {activePromoObj.text}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-stone-400">
                        {activePromoObj.flag} {activePromoObj.title} 맞춤 홍보 문구 + 유입 추적 링크 포함
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopyUtmMessage}
                          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm active:scale-95"
                        >
                          {copiedUtmMsg ? <Check className="w-3.5 h-3.5 text-stone-950" /> : <Copy className="w-3.5 h-3.5 text-stone-950" />}
                          <span>{copiedUtmMsg ? "홍보 문구+링크 복사 완료!" : "현지어 홍보 문구 + 링크 전체 복사"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Live SEO & AI Indexing Manifest Links */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2.5">
                  <div className="text-xs font-bold text-stone-900 flex items-center justify-between">
                    <span>🌐 글로벌 검색엔진 사이트맵 & AI 크롤러 인덱싱 자산</span>
                    <span className="text-[10px] font-mono text-stone-500">SEO + GEO Ready</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-mono text-[11px] flex items-center gap-1.5 transition-colors"
                    >
                      <span>/sitemap.xml (11개국어 hreflang)</span>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </a>
                    <a
                      href="/llms.txt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-mono text-[11px] flex items-center gap-1.5 transition-colors"
                    >
                      <span>/llms.txt (ChatGPT·Perplexity 추천 매니페스트)</span>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </a>
                    <a
                      href="/robots.txt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-mono text-[11px] flex items-center gap-1.5 transition-colors"
                    >
                      <span>/robots.txt (글로벌 크롤러 허용)</span>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: SOCIAL CHANNELS (With Automatic UTM Tracking) */}
            {activeTab === "social" && (
              <div className="space-y-4">
                <div className="text-xs text-stone-500 font-medium">
                  <Translate>아래 모든 해외 공유 버튼에는 유입 경로 추적 코드(UTM)가 자동 삽입되어 있어, 클릭 유입 시 대시보드에 채널별로 실시간 집계됩니다:</Translate>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getPromoMessage("en", `${siteUrl}/?lang=en&utm_source=whatsapp&utm_medium=messenger`).text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      WA
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">WhatsApp</div>
                      <div className="text-[10px] text-emerald-700/80 mt-1">글로벌 1위 메신저</div>
                    </div>
                  </a>

                  {/* Reddit */}
                  <a
                    href={`https://www.reddit.com/submit?url=${encodeURIComponent(`${siteUrl}/?lang=en&utm_source=reddit&utm_medium=forum`)}&title=${encodeURIComponent("Corea Labs – Interactive South Korea Travel, Heritage & Seasonal Festival Guide (11 Languages)")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-orange-100 bg-orange-50/50 hover:bg-orange-100/70 text-orange-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      r/
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">Reddit</div>
                      <div className="text-[10px] text-orange-700/80 mt-1">r/koreatravel 포럼</div>
                    </div>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Exploring South Korea's vibrant seasonal festivals, royal palaces & UNESCO heritage in 11 languages at corea-labs.com 🇰🇷✨ Check it out:")}&url=${encodeURIComponent(`${siteUrl}/?lang=en&utm_source=x_twitter&utm_medium=social`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      𝕏
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">X (Twitter)</div>
                      <div className="text-[10px] text-stone-500 mt-1">글로벌 실시간 바이럴</div>
                    </div>
                  </a>

                  {/* LINE (Japan, Taiwan, Thailand) */}
                  <a
                    href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(`${siteUrl}/?lang=ja&utm_source=line&utm_medium=messenger`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-green-100 bg-green-50/50 hover:bg-green-100/70 text-green-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#06C755] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      L
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">LINE</div>
                      <div className="text-[10px] text-green-700/80 mt-1">일본 · 대만 · 태국</div>
                    </div>
                  </a>

                  {/* Pinterest */}
                  <a
                    href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(`${siteUrl}/?lang=en&utm_source=pinterest&utm_medium=social`)}&description=${encodeURIComponent("Discover South Korea's vibrant festivals, royal palaces and travel itineraries in 11 languages at corea-labs.com")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-rose-100 bg-rose-50/50 hover:bg-rose-100/70 text-rose-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      P
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">Pinterest</div>
                      <div className="text-[10px] text-rose-700/80 mt-1">글로벌 여행 핀보드</div>
                    </div>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(`${siteUrl}/?lang=en&utm_source=telegram&utm_medium=messenger`)}&text=${encodeURIComponent(getPromoMessage("en", `${siteUrl}/?lang=en&utm_source=telegram`).text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-sky-100 bg-sky-50/50 hover:bg-sky-100/70 text-sky-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      <Send className="w-4 h-4 ml-0.5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">Telegram</div>
                      <div className="text-[10px] text-sky-700/80 mt-1">유럽·글로벌 채널</div>
                    </div>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteUrl}/?lang=en&utm_source=facebook&utm_medium=social`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100/70 text-indigo-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      f
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">Facebook</div>
                      <div className="text-[10px] text-indigo-700/80 mt-1">글로벌 여행 그룹</div>
                    </div>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteUrl}/?lang=en&utm_source=linkedin&utm_medium=social`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100/70 text-blue-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      in
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">LinkedIn</div>
                      <div className="text-[10px] text-blue-700/80 mt-1">글로벌 관광 네트워크</div>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent("Discover South Korea with corea-labs.com (11 Languages)")}&body=${encodeURIComponent(getPromoMessage("en", `${siteUrl}/?lang=en&utm_source=email`).text)}`}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-amber-100 bg-amber-50/50 hover:bg-amber-100/70 text-amber-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">Email 추천</div>
                      <div className="text-[10px] text-amber-700/80 mt-1">해외 파트너·친구 초대</div>
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
                    <Translate>기기 기본 공유 메뉴 열기 (AirDrop, 인스타그램 DM, 카카오톡 등)</Translate>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: VIRAL PRESS & FORUM CAMPAIGN KITS */}
            {activeTab === "campaign" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600 font-medium">
                    <Translate>해외 주요 여행 포럼(Reddit, 일본 X, 중국 샤오홍슈, 인스타그램)에 바로 게시할 수 있는 현지어 홍보 캠페인 키트:</Translate>
                  </span>
                </div>

                <div className="space-y-3">
                  {campaignKits.map((camp) => (
                    <div key={camp.id} className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-900">{camp.icon}</span>
                          <span className="font-semibold text-xs text-stone-900">{camp.platform}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                            {camp.badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={camp.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>바로 게시하기</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
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
                    <Translate>포스터 내 QR 코드에는 ?utm_source=qrcode 추적 코드가 내장되어 있어, 외국인이 스캔할 때마다 대시보드 'QR 코드 스캔' 유입으로 실시간 집계됩니다.</Translate>
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
                    https://corea-labs.com/?utm_source=qrcode
                  </div>
                </div>

                <div className="max-w-sm space-y-1">
                  <h4 className="text-sm font-bold text-stone-900">
                    <Translate>유입 경로 자동 추적 모바일 QR 코드</Translate>
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    <Translate>스마트폰 카메라로 스캔하면 별도 앱 설치 없이 corea-labs.com이 실행되며, 관리자 통계 대시보드의 'QR 코드 스캔' 유입으로 즉시 기록됩니다.</Translate>
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

          </div>

          {/* Footer Bar */}
          <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
            <span className="font-mono text-[11px] font-semibold text-stone-700">corea-labs.com • Global Traffic & Promotion Hub</span>
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
