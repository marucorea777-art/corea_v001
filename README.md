# Corea Labs - Heritage Studio 🇰🇷

**Corea Labs - Heritage Studio**는 한국의 찬란한 문화유산, 역사적 보물, 자연유산(독도 등) 및 한식을 다국어로 소개하는 고품격 인터랙티브 웹 애플리케이션입니다.

---

## 🚀 로컬 환경에서 실행 및 개발하는 방법

이 프로젝트는 클라우드 샌드박스 환경에서 개발되었으며, 아래의 가이드를 따라 로컬 컴퓨터(VS Code, Cursor 등)로 가져와서 바로 실행할 수 있습니다.

### 1. 프로젝트 다운로드 (내보내기)
* **ZIP 다운로드**: Google AI Studio 화면 우측 상단의 **설정(Settings)** 또는 **내보내기(Export)** 메뉴를 통해 프로젝트 전체를 ZIP 파일로 다운로드할 수 있습니다.
* **GitHub 연동**: 설정 메뉴에서 GitHub 저장소(`https://github.com/cmenter-bot/corea-labs`)와 직접 연동하여 푸시하거나 내려받을 수 있습니다.

---

### 2. 로컬 실행 준비 (Prerequisites)
로컬 컴퓨터에 **Node.js** (v18 이상 권장) 또는 **Bun**이 설치되어 있어야 합니다.

1. 다운로드한 ZIP 파일의 압축을 풀거나 Git Clone을 수행한 뒤, 해당 폴더를 터미널 또는 에디터(VS Code)로 엽니다.
2. 패키지 설치를 완료합니다:
   ```bash
   # npm을 사용하는 경우
   npm install

   # 또는 bun을 사용하는 경우
   bun install
   ```

---

### 3. 환경 변수 설정
프로젝트 루트 폴더에 `.env` 파일을 생성하고 `.env.example`의 내용을 복사하여 필요한 환경 변수를 설정합니다.
```bash
cp .env.example .env
```
* `GEMINI_API_KEY`: 만약 AI 기능이 필요할 경우 본인의 Google AI Studio API 키를 입력합니다.
* `APP_URL`: 로컬 개발 시에는 기본값(`http://localhost:3000`)을 사용하면 됩니다.

---

### 4. 개발 서버 실행 (Development)
로컬 개발 서버를 구동하여 소스 코드 수정 시 실시간으로 화면을 확인할 수 있습니다.
```bash
npm run dev
# 또는
bun run dev
```
개발 서버가 시작되면 브라우저에서 **[http://localhost:3000](http://localhost:3000)**으로 접속합니다.

---

### 5. 빌드 및 프로덕션 실행 (Production)
실제 배포용 코드로 빌드하고 최적화된 상태로 서버를 실행합니다.
```bash
# 1. 빌드 (클라이언트 빌드 및 Express 서버 번들링)
npm run build

# 2. 프로덕션 서버 시작
npm run start
```

---

## 📂 프로젝트 주요 구조 (Project Structure)

* `/src/components`: UI를 이루는 다양한 섹션 및 컴포넌트들
  * `HomeView.tsx` - 메인 대시보드 및 독도 특별 스포트라이트 섹션
  * `HeritageView.tsx` - 무형/유형/자연유산 타임라인 및 필터 뷰
  * `Navbar.tsx` - 다국어 지원 내비게이션 바
  * `KoreaLogoIcon.tsx` - 태극 문양의 인터랙티브 로고 아이콘
* `/src/context`: 다국어 지원을 위한 `LanguageContext.tsx` (한국어, 영어, 일본어 등 실시간 번역 제공)
* `/src/data.ts`: 한국의 유산, 음식(불고기, 게장, 떡볶이 등), 궁궐, 축제 등의 데이터 소스
* `/server.ts`: 클라이언트 정적 에셋 및 API를 서빙하는 Express + Vite 개발용 서버 엔트리포인트
