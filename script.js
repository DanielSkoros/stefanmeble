const IMAGE_WIDTHS = [800, 1400, 2000];
const FALLBACK_WIDTH = 1400;
const CARD_SIZES = "(max-width: 520px) 80vw, (max-width: 800px) 60vw, 38vw";
const LIGHTBOX_SIZES = "(max-width: 800px) calc(100vw - 60px), 800px";

function imageVariants(path) {
  const srcset = ext => IMAGE_WIDTHS.map(width => `${path}-${width}.${ext} ${width}w`).join(", ");
  return {
    webp: srcset("webp"),
    jpg: srcset("jpg"),
    fallback: `${path}-${FALLBACK_WIDTH}.jpg`
  };
}

const projects = [
  {
    title: "Kuchnia grafitowa z dębem",
    category: "Kuchnia · Meble na wymiar",
    description: "Grafitowe fronty, dębowy blat i szafki górne, oświetlenie LED.",
    images: ["assets/images/projects/01/photo-01"]
  },
  {
    title: "Sypialnia z podestem",
    category: "Sypialnia · Zabudowa",
    description: "Łóżko na podeście, dębowy panel ścienny, szafa z lustrem.",
    images: ["assets/images/projects/02/photo-01"]
  },
  {
    title: "Łazienka z szafką i słupkiem",
    category: "Łazienka · Zabudowa",
    description: "Szafka pod umywalkę, słupek i zabudowa nad WC.",
    images: ["assets/images/projects/03/photo-01"]
  },
  {
    title: "Szafka łazienkowa miętowa",
    category: "Łazienka · Meble na wymiar",
    description: "Podwieszana szafka z frontami frezowanymi i złotymi uchwytami.",
    images: ["assets/images/projects/04/photo-01"]
  },
  {
    title: "Kuchnia z wyspą i witrynami",
    category: "Kuchnia · Meble na wymiar",
    description: "Zabudowa dąb i biel, wyspa, dwie witryny.",
    images: ["assets/images/projects/05/photo-01"]
  },
  {
    title: "Szafa narożna frezowana",
    category: "Sypialnia · Zabudowa",
    description: "Szafa w narożniku z szufladami i frezowanymi frontami.",
    images: ["assets/images/projects/06/photo-01"]
  },
  {
    title: "Kuchnia w U z witrynami",
    category: "Kuchnia · Meble na wymiar",
    description: "Białe fronty, drewniany blat, podświetlane witryny.",
    images: ["assets/images/projects/07/photo-01"]
  },
  {
    title: "Kuchnia z niebieskimi frontami",
    category: "Kuchnia · Meble na wymiar",
    description: "Niebieskie szafki górne, zabudowa do sufitu, witryna ze złotą ramą.",
    images: ["assets/images/projects/08/photo-01"]
  },
  {
    title: "Kuchnia z wyspą i zabudową",
    category: "Kuchnia · Meble na wymiar",
    description: "Białe szafki do sufitu, dębowe dolne, wyspa.",
    images: ["assets/images/projects/09/photo-01"]
  },
  {
    title: "Łazienka z granatowym regałem",
    category: "Łazienka · Zabudowa",
    description: "Granatowy regał, dębowa zabudowa nad WC, szafka pod umywalką.",
    images: ["assets/images/projects/10/photo-01"]
  }
];

// Karuzela pokazuje pierwsze 4 projekty, galeria („Zobacz więcej”) wszystkie
const SLIDER_PROJECT_COUNT = 4;

const projectGrid = document.querySelector("#project-grid");

