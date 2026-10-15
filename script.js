document.documentElement.classList.add("js");

// 1. Mobile menu
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  menu.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}));

// 2. Sections fade in when you scroll to them
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("show");
    observer.unobserve(e.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach((s) => observer.observe(s));

// 3. Publications: "See more" / "See less"
const moreBtn = document.getElementById("moreBtn");
const extra = document.querySelectorAll("#pubList li[hidden]");
let expanded = false;
moreBtn.addEventListener("click", () => {
  expanded = !expanded;
  document.querySelectorAll("#pubList li").forEach((li, i) => { if (i >= 2) li.hidden = !expanded; });
  moreBtn.textContent = expanded ? "See less" : "See more";
  moreBtn.setAttribute("aria-expanded", expanded);
});
if (extra.length === 0) moreBtn.style.display = "none";

// 4. Gallery: tap a photo to open it larger
const lb = document.getElementById("lb");
document.querySelectorAll(".gallery figure").forEach((fig) => {
  fig.addEventListener("click", () => {
    const img = fig.querySelector("img");
    if (!img) return; // photo not added yet
    lb.querySelector("img").src = img.src;
    lb.querySelector("img").alt = img.alt;
    document.getElementById("lbCap").textContent = fig.querySelector("figcaption").textContent;
    lb.showModal();
  });
});
document.getElementById("lbClose").addEventListener("click", () => lb.close());
lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });

// 5. Contact form opens the visitor's email app
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("cName").value;
  const msg = document.getElementById("cMsg").value;
  window.location.href = "mailto:royrumakanto@gmail.com?subject=" + encodeURIComponent("Portfolio message from " + name) + "&body=" + encodeURIComponent(msg);
});

// 6. Footer year
document.getElementById("year").textContent = new Date().getFullYear();
