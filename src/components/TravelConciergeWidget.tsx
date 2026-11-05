import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Train,
  Globe,
  Coins,
  Compass,
  HelpCircle,
  ArrowRight,
  Bot,
  User,
} from "lucide-react";
import { FESTIVALS, PALACES, DESTINATIONS } from "../data";
import { FESTIVAL_DETAILED_GUIDES } from "./FestivalDetailView";
import { LANGUAGES, LanguageCode } from "../context/LanguageContext";
import KoreaLogoIcon from "./KoreaLogoIcon";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: string;
}

interface TravelConciergeWidgetProps {
  onNavigateTab: (tab: string) => void;
}

const GTX_LANG_MAP: Record<LanguageCode, string> = {
  ko: "ko",
  en: "en",
  ja: "ja",
  zh: "zh-CN",
  th: "th",
  fr: "fr",
  es: "es",
  pt: "pt",
  ka: "ka",
  ru: "ru",
  uk: "uk",
};

async function translateDynamicReply(sourceText: string, targetLang: LanguageCode): Promise<string> {
  const tl = GTX_LANG_MAP[targetLang] || targetLang;
  try {
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=${encodeURIComponent(tl)}`;
    const params = new URLSearchParams();
    params.append("q", sourceText);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        if (Array.isArray(data[0]) && typeof data[0][0] === "string") return data[0][0];
        if (typeof data[0] === "string") return data[0];
      }
    }
  } catch {}
  return sourceText;
}

// Native English Smart Knowledge Base Responder (Default English output)
function buildSmartKnowledgeReplyEnglish(query: string): { text: string; isNativeEnglish: boolean } {
  const q = query.toLowerCase();

  // 1. Check if the user is asking about a specific festival
  for (const fest of FESTIVALS) {
    const koMatch = fest.koreanName && q.includes(fest.koreanName.toLowerCase().replace(/\s+/g, ""));
    const koPartial =
      fest.koreanName &&
      fest.koreanName
        .split(" ")
        .some((word) => word.length >= 2 && q.includes(word.toLowerCase()));
    const enPartial =
      fest.name &&
      fest.name
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 3 && w !== "festival")
        .some((w) => q.includes(w));

    if (koMatch || koPartial || enPartial || q.includes(fest.id.toLowerCase())) {
      const guide = FESTIVAL_DETAILED_GUIDES[fest.id];
      if (fest.id === "jinhae") {
        return {
          isNativeEnglish: true,
          text: `🌸 [Jinhae Cherry Blossom Festival (${fest.koreanName})]\n• Schedule: ${fest.dateRange} (${fest.location})\n• Admission: Free entry (some military port tour booths charge separately)\n• By KTX Train: Take KTX from Seoul Station to [Changwon Jungang Station] or [Masan Station] (~3 hrs), then transfer to an express local bus (No. 315, 752) or the free festival shuttle bus to Jinhae Station / Yeojwacheon Stream.\n• By Express Bus: Take an intercity bus from Seoul Nambu Terminal or Busan Sasang Terminal (~50 mins from Busan) directly to Jinhae Intercity Bus Terminal.\n• Must-Try Food: Jinhae Cherry Blossom Bread (Beotkkot-ppang) & Chungmu Gimbap.`,
        };
      }
      if (fest.id === "boryeong") {
        return {
          isNativeEnglish: true,
          text: `🌊 [Boryeong Mud Festival (${fest.koreanName})]\n• Schedule: ${fest.dateRange} (${fest.location})\n• Admission: Beach area is free; Paid Mud Experience Zone is ~10,000–14,000 KRW for adults.\n• By Train: Take the Janghang Line Saemaeul/Mugunghwa train from Yongsan Station (Seoul) directly to [Daecheon Station] (~2 hrs 20 mins).\n• By Express Bus: Take an express bus from Seoul Central City Terminal to [Boryeong Bus Terminal] (~2 hrs 10 mins).\n• Local Bus to Venue: From Daecheon Station or Boryeong Terminal, take City Bus No. 100, 101, or 102 (runs every 10 mins, ~15 mins ride) to Daecheon Beach Mud Square.`,
        };
      }
      if (guide) {
        // Return rich festival + transit details (will be translated to English if contains Korean)
        return {
          isNativeEnglish: false,
          text: `✨ [${fest.name} (${fest.koreanName})]\n• Period: ${fest.dateRange} (${fest.location})\n• Admission: ${guide.admissionFee}\n• Train / Subway: ${guide.transit.trainOrSubway}\n• Express Bus: ${guide.transit.expressBus}\n• Local Bus / Shuttle: ${guide.transit.localConnection}\n• Local Delicacies: ${guide.localFood}`,
        };
      }
      return {
        isNativeEnglish: true,
        text: `✨ [${fest.name} (${fest.koreanName})]\n• Period: ${fest.dateRange}\n• Location: ${fest.location}\n• Key Highlight: ${fest.highlight}\n• Features: ${fest.features.join(", ")}\n• Click this festival card in the [Festivals] tab to view full KTX & bus directions!`,
      };
    }
  }

  // 2. K-ETA / Visa / Q-Code / Entry / Customs
  if (
    q.includes("k-eta") ||
    q.includes("keta") ||
    q.includes("visa") ||
    q.includes("entry") ||
    q.includes("q-code") ||
    q.includes("quarantine") ||
    q.includes("customs") ||
    q.includes("비자") ||
    q.includes("입국") ||
    q.includes("세관")
  ) {
    return {
      isNativeEnglish: true,
      text: `✈️ [South Korea Entry, K-ETA & Q-Code Guide]\n• K-ETA (Electronic Travel Authorization): Visa-free travelers should apply online at least 72 hours before boarding (Fee: 10,000 KRW, valid for 3 years with multiple entries).\n• Q-Code (Quarantine QR): Complete your health declaration online up to 3 days before arrival to get a QR code for express airport screening.\n• Customs Duty-Free Limits: Up to $800 USD general exemption + 2 bottles of alcohol (up to 2L & $400 USD), 200 cigarettes, and 100ml perfume. Foreign currency exceeding $10,000 USD must be declared.`,
    };
  }

  // 3. Currency Exchange / WOWPASS / T-money / Card / Cash
  if (
    q.includes("currency") ||
    q.includes("exchange") ||
    q.includes("wowpass") ||
    q.includes("t-money") ||
    q.includes("tmoney") ||
    q.includes("card") ||
    q.includes("cash") ||
    q.includes("money") ||
    q.includes("환전") ||
    q.includes("결제") ||
    q.includes("현금")
  ) {
    return {
      isNativeEnglish: true,
      text: `💳 [Currency Exchange & Payment Cards in Korea]\n• Recommended Ratio: [85% Card + 15% Cash (~50,000–100,000 KRW)]. Over 95% of restaurants, cafes, taxis, and shops accept cards.\n• All-in-One Prepaid Cards: Pick up a [WOWPASS] or [NAMANE Card] at Incheon Airport or major subway stations. It combines foreign currency exchange, debit card payment anywhere, and a T-money public transit card in one card!\n• When to Use Cash: Traditional street food markets (e.g., Gwangjang Market) and topping up T-money transit balance at convenience stores.`,
    };
  }

  // 4. Palaces / Gyeongbokgung / Hanbok
  if (
    q.includes("palace") ||
    q.includes("hanbok") ||
    q.includes("gyeongbokgung") ||
    q.includes("changdeokgung") ||
    q.includes("경복궁") ||
    q.includes("고궁") ||
    q.includes("한복")
  ) {
    const p = PALACES[0];
    return {
      isNativeEnglish: true,
      text: `🏯 [Seoul Royal Palaces & Free Hanbok Admission]\n• Free Admission in Hanbok: Wearing a traditional or modern Hanbok grants 100% FREE admission to Gyeongbokgung, Changdeokgung, Changgyeonggung, Deoksugung, and Jongmyo Shrine!\n• Weekly Closed Days: Gyeongbokgung is closed every [Tuesday], while Changdeokgung, Deoksugung, and Changgyeonggung are closed every [Monday].\n• Must-See: Watch the Royal Guard Changing Ceremony at Gwanghwamun Gate (10:00 AM & 2:00 PM) at ${p?.name || "Gyeongbokgung Palace"}.`,
    };
  }

  // 5. Public Transit / KTX / Subway / Bus in general
  if (
    q.includes("ktx") ||
    q.includes("train") ||
    q.includes("subway") ||
    q.includes("bus") ||
    q.includes("transit") ||
    q.includes("transport") ||
    q.includes("대중교통") ||
    q.includes("기차") ||
    q.includes("지하철")
  ) {
    return {
      isNativeEnglish: true,
      text: `🚄 [Korea Public Transit Guide (KTX, Subway & Bus)]\n• KTX High-Speed Rail: Connects Seoul Station / Yongsan Station to Busan (2.5 hrs), Gangneung (1 hr 50 mins), Jeonju (1 hr 40 mins), Gyeongju, Jinhae, and Gurye. Book tickets in English via the official KorailTalk app or LetsKorail.com.\n• Free Transit Transfers: Tap your T-money / WOWPASS card when boarding AND exiting buses/subways to get free transfer discounts within 30 minutes.\n• Essential Navigation Apps: Download [Naver Map] or [KakaoMap] (both support full English UI) for real-time subway and bus directions across Korea.`,
    };
  }

  // 6. Destinations (Busan, Jeju, Gyeongju, Jeonju, Gangneung, etc.)
  for (const dest of DESTINATIONS) {
    if (
      q.includes(dest.koreanName.toLowerCase()) ||
      q.includes(dest.name.toLowerCase())
    ) {
      return {
        isNativeEnglish: true,
        text: `📍 [${dest.name} (${dest.koreanName}) Travel Guide]\n• Overview: ${dest.tagline}\n• Best Time to Visit: ${dest.travelTips.bestTime}\n• Must-Try Local Food: ${dest.travelTips.mustTry}\n• Insider Tip: ${dest.travelTips.hiddenGem}\n• Top Highlights: ${dest.highlights.join(", ")}`,
      };
    }
  }

  // 7. Emergency / Hotline 1330
  if (
    q.includes("1330") ||
    q.includes("emergency") ||
    q.includes("help") ||
    q.includes("hotline") ||
    q.includes("police") ||
    q.includes("긴급") ||
    q.includes("응급")
  ) {
    return {
      isNativeEnglish: true,
      text: `📞 [Korea Emergency Contacts & 24/7 Tourist Helpline]\n• 1330 Korea Travel Hotline: Dial 1330 (24/7 free multilingual support & interpretation in English, Japanese, Chinese, Thai, Russian, etc.)\n• 112: National Police (Emergency & Lost items)\n• 119: Fire, Ambulance & Medical Emergency`,
    };
  }

  // Default English summary
  return {
    isNativeEnglish: true,
    text: `Hello! I'm the Corea Labs Travel Concierge. 🇰🇷\nHere are some popular topics you can ask me about (or click a quick button below):\n• "How to get to Jinhae Cherry Blossom or Boryeong Mud Festival by KTX & bus"\n• "K-ETA visa rules, Q-Code & duty-free customs limits"\n• "Best currency exchange ratio & WOWPASS / T-money cards"\n• "Gyeongbokgung Palace Hanbok free entry & closed days"`,
  };
}

