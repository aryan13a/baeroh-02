/* 
  BAEROH DESIGN STUDIO — Core Interactions
  Reference style: normcph.com (Norm Architects)
  Version 1.0
*/

document.addEventListener('DOMContentLoaded', () => {
  // Add loaded class to body to trigger hero animations
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);

  // 1. STICKY HEADER & SCROLL BEHAVIOR
  const header = document.querySelector('header');
  const heroSection = document.querySelector('.hero');
  
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
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    
    // Close menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
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

  // 5. CONTACT FORM HANDLING (Mock Submission)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = 'SENDING...';
      submitBtn.disabled = true;
      
      // Simulate form submission
      setTimeout(() => {
        submitBtn.innerHTML = 'THANK YOU';
        submitBtn.style.backgroundColor = '#6B6857'; // Olive color for success
        submitBtn.style.borderColor = '#6B6857';
        
        // Show confirmation message
        const formStatus = document.createElement('p');
        formStatus.className = 'body-copy';
        formStatus.style.marginTop = '1.5rem';
        formStatus.style.color = '#6B6857';
        formStatus.textContent = 'Your message has been received. We will respond with care shortly.';
        
        contactForm.appendChild(formStatus);
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.borderColor = '';
          formStatus.remove();
        }, 5000);
      }, 1500);
    });
  }
});
