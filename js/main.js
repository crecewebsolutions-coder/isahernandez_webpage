/* ==========================================================================
   ISA HERNANDEZ | PHOTO & MAKE UP
   Core Navigation, Hero Slideshow & Scroll Animation Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // 2. Mobile Drawer Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');

  if (mobileToggle && mobileDrawer && mobileOverlay) {
    const toggleMenu = () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      mobileToggle.classList.toggle('active', isOpen);
      mobileOverlay.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);

    const mobileClose = document.querySelector('.mobile-drawer-close');
    if (mobileClose) {
      mobileClose.addEventListener('click', toggleMenu);
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  }

  // 3. Active Link Highlighter
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (link.classList.contains('active') && href !== currentPath) {
      link.classList.remove('active');
    }
  });

  // 4. HERO BACKGROUND SLIDESHOW (Smooth Crossfade)
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  let currentSlideIndex = 0;
  let slideInterval = null;

  function showSlide(index) {
    if (heroSlides.length === 0) return;
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlideIndex = index;
  }

  function nextSlide() {
    if (heroSlides.length === 0) return;
    const nextIndex = (currentSlideIndex + 1) % heroSlides.length;
    showSlide(nextIndex);
  }

  if (heroSlides.length > 1) {
    slideInterval = setInterval(nextSlide, 5000);

    heroDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(idx);
        slideInterval = setInterval(nextSlide, 5000);
      });
    });

    const heroContainer = document.querySelector('.hero-editorial');
    if (heroContainer) {
      heroContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
      heroContainer.addEventListener('mouseleave', () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
      });
    }
  }

  // 5. INTERSECTION OBSERVER SCROLL REVEAL ANIMATIONS
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 6. Category Navigation Pills Active Spy
  const catPills = document.querySelectorAll('.cat-pill');
  if (catPills.length > 0) {
    const categoryBlocks = document.querySelectorAll('.category-block, #estilismo-maquillaje');
    const updateActivePill = () => {
      let currentId = '';
      const scrollPos = window.scrollY + 160;
      categoryBlocks.forEach(block => {
        if (block.offsetTop <= scrollPos) {
          currentId = block.getAttribute('id');
        }
      });
      if (currentId) {
        catPills.forEach(pill => {
          const href = (pill.getAttribute('href') || '').replace('#', '');
          pill.classList.toggle('active', href === currentId);
        });
      }
    };
    window.addEventListener('scroll', updateActivePill);
    updateActivePill();
  }

  // 7. Initialize Universal Interactive Lightbox
  initUniversalLightbox();
});

// 7. Direct Email Dispatcher for Contact Form
function sendContactEmail(e) {
  if (e) e.preventDefault();
  const name = (document.getElementById('contactName')?.value || '').trim();
  const email = (document.getElementById('contactEmail')?.value || '').trim();
  const phone = (document.getElementById('contactPhone')?.value || '').trim();
  const service = document.getElementById('contactService')?.value || 'Consulta General';
  const msg = (document.getElementById('contactMsg')?.value || '').trim();

  const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');

  const subject = encodeURIComponent(
    isEn ? `Website Inquiry: ${name || 'Client'} - ${service}` : `Consulta Web: ${name || 'Cliente'} - ${service}`
  );

  const body = encodeURIComponent(
    isEn
      ? `Hello Isa,\n\nI am contacting you through your official website:\n\n` +
        `• Name: ${name}\n` +
        `• Email: ${email}\n` +
        `• Phone: ${phone}\n` +
        `• Service of interest: ${service}\n\n` +
        `Message / Tentative Date / Notes:\n${msg || 'I would like to inquire about availability and details.'}\n\n` +
        `--\nIsa Hernandez Photo & Makeup LLC (Phoenix, AZ)`
      : `Hola Isa,\n\nTe contacto a través de tu sitio web oficial:\n\n` +
        `• Nombre: ${name}\n` +
        `• Correo: ${email}\n` +
        `• Teléfono: ${phone}\n` +
        `• Servicio de interés: ${service}\n\n` +
        `Mensaje / Fecha tentativa / Detalles:\n${msg || 'Me gustaría consultar disponibilidad y detalles.'}\n\n` +
        `--\nIsa Hernandez Photo & Makeup LLC (Phoenix, AZ)`
  );

  window.location.href = `mailto:Isavision21@gmail.com?subject=${subject}&body=${body}`;
}

// 8. UNIVERSAL INTERACTIVE LIGHTBOX ENGINE
function initUniversalLightbox() {
  let modal = document.querySelector('.lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Visor de imagen');
    modal.innerHTML = `
      <button class="lightbox-close" aria-label="Cerrar">&times;</button>
      <button class="lightbox-nav-btn lightbox-prev" aria-label="Anterior">&#10094;</button>
      <button class="lightbox-nav-btn lightbox-next" aria-label="Siguiente">&#10095;</button>
      <div class="lightbox-content">
        <img class="lightbox-img" src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const lightboxImg = modal.querySelector('.lightbox-img');
  const lightboxCaption = modal.querySelector('.lightbox-caption');
  const lightboxClose = modal.querySelector('.lightbox-close');
  const lightboxPrev = modal.querySelector('.lightbox-prev');
  const lightboxNext = modal.querySelector('.lightbox-next');

  let activeIndex = 0;
  let currentCollection = [];

  function openLightbox(items, index) {
    if (!items || items.length === 0) return;
    currentCollection = items;
    activeIndex = (index + items.length) % items.length;
    renderCurrentItem();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function renderCurrentItem() {
    const item = currentCollection[activeIndex];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt || item.title || 'Isa Hernandez Photo';

    let captionHtml = '';
    if (item.title) {
      captionHtml += `<div class="lightbox-title">${item.title}</div>`;
    }
    if (item.cat) {
      captionHtml += `<div class="lightbox-cat">${item.cat}</div>`;
    }
    if (item.desc) {
      captionHtml += `<div class="lightbox-desc">${item.desc}</div>`;
    }
    if (currentCollection.length > 1) {
      captionHtml += `<div class="lightbox-counter">${activeIndex + 1} / ${currentCollection.length}</div>`;
      if (lightboxPrev) lightboxPrev.style.display = 'flex';
      if (lightboxNext) lightboxNext.style.display = 'flex';
    } else {
      if (lightboxPrev) lightboxPrev.style.display = 'none';
      if (lightboxNext) lightboxNext.style.display = 'none';
    }

    if (lightboxCaption) {
      lightboxCaption.innerHTML = captionHtml;
    }
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    if (currentCollection.length <= 1) return;
    activeIndex = (activeIndex + 1) % currentCollection.length;
    renderCurrentItem();
  }

  function showPrev() {
    if (currentCollection.length <= 1) return;
    activeIndex = (activeIndex - 1 + currentCollection.length) % currentCollection.length;
    renderCurrentItem();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Mobile Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;
  modal.addEventListener('touchstart', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchStartX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) showNext();
        else showPrev();
      }
    }
  }, { passive: true });

  window.siteLightbox = {
    open: openLightbox,
    close: closeLightbox,
    next: showNext,
    prev: showPrev
  };

  // 1. Attach to Portfolio Items
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (portfolioItems.length > 0) {
    portfolioItems.forEach(item => {
      item.style.cursor = 'zoom-in';
      item.addEventListener('click', () => {
        const visibleItems = Array.from(portfolioItems).filter(el => el.style.display !== 'none');
        const collection = visibleItems.map(el => {
          const img = el.querySelector('img');
          const title = el.querySelector('.portfolio-item-title')?.textContent.trim() || '';
          const cat = el.querySelector('.portfolio-item-cat')?.innerHTML.trim() || '';
          const desc = el.querySelector('.portfolio-item-desc')?.textContent.trim() || '';
          return {
            src: img ? img.src : '',
            alt: img ? (img.alt || title) : '',
            title: title,
            cat: cat,
            desc: desc
          };
        });
        const clickedIdx = visibleItems.indexOf(item);
        openLightbox(collection, clickedIdx >= 0 ? clickedIdx : 0);
      });
    });
  }

  // 2. Attach to Content Photos Across the Website
  const contentImages = document.querySelectorAll(
    '.editorial-gallery-grid img, .polaroid-collage img, .about-photo img, .studio-setup img, .instagram-strip img, .story-image img, .split-image-container img'
  );

  contentImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      const parentGroup = img.closest('.editorial-gallery-grid, .polaroid-collage, .instagram-strip, section, main') || document.body;
      const groupImgs = Array.from(parentGroup.querySelectorAll('img')).filter(i => {
        return !i.closest('.site-header, .site-footer, .mobile-drawer, .nav-logo, .logo');
      });

      const collection = groupImgs.map(i => ({
        src: i.src,
        alt: i.alt || 'Isa Hernandez Photo & Makeup LLC',
        title: i.alt || 'Isa Hernandez Photo & Makeup',
        cat: '',
        desc: ''
      }));

      const clickedIdx = groupImgs.indexOf(img);
      openLightbox(collection, clickedIdx >= 0 ? clickedIdx : 0);
    });
  });
}

/* ==========================================================================
   Testimonial "Leer más / Read more" Expander
   ========================================================================== */
