const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const closeButton = lightbox?.querySelector(".lightbox-close");

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;

    const imagePath = button.getAttribute("data-lightbox");
    const image = button.querySelector("img");
    lightboxImage.src = imagePath || "";
    lightboxImage.alt = image?.alt || "Portfolio image";
    lightbox.showModal();
  });
});

closeButton?.addEventListener("click", () => {
  lightbox?.close();
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.open) {
    lightbox.close();
  }
});

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

const caseOpenButtons = document.querySelectorAll("[data-case-open]");
const caseModals = document.querySelectorAll(".case-modal");
const caseReturnFocus = new WeakMap();

const activateCaseTab = (caseModal, selectedTab, shouldFocus = false) => {
  const caseTabs = Array.from(caseModal.querySelectorAll("[data-case-tab]"));
  const casePanels = Array.from(caseModal.querySelectorAll("[role='tabpanel']"));
  const targetId = selectedTab.getAttribute("data-case-tab");

  caseTabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  casePanels.forEach((panel) => {
    panel.hidden = panel.id !== targetId;
  });

  if (shouldFocus) {
    selectedTab.focus();
  }
};

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
  const caseTabs = Array.from(caseModal.querySelectorAll("[data-case-tab]"));

  caseCloseButton?.addEventListener("click", () => {
    caseModal.close();
  });

  caseModal.addEventListener("click", (event) => {
    if (event.target === caseModal) {
      caseModal.close();
    }
  });

  caseModal.addEventListener("close", () => {
    const returnFocus = caseReturnFocus.get(caseModal);
    if (returnFocus instanceof HTMLElement) {
      returnFocus.focus({ preventScroll: true });
    }
  });

  caseTabs.forEach((tab, tabIndex) => {
    tab.addEventListener("click", () => {
      activateCaseTab(caseModal, tab);
    });

    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

      event.preventDefault();
      let nextIndex = tabIndex;

      if (event.key === "ArrowRight") nextIndex = (tabIndex + 1) % caseTabs.length;
      if (event.key === "ArrowLeft") nextIndex = (tabIndex - 1 + caseTabs.length) % caseTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = caseTabs.length - 1;

      activateCaseTab(caseModal, caseTabs[nextIndex], true);
    });
  });
});
