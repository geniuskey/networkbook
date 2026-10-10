/* ==========================================================================
   NetworkBook 공통 스크립트 — 전역 객체 NB
   - 레이아웃(상단바, 목차, 이전/다음, 테마) 자동 생성
   - 시뮬레이터 헬퍼: canvas, chart, range, seg, 그리기·포맷 유틸
   이 파일은 <head>에서 defer 없이 로드된다. 페이지 스크립트는 </body> 직전에 둔다.
   ========================================================================== */
(function () {
  "use strict";

  const CHAPTERS = [
    { slug: "intro",      num: "01", part: "시작하기",       title: "네트워크란 무엇인가",            desc: "연결이 왜 힘이 되는가. 노드와 링크, 대역폭과 지연, 인터넷이라는 망들의 망을 한눈에 둘러본다.", tags: ["기초", "sim"] },
    { slug: "signal",     num: "02", part: "시작하기",       title: "신호와 정보",                    desc: "비트를 전기·빛·전파에 싣는 법. 주파수와 대역폭, 잡음과 데시벨, 섀넌이 정한 통신 속도의 한계.", tags: ["물리", "sim"] },
    { slug: "layers",     num: "03", part: "시작하기",       title: "프로토콜과 계층",                desc: "택배 상자 속 상자. OSI 7계층과 TCP/IP, 캡슐화, 실제 패킷을 바이트 단위로 해부한다.", tags: ["기초", "sim"] },
    { slug: "copper",     num: "04", part: "유선 통신",      title: "구리선: 전화선에서 이더넷까지",  desc: "꼬임쌍선과 동축 케이블, 감쇠와 누화, 라인 코딩과 눈 모양 그림(eye diagram), DSL과 케이블 인터넷.", tags: ["유선", "sim"] },
    { slug: "optical",    num: "05", part: "유선 통신",      title: "광통신과 해저 케이블",           desc: "빛을 가두는 유리실. 전반사, 감쇠와 분산, 파장 분할 다중화(WDM), 대륙을 잇는 해저 케이블.", tags: ["유선", "sim"] },
    { slug: "ethernet",   num: "06", part: "유선 통신",      title: "이더넷과 스위치",                desc: "MAC 주소와 프레임, 충돌에서 스위칭으로, 스위치가 주소를 배우는 법, VLAN과 고리 막기(STP).", tags: ["유선", "sim"] },
    { slug: "ip",         num: "07", part: "인터넷",         title: "IP 주소와 서브넷",               desc: "인터넷의 주소 체계. 서브넷 계산기, DHCP와 ARP, NAT, 그리고 IPv6로의 이사.", tags: ["인터넷", "sim"] },
    { slug: "routing",    num: "08", part: "인터넷",         title: "라우팅: 길 찾기",                desc: "라우팅 테이블과 최장 접두사 일치, 거리 벡터와 링크 상태, 경로 수렴, BGP로 이어진 자율 시스템들.", tags: ["인터넷", "sim"] },
    { slug: "tcp",        num: "09", part: "인터넷",         title: "TCP와 UDP",                      desc: "믿을 수 있는 배달. 3방향 악수, 슬라이딩 윈도우, 혼잡 제어 창의 톱니, UDP와 QUIC.", tags: ["인터넷", "sim"] },
    { slug: "apps",       num: "10", part: "인터넷",         title: "DNS, 웹, 스트리밍",              desc: "이름을 주소로 바꾸는 DNS, HTTP/1.1에서 HTTP/3까지, CDN, 끊김 없는 동영상의 비밀(적응형 스트리밍).", tags: ["인터넷", "sim"] },
    { slug: "radio",      num: "11", part: "무선 통신",      title: "전파의 기초",                    desc: "보이지 않는 빛. 주파수와 파장, 안테나, 거리와 벽이 만드는 손실, 다중 경로 페이딩, 주파수 경매.", tags: ["무선", "sim"] },
    { slug: "modulation", num: "12", part: "무선 통신",      title: "변조, OFDM, MIMO",               desc: "전파에 비트를 싣는 법. QAM 성좌도와 잡음, 수천 개의 부반송파(OFDM), 여러 안테나와 빔포밍.", tags: ["무선", "sim"] },
    { slug: "wifi",       num: "13", part: "무선 통신",      title: "Wi-Fi와 근거리 무선",            desc: "공유기 속 질서. 채널과 간섭, 충돌 회피(CSMA/CA), Wi-Fi 7까지의 진화, 블루투스·NFC·UWB.", tags: ["무선", "sim"] },
    { slug: "cellular",   num: "14", part: "무선 통신",      title: "이동통신: 1G에서 6G까지",        desc: "셀과 기지국, 주파수 재사용, 핸드오버, LTE와 5G의 구조, 밀리미터파, 그리고 6G.", tags: ["무선", "sim"] },
    { slug: "satellite",  num: "15", part: "무선 통신",      title: "위성 통신과 우주 인터넷",        desc: "정지 궤도와 저궤도, 지연과 커버리지, 위성 군집(스타링크), 위성 간 레이저 링크, GPS 신호.", tags: ["무선", "sim"] },
    { slug: "serdes",     num: "16", part: "네트워크 반도체", title: "SerDes와 고속 인터페이스",      desc: "칩 밖으로 초당 수천억 비트를. 직렬화, PAM4, 이퀄라이저, 클럭 복원, 전송선로와 신호 무결성.", tags: ["반도체", "sim"] },
    { slug: "netchips",   num: "17", part: "네트워크 반도체", title: "네트워크 칩: 스위치와 NIC",     desc: "51.2 Tbps 스위치 ASIC의 내부, 패킷 처리 파이프라인과 TCAM, 버퍼, NIC·SmartNIC·DPU.", tags: ["반도체", "sim", "3D"] },
    { slug: "rfchips",    num: "18", part: "네트워크 반도체", title: "RF 반도체: 휴대폰 속 통신 칩",  desc: "안테나에서 모뎀까지. 전력 증폭기(GaAs·GaN), 저잡음 증폭기, 필터, 믹서와 PLL, ADC, 베이스밴드 모뎀.", tags: ["반도체", "sim"] },
    { slug: "photonics",  num: "19", part: "네트워크 반도체", title: "광 반도체와 실리콘 포토닉스",   desc: "빛을 만들고 받는 칩. 반도체 레이저와 광검출기, 광 트랜시버, 실리콘 포토닉스와 CPO.", tags: ["반도체", "sim"] },
    { slug: "datacenter", num: "20", part: "데이터센터와 클라우드", title: "데이터센터 네트워크",   desc: "수십만 대를 잇는 법. 리프-스파인(Clos), ECMP, 동서 트래픽, AI 클러스터의 RDMA와 집합 통신.", tags: ["클라우드", "sim", "3D"] },
    { slug: "cloud",      num: "21", part: "데이터센터와 클라우드", title: "클라우드 네트워크",     desc: "가상 네트워크(VPC)와 오버레이, SDN, 로드 밸런서, CDN과 엣지, 리전과 가용 영역.", tags: ["클라우드", "sim"] },
    { slug: "security",   num: "22", part: "보안과 운영",    title: "네트워크 보안",                  desc: "도청·위조·마비. 암호와 키 교환, TLS, 방화벽과 VPN, DDoS, Wi-Fi 보안.", tags: ["보안", "sim"] },
    { slug: "ops",        num: "23", part: "보안과 운영",    title: "측정과 문제 해결",               desc: "ping과 traceroute, 지연의 네 가지 원인, 대역폭-지연 곱, 큐와 버퍼블로트, QoS, 장애 추적.", tags: ["운영", "sim"] },
    { slug: "journey",    num: "24", part: "종합",           title: "영상 통화 한 번의 여행",         desc: "휴대폰 → Wi-Fi → 광케이블 → 데이터센터 → 기지국 → 친구의 휴대폰. 모든 계층을 한 번에 따라간다.", tags: ["종합", "sim"] },
    { slug: "history",    num: "25", part: "종합",           title: "통신의 역사와 미래",             desc: "봉화와 전신에서 아파넷, 웹, 스마트폰, 6G와 양자 통신까지. 대역폭 성장 곡선을 따라간다.", tags: ["역사", "sim"] },
    { slug: "glossary",   num: "26", part: "종합",           title: "용어집 & 종합 퀴즈",             desc: "네트워크·통신·반도체 핵심 용어 459개를 검색하고, 75문항 종합 퀴즈로 배운 내용을 점검하자.", tags: ["정리"] },
  ];

  const NB = (window.NB = {});
  NB.CHAPTERS = CHAPTERS;

  /* ------------------------------------------------------------ math utils */
  NB.clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  NB.lerp = (a, b, t) => a + (b - a) * t;
  NB.map = (x, a, b, c, d) => c + ((x - a) * (d - c)) / (b - a);
  NB.randn = function () {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  NB.poisson = function (lambda) {
    if (lambda <= 0) return 0;
    if (lambda > 40) return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * NB.randn()));
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  };
  /** 숫자 포맷: 유효 자리 */
  NB.fmt = function (x, digits = 3) {
    if (!isFinite(x)) return "—";
    if (x === 0) return "0";
    const a = Math.abs(x);
    if (a >= 1e5 || a < 1e-3) return x.toExponential(digits - 1).replace("e+", "e");
    return Number(x.toPrecision(digits)).toLocaleString("en-US", { maximumFractionDigits: 6 });
  };
  /** SI 접두사 포맷: NB.si(2.3e-9,'m') → "2.3 nm" */
  NB.si = function (x, unit = "", digits = 3) {
    if (!isFinite(x)) return "—";
    if (x === 0) return "0 " + unit;
    const pre = [[1e12, "T"], [1e9, "G"], [1e6, "M"], [1e3, "k"], [1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"], [1e-12, "p"], [1e-15, "f"]];
    const a = Math.abs(x);
    for (const [v, p] of pre) if (a >= v * 0.9995) return Number((x / v).toPrecision(digits)) + " " + p + unit;
    return x.toExponential(digits - 1) + " " + unit;
  };

  /* ------------------------------------------------------------ number utils */
  /** 정수 → 2진 문자열(자리수 고정): NB.bin(5,8) → "00000101" */
  NB.bin = (n, bits = 8) => ((n >>> 0) & (bits >= 32 ? 0xffffffff : (1 << bits) - 1)).toString(2).padStart(bits, "0");
  /** 정수 → 16진 문자열: NB.hex(255,2) → "FF" */
  NB.hex = (n, digits = 2) => (n >>> 0).toString(16).toUpperCase().padStart(digits, "0");
  /** 바이트 수 → 사람이 읽는 단위 */
  NB.bytes = function (b, digits = 3) {
    const u = ["B", "KB", "MB", "GB", "TB", "PB"];
    let i = 0;
    while (Math.abs(b) >= 1000 && i < u.length - 1) { b /= 1000; i++; }
    return Number(b.toPrecision(digits)) + " " + u[i];
  };
  /** 시간(초) → 사람이 읽는 단위 */
  NB.time = function (s) {
    const steps = [[3.156e7 * 100, "세기"], [3.156e7, "년"], [2.63e6, "개월"], [86400, "일"], [3600, "시간"], [60, "분"], [1, "초"], [1e-3, "ms"], [1e-6, "µs"], [1e-9, "ns"], [1e-12, "ps"]];
    for (const [v, n] of steps) if (Math.abs(s) >= v * 0.9995) return Number((s / v).toPrecision(3)) + " " + n;
    return s.toExponential(2) + " 초";
  };
  /** 큰 수를 한국어 단위로: NB.kn(1040000) → "104만" */
  NB.kn = function (n) {
    const a = Math.abs(n);
    if (a >= 1e12) return Number((n / 1e12).toPrecision(3)) + "조";
    if (a >= 1e8) return Number((n / 1e8).toPrecision(3)) + "억";
    if (a >= 1e4) return Number((n / 1e4).toPrecision(3)) + "만";
    return String(Math.round(n));
  };
  NB.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  /** 결정적 난수(시드) */
  NB.rng = function (seed = 1) { let x = seed >>> 0 || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; };

  /* ------------------------------------------------------------ canvas drawing utils */
  /** 둥근 사각형 경로 */
  NB.rrect = function (ctx, x, y, w, h, r = 6) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  };
  /** 상자 + 가운데 글자 */
  NB.box = function (ctx, x, y, w, h, o = {}) {
    const P = NB.palette();
    NB.rrect(ctx, x, y, w, h, o.r == null ? 8 : o.r);
    ctx.fillStyle = o.fill || P.surface; ctx.fill();
    if (o.stroke !== false) { ctx.strokeStyle = o.stroke || P.border; ctx.lineWidth = o.lw || 1; ctx.stroke(); }
    if (o.text != null) {
      ctx.fillStyle = o.color || P.text;
      ctx.font = (o.bold ? "700 " : "") + (o.size || 13) + "px " + (o.mono ? NB.color("mono") || "monospace" : NB.font());
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const lines = String(o.text).split("\n");
      const lh = (o.size || 13) * 1.3;
      lines.forEach((ln, i) => ctx.fillText(ln, x + w / 2, y + h / 2 + (i - (lines.length - 1) / 2) * lh));
    }
  };
  /** 화살표 */
  NB.arrow = function (ctx, x1, y1, x2, y2, o = {}) {
    const P = NB.palette();
    ctx.strokeStyle = ctx.fillStyle = o.color || P.dim; ctx.lineWidth = o.lw || 1.6;
    ctx.setLineDash(o.dash || []);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]);
    const a = Math.atan2(y2 - y1, x2 - x1), s = o.head || 8;
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45)); ctx.lineTo(x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)); ctx.closePath(); ctx.fill();
  };
  /** 텍스트 */
  NB.text = function (ctx, str, x, y, o = {}) {
    ctx.fillStyle = o.color || NB.color("text");
    ctx.font = (o.bold ? "700 " : o.weight ? o.weight + " " : "") + (o.size || 13) + "px " + (o.mono ? NB.color("mono") || "monospace" : NB.font());
    ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "middle";
    ctx.fillText(str, x, y);
  };
  NB.font = () => getComputedStyle(document.documentElement).getPropertyValue("--font") || "sans-serif";

  /* ------------------------------------------------------------ theme */
  const themeCbs = [];
  NB.onTheme = (cb) => themeCbs.push(cb);
  NB.isDark = function () {
    const t = document.documentElement.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  };
  /** CSS 변수 값 읽기: NB.color('accent') */
  NB.color = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue("--" + name).trim();
  };
  /** 자주 쓰는 색 묶음 (테마 변경 시 다시 호출할 것) */
  NB.palette = function () {
    const c = NB.color;
    return {
      bg: c("canvas-bg"), text: c("text"), dim: c("text-dim"), faint: c("text-faint"),
      grid: c("grid"), axis: c("axis"), border: c("border"), surface: c("surface"),
      accent: c("accent"), accent2: c("accent-2"), ok: c("ok"), warn: c("warn"), bad: c("bad"),
      red: c("red"), green: c("green"), blue: c("blue"),
      // 데이터 시리즈용 기본 순서
      series: [c("accent"), c("accent-2"), c("warn"), c("ok"), c("bad"), c("text-dim")],
    };
  };
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
    themeCbs.forEach((cb) => { try { cb(); } catch (e) { console.error(e); } });
  }
  try { const saved = localStorage.getItem("nb-theme"); if (saved) document.documentElement.setAttribute("data-theme", saved); } catch (e) {}
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
      if (!document.documentElement.getAttribute("data-theme")) applyTheme(null);
    });
  }

  /* ------------------------------------------------------------ canvas helper */
  /**
   * HiDPI 캔버스. 폭은 부모 폭을 따르고 높이는 aspect(높이/폭) 또는 height(px)로 결정.
   * draw(ctx, w, h)는 리사이즈·테마 변경 시 자동 호출된다. 애니메이션이면 직접 redraw() 호출.
   *   const cv = NB.canvas(el, (ctx,w,h)=>{...}, {aspect:0.5, maxHeight: 420});
   *   cv.redraw(); cv.ctx; cv.w; cv.h
   */
  NB.canvas = function (canvas, draw, opts = {}) {
    if (typeof canvas === "string") canvas = document.querySelector(canvas);
    const ctx = canvas.getContext("2d");
    const st = { ctx, w: 0, h: 0, canvas, dpr: 1 };
    function resize() {
      const parent = canvas.parentElement;
      const w = Math.max(200, Math.floor(opts.width || parent.clientWidth || 600));
      let h = opts.height || Math.round(w * (opts.aspect || 0.5));
      if (opts.minHeight) h = Math.max(h, opts.minHeight);
      if (opts.maxHeight) h = Math.min(h, opts.maxHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.w = w; st.h = h; st.dpr = dpr;
      st.redraw();
    }
    st.redraw = function () {
      if (!st.w) return;
      ctx.save();
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      if (!opts.noClear) {
        ctx.clearRect(0, 0, st.w, st.h);
        ctx.fillStyle = NB.color("canvas-bg");
        ctx.fillRect(0, 0, st.w, st.h);
      }
      try { draw && draw(ctx, st.w, st.h); } finally { ctx.restore(); }
    };
    st.resize = resize;
    if (window.ResizeObserver) {
      let lastW = -1;
      new ResizeObserver(() => { const w = canvas.parentElement.clientWidth; if (w !== lastW) { lastW = w; resize(); } }).observe(canvas.parentElement);
    } else window.addEventListener("resize", resize);
    NB.onTheme(() => st.redraw());
    resize();
    return st;
  };

  /**
   * 화면에 보일 때만 도는 애니메이션 루프. fn(dt초, t초)
   *   const loop = NB.loop(el, (dt,t)=>{...}); loop.stop(); loop.start();
   */
  NB.loop = function (el, fn) {
    let raf = 0, last = 0, t = 0, visible = true, running = true;
    function frame(ts) {
      raf = 0;
      if (!running || !visible) return;
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
      last = ts; t += dt;
      fn(dt, t);
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && running && visible) { last = 0; raf = requestAnimationFrame(frame); } }
    if (window.IntersectionObserver && el) {
      new IntersectionObserver((es) => { visible = es[0].isIntersecting; kick(); }).observe(el);
    }
    kick();
    return {
      start() { running = true; kick(); },
      stop() { running = false; },
      get running() { return running; },
      toggle() { running ? (running = false) : ((running = true), kick()); return running; },
    };
  };

  /* ------------------------------------------------------------ 작은 3D 장면 (상자만, 라이브러리 없음) */
  /**
   * const sc = NB.scene3d("#cv", () => boxes, { yaw, pitch, radius, height, autoRotate, onPick(id), onHover(id) })
   *   box = { id, x, y, z, w, h, d, color, alpha, label, sub }  (x 오른쪽, y 위, z 앞쪽 · x,y,z는 최소 모서리)
   *   드래그로 회전, 클릭으로 선택. sc.redraw(), sc.setView(yaw, pitch), sc.selected
   */
  NB.scene3d = function (canvas, getBoxes, opts = {}) {
    if (typeof canvas === "string") canvas = document.querySelector(canvas);
    const st = { yaw: opts.yaw == null ? -0.65 : opts.yaw, pitch: opts.pitch == null ? 0.5 : opts.pitch, hover: null, selected: opts.selected || null, faces: [], touched: false };
    const rgbCache = {};
    const rgb = (ctx, c) => {
      if (rgbCache[c]) return rgbCache[c];
      ctx.fillStyle = "#000"; ctx.fillStyle = c; const s = ctx.fillStyle;
      let r = 0, g = 0, b = 0;
      if (s[0] === "#") { r = parseInt(s.slice(1, 3), 16); g = parseInt(s.slice(3, 5), 16); b = parseInt(s.slice(5, 7), 16); }
      else { const m = s.match(/[\d.]+/g) || [0, 0, 0]; r = +m[0]; g = +m[1]; b = +m[2]; }
      return (rgbCache[c] = [r, g, b]);
    };
    NB.onTheme(() => { for (const k in rgbCache) delete rgbCache[k]; });
    const view = NB.canvas(canvas, (ctx, w, h) => {
      const P = NB.palette(), boxes = getBoxes() || [];
      const R = opts.radius || 10, D = R * 3.4, f = Math.min(w, h * 1.25) * 1.35 * (opts.zoom || 1);
      const cy = Math.cos(st.yaw), sy = Math.sin(st.yaw), cp = Math.cos(st.pitch), sp = Math.sin(st.pitch);
      const c0 = opts.center || [0, 0, 0];
      const tr = (x, y, z) => { x -= c0[0]; y -= c0[1]; z -= c0[2]; const x1 = x * cy + z * sy, z1 = -x * sy + z * cy; const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp; return [x1, y2, z2]; };
      const pr = (p) => { const s = f / (D - p[2]); return [w / 2 + p[0] * s, h * (opts.cyFrac || 0.55) - p[1] * s]; };
      const L = [-0.45, 0.75, 0.5]; const ln = Math.hypot(...L); L[0] /= ln; L[1] /= ln; L[2] /= ln;
      const faces = [];
      boxes.forEach((b) => {
        const X = [b.x, b.x + b.w], Y = [b.y, b.y + b.h], Z = [b.z, b.z + b.d];
        const v = []; for (let i = 0; i < 8; i++) v.push(tr(X[i & 1], Y[(i >> 1) & 1], Z[(i >> 2) & 1]));
        const F = [[0, 2, 6, 4, [-1, 0, 0]], [1, 5, 7, 3, [1, 0, 0]], [0, 4, 5, 1, [0, -1, 0]], [2, 3, 7, 6, [0, 1, 0]], [0, 1, 3, 2, [0, 0, -1]], [4, 6, 7, 5, [0, 0, 1]]];
        F.forEach(([a, bq, c, d, n]) => {
          const nn = tr(n[0] + c0[0], n[1] + c0[1], n[2] + c0[2]); // 방향만 필요
          const ctr = [(v[a][0] + v[c][0]) / 2, (v[a][1] + v[c][1]) / 2, (v[a][2] + v[c][2]) / 2];
          const toCam = [-ctr[0], -ctr[1], D - ctr[2]];
          if (nn[0] * toCam[0] + nn[1] * toCam[1] + nn[2] * toCam[2] <= 0) return;
          const lit = 0.62 + 0.38 * Math.max(0, nn[0] * L[0] + nn[1] * L[1] + nn[2] * L[2]);
          faces.push({ b, pts: [v[a], v[bq], v[c], v[d]].map(pr), depth: Math.hypot(toCam[0], toCam[1], toCam[2]), lit, top: n[1] === 1 });
        });
      });
      faces.sort((p, q) => q.depth - p.depth);
      st.faces = faces;
      const hl = st.hover || st.selected;
      faces.forEach((fc) => {
        const [r, g, bb] = rgb(ctx, fc.b.color || P.surface);
        const k = fc.lit * (fc.b.id && fc.b.id === hl ? 1.12 : 1);
        ctx.beginPath(); fc.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
        ctx.globalAlpha = fc.b.alpha == null ? 1 : fc.b.alpha;
        ctx.fillStyle = `rgb(${Math.min(255, r * k) | 0},${Math.min(255, g * k) | 0},${Math.min(255, bb * k) | 0})`; ctx.fill();
        ctx.strokeStyle = fc.b.id && fc.b.id === hl ? P.text : "rgba(0,0,0,.18)"; ctx.lineWidth = fc.b.id && fc.b.id === hl ? 1.6 : 0.7; ctx.stroke();
        ctx.globalAlpha = 1;
      });
      // labels (앞쪽이 위에 오도록)
      const compact = opts.compactBelow && w < opts.compactBelow;
      const labs = boxes.filter((b) => b.label && (!compact || b.labelAlways || (b.id && b.id === hl))).map((b) => { const p = tr(b.x + b.w / 2, b.y + b.h, b.z + b.d / 2); return { b, p: pr(p), z: p[2] }; }).sort((a, c) => a.z - c.z);
      ctx.font = "600 12px " + NB.font();
      labs.forEach(({ b, p }) => {
        const tw = ctx.measureText(b.label).width + 12, y = p[1] - (b.labelLift || 14);
        NB.rrect(ctx, p[0] - tw / 2, y - 10, tw, 20, 6); ctx.fillStyle = b.id === hl ? P.accent : "rgba(15,20,35,.72)"; ctx.fill();
        NB.text(ctx, b.label, p[0], y, { align: "center", size: 12, bold: true, color: "#fff" }); ctx.font = "600 12px " + NB.font();
      });
      if (opts.hint && !st.touched) NB.text(ctx, opts.hint, w - 10, h - 12, { align: "right", size: 11.5, color: P.faint });
      if (opts.overlay) opts.overlay(ctx, w, h);
    }, { height: opts.height, aspect: opts.aspect || 0.62, minHeight: opts.minHeight || 260, maxHeight: opts.maxHeight || 460 });
    const pick = (mx, my) => {
      for (let i = st.faces.length - 1; i >= 0; i--) {
        const p = st.faces[i].pts; let inside = false;
        for (let a = 0, b = 3; a < 4; b = a++) { if ((p[a][1] > my) !== (p[b][1] > my) && mx < ((p[b][0] - p[a][0]) * (my - p[a][1])) / (p[b][1] - p[a][1]) + p[a][0]) inside = !inside; }
        if (inside && st.faces[i].b.id) return st.faces[i].b.id;
      }
      return null;
    };
    canvas.style.touchAction = "pan-y"; canvas.style.cursor = "grab";
    let drag = null;
    const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    canvas.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY, yaw: st.yaw, pitch: st.pitch, moved: false, id: e.pointerId }; });
    canvas.addEventListener("pointermove", (e) => {
      if (drag) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) { if (!drag.moved) { try { canvas.setPointerCapture(drag.id); } catch (er) {} } drag.moved = true; st.touched = true; canvas.style.cursor = "grabbing"; }
        if (drag.moved) { st.yaw = drag.yaw + dx * 0.009; if (e.pointerType === "mouse") st.pitch = NB.clamp(drag.pitch + dy * 0.006, 0.08, 1.35); view.redraw(); }
        return;
      }
      if (e.pointerType !== "mouse") return;
      const [mx, my] = pos(e), id = pick(mx, my);
      if (id !== st.hover) { st.hover = id; canvas.style.cursor = id ? "pointer" : "grab"; view.redraw(); if (opts.onHover) opts.onHover(id); }
    });
    const end = (e) => {
      if (drag && !drag.moved) { const [mx, my] = pos(e); const id = pick(mx, my); st.selected = id; st.touched = true; if (opts.onPick) opts.onPick(id); view.redraw(); }
      drag = null; canvas.style.cursor = st.hover ? "pointer" : "grab";
    };
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", () => { drag = null; });
    canvas.addEventListener("pointerleave", () => { if (!drag && st.hover) { st.hover = null; view.redraw(); } });
    if (opts.autoRotate !== false) NB.loop(canvas, (dt) => { if (st.touched || drag) return; st.yaw += dt * 0.18; view.redraw(); });
    return {
      redraw: () => view.redraw(),
      setView(yaw, pitch) { if (yaw != null) st.yaw = yaw; if (pitch != null) st.pitch = pitch; view.redraw(); },
      stop() { st.touched = true; },
      get selected() { return st.selected; },
      set selected(v) { st.selected = v; view.redraw(); },
    };
  };

  /* ------------------------------------------------------------ chart helper */
  /**
   * 간단한 선 그래프. box = {x,y,w,h}(생략 시 캔버스 전체에 여백 자동)
   * opts: { x:[min,max], y:[min,max], logX, logY, xLabel, yLabel, xTicks, yTicks,
   *         xFmt, yFmt, series:[{data:[[x,y],...], color, width, dash, fill, label}],
   *         vlines:[{x,color,label,dash}], hlines:[{y,color,label,dash}], points:[{x,y,color,r,label}],
   *         bands:[{x0,x1,color}] }
   * 반환: { X(v)->px, Y(v)->px, box }
   */
  NB.chart = function (ctx, box, opts) {
    const P = NB.palette();
    const dpr = (ctx.getTransform && ctx.getTransform().a) || 1;
    const W = ctx.canvas.width / dpr, H = ctx.canvas.height / dpr;
    if (!box) box = { x: 58, y: 16, w: W - 58 - 18, h: H - 16 - 46 };
    const [x0, x1] = opts.x, [y0, y1] = opts.y;
    const lx = (v) => (opts.logX ? Math.log10(v) : v);
    const ly = (v) => (opts.logY ? Math.log10(v) : v);
    const X = (v) => box.x + ((lx(v) - lx(x0)) / (lx(x1) - lx(x0))) * box.w;
    const Y = (v) => box.y + box.h - ((ly(v) - ly(y0)) / (ly(y1) - ly(y0))) * box.h;
    const ticks = (a, b, log, n) => {
      if (log) { const out = []; for (let e = Math.ceil(Math.log10(a) - 1e-9); e <= Math.log10(b) + 1e-9; e++) out.push(Math.pow(10, e)); return out; }
      const span = b - a, raw = span / (n || 5), mag = Math.pow(10, Math.floor(Math.log10(raw)));
      const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= (n || 5) + 0.5) || raw;
      const out = []; for (let v = Math.ceil(a / step - 1e-9) * step; v <= b + step * 1e-6; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
      return out;
    };
    const defFmt = (v) => (Math.abs(v) >= 1e4 || (Math.abs(v) < 1e-2 && v !== 0) ? v.toExponential(0).replace("e+", "e") : String(Number(v.toPrecision(4))));
    const xFmt = opts.xFmt || defFmt, yFmt = opts.yFmt || defFmt;
    ctx.save();
    ctx.font = "11px " + getComputedStyle(document.body).getPropertyValue("--mono");
    ctx.lineWidth = 1;
    // bands
    (opts.bands || []).forEach((b) => { ctx.fillStyle = b.color; ctx.fillRect(X(b.x0), box.y, X(b.x1) - X(b.x0), box.h); });
    // grid + ticks
    const xt = opts.xTicks || ticks(x0, x1, opts.logX, 6);
    const yt = opts.yTicks || ticks(y0, y1, opts.logY, 5);
    ctx.strokeStyle = P.grid; ctx.fillStyle = P.dim;
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xt.forEach((v) => { const px = X(v); if (px < box.x - 1 || px > box.x + box.w + 1) return; ctx.beginPath(); ctx.moveTo(px, box.y); ctx.lineTo(px, box.y + box.h); ctx.stroke(); ctx.fillText(xFmt(v), px, box.y + box.h + 6); });
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yt.forEach((v) => { const py = Y(v); if (py < box.y - 1 || py > box.y + box.h + 1) return; ctx.beginPath(); ctx.moveTo(box.x, py); ctx.lineTo(box.x + box.w, py); ctx.stroke(); ctx.fillText(yFmt(v), box.x - 6, py); });
    ctx.strokeStyle = P.axis;
    ctx.beginPath(); ctx.moveTo(box.x, box.y); ctx.lineTo(box.x, box.y + box.h); ctx.lineTo(box.x + box.w, box.y + box.h); ctx.stroke();
    // labels
    ctx.fillStyle = P.dim; ctx.font = "12px " + getComputedStyle(document.body).getPropertyValue("--font");
    if (opts.xLabel) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(opts.xLabel, box.x + box.w / 2, box.y + box.h + 40); }
    if (opts.yLabel) { ctx.save(); ctx.translate(14, box.y + box.h / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(opts.yLabel, 0, 0); ctx.restore(); }
    // clip plot area
    ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y - 2, box.w + 2, box.h + 4); ctx.clip();
    (opts.series || []).forEach((s, i) => {
      if (!s.data || !s.data.length) return;
      ctx.strokeStyle = s.color || P.series[i % P.series.length];
      ctx.lineWidth = s.width || 2; ctx.setLineDash(s.dash || []);
      ctx.beginPath();
      let started = false;
      s.data.forEach(([x, y]) => { if (!isFinite(y) || (opts.logY && y <= 0) || (opts.logX && x <= 0)) { started = false; return; } const px = X(x), py = Y(y); started ? ctx.lineTo(px, py) : ctx.moveTo(px, py); started = true; });
      ctx.stroke();
      if (s.fill) {
        ctx.lineTo(X(s.data[s.data.length - 1][0]), Y(opts.logY ? y0 : Math.max(y0, 0)));
        ctx.lineTo(X(s.data[0][0]), Y(opts.logY ? y0 : Math.max(y0, 0)));
        ctx.closePath(); ctx.fillStyle = s.fill; ctx.fill();
      }
      ctx.setLineDash([]);
    });
    (opts.vlines || []).forEach((l) => { ctx.strokeStyle = l.color || P.faint; ctx.setLineDash(l.dash || [4, 4]); ctx.lineWidth = l.width || 1.2; ctx.beginPath(); ctx.moveTo(X(l.x), box.y); ctx.lineTo(X(l.x), box.y + box.h); ctx.stroke(); ctx.setLineDash([]); if (l.label) { ctx.fillStyle = l.color || P.dim; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(l.label, X(l.x) + 4, box.y + 4); } });
    (opts.hlines || []).forEach((l) => { ctx.strokeStyle = l.color || P.faint; ctx.setLineDash(l.dash || [4, 4]); ctx.lineWidth = l.width || 1.2; ctx.beginPath(); ctx.moveTo(box.x, Y(l.y)); ctx.lineTo(box.x + box.w, Y(l.y)); ctx.stroke(); ctx.setLineDash([]); if (l.label) { ctx.fillStyle = l.color || P.dim; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(l.label, box.x + box.w - 4, Y(l.y) - 3); } });
    (opts.points || []).forEach((p) => { ctx.fillStyle = p.color || P.accent; ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), p.r || 4, 0, Math.PI * 2); ctx.fill(); if (p.label) { ctx.fillStyle = P.text; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(p.label, X(p.x) + 6, Y(p.y) - 4); } });
    ctx.restore();
    ctx.restore();
    return { X, Y, box };
  };

  /* ------------------------------------------------------------ controls */
  /**
   * range 입력 바인딩. output은 id+"-out" 요소 또는 <output for=id>.
   *   const get = NB.range('wl', v => v+' nm', v => redraw());  get() → 현재 값(Number)
   */
  NB.range = function (id, fmt, onInput) {
    const el = typeof id === "string" ? document.getElementById(id) : id;
    const out = document.getElementById(el.id + "-out") || document.querySelector(`output[for="${el.id}"]`);
    const update = (fire) => {
      const v = Number(el.value);
      const pct = ((v - Number(el.min || 0)) / (Number(el.max || 100) - Number(el.min || 0))) * 100;
      el.style.setProperty("--fill", pct + "%");
      if (out) out.textContent = fmt ? fmt(v) : String(v);
      if (fire && onInput) onInput(v);
    };
    el.addEventListener("input", () => update(true));
    update(false);
    const get = () => Number(el.value);
    get.set = (v) => { el.value = v; update(true); };
    get.el = el;
    return get;
  };
  /**
   * 세그먼트 버튼: <div class="seg" id="mode"><button data-value="a" class="on">A</button>...</div>
   *   const mode = NB.seg('mode', v => redraw());  mode() → 현재 값
   */
  NB.seg = function (id, onChange) {
    const el = typeof id === "string" ? document.getElementById(id) : id;
    const btns = [...el.querySelectorAll("button")];
    let cur = (btns.find((b) => b.classList.contains("on")) || btns[0]).dataset.value;
    const set = (v, fire = true) => {
      cur = v;
      btns.forEach((b) => { const on = b.dataset.value === v; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      if (fire && onChange) onChange(v);
    };
    btns.forEach((b) => b.addEventListener("click", () => set(b.dataset.value)));
    set(cur, false);
    const get = () => cur;
    get.set = set;
    return get;
  };
  /** 통계 표시: NB.stat('snr', '32.1 dB') → id 요소의 textContent 설정(HTML 허용) */
  NB.stat = function (id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; };


  /* ------------------------------------------------------------ 학습 진도 (브라우저에만 저장) */
  const PKEY = "nb-progress-v1";
  NB.progress = {
    load() { try { return JSON.parse(localStorage.getItem(PKEY)) || { ch: {} }; } catch (e) { return { ch: {} }; } },
    save(d) { try { localStorage.setItem(PKEY, JSON.stringify(d)); } catch (e) {} },
    get(slug) { return this.load().ch[slug] || null; },
    update(slug, fn) { const d = this.load(); d.ch = d.ch || {}; const c = (d.ch[slug] = d.ch[slug] || { pct: 0 }); fn(c, d); this.save(d); return c; },
    last() { return this.load().last || null; },
    reset() { try { localStorage.removeItem(PKEY); } catch (e) {} },
    doneCount() { const ch = this.load().ch || {}; return CHAPTERS.filter((c) => ch[c.slug] && ch[c.slug].done).length; },
  };
  /* ------------------------------------------------------------ layout build */
  const LOGO = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="nbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent-2)"/></linearGradient></defs><rect x="2" y="2" width="28" height="28" rx="8" fill="url(#nbg)"/><g stroke="#fff" stroke-width="1.7" stroke-linecap="round" opacity=".8" fill="none"><path d="M9 10.5 16 16 23 10.5M9 21.5 16 16 23 21.5M9 10.5v11M23 10.5v11"/></g><g fill="#fff"><circle cx="16" cy="16" r="3.4"/><circle cx="9" cy="10.5" r="2.2"/><circle cx="23" cy="10.5" r="2.2"/><circle cx="9" cy="21.5" r="2.2"/><circle cx="23" cy="21.5" r="2.2"/></g></svg>`;
  const ICON_MENU = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
  const ICON_MOON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;
  const ICON_SUN = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;

  function build() {
    const body = document.body;
    const root = body.dataset.root != null ? body.dataset.root : body.dataset.chapter ? "../" : "";
    const curSlug = body.dataset.chapter || "";
    const href = (slug) => (slug ? `${root}chapters/${slug}.html` : `${root}index.html`);
    const feedbackUrl = "https://books.euiyun.com/feedback.html?book=networkbook&page=" + encodeURIComponent(location.href);

    // top bar
    const bar = document.createElement("header");
    bar.className = "sb-topbar";
    bar.innerHTML = `
      <button class="sb-btn icon" id="sb-menu" aria-label="챕터 목록">${ICON_MENU}</button>
      <a class="sb-logo" href="${href("")}">${LOGO}<span>NetworkBook <small>네트워크 교과서</small></span></a>
      <span class="spacer"></span>
      <a class="sb-btn series-link" href="https://books.euiyun.com/" aria-label="전체 책 보기" title="전체 책 보기"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h6v14H4zM10 5.5h6v14h-6zM17 7l3-1 2 13-3 1z"/></svg><span>전체 책</span></a>
      <button class="sb-btn icon" id="sb-theme" aria-label="테마 전환"></button>
      <div class="sb-progress" id="sb-progress"></div>`;
    const feedbackButton = document.createElement("a");
    feedbackButton.className = bar.className.replace("-topbar", "-btn") + " icon feedback-button";
    feedbackButton.href = feedbackUrl;
    feedbackButton.target = "_blank";
    feedbackButton.rel = "noopener";
    feedbackButton.setAttribute("aria-label", "독자 의견 보내기");
    feedbackButton.title = "독자 의견 보내기";
    feedbackButton.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 4V6a2 2 0 0 1 2-2z"/><path d="M8 9h8M8 13h5"/></svg>';
    bar.querySelector("[id$='-theme']").before(feedbackButton);
    body.prepend(bar);

    // Search chapter metadata immediately; load section and visual titles on demand.
    const progressBar = bar.querySelector("[id$='-progress']");
    const spacer = bar.querySelector(".spacer");
    const leftNav = document.createElement("div");
    leftNav.className = "book-nav-left";
    leftNav.append(bar.querySelector("[id$='-menu']"), bar.querySelector("a[class$='-logo']"));
    const rightNav = document.createElement("div");
    rightNav.className = "book-nav-right";
    [...bar.children].filter((el) => el !== spacer && el !== progressBar).forEach((el) => rightNav.appendChild(el));
    spacer.remove();
    const search = document.createElement("div");
    search.className = "book-search";
    search.innerHTML = '<svg class="book-search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg><input type="search" aria-label="이 책의 챕터, 섹션, 시뮬레이터, 그림 검색" placeholder="이 책 검색" autocomplete="off"><div class="book-search-results" aria-live="polite"></div>';
    bar.prepend(leftNav);
    bar.insertBefore(search, progressBar);
    bar.insertBefore(rightNav, progressBar);
    const searchInput = search.querySelector("input");
    const searchResults = search.querySelector(".book-search-results");
    const closeSearch = () => { search.classList.remove("open"); searchResults.replaceChildren(); };
    let detailEntries = [];
    let detailsLoaded = false;
    let detailPromise;
    function loadDetails() {
      if (detailPromise) return detailPromise;
      detailPromise = Promise.all(CHAPTERS.map(async (chapter) => {
        try {
          const response = await fetch(href(chapter.slug));
          if (!response.ok) return [];
          const doc = new DOMParser().parseFromString(await response.text(), "text/html");
          const main = doc.querySelector("main.chapter");
          if (!main) return [];
          const entries = [];
          [...main.querySelectorAll("section > h2")].forEach((heading, i) => {
            entries.push({ type: "섹션", title: heading.textContent.trim(), chapter, hash: heading.parentElement.id || `s${i + 1}` });
          });
          [...main.querySelectorAll(".sim")].filter((sim) => sim.querySelector(".sim-head h3")).forEach((sim, i) => {
            entries.push({ type: "시뮬레이터", title: sim.querySelector(".sim-head h3").textContent.trim(), chapter, hash: sim.id || `search-sim-${i + 1}` });
          });
          [...main.querySelectorAll("figure")].filter((figure) => figure.querySelector("figcaption")).forEach((figure, i) => {
            const caption = figure.querySelector("figcaption").textContent.replace(/\s+/g, " ").trim();
            entries.push({ type: "그림", title: caption.slice(0, 140), chapter, hash: figure.id || `search-fig-${i + 1}` });
          });
          return entries;
        } catch (error) { return []; }
      })).then((parts) => { detailEntries = parts.flat(); detailsLoaded = true; renderSearch(); });
      return detailPromise;
    }
    function renderSearch() {
      const words = searchInput.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      searchResults.replaceChildren();
      if (!words.length) { closeSearch(); return; }
      const includesWords = (value) => words.every((word) => value.toLocaleLowerCase().includes(word));
      const chapterMatches = CHAPTERS.filter((c) => includesWords([c.num, c.title, c.desc, ...(c.tags || [])].join(" ")))
        .map((c) => ({ type: "챕터", title: c.title, chapter: c, hash: "" }));
      const detailMatches = detailEntries.filter((entry) => includesWords(entry.title));
      const matches = [
        ...chapterMatches.slice(0, 4),
        ...detailMatches.filter((entry) => entry.type === "섹션").slice(0, 5),
        ...detailMatches.filter((entry) => entry.type === "시뮬레이터").slice(0, 4),
        ...detailMatches.filter((entry) => entry.type === "그림").slice(0, 4),
      ];
      matches.forEach((entry) => {
        const link = document.createElement("a");
        link.href = href(entry.chapter.slug) + (entry.hash ? `#${entry.hash}` : "");
        const title = document.createElement("strong");
        title.textContent = entry.title;
        const context = document.createElement("small");
        context.textContent = `${entry.chapter.num} · ${entry.chapter.title} · ${entry.type}`;
        link.append(title, context);
        searchResults.appendChild(link);
      });
      if (chapterMatches.length + detailMatches.length > matches.length) {
        const more = document.createElement("p");
        more.textContent = `상위 ${matches.length}개 표시 · 검색어를 더 구체적으로 입력해 보세요`;
        searchResults.appendChild(more);
      }
      if (detailPromise && !detailsLoaded) {
        const status = document.createElement("p");
        status.textContent = "섹션·시뮬레이터·그림 목록을 불러오는 중…";
        searchResults.appendChild(status);
      } else if (!matches.length) {
        const empty = document.createElement("p");
        empty.textContent = "검색 결과가 없습니다";
        searchResults.appendChild(empty);
      }
      search.classList.add("open");
    }
    searchInput.addEventListener("input", () => { if (searchInput.value.trim()) loadDetails(); renderSearch(); });
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeSearch(); searchInput.blur(); }
      else if (e.key === "ArrowDown") { const first = searchResults.querySelector("a"); if (first) { e.preventDefault(); first.focus(); } }
      else if (e.key === "Enter") { const first = searchResults.querySelector("a"); if (first) { e.preventDefault(); first.click(); } }
    });
    searchResults.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeSearch(); searchInput.focus(); }
      else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const links = [...searchResults.querySelectorAll("a")];
        const next = links.indexOf(document.activeElement) + (e.key === "ArrowDown" ? 1 : -1);
        e.preventDefault();
        (links[next] || searchInput).focus();
      }
    });
    document.addEventListener("pointerdown", (e) => { if (!search.contains(e.target)) closeSearch(); });


    // drawer
    const drawer = document.createElement("nav");
    drawer.className = "sb-drawer";
    let lastPart = "";
    drawer.innerHTML = `<h4>Chapters</h4><ul class="sb-chlist">
      <li><a href="${href("")}" class="${curSlug ? "" : "active"}"><span class="num">00</span><span>홈 · 로드맵</span></a></li>
      ${CHAPTERS.map((c) => { const head = c.part !== lastPart ? `<li class="part">${c.part}</li>` : ""; lastPart = c.part; return head + `<li><a href="${href(c.slug)}" data-slug="${c.slug}" class="${c.slug === curSlug ? "active" : ""}"><span class="num">${c.num}</span><span class="t">${c.title}</span><i class="sb-st"></i></a></li>`; }).join("")}
    </ul>`;
    const backdrop = document.createElement("div");
    backdrop.className = "sb-drawer-backdrop";
    body.append(backdrop, drawer);
    const toggleDrawer = (o) => body.classList.toggle("drawer-open", o);
    bar.querySelector("#sb-menu").addEventListener("click", () => toggleDrawer(true));
    backdrop.addEventListener("click", () => toggleDrawer(false));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleDrawer(false); });

    // theme toggle
    const tbtn = bar.querySelector("#sb-theme");
    const setIcon = () => (tbtn.innerHTML = NB.isDark() ? ICON_SUN : ICON_MOON);
    setIcon();
    tbtn.addEventListener("click", () => {
      const next = NB.isDark() ? "light" : "dark";
      try { localStorage.setItem("nb-theme", next); } catch (e) {}
      applyTheme(next); setIcon();
    });

    // progress
    const prog = bar.querySelector("#sb-progress");
    const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; prog.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%"; };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();

    // chapter page extras
    const main = document.querySelector("main.chapter");
    if (main) {
      // Give search results stable anchors even when the source has no id.
      [...main.querySelectorAll(".sim")].filter((sim) => sim.querySelector(".sim-head h3")).forEach((sim, i) => { if (!sim.id) sim.id = `search-sim-${i + 1}`; });
      [...main.querySelectorAll("figure")].filter((figure) => figure.querySelector("figcaption")).forEach((figure, i) => { if (!figure.id) figure.id = `search-fig-${i + 1}`; });
      if (/^#(?:s\d+|search-(?:sim|fig)-)/.test(location.hash)) {
        requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
      }
      // numbered h2 + TOC
      const layout = document.createElement("div");
      layout.className = "sb-layout";
      main.parentNode.insertBefore(layout, main);
      layout.appendChild(main);
      const toc = document.createElement("aside");
      toc.className = "sb-toc";
      const h2s = [...main.querySelectorAll("section > h2")];
      let n = 0;
      toc.innerHTML = "<h4>ON THIS PAGE</h4>" + h2s.map((h, i) => {
        const sec = h.parentElement;
        if (!sec.id) sec.id = "s" + (i + 1);
        const numbered = !sec.classList.contains("keypoints") && !sec.classList.contains("quiz-sec") && !sec.hasAttribute("data-nonum");
        if (numbered && !h.querySelector(".h-num")) { n++; h.insertAdjacentHTML("afterbegin", `<span class="h-num">${String(n).padStart(2, "0")}</span>`); }
        return `<a href="#${sec.id}">${h.textContent.replace(/^\d\d/, "").trim()}</a>`;
      }).join("");
      layout.appendChild(toc);
      const links = [...toc.querySelectorAll("a")];
      if (window.IntersectionObserver && h2s.length) {
        const io = new IntersectionObserver((es) => {
          es.forEach((e) => { if (e.isIntersecting) { links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)); } });
        }, { rootMargin: "-20% 0px -70% 0px" });
        h2s.forEach((h) => io.observe(h.parentElement));
      }

      // pager
      const idx = CHAPTERS.findIndex((c) => c.slug === curSlug);
      const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
      const next = idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;
      const pager = document.createElement("nav");
      pager.className = "sb-pager";
      pager.innerHTML =
        (prev ? `<a class="prev" href="${href(prev.slug)}"><small>← 이전 · ${prev.num}</small>${prev.title}</a>` : `<a class="prev" href="${href("")}"><small>← 처음으로</small>홈 · 로드맵</a>`) +
        (next ? `<a class="next" href="${href(next.slug)}"><small>다음 · ${next.num} →</small>${next.title}</a>` : "");
      layout.after(pager);
    }
    const foot = document.createElement("footer");
    foot.className = "sb-foot";
    foot.innerHTML = `NetworkBook — 누구나 읽는 인터랙티브 네트워크 교과서 · 시뮬레이터는 이해를 돕기 위해 단순화한 모델입니다.
      <br>© 2026 <a href="https://github.com/geniuskey">geniuskey</a> ·
      콘텐츠 <a href="https://creativecommons.org/licenses/by/4.0/deed.ko" rel="license">CC BY 4.0</a> ·
      코드 <a href="https://github.com/geniuskey/networkbook/blob/main/LICENSE-MIT">MIT</a> ·
      <a href="https://github.com/geniuskey/networkbook/blob/main/LICENSE.md">라이선스 안내</a>`;
    const feedbackLink = document.createElement("a");
    feedbackLink.href = feedbackUrl;
    feedbackLink.target = "_blank";
    feedbackLink.rel = "noopener";
    feedbackLink.textContent = "독자 의견";
    foot.append(" · ", feedbackLink);
    body.appendChild(foot);

    // quiz
    document.querySelectorAll(".quiz-q").forEach((q) => {
      const opts = [...q.querySelectorAll("button.opt")];
      opts.forEach((b) => b.addEventListener("click", () => {
        opts.forEach((o) => { o.disabled = true; if (o.hasAttribute("data-correct")) o.classList.add("right"); });
        if (!b.hasAttribute("data-correct")) b.classList.add("wrong");
        q.classList.add("done");
        q.dispatchEvent(new CustomEvent("answered", { bubbles: true, detail: { correct: b.hasAttribute("data-correct") } }));
      }));
    });


    // 학습 진도: 읽은 비율, 마지막 섹션, 퀴즈 답
    const paintDrawer = () => {
      const ch = NB.progress.load().ch || {};
      drawer.querySelectorAll("a[data-slug]").forEach((a) => {
        const c = ch[a.dataset.slug], st = a.querySelector(".sb-st");
        st.className = "sb-st" + (c && c.done ? " done" : c && c.pct > 2 ? " part" : "");
        st.style.setProperty("--p", (c ? Math.round(c.pct) : 0) + "%");
        st.title = c && c.done ? "다 읽음" : c && c.pct > 2 ? `${Math.round(c.pct)}% 읽음` : "";
      });
    };
    paintDrawer();
    if (main && curSlug) {
      const secs = [...main.querySelectorAll("section[id]")];
      const quizQs = [...main.querySelectorAll(".quiz-q")];
      const saved = NB.progress.get(curSlug);
      // 지난 퀴즈 답 복원
      if (saved && saved.ans) {
        quizQs.forEach((q, qi) => {
          const pick = saved.ans[qi]; if (pick == null) return;
          const opts = [...q.querySelectorAll("button.opt")]; const b = opts[pick]; if (!b) return;
          opts.forEach((o) => { o.disabled = true; if (o.hasAttribute("data-correct")) o.classList.add("right"); });
          if (!b.hasAttribute("data-correct")) b.classList.add("wrong");
          q.classList.add("done");
        });
        const qs = main.querySelector(".quiz-sec .quiz");
        if (qs && Object.keys(saved.ans).length) {
          const bar = document.createElement("div"); bar.className = "quiz-restore";
          bar.innerHTML = `<span>지난번에 푼 답을 불러왔습니다.</span><button class="btn" type="button">다시 풀기</button>`;
          bar.querySelector("button").onclick = () => {
            NB.progress.update(curSlug, (c) => { c.ans = {}; });
            quizQs.forEach((q) => { q.classList.remove("done"); q.querySelectorAll("button.opt").forEach((o) => { o.disabled = false; o.classList.remove("right", "wrong"); }); });
            bar.remove();
          };
          qs.before(bar);
        }
      }
      quizQs.forEach((q, qi) => {
        const opts = [...q.querySelectorAll("button.opt")];
        opts.forEach((b, bi) => b.addEventListener("click", () => NB.progress.update(curSlug, (c) => { c.ans = c.ans || {}; c.ans[qi] = bi; })));
      });
      // 읽은 위치 기록
      let tmr = 0;
      const record = () => {
        tmr = 0;
        const h = document.documentElement.scrollHeight - innerHeight;
        const pct = h > 0 ? Math.min(100, (scrollY / h) * 100) : 100;
        let sec = null; for (const s of secs) { if (s.getBoundingClientRect().top < innerHeight * 0.35) sec = s.id; }
        NB.progress.update(curSlug, (c, d) => {
          c.pct = Math.max(c.pct || 0, pct); c.t = Date.now();
          if (sec) c.sec = sec;
          if (c.pct >= 92) c.done = true;
          d.last = { slug: curSlug, sec: c.sec || null, t: c.t };
        });
        paintDrawer();
      };
      addEventListener("scroll", () => { if (!tmr) tmr = setTimeout(record, 600); }, { passive: true });
      setTimeout(record, 1500);
      // 이어 읽기 안내
      if (saved && saved.sec && !location.hash && !saved.done && secs.length && saved.sec !== secs[0].id) {
        const target = document.getElementById(saved.sec);
        if (target) {
          const h = target.querySelector("h2");
          const toast = document.createElement("div"); toast.className = "sb-resume";
          toast.innerHTML = `<span>지난번에 <b>${(h ? h.textContent.replace(/^\d\d/, "") : "").trim()}</b>까지 읽었어요.</span><button class="btn primary" type="button">이어 읽기</button><button class="x" type="button" aria-label="닫기">×</button>`;
          const close = () => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); };
          toast.querySelector(".primary").onclick = () => { target.scrollIntoView({ behavior: "smooth" }); close(); };
          toast.querySelector(".x").onclick = close;
          body.appendChild(toast); requestAnimationFrame(() => toast.classList.add("show"));
          setTimeout(close, 12000);
        }
      }
    }

    // 용어 툴팁: 본문의 .term에 용어집 설명을 붙인다
    if (main && curSlug !== "glossary" && main.querySelector(".term")) {
      const bind = () => {
        const T = window.NB_TERMS, AL = window.NB_TERM_ALIAS || {};
        if (!T) return;
        const norm = (x) => x.replace(/\s+/g, "").toLowerCase();
        const idx = new Map();
        const put = (k, t) => { k = norm(k); if (!k) return; const l = idx.get(k) || []; if (!l.includes(t)) l.push(t); idx.set(k, l); };
        T.forEach((t) => { [t[0], t[0].replace(/\(.*?\)/g, ""), t[1], t[1].replace(/\(.*?\)/g, "")].forEach((k) => put(k, t)); t[0].split(/[\/·]/).forEach((k) => put(k, t)); });
        const find = (txt) => { const a = AL[txt.trim()]; const l = idx.get(norm(a || txt)); if (!l) return null; return l.find((t) => t[3] === curSlug) || l[0]; };
        const tip = document.createElement("div"); tip.className = "sb-tip"; tip.id = "sb-tip"; tip.setAttribute("role", "tooltip"); body.appendChild(tip);
        let cur = null, hideT = 0;
        const esc = (x) => x.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
        const show = (el, t) => {
          clearTimeout(hideT); cur = el;
          const c = CHAPTERS.find((x) => x.slug === t[3]);
          tip.innerHTML = `<div class="tt-h"><b>${esc(t[0])}</b><span>${esc(t[1])}</span></div><p>${esc(t[2])}</p><div class="tt-l">` +
            (c && c.slug !== curSlug ? `<a href="${href(c.slug)}">${c.num}장 ${esc(c.title)}에서 자세히 →</a>` : "") +
            `<a href="${href("glossary")}?q=${encodeURIComponent(t[0].replace(/\(.*?\)/g, ""))}">용어집</a></div>`;
          tip.classList.add("show"); el.setAttribute("aria-describedby", "sb-tip");
          const r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
          let x = Math.max(12, Math.min(innerWidth - tw - 12, r.left + r.width / 2 - tw / 2));
          let y = r.top - th - 10; if (y < 70) y = r.bottom + 10;
          tip.style.left = x + "px"; tip.style.top = y + "px";
        };
        const hide = (now) => { clearTimeout(hideT); hideT = setTimeout(() => { tip.classList.remove("show"); if (cur) cur.removeAttribute("aria-describedby"); cur = null; }, now ? 0 : 220); };
        tip.addEventListener("mouseenter", () => clearTimeout(hideT));
        tip.addEventListener("mouseleave", () => hide());
        main.querySelectorAll(".term").forEach((el) => {
          const t = find(el.textContent); if (!t) return;
          el.classList.add("has-tip"); el.tabIndex = 0;
          el.addEventListener("mouseenter", () => show(el, t));
          el.addEventListener("mouseleave", () => hide());
          el.addEventListener("focus", () => show(el, t));
          el.addEventListener("blur", () => hide());
          el.addEventListener("click", (e) => { e.stopPropagation(); cur === el && tip.classList.contains("show") ? hide(true) : show(el, t); });
        });
        document.addEventListener("click", (e) => { if (!tip.contains(e.target)) hide(true); });
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(true); });
        addEventListener("scroll", () => { if (cur) hide(true); }, { passive: true });
      };
      if (window.NB_TERMS) bind();
      else { const sc = document.createElement("script"); sc.src = root + "js/terms.js"; sc.onload = bind; document.head.appendChild(sc); }
    }

    // KaTeX
    const renderMath = () => {
      if (window.renderMathInElement) {
        renderMathInElement(document.body, {
          delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\(", right: "\\)", display: false }, { left: "\\[", right: "\\]", display: true }],
          throwOnError: false,
          ignoredClasses: ["no-math"],
        });
      }
    };
    if (window.renderMathInElement) renderMath();
    else window.addEventListener("load", renderMath);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

// Simulator deep links: add a shareable # link to each simulator heading.
(function () {
  function addSimulatorLinks() {
    document.querySelectorAll(".sim[id] > .sim-head").forEach((head) => {
      if (head.querySelector(".sim-link")) return;
      const link = document.createElement("a");
      link.className = "sim-link";
      link.href = "#" + head.parentElement.id;
      link.textContent = "#";
      link.title = "이 시뮬레이터로 가는 링크";
      link.setAttribute("aria-label", "이 시뮬레이터로 가는 링크");
      head.appendChild(link);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addSimulatorLinks, { once: true });
  } else {
    addSimulatorLinks();
  }
})();
