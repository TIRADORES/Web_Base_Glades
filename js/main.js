// ============================================
// GLADES INTERNATIONAL - CONSOLIDATED JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE MENU TOGGLE =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile menu when clicking on a link
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }

    // ===== FADE-IN ANIMATIONS ON SCROLL =====
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initial check
    checkFade();
    
    // Check on scroll
    window.addEventListener('scroll', checkFade);

    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Skip if it's just "#" or links to different page
            if (href === '#' || href.includes('.html')) return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== ACTIVE LINK HIGHLIGHTING =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-links a');
    
    navLinksAll.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ===== STICKY HEADER BACKGROUND ON SCROLL =====
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

    // ===== FORM HANDLING WITH AUTO-REDIRECT =====
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Investor Form
    const investorForm = document.getElementById('investorForm');
    if (investorForm) {
        investorForm.addEventListener('submit', handleInvestorSubmit);
    }
    
    // Quick Contact Form
    const quickContactForm = document.getElementById('quickContactForm');
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', handleQuickSubmit);
    }

    // ===== CURRENT YEAR IN FOOTER =====
    const yearElement = document.querySelector('.copyright p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        // Replace any year in the copyright text
        yearElement.innerHTML = yearElement.innerHTML.replace(/\d{4}/, currentYear);
    }
});

// ===== FORM SUBMISSION HANDLERS =====

function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    
    // Validate form
    if (!validateForm(form)) {
        const firstError = form.querySelector('.invalid');
        if (firstError) {
            firstError.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Prepare form data
    const formData = new FormData(form);
    formData.append('_subject', 'New Contact Form Submission - Glades International');
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    
    // Send form data
    fetch(form.getAttribute('action'), {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Show success modal
            showSuccessModal('Thank you for contacting us! We will respond within 24 hours.');
            form.reset();
            clearValidation(form);
            
            // Auto-redirect after 3 seconds
            setTimeout(() => {
                closeSuccessModal();
                window.location.href = 'contact.html';
            }, 3000);
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting the form. Please try again or contact us directly.');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function handleInvestorSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit, button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Prepare form data
    const formData = new FormData(form);
    formData.append('_subject', 'New Investor Inquiry - Glades International');
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    
    // Send form data
    fetch('https://formsubmit.co/baybayinedu@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showSuccessModal('Thank you for your inquiry! Our investor relations team will contact you within 24 hours.');
            form.reset();
            
            // Auto-redirect after 3 seconds
            setTimeout(() => {
                closeSuccessModal();
                window.location.href = 'investors.html';
            }, 3000);
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your inquiry. Please try again.');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function handleQuickSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Prepare form data
    const formData = new FormData(form);
    formData.append('_subject', 'Quick Chat Message - Glades International');
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    
    // Send form data
    fetch('https://formsubmit.co/baybayinedu@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showQuickSuccess();
            form.reset();
            
            // Auto-close chat modal after 2 seconds
            setTimeout(() => {
                const chatModal = document.getElementById('chatModal');
                if (chatModal) {
                    chatModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }, 2000);
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your message. Please try again.');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// ===== FORM VALIDATION =====

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        // Clear previous error states
        field.classList.remove('invalid', 'valid');
        const validationMsg = field.parentNode.querySelector('.validation-message');
        if (validationMsg) {
            validationMsg.classList.remove('show');
        }
        
        // Check if field is empty
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('invalid');
            showValidationError(field, 'This field is required');
        }
        // Email validation
        else if (field.type === 'email' && !isValidEmail(field.value)) {
            isValid = false;
            field.classList.add('invalid');
            showValidationError(field, 'Please enter a valid email address');
        }
        // Phone validation
        else if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
            isValid = false;
            field.classList.add('invalid');
            showValidationError(field, 'Please enter a valid phone number');
        }
        // Text area validation
        else if (field.tagName === 'TEXTAREA' && field.value.trim().length < 10) {
            isValid = false;
            field.classList.add('invalid');
            showValidationError(field, 'Please provide more details (at least 10 characters)');
        }
        // Valid field
        else {
            field.classList.add('valid');
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(?:\+63|0)?[9]\d{2}[\s\-]?\d{3}[\s\-]?\d{4}$/;
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleaned);
}

function showValidationError(field, message) {
    let validationMsg = field.parentNode.querySelector('.validation-message');
    if (!validationMsg) {
        validationMsg = document.createElement('div');
        validationMsg.className = 'validation-message';
        field.parentNode.appendChild(validationMsg);
    }
    validationMsg.textContent = message;
    validationMsg.classList.add('show');
}

function clearValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.classList.remove('valid', 'invalid');
        const validationMsg = input.parentNode.querySelector('.validation-message');
        if (validationMsg) {
            validationMsg.classList.remove('show');
        }
    });
}

// ===== SUCCESS MODAL =====

function showSuccessModal(message) {
    const modal = document.getElementById('success-modal') || createSuccessModal();
    const messageEl = modal.querySelector('.modal-message');
    if (messageEl) {
        messageEl.textContent = message;
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function createSuccessModal() {
    const modal = document.createElement('div');
    modal.id = 'success-modal';
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Success!</h3>
            <p class="modal-message">Your message has been sent successfully.</p>
            <button class="btn btn-primary" onclick="closeSuccessModal()">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s;
        }
        .modal-content {
            background: white;
            width: 90%;
            max-width: 500px;
            border-radius: 12px;
            padding: 3rem;
            text-align: center;
            animation: slideUp 0.3s;
        }
        .modal-icon {
            font-size: 4rem;
            color: #27ae60;
            margin-bottom: 1.5rem;
            animation: checkmark 0.8s ease;
        }
        @keyframes checkmark {
            0% { transform: scale(0) rotate(-180deg); }
            50% { transform: scale(1.2) rotate(10deg); }
            100% { transform: scale(1) rotate(0); }
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    return modal;
}

function showQuickSuccess() {
    const chatModal = document.getElementById('chatModal');
    if (!chatModal) return;
    
    let successMsg = chatModal.querySelector('.chat-success-message');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'chat-success-message';
        successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
        chatModal.querySelector('.chat-box').appendChild(successMsg);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .chat-success-message {
                display: none;
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #27ae60;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 500;
                box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
                z-index: 10;
            }
            .chat-success-message.show {
                display: block;
                animation: slideUpIn 0.3s ease;
            }
            @keyframes slideUpIn {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    successMsg.style.display = 'block';
    successMsg.classList.add('show');
}

// ===== WINDOW LOAD EVENT =====
window.addEventListener('load', function() {
    // Add loading animation removal if exists
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
    
    // Initialize any image lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});