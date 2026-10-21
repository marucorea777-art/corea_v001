import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { STATIC_TRANSLATIONS } from "../dataTranslations";

export type LanguageCode = 
  | "ko" // Korean
  | "en" // English
  | "ja" // Japanese
  | "zh" // Chinese
  | "th" // Thai
  | "fr" // French
  | "es" // Spanish (Mexico)
  | "pt" // Portuguese (Brazil)
  | "ka" // Georgian
  | "ru" // Russian
  | "uk"; // Ukrainian

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", nativeName: "简体中文", flag: "🇨🇳" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "es", name: "Spanish", nativeName: "Español (MX)", flag: "🇲🇽" },
  { code: "pt", name: "Portuguese", nativeName: "Português (BR)", flag: "🇧🇷" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", flag: "🇬🇪" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
];

// Static dictionary for high-frequency UI elements
const UI_DICTIONARY: Record<LanguageCode, Record<string, string>> = {
  ko: {
    "Home": "홈",
    "Core": "홈",
    "Heritage": "문화유산",
    "Culture": "전통 문화",
    "Places": "추천 명소",
    "Festivals": "전국 축제",
    "Guide": "입국 가이드",
    "Visa & K-ETA": "비자 & K-ETA",
    "Arrival Step-by-Step Guide & Customs Policy": "입국 절차 & 세관 가이드",
    "Currency Exchange Tips & Smart Payment cards in Korea": "환전 요령 & 결제 카드",
    "ESTIMATOR": "환산기",
    "대강 원화 환산기": "대강 원화 환산기",
    "대강의 시세로 신속하게 원화 가치를 예측해 보세요.": "대강의 시세로 신속하게 원화 가치를 예측해 보세요.",
    "입국 준비 체크리스트": "입국 준비 체크리스트",
    "완료": "완료",
    "체크리스트 초기화하기": "체크리스트 초기화하기",
    "FOREIGN CURRENCY": "외화 금액 입력",
    "Search": "검색",
    "Search festivals...": "축제 검색...",
    "All Seasons": "모든 계절",
    "Spring": "봄",
    "Summer": "여름",
    "Autumn": "가을",
    "Winter": "겨울",
    "Explore": "탐색하기",
    "View Details": "상세 보기",
    "Back": "뒤로",
    "Close": "닫기",
    "Add Custom Festival": "나만의 축제 추가하기",
    "Delete": "삭제",
    "Loading translations...": "번역을 가져오는 중...",
    "Select Language": "언어 선택",
    "Corea Labs": "코리아 랩스",
  },
  en: {
    "Home": "Home",
    "Core": "Home",
    "Heritage": "Heritage",
    "Culture": "Culture",
    "Places": "Places",
    "Festivals": "Festivals",
    "Guide": "Guide",
    "Visa & K-ETA": "Visa & K-ETA",
    "Arrival Step-by-Step Guide & Customs Policy": "Arrival Guide & Customs Policy",
    "Currency Exchange Tips & Smart Payment cards in Korea": "Exchange Tips & Cards",
    "ESTIMATOR": "ESTIMATOR",
    "대강 원화 환산기": "Quick KRW Estimator",
    "대강의 시세로 신속하게 원화 가치를 예측해 보세요.": "Estimate KRW value instantly based on typical rates.",
    "입국 준비 체크리스트": "Travel Prep Checklist",
    "완료": "completed",
    "체크리스트 초기화하기": "Reset Checklist",
    "FOREIGN CURRENCY": "FOREIGN CURRENCY",
    "Search": "Search",
    "Search festivals...": "Search festivals...",
    "All Seasons": "All Seasons",
    "Spring": "Spring",
    "Summer": "Summer",
    "Autumn": "Autumn",
    "Winter": "Winter",
    "Explore": "Explore",
    "View Details": "View Details",
    "Back": "Back",
    "Close": "Close",
    "Add Custom Festival": "Add Custom Festival",
    "Delete": "Delete",
    "Loading translations...": "Loading translations...",
    "Select Language": "Language",
    "Corea Labs": "Corea Labs",
  },
  ja: {
    "Home": "ホーム",
    "Core": "ホーム",
    "Heritage": "文化遺産",
    "Culture": "伝統文化",
    "Places": "おすすめ名所",
    "Festivals": "全国お祭り",
    "Guide": "入国ガイド",
    "Visa & K-ETA": "ビザ & K-ETA",
    "Arrival Step-by-Step Guide & Customs Policy": "入国手続き & 税関ガイド",
    "Currency Exchange Tips & Smart Payment cards in Korea": "両替のコツ & 決済カード",
    "ESTIMATOR": "換算機",
    "대강 원화 환산기": "簡単ウォン換算機",
    "대강의 시세로 신속하게 원화 가치를 예측해 보세요.": "簡単なレートで素早くウォン価値を予測してみましょう。",
    "입국 준비 체크리스트": "入国準備チェックリスト",
    "완료": "完了",
    "체크리스트 초기화하기": "チェックリストを初期化する",
    "FOREIGN CURRENCY": "外貨入力",
    "Search": "検索",
    "Search festivals...": "お祭りを検索...",
    "All Seasons": "すべての季節",
    "Spring": "春",
    "Summer": "夏",
    "Autumn": "秋",
    "Winter": "冬",
    "Explore": "探索する",
    "View Details": "詳細を見る",
    "Back": "戻る",
    "Close": "閉じる",
    "Add Custom Festival": "マイフェスティバルを追加",
    "Delete": "削除",
    "Loading translations...": "翻訳を読み込み中...",
    "Select Language": "言語選択",
    "Corea Labs": "コリア・ラブズ",
    "The Spirit of the Peninsula": "半島の精神",
    "Echoes of Time: Korea's Eternal Heritage": "時の響き：韓国の永遠의 遺産",
    "Traverse thousands of years of royal grandeur, mystical philosophy, and scientific masterpieces that define Korea's eternal legacy.": "韓国の永遠の遺産を定義する、数千年にわたる王室の壮麗さ、神秘的な哲学、そして科学的な傑作を巡る旅に出かけましょう。",
    "The Five Grand Palaces": "五大宮殿",
    "The royal residential complexes of the Joseon Dynasty in Seoul.": "ソウルにある朝鮮王朝の王宮群。",
    "Seoul, South Korea": "大韓民国ソウル",
    "Founded": "創立",
    "Historical Treasures": "歴史的至宝",
    "Masterpieces of art, architecture, and wisdom across eras.": "時代を超えた芸術、建築、そして知恵の傑作。",
    "The Timeline of Dynasties": "王朝の歴史年表",
    "Chronological eras of the Korean peninsula from ancient kingdoms to the modern republic.": "古代王国から現代の共和国までの朝鮮半島の歴史的年表。",
    "The Pulse of Korea: Living Culture": "韓国の鼓動：生きた文化",
    "Where Ancient Soul Meets Future Vision": "古代の魂と未来のビジョンが出会う場所",
    "From the deep wisdom of slow fermented cuisine to hyper-synchronized performances and smart-city robotic futures.": "スローフード（発酵食品）の深い知恵から、一糸乱れぬパフォーマンス、そしてスマートシティのロボット工学の未来まで。",
    "Interactive K-Calligraphy Studio": "体験型・韓流書道スタジオ",
    "Generate a personalized Korean traditional calligraphy card with poetic meaning.": "詩的な意味を持つ、あなただけの韓国伝統の書道カードを作成します。",
    "Beyond the Ordinary": "日常を超えた旅へ",
    "Curated Destinations of South Korea": "厳選された韓国の旅行先",
    "Traverse four legendary cultural capitals—from neon sky-high metropolises to volcanic wonders and historical king tombs.": "きらびやかな大都市から、神秘的な火山、および歴史的な王陵まで、4つの伝説的な文化的都市を巡ります。",
    "Interactive 1-Day Itinerary Builder": "インタラクティブ1日旅行プラン作成",
    "Select a travel theme to craft your customized day in": "旅行のテーマを選んで、あなただけの特別な1日をデザインしてください：",
    "Royal Heritage": "宮廷の歴史遺産",
    "Future & Tech": "未来と最先端技術",
    "K-Gourmet": "韓国グルメ",
    "Korea's Seasonal Spectacles": "韓国の四季折々の祭典",
    "Harmonizing with nature's rhythm through ancient fire, water, and mud.": "古代の火、水、泥を通じて、大自然のリズムと同調する体験。",
    "My Festival Wishlist": "お祭りウィッシュリスト",
    "Save your favorite festivals to plan your seasonal tour.": "お気に入りのフェスティバルを保存して、季節ごとのツアーを計画しましょう。",
  },
  zh: {
    "Home": "首页",
    "Core": "首页",
    "Heritage": "文化遗产",
    "Culture": "传统文化",
    "Places": "推荐景点",
    "Festivals": "全国节日",
    "Guide": "入境指南",
    "Visa & K-ETA": "签证 & K-ETA",
    "Arrival Step-by-Step Guide & Customs Policy": "入境步骤 & 海关指南",
    "Currency Exchange Tips & Smart Payment cards in Korea": "兑换技巧 & 支付卡",
    "ESTIMATOR": "换算器",
    "대강 원화 환산기": "简易韩元换算器",
    "대강의 시세로 신속하게 원화 가치를 예측해 보세요.": "根据大致汇率快速估算韩元价值。",
    "입국 준비 체크리스트": "入境准备清单",
    "완료": "已完成",
    "체크리스트 초기화하기": "重置清单",
    "FOREIGN CURRENCY": "输入外币",
    "Search": "搜索",
    "Search festivals...": "搜索节日...",
    "All Seasons": "所有季节",
    "Spring": "春季",
    "Summer": "夏季",
    "Autumn": "秋季",
    "Winter": "冬季",
    "Explore": "探索",
    "View Details": "查看详情",
    "Back": "返回",
    "Close": "关闭",
    "Add Custom Festival": "添加自定义节日",
    "Delete": "删除",
    "Loading translations...": "正在加载翻译...",
    "Select Language": "选择语言",
    "Corea Labs": "韩国实验室",
    "The Spirit of the Peninsula": "半岛之魂",
    "Echoes of Time: Korea's Eternal Heritage": "岁月的呼唤：韩国永恒的文化遗产",
    "Traverse thousands of years of royal grandeur, mystical philosophy, and scientific masterpieces that define Korea's eternal legacy.": "穿越数千年的皇家壮丽、神秘哲学和科学杰作，探索定义韩国永恒传承的魅力。",
    "The Five Grand Palaces": "五大宫殿",
    "The royal residential complexes of the Joseon Dynasty in Seoul.": "首尔的朝鲜王朝皇家宫殿群。",
    "Seoul, South Korea": "韩国首尔",
    "Founded": "建于",
    "Historical Treasures": "历史瑰宝",
    "Masterpieces of art, architecture, and wisdom across eras.": "跨越时代的艺术、建筑与智慧杰作。",
    "The Timeline of Dynasties": "历代王朝年表",
    "Chronological eras of the Korean peninsula from ancient kingdoms to the modern republic.": "从古代王国到现代共和国的朝鲜半岛编年史。",
    "The Pulse of Korea: Living Culture": "韩国的脉搏：活态文化",
    "Where Ancient Soul Meets Future Vision": "古老灵魂与未来视界交汇之地",
    "From the deep wisdom of slow fermented cuisine to hyper-synchronized performances and smart-city robotic futures.": "从慢速发酵美食的深邃智慧，到高度同步的精彩表演与智能城市机器人未来。",
    "Interactive K-Calligraphy Studio": "互动韩式书法工坊",
    "Generate a personalized Korean traditional calligraphy card with poetic meaning.": "生成包含诗意内涵的个性化韩国传统书法贺卡。",
    "Beyond the Ordinary": "非凡之旅",
    "Curated Destinations of South Korea": "精选韩国旅行目的地",
    "Traverse four legendary cultural capitals—from neon sky-high metropolises to volcanic wonders and historical king tombs.": "探访四大传奇 cultural capitals——从霓虹闪烁的摩天都市到火山自然奇观与历史皇家陵墓。",
    "Interactive 1-Day Itinerary Builder": "互动一日游行程规划器",
    "Select a travel theme to craft your customized day in": "选择一个旅行主题，定制您在各城市的专属一天：",
    "Royal Heritage": "皇家文化遗产",
    "Future & Tech": "未来与科技",
    "K-Gourmet": "韩式美食",
    "Korea's Seasonal Spectacles": "韩国四季盛典",
    "Harmonizing with nature's rhythm through ancient fire, water, and mud.": "在远古的烈火、圣水与泥浆中，感悟与大自然律动的和谐共生。",
    "My Festival Wishlist": "我的节日心愿单",
    "Save your favorite festivals to plan your seasonal tour.": "收藏您喜爱的节日，规划您的四季旅程。",
  },
  th: {
    "Home": "หน้าแรก",
    "Core": "หน้าแรก",
    "Heritage": "มรดกทางวัฒนธรรม",
    "Culture": "วัฒนธรรม",
    "Places": "สถานที่เที่ยว",
    "Festivals": "เทศกาลต่างๆ",
    "Guide": "คู่มือเดินทาง",
    "Visa & K-ETA": "วีซ่า & K-ETA",
    "Arrival Step-by-Step Guide & Customs Policy": "ขั้นตอนการตรวจคนเข้าเมือง & ศุลกากร",
    "Currency Exchange Tips & Smart Payment cards in Korea": "เคล็ดลับการแลกเงิน & บัตรชำระเงิน",
    "ESTIMATOR": "เครื่องแปลงเงิน",
    "대강 원화 환산기": "คำนวณเงินวอนอย่างง่าย",
    "대강의 시세로 신속하게 원화 가치를 예측해 보세요.": "ประเมินค่าเงินวอนเกาหลีอย่างรวดเร็วตามอัตราแลกเปลี่ยนทั่วไป",
    "입국 준비 체크리스트": "รายการเตรียมตัวก่อนเดินทาง",
    "완료": "เสร็จสิ้น",
    "체크리스트 초기화하기": "รีเซ็ตรายการ",
    "FOREIGN CURRENCY": "กรอกจำนวนเงินตราต่างประเทศ",
    "Search": "ค้นหา",
    "Search festivals...": "ค้นหาเทศกาล...",
    "All Seasons": "ทุกฤดูกาล",
    "Spring": "ฤดูใบไม้ผลิ",
    "Summer": "ฤดูร้อน",
    "Autumn": "ฤดูใบไม้ร่วง",
    "Winter": "ฤดูหนาว",
    "Explore": "สำรวจ",
    "View Details": "ดูรายละเอียด",
    "Back": "ย้อนกลับ",
    "Close": "ปิด",
    "Add Custom Festival": "เพิ่มเทศกาลของคุณเอง",
    "Delete": "ลบ",
    "Loading translations...": "กำลังโหลดคำแปล...",
    "Select Language": "เลือกภาษา",
    "Corea Labs": "โคเรีย แล็บส์",
    "The Spirit of the Peninsula": "จิตวิญญาณแห่งคาบสมุทร",
    "Echoes of Time: Korea's Eternal Heritage": "เสียงสะท้อนแห่งกาลเวลา: มรดกนิรันดร์ของเกาหลี",
    "Traverse thousands of years of royal grandeur, mystical philosophy, and scientific masterpieces that define Korea's eternal legacy.": "ท่องผ่านประวัติศาสตร์นับพันปีแห่งความยิ่งใหญ่ของราชวงศ์ ปรัชญาอันลึกลับ และผลงานชิ้นเอกทางวิทยาศาสตร์ที่แต่งเติมเอกลักษณ์อันเป็นนิรันดร์ของเกาหลี",
    "The Five Grand Palaces": "พระราชวังหลวงทั้งห้า",
    "The royal residential complexes of the Joseon Dynasty in Seoul.": "กลุ่มพระราชวังหลวงที่ประทับของราชวงศ์โชซอนในกรุงโซล",
    "Seoul, South Korea": "กรุงโซล, เกาหลีใต้",
    "Founded": "ก่อตั้งในปี",
    "Historical Treasures": "สมบัติทางประวัติศาสตร์",
    "Masterpieces of art, architecture, and wisdom across eras.": "ผลงานชิ้นเอกด้านศิลปะ สถาปัตยกรรม และภูมิปัญญาในแต่ละยุคสมัย",
    "The Timeline of Dynasties": "ประวัติศาสตร์การเปลี่ยนผ่านราชวงศ์",
    "Chronological eras of the Korean peninsula from ancient kingdoms to the modern republic.": "ลำดับเหตุการณ์ตามยุคสมัยของคาบสมุทรเกาหลี ตั้งแต่อาณาจักรโบราณจนถึงสาธารณรัฐยุคปัจจุบัน",
    "The Pulse of Korea: Living Culture": "ชีพจรเกาหลี: วัฒนธรรมที่มีชีวิต",
    "Where Ancient Soul Meets Future Vision": "ที่ซึ่งจิตวิญญาณโบราณมาบรรจบกับวิสัยทัศน์แห่งอนาคต",
    "From the deep wisdom of slow fermented cuisine to hyper-synchronized performances and smart-city robotic futures.": "จากภูมิปัญญาอันลึกซึ้งของอาหารหมักบ่มแบบช้าๆ ไปจนถึงการแสดงที่ประสานกันอย่างยอดเยี่ยม และอนาคตหุ่นยนต์แห่งเมืองอัจฉริยะ",
    "Interactive K-Calligraphy Studio": "สตูดิโอเขียนพู่กันเกาหลีแบบอินเทอร์แอกทีฟ",
    "Generate a personalized Korean traditional calligraphy card with poetic meaning.": "สร้างการ์ดเขียนพู่กันเกาหลีดั้งเดิมในแบบของคุณเอง พร้อมความหมายอันไพเราะ",
    "Beyond the Ordinary": "เหนือความธรรมดา",
    "Curated Destinations of South Korea": "จุดหมายปลายทางยอดนิยมของเกาหลีใต้",
    "Traverse four legendary cultural capitals—from neon sky-high metropolises to volcanic wonders and historical king tombs.": "ท่องสี่เมืองหลวงทางวัฒนธรรมในตำนาน ตั้งแต่มหานครระยิบระยับด้วยแสงไฟนีออน ไปจนถึงสิ่งมหัศจรรย์ของภูเขาไฟและสุสานกษัตริย์ในประวัติศาสตร์",
    "Interactive 1-Day Itinerary Builder": "เครื่องมือวางแผนการเดินทาง 1 วัน",
    "Select a travel theme to craft your customized day in": "เลือกธีมการท่องเที่ยวเพื่อออกแบบวันพักผ่อนในแบบของคุณเอง:",
    "Royal Heritage": "มรดกทางราชวงศ์",
    "Future & Tech": "อนาคตและเทคโนโลยี",
    "K-Gourmet": "อาหารเกาหลี",
    "Korea's Seasonal Spectacles": "เทศกาลรื่นเริงตามฤดูกาลของเกาหลี",
    "Harmonizing with nature's rhythm through ancient fire, water, and mud.": "ประสานกลมกลืนกับจังหวะของธรรมชาติ ผ่านการละเล่นไฟ น้ำ และโคลนในยุคโบราณ",
    "My Festival Wishlist": "เทศกาลโปรดของฉัน",
    "Save your favorite festivals to plan your seasonal tour.": "บันทึกเทศกาลที่คุณชื่นชอบเพื่อวางแผนการเดินทางของคุณ",
  },
  fr: {
    "Home": "Accueil",
    "Core": "Accueil",
    "Heritage": "Patrimoine",
    "Culture": "Culture",
    "Places": "Destinations",
    "Festivals": "Festivals",
    "Guide": "Guide",
    "Visa & K-ETA": "Visa & K-ETA",
    "Arrival Step-by-Step Guide & Customs Policy": "Procédure d'Arrivée & Douane",
    "Currency Exchange Tips & Smart Payment cards in Korea": "Conseils de Change & Cartes de Paiement",
    "ESTIMATOR": "ESTIMATEUR",
    "대강 원화 환산기": "Convertisseur Rapide en KRW",
    "대강의 시세로 신속하게 원화 가치를 예측해 보세요.": "Estimez rapidement la valeur en KRW selon les taux généraux.",
    "입국 준비 체크리스트": "Liste de Préparation au Voyage",
    "완료": "terminé",
    "체크리스트 초기화하기": "Réinitialiser la liste",
    "FOREIGN CURRENCY": "DEVISE ÉTRANGÈRE",
    "Search": "Rechercher",
    "Search festivals...": "Rechercher des festivals...",
    "All Seasons": "Toutes Saisons",
    "Spring": "Printemps",
    "Summer": "Été",
    "Autumn": "Automne",
    "Winter": "Hiver",
    "Explore": "Explorer",
    "View Details": "Voir Détails",
    "Back": "Retour",
    "Close": "Fermer",
    "Add Custom Festival": "Ajouter un Festival",
    "Delete": "Supprimer",
    "Loading translations...": "Chargement des traductions...",
    "Select Language": "Langue",
    "Corea Labs": "Corea Labs",
  },
  es: {
    "Home": "Inicio",
    "Core": "Inicio",
    "Heritage": "Patrimonio",
    "Culture": "Cultura",
    "Places": "Destinos",
    "Festivals": "Festivales",
    "Guide": "Guía",
    "Visa & K-ETA": "Visa y K-ETA",
    "Arrival Step-by-Step Guide & Customs Policy": "Proceso de Llegada y Aduanas",
    "Currency Exchange Tips & Smart Payment cards in Korea": "Consejos de Cambio y Tarjetas",
    "ESTIMATOR": "ESTIMADOR",
    "대강 원화 환산기": "Conversor Rápido de KRW",
    "대강의 시세로 신속하게 원화 가치를 예측해 보세요.": "Estime el valor de KRW rápidamente con tasas estimadas.",
    "입국 준비 체크리스트": "Lista de Preparación de Viaje",
    "완료": "completado",
    "체크리스트 초기화하기": "Reiniciar lista",
    "FOREIGN CURRENCY": "MONEDA EXTRANJERA",
    "Search": "Buscar",
    "Search festivals...": "Buscar festivales...",
    "All Seasons": "Todas las Estaciones",
    "Spring": "Primavera",
    "Summer": "Verano",
    "Autumn": "Otoño",
    "Winter": "Invierno",
    "Explore": "Explorar",
    "View Details": "Ver Detalles",
    "Back": "Atrás",
    "Close": "Cerrar",
    "Add Custom Festival": "Agregar Festival",
    "Delete": "Eliminar",
    "Loading translations...": "Cargando traducciones...",
    "Select Language": "Idioma",
    "Corea Labs": "Corea Labs",
  },
  pt: {
    "Home": "Início",
    "Core": "Início",
    "Heritage": "Patrimônio",
    "Culture": "Cultura",
    "Places": "Destinos",
    "Festivals": "Festivais",
    "Guide": "Guia",
    "Visa & K-ETA": "Visto & K-ETA",
    "Arrival Step-by-Step Guide & Customs Policy": "Processo de Chegada & Alfândega",
    "Currency Exchange Tips & Smart Payment cards in Korea": "Dicas de Câmbio & Cartões de Pagamento",
    "ESTIMATOR": "ESTIMADOR",
    "대강 원화 환산기": "Conversor Rápido de KRW",
    "대강의 시세로 신속하게 원화 가치를 예측해 보세요.": "Estime o valor em KRW rapidamente com taxas estimadas.",
    "입국 준비 체크리스트": "Lista de Preparação de Viagem",
    "완료": "concluído",
    "체크리스트 초기화하기": "Reiniciar lista",
    "FOREIGN CURRENCY": "MOEDA ESTRANGEIRA",
    "Search": "Buscar",
    "Search festivals...": "Buscar festivais...",
    "All Seasons": "Todas as Estações",
    "Spring": "Primavera",
    "Summer": "Verão",
    "Autumn": "Outono",
    "Winter": "Inverno",
    "Explore": "Explorar",
    "View Details": "Ver Detalhes",
    "Back": "Voltar",
    "Close": "Fechar",
    "Add Custom Festival": "Adicionar Festival",
    "Delete": "Excluir",
    "Loading translations...": "Carregando traduções...",
    "Select Language": "Idioma",
    "Corea Labs": "Corea Labs",
  },
  ka: {
    "Home": "მთავარი",
    "Core": "მთავარი",
    "Heritage": "მემკვიდრეობა",
    "Culture": "კულტურა",
    "Places": "ადგილები",
    "Festivals": "ფესტივალები",
    "Guide": "გზამკვლევი",
    "Visa & K-ETA": "ვიზა და K-ETA",
    "Arrival Step-by-Step Guide & Customs Policy": "ჩამოსვლის პროცედურა და საბაჟო",
    "Currency Exchange Tips & Smart Payment cards in Korea": "ვალუტის გაცვლა და ბარათები",
    "ESTIMATOR": "კონვერტორი",
    "대강 원화 환산기": "ვონის სწრაფი კალკულატორი",
    "대강의 시세로 신속하게 원화 가치를 예측해 보세요.": "სწრაფად გამოთვალეთ კორეული ვონის ღირებულება მიახლოებითი კურსით.",
    "입국 준비 체크리스트": "მოგზაურობისთვის მზადების სია",
    "완료": "დასრულდა",
    "체크리스트 초기화하기": "სიის განულება",
    "FOREIGN CURRENCY": "უცხოური ვალუტა",
    "Search": "ძებნა",
    "Search festivals...": "ფესტივალების ძებნა...",
    "All Seasons": "ყველა სეზონი",
    "Spring": "გაზაფხული",
    "Summer": "ზაფხული",
    "Autumn": "შემოდგომა",
    "Winter": "ზამთარი",
    "Explore": "აღმოაჩინე",
    "View Details": "დეტალები",
    "Back": "უკან",
    "Close": "დახურვა",
    "Add Custom Festival": "ფესტივალის დამატება",
    "Delete": "წაშლა",
    "Loading translations...": "თარგმანი იტვირთება...",
    "Select Language": "ენის არჩევა",
    "Corea Labs": "Corea Labs",
  },
  ru: {
    "Home": "Главная",
    "Core": "Главная",
    "Heritage": "Наследие",
    "Culture": "Культура",
    "Places": "Места",
    "Festivals": "Фестивали",
    "Guide": "Гид",
    "Visa & K-ETA": "Виза и K-ETA",
    "Arrival Step-by-Step Guide & Customs Policy": "Правила въезда и таможня",
    "Currency Exchange Tips & Smart Payment cards in Korea": "Обмен валюты и карты",
    "ESTIMATOR": "КОНВЕРТЕР",
    "대강 원화 환산기": "Быстрый конвертер в KRW",
    "대강의 시세로 신속하게 원화 가치를 예측해 보세요.": "Быстро оцените стоимость в вонах по примерному курсу.",
    "입국 준비 체크리스트": "Чек-лист для поездки",
    "완료": "выполнено",
    "체크리스트 초기화하기": "Сбросить чек-лист",
    "FOREIGN CURRENCY": "ИНОСТРАННАЯ ВАЛЮТА",
    "Search": "Поиск",
    "Search festivals...": "Искать фестивали...",
    "All Seasons": "Все сезоны",
    "Spring": "Весна",
    "Summer": "Лето",
    "Autumn": "Осень",
    "Winter": "Зима",
    "Explore": "Исследовать",
    "View Details": "Подробнее",
    "Back": "Назад",
    "Close": "Закрыть",
    "Add Custom Festival": "Добавить фестиваль",
    "Delete": "Удалить",
    "Loading translations...": "Загрузка перевода...",
    "Select Language": "Язык",
    "Corea Labs": "Corea Labs",
  },
  uk: {
    "Home": "Головна",
    "Core": "Головна",
    "Heritage": "Спадщина",
    "Culture": "Культура",
    "Places": "Місця",
    "Festivals": "Фестивалі",
    "Guide": "Гід",
    "Visa & K-ETA": "Віза та K-ETA",
    "Arrival Step-by-Step Guide & Customs Policy": "Правила в'їзду та митниця",
    "Currency Exchange Tips & Smart Payment cards in Korea": "Обмін валюти та картки",
    "ESTIMATOR": "КОНВЕРТЕР",
    "대강 원화 환산기": "Швидкий конвертер у KRW",
    "대강의 시세로 신속하게 원화 가치를 예측해 보세요.": "Швидко оцініть вартість у вонах за приблизним курсом.",
    "입국 준비 체크리스트": "Чек-лист для поїздки",
    "완료": "виконано",
    "체크리스트 초기화하기": "Скинути чек-лист",
    "FOREIGN CURRENCY": "ІНОЗЕМНА ВАЛЮТА",
    "Search": "Пошук",
    "Search festivals...": "Шукати фестивалі...",
    "All Seasons": "Всі сезони",
    "Spring": "Весна",
    "Summer": "Літо",
    "Autumn": "Осінь",
    "Winter": "Зима",
    "Explore": "Дослідити",
    "View Details": "Детальніше",
    "Back": "Назад",
    "Close": "Закрити",
    "Add Custom Festival": "Додати фестиваль",
    "Delete": "Видалити",
    "Loading translations...": "Завантаження перекладу...",
    "Select Language": "Мова",
    "Corea Labs": "Corea Labs",
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  translateText: (text: string) => Promise<string>;
  translateBatch: (texts: string[]) => Promise<string[]>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("corea_labs_lang");
    return (saved as LanguageCode) || "en";
  });

  // Keep a persistent translation cache in state and localStorage
  const [translationCache, setTranslationCache] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`corea_labs_cache_${language}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Update language and load its specific cache
  const setLanguage = (lang: LanguageCode) => {
    localStorage.setItem("corea_labs_lang", lang);
    setLanguageState(lang);
    try {
      const saved = localStorage.getItem(`corea_labs_cache_${lang}`);
      setTranslationCache(saved ? JSON.parse(saved) : {});
    } catch {
      setTranslationCache({});
    }
  };

  // Helper to detect if a string contains Korean characters (Hangul)
  const containsKorean = (text: string): boolean => {
    return /[\uac00-\ud7af]/u.test(text);
  };

  // Helper to resolve translation key
  const t = useCallback((key: string): string => {
    // If language is Korean and key is already Korean, return as-is
    if (language === "ko" && containsKorean(key)) {
      return key;
    }

    // If language is English and key is English (no Korean), return as-is
    if (language === "en" && !containsKorean(key)) {
      return key;
    }
    
    // Look up in static UI dictionary
    const dict = UI_DICTIONARY[language];
    if (dict && dict[key]) {
      return dict[key];
    }

    // Look up in custom static translations
    const staticDict = STATIC_TRANSLATIONS[language];
    if (staticDict && staticDict[key]) {
      return staticDict[key];
    }

    // Look up in runtime cache
    if (translationCache[key]) {
      return translationCache[key];
    }

    // Otherwise, return original key as fallback
    return key;
  }, [language, translationCache]);

  // Queue for batching translation requests to the server to prevent rate limiting
  const pendingRequestsRef = useRef<{
    text: string;
    resolve: (translated: string) => void;
    reject: (err: any) => void;
  }[]>([]);
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const apiFallbackActiveRef = useRef<Record<string, boolean>>({});

  // Consolidated batch translation fetcher with debounce
  const queueTranslation = useCallback((text: string): Promise<string> => {
    if (apiFallbackActiveRef.current[language]) {
      return Promise.resolve(t(text));
    }

    return new Promise<string>((resolve, reject) => {
      pendingRequestsRef.current.push({ text, resolve, reject });

      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }

      batchTimerRef.current = setTimeout(async () => {
        batchTimerRef.current = null;
        const currentQueue = pendingRequestsRef.current;
        pendingRequestsRef.current = [];

        if (currentQueue.length === 0) return;

        // Extract unique texts to translate
        const uniqueTexts: string[] = Array.from(new Set(currentQueue.map(item => item.text))) as string[];
        const targetLangObj = LANGUAGES.find(l => l.code === language);
        const targetLanguageName = targetLangObj ? targetLangObj.name : "English";

        try {
          const response = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              texts: uniqueTexts,
              targetLanguage: targetLanguageName
            }),
          });

          if (!response.ok) {
            throw new Error("Translation request failed");
          }

          const data = await response.json();
          const translations: string[] = data.translations || [];
          const hasError = !!data.error;
          const quotaExceeded = !!data.quotaExceeded;

          if (quotaExceeded || hasError) {
            console.warn(`Translation API quota/rate limit hit for ${language}. Activating static fallback mode.`);
            apiFallbackActiveRef.current[language] = true;
          }

          // Map unique text to its translation
          const translationMap: Record<string, string> = {};
          uniqueTexts.forEach((originalText, idx) => {
            translationMap[originalText] = translations[idx] || originalText;
          });

          // Update local cache in bulk
          const newCache = { ...translationCache };
          let cacheChanged = false;

          if (!hasError) {
            uniqueTexts.forEach(originalText => {
              const translatedText = translationMap[originalText];
              if (translatedText !== originalText) {
                newCache[originalText] = translatedText;
                cacheChanged = true;
              }
            });
            if (cacheChanged) {
              setTranslationCache(newCache);
              localStorage.setItem(`corea_labs_cache_${language}`, JSON.stringify(newCache));
            }
          }

          // Resolve all pending items
          currentQueue.forEach(item => {
            item.resolve(translationMap[item.text] || item.text);
          });
        } catch (error) {
          console.warn("Batch translation fetch failed. Falling back to original texts.", error);
          // If network failed or offline, trigger fallback
          apiFallbackActiveRef.current[language] = true;
          // Resolve with fallback
          currentQueue.forEach(item => {
            item.resolve(t(item.text));
          });
        }
      }, 120); // 120ms debounce window is perfect for batching all page load items
    });
  }, [language, translationCache, t]);

  // Dynamic Single text translation helper (utilizes the debounced queue)
  const translateText = useCallback(async (text: string): Promise<string> => {
    if (!text.trim()) return text;
    if (language === "ko" && containsKorean(text)) return text;
    if (language === "en" && !containsKorean(text)) return text;

    if (STATIC_TRANSLATIONS[language]?.[text]) return STATIC_TRANSLATIONS[language][text];
    if (translationCache[text]) return translationCache[text];

    return queueTranslation(text);
  }, [language, queueTranslation, translationCache]);

  // Dynamic Batch translation helper (utilizes the debounced queue in parallel)
  const translateBatch = useCallback(async (texts: string[]): Promise<string[]> => {
    if (texts.length === 0) {
      return texts;
    }
    return Promise.all(texts.map(text => translateText(text)));
  }, [translateText]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateText, translateBatch }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}

// Higher-order Component or helper component to dynamically translate texts with a skeleton state
interface TranslateProps {
  children: string;
}

export function Translate({ children }: TranslateProps) {
  const { language, t, translateText } = useTranslation();
  const [translated, setTranslated] = useState<string>(() => t(children));
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const immediate = t(children);

    const containsKorean = (text: string): boolean => {
      return /[\uac00-\ud7af]/u.test(text);
    };

    const isTargetMatch = 
      immediate !== children || 
      (language === "ko" && containsKorean(children)) ||
      (language === "en" && !containsKorean(children));

    if (isTargetMatch) {
      setTranslated(immediate);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    
    translateText(children).then(res => {
      if (isMounted) {
        setTranslated(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [children, language, t, translateText]);

  if (loading) {
    return (
      <span className="animate-pulse bg-stone-200/60 rounded text-transparent select-none inline-block px-1">
        {children}
      </span>
    );
  }

  return <>{translated}</>;
}

export function useTranslatedData<T>(
  originalData: T,
  keysToTranslate: string[]
): { translatedData: T; loading: boolean } {
  const { language, translateBatch } = useTranslation();
  const [translatedData, setTranslatedData] = useState<T>(originalData);
  const [loading, setLoading] = useState<boolean>(false);

  const keysSerialized = JSON.stringify(keysToTranslate);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const keys = JSON.parse(keysSerialized);
    const stringMap: { path: string[]; text: string }[] = [];

    const traverseAndExtract = (obj: any, path: string[]) => {
      if (!obj) return;
      if (typeof obj === "string") {
        const lastKey = path[path.length - 1];
        const isTargetKey = keys.includes(lastKey) || 
                            (path.length > 1 && keys.includes(path[path.length - 2]) && !isNaN(Number(lastKey)));
        
        if (isTargetKey && obj.trim()) {
          stringMap.push({ path, text: obj });
        }
        return;
      }
      if (Array.isArray(obj)) {
        obj.forEach((item, idx) => {
          traverseAndExtract(item, [...path, String(idx)]);
        });
        return;
      }
      if (typeof obj === "object") {
        for (const k in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, k)) {
            traverseAndExtract(obj[k], [...path, k]);
          }
        }
      }
    };

    traverseAndExtract(originalData, []);

    if (stringMap.length === 0) {
      setTranslatedData(originalData);
      setLoading(false);
      return;
    }

    const textsToTranslate = stringMap.map((item) => item.text);
    translateBatch(textsToTranslate).then((translations) => {
      if (!isMounted) return;

      const dataCopy = JSON.parse(JSON.stringify(originalData));

      stringMap.forEach((item, idx) => {
        const translatedText = translations[idx] || item.text;
        
        let current = dataCopy;
        for (let i = 0; i < item.path.length - 1; i++) {
          current = current[item.path[i]];
        }
        current[item.path[item.path.length - 1]] = translatedText;
      });

      setTranslatedData(dataCopy);
      setLoading(false);
    }).catch(err => {
      console.error("Translation hook failed:", err);
      if (isMounted) {
        setTranslatedData(originalData);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [originalData, keysSerialized, language, translateBatch]);

  return { translatedData, loading };
}

