/**
 * Cafe Meraki Sri Lanka — Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initReveal();
  initActiveNav();
  initMenuTabs();
  initReviewsCarousel();
  initPageViews();
});

const PAGE_IDS = new Set(['home', 'story', 'menu', 'gallery', 'reviews', 'faq', 'contact']);
const DEFAULT_MENU_TAB = 'starters';

/* Header scroll effect */
function initHeader() {
  const header = document.getElementById('header');
  const toggleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', toggleScroll, { passive: true });
  toggleScroll();
}

/* Mobile navigation */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const links = menu.querySelectorAll('.nav__link');

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Scroll reveal animations with stagger */
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

/* Active nav — current page only (no scroll spy on home) */
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

/* Menu category tabs */
function initMenuTabs() {
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

/* Reviews carousel */
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

/* Page views — home landing vs separate section pages */
function setPageView(page, { menuTab, scrollTo } = {}) {
  PAGE_IDS.forEach(id => {
    document.body.classList.remove(`page--${id}`);
  });

  document.body.classList.add(`page--${page}`);
  document.body.dataset.page = page;

  if (page === 'menu') {
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

      if (anchor.classList.contains('menu__back-btn')) {
        e.preventDefault();
        setPageView('home');
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
