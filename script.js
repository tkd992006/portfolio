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
