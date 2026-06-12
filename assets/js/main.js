const ICONS = {
  instagram: `<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>`
};

function iconFor(label) {
  return ICONS[(label || "").toLowerCase()] || "";
}

function initScrollAnimations() {
  if (typeof AOS === "undefined") return;
  AOS.init({
    duration: 700,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
    disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
}

function clearPageHash() {
  if (location.hash) {
    history.replaceState(null, "", location.pathname + location.search);
  }
}

function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  return new Promise((resolve) => {
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) requestAnimationFrame(step);
      else resolve();
    }
    requestAnimationFrame(step);
  });
}

function initHeroScroll() {
  const link = document.querySelector(".hero-scroll");
  const target = document.getElementById("content");
  if (!link || !target) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  link.addEventListener("click", (e) => {
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY;

    if (prefersReducedMotion) {
      window.scrollTo(0, top);
      clearPageHash();
      return;
    }

    smoothScrollTo(top, 1300).then(clearPageHash);
  });
}

// Carica i contenuti dal file JSON e li inserisce nella pagina.
async function init() {
  let data;
  try {
    const res = await fetch("content.json");
    if (!res.ok) throw new Error(res.status);
    data = await res.json();
  } catch (err) {
    document.body.innerHTML =
      "<p style='padding:40px;text-align:center'>Impossibile caricare content.json. Apri il sito tramite un server (o GitHub Pages), non con doppio clic sul file.</p>";
    return;
  }

  const $ = (id) => document.getElementById(id);
  const meta = data.meta || {};

  // Meta e colori d'accento
  document.title = meta.title || data.name || "Sito";
  $("meta-description").setAttribute("content", meta.description || "");
  if (meta.accent) document.documentElement.style.setProperty("--accent", meta.accent);
  if (meta.accent2) document.documentElement.style.setProperty("--accent-2", meta.accent2);

  // HERO
  if (data.heroImage) {
    $("hero").style.backgroundImage = `url("${data.heroImage}")`;
  }
  if (data.logo) {
    $("logo").src = data.logo;
    $("logo").alt = data.name || "Logo";
  } else {
    $("logo").remove();
  }
  if (data.logoCaption) $("logo-caption").textContent = data.logoCaption;
  else $("logo-caption").remove();
  $("eyebrow").textContent = data.eyebrow || "";
  $("name").textContent = data.name || "";
  $("tagline").textContent = data.tagline || data.intro || "";

  // CARD PROFILO
  if (data.photo) {
    $("photo").src = data.photo;
    $("photo").alt = data.profileTitle || data.name || "Foto";
  } else {
    $("photo").remove();
  }
  $("profile-title").textContent = data.profileTitle || "Chi siamo";
  $("intro").textContent = data.intro || "";

  // Generi musicali
  const genres = data.genres || [];
  if (genres.length) {
    if (data.genresLabel) $("genres-label").textContent = data.genresLabel;
    const list = $("genre-list");
    genres.forEach((g, i) => {
      const li = document.createElement("li");
      li.textContent = g;
      li.setAttribute("data-aos", "fade-up");
      li.setAttribute("data-aos-delay", String(100 + i * 60));
      list.appendChild(li);
    });
    $("genres").hidden = false;
  }

  const actions = $("actions");
  (data.actions || []).forEach((a, i) => {
    const link = document.createElement("a");
    link.className = "btn" + (a.primary ? " primary" : "");
    link.href = a.url;
    link.textContent = a.label;
    link.setAttribute("data-aos", "zoom-in");
    link.setAttribute("data-aos-delay", String(120 + i * 80));
    if (/^https?:/.test(a.url)) {
      link.target = "_blank";
      link.rel = "noopener";
    }
    actions.appendChild(link);
  });
  if (!actions.children.length) actions.remove();

  // BOX CONTATTI
  $("contact-title").textContent = data.contactTitle || "Contatti & Social";
  if (data.contactText) $("contact-text").textContent = data.contactText;
  else $("contact-text").remove();

  const info = $("info");
  (data.info || []).forEach((i, idx) => {
    const li = document.createElement("li");
    li.setAttribute("data-aos", "fade-up");
    li.setAttribute("data-aos-delay", String(80 + idx * 70));
    const label = document.createElement("span");
    label.textContent = i.label || "";
    li.appendChild(label);
    if (i.url) {
      const a = document.createElement("a");
      a.href = i.url;
      a.innerHTML = iconFor(i.label) + (i.value || i.url);
      if (/^https?:/.test(i.url)) { a.target = "_blank"; a.rel = "noopener"; }
      li.appendChild(a);
    } else {
      li.appendChild(document.createTextNode(i.value || ""));
    }
    info.appendChild(li);
  });
  if (!info.children.length) info.remove();

  const links = $("links");
  (data.links || []).forEach((l) => {
    const link = document.createElement("a");
    link.href = l.url;
    link.innerHTML = iconFor(l.label) + l.label;
    link.target = "_blank";
    link.rel = "noopener";
    links.appendChild(link);
  });
  if (!links.children.length) links.remove();

  // FOOTER (supporta sia stringa semplice che oggetto strutturato)
  const f = data.footer || {};
  if (typeof f === "string") {
    $("footer-copy").textContent = f;
  } else {
    $("footer-brand").textContent = f.brand || data.name || "";
    $("footer-lines").textContent = (f.lines || []).join(" · ");
    if (!f.lines || !f.lines.length) $("footer-lines").remove();

    const legal = $("footer-legal");
    (f.legal || []).forEach((l) => {
      const a = document.createElement("a");
      a.href = l.url || "#";
      a.textContent = l.label;
      if (/^https?:/.test(l.url || "")) { a.target = "_blank"; a.rel = "noopener"; }
      legal.appendChild(a);
    });
    if (!legal.children.length) legal.remove();

    $("footer-copy").textContent =
      f.copyright || `© ${new Date().getFullYear()} ${data.name || ""} — Tutti i diritti riservati`;
  }

  document.body.setAttribute("aria-busy", "false");
  initScrollAnimations();
}

initHeroScroll();
init();
