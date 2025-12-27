const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

// Footer year
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Dark / Light mode toggle (saved) =====
const root = document.documentElement;
const themeToggle = $("#themeToggle");

function setTheme(theme) {
  const isLight = theme === "light";
  root.classList.toggle("light", isLight);

  if (themeToggle) {
    // aria-pressed indicates whether dark mode is active
    themeToggle.setAttribute("aria-pressed", String(!isLight));
    themeToggle.textContent = isLight ? "Dark mode" : "Light mode";
  }
  localStorage.setItem("theme", theme);
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) return setTheme(saved);
  setTheme("dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = root.classList.contains("light");
    setTheme(isLight ? "dark" : "light");
  });
}
initTheme();

// ===== Reveal on scroll =====
const reduceMotion = window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealEls = $$(".reveal");

if (!reduceMotion && "IntersectionObserver" in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-visible"); });
  }, { threshold: 0.15 });

  revealEls.forEach(el => obs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("is-visible"));
}

// ===== Back to top =====
const backToTop = $("#backToTop");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 700 ? "inline-flex" : "none";
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}

// ===== Project filtering =====
const filterButtons = $$(".filter-btn");
const projectCards = $$(".project");
const projectsCount = $("#projectsCount");

function updateCount(n) {
  if (projectsCount) projectsCount.textContent = `Showing ${n} project(s).`;
}

function setActiveButton(activeBtn) {
  filterButtons.forEach(btn => {
    const active = btn === activeBtn;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
}

function applyFilter(filter) {
  let visible = 0;
  projectCards.forEach(card => {
    const cat = card.dataset.category;
    const show = filter === "all" || cat === filter;
    card.style.display = show ? "" : "none";
    if (show) visible++;
  });
  updateCount(visible);
}

if (filterButtons.length && projectCards.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      setActiveButton(btn);
      applyFilter(btn.dataset.filter);
    });
  });
  applyFilter("all");
}

// ===== Contact form works (validation + mailto) =====
const contactForm = $("#contactForm");
const formHint = $("#formHint");

function hint(msg) {
  if (formHint) formHint.textContent = msg;
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const message = $("#message").value.trim();

    if (!name || !email || !message) {
      hint("Please fill in name, email, and message.");
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      hint("Please enter a valid email address.");
      return;
    }

    hint("Opening your email app with a pre-filled message…");

    const subject = encodeURIComponent("Portfolio Contact — Zahir Rahman");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
    );

    window.location.href = `mailto:zahir.rahman@hotmail.co.uk?subject=${subject}&body=${body}`;
  });
}