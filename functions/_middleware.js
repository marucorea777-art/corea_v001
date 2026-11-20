// Cloudflare Pages Edge Middleware: Dynamically injects page-specific & language-specific
// <title>, <meta description>, <link canonical>, OpenGraph cards, and noindex tags for bots.

const VALID_PAGES = new Set([
  "home",
  "festivals",
  "heritage",
  "places",
  "culture",
  "travel",
  "qna",
  "about",
  "privacy",
  "terms",
]);

const VALID_LANGS = new Set(["ko", "en", "ja", "zh", "th", "fr", "es", "pt", "ru", "uk", "ka"]);

const SEO_DICT = {
  home: {
    ko: {
      title: "대한민국 연구소 | Corea Labs - 한국 여행 가이드, 문화유산 & 전국 27대 계절 축제 (11개국어)",
      desc: "조선 5대 고궁 한복 무료입장, 유네스코 세계유산, 전국 27대 계절 축제 및 KTX 대중교통, K-ETA·WOWPASS 입국 가이드를 11개국어로 제공하는 대한민국 종합 여행 아카이브입니다.",
    },
    en: {
      title: "Corea Labs | South Korea Travel Guide, 27 Seasonal Festivals & 5 Royal Palaces",
      desc: "Complete South Korea travel guide in 11 languages: Seoul, Busan & Jeju itineraries, 27 seasonal festivals with KTX transit, 5 royal palaces, and K-ETA & WOWPASS tips.",
    },
    ja: {
      title: "Corea Labs | 韓国旅行ガイド・全国27大季節祭り・5大古宮・世界遺産 (11言語対応)",
      desc: "韓国の四季のお祭り日程とKTXアクセス、ソウル5大古宮の韓服無料入場、K-ETA・WOWPASS・T-Money完全ガイドを11言語で無料提供。",
    },
    zh: {
      title: "Corea Labs | 韩国自由行指南・全国27大四季庆典・五大古宫与世界遗产 (11种语言)",
      desc: "精选韩国全境27大四季庆典日程与KTX交通攻略、首尔五大古宫韩服免费入场、K-ETA与WOWPASS换钱指南，支持11种语言免费查阅。",
    },
  },
  festivals: {
    ko: {
      title: "전국 27대 계절별 축제 일정 & KTX 대중교통 가이드 | Corea Labs",
      desc: "진해군항제, 여의도 봄꽃축제, 보령머드축제, 안동국제탈춤페스티벌, 진주남강유등축제, 화천산천어축제 일정과 KTX·버스 교통편을 확인하세요.",
    },
    en: {
      title: "27 Best Seasonal Festivals in South Korea (Dates & KTX Transit Guide) | Corea Labs",
      desc: "Calendar and Seoul KTX/bus routes for South Korea's 27 seasonal festivals: Jinhae Cherry Blossom, Boryeong Mud, Jinju Lantern, Andong Mask & Hwacheon Ice Festival.",
    },
    ja: {
      title: "韓国全国27大季節のお祭り日程＆KTXアクセス完全ガイド | Corea Labs",
      desc: "鎮海桜祭り・保寧マッド祭り・晋州ランタン祭り・安東仮面劇・華川ヤマメ氷祭りなど韓国全土27大祭りの開催時期とソウルからのKTX行き方を解説。",
    },
    zh: {
      title: "韩国全境27大四季庆典日程与KTX大众交通攻略 | Corea Labs",
      desc: "镇海樱花节、保宁泥浆节、晋州南江流灯节、安东假面舞节与华川山鳟鱼冰雪节日程及首尔出发KTX/长途巴士路线完全指南。",
    },
  },
  travel: {
    ko: {
      title: "외국인 한국 여행 필수 가이드 (K-ETA, WOWPASS, T-Money, 1330) | Corea Labs",
      desc: "인천공항 입국 절차(K-ETA·Q-Code), 부가세 즉시환급, 네이버지도·카카오맵 활용법, WOWPASS·티머니 교통카드, 24시간 1330 관광통역 안내 총정리.",
    },
    en: {
      title: "South Korea Travel Guide for Foreigners: K-ETA, WOWPASS, T-Money & Naver Map | Corea Labs",
      desc: "Essential South Korea travel survival guide: K-ETA entry rules, duty-free limits, WOWPASS & T-Money transit cards, Naver Map navigation, tax refunds, and 1330 helpline.",
    },
    ja: {
      title: "韓国旅行必須ガイド：K-ETA・WOWPASS・T-Money・NAVERマップ完全解説 | Corea Labs",
      desc: "仁川空港からの入国手続き、WOWPASS両替＆交通カード、NAVERマップの使い方、即時免税(Tax Refund)、24時間日本語対応1330案内を網羅。",
    },
    zh: {
      title: "韩国自由行入境必备指南：K-ETA、WOWPASS、T-Money交通卡与地图导航 | Corea Labs",
      desc: "仁川机场入境K-ETA与申报规定、WOWPASS与T-Money使用攻略、Naver地图中文导航、即时退税及1330 24小时多语热线指南。",
    },
  },
  heritage: {
    ko: {
      title: "서울 5대 고궁 한복 무료입장 & 유네스코 세계유산 가이드 | Corea Labs",
      desc: "경복궁·창덕궁 후원·덕수궁·창경궁·경희궁 휴궁일, 수문장 교대식 시간, 한복 무료입장 규칙 및 석굴암·불국사·독도 심층 해설.",
    },
    en: {
      title: "Seoul 5 Royal Palaces Free Hanbok Entry & UNESCO Heritage Guide | Corea Labs",
      desc: "Visitor guide to Gyeongbokgung, Changdeokgung Secret Garden, Deoksugung, Jongmyo Shrine, and Seokguram Grotto including closed days and free Hanbok entry.",
    },
  },
  places: {
    ko: {
      title: "한국 대표 도시 & 추천 명소 (서울·부산·제주·경주·전주·강릉) | Corea Labs",
      desc: "북촌 한옥마을, 부산 감천문화마을, 제주 성산일출봉, 경주 대릉원·황리단길, 전주 한옥마을, 강릉 안목해변 지역별 핵심 여행 코스를 확인하세요.",
    },
    en: {
      title: "Best Places & Cities to Visit in South Korea: Seoul, Busan, Jeju, Gyeongju | Corea Labs",
      desc: "Curated Korea travel city guides: Bukchon Hanok Village, Busan Gamcheon Village, Jeju Island Seongsan Ilchulbong, Gyeongju, Jeonju Hanok Village & Gangneung.",
    },
  },
  culture: {
    ko: {
      title: "한국 전통문화 가이드 (한글·한복·한식·한옥·판소리·템플스테이) | Corea Labs",
      desc: "훈민정음 창제 원리부터 김장·발효 한식 과학, 온돌 한옥 건축, 판소리, 산사 템플스테이 체험까지 한국의 살아있는 전통문화를 심층 소개합니다.",
    },
    en: {
      title: "Traditional Korean Culture Guide: Hanbok, Hansik Cuisine, Hanok & Pansori | Corea Labs",
      desc: "Discover Korea's living heritage: Hangeul alphabet history, Hansik fermentation & temple food, Ondol Hanok architecture, UNESCO Pansori & Hanbok traditions.",
    },
  },
  qna: {
    ko: {
      title: "글로벌 한국 여행 Q&A 커뮤니티 & 24시간 AI 컨시어지 | Corea Labs",
      desc: "KTX 예매, 벚꽃 개화 시기, 환전 팁, 채식·할랄 식당, 고궁 야간개장 등 한국 여행 궁금증을 질문하고 11개국어 실시간 답변을 받아보세요.",
    },
    en: {
      title: "South Korea Travel Q&A Forum & 24/7 Multilingual Concierge | Corea Labs",
      desc: "Ask questions about South Korea travel itineraries, KTX tickets, cherry blossom season, SIM cards, and local etiquette in 11 languages.",
    },
  },
  privacy: {
    ko: { title: "개인정보처리방침 (Privacy Policy) | Corea Labs", desc: "Corea Labs 개인정보처리방침 및 쿠키·광고 정책 안내입니다." },
    en: { title: "Privacy Policy | Corea Labs", desc: "Privacy Policy, cookie notice, and data handling practices for Corea Labs." },
  },
  terms: {
    ko: { title: "이용약관 (Terms of Service) | Corea Labs", desc: "Corea Labs 서비스 이용약관 안내입니다." },
    en: { title: "Terms of Service | Corea Labs", desc: "Terms of Service for using Corea Labs." },
  },
  about: {
    ko: { title: "사이트 소개 (About Corea Labs) | 대한민국 연구소", desc: "대한민국 문화유산과 전국 축제, 외국인 여행 정보를 11개국어로 제공하는 Corea Labs 소개 페이지입니다." },
    en: { title: "About Corea Labs | Multilingual South Korea Travel Archive", desc: "About Corea Labs: editorial standards, official data sources (KTO, CHA, KORAIL), and our 11-language mission." },
  },
};

