// Tell the CSS that JavaScript is working (so hidden sections are safe to animate)
document.documentElement.classList.add("js");

// ===== 1. Mobile menu =====
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

// Close the menu after tapping a link
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// ===== 2. Show sections smoothly when you scroll to them =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");

      // Fill the skill bars inside this section
      entry.target.querySelectorAll(".track i").forEach((bar) => {
        bar.style.width = bar.dataset.level + "%";
      });

      observer.unobserve(entry.target); // animate only once
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((section) => observer.observe(section));

// ===== 3. Contact form: opens the visitor's email app =====
document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("cName").value;
  const message = document.getElementById("cMsg").value;
  const subject = encodeURIComponent("Portfolio message from " + name);
  const body = encodeURIComponent(message);
  // Change this to your real email address
  window.location.href = "mailto:yourname@example.com?subject=" + subject + "&body=" + body;
});

// ===== 4. Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();
