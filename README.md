# 이상화 Portfolio

GitHub Pages에 바로 배포할 수 있는 정적 포트폴리오입니다.

## Layout

- 상단 **에디토리얼 연표**: 큰 이름, 역할/연락처, 2018–현재 연표를 하나의 표지처럼 구성했습니다. Education · AI 사용 · Work Experience · Projects를 동일한 월 축에 표시하되, 막대 안 텍스트와 다색 UI를 없애고 완료(회색) · 진행 중(코발트) · 대표 작업(검정) · 아카이브(회색 점)만 사용합니다. 항목은 hover/focus 시 제목과 기간이 나타나고, 누르면 해당 패널·항목으로 이동합니다.
- 사건이 없는 2019–2021 구간은 축에서 생략하고 `2018 // 2022`로 이어 붙였습니다. Projects는 여러 겹의 기간 막대 대신 한 연결선 위에 연도별 제작 순서대로 점을 배치하는 단일 트랙입니다. 대표 작업은 검은 점, 나머지는 빈 점으로 구분하며 정확한 기간은 tooltip에 유지합니다. 현재 월과 축 끝은 실행 시점의 날짜로 계산합니다. 데이터는 `script.js`의 `CHRONO_TRACKS`에서 관리합니다.
- 좌측 **섹션 인덱스** + 우측 **컨텐트 패널**: Overview(히어로 + 핵심 성과 + AMA + Profile + Contact) · AI & Workflow · Experience · Selected Work · Project Archive. 해시(`#selected-work`, `#project-syrs` 등)로 딥링크되며 뒤로 가기도 동작합니다.
- **Selected Work**는 한눈에 보는 리스트(기간·제목·성과 칩)이고, 항목을 누르면 문제 해결 사례·담당 범위·기술 스택·화면이 펼쳐집니다. 케이스 스터디 모달 6종은 그대로 유지됩니다.
- 900px 이하에서는 섹션 인덱스가 상단 가로 탭으로 바뀝니다. 760px 이하에서는 연표를 과감히 숨기고 이름·역할 다음에 바로 소개와 작업으로 진입합니다.

## Files

- `index.html`: 에디토리얼 masthead, 연표 컨테이너, 섹션 네비, 5개 패널(AMA 탭, Selected Work 아코디언, 케이스 스터디 모달 6종, 코드 발췌 토글 포함)
- `styles.css`: Archivo/Pretendard/IBM Plex Mono 타이포 역할, 연표·섹션 인덱스·패널, 컨테이너 쿼리 기반 반응형
- `script.js`: 연표 렌더링(`CHRONO_TRACKS`), 해시 라우팅(패널 전환·딥링크), Selected Work 아코디언, AMA 탭, 케이스 스터디 모달, 이미지 확대 보기
- `assets/images/`: WebP로 최적화한 프로젝트 이미지
- `DESIGN_REFERENCES.md`: 이번 개편에서 검토한 실제 포트폴리오 레퍼런스와 적용한 패턴

## GitHub Pages

1. 이 폴더를 GitHub 저장소에 push합니다.
2. Repository `Settings` → `Pages`로 이동합니다.
3. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
4. Branch를 `main` 또는 `master`, folder를 `/root`로 설정합니다.

빌드 과정이 없는 정적 사이트라 별도 패키지 설치 없이 배포됩니다.
