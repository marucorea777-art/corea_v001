# corea-labs.com 정적 호스팅용 브라우저 기반 실시간 방문자 추적 엔진 구축 계획

`corea-labs.com`(Cloudflare 정적 호스팅) 환경에서 백엔드 API 경로가 HTML을 반환하여 통계 집계 및 초기화가 실패하던 문제를 해결하기 위해, 서버 유무와 관계없이 100% 동작하는 **브라우저 기반 실시간 방문자 추적 및 집계 엔진**을 탑재합니다.

## User Review & Critical Decisions

> [!IMPORTANT]
> 라이브 사이트(`corea-labs.com`) 점검 결과, 정적 호스팅 특성상 `/api/*` 요청이 서버로 전달되지 않고 `index.html`을 반환하고 있었습니다. 사용자의 선택에 따라 별도의 외부 DB 설정 없이도 정적 호스팅에서 즉시 작동하는 브라우저 기반 실시간 스토리지 및 멀티탭 동기화 엔진으로 전환합니다.

- **Confirmed Decision 1**: 정적 호스팅용 브라우저 기반 실시간 추적 엔진 탑재 (Cloudflare Pages 등 정적 배포 환경에서도 페이지 이동·언어 변경·초기화·데모 복원이 에러 없이 100% 실시간 작동하도록 구현)
- **Confirmed Decision 2**: 순수 실제 유입 모드(0부터 시작)와 데모 시드 모드(14,821명 기준치 + 실시간 가산) 모두 초기화 실패 없이 즉시 전환 및 누적 집계 지원

---

## 1. Overview & Core Concept

- **What It Does**: 사용자가 사이트에 접속하거나 탭(홈, 문화유산, 전통문화, 추천명소, 전국축제, 여행가이드) 및 언어를 변경할 때마다 브라우저 내 영구 원장(Persistent Analytics Ledger)에 방문수, 고유 세션, 국가, 언어, 기기, 일별 추이(14일), 최근 접속 로그를 실시간으로 기록하고 대시보드에 즉각 반영합니다.
- **Target Audience / Persona**: `corea-labs.com`을 운영하는 관리자 및 전 세계에서 접속하는 다국어 여행자.
- **Key Value**: 정적 웹 호스팅 환경에서도 네트워크/파싱 오류 없이 방문자 카운트가 1씩 실시간으로 정확하게 올라가며, 초기화 및 데모 복원 기능이 100% 보장됩니다.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **실시간 방문 자동 감지**: 방문자가 사이트에 접속하거나 메뉴를 클릭하면 즉시 세션 ID, 타임존 기반 국가(미국, 한국, 일본, 중국, 유럽 등), 사용 언어, 접속 기기(모바일/데스크톱/태블릿)를 분석해 카운트를 +1 누적합니다.
  2. **멀티탭 & 실시간 대시보드 자동 갱신**: 관리자가 대시보드를 열어둔 상태에서 다른 탭이나 창에서 페이지를 탐색하면, 새로고침 버튼을 누르지 않아도 실시간 이벤트 버스를 통해 대시보드 수치와 최근 접속자 로그, 14일 추이 그래프가 즉시 갱신됩니다.
  3. **무결점 초기화 및 복원**: `[데모버전 지우기 (0부터 시작)]` 또는 `[데모 데이터 복원]` 클릭 시 정적 호스팅에서도 오류 토스트 없이 즉시 원장이 재설정되고 화면에 반영됩니다.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: 품격 있는 한국 전통 연구소 테마(다크 스톤 헤더 & 앰버 골드 포인트)와 고밀도 엔터프라이즈 애널리틱스 UI의 조화.
  - *Color Palette & Mood*: 중립 스톤 캔버스(`#FAF9F6`), 다크 슬레이트 헤더(`#1C1917`), 정상 작동 및 실시간 수신 상태를 나타내는 에메랄드(`#16A34A`), 강조용 앰버(`#D97706`).
  - *Typography & Hierarchy*: 모든 방문자 카운트, 비율(%), 날짜, 타임스탬프에 고정폭 숫자(`font-mono`, `tabular-nums`)를 적용하여 숫자가 실시간으로 올라갈 때 레이아웃 흔들림을 방지합니다.
  - *Component Styling & Layout*: 단일 레벨 카드 구조(`border-stone-200`), 5열 핵심 KPI 요약 카드, 좌측 국가별 점유율 바 & 우측 14일 일별 추이 인터랙티브 차트, 하단 실시간 접속 세션 테이블 배치.
