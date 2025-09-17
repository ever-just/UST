// UST Management Consulting Club Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.classList.toggle('active');
            const isActive = navLinks.classList.contains('active');
            this.innerHTML = isActive ? '<span>✕</span>' : '<span>☰</span>';
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!header.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<span>☰</span>';
            }
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks) {
                navLinks.classList.remove('active');
            }
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<span>☰</span>';
            }
            document.body.style.overflow = '';
        });
    });

    // Enhanced smooth scrolling for all internal links (nav + logo)
    const allInternalLinks = document.querySelectorAll('a[href^="#"]');
    
    allInternalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Advanced Intersection Observer for animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Staggered animations for grouped elements
                const delay = Array.from(element.parentNode.children).indexOf(element) * 120;
                
                setTimeout(() => {
                    if (element.classList.contains('feature') || 
                        element.classList.contains('officer') || 
                        element.classList.contains('resource')) {
                        element.classList.add('animate-in');
                    }
                    
                    if (element.classList.contains('contact-item')) {
                        element.classList.add('animate-slide-in-left');
                    }
                    
                    if (element.classList.contains('contact-form-section')) {
                        element.classList.add('animate-slide-in-right');
                    }
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.feature, .officer, .resource, .contact-item, .contact-form-section').forEach(el => {
        observer.observe(el);
    });

    // Enhanced header scroll effect
    let lastScrollTop = 0;
    
    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(102, 51, 153, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            header.style.boxShadow = '0 8px 32px rgba(102, 51, 153, 0.2)';
        } else {
            header.style.backgroundColor = 'rgba(102, 51, 153, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            header.style.boxShadow = '0 8px 32px rgba(102, 51, 153, 0.15)';
        }
        
        // Header hide/show on scroll (optional enhancement)
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }

    // Form enhancement with better UX
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        // Enhanced form submission
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('.submit-btn');
            
            if (submitBtn) {
                submitBtn.innerHTML = '<span>Sending...</span>';
                submitBtn.disabled = true;
                submitBtn.style.background = 'linear-gradient(135deg, #999999 0%, #777777 100%)';
                
                // Create success animation
                setTimeout(() => {
                    submitBtn.innerHTML = '<span>✓ Sent!</span>';
                    submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = 'Send Message';
                        submitBtn.disabled = false;
                        submitBtn.style.background = 'linear-gradient(135deg, #663399 0%, #5A4D7A 100%)';
                    }, 2000);
                }, 1000);
            }
        });

        // Enhanced form validation with better UX
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Remove error styling on focus
            input.addEventListener('focus', function() {
                this.classList.remove('error');
                this.style.borderColor = '#663399';
                this.style.boxShadow = '0 0 0 4px rgba(102, 51, 153, 0.08)';
                this.style.transform = 'translateY(-1px)';
            });
            
            // Add error styling only on form submission, not on blur
            input.addEventListener('input', function() {
                if (this.classList.contains('error') && this.value.trim()) {
                    this.classList.remove('error');
                    this.style.borderColor = '#E2E8F0';
                    this.style.boxShadow = 'none';
                }
            });
            
            // Reset styling on blur if no error
            input.addEventListener('blur', function() {
                if (!this.classList.contains('error')) {
                    this.style.borderColor = '#E2E8F0';
                    this.style.boxShadow = 'none';
                    this.style.transform = 'translateY(0)';
                }
            });
        });
        
        // Validate only on form submission
        contactForm.addEventListener('submit', function(e) {
            let hasErrors = false;
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.classList.add('error');
                    hasErrors = true;
                }
            });
            
            if (hasErrors) {
                e.preventDefault();
                // Scroll to first error
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return false;
            }
        });
    }

    // Parallax effect for hero background (desktop only)
    function handleParallax() {
        if (window.innerWidth > 768) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.hero');
                if (hero) {
                    const rate = scrolled * -0.5;
                    hero.style.transform = `translateY(${rate}px)`;
                }
            });
        }
    }

    // Enhanced logo hover animation with physics
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
        logoImg.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.08) rotate(2deg)';
            this.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
        });
        
        logoImg.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
        });
    }

    // Add typing effect to hero subtitle with proper timing
    function typeWriterEffect() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle && window.innerWidth > 768) {
            const text = subtitle.textContent;
            subtitle.textContent = '';
            subtitle.style.borderRight = '2px solid rgba(255, 255, 255, 0.7)';
            
            let index = 0;
            function typeChar() {
                if (index < text.length) {
                    subtitle.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeChar, 80);
                } else {
                    setTimeout(() => {
                        subtitle.style.borderRight = 'none';
                    }, 1000);
                }
            }
            
            setTimeout(typeChar, 1500);
        }
    }

    // Add scroll progress indicator
    function addScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #663399, #CCCCCC);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        });
    }

    // Add subtle floating animation to cards
    function addFloatingAnimation() {
        const cards = document.querySelectorAll('.feature, .officer, .resource');
        
        cards.forEach((card, index) => {
            const delay = index * 0.2;
            card.style.animation = `subtleFloat 6s ease-in-out ${delay}s infinite`;
        });
        
        // Add CSS for floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes subtleFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize all functionality
    handleHeaderScroll();
    handleParallax();
    typeWriterEffect();
    addScrollProgress();
    
    // Delay floating animation until after initial load
    setTimeout(addFloatingAnimation, 2000);
    
    // Handle window resize with debouncing
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && navLinks) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '<span>☰</span>';
                }
                document.body.style.overflow = '';
            }
        }, 250);
    });

    // Add smooth scroll listener
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // Add loading state management
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Add entrance animations to static elements
        const staticElements = document.querySelectorAll('h1, h2, p');
        staticElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }, index * 100);
        });
    });

    // Performance optimization: Reduce animations on low-power devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        document.body.classList.add('reduced-motion');
        
        const reducedMotionStyle = document.createElement('style');
        reducedMotionStyle.textContent = `
            .reduced-motion * {
                animation-duration: 0.3s !important;
                transition-duration: 0.2s !important;
            }
        `;
        document.head.appendChild(reducedMotionStyle);
    }
});