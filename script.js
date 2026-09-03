// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const closeButton = lightbox?.querySelector(".lightbox-close");

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;

    const imagePath = button.getAttribute("data-lightbox");
    const image = button.querySelector("img");
    if (!imagePath) return;
    lightboxImage.src = imagePath;
    lightboxImage.alt = image?.alt || "포트폴리오 이미지";
    lightbox.showModal();
  });
});

closeButton?.addEventListener("click", () => {
  lightbox?.close();
});

lightbox?.addEventListener("close", () => {
  lightboxImage?.removeAttribute("src");
});

// backdrop 닫기: 모달 안 텍스트를 드래그하다 backdrop 위에서 놓아도 닫히지 않도록
// press와 release가 모두 backdrop에서 일어난 경우에만 닫는다.
const enableBackdropClose = (dialog) => {
  let pressedOnBackdrop = false;
  dialog.addEventListener("pointerdown", (event) => {
    pressedOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener("click", (event) => {
    if (pressedOnBackdrop && event.target === dialog) {
      dialog.close();
    }
    pressedOnBackdrop = false;
  });
};

if (lightbox) enableBackdropClose(lightbox);

// ---------------------------------------------------------------------------
// AMA tabs + follow-up toggles
// ---------------------------------------------------------------------------
const amaQuestions = document.querySelectorAll("[data-ama-target]");
const amaAnswers = document.querySelectorAll(".ama-answer");
const amaFollowupToggles = document.querySelectorAll(".ama-followup-toggle");

const closeFollowup = (followup) => {
  followup.classList.remove("is-open");
  followup.querySelector(".ama-followup-toggle")?.setAttribute("aria-expanded", "false");
};

const activateAmaQuestion = (question, shouldFocus = false) => {
  const targetId = question.getAttribute("data-ama-target");

  amaQuestions.forEach((item) => {
    const isSelected = item === question;
    item.classList.toggle("is-active", isSelected);
    item.setAttribute("aria-selected", String(isSelected));
    item.tabIndex = isSelected ? 0 : -1;
  });

  amaAnswers.forEach((answer) => {
    const isSelected = answer.id === targetId;
    answer.classList.toggle("is-active", isSelected);
    answer.hidden = !isSelected;
  });

  document.querySelectorAll(".ama-followup.is-open").forEach(closeFollowup);

  if (shouldFocus) {
    question.focus();
  }
};

amaQuestions.forEach((question, questionIndex) => {
  question.addEventListener("click", () => {
    activateAmaQuestion(question);
  });

  question.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    let nextIndex = questionIndex;

    if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (questionIndex + 1) % amaQuestions.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) {
      nextIndex = (questionIndex - 1 + amaQuestions.length) % amaQuestions.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = amaQuestions.length - 1;

    activateAmaQuestion(amaQuestions[nextIndex], true);
  });
});

amaFollowupToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const followup = toggle.closest(".ama-followup");
    const group = toggle.closest(".ama-followups");
    if (!followup || !group) return;

    const shouldOpen = !followup.classList.contains("is-open");

    group.querySelectorAll(".ama-followup.is-open").forEach(closeFollowup);

    followup.classList.toggle("is-open", shouldOpen);
    toggle.setAttribute("aria-expanded", String(shouldOpen));
  });
});

// ---------------------------------------------------------------------------
// Case study modals
// ---------------------------------------------------------------------------
const caseOpenButtons = document.querySelectorAll("[data-case-open]");
const caseModals = document.querySelectorAll(".case-modal");
const caseReturnFocus = new WeakMap();

caseOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-case-open");
    const caseModal = targetId ? document.getElementById(targetId) : null;
    if (!(caseModal instanceof HTMLDialogElement)) return;

    caseReturnFocus.set(caseModal, button);
    caseModal.showModal();
  });
});

caseModals.forEach((caseModal) => {
  const caseCloseButton = caseModal.querySelector("[data-case-close]");

  caseCloseButton?.addEventListener("click", () => {
    caseModal.close();
  });

  enableBackdropClose(caseModal);

  caseModal.addEventListener("close", () => {
    const returnFocus = caseReturnFocus.get(caseModal);
    if (returnFocus instanceof HTMLElement) {
      returnFocus.focus({ preventScroll: true });
    }
  });
});

// ---------------------------------------------------------------------------
// Selected Work accordion (list at a glance → click for detail)
// ---------------------------------------------------------------------------
const workItems = Array.from(document.querySelectorAll(".work-item"));
const expandAllButton = document.querySelector("[data-work-expand-all]");

