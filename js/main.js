/**
 * Cafe Meraki Sri Lanka — Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroVideo();
  initMobileNav();
  initReveal();
  initActiveNav();
  initOutlets();
  initMenu();
  initReviews();
  initFaq();
  initReviewsCarousel();
  initPageViews();
});

const PAGE_IDS = new Set(['home', 'story', 'menu', 'gallery', 'reviews', 'faq', 'contact', 'locations']);
const DEFAULT_MENU_TAB = 'featured';

function getMenuData() {
  if (Array.isArray(window.MENU) && window.MENU.length > 0) {
    return window.MENU;
  }
  return window.MENUS_BY_OUTLET?.['meraki-moratuwa'] || [];
}

function getOutlets() {
  return Array.isArray(window.OUTLETS) ? window.OUTLETS : [];
}

function getOutlet(id) {
  return getOutlets().find(outlet => outlet.id === id) || getOutlets()[0];
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatMenuPrice(price) {
  if (typeof price === 'number') {
    return `LKR ${price.toLocaleString('en-LK')}`;
  }
  return price;
}

function renderUberEatsLogo() {
  return `<img
    src="assets/ubereats-logo.png?v=2"
    alt=""
    class="btn__ubereats-logo"
    width="32"
    height="32"
    decoding="async"
    aria-hidden="true"
  >`;
}

function renderUberEatsButton(outlet, className = 'btn btn--ubereats') {
  if (!outlet?.uberEatsUrl) return '';

  const outletName = outlet.name || outlet.shortName;

  return `
    <a
      href="${escapeHtml(outlet.uberEatsUrl)}"
      target="_blank"
      rel="noopener"
      class="${className}"
      aria-label="Order from ${escapeHtml(outletName)} on Uber Eats"
    >
      ${renderUberEatsLogo()}
      <span class="btn__ubereats-label">Order now</span>
    </a>`;
}

function renderOutletCard(outlet) {
  const emailLine = outlet.email
    ? `<li>
        <svg class="info-list__icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        <a href="mailto:${escapeHtml(outlet.email)}">${escapeHtml(outlet.email)}</a>
      </li>`
    : '';

  return `
    <article class="outlet-card reveal">
      <h3 class="outlet-card__name">${escapeHtml(outlet.name)}</h3>
      <p class="outlet-card__tagline">${escapeHtml(outlet.tagline)}</p>
      <ul class="info-list info-list--outlet">
        <li>
          <svg class="info-list__icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>
          <span>${escapeHtml(outlet.address)}</span>
        </li>
        <li>
          <svg class="info-list__icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"/></svg>
          <a href="${escapeHtml(outlet.phoneHref)}" target="_blank" rel="noopener">${escapeHtml(outlet.phone)}</a>
        </li>
        ${emailLine}
        <li>
          <svg class="info-list__icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          <span>${escapeHtml(outlet.hours)}</span>
        </li>
      </ul>
      <div class="outlet-card__actions">
        <a href="${escapeHtml(outlet.mapsUrl)}" target="_blank" rel="noopener" class="btn btn--directions">Get Directions</a>
        ${renderUberEatsButton(outlet)}
        <a href="#menu" class="btn btn--outline outlet-card__menu-btn" data-outlet="${escapeHtml(outlet.id)}">View Menu</a>
      </div>
    </article>`;
}

function initOutlets() {
  const locationsGrid = document.getElementById('locationsGrid');
  const footerOutlets = document.getElementById('footerOutlets');
  const outlets = getOutlets();

  if (locationsGrid) {
    locationsGrid.innerHTML = outlets.map(renderOutletCard).join('');
    observeReveals(locationsGrid.querySelectorAll('.reveal'));
    locationsGrid.querySelectorAll('.outlet-card__menu-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        setPageView('menu', { menuTab: DEFAULT_MENU_TAB });
      });
    });
  }

  if (footerOutlets) {
    footerOutlets.innerHTML = outlets
      .map(
        outlet => `
        <div class="footer__outlet">
          <h5>${escapeHtml(outlet.name)}</h5>
          <p>${escapeHtml(outlet.address)}</p>
          <p><a href="${escapeHtml(outlet.phoneHref)}" target="_blank" rel="noopener">${escapeHtml(outlet.phone)}</a></p>
          <p>${escapeHtml(outlet.hours)}</p>
          <a href="${escapeHtml(outlet.mapsUrl)}" target="_blank" rel="noopener" class="btn btn--directions btn--sm">Directions</a>
        </div>`
      )
      .join('');
  }
}

function renderMenu() {
  const tabsEl = document.getElementById('menuTabs');
  const panelsEl = document.getElementById('menuPanels');
  const menuBackActions = document.getElementById('menuBackActions');
  const menuData = getMenuData();

  if (!tabsEl || !panelsEl || menuData.length === 0) {
    return;
  }

  tabsEl.innerHTML = menuData
    .map(
      (category, index) => `
        <button
          class="menu__tab${index === 0 ? ' active' : ''}"
          role="tab"
          aria-selected="${index === 0}"
          data-tab="${escapeHtml(category.id)}"
        >${escapeHtml(category.label)}</button>`
    )
    .join('');

  panelsEl.innerHTML = menuData
    .map(
      (category, index) => `
        <div
          class="menu__panel${index === 0 ? ' active' : ''}"
          id="tab-${escapeHtml(category.id)}"
          role="tabpanel"
          ${index === 0 ? '' : 'hidden'}
        >
          <h3 class="menu__panel-title">${escapeHtml(category.label)}</h3>
          <ul class="menu-list">
            ${category.items
              .map(
                item => `
              <li class="menu-item">
                <div class="menu-item__head">
                  <h4 class="menu-item__name">${escapeHtml(item.name)}</h4>
                  <span class="menu-item__price">${escapeHtml(formatMenuPrice(item.price))}</span>
                </div>
                ${item.desc ? `<p class="menu-item__desc">${escapeHtml(item.desc)}</p>` : ''}
              </li>`
              )
              .join('')}
          </ul>
        </div>`
    )
    .join('');

  if (menuBackActions) {
    menuBackActions.className = 'menu__back reveal';
    menuBackActions.innerHTML = `
      <a href="#home" class="btn btn--outline menu__back-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
        Back to Home
      </a>`;
  }

  initMenuTabs();
}

function initMenu() {
  renderMenu();
}

function initHeroVideo() {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    video.playbackRate = 0.55;
  }

  const showFallback = () => {
    video.classList.add('is-failed');
    video.classList.remove('is-playing');
  };

  const tryPlay = () => {
    if (video.classList.contains('is-failed')) return;
    video.play().catch(showFallback);
  };

  video.addEventListener('error', showFallback);
  video.addEventListener('playing', () => {
    video.classList.add('is-playing');
  });

  video.addEventListener('loadeddata', () => {
    if (!video.videoWidth || !video.videoHeight) {
      showFallback();
      return;
    }
    tryPlay();
  });

  // HEVC/H.265 often fails silently in Chrome — fall back to poster image
  window.setTimeout(() => {
    if (!video.classList.contains('is-playing') && video.readyState < 3) {
      showFallback();
    }
  }, 5000);

  tryPlay();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });
}

function initHeader() {
  const header = document.getElementById('header');
  const toggleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', toggleScroll, { passive: true });
  toggleScroll();
}

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const backdrop = document.getElementById('navBackdrop');
  const links = menu.querySelectorAll('.nav__link');

  const setMenuOpen = isOpen => {
    menu.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
    if (backdrop) {
      backdrop.classList.toggle('open', isOpen);
      backdrop.setAttribute('aria-hidden', String(!isOpen));
    }
  };

  toggle.addEventListener('click', () => {
    setMenuOpen(!menu.classList.contains('open'));
  });

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      setMenuOpen(false);
    });
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });
}

function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el, i) => {
    if (!el.style.getPropertyValue('--reveal-delay')) {
      el.style.setProperty('--reveal-delay', `${Math.min(i % 6, 5) * 80}ms`);
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  reveals.forEach(el => observer.observe(el));
}

function observeReveals(elements) {
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

function initActiveNav() {
  updateNavActive(getCurrentPage());
}

function updateNavActive(page) {
  document.querySelectorAll('.nav__link[data-section]').forEach(link => {
    link.classList.toggle('active', link.dataset.section === page);
  });
}

function getCurrentPage() {
  return document.body.dataset.page || 'home';
}

function hrefToPage(href) {
  const id = href.replace('#', '');
  return PAGE_IDS.has(id) ? id : null;
}

function isSiteNavLink(anchor) {
  return anchor.classList.contains('nav__link') || Boolean(anchor.closest('.footer__nav'));
}

function initMenuTabs() {
  document.querySelectorAll('.menu__tab').forEach(tab => {
    tab.replaceWith(tab.cloneNode(true));
  });

  document.querySelectorAll('.menu__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activateMenuTab(tab.dataset.tab);
    });
  });
}

function activateMenuTab(target) {
  document.querySelectorAll('.menu__tab').forEach(tab => {
    const isActive = tab.dataset.tab === target;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  document.querySelectorAll('.menu__panel').forEach(panel => {
    const isTarget = panel.id === `tab-${target}`;
    panel.classList.toggle('active', isTarget);
    panel.hidden = !isTarget;
  });
}

function initReviews() {
  const track = document.getElementById('reviewsTrack');
  const reviews = window.SITE_DATA?.reviews || [];

  if (!track || reviews.length === 0) return;

  track.innerHTML = reviews
    .map(review => {
      const stars = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
      const outlet = getOutlet(review.outletId);
      const outletLabel = outlet
        ? `<span class="review-card__outlet">${escapeHtml(outlet.name)}</span>`
        : '';
      return `
        <article class="review-card">
          <div class="review-card__quote" aria-hidden="true">"</div>
          <div class="review-card__stars" aria-label="${review.stars} out of 5 stars">${stars}</div>
          <blockquote>${escapeHtml(review.quote)}</blockquote>
          <cite>— ${escapeHtml(review.author)}${outletLabel}</cite>
        </article>`;
    })
    .join('');
}

function initFaq() {
  const faqList = document.getElementById('faqList');
  const outlets = getOutlets();

  if (!faqList || outlets.length === 0) return;

  const locationLines = outlets
    .map(o => `<strong>${escapeHtml(o.name)}</strong> — ${escapeHtml(o.address)}`)
    .join('<br>');

  const hoursLines = outlets
    .map(o => `<strong>${escapeHtml(o.shortName || o.name)}:</strong> ${escapeHtml(o.hours)}`)
    .join('<br>');

  const sharedHours = outlets.every(o => o.hours === outlets[0].hours);
  const hoursAnswer = sharedHours
    ? `${escapeHtml(outlets[0].hours)}<br><br>Same hours at both outlets. Hours may vary on public holidays — check our Facebook page for updates.`
    : `${hoursLines}<br><br>Hours may vary on public holidays — check our Facebook page for updates.`;

  const contactLines = outlets
    .map(o => {
      const email = o.email ? ` · <a href="mailto:${escapeHtml(o.email)}">${escapeHtml(o.email)}</a>` : '';
      return `<strong>${escapeHtml(o.name)}:</strong> <a href="${escapeHtml(o.phoneHref)}" target="_blank" rel="noopener">${escapeHtml(o.phone)}</a>${email}`;
    })
    .join('<br>');

  const deliveryLines = outlets
    .map(o => escapeHtml(o.name))
    .join(' and ');

  const items = [
    {
      open: true,
      q: 'Where are your outlets located?',
      a: `${locationLines}<br><br>See <a href="#locations">Our Locations</a> for directions and maps.`,
    },
    {
      q: 'What are your opening hours?',
      a: hoursAnswer,
    },
    {
      q: 'How do I place an order or get in touch?',
      a: `${contactLines}<br><br>Walk-ins are welcome during opening hours.`,
    },
    {
      q: 'What kind of food do you serve?',
      a: 'Artisan coffee, pastries, and light bites alongside Sri Lankan–Chinese favourites — fried rice, noodles, pasta, soups, cuttlefish, and more. See our <a href="#menu">Menu</a> for the full list.',
    },
    {
      q: 'Do you offer delivery?',
      a: `Yes! Order on Uber Eats from ${deliveryLines} — see <a href="#locations">Our Locations</a> for the right outlet button. Dine-in and takeaway are also available.`,
    },
    {
      q: 'Where can I follow Cafe Meraki online?',
      a: 'Find us on Facebook, Instagram, and TikTok — see the icons in the footer.',
    },
  ];

  faqList.innerHTML = items
    .map(
      item => `
      <details class="faq__item"${item.open ? ' open' : ''}>
        <summary>${escapeHtml(item.q)}</summary>
        <p>${item.a}</p>
      </details>`
    )
    .join('');
}

function initReviewsCarousel() {
  const track = document.getElementById('reviewsTrack');
  const prev = document.querySelector('.reviews__nav--prev');
  const next = document.querySelector('.reviews__nav--next');

  if (!track) return;

  const scrollAmount = () => {
    const card = track.querySelector('.review-card');
    return card ? card.offsetWidth + 24 : 400;
  };

  prev?.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });

  next?.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });
}

function setPageView(page, { menuTab, scrollTo } = {}) {
  PAGE_IDS.forEach(id => {
    document.body.classList.remove(`page--${id}`);
  });

  document.body.classList.add(`page--${page}`);
  document.body.dataset.page = page;

  if (page === 'menu') {
    renderMenu();
    activateMenuTab(menuTab || DEFAULT_MENU_TAB);
  }

  window.scrollTo({ top: 0, behavior: 'instant' });

  if (scrollTo) {
    const sectionId = scrollTo.replace('#', '');
    updateNavActive(sectionId);
    requestAnimationFrame(() => {
      document.querySelector(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
    });
  } else if (page === 'home') {
    updateNavActive('home');
  } else {
    updateNavActive(page);
  }

  history.replaceState(null, '', scrollTo || `#${page}`);
}

function scrollOnHome(selector) {
  if (getCurrentPage() !== 'home') {
    setPageView('home');
  }
  requestAnimationFrame(() => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  });
}

function initPageViews() {
  document.addEventListener('click', e => {
    const backBtn = e.target.closest('.menu__back-btn');
    if (backBtn) {
      e.preventDefault();
      setPageView('home');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      if (anchor.classList.contains('nav__logo') || anchor.classList.contains('footer__logo')) {
        return;
      }

      const page = hrefToPage(href);

      if (anchor.id === 'viewFullMenuBtn') {
        e.preventDefault();
        setPageView('menu', { menuTab: DEFAULT_MENU_TAB });
        return;
      }

      if (page && isSiteNavLink(anchor)) {
        e.preventDefault();

        if (page === 'menu') {
          setPageView('menu', { menuTab: DEFAULT_MENU_TAB });
        } else if (page === 'gallery') {
          setPageView('gallery');
        } else if (page === 'home') {
          setPageView('home');
        } else {
          setPageView('home', { scrollTo: href });
        }
        return;
      }

      if (page === 'contact' && anchor.classList.contains('btn')) {
        e.preventDefault();
        setPageView('contact');
        return;
      }

      if (page === 'menu' && anchor.classList.contains('btn--primary')) {
        e.preventDefault();
        scrollOnHome('#menu');
        return;
      }

      if (href === '#highlights' || (page === 'menu' && getCurrentPage() === 'home')) {
        e.preventDefault();
        scrollOnHome(href);
      }
    });
  });

  document.querySelectorAll('.nav__logo, .footer__logo').forEach(logo => {
    logo.addEventListener('click', e => {
      e.preventDefault();
      setPageView('home');
    });
  });

  const hash = window.location.hash || '#home';
  const page = hrefToPage(hash) || 'home';

  if (page === 'menu') {
    setPageView('menu', { menuTab: DEFAULT_MENU_TAB });
  } else if (page === 'gallery') {
    setPageView('gallery');
  } else if (page === 'home') {
    setPageView('home');
  } else {
    setPageView('home', { scrollTo: hash });
  }

  window.addEventListener('hashchange', () => {
    const nextHash = window.location.hash || '#home';
    const nextPage = hrefToPage(nextHash) || 'home';

    if (nextPage === 'menu') {
      setPageView('menu', { menuTab: DEFAULT_MENU_TAB });
    } else if (nextPage === 'gallery') {
      setPageView('gallery');
    } else if (nextPage === 'home') {
      setPageView('home');
    } else {
      setPageView('home', { scrollTo: nextHash });
    }
  });
}
