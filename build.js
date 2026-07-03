#!/usr/bin/env node
/**
 * 간다GO — 서울 출장마사지 지역 안내 사이트 정적 생성기
 * 사용법: node build.js  →  docs/ 아래에 전체 사이트 생성
 */
const fs = require('fs');
const path = require('path');

const SITE = require('./src/data/site.js');
const AREAS = require('./src/data/areas.js');
const GU = require('./src/data/gu.js');
const LIFE = require('./src/data/life.js');
const STATION = require('./src/data/station.js');
const USE = require('./src/data/use.js');
const CHECK = require('./src/data/check.js');
const POLICY = require('./src/data/policy.js');

const OUT = path.join(__dirname, 'docs');
const warnings = [];

/* ---------------- helpers ---------------- */
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');

function relPrefix(pagePath) {
  // pagePath e.g. 'seoul/gangnam-gu/' → '../../'
  const depth = pagePath.split('/').filter(Boolean).length;
  return '../'.repeat(depth);
}
function resolve(href, prefix) {
  if (/^https?:\/\//.test(href) || href.startsWith('tel:') || href.startsWith('#')) return href;
  return prefix + href;
}
function absUrl(p) {
  return SITE.SITE_URL.replace(/\/$/, '') + '/' + p;
}

const guBy = Object.fromEntries(GU.map((g) => [g.slug, g]));
const areaBy = Object.fromEntries(AREAS.map((a) => [a.slug, a]));
const lifeBy = Object.fromEntries(LIFE.map((l) => [l.slug, l]));

/* ---------------- SVG icons ---------------- */
const PHONE_SVG = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.6 3h2.9l1.4 4.1-2 1.5a13.4 13.4 0 0 0 6.5 6.5l1.5-2 4.1 1.4v2.9c0 1-.8 1.7-1.7 1.6C10.9 18.4 5.6 13.1 5 4.7 4.9 3.8 5.7 3 6.6 3Z" fill="currentColor"/></svg>';
const TG_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.9 4.1 2.9 11.4c-1 .4-1 1.8.1 2.1l4.6 1.4 1.8 5.6c.3 1 1.6 1.2 2.2.4l2.5-3 4.9 3.6c.8.6 2 .1 2.2-.9l2.6-14.9c.2-1.1-.9-2-1.9-1.6ZM8.5 14.4l9.4-6.8c.3-.2.6.2.4.4l-7.6 7.4-.3 3.1-1.9-4.1Z" fill="currentColor"/></svg>';

/* ---------------- shared blocks ---------------- */
function headerHtml(prefix) {
  const guTop = ['gangnam-gu', 'seocho-gu', 'songpa-gu', 'yeongdeungpo-gu', 'mapo-gu', 'yongsan-gu', 'seongdong-gu', 'gangseo-gu'];
  const lifeTop = ['gangnam-yeoksam', 'samseong-seolleung', 'jamsil-songpa', 'hongdae-hapjeong', 'yeouido-yeongdeungpo', 'seongsu-wangsimni', 'yongsan-seoul-station', 'magok-balsan', 'mokdong-yangcheon', 'jongno-gwanghwamun'];
  const stTop = ['gangnam-station', 'jamsil-station', 'hongik-univ-station', 'yeouido-station', 'seoul-station', 'seongsu-station', 'sadang-station', 'nowon-station', 'myeongdong-station', 'gasan-digital-station'];
  const checkTop = ['address', 'building-access', 'apartment-access', 'hotel-policy', 'officetel-rule', 'privacy', 'service-policy'];

  const drop = (items) => items.map((i) => `<a href="${resolve(i.href, prefix)}">${esc(i.text)}</a>`).join('');
  const navItem = (label, href, items) =>
    items
      ? `<div class="nav-item"><span class="nav-link" tabindex="0">${label} ▾</span><div class="drop">${drop(items)}</div></div>`
      : `<div class="nav-item"><a class="nav-link" href="${resolve(href, prefix)}">${label}</a></div>`;

  const areaItems = AREAS.map((a) => ({ href: `seoul/area/${a.slug}/`, text: a.name }));
  const guItems = guTop.map((s) => ({ href: `seoul/${s}/`, text: guBy[s] ? guBy[s].name : s })).concat([{ href: 'seoul/#gu', text: '전체 구 보기' }]);
  const lifeItems = lifeTop.map((s) => ({ href: `seoul/life/${s}/`, text: lifeBy[s] ? lifeBy[s].name : s })).concat([{ href: 'seoul/sitemap/', text: '전체 생활권 보기' }]);
  const stItems = stTop.map((s) => { const st = STATION.find((x) => x.slug === s); return { href: `seoul/station/${s}/`, text: st ? st.name : s }; }).concat([{ href: 'seoul/sitemap/', text: '전체 역세권 보기' }]);
  const useItems = USE.map((u) => ({ href: `seoul/use/${u.slug}/`, text: u.name }));
  const checkItems = checkTop.map((s) => { const c = CHECK.find((x) => x.slug === s); return { href: `seoul/check/${s}/`, text: c ? c.name : s }; });

  const mGroup = (label, items) => `<details><summary>${label}</summary><div class="m-links">${items.map((i) => `<a href="${resolve(i.href, prefix)}">${esc(i.text)}</a>`).join('')}</div></details>`;

  return `<header class="site-header">
  <div class="header-in">
    <a class="logo" href="${resolve('seoul/', prefix)}">간다<span class="go">GO</span> <span class="logo-badge">서울 출장마사지</span></a>
    <nav class="gnb" aria-label="주요 메뉴">
      ${navItem('서울 홈', 'seoul/')}
      ${navItem('권역별 안내', null, areaItems)}
      ${navItem('구별 안내', null, guItems)}
      ${navItem('생활권', null, lifeItems)}
      ${navItem('역세권', null, stItems)}
      ${navItem('이용 장소', null, useItems)}
      ${navItem('예약 전 확인', null, checkItems)}
      ${navItem('문의하기', 'seoul/policy/contact/')}
    </nav>
    <a class="header-tel" href="${SITE.PHONE_TEL}">${PHONE_SVG.replace('viewBox', 'width="15" height="15" viewBox')} ${SITE.PHONE}</a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="mnav" onclick="var m=document.getElementById('mnav');var o=m.classList.toggle('open');this.setAttribute('aria-expanded',o)">메뉴</button>
  </div>
  <div class="mobile-nav" id="mnav">
    <a class="m-single" href="${resolve('seoul/', prefix)}">서울 홈</a>
    ${mGroup('권역별 안내', areaItems)}
    ${mGroup('구별 안내', guItems)}
    ${mGroup('생활권', lifeItems)}
    ${mGroup('역세권', stItems)}
    ${mGroup('이용 장소', useItems)}
    ${mGroup('예약 전 확인', checkItems)}
    <a class="m-single" href="${resolve('seoul/policy/contact/', prefix)}">문의하기</a>
    <a class="m-single" href="${SITE.PHONE_TEL}" style="color:var(--accent-2)">전화 예약 ${SITE.PHONE}</a>
  </div>
</header>`;
}

function footerHtml(prefix) {
  const col = (title, items) =>
    `<div class="footer-col"><h3>${title}</h3><ul>${items.map((i) => `<li><a href="${resolve(i.href, prefix)}">${esc(i.text)}</a></li>`).join('')}</ul></div>`;
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="f-logo">간다<span class="go">GO</span></div>
        <p>서울 25개 구 전 지역 방문형 케어 서비스.<br>생활권·건물 출입·예약 기준을 확인한 뒤 정확하게 안내합니다.</p>
        <a class="f-tel" href="${SITE.PHONE_TEL}">전화예약 ${SITE.PHONE}</a>
        <div class="footer-biz">
          <a class="btn-footer" href="${SITE.TELEGRAM_URL}" target="_blank" rel="noopener nofollow">${TG_SVG} 웹사이트 제작문의</a>
          <a class="btn-footer" href="${SITE.TELEGRAM_URL}" target="_blank" rel="noopener nofollow">${TG_SVG} 제휴문의</a>
        </div>
      </div>
      ${col('지역 안내', [
        { href: 'seoul/', text: '서울 전체 안내' },
        { href: 'seoul/area/gangnam-southeast/', text: '강남·동남권 안내' },
        { href: 'seoul/area/southwest/', text: '서남권 안내' },
        { href: 'seoul/area/northwest/', text: '서북권 안내' },
        { href: 'seoul/area/northeast/', text: '동북권 안내' },
        { href: 'seoul/area/central/', text: '도심·중부권 안내' },
        { href: 'seoul/sitemap/', text: '전체 페이지 보기' },
      ])}
      ${col('이용 안내·정책', [
        { href: 'seoul/check/address/', text: '방문 주소 확인 기준' },
        { href: 'seoul/use/hotel/', text: '호텔·숙소 이용 전 확인' },
        { href: 'seoul/policy/service-standard/', text: '운영 기준' },
        { href: 'seoul/policy/privacy/', text: '개인정보 처리방침' },
        { href: 'seoul/policy/no-illegal-service/', text: '불법·선정적 서비스 불가 안내' },
        { href: 'seoul/policy/author-reviewer/', text: '작성자·검수자 안내' },
        { href: 'seoul/policy/contact/', text: '문의하기' },
      ])}
    </div>
    <div class="footer-bottom">
      <span>상호: ${SITE.BRAND} · 전화예약: ${SITE.PHONE}</span>
      <span>© ${new Date().getFullYear()} ${SITE.BRAND}. 불법·선정적 서비스는 제공하거나 안내하지 않습니다.</span>
    </div>
  </div>
</footer>
<a class="float-call" href="${SITE.PHONE_TEL}" aria-label="전화 예약 ${SITE.PHONE} 바로 연결">${PHONE_SVG}</a>`;
}

function pricingHtml(prefix, regionName) {
  const cards = SITE.PRICING.map((p) => `
      <div class="price-card${p.featured ? ' featured' : ''}">
        ${p.featured ? '<span class="price-badge">추천</span>' : ''}
        <div class="price-name">${esc(p.name)}</div>
        <div class="price-amount">${esc(p.price)}<span class="won">원</span></div>
        <div class="price-min">${esc(p.minutes)}</div>
        <div class="price-note">${esc(p.note)}</div>
        <a class="price-cta" href="${SITE.PHONE_TEL}">예약 문의</a>
      </div>`).join('');
  return `<section class="pricing" id="pricing">
    <h2>이용 코스와 요금 살펴보기</h2>
    <p class="sec-sub">60·90·120분 코스별 기준 요금이며, 추가 비용 없이 있는 그대로 안내해 드립니다.${regionName ? ` ${esc(regionName)} 방문도 동일한 기준이 적용됩니다.` : ''}</p>
    <div class="price-grid">${cards}</div>
    <p class="pricing-foot">${esc(SITE.PRICING_NOTE)} <a href="${resolve('seoul/policy/service-standard/', prefix)}">상세 요금 안내 보기 →</a></p>
  </section>`;
}

const WHW = {
  who: '이 콘텐츠는 서울 지역 방문형 웰니스 서비스 이용 전, 사용자가 위치·건물 출입·숙소 정책·예약 기준을 확인할 수 있도록 작성되었습니다. 서울 25개 구와 주요 생활권, 역세권, 이용 장소 기준을 바탕으로 페이지를 관리합니다.',
  how: '서울시 공식 자치구·행정동 자료, 서울 생활권 구조, 실제 예약 전 확인 항목, 개인정보 처리 기준, 불법·선정적 서비스 불가 원칙을 바탕으로 작성합니다. AI 보조 도구를 사용할 수 있으나, 최종 문구는 사람이 검수하고 중복·과장·허위 표현을 제거합니다.',
  why: '이 페이지의 목적은 검색 순위 조작이 아니라, 서울에서 자택·호텔·오피스텔·업무지구 이용 전 필요한 확인사항을 이해하기 쉽게 안내하는 것입니다. 제공하지 않는 서비스나 불법·선정적 내용을 암시하지 않으며, 방문 가능 여부는 실제 주소와 예약 조건 확인 후 안내합니다.',
};
function whwHtml(prefix) {
  return `<section>
    <h2>이 안내는 누가, 어떻게, 왜 만들었나요</h2>
    <div class="whw">
      <div class="card"><h3><span>Who</span>작성 주체</h3><p>${WHW.who} <a href="${resolve('seoul/policy/author-reviewer/', prefix)}">작성자·검수자 안내 보기</a></p></div>
      <div class="card"><h3><span>How</span>작성 방식</h3><p>${WHW.how} <a href="${resolve('seoul/policy/editorial-policy/', prefix)}">편집 기준 보기</a></p></div>
      <div class="card"><h3><span>Why</span>운영 목적</h3><p>${WHW.why}</p></div>
    </div>
  </section>`;
}

function policyStrip(prefix) {
  return `<div class="policy-strip"><strong>이용 원칙 안내</strong> — 간다GO는 불법·선정적 서비스를 제공하거나 안내하지 않으며, 예약에 필요한 최소한의 개인정보만 확인 후 목적 달성 시 파기합니다.
  <a href="${resolve('seoul/policy/no-illegal-service/', prefix)}">불법·선정적 서비스 불가 안내</a> · <a href="${resolve('seoul/policy/privacy/', prefix)}">개인정보 처리방침</a></div>`;
}

const SHARED_FAQ = [
  { q: '서울 전 지역 방문이 가능한가요?', a: '실제 방문 주소, 가까운 생활권, 예약 가능 시간, 이동 기준을 확인한 뒤 안내합니다. 서울 25개 구 전역이 방문 대상입니다.' },
  { q: '야간 예약은 언제나 가능한가요?', a: '가능 여부를 단정해 안내하지 않습니다. 주소, 이동 거리, 건물 야간 출입, 예약 가능 시간을 확인한 뒤 안내드립니다.' },
  { q: '불법·선정적 서비스도 가능한가요?', a: '불법·선정적 서비스는 제공하거나 안내하지 않습니다. 공개된 60·90·120분 코스 구성이 서비스의 전부입니다.' },
];
function faqHtml(faqs) {
  return `<section>
    <h2>자주 묻는 질문</h2>
    <div class="faq">${faqs.map((f) => `<details><summary>${esc(f.q)}</summary><div class="faq-a">${esc(f.a)}</div></details>`).join('')}</div>
  </section>`;
}

function checklistHtml(name, prefix) {
  const items = [
    '방문 주소를 정확히 확인했나요?',
    `${name ? esc(name) + ' 안에서' : '서울'} 어느 생활권인지 확인했나요?`,
    '가까운 역세권과 인접 지역을 확인했나요?',
    '호텔·숙소라면 객실 방문 가능 여부를 확인했나요?',
    '오피스텔이라면 공동현관과 관리 규정을 확인했나요?',
    '아파트 단지라면 출입 방식을 확인했나요?',
    '예약 가능 시간과 변경 기준을 확인했나요?',
    '개인정보 처리 기준을 확인했나요?',
    '불법·선정적 서비스 불가 안내를 확인했나요?',
  ];
  return `<section>
    <h2>예약 전 체크리스트</h2>
    <ul class="checklist">${items.map((i) => `<li>${i}</li>`).join('')}</ul>
    <p class="muted">항목별 자세한 기준은 <a href="${resolve('seoul/check/address/', prefix)}">방문 주소 확인</a>, <a href="${resolve('seoul/check/building-access/', prefix)}">건물 출입 방식</a>, <a href="${resolve('seoul/check/time/', prefix)}">예약 가능 시간</a> 페이지에서 확인할 수 있습니다.</p>
  </section>`;
}

function ctaBand(prefix, name) {
  return `<section class="cta-band">
    <h2>${name ? esc(name) + ' 방문 예약 문의' : '서울 전 지역 방문 예약 문의'}</h2>
    <p>주소와 건물 출입 방식, 희망 시간을 알려주시면 가능한 시간을 바로 안내드립니다.</p>
    <a class="tel-big" href="${SITE.PHONE_TEL}">${SITE.PHONE}</a>
    <div class="hero-cta" style="justify-content:center">
      <a class="btn btn-primary" href="${SITE.PHONE_TEL}">전화 예약하기</a>
      <a class="btn btn-ghost" href="${resolve('seoul/check/address/', prefix)}">예약 전 확인 보기</a>
    </div>
  </section>`;
}

function relLinks(links, prefix, title) {
  if (!links || !links.length) return '';
  return `<section>
    <h2>${title || '관련 안내 바로가기'}</h2>
    <ul class="rel-links">${links.map((l) => {
      const ext = /^https?:\/\//.test(l.href);
      return `<li style="margin:0;list-style:none"><a href="${resolve(l.href, prefix)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(l.text)}</a></li>`;
    }).join('')}</ul>
  </section>`;
}

/* ---------------- schema ---------------- */
function schemaGraph(page) {
  const url = absUrl(page.path);
  const org = {
    '@type': 'Organization',
    '@id': absUrl('') + '#org',
    name: SITE.BRAND,
    url: absUrl('seoul/'),
    telephone: SITE.PHONE,
    contactPoint: { '@type': 'ContactPoint', telephone: SITE.PHONE, contactType: 'customer service', availableLanguage: 'Korean' },
  };
  const website = {
    '@type': 'WebSite',
    '@id': absUrl('') + '#website',
    url: absUrl('seoul/'),
    name: SITE.MAIN_TITLE,
    publisher: { '@id': absUrl('') + '#org' },
    inLanguage: 'ko-KR',
  };
  const img = {
    '@type': 'ImageObject',
    '@id': url + '#primaryimage',
    url: absUrl(SITE.HERO_IMG),
    caption: SITE.HERO_ALT,
  };
  const webpage = {
    '@type': 'WebPage',
    '@id': url,
    url,
    name: page.title,
    description: page.desc,
    inLanguage: 'ko-KR',
    isPartOf: { '@id': absUrl('') + '#website' },
    primaryImageOfPage: { '@id': url + '#primaryimage' },
  };
  const graph = [org, website, img, webpage];
  if (page.crumbs && page.crumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: page.crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: absUrl(c.path),
      })),
    });
  }
  if (page.faqs && page.faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

/* ---------------- page shell ---------------- */
function shell(page, bodyHtml) {
  const prefix = relPrefix(page.path);
  const url = absUrl(page.path);
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow'}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ko_KR">
<meta property="og:site_name" content="${esc(SITE.BRAND)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${absUrl(SITE.HERO_IMG)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" as="image" href="${prefix}${SITE.HERO_IMG}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='46' fill='%23f97316'/%3E%3Ctext x='50' y='66' font-size='46' font-weight='900' text-anchor='middle' fill='%230a0f1e' font-family='sans-serif'%3EGO%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="${prefix}assets/css/style.css">
<script type="application/ld+json">${schemaGraph(page)}</script>
</head>
<body>
${headerHtml(prefix)}
<main class="wrap">
${page.crumbs && page.crumbs.length > 1 ? `<ol class="breadcrumb">${page.crumbs.map((c, i) => i === page.crumbs.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${resolve(c.path, prefix)}">${esc(c.name)}</a></li>`).join('')}</ol>` : ''}
${bodyHtml}
</main>
${footerHtml(prefix)}
</body>
</html>`;
}

/* ---------------- region page template (gu / life / station / area) ---------------- */
function regionBody(page, d) {
  const prefix = relPrefix(page.path);
  const stationChips = (d.stations || []).map((s) => `<li style="margin:0"><a href="${resolve(`seoul/station/${s.slug}/`, prefix)}">${esc(s.name)} 주변 이용 기준 보기</a></li>`).join('');
  const noteDefs = [
    ['hotel', '호텔·숙소 이용 전 확인', 'seoul/use/hotel/'],
    ['officetel', '오피스텔 이용 전 확인', 'seoul/use/officetel/'],
    ['apartment', '아파트·자택 이용 전 확인', 'seoul/use/apartment/'],
    ['night', '야간 예약 전 확인', 'seoul/use/night/'],
  ].filter(([k]) => d.notes && d.notes[k]);

  const guCards = d.gus
    ? `<section><h2>${esc(d.name)} 소속 자치구 안내</h2><div class="grid cols-4">${d.gus.map((s) => { const g = guBy[s]; return g ? `<a class="card" href="${resolve(`seoul/${g.slug}/`, prefix)}"><span class="card-t">${esc(g.name)}</span><span class="card-d">${esc(g.hoods.slice(0, 3).map((h) => h.name).join(' · '))}</span><span class="card-arrow">안내 보기 →</span></a>` : ''; }).join('')}</div></section>`
    : '';

  return `
<div class="page-head">
  <h1>${esc(d.h1)}</h1>
  <p class="lead">${esc(d.intro)}</p>
</div>

${pricingHtml(prefix, d.name)}

<section>
  <h2>${esc(d.name)}${page.path.startsWith('seoul/station/') ? ' 주변' : ''} 생활권 특징</h2>
  <p>${esc(d.character)}</p>
  ${d.hoods && d.hoods.length ? `<ul class="hood-list">${d.hoods.map((h) => `<li><span class="hood-n">${esc(h.name)}</span><span class="hood-d">${esc(h.d)}</span></li>`).join('')}</ul>` : ''}
</section>

<section>
  <h2>${page.path.startsWith('seoul/station/') ? `${esc(d.name)} 주변 도보권과 이동 기준` : '가까운 역세권과 이동 기준'}</h2>
  <p>${esc(d.moving)}</p>
  ${stationChips ? `<ul class="rel-links">${stationChips}</ul>` : ''}
</section>

${guCards}

${noteDefs.length ? `<section>
  <h2>이용 장소별 확인사항</h2>
  <div class="note-cards">
    ${noteDefs.map(([k, t, href]) => `<div class="card"><h3>${t}</h3><p>${esc(d.notes[k])} <a href="${resolve(href, prefix)}">자세히 보기</a></p></div>`).join('')}
  </div>
</section>` : ''}

${checklistHtml(d.name, prefix)}

${policyStrip(prefix)}

${faqHtml(page.faqs)}

${whwHtml(prefix)}

${relLinks(d.links, prefix, '관련 지역·기준 보기')}

${ctaBand(prefix, d.name)}
`;
}

/* ---------------- topic page template (use / check / policy) ---------------- */
function topicBody(page, d, opts = {}) {
  const prefix = relPrefix(page.path);
  return `
<div class="page-head">
  <h1>${esc(d.h1)}</h1>
  <p class="lead">${esc(d.intro)}</p>
</div>

${d.sections.map((s) => `<section><h2>${esc(s.h2)}</h2><p>${esc(s.body)}</p></section>`).join('')}

${d.checklist && d.checklist.length ? `<section><h2>핵심 체크리스트</h2><ul class="checklist">${d.checklist.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></section>` : ''}

${opts.pricing ? pricingHtml(prefix) : ''}

${policyStrip(prefix)}

${faqHtml(page.faqs)}

${whwHtml(prefix)}

${relLinks(d.links, prefix)}

${ctaBand(prefix)}
`;
}

/* ---------------- main page ---------------- */
function mainBody(page) {
  const prefix = relPrefix(page.path);
  const areaCards = AREAS.map((a) => `<a class="card" href="${resolve(`seoul/area/${a.slug}/`, prefix)}"><span class="card-t">${esc(a.name)}</span><span class="card-d">${esc(a.gus.map((g) => (guBy[g] ? guBy[g].name : g)).join(' · '))}</span><span class="card-arrow">권역 안내 보기 →</span></a>`).join('');
  const guCards = GU.map((g) => `<a class="card" href="${resolve(`seoul/${g.slug}/`, prefix)}"><span class="card-t">${esc(g.name)}</span><span class="card-d">${esc(g.hoods.slice(0, 3).map((h) => h.name).join(' · '))}</span></a>`).join('');
  const lifeTop = ['gangnam-yeoksam', 'samseong-seolleung', 'jamsil-songpa', 'hongdae-hapjeong', 'yeouido-yeongdeungpo', 'seongsu-wangsimni', 'yongsan-seoul-station', 'magok-balsan', 'mokdong-yangcheon', 'jongno-gwanghwamun'];
  const lifeChips = lifeTop.map((s) => { const l = lifeBy[s]; return l ? `<li><a href="${resolve(`seoul/life/${s}/`, prefix)}">${esc(l.name)}</a></li>` : ''; }).join('');
  const useCards = USE.map((u) => `<a class="card" href="${resolve(`seoul/use/${u.slug}/`, prefix)}"><span class="card-t">${esc(u.name)}</span><span class="card-d">${esc(u.h1.replace(/^서울 /, '').replace(/ 출장마사지/, ''))}</span></a>`).join('');
  const stationChips = STATION.slice(0, 14).map((s) => `<li><a href="${resolve(`seoul/station/${s.slug}/`, prefix)}">${esc(s.name)}</a></li>`).join('');

  return `
<div class="hero" style="background-image:linear-gradient(105deg, rgba(10,15,30,.93) 30%, rgba(10,15,30,.55) 62%, rgba(249,115,22,.14)), url('${prefix}${SITE.HERO_IMG}'), url('${prefix}assets/img/hero-placeholder.svg')" role="img" aria-label="${esc(SITE.HERO_ALT)}">
  <div class="hero-in">
    <span class="eyebrow">간다GO · 서울 전 지역 방문 케어</span>
    <h1>서울 출장마사지 · 생활권별 방문 가능 지역 안내</h1>
    <p class="lead">강남, 잠실, 홍대, 여의도, 성수, 용산, 목동, 마곡 등 서울 주요 생활권과 자택·호텔·오피스텔 이용 전 확인사항을 안내합니다.</p>
    <div class="hero-cta">
      <a class="btn btn-primary" href="${SITE.PHONE_TEL}">전화 예약 ${SITE.PHONE}</a>
      <a class="btn btn-ghost" href="#areas">권역별 안내 보기</a>
      <a class="btn btn-ghost" href="${resolve('seoul/check/address/', prefix)}">예약 전 확인</a>
    </div>
  </div>
</div>

<section>
  <h2>서울은 구 이름보다 생활권 확인이 먼저입니다</h2>
  <p>서울은 25개 자치구와 427개 행정동으로 구성되어 있지만, 실제 이용 기준은 행정구역보다 생활권 차이가 더 큽니다. 강남역, 잠실, 홍대, 여의도, 성수, 서울역, 마곡처럼 숙소·오피스텔·업무지구·주거지 환경이 서로 다르기 때문에 이 사이트는 구별 안내와 생활권 안내를 함께 제공합니다. 예를 들어 같은 강남구라도 테헤란로 비즈니스호텔과 대치동 아파트 단지는 건물 출입 방식과 방문 가능 시간대가 다르고, 마포구 안에서도 홍대 관광 숙소와 상암 업무지구 오피스텔은 확인해야 할 항목이 다릅니다. 예약 전에는 머무는 곳의 정확한 주소와 건물 유형을 먼저 확인해 주세요. 자치구·행정동 구조에 대한 공식 정보는 <a href="https://www.seoul.go.kr" target="_blank" rel="noopener">서울특별시 공식 누리집</a>에서 확인할 수 있습니다.</p>
</section>

${pricingHtml(prefix)}

<section id="areas">
  <div class="sec-head"><h2>서울 5대 생활권 안내</h2></div>
  <div class="grid cols-3">${areaCards}</div>
</section>

<section id="gu">
  <div class="sec-head"><h2>서울 25개 구 안내</h2><a class="more" href="${resolve('seoul/sitemap/', prefix)}">전체 페이지 보기 →</a></div>
  <div class="grid cols-5">${guCards}</div>
</section>

<section>
  <h2>핵심 생활권 바로가기</h2>
  <ul class="chips">${lifeChips}</ul>
</section>

<section>
  <h2>주요 역세권 바로가기</h2>
  <ul class="chips">${stationChips}</ul>
</section>

<section>
  <h2>이용 장소별 확인 기준</h2>
  <div class="grid cols-3">${useCards}</div>
</section>

${checklistHtml('', prefix)}

${policyStrip(prefix)}

${faqHtml(page.faqs)}

${whwHtml(prefix)}

${ctaBand(prefix)}
`;
}

/* ---------------- build pages ---------------- */
function writePage(page, body) {
  if (page.desc && page.desc.length > 80) warnings.push(`DESC>80 (${page.desc.length}) ${page.path}`);
  const html = shell(page, body);
  if (!page.noindex && page.countText !== false) {
    const textLen = stripTags(body).length;
    if (textLen < 1600) warnings.push(`SHORT BODY (${textLen}) ${page.path}`);
  }
  const dir = path.join(OUT, page.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  return page;
}

const pages = [];
const crumbSeoul = { name: '서울 출장마사지', path: 'seoul/' };

// main
pages.push(writePage.call(null, ...(() => {
  const page = {
    path: 'seoul/',
    title: SITE.MAIN_TITLE,
    desc: '서울 전 지역 출장마사지·홈타이 간다GO. 강남·잠실·홍대·여의도·성수 생활권별 방문 안내.',
    crumbs: [crumbSeoul],
    faqs: [
      SHARED_FAQ[0],
      { q: '서울은 구별로 찾는 것이 좋나요, 생활권으로 찾는 것이 좋나요?', a: '서울은 같은 구 안에서도 업무지구, 주거지, 숙소 인접권이 다르므로 구와 생활권을 함께 확인하는 것이 좋습니다.' },
      { q: '호텔이나 숙소에서도 이용할 수 있나요?', a: '숙소 정책, 객실 출입 가능 여부, 프런트 확인 방식, 예약자명, 야간 출입 가능 여부를 먼저 확인해야 합니다.' },
      { q: '오피스텔 이용 시 어떤 점이 중요한가요?', a: '공동현관, 엘리베이터, 경비실, 주차, 관리 규정, 방문 가능 시간대를 확인해야 합니다.' },
      SHARED_FAQ[1],
      SHARED_FAQ[2],
    ],
  };
  return [page, mainBody(page)];
})()));

// areas
for (const a of AREAS) {
  const page = {
    path: `seoul/area/${a.slug}/`,
    title: `${a.h1} | ${SITE.BRAND}`,
    desc: a.desc,
    crumbs: [crumbSeoul, { name: '권역별 안내', path: 'seoul/' }, { name: a.name, path: `seoul/area/${a.slug}/` }],
    faqs: [...a.faq, SHARED_FAQ[1], SHARED_FAQ[2]],
  };
  pages.push(writePage(page, regionBody(page, a)));
}

// gu
for (const g of GU) {
  const area = areaBy[g.area];
  const page = {
    path: `seoul/${g.slug}/`,
    title: `${g.h1} | ${SITE.BRAND}`,
    desc: g.desc,
    crumbs: [crumbSeoul, ...(area ? [{ name: area.name, path: `seoul/area/${area.slug}/` }] : []), { name: g.name, path: `seoul/${g.slug}/` }],
    faqs: [...g.faq, SHARED_FAQ[0], SHARED_FAQ[2]],
  };
  pages.push(writePage(page, regionBody(page, g)));
}

// life
for (const l of LIFE) {
  const g = guBy[l.gu];
  const page = {
    path: `seoul/life/${l.slug}/`,
    title: `${l.h1} | ${SITE.BRAND}`,
    desc: l.desc,
    crumbs: [crumbSeoul, ...(g ? [{ name: g.name, path: `seoul/${g.slug}/` }] : []), { name: l.name, path: `seoul/life/${l.slug}/` }],
    faqs: [...l.faq, SHARED_FAQ[1], SHARED_FAQ[2]],
  };
  pages.push(writePage(page, regionBody(page, l)));
}

// station
for (const s of STATION) {
  const g = guBy[s.gu];
  const page = {
    path: `seoul/station/${s.slug}/`,
    title: `${s.h1} | ${SITE.BRAND}`,
    desc: s.desc,
    crumbs: [crumbSeoul, ...(g ? [{ name: g.name, path: `seoul/${g.slug}/` }] : []), { name: s.name, path: `seoul/station/${s.slug}/` }],
    faqs: [...s.faq, SHARED_FAQ[0], SHARED_FAQ[2]],
  };
  const d = { ...s, hoods: s.hoods || [], stations: s.stations || (s.life && lifeBy[s.life] ? [] : []) };
  // 역세권 페이지는 관련 생활권 링크를 이동 섹션에 노출
  pages.push(writePage(page, regionBody(page, d)));
}

// use
for (const u of USE) {
  const page = {
    path: `seoul/use/${u.slug}/`,
    title: `${u.h1} | ${SITE.BRAND}`,
    desc: u.desc,
    crumbs: [crumbSeoul, { name: '이용 장소', path: 'seoul/' }, { name: u.name, path: `seoul/use/${u.slug}/` }],
    faqs: [...u.faq, SHARED_FAQ[2]],
  };
  pages.push(writePage(page, topicBody(page, u, { pricing: true })));
}

// check
for (const c of CHECK) {
  const page = {
    path: `seoul/check/${c.slug}/`,
    title: `${c.h1} | ${SITE.BRAND}`,
    desc: c.desc,
    crumbs: [crumbSeoul, { name: '예약 전 확인', path: 'seoul/' }, { name: c.name, path: `seoul/check/${c.slug}/` }],
    faqs: [...c.faq, SHARED_FAQ[2]],
  };
  pages.push(writePage(page, topicBody(page, c)));
}

// policy
for (const p of POLICY) {
  const page = {
    path: `seoul/policy/${p.slug}/`,
    title: `${p.h1} | ${SITE.BRAND}`,
    desc: p.desc,
    crumbs: [crumbSeoul, { name: '운영 기준·정책', path: 'seoul/' }, { name: p.name, path: `seoul/policy/${p.slug}/` }],
    faqs: p.faq,
    countText: false,
  };
  pages.push(writePage(page, topicBody(page, p)));
}

// HTML sitemap page
(() => {
  const prefix = relPrefix('seoul/sitemap/');
  const group = (title, items) => `<section><h2>${title}</h2><ul class="chips">${items.map((i) => `<li><a href="${resolve(i.href, prefix)}">${esc(i.text)}</a></li>`).join('')}</ul></section>`;
  const body = `
<div class="page-head"><h1>사이트맵 · 전체 페이지 안내</h1>
<p class="lead">간다GO 서울 출장마사지 안내 사이트의 전체 페이지 목록입니다. 권역, 자치구, 생활권, 역세권, 이용 장소, 예약 전 확인, 운영 정책 순서로 정리했습니다.</p></div>
${group('서울 5대 권역', AREAS.map((a) => ({ href: `seoul/area/${a.slug}/`, text: a.name })))}
${group('서울 25개 구', GU.map((g) => ({ href: `seoul/${g.slug}/`, text: g.name })))}
${group('핵심 생활권', LIFE.map((l) => ({ href: `seoul/life/${l.slug}/`, text: l.name })))}
${group('핵심 역세권', STATION.map((s) => ({ href: `seoul/station/${s.slug}/`, text: s.name })))}
${group('이용 장소', USE.map((u) => ({ href: `seoul/use/${u.slug}/`, text: u.name })))}
${group('예약 전 확인', CHECK.map((c) => ({ href: `seoul/check/${c.slug}/`, text: c.name })))}
${group('운영 기준·정책', POLICY.map((p) => ({ href: `seoul/policy/${p.slug}/`, text: p.name })))}
${ctaBand(prefix)}
`;
  pages.push(writePage({
    path: 'seoul/sitemap/',
    title: `사이트맵 · 전체 페이지 안내 | ${SITE.BRAND}`,
    desc: '간다GO 서울 출장마사지 안내 전체 페이지 목록. 권역·구·생활권·역세권·이용 기준.',
    crumbs: [crumbSeoul, { name: '사이트맵', path: 'seoul/sitemap/' }],
    faqs: [],
    countText: false,
  }, body));
})();

/* ---------------- root redirect / 404 ---------------- */
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<title>${esc(SITE.MAIN_TITLE)}</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${absUrl('seoul/')}">
<meta http-equiv="refresh" content="0; url=seoul/">
</head><body><p><a href="seoul/">서울 출장마사지 안내로 이동</a></p>
<script>location.replace('seoul/');</script></body></html>`);

(() => {
  const page = {
    path: '404/', title: `페이지를 찾을 수 없습니다 | ${SITE.BRAND}`,
    desc: '요청하신 페이지를 찾을 수 없습니다. 서울 전체 안내 또는 사이트맵을 이용해 주세요.',
    crumbs: [crumbSeoul], faqs: [], noindex: true, countText: false,
  };
  const prefix = relPrefix(page.path);
  const body = `<div class="page-head"><h1>페이지를 찾을 수 없습니다</h1>
<p class="lead">주소가 바뀌었거나 삭제된 페이지입니다. 아래 메뉴에서 원하는 지역과 안내를 찾아보세요.</p></div>
<div class="hero-cta">
  <a class="btn btn-primary" href="${resolve('seoul/', prefix)}">서울 전체 안내</a>
  <a class="btn btn-ghost" href="${resolve('seoul/sitemap/', prefix)}">전체 페이지 보기</a>
  <a class="btn btn-ghost" href="${SITE.PHONE_TEL}">전화 문의 ${SITE.PHONE}</a>
</div>`;
  const html = shell(page, body);
  fs.writeFileSync(path.join(OUT, '404.html'), html.replace(/href="\.\.\//g, 'href="/').replace(/src="\.\.\//g, 'src="/').replace(/url\('\.\.\//g, "url('/"));
})();

/* ---------------- robots.txt / sitemap.xml ---------------- */
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${absUrl('sitemap.xml')}
`);

const today = new Date().toISOString().slice(0, 10);
const urlset = pages.filter((p) => !p.noindex).map((p) => {
  const pri = p.path === 'seoul/' ? '1.0' : p.path.startsWith('seoul/area/') ? '0.9' : p.path.startsWith('seoul/policy/') || p.path === 'seoul/sitemap/' ? '0.4' : '0.7';
  return `  <url><loc>${absUrl(p.path)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${pri}</priority></url>`;
}).join('\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`);

/* ---------------- assets ---------------- */
fs.mkdirSync(path.join(OUT, 'assets/css'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets/img'), { recursive: true });
fs.copyFileSync(path.join(__dirname, 'src/css/style.css'), path.join(OUT, 'assets/css/style.css'));

// 히어로 플레이스홀더(사용자 이미지 hero.jpg를 assets/img/에 넣으면 자동으로 그 이미지가 노출됨)
fs.writeFileSync(path.join(OUT, 'assets/img/hero-placeholder.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101a35"/><stop offset="1" stop-color="#0a0f1e"/></linearGradient>
<linearGradient id="glow" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f97316" stop-opacity="0"/><stop offset="1" stop-color="#f97316" stop-opacity=".35"/></linearGradient>
</defs>
<rect width="1600" height="700" fill="url(#sky)"/>
<rect width="1600" height="700" fill="url(#glow)" opacity=".5"/>
<g fill="#182240">
<rect x="950" y="260" width="90" height="440"/><rect x="1060" y="180" width="120" height="520"/><rect x="1200" y="300" width="80" height="400"/><rect x="1300" y="220" width="110" height="480"/><rect x="1430" y="340" width="90" height="360"/><rect x="850" y="380" width="80" height="320"/>
</g>
<g fill="#f97316" opacity=".55">
<rect x="1075" y="210" width="10" height="10"/><rect x="1105" y="250" width="10" height="10"/><rect x="1135" y="210" width="10" height="10"/><rect x="1320" y="250" width="10" height="10"/><rect x="1350" y="300" width="10" height="10"/><rect x="965" y="300" width="10" height="10"/><rect x="1215" y="330" width="10" height="10"/><rect x="1445" y="370" width="10" height="10"/>
</g>
<g fill="#d9b36c" opacity=".35">
<rect x="1105" y="320" width="10" height="10"/><rect x="1335" y="380" width="10" height="10"/><rect x="995" y="360" width="10" height="10"/><rect x="1245" y="420" width="10" height="10"/>
</g>
</svg>`);

/* ---------------- report ---------------- */
console.log(`generated ${pages.length} pages + root redirect + 404 + sitemap.xml + robots.txt → docs/`);
if (warnings.length) {
  console.log('\n[warnings]');
  warnings.forEach((w) => console.log(' -', w));
} else {
  console.log('no warnings');
}