const syncExpandAllLabel = () => {
  if (!expandAllButton) return;
  const allOpen = workItems.length > 0 && workItems.every((item) => item.classList.contains("is-open"));
  expandAllButton.textContent = allOpen ? "전체 접기" : "전체 펼치기";
  expandAllButton.setAttribute("aria-expanded", String(allOpen));
};

const WORK_DETAIL_TRANSITION_MS = 320;
const workSettleTimers = new WeakMap();

const setWorkItemOpen = (item, shouldOpen) => {
  const toggle = item.querySelector(".work-toggle");
  const label = item.querySelector(".work-toggle-label");

  item.classList.toggle("is-open", shouldOpen);
  toggle?.setAttribute("aria-expanded", String(shouldOpen));
  if (label) label.textContent = shouldOpen ? "접기" : "자세히 보기";

  // 높이 애니메이션 중에는 overflow를 잠가 내용이 밖으로 새지 않게 하고,
  // 펼침이 끝난 뒤에만 풀어 카드 그림자·hover 이동이 잘리지 않게 한다.
  window.clearTimeout(workSettleTimers.get(item));
  item.classList.remove("is-settled");
  if (shouldOpen) {
    workSettleTimers.set(
      item,
      window.setTimeout(() => {
        if (item.classList.contains("is-open")) item.classList.add("is-settled");
      }, WORK_DETAIL_TRANSITION_MS + 40),
    );
  }
  syncExpandAllLabel();
};

workItems.forEach((item) => {
  const toggle = item.querySelector(".work-toggle");
  const summary = item.querySelector(".work-summary");

  toggle?.addEventListener("click", () => {
    setWorkItemOpen(item, !item.classList.contains("is-open"));
  });

  // 요약 행 어디를 눌러도 펼쳐지되, 링크·버튼 클릭이나 텍스트 드래그 선택은 방해하지 않는다.
  summary?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("a, button")) return;
    if (window.getSelection()?.toString()) return;
    toggle?.click();
  });
});

expandAllButton?.addEventListener("click", () => {
  const shouldOpen = !workItems.every((item) => item.classList.contains("is-open"));
  workItems.forEach((item) => setWorkItemOpen(item, shouldOpen));
});

syncExpandAllLabel();

// ---------------------------------------------------------------------------
// 연표 (top chronology band)
// Education · AI 사용 · Work Experience는 기간 막대, Projects는 연결선 위의 순차 점으로 그린다.
// 기간은 "YYYY-MM"(end는 해당 월 포함) 또는 "now". approx는 연 단위로만 아는 기간이다.
// 각 표식은 href의 패널·항목으로 이동하는 링크다.
// ---------------------------------------------------------------------------
const CHRONO_START_YEAR = 2018;
const CHRONO_RECENT_START_YEAR = 2022;
const chronoToday = new Date();
const CHRONO_NOW = `${chronoToday.getFullYear()}-${String(chronoToday.getMonth() + 1).padStart(2, "0")}`;
const CHRONO_END = `${chronoToday.getFullYear()}-12`;
const CHRONO_SHORT_MONTHS = 4; // 이보다 짧은 막대는 라벨을 막대 밖에 쓴다
const CHRONO_SHORT_LABEL_PAD = 8; // 밖에 쓴 라벨이 차지하는 폭(개월)
const CHRONO_VISIBLE_YEARS = [
  CHRONO_START_YEAR,
  ...Array.from(
    { length: Math.max(0, chronoToday.getFullYear() - CHRONO_RECENT_START_YEAR + 1) },
    (_, index) => CHRONO_RECENT_START_YEAR + index,
  ),
];

