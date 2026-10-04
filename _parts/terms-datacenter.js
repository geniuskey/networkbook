    ["ToR 스위치", "Top of Rack switch", "서버 랙 맨 위에 두어 그 랙의 서버들을 모으는 스위치. 리프-스파인 구조에서 리프 역할을 한다.", "datacenter"],
    ["남북 트래픽", "North-south traffic", "데이터센터 바깥(사용자, 인터넷)과 안쪽 서버 사이를 오가는 트래픽.", "datacenter"],
    ["동서 트래픽", "East-west traffic", "데이터센터 안의 서버와 서버 사이를 오가는 트래픽. 분산 서비스와 AI 학습 때문에 남북 트래픽보다 훨씬 많다.", "datacenter"],
    ["리프-스파인", "Leaf-spine", "모든 리프(ToR) 스위치를 모든 스파인 스위치에 연결한 2단 Clos 구조. 어느 두 서버 사이든 같은 홉 수와 여러 개의 같은 길이 경로를 준다.", "datacenter"],
    ["래딕스", "Radix", "스위치 한 대가 가진 포트 수. 래딕스가 클수록 같은 단 수로 더 많은 서버를 연결할 수 있다.", "datacenter"],
    ["팻 트리", "Fat tree", "위로 올라가도 총 대역폭이 줄지 않게 만든 3단 Clos 구조. 포트 k개 스위치로 서버 k³/4대를 막힘 없이 잇는다.", "datacenter"],
    ["오버서브스크립션", "Oversubscription", "스위치의 아래쪽(서버 쪽) 대역폭과 위쪽 대역폭의 비. 3:1이면 모두가 동시에 보낼 때 1/3 속도만 낼 수 있다.", "datacenter"],
    ["이분 대역폭", "Bisection bandwidth", "네트워크의 노드를 절반씩 둘로 나눌 때, 두 무리 사이로 동시에 흐를 수 있는 최소(가장 나쁜 분할 기준) 대역폭.", "datacenter"],
    ["ECMP", "Equal-Cost Multi-Path", "길이가 같은 여러 경로에 트래픽을 나누는 라우팅. 보통 5-튜플 해시로 흐름 단위로 경로를 고른다.", "datacenter"],
    ["코끼리 흐름", "Elephant flow", "오래 지속되며 대용량을 나르는 소수의 흐름. 짧은 생쥐 흐름(mice flow)과 대비되며 ECMP 불균형의 주범이다.", "datacenter"],
    ["테일 지연", "Tail latency", "응답 시간 분포의 꼬리(p99, p99.9 등). 팬아웃 요청은 가장 느린 응답을 기다리므로 꼬리가 전체 속도를 좌우한다.", "datacenter"],
    ["인캐스트", "Incast", "많은 서버의 응답이 동시에 한 수신자에게 몰려 스위치 출구 버퍼가 넘치고 손실과 재전송 지연이 생기는 현상.", "datacenter"],
    ["RDMA", "Remote Direct Memory Access", "NIC가 상대 컴퓨터의 메모리를 CPU와 커널을 거치지 않고 직접 읽고 쓰는 기술. 지연이 µs 수준으로 줄어든다.", "datacenter"],
    ["InfiniBand", "InfiniBand", "고성능 컴퓨팅용으로 설계된 무손실 네트워크 기술. 크레딧 기반 흐름 제어와 RDMA를 기본으로 한다.", "datacenter"],
    ["RoCEv2", "RDMA over Converged Ethernet v2", "RDMA를 UDP/IP에 실어 이더넷 데이터센터망 위에서 쓰는 방식. 무손실에 가깝게 하려고 PFC와 ECN을 함께 쓴다.", "datacenter"],
    ["PFC", "Priority Flow Control", "버퍼가 차면 앞 장비에게 특정 우선순위 클래스의 전송을 잠시 멈추라고 알리는 이더넷 흐름 제어(IEEE 802.1Qbb).", "datacenter"],
    ["DCQCN", "Data Center Quantized Congestion Notification", "ECN 표시를 받으면 RDMA NIC가 하드웨어에서 송신 속도를 줄였다가 회복하는 혼잡 제어 방식.", "datacenter"],
    ["올리듀스", "All-reduce", "모든 참가자의 데이터를 더해(또는 다른 연산으로 합쳐) 그 결과를 모두가 나눠 갖는 집합 통신. 분산 AI 학습의 핵심 연산이다.", "datacenter"],
    ["스케일업과 스케일아웃", "Scale-up / Scale-out", "AI 클러스터에서 스케일업은 랙 안 GPU를 NVLink 같은 초고속 연결로 묶는 것, 스케일아웃은 서버·랙 사이를 이더넷/InfiniBand 백엔드망으로 잇는 것.", "datacenter"],
    ["레일 최적화", "Rail-optimized", "모든 서버의 같은 번호 GPU를 같은 레일 스위치에 연결하는 AI 클러스터 배선 방식. 집합 통신 트래픽이 한 홉에서 끝난다.", "datacenter"],
// ALIAS "Clos 네트워크": "리프-스파인"
// ALIAS "링 올리듀스": "올리듀스"
// ALIAS "스케일업": "스케일업과 스케일아웃"
// ALIAS "스케일아웃": "스케일업과 스케일아웃"
