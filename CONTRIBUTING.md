# NetworkBook 챕터 작성 가이드

## 기여물의 라이선스

기여하는 코드는 MIT, 교재 콘텐츠는 CC BY 4.0으로 제공하는 데 동의해야 합니다. HTML 안에 코드와 콘텐츠가 함께 있어도 각 부분에 해당하는 라이선스를 적용합니다. 적용 범위는 [라이선스 안내](LICENSE.md)를 참고하세요.

빌드 과정 없는 정적 사이트다. `index.html` + `chapters/<slug>.html` + 공통 `css/style.css`, `js/common.js`.
로컬 실행: `python3 -m http.server 8000` → http://localhost:8000 (file://로 열어도 동작하게 classic script만 사용한다. ES module 금지.)

## 원칙
- **한국어**, 대상은 **네트워크·통신을 배운 적 없는 일반인**(뒤쪽 장은 공학도·현업 입문자도 읽을 깊이). 전문 용어는 처음 나올 때 쉬운 말로 풀고 `<span class="term">라우터</span><span class="en">(router)</span>`처럼 원어를 병기한다.
- 수식 대신 비유와 숫자 감각을 쓴다(필요하면 KaTeX 없이 `.formula` 블록에 간단한 식만). 책 전체의 공통 비유는 **택배·물류**다(패킷 = 택배 상자, IP 주소 = 집 주소, 포트 = 받는 사람/호수, 라우터 = 물류 허브(분류 센터), 스위치 = 아파트 우편실, 링크 = 도로, 대역폭 = 차선 수, 지연 = 이동 시간, 프로토콜 = 배송 규칙, TCP = 등기 우편, UDP = 일반 우편, DNS = 주소록, 데이터센터 = 거대 물류 창고, 전파 = 하늘길).
- 흐름: 질문/상황 → 비유(`.callout.analogy`) → 그림(SVG) → 시뮬레이터 → 실제 수치 → 핵심 정리 → 퀴즈.
- 앞 장의 개념을 쓸 때는 “(7장)”처럼 장 번호를 적어 연결한다.
- 수치는 실제 하드웨어의 대표적인 크기 수준을 쓰고, 단순화했다면 `sim-note`에 밝힌다.
- 외부 라이브러리는 쓰지 않는다(글꼴 CSS만 CDN). 이미지 파일 대신 인라인 SVG/canvas로 그린다.
- 색은 하드코딩하지 말고 CSS 변수(`var(--accent)` 등)나 `NB.palette()`를 쓴다. 라이트/다크 둘 다 읽혀야 한다.
- 모바일(폭 360px)에서 페이지 가로 스크롤이 생기면 안 된다. 넓은 그림은 `overflow-x:auto` 래퍼 안에 넣는다. SVG는 `viewBox`만 주고 width/height 속성 생략.

## head 템플릿

모든 HTML 페이지에는 아래 Cloudflare Web Analytics 코드를 `<head>`에 한 번 포함한다. SEO 자동 생성 블록 밖에 두며, 공통 Site Token을 유지한다.
```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<title>라우팅: 길 찾기 · NetworkBook</title>
<meta name="description" content="한 문장 설명">
<link rel="stylesheet" href="../css/style.css">
<script src="../js/common.js"></script>
<!-- Cloudflare Web Analytics -->
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"3d6151a0abc94ede89285d462527fa80"}'></script>
<!-- End Cloudflare Web Analytics -->
</head>
<body data-chapter="routing">
<main class="chapter">
  <header class="chapter-hero">
    <div class="eyebrow">Chapter 08</div>
    <h1>라우팅: 길 찾기</h1>
    <p class="lead">...</p>
    <ul class="objectives"><li>...</li></ul>
  </header>

  <section id="intro"><h2>제목</h2> ... </section>   <!-- h2 번호와 우측 목차는 자동 생성 -->
  ...
  <section class="keypoints" id="summary"><h2>핵심 정리</h2><ol><li>...</li></ol></section>
  <section class="quiz-sec" id="quiz"><h2>확인 퀴즈</h2><div class="quiz"> ... </div></section>
</main>
<script> /* 페이지 스크립트: 여기서 NB 사용 */ </script>
</body>
</html>
```
상단바, 챕터 서랍, 목차, 이전/다음, 푸터, 테마 토글, 퀴즈 동작은 `common.js`가 자동 처리한다.
새 챕터는 `common.js`의 `CHAPTERS`에 `{ slug, num, part, title, desc, tags }`로 등록한 뒤 `python3 tools/seo.py`를 실행한다.

