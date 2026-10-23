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
  ExternalLink
} from "lucide-react";
import { useTranslation, Translate, LANGUAGES } from "../context/LanguageContext";

interface GlobalShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "social" | "qr" | "message";
}

export default function GlobalShareModal({ isOpen, onClose, initialTab = "social" }: GlobalShareModalProps) {
  const { language, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"social" | "qr" | "message">(initialTab);
  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [selectedLangPromo, setSelectedLangPromo] = useState<string>("en");
  
  const siteUrl = "https://corea-labs.com";

  // Pre-configured engaging messages for foreign travelers
  const promoMessages: Record<string, { title: string; text: string }> = {
    en: {
      title: "English",
      text: "🇰🇷 Planning a trip to South Korea? Explore corea-labs.com — the ultimate curated guide to seasonal festivals, royal palaces, UNESCO heritage, and hidden gems across Korea! Free & available in 11 languages: https://corea-labs.com"
    },
    ja: {
      title: "日本語",
      text: "🇰🇷 韓国旅行の計画なら corea-labs.com がおすすめ！全国の季節のお祭り、5大古宮、世界遺産、おすすめグルメ名所まで11言語で完全網羅！無料ガイドはこちら: https://corea-labs.com"
    },
    zh: {
      title: "中文",
      text: "🇰🇷 计划前往韩国旅行吗？欢迎访问 corea-labs.com — 全方位探索韩国四季传统庆典、五大古宫、联合国教科文组织世界遗产与精选景点！支持11种语言免费查阅: https://corea-labs.com"
    },
    es: {
      title: "Español",
      text: "🇰🇷 ¿Planeas viajar a Corea del Sur? ¡Descubre corea-labs.com! Tu guía esencial y gratuita de festivales tradicionales, palacios reales, gastronomía y patrimonio cultural en 11 idiomas: https://corea-labs.com"
    },
    fr: {
      title: "Français",
      text: "🇰🇷 Vous préparez un voyage en Corée du Sud ? Explorez corea-labs.com : festivals traditionnels, palais royaux de Séoul, sites UNESCO et conseils de voyage en 11 langues : https://corea-labs.com"
    },
    th: {
      title: "ไทย",
      text: "🇰🇷 วางแผนเที่ยวเกาหลีใต้? แนะนำ corea-labs.com แหล่งรวมข้อมูลเทศกาลประจำฤดู พระราชวัง แหล่งมรดกโลก และสถานที่ท่องเที่ยว พร้อมใช้งาน 11 ภาษา: https://corea-labs.com"
    },
    ru: {
      title: "Русский",
      text: "🇰🇷 Планируете поездку в Южную Корею? Откройте для себя corea-labs.com — бесплатный путеводитель по сезонным фестивалям, дворцам Сеула и культурному наследию ЮНЕСКО: https://corea-labs.com"
    },
    ko: {
      title: "한국어",
      text: "🇰🇷 외국인 친구와 함께 즐기는 대한민국 문화유산 & 전국 축제 가이드 corea-labs.com! 11개 언어로 제공되는 생생한 한국 여행의 모든 것: https://corea-labs.com"
    }
  };

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(siteUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#1c1917",
          light: "#ffffff"
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error("QR Code generation error:", err));
    }
  }, [isOpen]);

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

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Corea Labs | South Korea Travel Guide & Festivals",
          text: promoMessages[language] ? promoMessages[language].text : promoMessages.en.text,
          url: siteUrl
        });
      } catch (err) {
        // User cancelled or share error
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-amber-300">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                    <Translate>Share corea-labs.com Worldwide</Translate>
                    <span className="text-[10px] bg-amber-400 text-stone-950 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                      Official
                    </span>
                  </h3>
                  <p className="text-xs text-stone-300 font-sans mt-0.5">
                    <Translate>Help global travelers & friends discover authentic South Korea</Translate>
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
            <div className="flex items-center gap-2 mt-5 border-t border-white/10 pt-4">
              <button
                onClick={() => setActiveTab("social")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "social"
                    ? "bg-white text-stone-900 font-semibold"
                    : "text-stone-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <Translate>Social Channels</Translate>
              </button>

              <button
                onClick={() => setActiveTab("qr")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "qr"
                    ? "bg-white text-stone-900 font-semibold"
                    : "text-stone-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <Translate>Mobile QR Code</Translate>
              </button>

              <button
                onClick={() => setActiveTab("message")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "message"
                    ? "bg-white text-stone-900 font-semibold"
                    : "text-stone-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <Translate>Traveler Invite Messages</Translate>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
            
            {/* Quick URL Copy Box (Always Visible) */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-mono text-xs font-medium text-stone-800 truncate">
                  {siteUrl}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span><Translate>Copied!</Translate></span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span><Translate>Copy Link</Translate></span>
                  </>
                )}
              </button>
            </div>

            {/* TAB 1: SOCIAL CHANNELS */}
            {activeTab === "social" && (
              <div className="space-y-4">
                <div className="text-xs text-stone-500 font-medium">
                  <Translate>Click to share directly to global platforms frequented by international travelers:</Translate>
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
                      <div className="text-[10px] text-emerald-700/80 mt-1">#1 Global Travel</div>
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
                      <div className="text-[10px] text-orange-700/80 mt-1">r/koreatravel</div>
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
                      <div className="text-[10px] text-stone-500 mt-1">Global Viral</div>
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
                      <div className="text-[10px] text-green-700/80 mt-1">Japan / Asia</div>
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
                      <div className="text-[10px] text-sky-700/80 mt-1">Travel Groups</div>
                    </div>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100/70 text-blue-900 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      f
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-none">Facebook</div>
                      <div className="text-[10px] text-blue-700/80 mt-1">Community Share</div>
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
                    <Translate>Open Device Share Menu (AirDrop, Messages, WeChat, etc.)</Translate>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: QR CODE */}
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
                  <div className="mt-2 text-[11px] font-mono text-stone-500 font-medium tracking-tight">
                    https://corea-labs.com
                  </div>
                </div>

                <div className="max-w-sm space-y-2">
                  <h4 className="text-sm font-bold text-stone-900">
                    <Translate>Instant Mobile Discovery for Foreign Tourists</Translate>
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    <Translate>Foreign travelers traveling together or meeting at hostels, airports, and subways can point their smartphone camera directly at this QR code to launch Corea Labs instantly without any app installation.</Translate>
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={downloadQrCode}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <Translate>Download QR Code (PNG)</Translate>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: MULTILINGUAL INVITE MESSAGES */}
            {activeTab === "message" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600 font-medium">
                    <Translate>Select language preset to copy ready-to-share promotional message:</Translate>
                  </span>
                </div>

                {/* Language Pill Selector */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(promoMessages).map(([code, item]) => (
                    <button
                      key={code}
                      onClick={() => setSelectedLangPromo(code)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        selectedLangPromo === code
                          ? "bg-stone-900 text-white font-semibold"
                          : "bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200"
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>

                {/* Message Display & Copy */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3 relative">
                  <p className="text-xs text-stone-800 leading-relaxed font-sans select-all">
                    {promoMessages[selectedLangPromo]?.text}
                  </p>
                  
                  <div className="flex justify-end pt-2 border-t border-stone-200/60">
                    <button
                      onClick={handleCopyMessage}
                      className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedMsg ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span><Translate>Message Copied!</Translate></span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span><Translate>Copy Message</Translate></span>
                        </>
                      )}
                    </button>
                  </div>
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
                    <Translate>Why corea-labs.com is the #1 Guide for Foreign Travelers</Translate>
                  </div>
                  <div className="text-[11px] text-amber-900/80 leading-relaxed space-y-1">
                    <div>• <Translate>Curated seasonal festivals with real dates, locations, and English transport guides</Translate></div>
                    <div>• <Translate>Seamless multi-language translation in 11 world languages</Translate></div>
                    <div>• <Translate>Direct link to Korea 1330 Travel Helpline for 24/7 emergency translation</Translate></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span className="font-mono text-[11px]">corea-labs.com</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Translate>Close</Translate>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
