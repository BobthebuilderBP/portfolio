// Small helpers
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));
// Footer year
$("#year").textContent = new Date().getFullYear();
// ===== Theme toggle (dark/light) =====
// Default is DARK (looks more colourful with the gradients).
// Clicking toggles to LIGHT. Preference saved in localStorage.
const root = document.documentElement;
const themeToggle = $("#themeToggle");
function setTheme(theme) {
  const isLight = theme === "light";
  root.classList.toggle("light", isLight);
  themeToggle.setAttribute("aria-pressed", String(!isLight));
  themeToggle.textContent = isLight ? "Dark mode" : "Light mode";
  localStorage.setItem("theme", theme);
}
function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) return setTheme(saved);
  // default dark
  setTheme("dark");
}
themeToggle.addEventListener("click", () => {
  const isLight = root.classList.contains("light");
  setTheme(isLight ? "dark" : "light");
});
initTheme();
// ===== Demo contact form feedback =====
const fakeSubmit = $("#fakeSubmit");
const formHint = $("#formHint");
fakeSubmit.addEventListener("click", () => {
  // lightweight "validation" (optional but good UX)
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const msg = $("#message").value.trim();
  if (!name || !email || !msg) {
    formHint.textContent = "Please fill in name, email and message (demo validation).";
    return;
  }
  formHint.textContent = "Demo form: message sending is not enabled for this assignment.";
});
// ===== Project filtering =====
const filterButtons = $$(".filter-btn");
const projectCards = $$(".project");
const projectsCount = $("#projectsCount");
function updateCount(visible) {
  projectsCount.textContent = `Showing ${visible} project(s).`;
}

function setActiveButton(activeBtn) {
  filterButtons.forEach(btn => {
    const isActive = btn === activeBtn;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}
function applyFilter(filter) {
  let visible = 0;

  projectCards.forEach(card => {
    const category = card.dataset.category;
    const show = filter === "all" || category === filter;
    card.style.display = show ? "" : "none";
    if (show) visible++;
  });
  updateCount(visible);
}
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setActiveButton(btn);
    applyFilter(btn.dataset.filter);
  });
});
// Default
applyFilter("all");
// ===== Reveal on scroll (IntersectionObserver) =====
const reduceMotion = window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = $$(".reveal");
if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));
} else {
  // fallback: show everything
  revealEls.forEach(el => el.classList.add("is-visible"));
}
// ===== Back to top =====
const backToTop = $("#backToTop");
window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 700 ? "inline-flex" : "none";
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});