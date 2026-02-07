/* ============================================
   MODERN RESPONSIVE BOOKING SYSTEM
   High Performance & User-Friendly
   ============================================ */

// DOM Elements
const serviceCards = document.querySelectorAll('.service-card');
const bookingForm = document.getElementById('bookingForm');
const selectedServiceInput = document.getElementById('selectedService');
const selectedServiceName = document.getElementById('selectedServiceName');
const selectedServicePrice = document.getElementById('selectedServicePrice');
const successModal = document.getElementById('successModal');

// Form Elements
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const notesInput = document.getElementById('notes');

// Summary Elements
const summaryService = document.getElementById('summaryService');
const summaryDate = document.getElementById('summaryDate');
const summaryTime = document.getElementById('summaryTime');
const summaryPrice = document.getElementById('summaryPrice');

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// ============================================
// SERVICE SELECTION
// ============================================

serviceCards.forEach(card => {
  card.addEventListener('click', selectService);
});

function selectService(e) {
  // Remove previous selection
  serviceCards.forEach(card => {
    card.style.borderColor = 'transparent';
  });

  // Get the service card (handle click on button)
  const card = e.target.closest('.service-card');
  if (!card) return;

  const serviceName = card.dataset.service;
  const servicePrice = parseInt(card.dataset.price);

  // Update form
  selectedServiceInput.value = serviceName;
  selectedServiceName.textContent = serviceName;
  selectedServicePrice.textContent = `$${servicePrice}`;

  // Update summary
  summaryService.textContent = serviceName;
  summaryPrice.textContent = `$${servicePrice}`;

  // Visual feedback
  card.style.borderColor = 'var(--primary-color)';
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Pulse animation
  card.style.animation = 'none';
  setTimeout(() => {
    card.style.animation = 'pulse 0.6s ease';
  }, 10);
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
`;
document.head.appendChild(style);

// ============================================
// FORM VALIDATION
// ============================================

const validationRules = {
  fullName: {
    validate: (value) => value.trim().length >= 2,
    message: 'Name must be at least 2 characters'
  },
  email: {
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  phone: {
    validate: (value) => /^[\d\-\s\+\(\)]{10,}$/.test(value),
    message: 'Please enter a valid phone number'
  },
  date: {
    validate: (value) => value !== '',
    message: 'Please select a date'
  },
  time: {
    validate: (value) => value !== '',
    message: 'Please select a time'
  }
};

function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}Error`);
  const rule = validationRules[fieldId];

  if (!rule) return true;

  const isValid = rule.validate(field.value);

  if (!isValid) {
    field.style.borderColor = 'var(--danger-color)';
    errorElement.textContent = rule.message;
    errorElement.classList.add('show');
  } else {
    field.style.borderColor = '';
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }

  return isValid;
}

// Real-time validation on blur
['fullName', 'email', 'phone', 'date', 'time'].forEach(fieldId => {
  document.getElementById(fieldId).addEventListener('blur', () => {
    validateField(fieldId);
  });
});

// ============================================
// LIVE SUMMARY UPDATES
// ============================================

dateInput.addEventListener('change', () => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = new Date(dateInput.value).toLocaleDateString('en-US', options);
  summaryDate.textContent = formattedDate || '-';
  validateField('date');
});

timeInput.addEventListener('change', () => {
  const [hours, minutes] = timeInput.value.split(':');
  const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
  const displayHours = parseInt(hours) % 12 || 12;
  summaryTime.textContent = `${displayHours}:${minutes} ${ampm}`;
  validateField('time');
});

// Initialize summary with current values
dateInput.dispatchEvent(new Event('change'));
timeInput.dispatchEvent(new Event('change'));

// ============================================
// FORM SUBMISSION
// ============================================

bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate all fields
  const fieldsToValidate = ['fullName', 'email', 'phone', 'date', 'time'];
  let isValid = fieldsToValidate.every(fieldId => validateField(fieldId));

  if (!selectedServiceInput.value) {
    alert('Please select a service first');
    const servicesSection = document.getElementById('services');
    servicesSection.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (!isValid) {
    alert('Please fill in all required fields correctly');
    return;
  }

  // Prepare form data
  const formData = {
    name: fullNameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    service: selectedServiceInput.value,
    date: dateInput.value,
    time: timeInput.value,
    notes: notesInput.value
  };

  try {
    // Show loading state
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;

    // Simulate API call (replace with actual API endpoint)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the booking (in production, send to server)
    console.log('Booking Data:', formData);

    // Show success modal
    showSuccessModal(formData);

    // Reset form
    bookingForm.reset();
    selectedServiceInput.value = '';
    selectedServiceName.textContent = 'No service selected';
    selectedServicePrice.textContent = '$0';
    summaryService.textContent = 'Not selected';
    summaryPrice.textContent = '$0';

    // Restore button
    submitButton.textContent = originalText;
    submitButton.disabled = false;

  } catch (error) {
    console.error('Booking error:', error);
    alert('An error occurred. Please try again.');
  }
});

// ============================================
// MODAL HANDLING
// ============================================

function showSuccessModal(data) {
  const confirmationMessage = document.getElementById('confirmationMessage');
  confirmationMessage.textContent = `Your appointment for ${data.service} on ${new Date(data.date).toLocaleDateString()} at ${data.time} has been confirmed!`;

  successModal.classList.add('show');

  // Prevent background scroll
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  successModal.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Close modal on outside click
successModal.addEventListener('click', (e) => {
  if (e.target === successModal) {
    closeModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && successModal.classList.contains('show')) {
    closeModal();
  }
});

// ============================================
// ACCESSIBILITY FEATURES
// ============================================

// Add ARIA labels for screen readers
document.querySelectorAll('.service-card').forEach(card => {
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectService({ target: card });
    }
  });
});

// Focus management
bookingForm.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    // Ensure focus stays within form
    const focusableElements = bookingForm.querySelectorAll('input, textarea, button');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
});

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Lazy load images if any
if ('IntersectionObserver' in window) {
  const imageCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      }
    });
  };

  const imageObserver = new IntersectionObserver(imageCallback, {
    rootMargin: '50px'
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Throttle scroll events for better performance
let ticking = false;

function updateOnScroll() {
  if (ticking) return;
  
  ticking = true;
  requestAnimationFrame(() => {
    // Any scroll-based updates here
    ticking = false;
  });
}

window.addEventListener('scroll', updateOnScroll, { passive: true });

// ============================================
// INITIALIZATION
// ============================================

console.log('Booking System Initialized Successfully');

// Add smooth animations on page load
window.addEventListener('load', () => {
  document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
});