const CHRONO_TRACKS = [
  {
    label: "Education",
    tone: "edu",
    items: [{ label: "KAIST 전산학부 · 수리과학 부전공", start: "2018-03", end: "2025-08", href: "#edu-kaist" }],
  },
  {
    label: "AI 사용",
    tone: "ai",
    items: [
      { label: "Copilot", title: "GitHub Copilot", start: "2022-11", end: "2023-02", href: "#ai-experience" },
      { label: "Cursor", start: "2023-03", end: "2025-10", href: "#ai-experience" },
      { label: "Claude Code", title: "Antigravity → Claude Code", start: "2025-11", end: "2026-04", href: "#ai-experience" },
      { label: "Codex + Claude Code", start: "2026-05", end: "now", href: "#ai-experience" },
    ],
  },
  {
    label: "Work Experience",
    tone: "work",
    items: [
      { label: "TingtingPlanet · Founder", start: "2023-03", end: "now", href: "#work-tingtingplanet" },
      { label: "OnTheMarket · CTO", title: "OnTheMarket · Co-founder / CTO", start: "2025-06", end: "2026-02", href: "#work-onthemarket" },
    ],
  },
  {
    label: "Projects",
    tone: "portfolio",
    layout: "sequence",
    items: [
      { label: "OnTheMarket", start: "2025-06", end: "2026-02", href: "#project-onthemarket", tone: "featured" },
      { label: "Gagageul", start: "2025-01", end: "2025-12", href: "#project-gagageul", tone: "featured", approx: true },
      { label: "ChapterTwo", start: "2024-01", end: "2025-12", href: "#portfolio-chaptertwo", approx: true },
      { label: "SYRS AI Lab", start: "2024-01", end: "2024-12", href: "#project-syrs", tone: "featured", approx: true },
      { label: "JoBonger", start: "2024-01", end: "2024-12", href: "#portfolio-jobonger", approx: true },
      { label: "Play AI SSO", start: "2024-01", end: "2024-12", href: "#portfolio-playai", approx: true },
      { label: "Akasys", start: "2023-01", end: "2023-12", href: "#project-akasys", tone: "featured", approx: true },
      { label: "Local Jobs", start: "2023-01", end: "2023-12", href: "#project-local-jobs", tone: "featured", approx: true },
      { label: "ClackClack Platform", start: "2023-01", end: "2023-12", href: "#portfolio-clackclack", approx: true },
      { label: "Watch Wise", start: "2023-01", end: "2023-12", href: "#portfolio-watchwise", approx: true },
      { label: "Mounting", start: "2023-01", end: "2023-12", href: "#portfolio-mounting", approx: true },
      { label: "SLOTHS ON THE RUN · ETH Denver", start: "2023-02", end: "2023-03", href: "#portfolio-sloths" },
      { label: "Hashmoss", start: "2022-01", end: "2022-12", href: "#portfolio-hashmoss", approx: true },
    ],
  },
];

const chronoMonthIndex = (ym) => {
  const [year, month] = (ym === "now" ? CHRONO_NOW : ym).split("-").map(Number);
  if (year === CHRONO_START_YEAR) return month - 1;
  if (year >= CHRONO_RECENT_START_YEAR) {
    return 12 + (year - CHRONO_RECENT_START_YEAR) * 12 + (month - 1);
  }
  // 2019–2021은 사건이 없어 축에서 생략한다. 해당 구간의 값이 생기면 2022 시작점에 붙인다.
  return 12;
};

const chronoTotalMonths = () => chronoMonthIndex(CHRONO_END) + 1;

// 진행 중 항목은 현재 월에서 끝내고, 오른쪽 그라디언트로 계속되는 상태임을 표시한다.
const chronoEndIndex = (item) => (item.end === "now" ? chronoMonthIndex("now") + 1 : chronoMonthIndex(item.end) + 1);

const chronoPeriodText = (item) => {
  const [startYear, startMonth] = item.start.split("-");
  const endText = item.end === "now" ? "현재" : item.end.replace("-", ".");
  if (item.approx) {
    const endYear = item.end.split("-")[0];
    return startYear === endYear ? startYear : `${startYear} - ${endYear}`;
  }
  return `${startYear}.${startMonth} - ${endText}`;
};

// 같은 트랙 안에서 기간이 겹치는 항목은 아래 줄로 내린다(first-fit).
const chronoPackRows = (items) => {
  const sorted = [...items].sort(
    (a, b) => chronoMonthIndex(a.start) - chronoMonthIndex(b.start) || Number(b.tone === "featured") - Number(a.tone === "featured"),
  );
  const rowEnds = [];
  const placed = sorted.map((item) => {
    const start = chronoMonthIndex(item.start);
    const end = chronoEndIndex(item);
    const isSingleYearApprox = item.approx && item.start.slice(0, 4) === item.end.slice(0, 4);
    const isShort = isSingleYearApprox || end - start < CHRONO_SHORT_MONTHS;
    const occupiedEnd = isShort ? start + CHRONO_SHORT_LABEL_PAD : end;
    let row = rowEnds.findIndex((rowEnd) => rowEnd <= start);
    if (row === -1) row = rowEnds.push(0) - 1;
    rowEnds[row] = occupiedEnd;
    return { item, start, end, isShort, row };
  });
  return { placed, rowCount: rowEnds.length };
};

