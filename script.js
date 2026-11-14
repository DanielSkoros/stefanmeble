const projects = [
  {
    title: "Kuchnia z frontami z płyty",
    category: "Kuchnia · Meble na wymiar",
    description: "Przykładowa realizacja z frontami z płyty meblowej i prostymi detalami.",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
    ]
  },
  {
    title: "Zabudowa do spokojnego wnętrza",
    category: "Salon · Zabudowa",
    description: "Przykład zabudowy zaprojektowanej z myślą o przechowywaniu i harmonii.",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85"
    ]
  },
  {
    title: "Zabudowa w salonie",
    category: "Wnętrze · Detale",
    description: "Przykładowe połączenie płyt meblowych, faktur i ciepłych kolorów.",
    images: [
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
    ]
  },
  {
    title: "Miejsce do odpoczynku",
    category: "Sypialnia · Meble na wymiar",
    description: "Przykładowa aranżacja z prostymi formami i przytulnym wykończeniem.",
    images: [
      "https://picsum.photos/seed/stefan-r4-1/1400/1000",
      "https://picsum.photos/seed/stefan-r4-2/1400/1000",
      "https://picsum.photos/seed/stefan-r4-3/1400/1000"
    ]
  },
  {
    title: "Biurko i regały w gabinecie",
    category: "Biuro · Meble na wymiar",
    description: "Przykładowe biurko z zabudową regałową, dopasowane do wysokości sufitu.",
    images: [
      "https://picsum.photos/seed/stefan-r5-1/1400/1000",
      "https://picsum.photos/seed/stefan-r5-2/1400/1000"
    ]
  },
  {
    title: "Łazienka z szafkami pod wymiar",
    category: "Łazienka · Zabudowy",
    description: "Przykładowa łazienka z szafkami i lustrem zabudowanym w niszy.",
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85"
    ]
  },
  {
    title: "Przedpokój z garderobą",
    category: "Przedpokój · Zabudowy",
    description: "Przykładowa garderoba z frontami z płyty i wewnętrznym oświetleniem.",
    images: [
      "https://picsum.photos/seed/stefan-r7-1/1400/1000",
      "https://picsum.photos/seed/stefan-r7-2/1400/1000"
    ]
  },
  {
    title: "Sypialnia z zabudową na wymiar",
    category: "Sypialnia · Zabudowy",
    description: "Przykładowa zabudowa nad łóżkiem z szafkami nocnymi wkomponowanymi w ścianę.",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85"
    ]
  },
  {
    title: "Schody z półkami",
    category: "Wnętrze · Zabudowy",
    description: "Przykładowe schody z zabudową półek pod stopniami.",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85"
    ]
  }
];

// Karuzela pokazuje pierwsze 4 projekty, galeria („Zobacz więcej”) wszystkie
const SLIDER_PROJECT_COUNT = 4;

const projectGrid = document.querySelector("#project-grid");

projects.slice(0, SLIDER_PROJECT_COUNT).forEach((project, projectIndex) => {
  const card = document.createElement("button");
  card.className = "project-card";
  card.type = "button";
  card.setAttribute("aria-label", `Otwórz galerię: ${project.title}`);
  card.innerHTML = `
    <div class="project-image">
      <img src="${project.images[0]}" alt="${project.title}" loading="lazy">
    </div>
    <div class="project-meta">
      <div>
        <h3>${project.title}</h3>
        <p>${project.category}</p>
      </div>
      <span aria-hidden="true">↗</span>
    </div>
  `;
  card.addEventListener("click", () => openLightbox(projectIndex));
  projectGrid.append(card);
});

// Przewinięcie karty tak, by wyśrodkować ją w sliderze
// Podczas przewijania programowego (strzałki) nie zmieniamy wyróżnienia na podstawie scrolla
let isProgrammaticScroll = false;
let programmaticScrollTimer = null;

function endProgrammaticScroll() {
  isProgrammaticScroll = false;
  clearTimeout(programmaticScrollTimer);
}

function centerProjectCard(card) {
  const gridRect = projectGrid.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  const left = projectGrid.scrollLeft + (cardRect.left - gridRect.left) - (gridRect.width - cardRect.width) / 2;

  isProgrammaticScroll = true;
  clearTimeout(programmaticScrollTimer);
  programmaticScrollTimer = setTimeout(endProgrammaticScroll, 900); // zabezpieczenie, gdyby scrollend nie przyszedł
  projectGrid.scrollTo({ left, behavior: "smooth" });
}
projectGrid.addEventListener("scrollend", endProgrammaticScroll);

// Wyróżniona (powiększona) karta. Start: pierwsza.
let featuredIndex = 0;

function setFeaturedProject(index) {
  featuredIndex = index;
  projectGrid.querySelectorAll(".project-card").forEach((card, i) =>
    card.classList.toggle("is-center", i === index)
  );
}

