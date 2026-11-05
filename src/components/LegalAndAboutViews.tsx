import { Shield, FileText, Compass, ArrowLeft, Globe, CheckCircle2, ExternalLink, Lock, Cookie, Scale, Sparkles, BookOpen, MapPin, CalendarDays, PlaneLanding, Mail } from "lucide-react";
import { Translate } from "../context/LanguageContext";
import KoreaLogoIcon from "./KoreaLogoIcon";

interface LegalAndAboutViewProps {
  activePage: "privacy" | "terms" | "about";
  setActiveTab: (tab: string) => void;
}

export default function LegalAndAboutViews({ activePage, setActiveTab }: LegalAndAboutViewProps) {
  const navTabs = [
    { id: "about" as const, label: "사이트 소개 (About)", icon: Compass },
    { id: "privacy" as const, label: "개인정보처리방침 (Privacy Policy)", icon: Shield },
    { id: "terms" as const, label: "이용약관 (Terms of Service)", icon: FileText },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Navigation & Back Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
        <button
          onClick={() => setActiveTab("home")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span><Translate>홈으로 돌아가기</Translate></span>
        </button>

        <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200/60">
          {navTabs.map((item) => {
            const Icon = item.icon;
            const isCurrent = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span><Translate>{item.label}</Translate></span>
              </button>
            );
          })}
        </div>
      </div>

      {activePage === "privacy" && <PrivacyPolicyContent setActiveTab={setActiveTab} />}
      {activePage === "terms" && <TermsOfServiceContent setActiveTab={setActiveTab} />}
      {activePage === "about" && <AboutSiteContent setActiveTab={setActiveTab} />}
    </div>
  );
}