function toggleTestimonial(btn) {
  const card = btn.closest('.testimonial-card');
  if (!card) return;
  const fullText = card.querySelector('.testimonial-full-text');
  const ellipsis = card.querySelector('.testimonial-ellipsis');
  const label = btn.querySelector('.read-more-label');
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';

  const lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : (document.documentElement.lang || 'es');
  const dict = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : null;

  if (isExpanded) {
    if (fullText) fullText.style.display = 'none';
    if (ellipsis) ellipsis.style.display = 'inline';
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('is-expanded');
    if (label) {
      label.setAttribute('data-i18n', 'btn_read_more');
      label.textContent = (dict && dict.btn_read_more) ? dict.btn_read_more : (lang === 'en' ? 'Read more' : 'Leer más');
    }
  } else {
    if (fullText) fullText.style.display = 'inline';
    if (ellipsis) ellipsis.style.display = 'none';
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('is-expanded');
    if (label) {
      label.setAttribute('data-i18n', 'btn_read_less');
      label.textContent = (dict && dict.btn_read_less) ? dict.btn_read_less : (lang === 'en' ? 'Read less' : 'Leer menos');
    }
  }
}
window.toggleTestimonial = toggleTestimonial;

/* ==========================================================================
   Reviews Filter Functionality
   ========================================================================== */
function filterReviews(category, btn) {
  const cards = document.querySelectorAll('.testimonial-card');
  const buttons = document.querySelectorAll('.review-filter-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  cards.forEach(card => {
    const cat = card.getAttribute('data-review-cat');
    if (category === 'all' || cat === category) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}
window.filterReviews = filterReviews;

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (new URLSearchParams(window.location.search).get('expand') === '1') {
      setTimeout(() => {
        document.querySelectorAll('.btn-read-more').forEach(btn => toggleTestimonial(btn));
      }, 150);
    }
  } catch (e) {}
});


