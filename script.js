/* ============================================
   RENTZOO — Minimal JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Mobile Menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('open');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const isHome = href === '/' || href === '/index.html';
        const isCurrentHome = window.location.pathname === '/' || window.location.pathname === '/index.html';

        // Close menu with a delay to ensure the click registers on mobile
        setTimeout(closeMenu, 300);

        if (isHome && isCurrentHome && !href.includes('#')) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeMenu);
    }
  }


  // Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));

  // Counter Animation
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1500;
    const start = performance.now();
    const suffix = el.textContent.includes('+') ? '+' : '';

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - 72,
          behavior: 'smooth',
        });
      }
    });
  });

  // FAQ Accordion (support both class names)
  const faqHeaders = document.querySelectorAll('.faq-item-header, .faq-q');
  faqHeaders.forEach(item => {
    item.addEventListener('click', () => {
      const parent = item.closest('.faq-item');
      const isActive = parent.classList.contains('active');
      
      // Close all items
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
      });

      // Open clicked item if it wasn't already active
      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

  // Contact Form WhatsApp Integration
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const inquiry = document.getElementById('inquiry').value;
      const message = document.getElementById('message').value;

      const whatsappNumber = "917013708828";
      const text = `Hi Rentzoo!\n\nI just filled out the contact form:\n- Name: ${name}\n- Email: ${email}\n- Inquiry: ${inquiry}\n\nMessage:\n${message}`;
      const encodedText = encodeURIComponent(text);
      
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
      
      // Optional: Reset form after opening WhatsApp
      contactForm.reset();
    });
  }

  // ============================
  // ROI Earnings Calculator (#4)
  // ============================
  const roiEquipment = document.getElementById('roiEquipment');
  const roiDays = document.getElementById('roiDays');
  const roiDaysValue = document.getElementById('roiDaysValue');
  const roiAmount = document.getElementById('roiAmount');

  function updateROI() {
    if (!roiEquipment || !roiDays) return;
    const rate = parseInt(roiEquipment.value, 10);
    const days = parseInt(roiDays.value, 10);
    const total = rate * days;
    if (roiDaysValue) roiDaysValue.textContent = days;
    if (roiAmount) roiAmount.textContent = '₹' + total.toLocaleString('en-IN');
  }

  if (roiEquipment) roiEquipment.addEventListener('change', updateROI);
  if (roiDays) roiDays.addEventListener('input', updateROI);

});

// ============================
// Dual Flowchart Tabs (#8)
// ============================
function switchFlow(type) {
  const tabContractor = document.getElementById('tabContractor');
  const tabOwner = document.getElementById('tabOwner');
  const flowContractor = document.getElementById('flowContractor');
  const flowOwner = document.getElementById('flowOwner');

  if (!tabContractor || !tabOwner || !flowContractor || !flowOwner) return;

  if (type === 'contractor') {
    tabContractor.classList.add('active');
    tabOwner.classList.remove('active');
    flowContractor.classList.add('active');
    flowOwner.classList.remove('active');
  } else {
    tabOwner.classList.add('active');
    tabContractor.classList.remove('active');
    flowOwner.classList.add('active');
    flowContractor.classList.remove('active');
  }
}

// ============================
// Catalog Toggle Switch (#6)
// ============================
function toggleCatalogMode() {
  const toggle = document.getElementById('catalogToggle');
  const section = document.getElementById('catalogSection');
  const labelRent = document.getElementById('labelRent');
  const labelEarn = document.getElementById('labelEarn');

  if (!toggle || !section) return;

  const isEarn = toggle.classList.toggle('earn-mode');
  section.classList.toggle('catalog-earn-mode', isEarn);

  if (labelRent && labelEarn) {
    labelRent.classList.toggle('active', !isEarn);
    labelEarn.classList.toggle('active', isEarn);
  }
}
