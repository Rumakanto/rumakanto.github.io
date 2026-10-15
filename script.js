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

// 4. Gallery: numbered photos, "See more", tap to open larger
// To add a photo, upload TWO files together to the GitHub repository (no code to edit):
//   1. the photo, named with its date:   2026-10-15.jpg
//   2. a text file with the same name:   2026-10-15.txt   (2-5 lines about the photo)
// Two photos on one day? Add a letter:   2026-10-15-a.jpg  and  2026-10-15-a.txt
// If there is no .txt file, only the date is shown. Newest photo comes first.
const GH_USER = "Rumakanto";
const GH_REPO = "rumakanto.github.io";
const PHOTO_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[-_ ].*)?\.(jpe?g|png|webp|gif)$/i;
const SHOW_FIRST = 3; // how many photos show before "See more"

const gal = document.getElementById("gallery");
const galMore = document.getElementById("galMore");
let galExpanded = false;

function refreshGallery() {
  const figs = [...gal.querySelectorAll("figure")];
  figs.forEach((fig, i) => {
    fig.querySelector(".num").textContent = i + 1;
    fig.hidden = !galExpanded && i >= SHOW_FIRST;
  });
  galMore.hidden = figs.length <= SHOW_FIRST;
  galMore.textContent = galExpanded ? "See less" : "See more (" + (figs.length - SHOW_FIRST) + ")";
  galMore.setAttribute("aria-expanded", galExpanded);
}

function galleryMessage(text) {
  const msg = document.createElement("p");
  msg.className = "intro";
  msg.style.gridColumn = "1 / -1";
  msg.textContent = text;
  gal.append(msg);
}

function parsePhotos(files) {
  const names = {}; // lower-case name -> real name, to find the matching .txt
  files.forEach((f) => { if (f.type === "file") names[f.name.toLowerCase()] = f.name; });
  return files
    .filter((f) => f.type === "file" && PHOTO_RE.test(f.name))
    .map((f) => {
      const m = f.name.match(PHOTO_RE);
      const d = new Date(+m[1], +m[2] - 1, +m[3]);
      const base = f.name.replace(/\.[^.]+$/, "");
      const txt = names[(base + ".txt").toLowerCase()];
      return {
        name: f.name,
        key: m[1] + m[2] + m[3],
        src: encodeURIComponent(f.name),
        txt: txt ? encodeURIComponent(txt) : "",
        date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      };
    })
    .sort((a, b) => b.key.localeCompare(a.key) || a.name.localeCompare(b.name)); // newest first
}

function renderGallery(list) {
  if (list.length === 0) { galleryMessage("Photos coming soon."); return; }
  list.forEach((p) => {
    const fig = document.createElement("figure");
    const ph = document.createElement("div");
    ph.className = "ph";
    const img = document.createElement("img");
    img.src = p.src;
    img.alt = "Photo from " + p.date;
    img.loading = "lazy";
    img.addEventListener("error", () => { fig.remove(); refreshGallery(); }); // file not ready yet: skip it
    const num = document.createElement("span");
    num.className = "num";
    ph.append(img, num);
    const cap = document.createElement("figcaption");
    const dateEl = document.createElement("strong");
    dateEl.className = "cap-date";
    dateEl.textContent = p.date;
    const textEl = document.createElement("span");
    textEl.className = "cap-text";
    cap.append(dateEl, textEl);
    fig.append(ph, cap);
    gal.append(fig);
    if (p.txt) {
      fetch(p.txt)
        .then((r) => (r.ok ? r.text() : ""))
        .then((t) => { textEl.textContent = t.trim(); })
        .catch(() => {});
    }
  });
  refreshGallery();
}

// The list of photos is read from the repository itself, so uploading a photo is enough.
fetch("https://api.github.com/repos/" + GH_USER + "/" + GH_REPO + "/contents/")
  .then((res) => { if (!res.ok) throw new Error("GitHub " + res.status); return res.json(); })
  .then((files) => renderGallery(parsePhotos(files)))
  .catch(() => galleryMessage("Photos could not be loaded right now. Please try again later."));

galMore.addEventListener("click", () => { galExpanded = !galExpanded; refreshGallery(); });

const lb = document.getElementById("lb");
gal.addEventListener("click", (e) => {
  const fig = e.target.closest("figure");
  if (!fig) return;
  const img = fig.querySelector("img");
  lb.querySelector("img").src = img.src;
  lb.querySelector("img").alt = img.alt;
  document.getElementById("lbCap").textContent = fig.querySelector(".num").textContent + ". " + fig.querySelector(".cap-date").textContent + "\n" + fig.querySelector(".cap-text").textContent;
  lb.showModal();
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
