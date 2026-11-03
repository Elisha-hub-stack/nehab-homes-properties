const WHATSAPP_NUMBER = "2348038621411";
const COMPANY_EMAIL = "nehabhomes@gmail.com";

const navItems = [
  ["Home", "index.html"],
  ["Properties", "properties.html"],
  ["Lands", "lands.html"],
  ["About", "about.html"],
  ["Services", "services.html"],
  ["Contact", "contact.html"]
];

function currentPage() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function renderHeader() {
  const host = document.getElementById("site-header");
  if (!host) return;
  const page = currentPage();
  host.innerHTML = `
    <div class="topbar"><div class="container topbar-inner"><span>Ogwashi-Uku, Delta State, Nigeria</span><a href="tel:+2348038621411">Call us: +234 803 862 1411</a></div></div>
    <header class="site-header"><div class="container nav-wrap">
      <a class="brand" href="index.html" aria-label="Nehab Homes and Properties home">
        <span class="brand-mark">N<span>H</span></span><span class="brand-name">NEHAB <small>HOMES &amp; PROPERTIES LTD.</small></span>
      </a>
      <button class="menu-toggle" id="menu-toggle" aria-label="Open navigation menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="main-nav" id="main-nav" aria-label="Main navigation">
        ${navItems.map(([label, href]) => `<a href="${href}" ${page === href ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
        <a class="nav-contact" data-whatsapp="Hello Nehab Homes & Properties, I would like to make an enquiry." href="#">WhatsApp us <span>↗</span></a>
      </nav>
    </div></header>`;
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });
}

function renderFooter() {
  const host = document.getElementById("site-footer");
  if (!host) return;
  host.innerHTML = `
    <footer class="site-footer"><div class="container footer-main">
      <div class="footer-brand"><a class="brand brand-light" href="index.html"><span class="brand-mark">N<span>H</span></span><span class="brand-name">NEHAB <small>HOMES &amp; PROPERTIES LTD.</small></span></a><p>Property and land opportunities in Ogwashi-Uku, Delta State.</p></div>
      <div><h4>Explore</h4><a href="properties.html">Properties</a><a href="lands.html">Land opportunities</a><a href="about.html">About us</a><a href="services.html">Our services</a></div>
      <div><h4>Contact</h4><a href="tel:+2348038621411">+234 803 862 1411</a><a href="mailto:${COMPANY_EMAIL}">${COMPANY_EMAIL}</a><p>1 Close, Opp. NNPC Megastation,<br>Ogwashi-Uku, Delta State.</p></div>
      <div><h4>Let's talk</h4><p>Have a question about a property or land listing?</p><a class="footer-whatsapp" data-whatsapp="Hello Nehab Homes & Properties, I would like to make an enquiry." href="#">Chat on WhatsApp ↗</a></div>
    </div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Nehab Homes &amp; Properties Ltd.</span><span>All listing information should be confirmed with the company.</span></div></footer>`;
}

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function attachWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach(link => {
    link.href = whatsappLink(link.getAttribute("data-whatsapp") || "Hello, I would like to make an enquiry.");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

function moneyText(value) {
  return value || "Price on enquiry";
}

function cardTemplate(item, category) {
  const image = item.images && item.images[0] ? item.images[0] : "";
  const detailPage = category === "land" ? "land-details.html" : "property-details.html";
  const message = `Hello Nehab Homes & Properties, I am interested in ${item.title} in ${item.location}. Please share more details and confirm availability.`;
  return `<article class="listing-card">
    <a class="card-image" href="${detailPage}?slug=${encodeURIComponent(item.slug)}" aria-label="View ${item.title}">
      <img src="${image}" alt="${item.title} — sample image" loading="lazy">
      <span class="listing-status">${item.status || "Ask for details"}</span>
    </a>
    <div class="card-content"><p class="card-location"><span>⌖</span> ${item.location}</p>
      <h3><a href="${detailPage}?slug=${encodeURIComponent(item.slug)}">${item.title}</a></h3>
      <div class="card-meta"><span>${category === "land" ? item.size : (item.type || "Property")}</span><strong>${moneyText(item.price)}</strong></div>
      <div class="card-actions"><a class="btn btn-card" href="${detailPage}?slug=${encodeURIComponent(item.slug)}">View details <span>→</span></a><a class="whatsapp-icon-link" href="${whatsappLink(message)}" target="_blank" rel="noopener noreferrer" aria-label="Enquire about ${item.title} on WhatsApp">WhatsApp ↗</a></div>
    </div>
  </article>`;
}

function renderListings() {
  const home = document.getElementById("home-property-list");
  if (home) home.innerHTML = properties.slice(0, 3).map(item => cardTemplate(item, "property")).join("");

  const all = document.getElementById("all-property-list");
  if (all) {
    const search = document.getElementById("property-search");
    const type = document.getElementById("property-type");
    const empty = document.getElementById("property-empty");
    const update = () => {
      const q = search.value.trim().toLowerCase();
      const selected = type.value;
      const matches = properties.filter(item =>
        (selected === "all" || item.type === selected) &&
        `${item.title} ${item.location} ${item.description}`.toLowerCase().includes(q)
      );
      all.innerHTML = matches.map(item => cardTemplate(item, "property")).join("");
      empty.hidden = matches.length > 0;
    };
    search.addEventListener("input", update);
    type.addEventListener("change", update);
    update();
  }

  const landHost = document.getElementById("land-list");
  if (landHost) {
    landHost.innerHTML = lands.map(item => cardTemplate(item, "land")).join("");
    const empty = document.getElementById("land-empty");
    if (empty) empty.hidden = lands.length > 0;
  }
}

function renderDetail(kind) {
  const isLand = kind === "land";
  const host = document.getElementById(isLand ? "land-detail" : "property-detail");
  if (!host) return;
  const dataset = isLand ? lands : properties;
  const slug = new URLSearchParams(window.location.search).get("slug");
  const item = dataset.find(record => record.slug === slug) || dataset[0];
  if (!item) {
    host.innerHTML = `<div class="not-found"><h2>Listing not found</h2><p>We could not find that listing. Please return to the listings page.</p><a class="btn btn-dark" href="${isLand ? "lands.html" : "properties.html"}">Back to listings</a></div>`;
    return;
  }
  document.title = `${item.title} | Nehab Homes & Properties Ltd.`;
  const images = (item.images || []).map((src, i) => `<img src="${src}" alt="${item.title} — photo ${i + 1}" loading="${i === 0 ? "eager" : "lazy"}">`).join("");
  const message = `Hello Nehab Homes & Properties, I am interested in ${item.title} in ${item.location}. Please send me more information and confirm the current price and availability.`;
  const specs = isLand
    ? [["Land size", item.size], ["Property type", item.type], ["Status", item.status]]
    : [["Property type", item.type], ["Bedrooms", item.bedrooms], ["Bathrooms", item.bathrooms], ["Size", item.size], ["Status", item.status]];
  host.innerHTML = `
    <div class="breadcrumb detail-breadcrumb"><a href="index.html">Home</a><span>/</span><a href="${isLand ? "lands.html" : "properties.html"}">${isLand ? "Lands" : "Properties"}</a><span>/</span>${item.title}</div>
    <div class="detail-heading"><div><p class="eyebrow">${isLand ? "LAND DETAILS" : "PROPERTY DETAILS"}</p><h1>${item.title}</h1><p class="detail-location">⌖ ${item.location}</p></div><div class="detail-price">${moneyText(item.price)}<small>Contact us to confirm current pricing</small></div></div>
    <div class="detail-gallery">${images || `<div class="gallery-placeholder">Images coming soon</div>`}</div>
    <div class="detail-layout"><div class="detail-main"><h2>About this ${isLand ? "land" : "property"}</h2><p class="body-copy">${item.description}</p><h3>Details &amp; features</h3><ul class="feature-list">${(item.features || []).map(feature => `<li>${feature}</li>`).join("")}</ul><p class="disclaimer">This is demonstration content unless independently confirmed by Nehab Homes &amp; Properties Ltd. Always inspect the property and verify ownership, title documents, survey, boundaries, price and availability before making payment.</p></div>
    <aside class="enquiry-panel"><span class="listing-status">${item.status || "Ask for details"}</span><h3>Interested in this listing?</h3><p>Send an enquiry to receive more information and ask about arranging a viewing.</p><a class="btn btn-gold btn-full" href="${whatsappLink(message)}" target="_blank" rel="noopener noreferrer">Enquire on WhatsApp ↗</a><a class="panel-phone" href="tel:+2348038621411">Or call +234 803 862 1411</a></aside></div>`;
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const message = `Hello Nehab Homes & Properties,\n\nMy name is ${data.get("name")}.\nPhone: ${data.get("phone")}\nInterest: ${data.get("interest")}\nMessage: ${data.get("message")}`;
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  attachWhatsAppLinks();
  renderListings();
  renderDetail("property");
  renderDetail("land");
  initContactForm();
});
