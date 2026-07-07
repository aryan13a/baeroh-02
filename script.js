/* 
  BAEROH DESIGN STUDIO — Core Interactions
  Reference style: normcph.com (Norm Architects)
  Version 1.1
*/

document.addEventListener('DOMContentLoaded', () => {
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
});
