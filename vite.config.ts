import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function escapeAttr(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function staticMultiPageSeoPlugin(): Plugin {
  return {
    name: 'corea-labs-static-seo-routes',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const baseIndexPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(baseIndexPath)) return;

      const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');

      const routes: Array<{
        slug: string;
        title: string;
        description: string;
        heading: string;
        lead: string;
        noIndex?: boolean;
      }> = [
        {
          slug: 'festivals',
          title: '27 Best Seasonal Festivals in South Korea (Dates & KTX Transit Guide) | Corea Labs',
          description:
            'Explore South Korea’s 27 seasonal festivals including Jinhae Cherry Blossom, Boryeong Mud, Jinju Lantern, Andong Mask Dance & Hwacheon Ice Festival with Seoul KTX/bus routes.',
          heading: '27 Best Seasonal Festivals in South Korea — Dates & KTX Transit Guide',
          lead: 'Discover spring cherry blossoms in Jinhae and Yeouido, summer Boryeong Mud and Gangneung Danoje, autumn Jinju Namgang Lantern and Andong Mask Dance, and winter Hwacheon Ice Festival with step-by-step KTX and express bus routes from Seoul.',
        },
        {
          slug: 'travel',
          title: 'South Korea Travel Guide for Foreigners: K-ETA, WOWPASS, T-Money & Naver Map | Corea Labs',
          description:
            'Essential South Korea travel survival guide: Incheon Airport AREX, K-ETA deadlines, customs limits, WOWPASS & T-Money transit cards, Naver Map tips, tax refunds & 1330 helpline.',
          heading: 'Essential South Korea Travel Guide: K-ETA, WOWPASS, T-Money & 1330 Helpline',
          lead: 'Complete arrival and navigation manual for foreign travelers visiting South Korea: airport trains, currency exchange, prepaid transit cards, VAT immediate tax refunds, eSIM setup, and 24/7 1330 multilingual support.',
        },
        {
          slug: 'heritage',
          title: 'Seoul 5 Royal Palaces Free Hanbok Entry & UNESCO Heritage Guide | Corea Labs',
          description:
            'Plan your visit to Gyeongbokgung, Changdeokgung Secret Garden, Deoksugung, Changgyeonggung, Jongmyo Shrine & Seokguram Grotto with closed days and free Hanbok admission rules.',
          heading: 'Seoul 5 Grand Joseon Royal Palaces & UNESCO World Heritage Archive',
          lead: 'Explore 600 years of Joseon architecture across Gyeongbokgung (closed Tuesdays), UNESCO Changdeokgung (closed Mondays), Deoksugung, Changgyeonggung, and Gyeonghuigung—plus free entry guidelines when wearing traditional Hanbok.',
        },
        {
          slug: 'places',
          title: 'Best Places & Cities to Visit in South Korea: Seoul, Busan, Jeju, Gyeongju | Corea Labs',
          description:
            'Curated city guides across South Korea: Bukchon Hanok Village in Seoul, Gamcheon Culture Village in Busan, Jeju Island volcanic trails, Gyeongju, Jeonju Hanok Village & Gangneung.',
          heading: 'Best Cities & Places to Visit in South Korea — Regional Travel Itineraries',
          lead: 'Browse curated itineraries spanning Seoul palaces and Bukchon Hanok Village, Busan coastal trails and Jagalchi Market, Jeju Island UNESCO volcanic cones, historic Gyeongju, Jeonju Hanok Village, and Gangneung.',
        },
        {
          slug: 'culture',
          title: 'Traditional Korean Culture Guide: Hanbok, Hansik Cuisine, Hanok & Pansori | Corea Labs',
          description:
            'Discover South Korea’s living traditions: scientific Hangeul alphabet, Hansik fermentation & temple food, Ondol Hanok architecture, UNESCO Pansori, and Hanbok etiquette.',
          heading: 'Traditional Korean Culture Archive: Hangeul, Hansik, Hanok & Living Heritage',
          lead: 'Deep editorial essays exploring King Sejong’s Hangeul alphabet, Kimjang & fermented Hansik cuisine, eco-friendly Ondol Hanok homes, UNESCO Pansori storytelling, and traditional Korean aesthetics.',
        },
        {
          slug: 'qna',
          title: 'South Korea Travel Q&A Forum & 24/7 Multilingual Concierge | Corea Labs',
          description:
            'Ask travel questions about South Korea KTX tickets, cherry blossom dates, SIM cards, vegetarian/Halal dining, and luggage storage in 11 languages.',
          heading: 'Global South Korea Traveler Q&A Board & 24/7 Concierge',
          lead: 'Get instant multilingual answers and community tips on South Korea train bookings, seasonal festival schedules, airport transfers, and local etiquette.',
        },
        {
          slug: 'about',
          title: 'About Corea Labs | Multilingual South Korea Travel & Cultural Heritage Archive',
          description:
            'Learn about Corea Labs (대한민국 연구소), our editorial standards, official data sources (KTO, CHA, KORAIL), and 11-language mission.',
          heading: 'About Corea Labs (대한민국 연구소)',
          lead: 'Corea Labs publishes verified cultural heritage, seasonal festival, and independent transit guides across South Korea in 11 global languages.',
        },
        {
          slug: 'privacy',
          title: 'Privacy Policy | Corea Labs',
          description: 'Privacy Policy, cookie notice, and data handling practices for Corea Labs.',
          heading: 'Privacy Policy — Corea Labs',
          lead: 'Official privacy policy, Google AdSense cookie disclosures, GDPR/CCPA rights, and contact information.',
          noIndex: true,
        },
        {
          slug: 'terms',
          title: 'Terms of Service | Corea Labs',
          description: 'Terms of Service for using Corea Labs.',
          heading: 'Terms of Service — Corea Labs',
          lead: 'Official terms of service for accessing Corea Labs guides and community features.',
          noIndex: true,
        },
      ];

      for (const r of routes) {
        const canonical = `https://corea-labs.com/${r.slug}`;
        let routeHtml = baseHtml
          .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(r.title)}</title>`)
          .replace(/<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i, `<meta name="title" content="${escapeAttr(r.title)}" />`)
          .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeAttr(r.description)}" />`)
          .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`)
          .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`)
          .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeAttr(r.title)}" />`)
          .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeAttr(r.description)}" />`)
          .replace(/<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:url" content="${canonical}" />`)
          .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeAttr(r.title)}" />`)
          .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeAttr(r.description)}" />`)
          .replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, `<h1 style="font-size: 2rem; line-height: 1.25; margin: 0 0 0.75rem 0;">${escapeAttr(r.heading)}</h1>`)
          .replace(/<p style="font-size: 1rem;[\s\S]*?<\/p>/i, `<p style="font-size: 1rem; color: #44403c; margin: 0 0 1rem 0;">${escapeAttr(r.lead)}</p>`);

        if (r.noIndex) {
          routeHtml = routeHtml.replace(
            /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
            `<meta name="robots" content="noindex, follow" />`
          );
        }

        const outDir = path.join(distDir, r.slug);
        fs.mkdirSync(outDir, {recursive: true});
        fs.writeFileSync(path.join(outDir, 'index.html'), routeHtml, 'utf8');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), staticMultiPageSeoPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