// Strzałki po bokach slidera: poprzednia/następna realizacja, z zapętleniem
function scrollProjects(direction) {
  const cards = [...projectGrid.querySelectorAll(".project-card")];
  const target = (featuredIndex + direction + cards.length) % cards.length;
  setFeaturedProject(target);
  centerProjectCard(cards[target]);
}
document.querySelector(".projects-prev").addEventListener("click", () => scrollProjects(-1));
document.querySelector(".projects-next").addEventListener("click", () => scrollProjects(1));

// Przy ręcznym przewijaniu wyróżniona karta zmienia się dopiero,
// gdy poprzednia całkowicie zniknie z widoku
function updateFeaturedOnScroll() {
  if (isProgrammaticScroll) return;
  const cards = [...projectGrid.querySelectorAll(".project-card")];
  const gridRect = projectGrid.getBoundingClientRect();
  const featuredRect = cards[featuredIndex].getBoundingClientRect();
  const stillVisible = featuredRect.right > gridRect.left && featuredRect.left < gridRect.right;
  if (stillVisible) return;

  const center = gridRect.left + gridRect.width / 2;
  let closestIndex = 0;
  let closestDistance = Infinity;
  cards.forEach((card, i) => {
    const rect = card.getBoundingClientRect();
    const distance = Math.abs(rect.left + rect.width / 2 - center);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  });
  setFeaturedProject(closestIndex);
}
projectGrid.addEventListener("scroll", updateFeaturedOnScroll, { passive: true });
setFeaturedProject(0);

// Karuzela zdjęć w hero
const carouselTrack = document.querySelector(".carousel-track");
const carouselCards = [...document.querySelectorAll(".carousel-card")];
const carouselDots = [...document.querySelectorAll(".carousel-dots button")];
let carouselIndex = 0;

// Kreski na dole działają jako nawigacja: kliknięcie przechodzi do danego zdjęcia
function goToSlide(index) {
  carouselIndex = index;
  const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
  const cardWidth = carouselCards[0].getBoundingClientRect().width;
  carouselTrack.style.transform = `translateX(-${carouselIndex * (cardWidth + gap)}px)`;
  carouselDots.forEach((dot, i) => dot.classList.toggle("is-active", i === carouselIndex));
}

carouselDots.forEach((dot, i) => dot.addEventListener("click", () => goToSlide(i)));
window.addEventListener("resize", () => goToSlide(carouselIndex));

// Swipe w hero: przeciągnięcie palcem lub myszą zmienia zdjęcie
const carouselViewport = document.querySelector(".carousel-window");
const SWIPE_THRESHOLD = 50;
let dragStartX = 0;
let dragDelta = 0;
let isDragging = false;

function slideStep() {
  const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
  return carouselCards[0].getBoundingClientRect().width + gap;
}

carouselViewport.addEventListener("pointerdown", event => {
  isDragging = true;
  dragStartX = event.clientX;
  dragDelta = 0;
  carouselTrack.style.transition = "none"; // bez animacji podczas przeciągania
  carouselViewport.setPointerCapture(event.pointerId);
});

carouselViewport.addEventListener("pointermove", event => {
  if (!isDragging) return;
  dragDelta = event.clientX - dragStartX;
  carouselTrack.style.transform = `translateX(${-carouselIndex * slideStep() + dragDelta}px)`;
});

function endCarouselDrag() {
  if (!isDragging) return;
  isDragging = false;
  carouselTrack.style.transition = "";
  const last = carouselCards.length - 1;
  if (dragDelta < -SWIPE_THRESHOLD) goToSlide(Math.min(carouselIndex + 1, last));
  else if (dragDelta > SWIPE_THRESHOLD) goToSlide(Math.max(carouselIndex - 1, 0));
  else goToSlide(carouselIndex); // za krótki ruch: wracamy do obecnego zdjęcia
}

carouselViewport.addEventListener("pointerup", endCarouselDrag);
carouselViewport.addEventListener("pointercancel", endCarouselDrag);

// Menu mobilne
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Galeria realizacji w oknie dialogowym
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxTitle = document.querySelector(".lightbox-title");
const lightboxDescription = document.querySelector(".lightbox-description");
const lightboxCount = document.querySelector(".lightbox-count");
let activeProject = 0;
let activeImage = 0;

// Spis treści w galerii: lista wszystkich realizacji, klikalna
const tocList = document.querySelector("#toc-list");

projects.forEach((project, index) => {
  const item = document.createElement("li");
  item.innerHTML = `
    <button type="button" data-index="${index}">
      <span class="toc-num">${String(index + 1).padStart(2, "0")}</span>
      <span class="toc-title">${project.title}</span>
    </button>
  `;
  item.querySelector("button").addEventListener("click", () => openLightbox(index));
  tocList.append(item);
});