const QUICK_PROMPTS_EN = [
  {
    label: "Jinhae Cherry Blossom Transit",
    query: "How do I get to Jinhae Cherry Blossom Festival by KTX and bus?",
    icon: Train,
  },
  {
    label: "Boryeong Mud Festival by Train",
    query: "How do I visit Boryeong Mud Festival using public transit?",
    icon: Compass,
  },
  {
    label: "K-ETA & Q-Code Entry Guide",
    query: "Tell me about K-ETA application deadlines, Q-Code, and customs limits.",
    icon: Globe,
  },
  {
    label: "Currency Exchange & WOWPASS",
    query: "What is the best currency exchange ratio and how does WOWPASS / T-money work?",
    icon: Coins,
  },
  {
    label: "Palaces & Free Hanbok Entry",
    query: "Is Gyeongbokgung Palace free when wearing Hanbok, and what are the closed days?",
    icon: Sparkles,
  },
];

export default function TravelConciergeWidget({ onNavigateTab }: TravelConciergeWidgetProps) {
  // Chatbot defaults strictly to English ("en") as requested by the user
  const [chatLang, setChatLang] = useState<LanguageCode>("en");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome_msg",
      role: "assistant",
      text: "Hello! Welcome to Corea Labs Travel Concierge. 🇰🇷 Ask me anything in English (or your preferred language) about Korea's 27 seasonal festivals, KTX & bus directions, K-ETA entry rules, currency exchange (WOWPASS / T-money), or Royal Palaces!",
      timestamp: "Just now",
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    let replyText = "";

    // 1. Try server-side /api/chat first (instructing English or selected chatLang)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          language: chatLang,
          history: messages.slice(-4),
        }),
      });
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data && typeof data.reply === "string" && data.reply.trim()) {
            replyText = data.reply.trim();
          }
        }
      }
    } catch {
      // Fallback to built-in Smart Knowledge Base
    }

    // 2. Built-in Smart Knowledge Base (instant & works on Cloudflare Pages static deployment)
    if (!replyText) {
      const { text: baseReply, isNativeEnglish } = buildSmartKnowledgeReplyEnglish(trimmed);
      if (chatLang === "en" && isNativeEnglish) {
        replyText = baseReply;
      } else {
        replyText = await translateDynamicReply(baseReply, chatLang);
      }
    }

    const botMsg: ChatMessage = {
      id: `bot_${Date.now()}`,
      role: "assistant",
      text: replyText,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendQuery(input);
  };

  return (
    <>
      {/* Floating Action Button (Bottom-Right) — Default English UI */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2.5 pl-3.5 pr-4 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-xl border border-amber-400/50 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-stone-950">
                <MessageCircle className="w-4 h-4 fill-current" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-stone-900" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-mono text-amber-300 uppercase tracking-wider leading-none">
                  24/7 CONCIERGE &amp; Q&amp;A
                </span>
                <span className="block text-xs font-bold text-white mt-0.5">
                  Korea Travel AI Concierge
                </span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chatbot Popup Window — Default English */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-[calc(100vw-2rem)] sm:w-[410px] max-h-[610px] bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <KoreaLogoIcon className="w-7 h-7 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-sm text-white truncate">
                        Corea Labs Concierge
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    </div>
                    <p className="text-[10px] text-stone-400 font-mono truncate">
                      24/7 Korea Festival, Transit &amp; Travel Guide
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Chatbot Reply Language Selector (Defaults to EN) */}
                  <select
                    value={chatLang}
                    onChange={(e) => setChatLang(e.target.value as LanguageCode)}
                    aria-label="Chatbot Reply Language"
                    className="px-2 py-1 rounded-lg bg-stone-800 text-stone-200 border border-stone-700 text-[10px] font-mono font-bold cursor-pointer focus:outline-none"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.code.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      onNavigateTab("qna");
                      setIsOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Q&amp;A Board
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[340px] bg-stone-50/70">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === "user"
                          ? "bg-amber-400 text-stone-950"
                          : "bg-stone-900 text-amber-400"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-stone-900 text-white rounded-tr-xs"
                          : "bg-white text-stone-800 border border-stone-200/80 shadow-2xs rounded-tl-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-stone-400 pl-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                    <span>Concierge is preparing your answer...</span>
                  </div>
                )}

                {/* Quick Chips in English */}
                <div className="pt-2 space-y-1.5">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                    SUGGESTED QUESTIONS (CLICK TO ASK)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS_EN.map((chip, idx) => {
                      const Icon = chip.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendQuery(chip.query)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200/80 hover:border-amber-300 text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
                        >
                          <Icon className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{chip.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div ref={messagesEndRef} />
              </div>

              {/* Direct Link Banner to Community Q&A Board */}
              <button
                type="button"
                onClick={() => {
                  onNavigateTab("qna");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 bg-amber-50 hover:bg-amber-100/80 border-t border-amber-200/70 flex items-center justify-between text-[11px] font-bold text-amber-950 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Open Traveler Q&amp;A Community Board</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
              </button>

              {/* Input Box */}
              <form
                onSubmit={handleSubmit}
                className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about festivals, KTX transit, visa, exchange..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-stone-900 hover:bg-amber-400 disabled:opacity-40 text-white hover:text-stone-950 transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
