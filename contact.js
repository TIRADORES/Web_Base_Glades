// Enhanced Contact Page JavaScript with All Fixes
document.addEventListener('DOMContentLoaded', function() {
    // Contact form elements
    const contactForm = document.getElementById('contactForm');
    const quickContactForm = document.getElementById('quickContactForm');
    
    // Success modal elements
    const successModal = document.getElementById('success-modal');
    const backToContactBtn = document.getElementById('backToContact');
    const closeModalBtn = document.getElementById('closeModal');
    
    // Chat modal elements
    const chatModal = document.getElementById('chatModal');
    const openChatBtn = document.getElementById('openChat');
    const closeChatBtn = document.getElementById('closeChat');
    const openChatBtnMain = document.getElementById('openChatBtn');
    
    // Location tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Update the locations data for correct addresses
    const locations = {
        'main-office': {
            name: 'Glades International Corporation',
            address: 'Solid Street, LIIP, Mamplasan, Biñan City, Laguna, Philippines 4024',
            phone: ['(+632) 531-2203', '(+632) 531-2248'],
            email: ['info@gladesinternational.com', 'sales@gladesinternational.com'],
            hours: 'Monday - Friday: 8:00 AM - 5:00 PM<br>Saturday: 8:00 AM - 12:00 PM',
            mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3864.1090146279114!2d121.074992!3d14.327878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d781c6e23a95%3A0x8f3d7b7a3b5c5c1!2sLIIP%20Mamplasan%2C%20Bi%C3%B1an%2C%20Laguna%2C%20Philippines!5e0!3m2!1sen!2sph!4v1690000000000!5m2!1sen!2sph'
        },
        'plant-1': {
            name: 'Glades Plant 1',
            address: 'Phase 3, LIIP, Mamplasan, Biñan City, Laguna, Philippines 4024',
            phone: ['(+632) 531-2204'],
            email: ['plant1@gladesinternational.com'],
            hours: '24/7 Operations<br>3 Shift Rotation',
            mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3864.112222222222!2d121.075555!3d14.327777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d781c6e23a95%3A0x8f3d7b7a3b5c5c1!2sLIIP%20Mamplasan%2C%20Bi%C3%B1an%2C%20Laguna%2C%20Philippines!5e0!3m2!1sen!2sph!4v1690000000000!5m2!1sen!2sph'
        },
        'plant-2': {
            name: 'Glades Plant 2',
            address: 'Phase 4, LIIP, Mamplasan, Biñan City, Laguna, Philippines 4024',
            phone: ['(+632) 531-2205'],
            email: ['plant2@gladesinternational.com'],
            hours: '24/7 Operations<br>Specialized Manufacturing',
            mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3864.1155555555556!2d121.076111!3d14.327777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d781c6e23a95%3A0x8f3d7b7a3b5c5c1!2sLIIP%20Mamplasan%2C%20Bi%C3%B1an%2C%20Laguna%2C%20Philippines!5e0!3m2!1sen!2sph!4v1690000000000!5m2!1sen!2sph'
        }
    };

    // Initialize phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                // Format as +63 XXX XXX XXXX
                if (!value.startsWith('63')) {
                    value = '63' + value;
                }
                
                let formatted = '+';
                for (let i = 0; i < value.length; i++) {
                    if (i === 2 || i === 5 || i === 8) {
                        formatted += ' ';
                    }
                    formatted += value[i];
                }
                
                e.target.value = formatted.substring(0, 16);
            }
        });
    }
    
    // Main contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm(contactForm)) {
                // Show loading state
                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Prepare form data
                const formData = new FormData(contactForm);
                
                // For FormSubmit.co - add additional parameters
                formData.append('_subject', 'New Contact Form Submission - Glades International');
                formData.append('_template', 'table');
                formData.append('_captcha', 'false');
                formData.append('_autoresponse', 'Thank you for contacting Glades International. We will respond within 24 hours.');
                
                // Determine which endpoint to use
                let formAction = contactForm.getAttribute('action');
                
                // Send form data using fetch
                fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Show success modal with enhanced message
                        showSuccessModal();
                        
                        // Reset form and button state
                        setTimeout(() => {
                            contactForm.reset();
                            
                            // Reset button state
                            submitBtn.innerHTML = originalText;
                            submitBtn.disabled = false;
                            
                            // Remove validation classes
                            const inputs = contactForm.querySelectorAll('input, textarea, select');
                            inputs.forEach(input => {
                                input.classList.remove('valid', 'invalid');
                                const validationMsg = input.parentNode.querySelector('.validation-message');
                                if (validationMsg) {
                                    validationMsg.classList.remove('show');
                                }
                            });
                        }, 1000);
                        
                        // Auto-close modal after 5 seconds
                        setTimeout(() => {
                            if (successModal && successModal.style.display === 'flex') {
                                closeSuccessModal();
                            }
                        }, 5000);
                        
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error submitting the form. Please try again or contact us directly.');
                    
                    // Reset button state
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
            } else {
                // Scroll to first error
                const firstError = document.querySelector('.invalid');
                if (firstError) {
                    firstError.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        });
    }
    
    // Quick contact form submission (for chat modal) - UPDATED WITH AUTO-CLOSE
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm(quickContactForm)) {
                // Show loading state
                const submitBtn = quickContactForm.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Create success message element for chat modal
                let successMessage = chatModal.querySelector('.chat-success-message');
                if (!successMessage) {
                    successMessage = document.createElement('div');
                    successMessage.className = 'chat-success-message';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
                    chatModal.querySelector('.chat-box').appendChild(successMessage);
                }
                
                // Prepare form data for FormSubmit.co
                const formData = new FormData(quickContactForm);
                formData.append('_subject', 'Quick Chat Message - Glades International');
                formData.append('_template', 'table');
                formData.append('_captcha', 'false');
                
                // Send form data using fetch to FormSubmit.co
                fetch('https://formsubmit.co/ajax/baybayinedu@gmail.com', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Show success message in chat modal
                        successMessage.style.display = 'block';
                        successMessage.classList.add('show');
                        
                        // Reset form
                        quickContactForm.reset();
                        
                        // Auto-close chat modal after 2 seconds
                        setTimeout(() => {
                            // Hide success message
                            successMessage.classList.remove('show');
                            setTimeout(() => {
                                successMessage.style.display = 'none';
                            }, 300);
                            
                            // Close modal
                            if (chatModal) {
                                chatModal.style.display = 'none';
                                document.body.style.overflow = 'auto';
                            }
                            
                            // Reset button state
                            submitBtn.innerHTML = originalText;
                            submitBtn.disabled = false;
                        }, 2000); // ⭐️ AUTO-CLOSE AFTER 2 SECONDS ⭐️
                        
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error submitting your message. Please try again or email us directly.');
                    
                    // Reset button state
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
            }
        });
    }
    
    // Location tabs functionality
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                this.classList.add('active');
                const activePane = document.getElementById(tabId);
                if (activePane) {
                    activePane.classList.add('active');
                    
                    // Update location data for the selected tab
                    updateLocationTab(tabId);
                }
            });
        });
    }
    
    // Update location tab functionality
    function updateLocationTab(tabId) {
        const location = locations[tabId];
        if (!location) return;
        
        const tabElement = document.getElementById(tabId);
        if (!tabElement) return;
        
        // Update address
        const addressElement = tabElement.querySelector('.address-card p');
        if (addressElement) {
            addressElement.innerHTML = `<strong>${location.name}</strong><br>${location.address}`;
        }
        
        // Update contact details
        const contactItems = tabElement.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            const icon = item.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-phone')) {
                    const phoneContainer = item.querySelector('p');
                    if (phoneContainer) {
                        phoneContainer.innerHTML = location.phone.map(phone => `${phone}<br>`).join('');
                    }
                } else if (icon.classList.contains('fa-envelope')) {
                    const emailContainer = item.querySelector('p');
                    if (emailContainer) {
                        emailContainer.innerHTML = location.email.map(email => `${email}<br>`).join('');
                    }
                }
            }
        });
        
        // Update map
        const mapIframe = tabElement.querySelector('.map-container iframe');
        if (mapIframe) {
            mapIframe.src = location.mapSrc;
        }
    }
    
    // Enhanced success modal functionality
    function showSuccessModal() {
        if (successModal) {
            successModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Add animation class for entrance
            successModal.classList.add('modal-show');
            
            // Start countdown for auto-close
            startAutoCloseCountdown();
            
            // Reset timer circle if exists
            setTimeout(() => {
                const circle = document.getElementById('timer-circle');
                if (circle) {
                    circle.style.strokeDashoffset = '226.19';
                }
            }, 100);
        }
    }
    
    function startAutoCloseCountdown() {
        // Display countdown timer in modal
        const countdownEl = document.getElementById('modalCountdown');
        if (countdownEl) {
            let seconds = 5;
            countdownEl.textContent = seconds;
            
            const countdownInterval = setInterval(() => {
                seconds--;
                countdownEl.textContent = seconds;
                
                if (seconds <= 0) {
                    clearInterval(countdownInterval);
                    closeSuccessModal();
                    // Scroll back to contact form
                    const contactSection = document.querySelector('.contact-form-section');
                    if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }, 1000);
        } else {
            // Fallback: auto-close after 5 seconds
            setTimeout(() => {
                if (successModal && successModal.style.display === 'flex') {
                    closeSuccessModal();
                }
            }, 5000);
        }
    }
    
    function closeSuccessModal() {
        if (successModal) {
            successModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            successModal.classList.remove('modal-show');
            
            // Reset form if it exists
            if (contactForm) {
                contactForm.reset();
            }
        }
    }
    
    // Modal button handlers
    if (backToContactBtn) {
        backToContactBtn.addEventListener('click', function() {
            closeSuccessModal();
            document.querySelector('.contact-form-section')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            closeSuccessModal();
        });
    }
    
    // Close success modal when clicking outside
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                closeSuccessModal();
            }
        });
    }
    
    // Chat modal functionality
    if (openChatBtn) {
        openChatBtn.addEventListener('click', function() {
            if (chatModal) {
                chatModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Reset any previous success messages
                const successMsg = chatModal.querySelector('.chat-success-message');
                if (successMsg) {
                    successMsg.style.display = 'none';
                    successMsg.classList.remove('show');
                }
                
                // Focus on first input
                setTimeout(() => {
                    const firstInput = chatModal.querySelector('input');
                    if (firstInput) firstInput.focus();
                }, 300);
            }
        });
    }
    
    if (openChatBtnMain) {
        openChatBtnMain.addEventListener('click', function(e) {
            e.preventDefault();
            if (chatModal) {
                chatModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Reset any previous success messages
                const successMsg = chatModal.querySelector('.chat-success-message');
                if (successMsg) {
                    successMsg.style.display = 'none';
                    successMsg.classList.remove('show');
                }
                
                // Focus on first input
                setTimeout(() => {
                    const firstInput = chatModal.querySelector('input');
                    if (firstInput) firstInput.focus();
                }, 300);
            }
        });
    }
    
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', function() {
            if (chatModal) {
                chatModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Close chat modal when clicking outside
    if (chatModal) {
        chatModal.addEventListener('click', function(e) {
            if (e.target === chatModal) {
                chatModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (successModal && successModal.style.display === 'flex') {
                closeSuccessModal();
            }
            if (chatModal && chatModal.style.display === 'flex') {
                chatModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });
    
    // Enhanced form validation
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
                showValidationError(field, 'Please enter a valid phone number (e.g., +63 912 345 6789)');
            }
            // Text area validation (minimum length)
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
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Phone validation function (updated for Philippines)
    function isValidPhone(phone) {
        // Allow formats: +63 912 345 6789, 0912 345 6789, 9123456789
        const phoneRegex = /^(?:\+63|0)?[9]\d{2}[\s\-]?\d{3}[\s\-]?\d{4}$/;
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleaned);
    }
    
    // Show validation error message
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
    
    // Real-time email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.classList.add('invalid');
                showValidationError(this, 'Please enter a valid email address');
            } else if (this.value) {
                this.classList.remove('invalid');
                this.classList.add('valid');
                const validationMsg = this.parentNode.querySelector('.validation-message');
                if (validationMsg) {
                    validationMsg.classList.remove('show');
                }
            }
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('invalid', 'valid');
            const validationMsg = this.parentNode.querySelector('.validation-message');
            if (validationMsg) {
                validationMsg.classList.remove('show');
            }
        });
    });
    
    // Real-time phone validation
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isValidPhone(this.value)) {
                this.classList.add('invalid');
                showValidationError(this, 'Please enter a valid phone number');
            } else if (this.value) {
                this.classList.remove('invalid');
                this.classList.add('valid');
                const validationMsg = this.parentNode.querySelector('.validation-message');
                if (validationMsg) {
                    validationMsg.classList.remove('show');
                }
            }
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('invalid', 'valid');
            const validationMsg = this.parentNode.querySelector('.validation-message');
            if (validationMsg) {
                validationMsg.classList.remove('show');
            }
        });
    });
    
    // Real-time textarea validation
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('blur', function() {
            if (this.value && this.value.trim().length < 10) {
                this.classList.add('invalid');
                showValidationError(this, 'Please provide more details (at least 10 characters)');
            } else if (this.value) {
                this.classList.remove('invalid');
                this.classList.add('valid');
                const validationMsg = this.parentNode.querySelector('.validation-message');
                if (validationMsg) {
                    validationMsg.classList.remove('show');
                }
            }
        });
    });
    
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
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
    
    // Initialize first tab on page load
    if (tabButtons.length > 0) {
        const firstTab = tabButtons[0];
        const firstTabId = firstTab.getAttribute('data-tab');
        firstTab.classList.add('active');
        
        const firstPane = document.getElementById(firstTabId);
        if (firstPane) {
            firstPane.classList.add('active');
            updateLocationTab(firstTabId);
        }
    }
    
    // Add CSS for modal animation if not already present
    addModalAnimationStyles();
});

// Add additional CSS for modal animations
function addModalAnimationStyles() {
    if (!document.getElementById('modal-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-animation-styles';
        style.textContent = `
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(50px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes modalFadeOut {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(50px) scale(0.95);
                }
            }
            
            .modal-show .modal-content {
                animation: modalFadeIn 0.3s ease-out;
            }
            
            #modalCountdown {
                display: inline-block;
                font-weight: bold;
                color: var(--accent);
                margin-left: 5px;
            }
            
            /* Timer circle styles */
            .modal-timer {
                margin: 2rem 0;
                display: flex;
                justify-content: center;
            }
            
            .timer-circle {
                position: relative;
                width: 80px;
                height: 80px;
            }
            
            .timer-circle svg {
                transform: rotate(-90deg);
            }
            
            #timer-circle {
                animation: countdown 5s linear forwards;
            }
            
            #countdown {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--primary);
            }
            
            @keyframes countdown {
                to {
                    stroke-dashoffset: 0;
                }
            }
            
            /* Chat modal success message */
            .chat-success-message {
                display: none;
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--success, #27ae60);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 500;
                box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
                z-index: 10;
                animation: slideUpIn 0.3s ease;
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
}