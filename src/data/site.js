// 사이트 전역 설정 — 배포 전 SITE_URL과 TELEGRAM_URL을 실제 값으로 변경하세요.
module.exports = {
  // 실제 도메인으로 교체 필요 (canonical, og:url, sitemap, schema에 사용)
  SITE_URL: process.env.SITE_URL || 'https://spahaven.example.com',
  // 텔레그램 아이디로 교체 필요 (푸터 제작문의·제휴문의 버튼)
  TELEGRAM_URL: process.env.TELEGRAM_URL || 'https://t.me/REPLACE_ME',

  BRAND: '간다GO',
  PHONE: '0508-202-4719',
  PHONE_TEL: 'tel:0508-202-4719',

  MAIN_TITLE: '서울 출장마사지｜강남·잠실·홍대·여의도·성수 홈타이 지역 안내',
  TITLE_SUFFIX: ' | 간다GO',

  HERO_IMG: 'assets/img/hero.jpg', // 메인 히어로 — 이 경로에 이미지를 추가하면 자동 노출
  HERO_ALT: '서울 야경과 한강 도시 전경 배경의 간다GO 방문 케어 안내 이미지',

  PRICING: [
    { name: '60분 코스', price: '90,000', minutes: '60분', note: '기본 컨디션·릴랙스 케어', featured: false },
    { name: '90분 코스', price: '150,000', minutes: '90분', note: '아로마 포함 구성', featured: true },
    { name: '120분 코스', price: '180,000', minutes: '120분', note: '전신 집중 프리미엄 케어', featured: false },
  ],
  PRICING_NOTE: '지역·예약 시간대·이동 거리에 따라 상담 시 최종 확인됩니다.',
};