// Aktywny element spisu ustawiany na środku paska (widok telefonu, przewijany poziomo)
const tocMobileQuery = window.matchMedia("(max-width: 800px)");

function centerActiveToc(smooth) {
  const active = tocList.querySelector(".is-active");
  if (!active || !tocMobileQuery.matches) return;
  const item = active.closest("li");
  const listRect = tocList.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const left = tocList.scrollLeft + (itemRect.left - listRect.left) - (listRect.width - itemRect.width) / 2;
  tocList.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
}

function updateToc() {
  tocList.querySelectorAll("button").forEach(button => {
    const isActive = Number(button.dataset.index) === activeProject;
    button.classList.toggle("is-active", isActive);
    if (isActive) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });
  if (lightbox.open) centerActiveToc(true);
}

// Zmiana zdjęcia: stare wysuwa się w bok, nowe (już zdekodowane) wjeżdża z drugiej strony
let imageTransitionId = 0;

async function swapLightboxImage(url, alt, direction) {
  const id = ++imageTransitionId;

  // Zdekodowanie przed podmianą, żeby nie migało puste miejsce
  const pre = new Image();
  pre.src = url;
  try { await pre.decode(); } catch (error) { /* użyjemy zwykłego src */ }
  if (id !== imageTransitionId) return;

  if (!direction || !lightbox.open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    lightboxImage.src = url;
    lightboxImage.alt = alt;
    return;
  }

  const sign = direction > 0 ? 1 : -1;
  const out = lightboxImage.animate(
    [
      { opacity: 1, transform: "translateX(0)" },
      { opacity: 0, transform: `translateX(${-sign * 60}px)` }
    ],
    { duration: 240, easing: "ease-in", fill: "forwards" }
  );
  await out.finished;
  if (id !== imageTransitionId) {
    out.cancel();
    return;
  }

  lightboxImage.src = url;
  lightboxImage.alt = alt;
  out.cancel();
  lightboxImage.animate(
    [
      { opacity: 0, transform: `translateX(${sign * 60}px)` },
      { opacity: 1, transform: "translateX(0)" }
    ],
    { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" }
  );
}

function showLightboxImage(direction = 0) {
  const project = projects[activeProject];
  swapLightboxImage(project.images[activeImage], `${project.title} — zdjęcie ${activeImage + 1}`, direction);
  lightboxTitle.textContent = project.title;
  lightboxDescription.textContent = project.description;
  lightboxCount.textContent = `${String(activeImage + 1).padStart(2, "0")} / ${String(project.images.length).padStart(2, "0")}`;
  updateToc();
}

// Preload: zdjęcia otwartej realizacji i następnej, żeby przejścia były płynne
const preloadedImages = new Set();

function preloadImages(urls) {
  urls.forEach(url => {
    if (preloadedImages.has(url)) return;
    preloadedImages.add(url);
    const img = new Image();
    img.src = url;
  });
}

function openLightbox(projectIndex) {
  activeProject = projectIndex;
  activeImage = 0;
  preloadImages(projects[projectIndex].images);
  preloadImages(projects[(projectIndex + 1) % projects.length].images);
  showLightboxImage();
  if (!lightbox.open) {
    lightbox.showModal();
    centerActiveToc(false); // bez animacji przy otwarciu
  }
}

// „Zobacz więcej realizacji” otwiera galerię z pierwszą realizacją i spisem treści
document.querySelector("#more-projects").addEventListener("click", () => openLightbox(0));

function moveLightbox(direction) {
  const images = projects[activeProject].images;
  activeImage = (activeImage + direction + images.length) % images.length;
  showLightboxImage(direction);
}

document.querySelector(".lightbox-prev").addEventListener("click", () => moveLightbox(-1));
document.querySelector(".lightbox-next").addEventListener("click", () => moveLightbox(1));
document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener("keydown", event => {
  if (!lightbox.open) return;
  if (event.key === "ArrowRight") moveLightbox(1);
  if (event.key === "ArrowLeft") moveLightbox(-1);
});

document.querySelector("#year").textContent = new Date().getFullYear();
// Delikatne pojawianie się elementów przy przewijaniu
const revealTargets = [
  ".hero-copy",
  ".hero-visual",
  ".section-intro",
  "#project-grid",
  ".more-row",
  ".reviews-intro",
  ".review",
  ".about-image",
  ".about-copy",
  ".contact > div",
  ".contact-details",
  ".footer-grid",
  ".footer-bottom"
];

const revealElements = [...document.querySelectorAll(revealTargets.join(","))];
revealElements.forEach((el, i) => {
  el.classList.add("reveal");
  // Opóźnienie tylko dla elementów z tego samego rodzaju (np. kolejne opinie)
  el.style.setProperty("--reveal-delay", `${(i % 4) * 80}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  revealElements.forEach(el => revealObserver.observe(el));
} else {
  revealElements.forEach(el => el.classList.add("is-visible"));
}
