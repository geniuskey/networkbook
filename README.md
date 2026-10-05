# NetworkBook — 누구나 읽는 인터랙티브 네트워크 교과서

패킷이 지구 반대편까지 가는 길. 신호와 프로토콜에서 구리선·광섬유·전파·위성, IP와 라우팅, TCP, Wi-Fi와 5G, 데이터센터와 클라우드,
그리고 이 모두를 움직이는 **통신 반도체**(SerDes, 스위치 ASIC, RF 칩, 레이저·실리콘 포토닉스)까지 — 네트워크를 배운 적 없는 사람도
**직접 만지며** 이해하도록 만든 한국어 웹 교과서입니다. 26개 챕터, 134개의 시뮬레이터·인터랙티브 차트(3D 모형 포함), 104개의 개념 그림,
50개의 “예측해 보기” 실험, 용어 459개와 종합 퀴즈 75문항으로 구성됩니다.

[ComputerBook](https://github.com/geniuskey/computerbook)과 같은 구조와 디자인 시스템을 따르는 시리즈입니다.

## 실행
빌드 과정이 없는 정적 사이트입니다.

```bash
python3 -m http.server 8000   # → http://localhost:8000
```
`index.html`을 브라우저로 바로 열어도 동작합니다. 글꼴만 CDN에서 불러오며, 오프라인이면 시스템 글꼴로 대체됩니다.

## 구성
| 장 | 파일 | 주제 | 주요 시뮬레이터 |
|---|---|---|---|
| 01 | chapters/intro.html | 네트워크란 무엇인가 | 연결 수와 교환기, 토폴로지 고장 실험, 전송 시간 = 지연 + 크기/대역폭, 빛의 속도 지도 |
| 02 | chapters/signal.html | 신호와 정보 | 아날로그 vs 디지털 중계, 푸리에 합성, 데시벨 예산, 섀넌 용량, 해밍 코드 |
| 03 | chapters/layers.html | 프로토콜과 계층 | 캡슐화와 오버헤드, 와이어샤크식 패킷 해부(실제 체크섬), 중간 장비가 보는 필드 |
| 04 | chapters/copper.html | 구리선: 전화선에서 이더넷까지 | 차동 신호, 감쇠·누화, 라인 코딩, 눈 모양 그림, DSL 거리와 속도 |
| 05 | chapters/optical.html | 광통신과 해저 케이블 | 전반사 광선 추적, 분산, 감쇠 스펙트럼, 광 링크 예산, WDM 용량, PON |
| 06 | chapters/ethernet.html | 이더넷과 스위치 | MAC 주소 해석, CSMA/CD, 스위치 MAC 학습, 브로드캐스트 폭풍과 STP |
| 07 | chapters/ip.html | IP 주소와 서브넷 | 서브넷 계산기, VLSM, DHCP, ARP, NAT, IPv6 축약 변환 |
| 08 | chapters/routing.html | 라우팅: 길 찾기 | 최장 접두사 일치, 링크 상태 vs 거리 벡터 수렴(무한대로 세기), BGP 하이재킹, traceroute |
| 09 | chapters/tcp.html | TCP와 UDP | 3방향 핸드셰이크, 슬라이딩 윈도우, 혼잡 제어 창(Tahoe/Reno/CUBIC), QUIC |
| 10 | chapters/apps.html | DNS, 웹, 스트리밍 | DNS 질의 경로, HTTP/1.1·2·3 폭포수, CDN, 적응형 비트레이트 |
| 11 | chapters/radio.html | 전파의 기초 | 주파수↔파장, 안테나 패턴, 링크 버짓, 다중 경로 페이딩, 도플러 |
| 12 | chapters/modulation.html | 변조, OFDM, MIMO | QAM 성좌도와 잡음, 적응 변조, OFDM 직교성, OFDMA 스케줄러, 빔포밍 |
| 13 | chapters/wifi.html | Wi-Fi와 근거리 무선 | 채널 배치와 간섭, CSMA/CA, 거리별 속도, 무선 기술 고르기 |
| 14 | chapters/cellular.html | 이동통신: 1G에서 6G까지 | 육각 셀과 주파수 재사용, 핸드오버, 뉴멀로지, 대역별 커버리지 |
| 15 | chapters/satellite.html | 위성 통신과 우주 인터넷 | 궤도 계산기, 위성 군집 커버리지, 레이저 링크 vs 해저 케이블, 비 감쇠, GPS |
| 16 | chapters/serdes.html | SerDes와 고속 인터페이스 | 채널 손실, NRZ vs PAM4, 이퀄라이저(FFE/CTLE/DFE)로 눈 열기, CDR, 반사 |
| 17 | chapters/netchips.html | 네트워크 칩: 스위치와 NIC | 스위치 3D 분해, 칩 용량 계산기, 초당 패킷 수, TCAM 검색 |
| 18 | chapters/rfchips.html | RF 반도체: 휴대폰 속 통신 칩 | 믹서와 이미지, PLL 위상 잡음, PA 왜곡과 DPD, 잡음 지수 연쇄, SAW/BAW 필터 |
| 19 | chapters/photonics.html | 광 반도체와 실리콘 포토닉스 | 레이저 L-I 곡선, 밴드갭→파장, 마하-젠더 변조기, 링 공진기, CPO 전력 |
| 20 | chapters/datacenter.html | 데이터센터 네트워크 | 데이터센터 3D, Clos 계산기, ECMP, 테일 지연, 링 all-reduce |
| 21 | chapters/cloud.html | 클라우드 네트워크 | VPC 도달성 점검, VXLAN, 로드 밸런서, 일관된 해싱, 글로벌 부하 분산 |
| 22 | chapters/security.html | 네트워크 보안 | 디피-헬먼, TLS 핸드셰이크, 방화벽 규칙, DDoS 증폭 |
| 23 | chapters/ops.html | 측정과 문제 해결 | 지연 분해, ping, BDP, 큐와 버퍼블로트, 토큰 버킷, 장애 추적 게임, 가용성 |
| 24 | chapters/journey.html | 영상 통화 한 번의 여행 | 패킷 17단계 여행, 지연 예산, 지터 버퍼, 비트레이트 적응 |
| 25 | chapters/history.html | 통신의 역사와 미래 | 모스 부호, 시대별 타임라인, 대역폭 성장 곡선, 행성 간 지연 |
| 26 | chapters/glossary.html | 용어집 & 종합 퀴즈 | 용어 459개 검색, 75문항 종합 퀴즈 |

공통 코드: `css/style.css`(디자인 토큰, 라이트/다크), `js/common.js`(내비게이션, 캔버스·차트·3D 헬퍼, 전역 `NB`, 학습 진도 저장, 용어 툴팁), `js/terms.js`(용어집 데이터, 본문 `.term` 툴팁과 용어집이 함께 사용).
읽은 위치·퀴즈 답은 서버 없이 브라우저의 localStorage에만 저장됩니다.
챕터 작성 규칙은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.
챕터를 추가하거나 제목·설명을 바꾼 뒤에는 `python3 tools/seo.py`로 canonical/OG/JSON-LD 태그와 `sitemap.xml`을 다시 만듭니다.

시뮬레이터는 이해를 돕기 위해 단순화한 모델이며, 수치는 대표적인 크기 수준입니다.

## 라이선스

코드는 [MIT](LICENSE-MIT), 교재 콘텐츠는 [CC BY 4.0](LICENSE-CC-BY-4.0)으로 제공됩니다. 자세한 범위는 [라이선스 안내](LICENSE.md)를 참고하세요.