function PrivacyPolicyContent({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <article className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-8 md:p-10 border-b border-stone-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono mb-4">
          <Shield className="w-3.5 h-3.5" />
          <span>PRIVACY POLICY · GDPR &amp; ADSENSE COMPLIANT</span>
        </div>
        <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-white">
          <Translate>개인정보처리방침 (Privacy Policy)</Translate>
        </h1>
        <p className="text-stone-300 text-sm md:text-base mt-3 max-w-3xl leading-relaxed">
          <Translate>
            대한민국 연구소 | Corea Labs (이하 &quot;사이트&quot;, https://corea-labs.com)는 이용자의 개인정보와 프라이버시를 소중하게 보호하며, 대한민국 개인정보보호법 및 글로벌 데이터 보호 규정(GDPR, CCPA), Google AdSense 게시자 정책을 준수합니다.
          </Translate>
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-400 font-mono">
          <span><Translate>시행일자: 2025년 1월 1일</Translate></span>
          <span>•</span>
          <span><Translate>최종 개정일: 2026년 11월 4일</Translate></span>
          <span>•</span>
          <span><Translate>적용 도메인: https://corea-labs.com</Translate></span>
        </div>
      </div>

      {/* Policy Body */}
      <div className="p-6 md:p-10 space-y-8 text-stone-700 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-display font-bold text-stone-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            <span><Translate>제1조 (개인정보의 처리 목적 및 수집 항목)</Translate></span>
          </h2>
          <p>
            <Translate>
              본 사이트는 별도의 회원가입이나 로그인 절차 없이 전 세계 누구나 11개 언어로 대한민국의 문화유산, 전통문화, 추천 명소, 전국 축제, 입국·환전 가이드를 무료로 열람할 수 있는 개방형 정보 서비스입니다. 서비스 품질 향상 및 다국어 트래픽 통계를 위해 다음과 같은 비식별 기술 정보만이 자동으로 생성·수집될 수 있습니다.
            </Translate>
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
            <li>
              <strong><Translate>자동 수집 항목:</Translate></strong>{" "}
              <Translate>접속 브라우저 언어 설정(Locale), 시간대(Timezone) 기반 국가 코드, 기기 유형(모바일/데스크톱/태블릿), 방문 페이지 경로, 유입 경로(Referrer/UTM), 쿠키(Cookie) 및 익명 세션 식별자</Translate>
            </li>
            <li>
              <strong><Translate>수집 목적:</Translate></strong>{" "}
              <Translate>11개국 다국어 자동 번역 최적화, 국가별 인기 관광지·축제 수요 분석, 보안 유지 및 서비스 개선, 맞춤형 광고(Google AdSense) 제공</Translate>
            </li>
            <li>
              <strong><Translate>사용자 참여 콘텐츠(엽서/방명록 등):</Translate></strong>{" "}
              <Translate>이용자가 자발적으로 디지털 엽서 등에 입력한 닉네임 및 메시지는 서비스 화면 표출 목적으로만 이용됩니다.</Translate>
            </li>
          </ul>
        </section>

        {/* Section 2: Google AdSense & Cookies (Crucial for AdSense Review) */}
        <section className="p-5 md:p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
          <h2 className="text-lg font-display font-bold text-stone-900 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-amber-600 shrink-0" />
            <span><Translate>제2조 (Google AdSense 및 제3자 광고 쿠키에 관한 고지)</Translate></span>
          </h2>
          <p>
            <Translate>
              본 사이트(https://corea-labs.com)는 무료 다국어 한국 문화·여행 가이드 아카이브의 지속적인 운영과 서버 유지를 위해 Google LLC가 제공하는 웹 광고 서비스인 Google AdSense(구글 애드센스)를 게재합니다. 이와 관련하여 다음 사항을 명확히 고지합니다.
            </Translate>
          </p>
          <ul className="list-disc pl-5 space-y-2 text-stone-700">
            <li>
              <strong><Translate>제3자 쿠키 사용:</Translate></strong>{" "}
              <Translate>Google을 포함한 제3자 광고 사업자(Third-party vendors)는 쿠키(Advertising Cookies)를 사용하여 이용자가 본 웹사이트 또는 다른 웹사이트에 과거 방문한 기록을 바탕으로 맞춤형 광고를 게재합니다.</Translate>
            </li>
            <li>
              <strong><Translate>광고 쿠키의 역할:</Translate></strong>{" "}
              <Translate>Google의 광고 쿠키 사용을 통해 Google 및 파트너사는 본 사이트와 인터넷상의 다른 사이트 방문 기록을 기반으로 이용자에게 관심사 기반 광고(Personalized Ads)를 제공할 수 있습니다.</Translate>
            </li>
            <li>
              <strong><Translate>맞춤형 광고 거부(Opt-out) 권리:</Translate></strong>{" "}
              <Translate>이용자는 언제든지 Google 광고 설정 페이지에서 맞춤형 광고를 해제할 수 있으며, 또는 미국 디지털 광고 연합(aboutads.info) 페이지에서 제3자 광고 사업자의 맞춤형 광고용 쿠키 사용을 일괄 차단할 수 있습니다.</Translate>
            </li>
          </ul>
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-stone-900 text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              <span><Translate>Google 광고 설정 (맞춤 광고 관리)</Translate></span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
            </a>
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
            >
              <span><Translate>Google 광고 및 쿠키 정책 자세히 보기</Translate></span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            </a>
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
            >
              <span><Translate>AboutAds.info (제3자 쿠키 차단)</Translate></span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            </a>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-display font-bold text-stone-900">
            <Translate>제3조 (쿠키 및 로컬 스토리지의 운용과 거부 방법)</Translate>
          </h2>
          <p>
            <Translate>
              본 사이트는 이용자가 선택한 다국어 설정(11개 언어 중 택1)을 유지하고 쾌적한 웹 환경을 제공하기 위해 브라우저의 쿠키(Cookie)와 로컬 스토리지(localStorage)를 사용합니다. 이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 웹 브라우저 상단의 [설정] → [개인정보 및 보안] → [쿠키 및 기타 사이트 데이터] 메뉴에서 모든 쿠키를 허용하거나 거부할 수 있습니다.
            </Translate>
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-display font-bold text-stone-900">
            <Translate>제4조 (개인정보의 보유 및 제3자 제공)</Translate>
          </h2>
          <p>
            <Translate>
              본 사이트는 이용자의 성명, 주민등록번호, 전화번호, 신용카드 정보 등 민감한 개인식별정보를 수집하거나 저장하지 않습니다. 비식별 통계 데이터는 사이트 트래픽 분석 목적으로만 활용되며 법령에 따른 경우를 제외하고 외부에 판매하거나 부당하게 제공하지 않습니다.
            </Translate>
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-display font-bold text-stone-900">
            <Translate>제5조 (글로벌 이용자의 권리 보장 — GDPR 및 CCPA)</Translate>
          </h2>
          <p>
            <Translate>
              유럽경제지역(EEA), 영국, 캘리포니아 등 전 세계 방문자는 관련 법령(GDPR, CCPA 등)에 따라 자신의 데이터 처리에 대한 투명한 설명을 요구할 권리, 쿠키 동의 철회 및 광고 추적 거부 권리를 가집니다. 브라우저의 데이터 삭제 기능을 통해 언제든지 로컬 데이터를 즉시 삭제하실 수 있습니다.
            </Translate>
          </p>
        </section>

        {/* Section 6 */}
        <section className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
          <h2 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-stone-700" />
            <span><Translate>제6조 (개인정보 보호책임자 및 문의처)</Translate></span>
          </h2>
          <p className="text-xs text-stone-600">
            <Translate>
              개인정보처리방침 및 저작권, 광고 게재와 관련한 문의사항은 아래 공식 연락처로 문의해 주시기 바랍니다.
            </Translate>
          </p>
          <div className="text-xs font-mono text-stone-800 space-y-1 pt-1">
            <div>• <Translate>운영기관: 대한민국 연구소 | Corea Labs (Heritage &amp; Culture Digital Studio)</Translate></div>
            <div>• <Translate>공식 웹사이트: https://corea-labs.com</Translate></div>
            <div>• <Translate>이메일 문의: contact@corea-labs.com</Translate></div>
          </div>
        </section>

        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-stone-500">
            <Translate>본 개인정보처리방침은 2025년 1월 1일부터 시행되며, 2026년 11월 4일 최신화되었습니다.</Translate>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("terms")}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Translate>이용약관 보기 →</Translate>
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Translate>사이트 소개 보기 →</Translate>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function TermsOfServiceContent({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <article className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-8 md:p-10 border-b border-stone-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono mb-4">
          <Scale className="w-3.5 h-3.5" />
          <span>TERMS OF SERVICE · COREA LABS</span>
        </div>
        <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-white">
          <Translate>이용약관 (Terms of Service)</Translate>
        </h1>
        <p className="text-stone-300 text-sm md:text-base mt-3 max-w-3xl leading-relaxed">
          <Translate>
            대한민국 연구소 | Corea Labs (https://corea-labs.com)가 제공하는 다국어 한국 문화·유산·명소·축제·여행 가이드 서비스의 이용 조건과 권리, 책임 사항을 안내합니다.
          </Translate>
        </p>
      </div>

      {/* Terms Body */}
      <div className="p-6 md:p-10 space-y-8 text-stone-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-display font-bold text-stone-900">
            <Translate>제1조 (목적 및 약관의 효력)</Translate>
          </h2>
          <p>
            <Translate>
              본 약관은 대한민국 연구소 | Corea Labs (이하 &quot;사이트&quot;)가 운영하는 웹 플랫폼(https://corea-labs.com)에서 제공하는 모든 디지털 아카이브, 다국어 여행 가이드, 축제 일정, 인터랙티브 문화 콘텐츠의 이용 조건 및 절차를 규정함을 목적으로 합니다. 본 사이트에 접속하여 서비스를 이용함으로써 귀하는 본 이용약관에 동의한 것으로 간주됩니다.
            </Translate>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-display font-bold text-stone-900">
            <Translate>제2조 (제공 서비스의 내용)</Translate>
          </h2>
          <p>
            <Translate>
              사이트는 전 세계 방문객과 한국 문화 연구자를 위해 다음과 같은 큐레이션 정보를 11개 국어로 무료 제공합니다.
            </Translate>
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
            <li><Translate>조선 5대 궁궐 및 유네스코 세계유산 역사·관람 가이드 (Heritage)</Translate></li>
            <li><Translate>한국 전통 의식주(한복, 한식, 한옥) 및 현대 K-컬처 해설 (Culture)</Translate></li>
            <li><Translate>서울, 부산, 경주, 제주, 전주, 강릉 등 전국 핵심 관광 명소 큐레이션 (Places)</Translate></li>
            <li><Translate>봄·여름·가을·겨울 4계절 전국 대표 지역 축제 일정 및 지도 정보 (Festivals)</Translate></li>
            <li><Translate>외국인 관광객을 위한 K-ETA 입국, 환전, WOWPASS·T-Money 교통카드, 긴급 연락처(1330) 가이드 (Travel Guide)</Translate></li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-display font-bold text-stone-900">
            <Translate>제3조 (지식재산권 및 콘텐츠 이용 범위)</Translate>
          </h2>
          <p>
            <Translate>
              본 사이트가 독자적으로 구성한 텍스트, 다국어 번역문, 편집 디자인, 로고 및 데이터베이스에 대한 저작권 및 지식재산권은 Corea Labs 또는 정당한 원저작자에게 귀속됩니다. 이용자는 개인적인 여행 준비, 학술 참고 및 SNS 링크 공유 목적으로 콘텐츠를 자유롭게 열람하고 공유할 수 있으나, 사전 서면 허가 없이 사이트 전체를 무단 복제하여 상업적으로 재배포하는 행위는 금지됩니다.
            </Translate>
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
          <h2 className="text-lg font-display font-bold text-stone-900">
            <Translate>제4조 (여행·축제·출입국 정보의 면책조항)</Translate>
          </h2>
          <p>
            <Translate>
              본 사이트는 공신력 있는 공공 문화재 및 관광 정보를 바탕으로 최신 정보를 제공하기 위해 최선을 다하고 있습니다. 다만 기상 상황, 지자체 및 주관사의 사정, 정부 출입국·비자(K-ETA) 정책 변경, 환율 변동 등에 따라 궁궐 관람 시간이나 축제 세부 일정이 사전 예고 없이 변경될 수 있습니다. 실제 현장 방문 및 항공·숙박 예약 전에는 본 사이트에 함께 안내된 각 기관의 공식 홈페이지나 1330 관광통역안내전화를 통해 최종 확인하시기 바랍니다.
            </Translate>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-display font-bold text-stone-900">
            <Translate>제5조 (광고 게재 및 외부 사이트 연결)</Translate>
          </h2>
          <p>
            <Translate>
              본 사이트는 서비스의 무료 제공 및 운영 유지를 위해 Google AdSense 등 제3자 광고를 화면 내에 게재할 수 있습니다. 광고를 통해 연결되는 외부 웹사이트나 제3자 서비스에서 이루어지는 거래 및 개인정보 처리에 대해서는 해당 외부 사업자의 약관과 정책이 적용됩니다.
            </Translate>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-display font-bold text-stone-900">
            <Translate>제6조 (이용자의 의무 및 건전한 커뮤니티 이용)</Translate>
          </h2>
          <p>
            <Translate>
              이용자는 디지털 엽서 등 참여형 기능 이용 시 타인의 명예를 훼손하거나 불법·음란·스팸성 문구를 게시해서는 안 되며, 사이트의 정상적인 운영을 방해하는 자동화 공격을 해서는 안 됩니다. 부적절한 게시물은 관리자에 의해 사전 통보 없이 삭제될 수 있습니다.
            </Translate>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-display font-bold text-stone-900">
            <Translate>제7조 (준거법 및 개정)</Translate>
          </h2>
          <p>
            <Translate>
              본 약관의 해석 및 적용에 관하여는 대한민국 법령을 준거법으로 합니다. 사이트는 관련 법령이나 서비스 정책 변경에 따라 본 약관을 개정할 수 있으며, 개정 시 본 페이지를 통해 공지합니다.
            </Translate>
          </p>
        </section>

        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-stone-500">
            <Translate>부칙: 본 약관은 2025년 1월 1일부터 시행됩니다.</Translate>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("privacy")}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Translate>개인정보처리방침 보기 →</Translate>
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Translate>사이트 소개 보기 →</Translate>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function AboutSiteContent({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const pillars = [
    {
      id: "heritage",
      icon: BookOpen,
      title: "왕실 문화유산 (Royal Heritage)",
      desc: "경복궁, 창덕궁, 덕수궁, 창경궁, 경희궁 등 조선 5대 궁궐과 종묘·유네스코 세계유산의 건축 미학과 역사적 가치를 고화질 실사 사진과 함께 깊이 있게 해설합니다.",
    },
    {
      id: "culture",
      icon: Sparkles,
      title: "전통과 현대 문화 (Living Culture)",
      desc: "한복(Hanbok)의 선과 색채, 발효 과학이 담긴 한식(Hansik)과 김장 문화, 자연과 조화를 이루는 한옥(Hanok) 등 한국인의 삶 속에 살아 숨 쉬는 문화를 조명합니다.",
    },
    {
      id: "places",
      icon: MapPin,
      title: "엄선된 추천 명소 (Curated Places)",
      desc: "서울, 부산, 경주, 제주도, 전주 한옥마을, 강릉 등 한국을 대표하는 도시별 필수 여행지와 숨은 명소를 위치·핵심 포인트와 함께 큐레이션합니다.",
    },
    {
      id: "festivals",
      icon: CalendarDays,
      title: "전국 4계절 대표 축제 (Seasonal Festivals)",
      desc: "진해군항제, 보령머드축제, 안동국제탈춤페스티벌, 진주남강유등축제, 화천산천어축제 등 사계절 내내 펼쳐지는 대한민국 대표 축제의 일정과 현장을 안내합니다.",
    },
    {
      id: "travel",
      icon: PlaneLanding,
      title: "외국인 실전 입국·환전 가이드 (Traveler Guide)",
      desc: "K-ETA 전자여행허가, WOWPASS 및 환전 팁, T-Money 대중교통 이용법, 공항 eSIM 개통, 1330 24시간 다국어 관광안내까지 외국인 여행자에게 꼭 필요한 실용 정보를 총망라합니다.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-8 md:p-12 border border-stone-800 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-mono">
            <KoreaLogoIcon className="w-4 h-4" />
            <span>ABOUT COREA LABS · ANCIENT SPIRIT, FUTURE VISION</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-tight text-white">
            <Translate>대한민국 연구소 | Corea Labs 소개</Translate>
          </h1>
          <p className="text-stone-300 text-sm md:text-base leading-relaxed">
            <Translate>
              대한민국 연구소(Corea Labs, https://corea-labs.com)는 반만년 역사를 간직한 대한민국의 찬란한 문화유산과 역동적인 사계절 축제, 그리고 외국인 여행자를 위한 실전 가이드를 전 세계 11개 언어로 연결하는 글로벌 디지털 아카이브 스튜디오입니다.
            </Translate>
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("heritage")}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Translate>문화유산 아카이브 탐험하기</Translate>
            </button>
            <button
              onClick={() => setActiveTab("festivals")}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold transition-all cursor-pointer"
            >
              <Translate>전국 4계절 축제 보기</Translate>
            </button>
          </div>
        </div>
      </div>

      {/* Mission & Multilingual Reach */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">
            <Translate>11개 국어 실시간 현지화</Translate>
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            <Translate>
              한국어, 영어, 일본어, 중국어, 태국어, 프랑스어, 스페인어, 포르투갈어, 조지아어, 러시아어, 우크라이나어 등 11개 언어를 지원하여 언어 장벽 없는 한국 여행 준비를 돕습니다.
            </Translate>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">
            <Translate>고화질 실사 아카이브 &amp; 검증된 정보</Translate>
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            <Translate>
              단순한 일러스트가 아닌 실제 궁궐과 명소, 축제 현장의 생생한 실사 사진만을 엄선하며, 관람 시간·주소·대중교통·입장료 등 검증된 실용 데이터를 제공합니다.
            </Translate>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">
            <Translate>문화유산부터 입국 실무까지 원스톱</Translate>
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            <Translate>
              한국의 역사와 미학을 이해하는 인문학적 깊이부터, 당장 공항에서 필요한 K-ETA·환전·교통카드·eSIM 안내까지 한곳에서 해결할 수 있도록 설계되었습니다.
            </Translate>
          </p>
        </div>
      </div>

      {/* 5 Core Content Pillars */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-10 space-y-6 shadow-2xs">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-700 font-bold">
            CORE CURATION ARCHIVE
          </span>
          <h2 className="font-display text-xl md:text-2xl font-bold text-stone-900 mt-1">
            <Translate>Corea Labs 5대 핵심 큐레이션 섹션</Translate>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="p-5 rounded-2xl border border-stone-200/80 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-stone-900 group-hover:text-amber-900">
                      <Translate>{item.title}</Translate>
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  <Translate>{item.desc}</Translate>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editorial Standards & Contact Info */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-10 space-y-4 shadow-2xs">
        <h2 className="font-display text-lg md:text-xl font-bold text-stone-900">
          <Translate>콘텐츠 편집 원칙 및 문의 안내 (Editorial Policy &amp; Contact)</Translate>
        </h2>
        <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
          <Translate>
            대한민국 연구소(Corea Labs)는 외국인 여행자와 한국 문화 애호가들에게 정확하고 신뢰할 수 있는 정보를 전달하기 위해 국가유산청(구 문화재청), 한국관광공사(VisitKorea), 각 지방자치단체의 공식 축제 공고 데이터를 정기적으로 대조·검수합니다. 정보 수정 제안, 지자체 축제 홍보 협력, 또는 광고·제휴 문의는 언제든 환영합니다.
          </Translate>
        </p>
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs font-mono text-stone-700 space-y-1">
          <div>• <Translate>플랫폼 명칭: 대한민국 연구소 | Corea Labs (Heritage Studio)</Translate></div>
          <div>• <Translate>공식 도메인: https://corea-labs.com</Translate></div>
          <div>• <Translate>지원 언어: 11개 국어 (KO, EN, JA, ZH, TH, FR, ES, PT, KA, RU, UK)</Translate></div>
          <div>• <Translate>공식 문의 이메일: contact@corea-labs.com</Translate></div>
        </div>
      </div>
    </div>
  );
}
