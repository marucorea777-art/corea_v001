import json
import re

# Comprehensive translations for 11 languages
# ko, en, ja, zh, th, fr, es, pt, ka, ru, uk

LANGS = ["ko", "en", "ja", "zh", "th", "fr", "es", "pt", "ka", "ru", "uk"]

CARD_TRANSLATIONS = {
    # Palaces
    "Gyeongbokgung": {
        "ko": "경복궁", "ja": "景福宮 (キョンボックン)", "zh": "景福宫", "th": "พระราชวังเคียงบก", "fr": "Palais de Gyeongbokgung", "es": "Palacio Gyeongbokgung", "pt": "Palácio Gyeongbokgung", "ka": "გიონგბოკგუნგის სასახლე", "ru": "Дворец Кёнбоккун", "uk": "Палац Кьонбоккун"
    },
    "Changdeokgung": {
        "ko": "창덕궁", "ja": "昌徳宮 (チャンドックン)", "zh": "昌德宫", "th": "พระราชวังชางด็อก", "fr": "Palais de Changdeokgung", "es": "Palacio Changdeokgung", "pt": "Palácio Changdeokgung", "ka": "ჩანგდეოკგუნგის სასახლე", "ru": "Дворец Чхандоккун", "uk": "Палац Чхандоккун"
    },
    "Deoksugung": {
        "ko": "덕수궁", "ja": "徳寿宮 (トクスグン)", "zh": "德寿宫", "th": "พระราชวังถ็อกซู", "fr": "Palais de Deoksugung", "es": "Palacio Deoksugung", "pt": "Palácio Deoksugung", "ka": "დეოქსუგუნგის სასახლე", "ru": "Дворец Токсугун", "uk": "Палац Токсугун"
    },
    "Changgyeonggung": {
        "ko": "창경궁", "ja": "昌慶宮 (チャンギョングン)", "zh": "昌庆宫", "th": "พระราชวังชางกย็อง", "fr": "Palais de Changgyeonggung", "es": "Palacio Changgyeonggung", "pt": "Palácio Changgyeonggung", "ka": "ჩანგგეონგგუნგის სასახლე", "ru": "Дворец Чхангёнгун", "uk": "Палац Чхангьонгун"
    },
    "Gyeonghuigung": {
        "ko": "경희궁", "ja": "慶熙宮 (キョンヒグン)", "zh": "庆熙宫", "th": "พระราชวังคย็องฮี", "fr": "Palais de Gyeonghuigung", "es": "Palacio Gyeonghuigung", "pt": "Palácio Gyeonghuigung", "ka": "გიონგჰუიგუნგის სასახლე", "ru": "Дворец Кёнхигун", "uk": "Палац Кьонхігун"
    },

    # Heritage Items
    "The Joseon Moon Jar": {
        "ko": "조선 백자 달항아리", "ja": "朝鮮白磁月壺 (ムーンジャー)", "zh": "朝鲜白磁月亮罐", "th": "โถกระเบื้องเคลือบพระจันทร์โชซอน", "fr": "La Jarre de Lune Joseon", "es": "La Vasija de Luna de Joseon", "pt": "A Jarra da Lua de Joseon", "ka": "ჯოსონის მთვარის ქილა", "ru": "Лунная ваза эпохи Чосон", "uk": "Місячна ваза епохи Чосон"
    },
    "Silla Golden Crown": {
        "ko": "신라 금관", "ja": "新羅の金冠", "zh": "新罗金冠", "th": "มงกุฎทองคำชิลลา", "fr": "Couronne d'or de Silla", "es": "Corona de oro de Silla", "pt": "Coroa de ouro de Silla", "ka": "სილას ოქროს გვირგვინი", "ru": "Золотая корона государства Силла", "uk": "Золота корона держави Сілла"
    },
    "Bulguksa Temple": {
        "ko": "불국사", "ja": "仏国寺 (プルグクサ)", "zh": "佛国寺", "th": "วัดพุลกุกซา", "fr": "Temple Bulguksa", "es": "Templo Bulguksa", "pt": "Templo Bulguksa", "ka": "ბულგუქსას ტაძარი", "ru": "Храм Пульгукса", "uk": "Храм Пульгукса"
    },
    "Hunminjeongeum": {
        "ko": "훈민정음 (한글 창제 원본)", "ja": "訓民正音（ハングル創製原本）", "zh": "训民正音（谚文原本）", "th": "ฮุนมินจ็องอึม (ต้นฉบับอักษรฮันกึล)", "fr": "Hunminjeongeum (Origine du Hangeul)", "es": "Hunminjeongeum (Origen del Hangeul)", "pt": "Hunminjeongeum (Origem do Hangeul)", "ka": "ჰუნმინჯონგიუმი", "ru": "Хунмин чоным (Оригинал хангыля)", "uk": "Хунмін чоним (Оригінал хангіля)"
    },
    "Dokdo Island": {
        "ko": "독도", "ja": "独島 (ドクト)", "zh": "独岛", "th": "เกาะดกโด", "fr": "Île de Dokdo", "es": "Isla de Dokdo", "pt": "Ilha de Dokdo", "ka": "დოკდოს კუნძული", "ru": "Остров Токто", "uk": "Острів Токто"
    },

    # Destinations
    "Seoul": {
        "ko": "서울", "ja": "ソウル", "zh": "首尔", "th": "โซล", "fr": "Séoul", "es": "Seúl", "pt": "Seul", "ka": "სეული", "ru": "Сеул", "uk": "Сеул"
    },
    "Jeju Island": {
        "ko": "제주도", "ja": "済州島", "zh": "济州岛", "th": "เกาะเชจู", "fr": "Île de Jeju", "es": "Isla de Jeju", "pt": "Ilha de Jeju", "ka": "ჯეჯუს კუნძული", "ru": "Остров Чеджу", "uk": "Острів Чеджу"
    },
    "Gyeongju": {
        "ko": "경주", "ja": "慶州 (キョンジュ)", "zh": "庆州", "th": "คย็องจู", "fr": "Gyeongju", "es": "Gyeongju", "pt": "Gyeongju", "ka": "გიონგჯუ", "ru": "Кёнджу", "uk": "Кьонджу"
    },
    "Busan": {
        "ko": "부산", "ja": "釜山 (プサン)", "zh": "釜山", "th": "ปูซาน", "fr": "Busan", "es": "Busan", "pt": "Busan", "ka": "ბუსანი", "ru": "Пусан", "uk": "Пусан"
    },

    # Destination Taglines
    "The Neon-Lit Capital of Ancient Spirit and High Tech": {
        "ko": "고대의 숨결과 첨단 기술이 공존하는 화려한 수도",
        "ja": "古代の精神とハイテクが交差するネオンの首都",
        "zh": "古老灵魂与现代科技辉映的霓虹之都",
        "th": "เมืองหลวงอันสว่างไสวที่จิตวิญญาณโบราณพบกับไฮเทค",
        "fr": "La capitale lumineuse où tradition et haute technologie se rencontrent",
        "es": "La capital de luces de neón donde conviven tradición y alta tecnología",
        "pt": "A capital iluminada onde tradição e tecnologia de ponta convivem",
        "ka": "ნეონით განათებული დედაქალაქი",
        "ru": "Озарённая неоном столица древнего духа и высоких технологий",
        "uk": "Осяяна неоном столиця стародавнього духу та високих технологій"
    },
    "Volcanic Wonders, Haenyeo Divers, and Emerald Waters": {
        "ko": "신비로운 화산 지형, 해녀 문화, 에메랄드빛 바다",
        "ja": "火山の神秘、海女文化、エメラルド色の海",
        "zh": "火山奇观、海女文化与翡翠碧海",
        "th": "สิ่งมหัศจรรย์จากภูเขาไฟ นักดำน้ำแฮนยอ และน้ำทะเลสีมรกต",
        "fr": "Merveilles volcaniques, plongeuses Haenyeo et eaux turquoise",
        "es": "Maravillas volcánicas, buceadoras Haenyeo y aguas esmeralda",
        "pt": "Maravilhas vulcânicas, mergulhadoras Haenyeo e águas esmeralda",
        "ka": "ვულკანური საოცრებები, ჰენიოს მყვინთავები",
        "ru": "Вулканические чудеса, ныряльщицы хэнё и изумрудные воды",
        "uk": "Вулканічні дива, пірнальниці хеньо та смарагдові води"
    },
    "The Museum Without Walls and Capital of Golden Kings": {
        "ko": "지붕 없는 박물관이자 황금의 왕국 신라의 수도",
        "ja": "屋根なき博物館、黄金の王国の首都",
        "zh": "无围墙的露天博物馆与黄金古都",
        "th": "พิพิธภัณฑ์ไร้กำแพงและเมืองหลวงแห่งกษัตริย์ทองคำ",
        "fr": "Le musée à ciel ouvert et la capitale des rois d'or",
        "es": "El museo al aire libre y capital de reyes de oro",
        "pt": "O museu a céu aberto e capital dos reis de ouro",
        "ka": "მუზეუმი კედლების გარეშე",
        "ru": "Музей без стен и столица золотых королей",
        "uk": "Музей без стін і столиця золотих королів"
    },
    "Dynamic Maritime Hub, Coastal Temples, and Sandy Shores": {
        "ko": "역동적인 해양 도시, 절벽 사찰, 빛나는 해변",
        "ja": "ダイナミックな海洋都市、海辺の寺院、砂浜",
        "zh": "充满活力的海洋枢纽、海滨寺庙与金黄沙滩",
        "th": "ศูนย์กลางทางทะเลที่มีชีวิตชีวา วัดริมทะเล และหาดทรายขาว",
        "fr": "Hub maritime dynamique, temples côtiers et plages de sable",
        "es": "Dinámico centro marítimo, templos costeros y playas doradas",
        "pt": "Centro marítimo dinâmico, templos costeiros e praias douradas",
        "ka": "დინამიური საზღვაო ჰაბი, სანაპირო ტაძრები",
        "ru": "Морской центр, храмы на скалах и песчаные пляжи",
        "uk": "Морський центр, храми на скелях та піщані пляжі"
    },

    # Destination Descriptions
    "A sprawling metropolis where 600-year-old palaces sit surrounded by towering glass skyscrapers. Seoul is a 24-hour city where tranquil mountain hikes, traditional markets, design centers, and dynamic nightlife districts exist side-by-side.": {
        "ko": "600년 역사의 조선 궁궐이 초고층 빌딩 숲과 어우러진 대도시입니다. 호젓한 인왕산·북악산 등산로부터 유서 깊은 전통시장, DDP 디자인 센터, 활기찬 야경까지 24시간 잠들지 않는 매력을 선사합니다.",
        "ja": "600年の歴史を持つ王宮が高層ビルに囲まれた大都市。静かな山のトレッキングから伝統市場、最先端デザイン、夜景まで24時間魅力が尽きません。",
        "zh": "600年历史的古老宫殿与摩天大楼交相辉映的国际大都会。从宁静的山间徒步到传统市场、时尚设计中心及夜景，24小时精彩不断。",
        "th": "มหานครที่พระราชวังอายุกว่า 600 ปีตั้งอยู่ท่ามกลางตึกระฟ้า โซลเป็นเมือง 24 ชั่วโมงที่มีทั้งตลาดดั้งเดิม ศิลปะ และแสงสียามค่ำคืน",
        "fr": "Une métropole vibrante où les palais vieux de 600 ans côtoient des gratte-ciel modernes. Séoul vit 24h/24 entre randonnées, marchés traditionnels et design futuriste.",
        "es": "Una metrópolis vibrante donde palacios de 600 años conviven con rascacielos. Seúl nunca duerme, combinando mercados tradicionales, diseño y vida nocturna.",
        "pt": "Uma metrópole vibrante onde palácios de 600 anos convivem com arranha-céus. Seul nunca dorme, com mercados tradicionais, design e vida noturna.",
        "ka": "მეგაპოლისი, სადაც 600 წლის სასახლეები თანამედროვე შენობების გვერდით დგას. სეული არის 24-საათიანი ქალაქი.",
        "ru": "Мегаполис, где 600-летние дворцы соседствуют со стеклянными небоскребами. Сеул живёт 24 часа в сутки, сочетая тихие тропы, рынки и ночную жизнь.",
        "uk": "Мегаполіс, де 600-річні палаци сусідять зі скляними хмарочосами. Сеул живе цілодобово, поєднуючи тихі стежки, ринки та нічне життя."
    },
    "Korea's island paradise, dominated by Hallasan, an extinct volcano. Renowned for its unique black basalt stones, scenic ocean cliffs, pristine beaches, and the legendary Haenyeo (female breath-hold divers) who harvest fresh seafood from the cold deeps.": {
        "ko": "한라산을 품은 대한민국 대표 휴양 섬입니다. 독특한 검은 현무암, 웅장한 해안 절벽, 백사장, 산소통 없이 바다에 잠수하는 유네스코 인류무형문화유산 해녀 문화를 경험할 수 있습니다.",
        "ja": "漢拏山がそびえる韓国の楽園。黒い玄武岩、雄大な海岸断崖、エメラルドビーチ、息を止めて潜るユネスコ無形文化遺産の海女が有名です。",
        "zh": "以汉拿山为核心的度假天堂。拥有独特的黑色玄武岩、绝美海岸断崖与无需氧气罐潜水捕捞的联合国教科文组织海女文化。",
        "th": "เกาะสวรรค์ที่มีภูเขาไฟฮัลลาซาน โดดเด่นด้วยหินบะซอลต์สีดำ หน้าผาริมทะเล หาดทรายขาว และวัฒนธรรมแฮนยออันเลื่องชื่อ",
        "fr": "Le paradis insulaire de la Corée dominé par le mont Hallasan. Célèbre pour ses falaises volcaniques, ses plages et les légendaires plongeuses Haenyeo.",
        "es": "El paraíso insular de Corea presidido por el monte Hallasan. Famoso por sus rocas volcánicas, playas vírgenes y las legendarias buceadoras Haenyeo.",
        "pt": "O paraíso insular da Coreia dominado pelo monte Hallasan. Famoso por rochas vulcânicas, praias e as lendárias mergulhadoras Haenyeo.",
        "ka": "კორეის კუნძულოვანი სამოთხე, რომელსაც ჰალასანის მთა ამშვენებს. ცნობილია შავი ბაზალტითა და ჰენიოს მყვინთავებით.",
        "ru": "Островной рай Кореи с потухшим вулканом Халласан, черным базальтом, живописными скалами и ныряльщицами хэнё.",
        "uk": "Острівний рай Кореї з вулканом Халласан, чорним базальтом, мальовничими скелями та пірнальницями хеньо."
    },
    "The ancient capital of the Silla Kingdom for nearly 1,000 years. Gyeongju is packed with massive grass-covered royal tomb mounds, ancient temples, ruins, and the world's oldest surviving astronomical observatory, Cheomseongdae.": {
        "ko": "천년 동안 신라 왕조의 수도였던 유서 깊은 고도입니다. 능선을 닮은 거대한 고분군(대릉원), 찬란한 불교 예술의 보고 불국사, 동양에서 가장 오래된 천문대 첨성대 등 도시 전체가 살아있는 역사 박물관입니다.",
        "ja": "約1000年にわたり新羅の首都だった古都。緑に覆われた巨大古墳群、寺院、東洋最古の天文台・瞻星台など、街全体が歴史の宝庫です。",
        "zh": "新罗王朝延续近千年的古都。整座城市遍布巨大王陵古坟丘、古老寺庙遗址及东亚现存最古老的天文台瞻星台。",
        "th": "เมืองหลวงโบราณของอาณาจักรชิลลานานเกือบ 1,000 ปี เต็มไปด้วยเนินสุสานหลวงโบราณ วัดเก่าแก่ และหอดูดาวชอมซ็องแดที่เก่าแก่ที่สุดในเอเชีย",
        "fr": "L'ancienne capitale du royaume de Silla pendant près de 1 000 ans. Elle regorge de tumulus royaux, de temples et du plus vieil observatoire d'Asie, Cheomseongdae.",
        "es": "La antigua capital del reino de Silla durante casi 1.000 años. Repleta de túmulos reales, templos y el observatorio más antiguo de Asia, Cheomseongdae.",
        "pt": "A antiga capital do reino de Silla por quase 1.000 anos. Repleta de túmulos reais, templos e o observatório mais antigo da Ásia, Cheomseongdae.",
        "ka": "სილას სამეფოს უძველესი დედაქალაქი 1000 წლის განმავლობაში. ცნობილია სამეფო სამარხებითა და ჩომსონგდეს ობსერვატორიით.",
        "ru": "Древняя столица государства Силла на протяжении почти тысячи лет. Город полон курганов, древних храмов и обсерватории Чхомсондэ.",
        "uk": "Стародавня столиця держави Сілла протягом майже тисячі років. Місто сповнене курганів, стародавніх храмів та обсерваторії Чхомсонде."
    },
    "Korea's largest port city, famous for its energetic coastal atmosphere, sandy beaches, colorful mountainside arts villages, seafood markets, and scenic suspension bridges glowing over the sea.": {
        "ko": "대한민국 최대의 항구 도시로 해운대·광안리 해변, 알록달록한 감천문화마을, 싱싱한 자갈치 어시장, 바다 위를 가로지르는 광안대교 야경으로 유명합니다.",
        "ja": "韓国最大の港湾都市。活気ある海辺の雰囲気、海雲台ビーチ、カラフルな甘川文化村、チャガルチ市場、海上に輝く広安大橋の夜景が魅力です。",
        "zh": "韩国最大的港口城市。以活力四射的海滨氛围、海云台沙滩、色彩斑斓的甘川文化村、札嘎其海鲜市场及壮丽的广安大桥夜景闻名。",
        "th": "เมืองท่าที่ใหญ่ที่สุดของเกาหลี โดดเด่นด้วยบรรยากาศชายฝั่ง หาดแฮอุนแด หมู่บ้านวัฒนธรรมคัมชอน ตลาดปลาจากัลชี และสะพานกวางอัน",
        "fr": "La plus grande ville portuaire de Corée, célèbre pour sa côte dynamique, ses plages, le village coloré de Gamcheon et son marché aux poissons.",
        "es": "La mayor ciudad portuaria de Corea, famosa por su energía costera, playas, el colorido pueblo de Gamcheon y el mercado de pescado Jagalchi.",
        "pt": "A maior cidade portuária da Coreia, famosa por praias animadas, o colorido vilarejo de Gamcheon e o mercado de peixes Jagalchi.",
        "ka": "კორეის უდიდესი საპორტო ქალაქი, ცნობილი ჰეუნდეს სანაპიროთი, გამჩონის კულტურული სოფლითა და ზღვის პროდუქტების ბაზრით.",
        "ru": "Крупнейший порт Кореи, знаменитый пляжами Хэундэ, красочной деревней Камчхон, рыбным рынком Чагальчхи и мостом Кванан.",
        "uk": "Найбільший порт Кореї, знаменитий пляжами Хеунде, барвистим селищем Камчхон, рибним ринком Чагальчхі та мостом Кванан."
    },

    # Core Festivals
    "Jinhae Cherry Blossom Festival": {
        "ko": "진해군항제", "ja": "鎮海軍港祭 (チネ・グナンジェ)", "zh": "镇海军港节", "th": "เทศกาลดอกซากุระบานจินแฮ", "fr": "Festival des cerisiers en fleurs de Jinhae", "es": "Festival de los Cerezos en Flor de Jinhae", "pt": "Festival das Cerejeiras de Jinhae", "ka": "ჯინჰეს ალუბლის ყვავილობის ფესტივალი", "ru": "Фестиваль цветения вишни в Чинхэ", "uk": "Фестиваль цвітіння вишні в Чінхе"
    },
    "Boryeong Mud Festival": {
        "ko": "보령머드축제", "ja": "保寧マッドフェスティバル", "zh": "保宁泥浆节", "th": "เทศกาลโคลนโพเรียง", "fr": "Festival de la boue de Boryeong", "es": "Festival del Barro de Boryeong", "pt": "Festival da Lama de Boryeong", "ka": "ბორიონგის ტალახის ფესტივალი", "ru": "Фестиваль грязи в Порёне", "uk": "Фестиваль бруду в Порьоні"
    },
    "Andong Mask Dance Festival": {
        "ko": "안동국제탈춤페스티벌", "ja": "安東国際仮面劇フェスティバル", "zh": "安东国际假面舞节", "th": "เทศกาลระบำหน้ากากอันดง", "fr": "Festival de danse des masques d'Andong", "es": "Festival de Danza de Máscaras de Andong", "pt": "Festival de Dança de Máscaras de Andong", "ka": "ანდონგის ნიღბების ცეკვის ფესტივალი", "ru": "Фестиваль танца в масках в Андоне", "uk": "Фестиваль танцю в масках в Андоні"
    },
    "Seoul Lantern Festival": {
        "ko": "서울빛초롱축제", "ja": "ソウルランタンフェスティバル", "zh": "首尔花灯节", "th": "เทศกาลโคมไฟกรุงโซล", "fr": "Festival des lanternes de Séoul", "es": "Festival de Faroles de Seúl", "pt": "Festival das Lanternas de Seul", "ka": "სეულის ფარნების ფესტივალი", "ru": "Сеульский фестиваль фонарей", "uk": "Сеульський фестиваль ліхтарів"
    },
    "Jeju Fire Festival": {
        "ko": "제주들불축제", "ja": "済州野火祭り", "zh": "济州野火节", "th": "เทศกาลไฟป่าเชจู", "fr": "Festival du feu de Jeju", "es": "Festival del Fuego de Jeju", "pt": "Festival do Fogo de Jeju", "ka": "ჯეჯუს ცეცხლის ფესტივალი", "ru": "Фестиваль огня на Чеджу", "uk": "Фестиваль вогню на Чеджу"
    },
    "Jinju Namgang Yudeung Festival": {
        "ko": "진주남강유등축제", "ja": "晋州南江流灯祭り", "zh": "晋州南江流灯节", "th": "เทศกาลโคมลอยแม่น้ำนัมกังชินจู", "fr": "Festival des lanternes flottantes de Jinju", "es": "Festival de Faroles Flotantes de Jinju", "pt": "Festival de Lanternas Flutuantes de Jinju", "ka": "ჯინჯუს მოტივტივე ფარნების ფესტივალი", "ru": "Фестиваль плавающих фонарей на реке Намган в Чинджу", "uk": "Фестиваль ліхтарів на річці Намган у Чінджу"
    },
    "Boseong Green Tea Festival": {
        "ko": "보성다향대축제", "ja": "宝城茶香祭り", "zh": "宝城绿茶节", "th": "เทศกาลชาเขียวโพซ็อง", "fr": "Festival du thé vert de Boseong", "es": "Festival del Té Verde de Boseong", "pt": "Festival do Chá Verde de Boseong", "ka": "ბოსეონგის მწვანე ჩაის ფესტივალი", "ru": "Фестиваль зеленого чая в Посоне", "uk": "Фестиваль зеленого чаю в Посоні"
    },
    "Hwacheon Sancheoneo Ice Festival": {
        "ko": "화천산천어축제", "ja": "華川ヤマメ氷祭り", "zh": "华川山鳟鱼冰雪节", "th": "เทศกาลตกปลาน้ำแข็งฮวาชอน", "fr": "Festival de glace Sancheoneo de Hwacheon", "es": "Festival de Hielo de Hwacheon", "pt": "Festival do Gelo de Hwacheon", "ka": "ჰვაჩონის ყინულის ფესტივალი", "ru": "Ледовый фестиваль горной форели в Хвачхоне", "uk": "Льодовий фестиваль гірської форелі у Хвачхоні"
    },
    "Gimje Horizon Festival": {
        "ko": "김제지평선축제", "ja": "金堤地平線祭り", "zh": "金堤地平线节", "th": "เทศกาลขอบฟ้าคิมเจ", "fr": "Festival de l'horizon de Gimje", "es": "Festival del Horizonte de Gimje", "pt": "Festival do Horizonte de Gimje", "ka": "გიმჯეს ჰორიზონტის ფესტივალი", "ru": "Фестиваль горизонта в Кимдже", "uk": "Фестиваль горизонту в Кімдже"
    },

    # Festival Descriptions
    "Korea's largest spring festival, attracting millions of visitors who walk under tunnels of over 360,000 blooming cherry blossom trees. The Yeojwacheon Stream and Gyeonghwa Station railway are famous photo spots.": {
        "ko": "36만 그루의 벚꽃나무 터널 아래를 거니는 대한민국 최대 봄 축제입니다. 여좌천과 경화역 철길이 유명한 포토존입니다.",
        "ja": "36万本の桜が咲き誇る韓国最大の春の祭り。余佐川や慶和駅の線路沿いが桜のトンネルとなり、世界中から観光客が訪れます。",
        "zh": "漫步于36万株樱花隧道下的韩国最大春季盛会。余佐川罗曼史桥与庆和站樱花铁路是全球游客瞩目的摄影胜地。",
        "th": "เทศกาลฤดูใบไม้ผลิที่ใหญ่ที่สุดของเกาหลี เดินใต้ร่มเงาของต้นซากุระกว่า 360,000 ต้น ลำธารยอจวาชอนและสถานีรถไฟคย็องฮวาเป็นจุดถ่ายรูปยอดนิยม",
        "fr": "Le plus grand festival de printemps de Corée avec plus de 360 000 cerisiers en fleurs le long du ruisseau Yeojwacheon et de la gare de Gyeonghwa.",
        "es": "El mayor festival de primavera de Corea con más de 360.000 cerezos en flor a lo largo del arroyo Yeojwacheon y la estación Gyeonghwa.",
        "pt": "O maior festival de primavera da Coreia com mais de 360.000 cerejeiras em flor ao longo do riacho Yeojwacheon e da estação Gyeonghwa.",
        "ka": "კორეის უდიდესი საგაზაფხულო ფესტივალი 360,000-ზე მეტი აყვავებული ალუბლის ხის ქვეშ.",
        "ru": "Крупнейший весенний праздник Кореи с более чем 360 000 цветущих вишневых деревьев вдоль ручья Ёджвачхон и станции Кёнхва.",
        "uk": "Найбільше весняне свято Кореї з понад 360 000 квітучих вишень уздовж струмка Йоджвачхон та станції Кьонхва."
    },
    "An energetic, wild summer party where locals and tourists slather themselves in mineral-rich mud known for its cosmetic properties. Expect giant mud slides, mud wrestling, beach concerts, and firework shows.": {
        "ko": "피부 미용에 좋은 미네랄 가득한 진흙을 온몸에 바르고 즐기는 활기차고 역동적인 여름 축제입니다. 대형 머드 슬라이드, 머드 씨름, 해변 콘서트, 불꽃놀이 등이 진행됩니다.",
        "ja": "美容に良い天然ミネラル泥を全身に塗って楽しむ熱気あふれる夏の海辺の祭り。巨大泥スライダーや砂浜コンサートで盛り上がります。",
        "zh": "涂抹富含矿物质天然海泥的夏日狂欢节。拥有巨型泥浆滑梯、海滩泥浆摔跤、日落电音派对与璀璨烟火秀。",
        "th": "ปาร์ตี้ฤดูร้อนสุดมันส์ที่ทุกคนทาโคลนบำรุงผิว มีสไลเดอร์โคลนยักษ์ มวยปล้ำโคลน และคอนเสิร์ตริมหาด",
        "fr": "Une fête estivale énergique où l'on s'enduit de boue riche en minéraux, avec toboggans géants, concerts sur la plage et feux d'artifice.",
        "es": "Una fiesta veraniega salvaje y enérgica donde cubrirse de barro mineral, con toboganes gigantes, conciertos y fuegos artificiales.",
        "pt": "Uma festa de verão cheia de energia com lama rica em minerais, toboáguas gigantes, concertos e fogos de artifício.",
        "ka": "ენერგიული ზაფხულის წვეულება მინერალებით მდიდარი ტალახით, სასრიალოებითა და კონცერტებით.",
        "ru": "Энергичный летний фестиваль с лечебной грязью, гигантскими горками, пляжными концертами и фейерверками.",
        "uk": "Енергійний літній фестиваль з лікувальним брудом, гігантськими гірками, пляжними концертами та феєрверками."
    },

    # Heritage Periods
    "Joseon Dynasty (17th - 18th Century)": {
        "ko": "조선시대 (17~18세기)", "ja": "朝鮮時代（17〜18世紀）", "zh": "朝鲜王朝（17-18世纪）", "th": "ราชวงศ์โชซอน (ศตวรรษที่ 17 - 18)", "fr": "Dynastie Joseon (XVIIe - XVIIIe siècle)", "es": "Dinastía Joseon (siglos XVII - XVIII)", "pt": "Dinastia Joseon (séculos XVII - XVIII)", "ka": "ჯოსონის დინასტია (XVII-XVIII სს.)", "ru": "Династия Чосон (XVII–XVIII вв.)", "uk": "Династія Чосон (XVII–XVIII ст.)"
    },
    "Silla Kingdom (5th - 6th Century)": {
        "ko": "신라 (5~6세기)", "ja": "新羅（5〜6世紀）", "zh": "新罗王国（5-6世纪）", "th": "อาณาจักรชิลลา (ศตวรรษที่ 5 - 6)", "fr": "Royaume de Silla (Ve - VIe siècle)", "es": "Reino de Silla (siglos V - VI)", "pt": "Reino de Silla (séculos V - VI)", "ka": "სილას სამეფო (V-VI სს.)", "ru": "Государство Силла (V–VI вв.)", "uk": "Держава Сілла (V–VI ст.)"
    },
    "Unified Silla (Founded 751 AD)": {
        "ko": "통일신라 (751년 창건)", "ja": "統一新羅（751年創建）", "zh": "统一新罗（建于751年）", "th": "ชิลลารวมชาติ (ก่อตั้ง ค.ศ. 751)", "fr": "Silla unifié (Fondé en 751)", "es": "Silla Unificada (Fundada en 751)", "pt": "Silla Unificada (Fundada em 751)", "ka": "ერთიანი სილა (დაარსდა 751 წელს)", "ru": "Объединенное Силла (Основан в 751 г.)", "uk": "Об'єднане Сілла (Засновано в 751 р.)"
    },
    "Joseon Dynasty (1443 AD)": {
        "ko": "조선시대 (1443년)", "ja": "朝鮮時代（1443年）", "zh": "朝鲜王朝（1443年）", "th": "ราชวงศ์โชซอน (ค.ศ. 1443)", "fr": "Dynastie Joseon (1443)", "es": "Dinastía Joseon (1443 d.C.)", "pt": "Dinastia Joseon (1443 d.C.)", "ka": "ჯოსონის დინასტია (1443 წ.)", "ru": "Династия Чосон (1443 г.)", "uk": "Династія Чосон (1443 р.)"
    },
    "Silla Kingdom (512 AD) – Present": {
        "ko": "신라 시대 (512년) ~ 현재", "ja": "新羅時代（512年）〜現在", "zh": "新罗时期（512年）至今", "th": "อาณาจักรชิลลา (ค.ศ. 512) – ปัจจุบัน", "fr": "Royaume de Silla (512) – Présent", "es": "Reino de Silla (512 d.C.) – Presente", "pt": "Reino de Silla (512 d.C.) – Presente", "ka": "სილას სამეფო (512 წ.) – დღემდე", "ru": "Государство Силла (512 г.) — по настоящее время", "uk": "Держава Сілла (512 р.) — дотепер"
    },

    # Culture Categories
    "Gastronomy (Hansik)": {
        "ko": "한식 미식", "ja": "韓食（伝統美食）", "zh": "韩食料理（Hansik）", "th": "ศาสตร์แห่งอาหารเกาหลี (ฮันซิก)", "fr": "Gastronomie (Hansik)", "es": "Gastronomía (Hansik)", "pt": "Gastronomia (Hansik)", "ka": "გასტრონომია (ჰანსიკი)", "ru": "Гастрономия (хансик)", "uk": "Гастрономія (хансік)"
    },
    "Traditional Arts & Crafts": {
        "ko": "전통 공예와 예술", "ja": "伝統工芸と芸術", "zh": "传统工艺与艺术", "th": "ศิลปะและหัตถกรรมดั้งเดิม", "fr": "Arts et artisanat traditionnels", "es": "Artes y oficios tradicionales", "pt": "Artes e ofícios tradicionais", "ka": "ტრადიციული ხელოვნება და ხელნაკეთობები", "ru": "Традиционные искусства и ремесла", "uk": "Традиційні мистецтва та ремесла"
    },
    "Global K-Wave": {
        "ko": "글로벌 한류 (K-Wave)", "ja": "グローバル韓流 (K-Wave)", "zh": "全球韩流浪潮 (Hallyu)", "th": "กระแสเคเวฟระดับโลก", "fr": "K-Wave mondiale", "es": "K-Wave global", "pt": "K-Wave global", "ka": "გლობალური კორეული ტალღა", "ru": "Глобальная корейская волна (Халлю)", "uk": "Глобальна корейська хвиля (Халлю)"
    },
    "Modern Innovation": {
        "ko": "미래 혁신과 테크", "ja": "未来革新とハイテク", "zh": "现代创新与前沿科技", "th": "นวัตกรรมและเทคโนโลยีสมัยใหม่", "fr": "Innovation moderne et haute technologie", "es": "Innovación moderna y alta tecnología", "pt": "Inovação moderna e alta tecnologia", "ka": "თანამედროვე ინოვაციები", "ru": "Современные инновации и технологии", "uk": "Сучасні інновації та технології"
    },

    # Culture Items
    "Kimchi & Jang": {
        "ko": "김치와 장", "ja": "キムチと醤（ジャン）", "zh": "泡菜与传统酱类", "th": "กิมจิและซอสหมักแบบดั้งเดิม", "fr": "Kimchi et sauces fermentées (Jang)", "es": "Kimchi y pastas fermentadas (Jang)", "pt": "Kimchi e pastas fermentadas (Jang)", "ka": "კიმჩი და ფერმენტირებული სოუსები", "ru": "Кимчи и традиционные соусы чан", "uk": "Кімчі та традиційні соуси чан"
    },
    "Bibimbap": {
        "ko": "비빔밥", "ja": "ビビンバ", "zh": "石锅拌饭", "th": "ข้าวยำบิบิมบับ", "fr": "Bibimbap", "es": "Bibimbap", "pt": "Bibimbap", "ka": "ბიბიმბაპი", "ru": "Пибимпап", "uk": "Пібімпап"
    },
    "Bulgogi": {
        "ko": "불고기", "ja": "プルコギ", "zh": "烤牛肉（烤肉）", "th": "บูลโกกิ", "fr": "Bulgogi", "es": "Bulgogi", "pt": "Bulgogi", "ka": "ბულგოგი", "ru": "Пулькоги", "uk": "Пулькогі"
    },
    "Ganjang Gejang": {
        "ko": "간장게장", "ja": "カンジャンケジャン (ワタリガニの醤油漬け)", "zh": "酱油腌蟹（酱蟹）", "th": "ปูดองซีอิ๊วคันจังเคจัง", "fr": "Ganjang Gejang (Crabe mariné au soja)", "es": "Ganjang Gejang (Cangrejo marinado en soja)", "pt": "Ganjang Gejang (Caranguejo marinado em soja)", "ka": "განჯანგ გეჯანგი", "ru": "Канчжан кечжан (Краб в соевом маринаде)", "uk": "Канчжан кечжан (Краб у соєвому маринаді)"
    },
    "Tteokbokki": {
        "ko": "떡볶이", "ja": "トッポッキ", "zh": "辣炒年糕", "th": "ต็อกบกกี", "fr": "Tteokbokki", "es": "Tteokbokki", "pt": "Tteokbokki", "ka": "ტოკბოკი", "ru": "Токпокки", "uk": "Токпоккі"
    },
    "The Hanbok": {
        "ko": "한복", "ja": "韓服 (ハンボク)", "zh": "韩服", "th": "ชุดฮันบก", "fr": "Le Hanbok", "es": "El Hanbok", "pt": "O Hanbok", "ka": "ჰანბოკი", "ru": "Ханбок", "uk": "Ханбок"
    },
    "Buncheong & Celadon": {
        "ko": "분청사기와 고려청자", "ja": "粉青沙器と高麗青磁", "zh": "粉青沙器与高丽青瓷", "th": "เครื่องปั้นดินเผาพุนช็องและเซลาดอนโครยอ", "fr": "Buncheong et Céladon de Goryeo", "es": "Buncheong y Celadón de Goryeo", "pt": "Buncheong e Celadon de Goryeo", "ka": "ბუნჩონგი და გორიოს ცელადონი", "ru": "Бунчхон и селадон Корё", "uk": "Бунчхон і селадон Корьо"
    },
    "K-Pop & Dance": {
        "ko": "K-Pop과 퍼포먼스", "ja": "K-POPとダンスカルチャー", "zh": "K-Pop流行音乐与舞蹈", "th": "เคป็อปและการเต้นระดับโลก", "fr": "K-Pop et chorégraphies mondiales", "es": "K-Pop y coreografías globales", "pt": "K-Pop e coreografias globais", "ka": "K-Pop და ცეკვა", "ru": "K-Pop и глобальные танцы", "uk": "K-Pop та світові танці"
    },
    "K-Cinema & Drama": {
        "ko": "K-무비와 한국 드라마", "ja": "K-ムービーと韓国ドラマ", "zh": "韩国电影与电视剧 (K-Drama)", "th": "ภาพยนตร์และซีรีส์เกาหลี (K-Drama)", "fr": "Cinéma et séries coréennes (K-Drama)", "es": "Cine y series coreanas (K-Drama)", "pt": "Cinema e séries coreanas (K-Drama)", "ka": "კორეული კინო და დრამა", "ru": "Корейское кино и дорамы", "uk": "Корейське кіно та дорами"
    },
    "Hyper-Connected Songdo": {
        "ko": "초연결 스마트시티 송도", "ja": "超連結スマート都市・松島", "zh": "未来智能城市·松岛", "th": "ซงโด เมืองอัจฉริยะแห่งอนาคต", "fr": "Songdo, la ville intelligente hyper-connectée", "es": "Songdo, la ciudad inteligente hiperconectada", "pt": "Songdo, a cidade inteligente hiperconectada", "ka": "სონგდოს ჭკვიანი ქალაქი", "ru": "Сондо — гиперумный город будущего", "uk": "Сондо — розумне місто майбутнього"
    },
    "Advanced Robotics & AI": {
        "ko": "첨단 로보틱스와 AI", "ja": "最先端ロボティクスとAI", "zh": "尖端机器人与人工智能", "th": "หุ่นยนต์ล้ำสมัยและ AI", "fr": "Robotique avancée et IA", "es": "Robótica avanzada e IA", "pt": "Robótica avançada e IA", "ka": "მოწინავე რობოტიკა და ხელოვნური ინტელექტი", "ru": "Передовая робототехника и ИИ", "uk": "Передова робототехніка та ШІ"
    },

    # Dokdo Island Section Texts
    "Sovereign Natural Heritage": {
        "ko": "대한민국 고유 영토이자 자연유산", "ja": "大韓民国固有の領土・自然遺産", "zh": "大韩民国固有领土与自然遗产", "th": "มรดกทางธรรมชาติและดินแดนอธิปไตยของเกาหลี", "fr": "Patrimoine naturel souverain de la Corée", "es": "Patrimonio natural soberano de Corea", "pt": "Patrimônio natural soberano da Coreia", "ka": "კორეის სუვერენული ბუნებრივი მემკვიდრეობა", "ru": "Суверенное природное наследие Кореи", "uk": "Суверенна природна спадщина Кореї"
    },
    "Korea's Easternmost Boundary": {
        "ko": "대한민국 동쪽 제일 끝", "ja": "韓国最東端の境界", "zh": "韩国最东端的疆界", "th": "เขตแดนทางตะวันออกสุดของเกาหลี", "fr": "La frontière la plus orientale de la Corée", "es": "La frontera más oriental de Corea", "pt": "A fronteira mais oriental da Coreia", "ka": "კორეის უკიდურესი აღმოსავლეთი საზღვარი", "ru": "Самая восточная граница Кореи", "uk": "Найбільш східний кордон Кореї"
    },
    "Dokdo: The Beautiful Island of Korea": {
        "ko": "독도: 대한민국의 아름다운 섬", "ja": "独島：美しい韓国の島", "zh": "独岛：美丽的韩国岛屿", "th": "ดกโด: เกาะอันงดงามของเกาหลีใต้", "fr": "Dokdo : La magnifique île de Corée", "es": "Dokdo: La hermosa isla de Corea", "pt": "Dokdo: A bela ilha da Coreia", "ka": "დოკდო: კორეის ულამაზესი კუნძული", "ru": "Токто: Прекрасный остров Кореи", "uk": "Токто: Прекрасний острів Кореї"
    },
    "First integrated into Korean territory in 512 AD by Silla Dynasty General Isabu, Dokdo has stood as an integral part of the Korean nation for over 1,500 years. This majestic volcanic island in the East Sea (Natural Monument No. 336) is renowned for its incredible marine biodiversity, towering basalt structures, and its timeless significance as a symbol of Korean sovereignty and natural majesty.": {
        "ko": "서기 512년 신라 이사부 장군에 의해 우산국이 복속된 이래 1,500년 넘게 대한민국의 고유 영토로 이어져 왔습니다. 동해의 천연기념물 제336호인 독도는 수직 주상절리와 풍요로운 해양 생태계를 품고 있으며 국토 수호와 주권의 영원한 상징입니다.",
        "ja": "西暦512年、新羅の異斯夫（イサブ）将軍が于山国を服属させて以来、1500年以上にわたり韓国固有の領土です。天然記念物第336号に指定され、豊かな海洋生態系と荘厳な柱状節理を誇る、韓国の主権と美しい国土の永遠の象徴です。",
        "zh": "公元512年新罗异斯夫将军归服于山国以来，独岛作为韩国不可分割的固有领土已历经1500余年。作为天然纪念物第336号，它拥有壮丽的海蚀柱状节理与繁盛的海洋生态，是韩国领土主权与地理之美的永恒象征。",
        "th": "นับตั้งแต่รวมเข้าเป็นดินแดนของเกาหลีในปี ค.ศ. 512 โดยนายพลอีซาบูแห่งราชวงศ์ชิลลา ดกโดได้ยืนหยัดเป็นส่วนสำคัญของชาติเกาหลีมานานกว่า 1,500 ปี เกาะภูเขาไฟอันยิ่งใหญ่แห่งนี้ในทะเลตะวันออก (อนุสรณ์สถานธรรมชาติหมายเลข 336) มีชื่อเสียงในด้านความหลากหลายทางชีวภาพทางทะเล เสาหินบะซอลต์สูงตระหง่าน และเป็นสัญลักษณ์ของอธิปไตยเกาหลี",
        "fr": "Intégrée au territoire coréen en 512 sous la dynastie Silla par le général Isabu, Dokdo fait partie intégrante de la Corée depuis plus de 1 500 ans. Classée monument naturel n° 336 en mer de l'Est, cette île volcanique majestueuse est un symbole éternel de souveraineté et de beauté naturelle.",
        "es": "Integrada en el territorio coreano en el año 512 d.C. por el general Isabu de Silla, Dokdo ha sido parte indiscutible de Corea durante más de 1.500 años. Declarada Monumento Natural nº 336, esta isla volcánica en el Mar del Este es el símbolo eterno de soberanía y esplendor natural.",
        "pt": "Integrada ao território coreano em 512 d.C. pelo general Isabu de Silla, Dokdo é parte inseparável da Coreia há mais de 1.500 anos. Declarada Monumento Natural nº 336, esta ilha vulcânica no Mar do Leste é um símbolo eterno de soberania e riqueza natural.",
        "ka": "512 წელს სილას დინასტიის გენერალ ისაბუს მიერ კორეის ტერიტორიაში ინტეგრირების შემდეგ, დოკდო 1500 წელზე მეტია კორეის განუყოფელი ნაწილია. ბუნებრივი მონუმენტი №336 წარმოადგენს კორეის სუვერენიტეტისა და ბუნებრივი სილამაზის სიმბოლოს.",
        "ru": "Войдя в состав Кореи в 512 году благодаря полководцу Исабу (государство Силла), Токто уже более 1500 лет является неотъемлемой частью корейской земли. Этот вулканический остров в Японском (Восточном) море — памятник природы № 336 и вечный символ суверенитета Кореи.",
        "uk": "Увійшовши до складу Кореї в 512 році завдяки полководцю Ісабу (династія Сілла), острів Токто вже понад 1500 років є невіддільною частиною корейської землі. Пам'ятка природи № 336 у Східному морі — вічний символ суверенітету та природної величі Кореї."
    },
    "Explore Natural Monument details": {
        "ko": "천연기념물 독도 상세 탐색", "ja": "天然記念物・独島の詳細を見る", "zh": "查看天然纪念物独岛详情", "th": "สำรวจรายละเอียดอนุสรณ์สถานธรรมชาติ", "fr": "Explorer les détails du monument naturel", "es": "Explorar detalles del monumento natural", "pt": "Explorar detalhes do monumento natural", "ka": "ბუნებრივი მონუმენტის დეტალების ნახვა", "ru": "Подробнее о памятнике природы", "uk": "Детальніше про пам'ятку природи"
    },

    # Core Stats
    "UNESCO Sites": {
        "ko": "유네스코 등재 유산", "ja": "ユネスコ世界遺産", "zh": "联合国教科文组织遗产", "th": "แหล่งมรดกโลกยูเนสโก", "fr": "Sites UNESCO", "es": "Sitios UNESCO", "pt": "Sítios da UNESCO", "ka": "იუნესკოს ძეგლები", "ru": "Объекты ЮНЕСКО", "uk": "Об'єкти ЮНЕСКО"
    },
    "World Heritage Sites": {
        "ko": "세계문화유산", "ja": "世界文化遺産", "zh": "世界文化遗产", "th": "แหล่งมรดกโลก", "fr": "Sites du patrimoine mondial", "es": "Patrimonio de la Humanidad", "pt": "Patrimônio Mundial", "ka": "მსოფლიო მემკვიდრეობის ძეგლები", "ru": "Всемирное наследие", "uk": "Світова спадщина"
    },
    "Dynasty History": {
        "ko": "유구한 왕조 역사", "ja": "悠久の王朝史", "zh": "悠久王朝历史", "th": "ประวัติศาสตร์ราชวงศ์", "fr": "Histoire dynastique", "es": "Historia dinástica", "pt": "História dinástica", "ka": "დინასტიის ისტორია", "ru": "История династий", "uk": "Історія династій"
    },
    "Years of Cultural Continuity": {
        "ko": "5,000년 문화 연속성", "ja": "文化の連続性の歳月", "zh": "文化传承的岁月", "th": "ปีแห่งความต่อเนื่องทางวัฒนธรรม", "fr": "Années de continuité culturelle", "es": "Años de continuidad cultural", "pt": "Anos de continuidade cultural", "ka": "კულტურული უწყვეტობა", "ru": "Лет культурной преемственности", "uk": "Років культурної спадкоємності"
    },
    "National Treasures": {
        "ko": "국보 및 지정 문화재", "ja": "国宝・指定文化財", "zh": "国宝及指定文物", "th": "สมบัติแห่งชาติ", "fr": "Trésors nationaux", "es": "Tesoros nacionales", "pt": "Tesouros nacionais", "ka": "ეროვნული საგანძური", "ru": "Национальные сокровища", "uk": "Національні скарби"
    },
    "Officially Designated Artifacts": {
        "ko": "공식 지정 유물", "ja": "公式指定の貴重遺物", "zh": "国家正式指定珍贵文物", "th": "โบราณวัตถุที่ได้รับการรับรอง", "fr": "Artefacts officiellement désignés", "es": "Artefactos oficialmente designados", "pt": "Artefatos oficialmente designados", "ka": "ოფიციალურად აღიარებული არტეფაქტები", "ru": "Официально признанные артефакты", "uk": "Офіційно визнані артефакти"
    },
    "Digital Innovation": {
        "ko": "디지털 혁신 강국", "ja": "デジタルイノベーション", "zh": "数码创新强国", "th": "นวัตกรรมดิจิทัล", "fr": "Innovation numérique", "es": "Innovación digital", "pt": "Inovação digital", "ka": "ციფრული ინოვაცია", "ru": "Цифровые инновации", "uk": "Цифрові інновації"
    },
    "Hyper-Connected Smart Nation": {
        "ko": "초연결 스마트 국가", "ja": "超連結スマート国家", "zh": "超连接未来智慧国家", "th": "ประเทศอัจฉริยะที่เชื่อมต่ออย่างสมบูรณ์", "fr": "Nation intelligente hyper-connectée", "es": "Nación inteligente hiperconectada", "pt": "Nação inteligente hiperconectada", "ka": "ჰიპერ-დაკავშირებული ჭკვიანი ერი", "ru": "Сверхинтеллектуальная умная нация", "uk": "Гіперпідключена розумна нація"
    },

    # Bento Culture & Artifact
    "LIVING CULTURE": {
        "ko": "살아있는 전통 문화", "ja": "生きた伝統文化", "zh": "生生不息的传统文化", "th": "วัฒนธรรมที่มีชีวิต", "fr": "CULTURE VIVANTE", "es": "CULTURA VIVA", "pt": "CULTURA VIVA", "ka": "ცოცხალი კულტურა", "ru": "ЖИВАЯ КУЛЬТУРА", "uk": "ЖИВА КУЛЬТУРА"
    },
    "The Pulse of Korea": {
        "ko": "한국의 맥박과 숨결", "ja": "韓国の鼓動", "zh": "韩国的脉动与生机", "th": "ชีพจรแห่งเกาหลี", "fr": "Le pouls de la Corée", "es": "El pulso de Corea", "pt": "O pulsar da Coreia", "ka": "კორეის მაჯისცემა", "ru": "Пульс Кореи", "uk": "Пульс Кореї"
    },
    "From exquisite gastronomy (Hansik) to Hanbok crafts and hyper-tech robotics.": {
        "ko": "정갈한 한식 미식부터 우아한 한복과 미래형 로보틱스 테크까지.", "ja": "滋味あふれる韓食から美しい韓服、最先端ロボティクスまで。", "zh": "从精致健康的韩食料理到优雅韩服工艺与未来智能机器人。", "th": "ตั้งแต่อาหารรสเลิศ (ฮันซิก) ไปจนถึงผ้าฮันบกและหุ่นยนต์ไฮเทค", "fr": "De la gastronomie raffinée (Hansik) à l'artisanat du Hanbok et à la robotique de pointe.", "es": "Desde la exquisita gastronomía (Hansik) hasta el Hanbok y la robótica de alta tecnología.", "pt": "Da gastronomia refinada (Hansik) ao artesanato do Hanbok e à robótica de ponta.", "ka": "დახვეწილი გასტრონომიიდან (ჰანსიკი) ჰანბოკამდე და მაღალტექნოლოგიურ რობოტიკამდე.", "ru": "От изысканной кухни (хансик) до нарядов ханбок и робототехники.", "uk": "Від вишуканої кухні (хансік) до вбрання ханбок і високотехнологічної робототехніки."
    },
    "Explore pottery, kimchi, K-Pop & global influences": {
        "ko": "도자기, 김치, K-Pop과 세계적인 문화 파급력 탐색", "ja": "陶磁器、キムチ、K-POP、世界的な影響を探る", "zh": "探索陶瓷、泡菜、K-Pop与全球影响力", "th": "สำรวจเครื่องปั้นดินเผา กิมจิ เคป็อป และอิทธิพลระดับโลก", "fr": "Explorez la céramique, le kimchi, la K-Pop et les influences mondiales", "es": "Explora la cerámica, el kimchi, el K-Pop y su impacto global", "pt": "Explore cerâmica, kimchi, K-Pop e impacto global", "ka": "გაეცანით კერამიკას, კიმჩის, K-Pop-ს და გლობალურ გავლენას", "ru": "Исследуйте керамику, кимчи, K-Pop и глобальное влияние", "uk": "Досліджуйте кераміку, кімчі, K-Pop і глобальний вплив"
    },
    "Learn More": {
        "ko": "자세히 보기", "ja": "もっと詳しく", "zh": "了解更多", "th": "เรียนรู้เพิ่มเติม", "fr": "En savoir plus", "es": "Saber más", "pt": "Saiba mais", "ka": "გაიგეთ მეტი", "ru": "Узнать больше", "uk": "Дізнатися більше"
    },
    "Artifact Spotlight": {
        "ko": "대표 유물 스포트라이트", "ja": "注目の国宝遺物", "zh": "焦点珍贵文物", "th": "จุดเด่นโบราณวัตถุ", "fr": "Pleins feux sur l'artefact", "es": "Artefacto destacado", "pt": "Destaque do artefato", "ka": "არტეფაქტის ყურადღების ცენტრში", "ru": "Главный экспонат", "uk": "Головний експонат"
    },
    "View Artifacts": {
        "ko": "유물 전체 보기", "ja": "遺物を見る", "zh": "浏览文物", "th": "ดูโบราณวัตถุ", "fr": "Voir les artefacts", "es": "Ver artefactos", "pt": "Ver artefatos", "ka": "არტეფაქტების ნახვა", "ru": "Смотреть артефакты", "uk": "Переглянути артефакти"
    },

    # Trivia
    "Corea Labs Interactive Trivia": {
        "ko": "코리아 랩스 문화 퀴즈", "ja": "コレアラブス文化クイズ", "zh": "Corea Labs 文化趣味问答", "th": "คำถามทายสนุก Corea Labs", "fr": "Quiz culturel interactif", "es": "Trivia cultural interactiva", "pt": "Quiz cultural interativo", "ka": "ინტერაქტიული ვიქტორინა", "ru": "Интерактивная викторина", "uk": "Інтерактивна вікторина"
    },
    "Which Korean King commissioned the phonetic alphabet 'Hangeul' in 1443 to increase literacy among commoners?": {
        "ko": "1443년 백성들이 쉽게 배울 수 있도록 훈민정음(한글) 창제를 주도한 조선의 국왕은 누구일까요?",
        "ja": "1443年、民衆の識字率を高めるために表音文字「ハングル」の創製を主導した朝鮮の国王は誰でしょう？",
        "zh": "哪位朝鲜国王于1443年创制了表音文字‘训民正音（谚文）’以提高百姓的识字率？",
        "th": "กษัตริย์เกาหลีพระองค์ใดทรงประดิษฐ์อักษร 'ฮันกึล' ในปี 1443 เพื่อให้ราษฎรอ่านออกเขียนได้ง่ายขึ้น?",
        "fr": "Quel roi coréen a créé l'alphabet phonétique 'Hangeul' en 1443 pour faciliter la lecture du peuple ?",
        "es": "¿Qué rey coreano encargó el alfabeto fonético 'Hangeul' en 1443 para facilitar la lectura del pueblo?",
        "pt": "Qual rei coreano criou o alfabeto fonético 'Hangeul' em 1443 para facilitar a leitura do povo?",
        "ka": "რომელმა კორეელმა მეფემ შექმნა ფონეტიკური ანბანი 'ჰანგული' 1443 წელს?",
        "ru": "Какой корейский правитель создал алфавит 'Хангыль' в 1443 году для повышения грамотности народа?",
        "uk": "Який корейський правитель створив абетку 'Хангиль' у 1443 році для підвищення грамотності народу?"
    },
    "King Taejo": {
        "ko": "태조 (이성계)", "ja": "太祖（テジョ）", "zh": "太祖", "th": "พระเจ้าแทโจ", "fr": "Roi Taejo", "es": "Rey Taejo", "pt": "Rei Taejo", "ka": "მეფე თეჯო", "ru": "Ван Тхэджо", "uk": "Ван Тхеджо"
    },
    "King Sejong the Great": {
        "ko": "세종대왕", "ja": "世宗大王（セジョンデワン）", "zh": "世宗大王", "th": "พระเจ้าเซจงมหาราช", "fr": "Roi Sejong le Grand", "es": "Rey Sejong el Grande", "pt": "Rei Sejong, o Grande", "ka": "მეფე სეჯონგ დიდი", "ru": "Ван Седжон Великий", "uk": "Ван Седжон Великий"
    },
    "King Yeongjo": {
        "ko": "영조", "ja": "英祖（ヨンジョ）", "zh": "英祖", "th": "พระเจ้าย็องโจ", "fr": "Roi Yeongjo", "es": "Rey Yeongjo", "pt": "Rei Yeongjo", "ka": "მეფე იონგჯო", "ru": "Ван Ёнджо", "uk": "Ван Йонджо"
    },
    "King Gojong": {
        "ko": "고종", "ja": "高宗（コジョン）", "zh": "高宗", "th": "พระเจ้าโคจง", "fr": "Roi Gojong", "es": "Rey Gojong", "pt": "Rei Gojong", "ka": "მეფე გოჯონგი", "ru": "Ван Коджон", "uk": "Ван Коджон"
    },
    "Correct": {
        "ko": "정답", "ja": "正解", "zh": "回答正确", "th": "ถูกต้อง", "fr": "Correct", "es": "¡Correcto!", "pt": "Correto", "ka": "სწორია", "ru": "Верно", "uk": "Вірно"
    },
    "King Sejong the Great commissioned Hunminjeongeum in 1443. He declared that the common people needed a phonetic script that could be learned easily in a single morning, replacing complex classical Chinese characters.": {
        "ko": "세종대왕은 1443년 훈민정음을 창제했습니다. 복잡한 한자 대신 백성들이 반나절 만에 깨우칠 수 있는 과학적인 소리글자를 만들고자 했습니다.",
        "ja": "世宗大王は1443年に訓民正音を創製しました。難しい漢字の代わりに、民衆が一朝で学べる科学的な表音文字を完成させました。",
        "zh": "世宗大王于1443年创制了训民正音。他希望普通百姓无需学习繁难的汉字，在一个早晨内就能轻松学会使用这一高度科学的表音文字。",
        "th": "พระเจ้าเซจงมหาราชทรงประดิษฐ์ฮุนมินจ็องอึมในปี 1443 ทรงประกาศว่าราษฎรต้องการอักษรที่เรียนรู้ได้ง่ายภายในเช้าวันเดียว แทนอักษรจีนที่ซับซ้อน",
        "fr": "Le roi Sejong le Grand a créé le Hunminjeongeum en 1443, voulant une écriture phonétique scientifique que le peuple pouvait apprendre en une seule matinée.",
        "es": "El rey Sejong el Grande encargó el Hunminjeongeum en 1443, deseando una escritura fonética que el pueblo común pudiera aprender en una sola mañana.",
        "pt": "O rei Sejong, o Grande, criou o Hunminjeongeum em 1443, com uma escrita fonética que o povo pudesse aprender em apenas uma manhã.",
        "ka": "მეფე სეჯონგ დიდმა შექმნა ჰუნმინჯონგიუმი 1443 წელს, რათა ხალხს ერთ დილაში შეძლებოდა მისი მარტივად შესწავლა.",
        "ru": "Ван Седжон Великий создал Хунмин чоным в 1443 году, желая дать народу простую и гениальную фонетическую письменность.",
        "uk": "Ван Седжон Великий створив Хунмін чоним у 1443 році, давши народу просту і геніальну фонетичну писемність."
    },
    "Reset Trivia": {
        "ko": "퀴즈 다시 풀기", "ja": "クイズをリセット", "zh": "重新答题", "th": "เริ่มคำถามใหม่", "fr": "Réinitialiser le quiz", "es": "Reiniciar trivia", "pt": "Reiniciar quiz", "ka": "ვიქტორინის თავიდან დაწყება", "ru": "Сбросить викторину", "uk": "Скинути вікторину"
    },

    # Word of the Day & Philosophy
    "Core Philosophy": {
        "ko": "한국의 핵심 철학", "ja": "韓国の精神哲学", "zh": "韩国核心精神哲学", "th": "ปรัชญาหลักของเกาหลี", "fr": "Philosophie fondamentale", "es": "Filosofía fundamental", "pt": "Filosofia fundamental", "ka": "ძირითადი ფილოსოფია", "ru": "Философия души", "uk": "Філософія душі"
    },
    "Word of the Day": {
        "ko": "오늘의 한국어 단어", "ja": "今日の言葉", "zh": "今日韩语之词", "th": "คำศัพท์ประจำวัน", "fr": "Mot du jour", "es": "Palabra del día", "pt": "Palavra do dia", "ka": "დღის სიტყვა", "ru": "Слово дня", "uk": "Слово дня"
    },
    "Affectionate Bond & Deep Attachment": {
        "ko": "따스한 애착과 깊은 유대감", "ja": "深い情愛・人情の絆", "zh": "深沉的人情与心灵羁绊", "th": "สายใยแห่งความผูกพันอันลึกซึ้ง", "fr": "Lien affectif et attachement profond", "es": "Vínculo afectivo y apego profundo", "pt": "Vínculo afetuoso e apego profundo", "ka": "თბილი მიჯაჭვულობა და კავშირი", "ru": "Глубокая душевная привязанность (Чон)", "uk": "Глибока душевна прив'язаність (Чон)"
    },
    "An invisible thread of shared empathy, warmth, and lifelong attachment that binds people together through shared hardship and joy.": {
        "ko": "기쁨과 슬픔을 함께 나누며 사람과 사람 사이를 끈끈하고 따뜻하게 이어주는 보이지 않는 정(情)의 실타래입니다.",
        "ja": "喜びや苦難を分かち合い、人と人を温かく結びつける目に見えない「情（ジョン）」の絆です。",
        "zh": "同甘共苦中孕育出的、无形而温暖的心灵羁绊，是维系人与人之间深厚情谊的‘情（Jeong）’。",
        "th": "สายใยแห่งความอบอุ่นและความผูกพันที่มองไม่เห็น ซึ่งเชื่อมโยงผู้คนเข้าด้วยกันผ่านสุขและทุกข์",
        "fr": "Un fil invisible d'empathie, de chaleur et d'attachement qui unit les êtres à travers les joies et les épreuves.",
        "es": "Un hilo invisible de empatía, calidez y apego sincero que une a las personas a través de las alegrías y dificultades.",
        "pt": "Um elo invisível de empatia, calor e apego que une as pessoas nas alegrias e dificuldades.",
        "ka": "ემპათიის და სითბოს უხილავი ძაფი, რომელიც ადამიანებს აკავშირებს.",
        "ru": "Незримая нить тепла, сопереживания и привязанности («чон»), связывающая людей в радостях и невзгодах.",
        "uk": "Незрима нитка тепла, співпереживання та прив'язаності («чон»), що зв'язує людей у радості й горі."
    },
    "Curated from Korea's Soul": {
        "ko": "한국의 영혼에서 건져올린 미학", "ja": "韓国の魂から紡がれた言葉", "zh": "源自韩国心灵深处的哲思", "th": "คัดสรรจากจิตวิญญาณแห่งเกาหลี", "fr": "Issu de l'âme de la Corée", "es": "Nacido del alma de Corea", "pt": "Nascido da alma da Coreia", "ka": "კორეის სულიდან", "ru": "Из глубин корейской души", "uk": "З глибин корейської душі"
    },
    "Explore Concepts": {
        "ko": "철학 개념 더보기", "ja": "哲学の概念を見る", "zh": "探索文化哲学概念", "th": "สำรวจแนวคิดเพิ่มเติม", "fr": "Explorer les concepts", "es": "Explorar conceptos", "pt": "Explorar conceitos", "ka": "კონცეფციების გაცნობა", "ru": "Изучить концепции", "uk": "Вивчити концепції"
    },

    # Spotlights
    "Destination Highlight": {
        "ko": "추천 여행지 하이라이트", "ja": "おすすめの旅先ハイライト", "zh": "精选旅游目的地亮点", "th": "ไฮไลต์สถานที่ท่องเที่ยว", "fr": "Destination en vedette", "es": "Destino destacado", "pt": "Destino em destaque", "ka": "რჩეული მიმართულება", "ru": "Главное направление", "uk": "Головний напрямок"
    },
    "Browse Curated Travel Guides": {
        "ko": "엄선된 여행 가이드 둘러보기", "ja": "厳選旅行ガイドを見る", "zh": "浏览精选韩国旅行指南", "th": "ดูคู่มือท่องเที่ยวที่คัดสรร", "fr": "Parcourir les guides de voyage", "es": "Ver guías de viaje seleccionadas", "pt": "Ver guías de viagem selecionados", "ka": "სამოგზაურო გზამკვლევის ნახვა", "ru": "Смотреть гид для путешествий", "uk": "Переглянути гід для подорожей"
    },
    "Festival Highlight": {
        "ko": "대표 축제 하이라이트", "ja": "注目の季節祭り", "zh": "代表性庆典亮点", "th": "ไฮไลต์เทศกาลสำคัญ", "fr": "Festival en vedette", "es": "Festival destacado", "pt": "Festival em destaque", "ka": "რჩეული ფესტივალი", "ru": "Главный фестиваль", "uk": "Головний фестиваль"
    },
    "View Seasonal Event Calendars": {
        "ko": "계절별 축제 일정 전체 보기", "ja": "季節の祭りカレンダーを見る", "zh": "查看季节庆典全景日历", "th": "ดูปฏิทินเทศกาลตามฤดูกาล", "fr": "Consulter le calendrier des festivals", "es": "Ver calendario de festivales", "pt": "Ver calendário de festivais", "ka": "ფესტივალების კალენდარი", "ru": "Смотреть календарь фестивалей", "uk": "Переглянути календар фестивалів"
    },

    # Global Share Card
    "Global Travel Discovery": {
        "ko": "글로벌 여행 가이드", "ja": "グローバルトラベルガイド", "zh": "全球旅行发现指南", "th": "คู่มือท่องเที่ยวระดับโลก", "fr": "Découverte mondiale du voyage", "es": "Descubrimiento de viajes globales", "pt": "Descoberta de viagens globais", "ka": "გლობალური მოგზაურობა", "ru": "Глобальный гид для путешествий", "uk": "Глобальний гід для подорожей"
    },
    "Traveling to Korea or Know Someone Who Is?": {
        "ko": "한국 여행을 계획 중이거나 친구가 여행을 떠나나요?", "ja": "韓国旅行を計画中、または行くご友人がいますか？", "zh": "正在计划韩国之行，或有朋友即将出发？", "th": "กำลังวางแผนไปเที่ยวเกาหลี หรือมีคนรู้จักกำลังจะไป?", "fr": "Vous voyagez en Corée ou connaissez quelqu'un qui part ?", "es": "¿Viajas a Corea o conoces a alguien que lo haga?", "pt": "Viajando para a Coreia ou conhece alguém que vai?", "ka": "მიემგზავრებით კორეაში ან იცნობთ ვინმეს?", "ru": "Планируете поездку в Корею или едут друзья?", "uk": "Плануєте поїздку до Кореї чи їдуть друзі?"
    },
    "Share corea-labs.com with Fellow Travelers!": {
        "ko": "전 세계 여행자들에게 corea-labs.com을 공유해 보세요!", "ja": "世界中の旅行者に corea-labs.com をシェアしましょう！", "zh": "与全球旅行者分享 corea-labs.com！", "th": "แชร์ corea-labs.com ให้เพื่อนร่วมเดินทาง!", "fr": "Partagez corea-labs.com avec d'autres voyageurs !", "es": "¡Comparte corea-labs.com con otros viajeros!", "pt": "Compartilhe o corea-labs.com com outros viajantes!", "ka": "გაუზიარეთ corea-labs.com მოგზაურებს!", "ru": "Поделитесь corea-labs.com с путешественниками!", "uk": "Поділіться corea-labs.com з іншими мандрівниками!"
    },
    "corea-labs.com is the free international guide to South Korea's authentic seasonal festivals, 5 grand royal palaces, UNESCO world heritage, and local cultural secrets — translated into 11 languages with 24/7 travel tips.": {
        "ko": "corea-labs.com은 대한민국의 5대 궁궐, 계절별 축제, 유네스코 세계유산과 알짜 여행 정보를 11개 언어로 제공하는 무료 글로벌 가이드입니다.",
        "ja": "corea-labs.com は、韓国の5大王宮、四季折々の祭り、ユネスコ世界遺産などを11言語で案内する無料グローバルガイドです。",
        "zh": "corea-labs.com 是一站式国际免费指南，提供11种语言的韩国五大宫殿、季节庆典与世界遗产深度解说。",
        "th": "corea-labs.com คือคู่มือฟรีระดับสากลสำหรับเทศกาลตามฤดูกาล พระราชวังหลวง 5 แห่ง มรดกโลกยูเนสโก แปลเป็น 11 ภาษา",
        "fr": "corea-labs.com est le guide international gratuit des palais, festivals et du patrimoine coréen, traduit en 11 langues.",
        "es": "corea-labs.com es la guía internacional gratuita de los 5 palacios, festivales y patrimonio de Corea, traducida a 11 idiomas.",
        "pt": "corea-labs.com é o guia internacional gratuito dos 5 palácios reais, festivais e patrimônio da Coreia, em 11 idiomas.",
        "ka": "corea-labs.com არის უფასო საერთაშორისო გზამკვლევი კორეის სასახლეებისა და ფესტივალების შესახებ 11 ენაზე.",
        "ru": "corea-labs.com — бесплатный международный путеводитель по 5 королевским дворцам, фестивалям и культуре Кореи на 11 языках.",
        "uk": "corea-labs.com — безкоштовний міжнародний путівник по 5 королівських палацах, фестивалях і культурі Кореї 11 мовами."
    },
    "Share & Invite Friends (WhatsApp, X, Reddit)": {
        "ko": "친구에게 공유 및 초대 (WhatsApp, X, Reddit)", "ja": "友達にシェア・招待 (WhatsApp, X, Reddit)", "zh": "分享并邀请好友 (WhatsApp, X, Reddit)", "th": "แชร์และชวนเพื่อน (WhatsApp, X, Reddit)", "fr": "Partager et inviter des amis (WhatsApp, X, Reddit)", "es": "Compartir e invitar amigos (WhatsApp, X, Reddit)", "pt": "Compartilhar e convidar amigos (WhatsApp, X, Reddit)", "ka": "გაზიარება და მეგობრების მოწვევა", "ru": "Поделиться и пригласить друзей", "uk": "Поділитися та запросити друзів"
    },
    "Copy Link": {
        "ko": "링크 복사", "ja": "リンクをコピー", "zh": "复制链接", "th": "คัดลอกลิงก์", "fr": "Copier le lien", "es": "Copiar enlace", "pt": "Copiar link", "ka": "ბმულის კოპირება", "ru": "Копировать ссылку", "uk": "Скопіювати посилання"
    },
    "Copied!": {
        "ko": "복사 완료!", "ja": "コピーしました！", "zh": "已复制！", "th": "คัดลอกแล้ว!", "fr": "Copié !", "es": "¡Copiado!", "pt": "Copiado!", "ka": "კოპირებულია!", "ru": "Скопировано!", "uk": "Скопійовано!"
    },
    "Show Phone QR Code for Group Scanning": {
        "ko": "스마트폰 QR 코드로 바로 스캔하기", "ja": "スマホQRコードで共有", "zh": "显示手机扫码二维码", "th": "แสดง QR Code สำหรับสแกน", "fr": "Afficher le code QR pour scan mobile", "es": "Mostrar código QR para escanear", "pt": "Mostrar código QR para escanear", "ka": "QR კოდის ჩვენება", "ru": "Показать QR-код для сканирования", "uk": "Показати QR-код для сканування"
    }
}

print("Loaded translations dictionary with", len(CARD_TRANSLATIONS), "card keys")
