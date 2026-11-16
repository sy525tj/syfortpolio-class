const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const toast = document.querySelector(".toast");
const copyButton = document.querySelector(".copy-button");
const contactForm = document.querySelector("#contact-form");
const contactFormStatus = document.querySelector("#contact-form-status");
const yearElement = document.querySelector("#current-year");
const themeToggle = document.querySelector(".theme-toggle");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const projectModal = document.querySelector("#project-details-modal");
const projectModalTitle = document.querySelector("#project-modal-title");
const projectModalDescription = document.querySelector("#project-modal-description");
const projectModalRole = document.querySelector("#project-modal-role");
const projectModalTools = document.querySelector("#project-modal-tools");
const projectModalOutcome = document.querySelector("#project-modal-outcome");
const modalCloseButton = document.querySelector(".modal-close");

const projectDetails = {
  northstar: {
    title: "Northstar Finance",
    description: "A calmer, clearer dashboard concept that helps people understand their everyday finances.",
    role: "Product strategy, UX research, interface design, and design system.",
    tools: "Figma, FigJam, and interactive prototypes.",
    outcome: "Example outcome: made key spending insights easier to find in a simplified dashboard."
  },
  bloom: {
    title: "Bloom",
    description: "A welcoming habit-building app concept designed to make small, healthy routines feel achievable.",
    role: "Brand direction, product design, and interaction prototyping.",
    tools: "Figma, Illustrator, and mobile app prototypes.",
    outcome: "Example outcome: created a more encouraging daily check-in experience for building habits."
  },
  fieldnotes: {
    title: "Fieldnotes",
    description: "A digital editorial journal concept celebrating the outdoors through thoughtful stories and field guides.",
    role: "Editorial art direction, UX/UI design, and front-end development.",
    tools: "HTML, CSS, and vanilla JavaScript.",
    outcome: "Example outcome: brought articles and field guides together in a clear, easy-to-browse layout."
  }
};

let modalTrigger;

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  const themeLabel = themeToggle?.querySelector(".theme-toggle-label");
  const themeIcon = themeToggle?.querySelector(".theme-icon");
  if (themeLabel) themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  if (themeIcon) themeIcon.textContent = isDark ? "☀" : "☾";
  themeColorMeta?.setAttribute("content", isDark ? "#171a18" : "#f6f5f0");
}

let savedTheme = "light";
try {
  const storedTheme = window.localStorage.getItem("portfolio-theme");
  if (storedTheme === "light" || storedTheme === "dark") savedTheme = storedTheme;
} catch (error) {
  console.error("Could not load the saved theme preference.", error);
}
setTheme(savedTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  try {
    window.localStorage.setItem("portfolio-theme", nextTheme);
  } catch (error) {
    console.error("Could not save the theme preference.", error);
    showToast("Theme preference could not be saved.", true);
  }
});

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

function closeMenu() {
  if (!menuToggle || !navLinks) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navLinks.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navLinks?.classList.toggle("is-open", !isExpanded);
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Fill in the selected project's example content and move focus into the dialog.
function openProjectDetails(projectId, trigger) {
  const project = projectDetails[projectId];
  if (!project || !projectModal || !projectModalTitle || !projectModalDescription) return;

  modalTrigger = trigger;
  projectModalTitle.textContent = project.title;
  projectModalDescription.textContent = project.description;
  projectModalRole.textContent = project.role;
  projectModalTools.textContent = project.tools;
  projectModalOutcome.textContent = project.outcome;
  projectModal.showModal();
  modalCloseButton?.focus();
}

// Close the dialog and return keyboard focus to the card that opened it.
function closeProjectDetails() {
  if (!projectModal?.open) return;
  projectModal.close();
}

document.querySelectorAll(".project-card[data-project]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openProjectDetails(trigger.dataset.project, trigger);
  });
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectDetails(trigger.dataset.project, trigger);
    }
  });
});

modalCloseButton?.addEventListener("click", closeProjectDetails);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal?.open) {
    event.preventDefault();
    closeProjectDetails();
  }
});

projectModal?.addEventListener("click", (event) => {
  if (event.target === projectModal) closeProjectDetails();
});

projectModal?.addEventListener("close", () => {
  if (modalTrigger instanceof HTMLElement && modalTrigger.isConnected) {
    modalTrigger.focus();
  }
  modalTrigger = null;
});

let toastTimeout;

function showToast(message, isError = false) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.toggle("is-error", isError);
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

copyButton?.addEventListener("click", async () => {
  const email = copyButton.dataset.email;
  if (!email) {
    showToast("Email address is unavailable.", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(email);
    showToast("Email copied to clipboard.");
  } catch (error) {
    showToast("Could not copy email. Please use the email link instead.", true);
  }
});

contactForm?.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    const error = document.getElementById(field.getAttribute("aria-describedby"));
    const hasValue = field.value.trim().length > 0;
    const invalidEmail = field.type === "email" && hasValue && field.validity.typeMismatch;

    if (hasValue && !invalidEmail) {
      field.setAttribute("aria-invalid", "false");
      error?.classList.remove("is-visible");
      if (error) error.textContent = "";
    }

    if (contactFormStatus) {
      contactFormStatus.textContent = "";
      contactFormStatus.classList.remove("is-error");
    }
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...contactForm.querySelectorAll("input, textarea")];
  let firstInvalidField;

  fields.forEach((field) => {
    const error = document.getElementById(field.getAttribute("aria-describedby"));
    let message = "";

    if (!field.value.trim()) {
      message = `Please enter your ${field.name}.`;
    } else if (field.type === "email" && field.validity.typeMismatch) {
      message = "Please enter a valid email address.";
    }

    field.setAttribute("aria-invalid", String(Boolean(message)));
    error?.classList.toggle("is-visible", Boolean(message));
    if (error) error.textContent = message;

    if (message && !firstInvalidField) firstInvalidField = field;
  });

  if (firstInvalidField) {
    if (contactFormStatus) {
      contactFormStatus.textContent = "Please correct the highlighted fields before submitting.";
      contactFormStatus.classList.add("is-error");
    }
    firstInvalidField.focus();
    return;
  }

  const name = contactForm.querySelector("#contact-name").value.trim();
  if (contactFormStatus) {
    contactFormStatus.textContent = `Thanks, ${name}. Your form passed validation. No email has been sent.`;
    contactFormStatus.classList.remove("is-error");
  }
});
