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
    genres.forEach((g) => {
      const li = document.createElement("li");
      li.textContent = g;
      list.appendChild(li);
    });
    $("genres").hidden = false;
  }

  const actions = $("actions");
  (data.actions || []).forEach((a) => {
    const link = document.createElement("a");
    link.className = "btn" + (a.primary ? " primary" : "");
    link.href = a.url;
    link.textContent = a.label;
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
  (data.info || []).forEach((i) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = i.label || "";
    li.appendChild(label);
    if (i.url) {
      const a = document.createElement("a");
      a.href = i.url;
      a.textContent = i.value || i.url;
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
    link.textContent = l.label;
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
}

init();
