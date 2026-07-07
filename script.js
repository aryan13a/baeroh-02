/* 
  BAEROH DESIGN STUDIO — Core Interactions
  Reference style: normcph.com (Norm Architects)
  Version 1.1
*/

document.addEventListener('DOMContentLoaded', () => {
  // Add has-hero class to body if a hero section is present
  if (document.querySelector('.hero')) {
    document.body.classList.add('has-hero');
  }

  // Add loaded class to body to trigger hero animations
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);

  // 1. STICKY HEADER & SCROLL BEHAVIOR
  const header = document.querySelector('header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initialize on load

  // 2. DETECT DARK SECTIONS TO ADAPT NAVIGATION COLOR
  // Premium feature: changes nav items to white when scrolling over dark sections
  const darkSections = document.querySelectorAll('.section-dark');
  const headerHeight = 90;
  
  if (darkSections.length > 0) {
    const navObserverOptions = {
      root: null,
      rootMargin: `-${headerHeight}px 0px -${window.innerHeight - headerHeight - 10}px 0px`,
      threshold: 0
    };
    
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          header.classList.add('dark-bg-active');
        } else {
          // If we exit a dark section, we need to check if we are intersecting any other dark section
          let stillInDark = false;
          darkSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= headerHeight && rect.bottom >= headerHeight) {
              stillInDark = true;
            }
          });
          
          if (!stillInDark) {
            header.classList.remove('dark-bg-active');
          }
        }
      });
    }, navObserverOptions);
    
    darkSections.forEach(section => navObserver.observe(section));
  }

  // 3. MOBILE MENU NAVIGATION
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileMenu = document.querySelector('.mobile-nav-menu');
  
  if (mobileToggle && mobileMenu) {
    // Initial accessibility state
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');

    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    
    // Close menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // 4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserverOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px', // Trigger slightly before entering view
      threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, stop observing
          observer.unobserve(entry.target);
        }
      });
    }, revealObserverOptions);
    
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 5. CONTACT FORM HANDLING (Formspree Background Log & Direct WhatsApp Redirection)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Basic Honeypot Spam Check
      const honeypot = contactForm.querySelector('input[name="_honeypot"]');
      if (honeypot && honeypot.value !== '') {
        console.warn('Spam submission detected.');
        return; // silently discard submission
      }
      
      submitBtn.innerHTML = 'OPENING WHATSAPP...';
      submitBtn.disabled = true;

      // Extract details
      const name = contactForm.querySelector('#form-name').value;
      const email = contactForm.querySelector('#form-email').value;
      const phone = contactForm.querySelector('#form-phone').value;
      const projectSelect = contactForm.querySelector('#form-project-type');
      const projectType = projectSelect.options[projectSelect.selectedIndex].text;
      const message = contactForm.querySelector('#form-message').value;

      // Format WhatsApp Message
      const whatsappMsg = `Hello Baeroh Design Studio,\n\nI would like to start a conversation about a project.\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Project Type:* ${projectType}\n*Message:* ${message}`;
      const encodedMsg = encodeURIComponent(whatsappMsg);
      const whatsappUrl = `https://wa.me/919509628808?text=${encodedMsg}`;

      // Formspree AJAX Submission in the background (asynchronous, doesn't block redirection)
      const formData = new FormData(contactForm);
      const endpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/mjkbwdol';
      
      fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .catch(error => {
        console.error('Formspree backup submission failed:', error);
      });

      // Clear the form fields
      contactForm.reset();

      // Instantly open WhatsApp/redirect (synchronous user event flow prevents browser blocking)
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        window.location.href = whatsappUrl;
      }, 400);
    });
  }

  // 6. HERO HOMEPAGE IMAGE SLIDESHOW CONTROLLER
  const heroSection = document.getElementById('hero-slideshow');
  if (heroSection) {
    const slides = heroSection.querySelectorAll('.hero-slide');
    const dashes = heroSection.querySelectorAll('.hero-dash');
    const tagline = heroSection.getElementById('hero-tagline');
    const headline = heroSection.getElementById('hero-headline');

    const SLIDE_DATA = [
      {
        tagline: "01 / Workplace",
        headline: "The Jaipur Workspace — A study in warm, minimal textures."
      },
      {
        tagline: "02 / Hospitality",
        headline: "The Sand Plaster Café — Natural clay, charcoal timber, soft daylight."
      },
      {
        tagline: "03 / Residential",
        headline: "Modern Dwelling — Restrained materials for residential living."
      },
      {
        tagline: "04 / Commercial",
        headline: "Wellness Showroom — Monolithic sandstone pedestals & pottery."
      },
      {
        tagline: "05 / Craft",
        headline: "Materiality Flatlay — Tactile conversations between stone, oak, and plaster."
      },
      {
        tagline: "06 / Workplace",
        headline: "Focus Spaces — Architecture designed to inspire quiet thinking."
      },
      {
        tagline: "07 / Detail",
        headline: "Sandstone Pillars — Integrating timeless craftsmanship."
      },
      {
        tagline: "08 / Collaborative",
        headline: "Jaipur Open Office — Flexible environments that grow with teams."
      }
    ];

    let currentIndex = 0;
    let isPaused = false;
    let slideInterval = null;
    const intervalDuration = 5500; // 5.5 seconds between transitions

    const showSlide = (newIndex) => {
      if (newIndex === currentIndex) return;

      // Handle wrap-around
      if (newIndex >= slides.length) newIndex = 0;
      if (newIndex < 0) newIndex = slides.length - 1;

      const currentSlide = slides[currentIndex];
      const nextSlide = slides[newIndex];
      const activeDash = dashes[currentIndex];
      const nextDash = dashes[newIndex];

      // 1. Fade out active text
      tagline.classList.add('fade-out');
      headline.classList.add('fade-out');

      // 2. Transition images (crossfade 1.5s is handled via CSS transition on .hero-slide opacity)
      currentSlide.classList.remove('active');
      nextSlide.classList.add('active');

      // 3. Update dashboard dashes
      activeDash.classList.remove('active');
      nextDash.classList.add('active');

      // 4. Wait for text fade-out before updating content and fading in
      setTimeout(() => {
        tagline.textContent = SLIDE_DATA[newIndex].tagline;
        headline.textContent = SLIDE_DATA[newIndex].headline;
        
        // Remove fade-out class to trigger slide up & fade-in
        tagline.classList.remove('fade-out');
        headline.classList.remove('fade-out');
      }, 500);

      currentIndex = newIndex;
    };

    const startTimer = () => {
      stopTimer();
      slideInterval = setInterval(() => {
        if (!isPaused) {
          showSlide(currentIndex + 1);
        }
      }, intervalDuration);
    };

    const stopTimer = () => {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    };

    const resetTimer = () => {
      startTimer();
    };

    // Hover listeners to pause/resume slideshow
    heroSection.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      isPaused = false;
    });

    // Touch events for mobile swiping
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance < 0) {
          // Swipe left -> Next slide
          showSlide(currentIndex + 1);
        } else {
          // Swipe right -> Prev slide
          showSlide(currentIndex - 1);
        }
        resetTimer();
      }
    };

    // Keyboard navigation listener
    window.addEventListener('keydown', (e) => {
      // Only navigate if hero is in view to prevent confusing behavior on other pages / sections
      const rect = heroSection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView) {
        if (e.key === 'ArrowRight') {
          showSlide(currentIndex + 1);
          resetTimer();
        } else if (e.key === 'ArrowLeft') {
          showSlide(currentIndex - 1);
          resetTimer();
        }
      }
    });

    // Dash indicator click handlers
    dashes.forEach((dash) => {
      dash.addEventListener('click', () => {
        const slideIndex = parseInt(dash.getAttribute('data-slide'), 10);
        showSlide(slideIndex);
        resetTimer();
      });
    });

    // Initialize auto-advance
    startTimer();
  }
});