## 컴포넌트
- 그림: `<figure class="diagram"><svg viewBox="...">...</svg><figcaption><b>그림 8-1.</b> 설명</figcaption></figure>`
  - SVG 유틸 클래스: `.t .t-dim .t-mono .t-acc`, `.s-line .s-axis .s-acc`, `.f-surface .f-elev .f-acc .f-acc-soft .f-acc2-soft`
- 시뮬레이터: `.sim > .sim-head(.sim-tag + h3) + .sim-view(canvas) + .sim-controls(.ctrl, .seg, .check, .btn) + .sim-readout(.stat) + .sim-note`
  - `.sim-body.side`로 넓은 화면에서 컨트롤을 오른쪽에 둔다.
- 콜아웃: `.callout`(기본), `.tip`, `.warn`, `.analogy`(비유), `.deep`(더 알아보기)
- 코드: `<div class="codebox">` (`.k` 키워드, `.c` 주석, `.n` 숫자, `.s` 문자열, `.hl` 강조 줄)
- 비트 토글: `<button class="bit">0<small>128</small></button>`, 메모리 칸: `.cell` (+ `.hot .hot2 .ok .bad .warn`)
- 퀴즈: `.quiz-q > p + .opts > button.opt[data-correct]` + `.quiz-exp` (고른 답은 자동으로 진도에 저장·복원된다)
- 용어: `.term` 안의 글자가 `js/terms.js`의 표제어(괄호 앞부분, 영어 이름 포함)나 `NB_TERM_ALIAS`와 맞으면 자동으로 툴팁이 붙는다. 새 용어는 `NB_TERMS`에 `[한국어, 영어, 설명, 장 slug]`로 그 장 묶음 안에 추가한다.

## JS 헬퍼 (`js/common.js`, 전역 `NB`)
- `NB.canvas(el, (ctx,w,h)=>{}, {aspect, height, minHeight, maxHeight})` → `{redraw()}` HiDPI, 리사이즈·테마 변경 시 자동 redraw.
- `NB.chart(ctx, box|null, {x, y, logX, logY, xLabel, yLabel, series, vlines, hlines, points, bands, xFmt, yFmt})`
- `NB.loop(el, (dt,t)=>{})` 화면에 보일 때만 도는 애니메이션 루프.
- `NB.range(id, fmt, onInput)`, `NB.seg(id, onChange)`, `NB.stat(id, html)`
- 그리기: `NB.rrect`, `NB.box(ctx,x,y,w,h,{fill,stroke,text,color,size,bold,mono,r})`, `NB.arrow`, `NB.text`
- 숫자: `NB.bin(n,bits)`, `NB.hex(n,digits)`, `NB.bytes(b)`, `NB.time(s)`, `NB.kn(n)`(만·억·조), `NB.fmt`, `NB.si`
- 3D: `NB.scene3d(canvas, () => boxes, {radius, zoom, yaw, pitch, center, cyFrac, onPick(id), hint, compactBelow})` — 상자 `{id, x, y, z, w, h, d, color, alpha, label}`만으로 그리는 원근 3D. 드래그 회전·클릭 선택, 보일 때만 자동 회전.
- 진도: `NB.progress.get(slug)`, `.last()`, `.doneCount()`, `.reset()` (localStorage `nb-progress-v1`)
- 기타: `NB.palette()`, `NB.color(name)`, `NB.isDark()`, `NB.onTheme(cb)`, `NB.rng(seed)`, `NB.clamp/lerp/map`, `NB.CHAPTERS`

## 예측 실험(만약에?)
퀴즈와 같은 구조에 `.whatif`를 더한다. 독자가 먼저 결과를 예측하고 시뮬레이터로 확인하게 한다.
```html
<div class="whatif quiz-q"><div class="wi-head">예측해 보기</div><p class="wi-q">질문</p><p class="wi-hint">어느 시뮬레이터로 확인할지</p><div class="opts">
  <button class="opt">…</button><button class="opt" data-correct>…</button>
</div><div class="quiz-exp">해설</div></div>
```

## 반도체 장(16–19장) 작성 원칙
네트워크를 움직이는 칩을 다룰 때는 “무슨 일을 하는 회로인가 → 왜 어려운가(물리 한계) → 어떤 재료·공정으로 푸는가 → 대표 수치” 순서로 쓴다. 특정 회사의 제품명은 예시로만 들고, 세대가 바뀌어도 통하는 원리를 중심에 둔다.
