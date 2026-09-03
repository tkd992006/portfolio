# Timeline portfolio references

이번 개편은 한 사이트를 그대로 복제하지 않고, 아래 실제 포트폴리오의 공통 패턴을 조합했습니다.

## Primary direction

- [Heejae Bae](https://h2zae.github.io/): 초대형 이름, 모노스페이스 메타, 병렬 연표, 완료/진행 상태 문법, cobalt 한 가지 강조색
- [Mike Matas](https://mikematas.com/): 시기별 대표 작업을 실제 제품 화면으로 기억하게 만드는 방식
- [Matt Olpinski — A Visual History of My Design Career](https://mattolpinski.com/portfolio/): 연도 인덱스와 중요 작업/보조 작업의 크기 계층
- [Brittany Chiang](https://brittanychiang.com/): 기간 → 역할 → 성과 → 기술 순서의 높은 스캔성, 절제된 단일 강조색
- [William Bout](https://williambout.me/): 짧은 경력 요약과 작업 피드를 자연스럽게 연결하는 방식
- [Natalie Almosa](https://nataliealmosa.ca/): 과한 연결선 없이 연도·회사·직함을 여백으로 묶는 편집형 구성
- [Matthew Blode](https://blode.co/): 큰 타이포, 구간별 리듬, 텍스트 중심의 경력 서사
- [Jonathan Moore](https://jonathanmoore.com/): 작은 상태 라벨과 참조 번호를 활용한 데이터 로그 미감
- [Ryan Sael](https://www.ryansael.com/): 연도를 하나의 챕터처럼 다루는 스크롤 서사

## Additional ideas reviewed

- [Wayside Studio](https://www.wayside.studio/): 프로젝트와 기록을 발생 순서대로 섞은 살아 있는 아카이브
- [Claire Harr](https://www.claireharr.com/): 겹치는 경력을 기간 그래프로 요약하는 방식
- [Lynn Fisher — Site Archive](https://lynnandtonic.com/archive/): 포트폴리오 자체의 버전을 시간 여행처럼 보존하는 방식
- [GMUNK — Everything](https://gmunk.com/Everything): 긴 경력의 전체 작업을 필터 가능한 모자이크로 보여주는 방식
- [Spencer Gabor](https://spencergabor.work/): 보조 프로젝트를 가로 흐름과 컬러 인터랙션으로 탐색하는 방식
- [Flavia Bernardes — Interactive Career Timeline](https://www.flaviabernardes.com/project-3-career-timeline): 연도 스크러버로 사건을 점진적으로 공개하는 방식

## Reference collections

- [One Page Love — Timeline sites](https://onepagelove.com/tag/timeline)
- [Figma — 23 portfolio website examples](https://www.figma.com/resource-library/portfolio-website-examples/)

## Applied here

- Paper `#E7E8E2`, ink `#171B18`, cobalt `#2D4BD2` 중심의 저채도 팔레트
- Archivo(이름/큰 제목), Pretendard(한국어 본문), IBM Plex Mono(기간/메타)의 역할 분리
- 막대 내부 텍스트 제거, hover/focus tooltip으로 정보 공개
- 완료=회색, 진행 중=cobalt gradient, 대표 작업=검정, 연도만 아는 사건=점
- 사건이 없는 2019–2021은 `//` 단절 표시로 압축하고, 2022 이후는 동일 비율의 월 축 유지
- Projects는 여러 줄 대신 연결선 + 순차 점 한 트랙으로 압축
- 760px 이하에서는 연표 전체를 제거해 본문 진입을 우선
