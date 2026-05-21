/* ========================================
   GOURMET NUTRITION NY - JAVASCRIPT
   ======================================== */

// ====== MOBILE MENU TOGGLE ======
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

// Toggle menu on button click
menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ====== SMOOTH SCROLL BEHAVIOR ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const element = document.querySelector(href);
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ====== FORM SUBMISSION HANDLER ======
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const program = document.getElementById('program').value;
        const message = document.getElementById('message').value;
        
        // Validate form
        if (!name || !email || !phone || !program || !message) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        // Create WhatsApp message
        const whatsappMessage = `Hola Luis Fernando,%0A%0AMi nombre es: ${name}%0AEmail: ${email}%0ATeléfono: ${phone}%0A%0AMe interesa el programa: ${program}%0A%0A${message}`;
        
        // Send to WhatsApp (CHANGE THE PHONE NUMBER TO YOUR ACTUAL WHATSAPP NUMBER)
        const whatsappURL = `https://wa.me/1234567890?text=${whatsappMessage}`;
        window.open(whatsappURL, '_blank');
        
        // Reset form
        contactForm.reset();
        
        // Show success message (optional)
        alert('¡Gracias! En breve nos pondremos en contacto por WhatsApp.');
    });
}

// ====== DOWNLOAD RESOURCE FUNCTION ======
function downloadResource(filename) {
    // Create a simple download link
    // In a real implementation, you would have actual PDF files in an /assets/downloads/ folder
    
    alert('El recurso "' + filename + '" está siendo preparado. Recibirás un enlace de descarga vía WhatsApp.');
    
    // Alternative: If you have actual files, use this:
    // const link = document.createElement('a');
    // link.href = 'assets/downloads/' + filename;
    // link.download = filename;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
}

// ====== DISCLAIMER MODAL ======
const disclaimerModal = document.getElementById('disclaimerModal');
const disclaimerShown = localStorage.getItem('disclaimerShown');

// Show disclaimer on first visit
if (!disclaimerShown) {
    // Delay showing the modal for better UX (after page load)
    setTimeout(() => {
        disclaimerModal.style.display = 'block';
    }, 3000);
}

// Close disclaimer
function closeDisclaimer() {
    disclaimerModal.style.display = 'none';
    localStorage.setItem('disclaimerShown', 'true');
}

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    if (event.target === disclaimerModal) {
        closeDisclaimer();
    }
});

// ====== SCROLL ANIMATIONS ======
// Add scroll animation to elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll(
    '.method-card, .program-card, .tool-card, .module-card, .testimonial-card, .resource-card'
).forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease';
    observer.observe(element);
});

// ====== ACTIVE NAV LINK ======
window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ====== UTILITY FUNCTIONS ======

/**
 * Format currency in USD
 * Usage: formatCurrency(125) -> $125.00
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone number
 */
function validatePhone(phone) {
    const re = /^[\d\s()+-]*$/;
    return re.test(phone) && phone.length >= 10;
}

// ====== CONSOLE LOG FOR DEBUGGING ======
console.log('%cGourmet Nutrition NY Website Loaded', 'color: #1F5E3B; font-size: 16px; font-weight: bold;');
console.log('For support, contact: coach@gourmetnutritionny.com');