// 정확한 월보다 연도와 제작 순서가 중요한 프로젝트는 한 줄에 고르게 배치한다.
// 기간 정보는 tooltip에 그대로 남기고, 축에서는 연결선 위의 점으로만 보여 준다.
const chronoSequencePoints = (items) => {
  const sorted = items
    .map((item, sourceIndex) => ({ item, sourceIndex }))
    .sort((a, b) => a.item.start.localeCompare(b.item.start) || a.sourceIndex - b.sourceIndex);
  const groups = new Map();

  sorted.forEach((entry) => {
    const year = Number(entry.item.start.slice(0, 4));
    const group = groups.get(year) ?? [];
    group.push(entry);
    groups.set(year, group);
  });

  return [...groups.entries()].flatMap(([year, group]) =>
    group.map(({ item }, index) => {
      const month = Math.floor(((index + 1) * 12) / (group.length + 1)) + 1;
      const start = chronoMonthIndex(`${year}-${String(month).padStart(2, "0")}`);
      return { item, start, end: start + 1, isShort: true, row: 0 };
    }),
  );
};

const renderChrono = (grid) => {
  const create = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const column = (monthIndex) => monthIndex + 2; // 1열은 트랙 라벨
  const place = (node, columnValue, rowValue) => {
    node.style.gridColumn = columnValue;
    node.style.gridRow = rowValue;
    grid.append(node);
  };

  const totalMonths = chronoTotalMonths();
  grid.style.setProperty("--chrono-months", `repeat(${totalMonths}, minmax(0, 1fr))`);
  grid.replaceChildren();

  CHRONO_VISIBLE_YEARS.forEach((year) => {
    const startIndex = chronoMonthIndex(`${year}-01`);
    const span = Math.min(12, totalMonths - startIndex);
    // 축 끝에 걸린 짧은 해(반년 미만)는 눈금선만 남기고 연도 표기는 생략
    const yearCell = create("div", "chrono-year", span >= 6 ? String(year) : "");
    place(yearCell, `${column(startIndex)} / span ${span}`, "1");
  });

  let row = 2;
  CHRONO_TRACKS.forEach((track) => {
    const isSequence = track.layout === "sequence";
    const packed = isSequence ? { placed: chronoSequencePoints(track.items), rowCount: 1 } : chronoPackRows(track.items);
    const { placed, rowCount } = packed;
    const rowSpan = `${row} / span ${rowCount}`;
    place(create("div", "chrono-lane"), "1 / -1", rowSpan);
    const label = create("div", "chrono-track", track.label);
    if (rowCount > 1) label.append(create("small", "", `${rowCount}줄 · 기간이 겹침`));
    place(label, "1", rowSpan);

    if (isSequence && placed.length > 1) {
      const first = placed[0];
      const last = placed[placed.length - 1];
      place(create("div", "chrono-sequence-line"), `${column(first.start)} / ${column(last.end)}`, String(row));
    }

    placed.forEach(({ item, start, end, isShort, row: laneRow }) => {
      const tone = item.tone ?? track.tone;
      const bar = create(
        "a",
        `chrono-bar is-${tone}${item.approx ? " is-approx" : ""}${isShort ? " is-short" : ""}${isSequence ? " is-sequence" : ""}${item.end === "now" ? " is-ongoing" : ""}`,
      );
      const fullLabel = item.title ?? item.label;
      bar.href = item.href;
      bar.title = `${fullLabel} · ${chronoPeriodText(item)}`;
      bar.setAttribute("aria-label", `${fullLabel}, ${chronoPeriodText(item)}`);
      bar.append(create("span", "", `${fullLabel} · ${chronoPeriodText(item)}`));
      place(bar, isSequence ? `${column(start)} / span 2` : `${column(start)} / ${column(end)}`, String(row + laneRow));
    });
    row += rowCount;
  });

  CHRONO_VISIBLE_YEARS.slice(1).forEach((year) => {
    place(create("div", "chrono-yearline"), String(column(chronoMonthIndex(`${year}-01`))), `2 / ${row}`);
  });
  place(create("div", "chrono-gap"), `${column(12)} / span 1`, `1 / ${row}`);
  place(create("div", "chrono-now"), String(column(chronoMonthIndex("now"))), `1 / ${row}`);
};

