# 간다GO — 서울 출장마사지 지역 안내 사이트

서울 25개 구 · 5대 권역 · 핵심 생활권 25 · 핵심 역세권 30 · 이용 장소 · 예약 전 확인 · 운영 정책으로 구성된
정적 지역 안내 사이트입니다. (약 118개 페이지)

## 빌드

```bash
node build.js
```

의존성 없이 Node.js만으로 **저장소 루트**에 전체 사이트가 생성됩니다
(`index.html`, `seoul/`, `assets/`, `sitemap.xml`, `robots.txt`, `404.html`).

**Cloudflare Pages 배포**: 저장소 연결 후 빌드 명령·출력 디렉터리를 비워두면(기본값 `/`)
루트가 그대로 배포됩니다. 프로덕션 브랜치가 이 저장소의 기본 브랜치와 같은지 확인하세요.

## 배포 전 반드시 변경할 것

`src/data/site.js` 상단 두 값:

| 항목 | 현재 값 | 설명 |
|---|---|---|
| `SITE_URL` | `https://spahaven.pages.dev` | 커스텀 도메인 사용 시 교체 (canonical·og·sitemap·schema에 사용) |
| `TELEGRAM_URL` | `https://t.me/REPLACE_ME` | 푸터 "웹사이트 제작문의 / 제휴문의" 버튼의 텔레그램 링크 |

변경 후 `node build.js`를 다시 실행하면 전체 페이지에 반영됩니다.

## 메인 히어로 이미지

`assets/img/hero.jpg` 경로에 원하는 이미지를 넣으면 메인 히어로와 og:image에 자동으로 노출됩니다.
이미지가 없을 때는 서울 야경 느낌의 SVG 플레이스홀더(`hero-placeholder.svg`)가 대신 표시됩니다.
WebP 사용을 원하면 `src/data/site.js`의 `HERO_IMG` 값을 바꾼 뒤 다시 빌드하세요.

## 구조

```
build.js            정적 사이트 생성기 (Node, 의존성 없음)
src/css/style.css   디자인 토큰(다크 네이비 × 오렌지) + 컴포넌트
src/data/site.js    상호·전화·요금·도메인·텔레그램 설정
src/data/areas.js   5대 권역
src/data/gu.js      25개 구
src/data/life.js    핵심 생활권 25
src/data/station.js 핵심 역세권 30
src/data/use.js     이용 장소 9
src/data/check.js   예약 전 확인 13
src/data/policy.js  운영 기준·정책 6
index.html seoul/ assets/ ...  빌드 결과물 (저장소 루트, 배포 대상)
```

## SEO 원칙 (요약)

- 모든 메타 디스크립션 80자 이내, 페이지별 고유 title/description
- Schema: WebPage · Organization · BreadcrumbList · FAQPage · ImageObject (LocalBusiness/Review/AggregateRating 미사용)
- 출구별·노선별·번호동 페이지 생성 금지, 역명·생활권 기준 1페이지
- 본문은 지역별 생활권 차이를 반영한 고유 콘텐츠, 금지 표현(1위·최저가·VIP 등) 미사용
- sitemap.xml · robots.txt · canonical · breadcrumb · 모바일 우선 · 하단 고정 전화 버튼
