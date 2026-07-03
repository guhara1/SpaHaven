// 구별 행정동 안내 데이터
// 원칙: 번호 행정동(역삼1동·역삼2동 등)은 대표동 1개로 통합 표기.
// 개별 동 페이지는 만들지 않고(도어웨이 방지), 관련 생활권·역세권 페이지가 있을 때만 링크(l)로 연결.
module.exports = {
  'gangnam-gu': [
    { n: '역삼동', l: 'seoul/life/gangnam-yeoksam/' },
    { n: '삼성동', l: 'seoul/life/samseong-seolleung/' },
    { n: '대치동' },
    { n: '논현동', l: 'seoul/life/nonhyeon-sinsa/' },
    { n: '신사동', l: 'seoul/life/nonhyeon-sinsa/' },
    { n: '압구정동', l: 'seoul/life/cheongdam-apgujeong/' },
    { n: '청담동', l: 'seoul/life/cheongdam-apgujeong/' },
    { n: '도곡동' }, { n: '개포동' }, { n: '일원동' }, { n: '수서동' }, { n: '세곡동' },
  ],
  'seocho-gu': [
    { n: '서초동', l: 'seoul/life/seocho-gyodae/' },
    { n: '반포동', l: 'seoul/life/banpo-terminal/' },
    { n: '잠원동' },
    { n: '방배동', l: 'seoul/life/sadang-isu/' },
    { n: '양재동' }, { n: '우면동' }, { n: '내곡동' },
  ],
  'songpa-gu': [
    { n: '잠실동', l: 'seoul/life/jamsil-songpa/' },
    { n: '신천동', l: 'seoul/life/jamsil-songpa/' },
    { n: '송파동' },
    { n: '문정동', l: 'seoul/life/munjeong-garak/' },
    { n: '가락동', l: 'seoul/life/munjeong-garak/' },
    { n: '방이동' }, { n: '석촌동' }, { n: '삼전동' }, { n: '풍납동' },
    { n: '오금동' }, { n: '장지동' }, { n: '거여동' }, { n: '마천동' }, { n: '위례동' },
  ],
  'gangdong-gu': [
    { n: '천호동' }, { n: '성내동' }, { n: '길동' }, { n: '둔촌동' },
    { n: '암사동' }, { n: '명일동' }, { n: '고덕동' }, { n: '상일동' }, { n: '강일동' },
  ],
  'yeongdeungpo-gu': [
    { n: '여의도동', l: 'seoul/life/yeouido-yeongdeungpo/' },
    { n: '영등포동', l: 'seoul/life/yeouido-yeongdeungpo/' },
    { n: '당산동', l: 'seoul/life/mullae-dangsan/' },
    { n: '문래동', l: 'seoul/life/mullae-dangsan/' },
    { n: '양평동' }, { n: '신길동' }, { n: '대림동' }, { n: '도림동' },
  ],
  'guro-gu': [
    { n: '구로동', l: 'seoul/life/gudi-gadi/' },
    { n: '신도림동' }, { n: '고척동' }, { n: '개봉동' }, { n: '오류동' },
    { n: '가리봉동' }, { n: '궁동' }, { n: '온수동' }, { n: '천왕동' }, { n: '항동' },
  ],
  'geumcheon-gu': [
    { n: '가산동', l: 'seoul/life/gudi-gadi/' },
    { n: '독산동' }, { n: '시흥동' },
  ],
  'gwanak-gu': [
    { n: '신림동', l: 'seoul/life/sillim-seoul-univ/' },
    { n: '봉천동', l: 'seoul/life/sillim-seoul-univ/' },
    { n: '남현동' }, { n: '낙성대동' }, { n: '대학동' }, { n: '난곡동' }, { n: '조원동' }, { n: '행운동' },
  ],
  'dongjak-gu': [
    { n: '사당동', l: 'seoul/life/sadang-isu/' },
    { n: '노량진동' }, { n: '상도동' }, { n: '흑석동' },
    { n: '대방동' }, { n: '신대방동' }, { n: '동작동' },
  ],
  'yangcheon-gu': [
    { n: '목동', l: 'seoul/life/mokdong-yangcheon/' },
    { n: '신정동' }, { n: '신월동' },
  ],
  'gangseo-gu': [
    { n: '마곡동', l: 'seoul/life/magok-balsan/' },
    { n: '발산동', l: 'seoul/life/magok-balsan/' },
    { n: '화곡동' }, { n: '등촌동' }, { n: '가양동' }, { n: '염창동' },
    { n: '우장산동' }, { n: '방화동' }, { n: '공항동' },
  ],
  'mapo-gu': [
    { n: '서교동', l: 'seoul/life/hongdae-hapjeong/' },
    { n: '합정동', l: 'seoul/life/hongdae-hapjeong/' },
    { n: '연남동' }, { n: '망원동' }, { n: '성산동' },
    { n: '상암동' },
    { n: '공덕동', l: 'seoul/life/gongdeok-mapo/' },
    { n: '도화동' }, { n: '아현동' }, { n: '대흥동' }, { n: '용강동' },
    { n: '염리동' }, { n: '신수동' }, { n: '서강동' }, { n: '상수동' },
  ],
  'seodaemun-gu': [
    { n: '신촌동' }, { n: '대현동' }, { n: '연희동' }, { n: '충현동' }, { n: '천연동' },
    { n: '홍제동' }, { n: '홍은동' }, { n: '남가좌동' }, { n: '북가좌동' },
  ],
  'eunpyeong-gu': [
    { n: '대조동', l: 'seoul/life/yeonsinnae-eunpyeong/' },
    { n: '불광동', l: 'seoul/life/yeonsinnae-eunpyeong/' },
    { n: '응암동' }, { n: '녹번동' }, { n: '갈현동' }, { n: '역촌동' },
    { n: '신사동' }, { n: '증산동' }, { n: '수색동' }, { n: '진관동' },
  ],
  'seongdong-gu': [
    { n: '성수동', l: 'seoul/life/seongsu-wangsimni/' },
    { n: '왕십리도선동', l: 'seoul/life/seongsu-wangsimni/' },
    { n: '행당동' }, { n: '금호동' }, { n: '옥수동' },
    { n: '마장동' }, { n: '사근동' }, { n: '송정동' }, { n: '용답동' },
  ],
  'gwangjin-gu': [
    { n: '화양동', l: 'seoul/life/kondae-gwangjin/' },
    { n: '자양동', l: 'seoul/life/kondae-gwangjin/' },
    { n: '구의동' }, { n: '광장동' }, { n: '군자동' }, { n: '중곡동' }, { n: '능동' },
  ],
  'dongdaemun-gu': [
    { n: '청량리동' }, { n: '회기동' }, { n: '전농동' }, { n: '답십리동' },
    { n: '장안동' }, { n: '이문동' }, { n: '휘경동' }, { n: '제기동' }, { n: '용신동' },
  ],
  'jungnang-gu': [
    { n: '상봉동' }, { n: '면목동' }, { n: '중화동' }, { n: '묵동' }, { n: '망우동' }, { n: '신내동' },
  ],
  'nowon-gu': [
    { n: '상계동', l: 'seoul/life/nowon-sanggye/' },
    { n: '중계동' }, { n: '하계동' }, { n: '공릉동' }, { n: '월계동' },
  ],
  'dobong-gu': [
    { n: '창동' }, { n: '쌍문동' }, { n: '방학동' }, { n: '도봉동' },
  ],
  'gangbuk-gu': [
    { n: '수유동' }, { n: '미아동' }, { n: '번동' }, { n: '삼양동' }, { n: '우이동' }, { n: '인수동' },
  ],
  'seongbuk-gu': [
    { n: '동선동' }, { n: '돈암동' }, { n: '길음동' }, { n: '정릉동' },
    { n: '안암동' }, { n: '종암동' }, { n: '월곡동' }, { n: '장위동' }, { n: '석관동' }, { n: '보문동' },
  ],
  'jongno-gu': [
    { n: '세종로', l: 'seoul/life/jongno-gwanghwamun/' },
    { n: '종로1·2·3·4가동', l: 'seoul/life/jongno-gwanghwamun/' },
    { n: '사직동' }, { n: '삼청동' }, { n: '가회동' }, { n: '혜화동' },
    { n: '이화동' }, { n: '창신동' }, { n: '숭인동' }, { n: '부암동' }, { n: '평창동' }, { n: '무악동' },
  ],
  'jung-gu': [
    { n: '명동', l: 'seoul/life/myeongdong-euljiro/' },
    { n: '을지로동', l: 'seoul/life/myeongdong-euljiro/' },
    { n: '회현동' }, { n: '소공동' }, { n: '필동' }, { n: '장충동' }, { n: '광희동' },
    { n: '신당동' }, { n: '황학동' }, { n: '다산동' }, { n: '약수동' }, { n: '중림동' },
  ],
  'yongsan-gu': [
    { n: '한남동', l: 'seoul/life/hannam-itaewon/' },
    { n: '이태원동', l: 'seoul/life/hannam-itaewon/' },
    { n: '용산동', l: 'seoul/life/yongsan-seoul-station/' },
    { n: '이촌동' }, { n: '서빙고동' }, { n: '보광동' },
    { n: '청파동' }, { n: '원효로동' }, { n: '효창동' }, { n: '후암동' }, { n: '남영동' },
  ],
};