const chronoGrid = document.querySelector("[data-chrono]");
if (chronoGrid) {
  renderChrono(chronoGrid);
}

// ---------------------------------------------------------------------------
// Section rail ↔ content panels (hash routing)
// ---------------------------------------------------------------------------
const panels = Array.from(document.querySelectorAll(".panel"));
const railItems = Array.from(document.querySelectorAll(".rail-item"));
const DEFAULT_PANEL_ID = "who-am-i";
const BASE_TITLE = "이상화 Portfolio";
// 이전 버전 URL 호환
const HASH_ALIASES = { projects: "selected-work" };

let targetPulseTimer = 0;

const pulseTarget = (element) => {
  document.querySelectorAll(".is-targeted").forEach((node) => node.classList.remove("is-targeted"));
  window.clearTimeout(targetPulseTimer);
  element.classList.add("is-targeted");
  targetPulseTimer = window.setTimeout(() => element.classList.remove("is-targeted"), 1900);
};

const setActivePanel = (panel) => {
  panels.forEach((item) => {
    item.hidden = item !== panel;
  });

  let activeTitle = "";
  railItems.forEach((item) => {
    const isActive = item.dataset.panel === panel.id;
    const link = item.querySelector(".rail-link");
    item.classList.toggle("is-active", isActive);
    if (isActive) {
      link?.setAttribute("aria-current", "page");
      activeTitle = item.querySelector(".rail-title")?.textContent?.trim() ?? "";
    } else {
      link?.removeAttribute("aria-current");
    }
  });

  document.title = panel.id === DEFAULT_PANEL_ID || !activeTitle ? BASE_TITLE : `${activeTitle} · ${BASE_TITLE}`;
};

const route = ({ initial = false } = {}) => {
  const rawHash = decodeURIComponent(window.location.hash.replace(/^#/, ""));

  if (rawHash === "top") {
    window.scrollTo({ top: 0, behavior: initial ? "instant" : "smooth" });
    return;
  }

  const targetId = HASH_ALIASES[rawHash] ?? rawHash;
  const target = targetId ? document.getElementById(targetId) : null;
  const panel = target?.closest(".panel") ?? document.getElementById(DEFAULT_PANEL_ID);
  if (!(panel instanceof HTMLElement)) return;

  const panelChanged = panel.hidden;
  setActivePanel(panel);

  if (target && target !== panel && panel.contains(target)) {
    const workItem = target.closest(".work-item");
    if (workItem) setWorkItemOpen(workItem, true);
    // 패널 전환·첫 로드·아코디언 펼침처럼 레이아웃이 방금 바뀐 경우엔 즉시 이동한다.
    const behavior = initial || panelChanged || workItem ? "instant" : "smooth";
    target.scrollIntoView({ block: "start", behavior });
    pulseTarget(workItem ?? target);
    return;
  }

  if (!initial) {
    // 본문 깊숙이 내려가 있었다면 패널 시작점(연표 바로 아래)으로 되돌리고,
    // 연표가 보이는 위치였다면 스크롤은 그대로 두어 막대 클릭 뒤에도 연표가 남아 있게 한다.
    const app = document.getElementById("app");
    const appTop = app ? Math.round(app.getBoundingClientRect().top + window.scrollY) : 0;
    if (window.scrollY > appTop) window.scrollTo({ top: appTop, behavior: "instant" });
    // 패널이 바뀌면 포커스를 새 패널로 옮겨 스크린리더가 문맥 변화를 알 수 있게 한다.
    if (panelChanged) panel.focus({ preventScroll: true });
  }
};

// 페이지 안 앵커 클릭은 브라우저 기본 해시 스크롤 대신 직접 처리한다.
// (숨겨진 패널 안의 대상은 기본 동작으로는 스크롤되지 않고, 같은 해시를 다시 눌러도 반응하도록)
document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (!(event.target instanceof Element)) return;

  const link = event.target.closest('a[href^="#"]');
  if (!link || link.classList.contains("skip-link")) return;

  const hash = link.getAttribute("href");
  if (!hash || hash === "#") return;

  event.preventDefault();
  if (hash !== window.location.hash) window.history.pushState(null, "", hash);
  route();
});

// 뒤로/앞으로 가기, 그리고 스크립트로 바꾼 해시(location.hash = …)도 같은 라우터를 탄다.
window.addEventListener("popstate", () => route());

route({ initial: true });
