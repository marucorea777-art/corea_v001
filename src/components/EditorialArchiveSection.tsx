import { useState } from "react";
import { BookOpen, Landmark, Train, Calendar, Compass, ShieldCheck, Globe, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Translate } from "../context/LanguageContext";

interface EditorialArchiveSectionProps {
  setActiveTab: (tab: string) => void;
}

export default function EditorialArchiveSection({ setActiveTab }: EditorialArchiveSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const articles = [
    {
      id: "editorial-palace-architecture",
      category: "heritage",
      badge: "연구 리포트 01 · 왕실 건축과 세계유산",
      title: "조선 왕실 5대 궁궐의 건축 철학과 공간 미학: 경복궁·창덕궁 후원의 자연주의 설계 해설",
      subtitle: "The Architectural Philosophy of Joseon Royal Palaces: Geomancy, Dancheong Pigments, and Harmonious Coexistence with Nature",
      readTime: "8분 분량 심층 칼럼",
      targetTab: "heritage",
      targetLabel: "5대 고궁 및 세계유산 상세 도감 열기",
      icon: Landmark,
      paragraphs: [
        "1392년 개창된 조선 왕조의 수도 한양(현 서울)은 북악산을 주산(主山)으로 삼고 남쪽의 한강을 바라보는 배산임수(背山臨水)의 풍수지리적 원리 위에 설계되었습니다. 그 중심에 자리한 법궁 경복궁(景福宮)은 『시경(詩經)』의 '군자만년 개이경복(君子萬年 介爾景福, 군자 만년에 큰 복을 누리소서)'에서 이름을 따왔으며, 광화문·흥례문·근정문·근정전·사정전·강녕전·교태전으로 이어지는 엄격한 남북 직선 축을 통해 유교적 예치(禮治) 질서를 공간적으로 구현했습니다.",
        "반면 1405년 이궁(離宮)으로 창건되어 유네스코 세계문화유산에 등재된 창덕궁(昌德宮)은 인위적인 직선 축을 과감히 탈피하고 응봉 자락의 구릉과 계곡 지형을 그대로 보존하는 한국 고유의 '자연 순응형 비대칭 배치'를 보여줍니다. 특히 왕실 정원인 후원(비원·秘苑)의 부용지와 주합루 일대는 산자락의 물길을 인위적으로 바꾸지 않고 네모난 연못(지당)과 둥근 섬을 조성하여 '하늘은 둥글고 땅은 네모나다'는 천원지방(天圓地方) 우주관을 시각화한 동아시아 정원 건축의 백미로 꼽힙니다.",
        "궁궐 전각을 수놓은 단청(丹靑)과 한옥의 과학적 구조 또한 주목해야 할 관람 포인트입니다. 소나무 목재 표면에 청·적·황·백·흑의 오방색 천연 안료를 입힌 단청은 왕실의 권위를 상징할 뿐만 아니라, 비바람에 의한 목재 부식과 해충 피해를 막아 수백 년간 건축물을 보존하는 과학적 방부 코팅 역할을 수행합니다. 또한 겨울철 아궁이의 불기운이 방바닥 구들장을 데우는 온돌(Ondol)과 여름철 바람이 통하는 대청마루가 한 건물 안에 공존하는 구조는 대륙성 기후와 해양성 기후가 교차하는 한반도 환경에 대응한 독창적 건축 유산입니다.",
        "실전 관람 팁: 경복궁은 매주 화요일, 창덕궁·덕수궁·창경궁·종묘는 매주 월요일이 정기 휴궁일입니다. 내·외국인 모두 전통 한복(상의 저고리와 하의 치마·바지를 갖춘 정식 한복)을 착용하면 5대 궁궐의 일반 관람권이 100% 무료로 면제되며, 매표소 대기 없이 전용 입구로 즉시 입장할 수 있습니다. 광화문 앞 광장에서 매일 오전 10시와 오후 2시에 거행되는 '수문장 교대의식'은 조선 전기 왕실 호위군(금군)의 복식과 전통 군악(대취타)을 원형 그대로 재현하므로 방문 전 시간을 맞추는 것을 권장합니다."
      ]
    },
    {
      id: "editorial-seasonal-festivals",
      category: "festivals",
      badge: "연구 리포트 02 · 사계절 세시풍속과 지역 축제",
      title: "한국의 24절기 세시풍속에서 현대 글로벌 축제로: 봄 벚꽃·여름 단오·가을 유등·겨울 얼음축제의 문화사",
      subtitle: "From Agrarian Lunar Traditions to Global Seasonal Festivals: Historical Origins of Korea's 27 Representative Regional Celebrations",
      readTime: "7분 분량 심층 칼럼",
      targetTab: "festivals",
      targetLabel: "전국 27대 계절 축제 일정 및 교통편 보기",
      icon: Calendar,
      paragraphs: [
        "한반도는 봄·여름·가을·겨울의 사계절 기온 차와 식생 변화가 뚜렷하여, 예로부터 농경 주기와 맞물린 24절기(二十四節氣) 세시풍속과 공동체 대동제가 발달했습니다. 오늘날 매년 수백만 명의 국내외 여행자가 찾는 한국의 지역 축제들은 단순한 현대적 이벤트를 넘어, 각 지역의 지리적 특산품과 수백 년 이어진 역사적 서사를 현대적으로 계승한 살아있는 문화 박물관입니다.",
        "봄(3월~5월)에는 남해안의 따뜻한 해풍을 따라 지리산 자락의 구례 산수유꽃축제와 진해 군항제(36만 그루 왕벚나무), 서울 여의도 봄꽃축제, 경주 보문단지 벚꽃축제가 차례로 북상합니다. 동시에 전남 보성 다향제와 담양 대나무축제는 한반도 남부 다원(茶園) 문화와 선비들의 정원 문화를 체험할 수 있는 생태 문화 축제로 자리매김했습니다. 음력 4월 초파일을 전후해 서울 종로와 조계사 일대에서 펼쳐지는 연등회(유네스코 인류무형문화유산)는 통일신라 시대부터 1,200년 이상 이어진 등불 축제의 원형을 보여줍니다.",
        "여름(6월~8월)에는 유네스코 인류무형문화유산인 강릉 단오제(음력 5월 5일, 대관령 산신제와 관노가면극)를 필두로, 충남 대천해수욕장의 천연 갯벌 미네랄을 활용한 보령 머드축제, 대구의 더위를 식히는 대구 치맥(치킨+맥주) 페스티벌, 부여 궁남지 천만 송이 연꽃의 서동연꽃축제가 열립니다. 가을(9월~11월)에는 1592년 임진왜란 진주성 전투 당시 남강에 띄운 군사 신호등에서 유래한 '진주 남강유등축제'와 하회별신굿탈놀이를 중심으로 세계 각국의 가면극이 모이는 '안동 국제탈춤페스티벌', 정조대왕의 1795년 을묘년 원행을 재현한 '수원화성 문화제'가 한국 가을 여행의 정점을 장식합니다.",
        "겨울(12월~2월)에는 영하 10도를 밑도는 강원도 산간 하천의 결빙 환경을 역발상으로 활용한 '화천 산천어축제'와 '평창 송어축제', 태백산 눈축제가 개최되어 동남아시아 및 구미권 여행자들에게 이색적인 얼음낚시와 설경 체험을 선사합니다. 코레아 랩스(Corea Labs)의 축제 가이드에서는 각 축제장까지 서울역·용산역·청량리역 및 서울고속버스터미널에서 출발하는 KTX·시외버스 노선과 소요 시간, 셔틀버스 환승 지점을 11개 언어로 상세히 안내하고 있습니다."
      ]
    },
    {
      id: "editorial-ktx-transit-network",
      category: "travel",
      badge: "연구 리포트 03 · 전국 교통망 및 이동 전략",
      title: "서울에서 전국 소도시까지 2시간대 연결: KTX 고속철도·고속버스·T-Money 대중교통 통합 가이드",
      subtitle: "Mastering South Korea's High-Speed Rail (KTX/SRT), Intercity Express Buses, and Unified Smart Transit Cards",
      readTime: "6분 분량 실전 가이드",
      targetTab: "travel",
      targetLabel: "외국인 한국 입국·환전·교통 가이드 열기",
      icon: Train,
      paragraphs: [
        "대한민국은 세계에서 가장 촘촘하고 정시성이 뛰어난 대중교통 인프라를 갖춘 나라 중 하나입니다. 시속 300km로 주행하는 고속철도 KTX(Korea Train eXpress)와 SRT를 이용하면 서울에서 부산까지 약 2시간 15분, 경주까지 2시간, 전주까지 1시간 35분, 강릉까지 1시간 50분, 안동까지(KTX-이음) 2시간이면 도착할 수 있어 렌터카 없이도 전국 어디든 당일 또는 1박 2일 자유여행이 가능합니다.",
        "출발역 선택 시 유의할 점이 있습니다. 부산·동대구·경주·포항·진주 방면 경부선 KTX는 주로 '서울역(Seoul Station)'에서 출발하며, 전주·광주송정·목포·여수엑스포·순천·구례구 방면 호남선·전라선 KTX는 '용산역(Yongsan Station)'을 기점으로 운행됩니다(일부 열차는 서울역 공용). 반면 강원도 강릉·동해 방면 강릉선과 안동·영주·태백 방면 중앙선·태백선 열차는 '청량리역(Cheongnyangni Station)' 또는 서울역에서 탑승할 수 있으므로 예매 시 출발역을 반드시 확인해야 합니다.",
        "철도가 직접 닿지 않는 해안가나 산간 축제장(예: 보성 녹차밭, 화천 산천어축제장, 진해 벚꽃 명소 등)은 서울고속버스터미널(지하철 3·7·9호선 고속터미널역) 또는 동서울터미널(2호선 강변역)에서 출발하는 우등·프리미엄 고속버스를 이용하거나, 인근 KTX 거점역에서 지자체가 운영하는 축제 전용 무료 셔틀버스로 환승하는 것이 가장 효율적입니다.",
        "시내 이동과 지도 앱 활용: 한국에서는 국가 안보 관련 지리정보 규정으로 인해 구글 지도(Google Maps)의 도보 및 자동차 실시간 길찾기 기능이 제한됩니다. 따라서 한국 여행 시에는 영어·일본어·중국어를 완벽히 지원하는 '네이버 지도(Naver Map)' 또는 '카카오맵(KakaoMap)'을 설치하면 전국 지하철 몇 번 칸에서 타야 환승이 빠른지, 시내버스가 몇 분 뒤에 도착하는지 초 단위로 확인할 수 있습니다. 결제는 전국 모든 지하철·버스·택시·편의점에서 호환되는 'T-Money(티머니)' 카드 또는 무인 환전과 교통카드 기능이 결합된 외국인 전용 'WOWPASS(와우패스)' 한 장이면 충분합니다."
      ]
    },
    {
      id: "editorial-intangible-culture",
      category: "culture",
      badge: "연구 리포트 04 · 문자·식문화·무형유산",
      title: "훈민정음(한글)의 창제 원리와 한식(Hansik) 발효 과학: 한국 전통문화의 핵심 가치",
      subtitle: "The Scientific Design of Hangeul, Fermentation Philosophy of Hansik Cuisine, and Korea's UNESCO Intangible Heritage",
      readTime: "7분 분량 심층 칼럼",
      targetTab: "culture",
      targetLabel: "한국 전통문화(한복·한식·한옥) 상세 보기",
      icon: BookOpen,
      paragraphs: [
        "1443년 조선 제4대 임금 세종대왕이 창제하고 1446년 반포한 '훈민정음(訓民正音, 백성을 가르치는 바른 소리)'은 창제자와 창제 연도, 그리고 제자(製字) 원리가 기록된 해례본(유네스코 세계기록유산)이 현존하는 세계 유일의 문자입니다. 한글의 자음(ㄱ, ㄴ, ㅁ, ㅅ, ㅇ)은 발음할 때 혀, 목구멍, 입술 등 발음기관의 해부학적 모양을 본떠 만들었으며, 모음(ㆍ, ㅡ, ㅣ)은 하늘(天), 땅(地), 사람(人)의 삼재(三才) 철학을 결합하여 단 24자의 기본 글자만으로 수천 가지 소리를 정확히 표기할 수 있도록 설계되었습니다.",
        "한국의 전통 식문화인 한식(韓食, Hansik)은 계절에 따라 수확되는 제철 채소와 곡물, 그리고 오랜 시간을 들여 숙성시키는 '발효(Fermentation) 과학'에 뿌리를 두고 있습니다. 유네스코 인류무형문화유산으로 등재된 '김장 문화(Kimjang)'와 최근 등재된 '한국의 장(醬) 담그기 문화(간장·된장·고추장)'는 소금, 콩, 고추, 마늘, 생강 등이 유산균 및 유익 미생물과 만나 깊은 감칠맛(Umami)과 면역력을 높이는 영양소를 만들어내는 지혜의 산물입니다.",
        "한국의 식탁은 서양식 코스 요리와 달리 밥(주식)과 국·찌개, 그리고 여러 가지 반찬(나물, 김치, 구이, 조림)을 한 상에 차려내는 '첩반상(空間 전개형 식사)' 구조를 띱니다. 전주 비빔밥, 안동 찜닭과 간고등어, 춘천 닭갈비, 부산 돼지국밥과 밀면, 제주 흑돼지와 해산물 등 각 지역마다 기후와 지형에 맞춘 고유한 향토 음식이 발달해 있어 미식 기행만으로도 깊이 있는 한국 여행을 완성할 수 있습니다.",
        "식사 예절과 채식·할랄 팁: 한국 식당에서는 물과 기본 반찬(밑반찬)이 무료로 제공되며 추가 리필이 가능합니다. 숟가락은 밥과 국물을 먹을 때, 젓가락은 반찬과 면을 집을 때 구분해 사용하며 밥그릇을 손에 들고 먹지 않고 식탁에 놓고 식사하는 것이 전통 예절입니다. 채식주의자(Vegan/Vegetarian)나 무슬림 여행자의 경우 사찰 음식(Temple Food) 전문점이나 산채비빔밥, 두부 요리 전문점을 방문하면 오신채(파·마늘 등)와 육류를 배제한 정갈한 전통 채식 한식을 안심하고 즐길 수 있습니다."
      ]
    },
    {
      id: "editorial-regional-cities",
      category: "places",
      badge: "연구 리포트 05 · 권역별 도시 큐레이션",
      title: "서울을 넘어선 대한민국 6대 거점 도시 완벽 분석: 경주·전주·부산·강릉·제주·안동 여행 코스",
      subtitle: "Beyond Seoul: Comprehensive Regional Itinerary Guide to Gyeongju, Jeonju, Busan, Gangneung, Andong, and Jeju Island",
      readTime: "8분 분량 지역 분석",
      targetTab: "places",
      targetLabel: "한국 대표 도시 및 추천 명소 가이드 열기",
      icon: Compass,
      paragraphs: [
        "한국을 처음 방문하는 여행자라도 서울에만 머무르기보다 KTX나 국내선 항공편을 활용해 지방 거점 도시 1~2곳을 일정에 포함하면 한국의 입체적인 매력을 온전히 경험할 수 있습니다. 각 도시는 수천 년의 고대 왕국 수도부터 현대적인 해양 메트로폴리스까지 뚜렷한 정체성을 지니고 있습니다.",
        "1) 경주(Gyeongju) & 안동(Andong): 경주는 기원전 57년부터 서기 935년까지 약 천 년간 지속된 신라 왕조의 수도로, 도시 전체가 '지붕 없는 박물관'이라 불립니다. 불국사와 석굴암(유네스코 세계유산), 대릉원 천마총, 첨성대, 그리고 밤이면 황금빛 조명이 연못에 비치는 동궁과 월지(안압지)와 황리단길이 핵심 코스입니다. 인근 안동은 하회마을과 도산서원, 병산서원을 품은 한국 유교 선비 문화의 본향입니다.",
        "2) 전주(Jeonju) & 광주·전남권: 전주 한옥마을은 700여 채의 전통 기와 한옥이 도심 속에 군집을 이룬 국내 최대 규모의 한옥 보존 지구입니다. 조선 태조 이성계의 어진(초상화)을 모신 경기전과 전동성당을 산책하고, 원조 전주비빔밥과 콩나물국밥, 수제 초코파이 등 미식을 즐기기에 최적의 도시입니다.",
        "3) 부산(Busan), 강릉(Gangneung) & 제주도(Jeju Island): 제2의 도시 부산은 해운대·광안리 해수욕장의 마천루 야경과 감천문화마을의 계단식 골목, 자갈치 수산시장이 어우러진 활기찬 항구 도시입니다. 동해안의 강릉은 경포대와 정동진 일출, 오죽헌(신사임당과 율곡 이이의 생가), 안목해변 커피거리로 유명하며, 한반도 남쪽의 화산섬 제주도는 한라산 백록담, 성산일출봉, 만장굴 등 유네스코 세계자연유산 3관왕을 달성한 세계적인 휴양 섬입니다."
      ]
    },
    {
      id: "editorial-arrival-safety-handbook",
      category: "travel",
      badge: "연구 리포트 06 · 입국·안전·면세 실전 매뉴얼",
      title: "외국인 자유여행자 필독: 인천공항 입국 절차(K-ETA·Q-Code), 부가세 즉시환급(Tax Refund) 및 1330 통역 핫라인",
      subtitle: "Essential Arrival, Customs, Immediate Tax Refund, and 24/7 Tourist Safety Handbook for International Visitors",
      readTime: "6분 분량 필수 매뉴얼",
      targetTab: "travel",
      targetLabel: "입국·환전·비상연락처 전체 매뉴얼 보기",
      icon: ShieldCheck,
      paragraphs: [
        "인천국제공항(ICN) 및 김포·김해·제주국제공항을 통해 입국하는 외국인 여행자는 출발 전 본인의 국적이 전자여행허가제(K-ETA) 면제 대상인지 확인해야 합니다. K-ETA가 필요한 국적자는 항공기 탑승 최소 72시간 전 공식 웹사이트(k-eta.go.kr)에서 신청해야 하며(수수료 10,000원, 유효기간 3년), K-ETA를 발급받은 경우 입국신고서(Arrival Card) 작성이 면제됩니다. 세관 면세 한도는 여행자 1인당 미화 800달러 이하의 물품과 주류 2병(합산 2L 이하 및 미화 400달러 이하), 담배 200개비, 향수 100ml이며, 미화 10,000달러를 초과하는 현금을 반입·반출할 때는 반드시 세관에 신고해야 합니다.",
        "인천국제공항 제1·제2여객터미널에서 서울 도심으로 이동할 때는 공항철도(AREX) 직통열차(서울역까지 무정차 43~51분 소요) 또는 일반열차(홍대입구역·공덕역·서울역 정차), 그리고 서울 주요 호텔과 강남·명동·동대문으로 직행하는 공항 리무진 버스를 이용할 수 있습니다. 심야 시간대에 도착하더라도 심야 공항버스(N버스)가 운행되므로 안전하게 도심으로 이동할 수 있습니다.",
        "쇼핑 및 부가세 즉시환급(Immediate Tax Refund): 한국 내 'Tax Free' 로고가 부착된 백화점, 올리브영, 마트, 패션 매장 등에서 건당 15,000원 이상 구매할 때 여권 실물을 제시하면, 건당 100만 원(총 500만 원) 한도 내에서 부가가치세(VAT 10% 중 환급 수수료 제외분)가 차감된 금액으로 현장에서 즉시 결제할 수 있습니다. 사후환급 영수증을 받은 경우에는 출국 전 공항 내 무인 키오스크나 세관 반출 확인대에서 간편하게 환급받을 수 있습니다.",
        "24시간 관광통역안내전화 1330: 대한민국은 전 세계에서 치안이 가장 안전한 국가 중 하나로 꼽히며, 한국관광공사(KTO)가 운영하는 '1330 코리아 트래블 헬프라인(국번 없이 1330)'을 통해 연중무휴 24시간 영어·일본어·중국어·러시아어·태국어·베트남어·말레이/인도네시아어·스페인어 등 8개 국어 무료 통역 및 관광 안내, 분실물 조회, 경찰(112)·소방/응급의료(119) 3자 통역 연결 서비스를 제공합니다."
      ]
    }
  ];

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <section
      aria-label="In-Depth Korean Heritage, Culture & Travel Editorial Archive"
      className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 md:p-10 space-y-8"
    >
      {/* Editorial Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>COREA LABS ORIGINAL EDITORIAL ARCHIVE · 심층 한국학 &amp; 여행 연구 칼럼</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-stone-900 tracking-tight">
            <Translate>대한민국 문화유산 · 사계절 축제 · 교통 · 입국 심층 에디토리얼 가이드</Translate>
          </h2>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-sans">
            <Translate>
              대한민국 연구소(Corea Labs) 에디토리얼 팀이 국가유산청(구 문화재청), 한국관광공사(KTO), 코레일(KORAIL)의 공식 사료와 최신 교통 데이터를 바탕으로 직접 집필·검수한 장문 해설 아카이브입니다. 단순 요약을 넘어 한국 역사와 문화적 맥락, 실전 자유여행 노하우를 깊이 있게 전달합니다.
            </Translate>
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200/70 shrink-0">
          {[
            { id: "all", label: "전체 아티클 (6편)" },
            { id: "heritage", label: "왕실·세계유산" },
            { id: "festivals", label: "사계절 축제사" },
            { id: "travel", label: "KTX 교통·입국" },
            { id: "culture", label: "한글·한식 문화" },
            { id: "places", label: "지역별 도시" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-white/70"
              }`}
            >
              <Translate>{cat.label}</Translate>
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Verification Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 border border-stone-200/70 rounded-2xl p-4 text-xs">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-stone-900"><Translate>공식 문화유산·관광 데이터 기반</Translate></div>
            <p className="text-[11px] text-stone-500 mt-0.5"><Translate>국가유산청 및 한국관광공사 공식 관람시간·휴무일·요금 기준 검수</Translate></p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-stone-900"><Translate>서울발 KTX·고속버스 대중교통 실측</Translate></div>
            <p className="text-[11px] text-stone-500 mt-0.5"><Translate>렌터카 없이 외국인 자유여행자가 찾아갈 수 있는 기차·버스 노선 수록</Translate></p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-stone-900"><Translate>11개 국어 전문 번역 아카이브</Translate></div>
            <p className="text-[11px] text-stone-500 mt-0.5"><Translate>한·영·일·중·프·스·태·러·포·우·조지아어 11개 언어 실시간 대응</Translate></p>
          </div>
        </div>
      </div>

      {/* Full-Length Editorial Articles Grid */}
      <div className="space-y-8">
        {filteredArticles.map((art) => {
          const Icon = art.icon;
          return (
            <article
              key={art.id}
              id={art.id}
              className="rounded-3xl border border-stone-200/80 bg-[#faf9f6] p-6 md:p-8 space-y-4 hover:border-stone-300 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-800 bg-amber-100/80 border border-amber-200 px-3 py-1 rounded-full">
                  <Icon className="w-3.5 h-3.5 text-amber-700" />
                  <span><Translate>{art.badge}</Translate></span>
                </div>
                <span className="text-[11px] font-mono text-stone-500">
                  <Translate>{art.readTime}</Translate>
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-display font-bold text-stone-900 leading-snug">
                  <Translate>{art.title}</Translate>
                </h3>
                <p className="text-xs font-mono text-stone-500">
                  {art.subtitle}
                </p>
              </div>

              <div className="space-y-3 text-xs md:text-sm text-stone-700 leading-relaxed font-sans pt-1">
                {art.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-stone-700 leading-relaxed">
                    <Translate>{p}</Translate>
                  </p>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-stone-500 font-mono">
                  <Translate>집필·검수: 대한민국 연구소 (Corea Labs Heritage &amp; Tourism Editorial Desk)</Translate>
                </span>
                <button
                  onClick={() => setActiveTab(art.targetTab)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span><Translate>{art.targetLabel}</Translate></span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