export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const url = new URL(context.request.url);
  const pathSegment = url.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
  const queryPage = (url.searchParams.get("page") || url.searchParams.get("tab") || "").toLowerCase();
  const page = VALID_PAGES.has(pathSegment) ? pathSegment : VALID_PAGES.has(queryPage) ? queryPage : "home";

  const rawLang = (url.searchParams.get("lang") || "en").toLowerCase();
  const lang = VALID_LANGS.has(rawLang) ? rawLang : "en";

  const pageDict = SEO_DICT[page] || SEO_DICT.home;
  const meta = pageDict[lang] || pageDict.en || pageDict.ko;

  const hasExplicitLang = url.searchParams.has("lang") && VALID_LANGS.has(rawLang);
  const canonicalPath = page === "home" ? "/" : `/${page}`;
  const canonicalUrl = `https://corea-labs.com${canonicalPath}${hasExplicitLang ? `?lang=${lang}` : ""}`;
  const isNoIndex = page === "privacy" || page === "terms";

  return new HTMLRewriter()
    .on("html", {
      element(el) {
        el.setAttribute("lang", lang);
      },
    })
    .on("title", {
      element(el) {
        el.setInnerContent(meta.title);
      },
    })
    .on('meta[name="title"]', {
      element(el) {
        el.setAttribute("content", meta.title);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute("content", meta.desc);
      },
    })
    .on('meta[name="robots"]', {
      element(el) {
        if (isNoIndex) {
          el.setAttribute("content", "noindex, follow");
        }
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute("href", canonicalUrl);
      },
    })
    .on('meta[property="og:url"]', {
      element(el) {
        el.setAttribute("content", canonicalUrl);
      },
    })
    .on('meta[property="og:title"]', {
      element(el) {
        el.setAttribute("content", meta.title);
      },
    })
    .on('meta[property="og:description"]', {
      element(el) {
        el.setAttribute("content", meta.desc);
      },
    })
    .on('meta[name="twitter:url"]', {
      element(el) {
        el.setAttribute("content", canonicalUrl);
      },
    })
    .on('meta[name="twitter:title"]', {
      element(el) {
        el.setAttribute("content", meta.title);
      },
    })
    .on('meta[name="twitter:description"]', {
      element(el) {
        el.setAttribute("content", meta.desc);
      },
    })
    .transform(response);
}