projects.slice(0, SLIDER_PROJECT_COUNT).forEach((project, projectIndex) => {
  const card = document.createElement("article");
  card.className = "project-card";
  const firstImage = imageVariants(project.images[0]);
  card.innerHTML = `
    <div class="project-image">
      <picture>
        <source type="image/webp" srcset="${firstImage.webp}" sizes="${CARD_SIZES}">
        <img src="${firstImage.fallback}" srcset="${firstImage.jpg}" sizes="${CARD_SIZES}" alt="${project.title}" loading="lazy" decoding="async">
      </picture>
    </div>
    <div class="project-meta">
      <div>
        <h3>${project.title}</h3>
        <p>${project.category}</p>
      </div>
      <span aria-hidden="true">↗</span>
    </div>
    <button class="project-open" type="button" aria-label="Otwórz galerię: ${project.title}"></button>
  `;
  card.querySelector(".project-open").addEventListener("click", () => openLightbox(projectIndex));
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
  carouselDots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === carouselIndex);
    if (i === carouselIndex) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
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
  if (!event.isPrimary) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  isDragging = true;
  dragStartX = event.clientX;
  dragDelta = 0;
  carouselTrack.style.transition = "none"; // bez animacji podczas przeciągania
  carouselViewport.setPointerCapture(event.pointerId);
});

carouselViewport.addEventListener("pointermove", event => {
  if (!isDragging || !event.isPrimary) return;
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

function closeMenu() {
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Otwórz menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu");
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", event => {
  if (!nav.classList.contains("is-open")) return;
  if (event.target.closest(".site-header")) return;
  closeMenu();
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape" || !nav.classList.contains("is-open")) return;
  closeMenu();
  menuToggle.focus();
});

// Galeria realizacji w oknie dialogowym
const lightbox = document.querySelector(".lightbox");
const lightboxWebp = document.querySelector(".lightbox-webp");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
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

window.addEventListener("resize", () => {
  if (lightbox.open) centerActiveToc(false);
}, { passive: true });

// Zmiana zdjęcia: stare wysuwa się w bok, nowe (już zdekodowane) wjeżdża z drugiej strony
let imageTransitionId = 0;

async function swapLightboxImage(path, alt, direction) {
  const id = ++imageTransitionId;
  const image = imageVariants(path);

  // Zdekodowanie przed podmianą, żeby nie migało puste miejsce
  const pre = new Image();
  pre.srcset = image.webp;
  pre.sizes = LIGHTBOX_SIZES;
  pre.src = image.fallback;
  try { await pre.decode(); } catch (error) { /* użyjemy zwykłego src */ }
  if (id !== imageTransitionId) return;

  function setImage() {
    lightboxWebp.srcset = image.webp;
    lightboxImage.srcset = image.jpg;
    lightboxImage.src = image.fallback;
    lightboxImage.alt = alt;
  }

  if (!direction || !lightbox.open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setImage();
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
  try {
    await out.finished;
  } catch (error) {
    if (id !== imageTransitionId) return;
  }
  if (id !== imageTransitionId) {
    out.cancel();
    return;
  }

  setImage();
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
  const hasMultipleImages = project.images.length > 1;
  lightboxPrev.hidden = !hasMultipleImages;
  lightboxNext.hidden = !hasMultipleImages;
  swapLightboxImage(project.images[activeImage], `${project.title} — zdjęcie ${activeImage + 1}`, direction);
  lightboxTitle.textContent = project.title;
  lightboxDescription.textContent = project.description;
  lightboxCount.textContent = `${String(activeImage + 1).padStart(2, "0")} / ${String(project.images.length).padStart(2, "0")}`;
  updateToc();
}

// Preload: zdjęcia otwartej realizacji i następnej, żeby przejścia były płynne
const preloadedImages = new Set();

function preloadImages(paths) {
  paths.forEach(path => {
    if (preloadedImages.has(path)) return;
    preloadedImages.add(path);
    const image = imageVariants(path);
    const img = new Image();
    img.srcset = image.webp;
    img.sizes = LIGHTBOX_SIZES;
    img.src = image.fallback;
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
  if (images.length < 2) return;
  activeImage = (activeImage + direction + images.length) % images.length;
  if (activeImage === images.length - 1) {
    preloadImages(projects[(activeProject + 1) % projects.length].images);
  }
  showLightboxImage(direction);
}

lightboxPrev.addEventListener("click", () => moveLightbox(-1));
lightboxNext.addEventListener("click", () => moveLightbox(1));
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
function setupReveal() {
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
}

setupReveal();