- **Interactive Feedback & Motion**:
  - 실시간 방문 카운트 증가 시 부드러운 수치 전환과 녹색 성공 토스트 배너 제공(오류 발생 시 붉은색 배너로 명확히 구분).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: 하이브리드 정적/서버 어댑터 아키텍처 (Static-First Real-Time Engine)**
  - *Chosen Approach*: 모든 방문 기록과 초기화를 브라우저 영구 원장(`localStorage`)에 최우선으로 즉시 기록 및 계산하고, 백엔드 API 응답이 실제 JSON(`application/json`)일 때만 서버와 동기화합니다. 정적 호스팅(HTML 응답)일 경우에도 에러를 발생시키지 않고 브라우저 엔진이 즉시 성공 처리합니다.
  - *Why*: `corea-labs.com`과 같은 Cloudflare 정적 배포 환경에서 `/api/*` 호출이 HTML을 반환하더라도 기능이 중단되지 않고 0ms 지연으로 실시간 동작하기 위함입니다.
  - *Alternatives Considered*: 서버 전용 API 방식은 정적 호스팅에서 JSON 파싱 에러로 인해 카운팅과 초기화가 모두 작동하지 않으므로 배제했습니다.
- **Decision 2: 실시간 이벤트 브로드캐스팅 (`BroadcastChannel` + Custom Event)**
  - *Chosen Approach*: 페이지 이동 시 발생하는 방문 이벤트를 `BroadcastChannel` 및 윈도우 커스텀 이벤트와 3초 주기 라이브 폴링으로 대시보드에 즉시 전달합니다.
  - *Why*: 관리자가 대시보드를 켜둔 채로 실시간 유입 및 테스트 클릭을 확인할 때 즉각적인 시각적 피드백을 제공합니다.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     User Navigation & Language Switch                   │
│            (Home / Heritage / Culture / Places / Festivals)             │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ trackPageView(tab, lang)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                Browser Real-Time Analytics Engine (Client)              │
│  ┌─────────────────────────────┐     ┌───────────────────────────────┐  │
│  │  Persistent Ledger Store    │     │  Timezone & Locale Detector   │  │
│  │  - Total & Today Visits     │◄────┤  - Country & Flag Resolution  │  │
│  │  - Unique Session Tracker   │     │  - Device & Referrer Parser   │  │
│  │  - 14-Day Rolling Trend     │     └───────────────────────────────┘  │
│  └─────────────┬───────────────┘                                        │
│                │ BroadcastChannel + CustomEvent ('analytics-updated')   │
└────────────────┼──────────────────────────────────────┬─────────────────┘
                 │ 0ms Live Sync                        │ Optional JSON Sync
                 ▼                                      ▼
┌────────────────────────────────────────┐   ┌────────────────────────────┐
│       Admin Analytics Dashboard        │   │  Express API (Dev Environment)│
│  - 5 KPI Cards (Tabular Numerals)      │   │  - Syncs when JSON API     │
│  - Top Countries & 14-Day SVG Chart    │   │    is available            │
│  - Live Visitor Log & Instant Reset    │   └────────────────────────────┘
└────────────────────────────────────────┘
```

- **Data Model & State**:
  - `PersistentAnalyticsLedger`:
    - `isPureRealOnly` (boolean): 순수 실제 접속 집계 모드 여부
    - `totalVisits` (number): 총 누적 방문수
    - `uniqueVisitorsCount` (number) & `uniqueSessionIds` (map): 세션 기반 순 방문자 집계
    - `dailyStats` (map of `YYYY-MM-DD` -> count): 최근 14일 일자별 방문수
    - `countryStats`, `languageStats`, `pageStats`, `deviceStats`, `referrerStats`: 항목별 누적 카운트 및 백분율 자동 계산
    - `recentVisitors` (array): 최근 50건의 접속 로그 (ID, 타임스탬프, 국가명, 국기, 경로, 기기, 언어)
- **Interactive Component & State Mapping**:
  - **탭/언어 전환 핸들러**: 디바운스(1초)를 거쳐 실제 페이지 탐색마다 원장 데이터를 +1 갱신하고 브로드캐스트 이벤트를 발행합니다.
  - **대시보드 실시간 리스너**: 대시보드 오픈 시 브로드캐스트 이벤트와 `storage` 이벤트를 구독하여 화면을 즉시 리렌더링하며, 대시보드 내부에서도 `[+ 실시간 방문 테스트 기록]` 버튼으로 즉시 카운트 증가를 시연할 수 있습니다.
  - **초기화/복원 핸들러**: `resetAnalyticsData("zero" | "seed")` 호출 시 정적 호스팅 여부에 관계없이 로컬 원장을 즉시 초기화/복원하고 항상 성공 상태를 반환합니다.
