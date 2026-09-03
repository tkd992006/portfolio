# 이상화 Portfolio

GitHub Pages에 바로 배포할 수 있는 정적 포트폴리오입니다.

## Versions

| URL | 내용 |
| --- | --- |
| `/` | 최신(v3): 무스크롤 앱 셸 + 페이퍼·코발트 디자인 |
| `/v2/` | 다크 테마 앱 셸(같은 구조, 이전 안) |
| `/v1/` | 원본 롱스크롤 사이트(재설계 이전, 커밋 `3ba0eb5` 기준) |

`v1/`, `v2/`는 독립된 정적 폴더로, 이미지는 루트의 `assets/`를 `../assets/`로 참조합니다.

## Layout

뷰포트 안에서 패널을 전환하는 앱 셸입니다(페이지 스크롤 없음, 900px 이하에서는 일반 스크롤).

- **마스트헤드**: 이름(Archivo), 역할·스택(IBM Plex Mono), 이메일·GitHub.
- **연표**: Education · AI tools · Work(2줄) · Projects 네 트랙을 2018→현재 월 축에 얇은 막대(기간)와 점(연 단위 프로젝트)으로 표시합니다. 사건이 없는 2019–2021은 `//` 단절로 생략합니다. 막대에 hover하면 이름·기간 툴팁, 클릭하면 해당 패널·항목으로 이동합니다. 데이터는 `script.js`의 `CHRONO_TRACKS`(`start`/`end`는 `YYYY-MM` 또는 `now`, 연 단위는 `year`, 연 단위 범위는 `approx: true`).
- **좌측 인덱스 + 우측 패널**: Who Am I(소개·AMA) · AI Experience · Education + Work(Education·Work·Skills) · Selected Work · Portfolio. 해시(`#selected-work`, `#project-syrs`, `#portfolio-hashmoss` 등)로 딥링크되며 뒤로 가기도 동작합니다.
- **시트(dialog)**: Selected Work 행과 Portfolio 카드를 누르면 상세가 열립니다. 케이스 스터디 6종은 시트 안에서 열리며, 상단 탭 바(전체 단계 + 현재 언더라인)와 하단 이전/다음으로 한 단계씩 봅니다.

## Files

- `index.html`: 마스트헤드, 연표 컨테이너, 인덱스 레일, 5개 패널, 프로젝트·포트폴리오 시트 13종, 케이스 스터디 모달 6종, 라이트박스
- `styles.css`: 앱 셸·연표·패널·시트 스타일 + 케이스 스터디 문서 컴포넌트 스타일, 반응형
- `script.js`: 연표 렌더링(`CHRONO_TRACKS`), 해시 라우팅, 시트/모달/라이트박스, 케이스 스터디 스텝퍼, AMA 탭
- `assets/images/`: WebP로 최적화한 프로젝트 이미지

