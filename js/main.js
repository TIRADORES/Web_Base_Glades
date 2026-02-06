// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Scroll reveal animation
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInOnScroll = () => {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
};

// Initial check on page load
fadeInOnScroll();

// Check on scroll
window.addEventListener('scroll', fadeInOnScroll);

// Form submission handling
const contactForm = document.getElementById('contactForm');
const investorForm = document.getElementById('investorForm');

const handleFormSubmit = (form, formType) => {
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = form.querySelector('input[type="text"], input[placeholder*="Name"]')?.value;
            const email = form.querySelector('input[type="email"]')?.value;
            const company = form.querySelector('input[placeholder*="Company"], input[id*="company"]')?.value;
            
            // Simple form validation
            if (name && email) {
                // In a real application, you would send this data to a server
                let message = `Thank you ${name}`;
                if (company) message += ` from ${company}`;
                message += `! Your ${formType} has been sent. Our team will contact you at ${email} shortly.`;
                
                alert(message);
                form.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
};

// Initialize form handlers
handleFormSubmit(contactForm, 'message');
handleFormSubmit(investorForm, 'inquiry');

// Sticky header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
        }
    }
});

// Active link highlighting based on current page
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});