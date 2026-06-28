import { availableServices } from './config.js';
import { submitInscription, submitSupport } from './api.js';

// --- DOM ELEMENTS ---
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.nav-btn');
const logoHome = document.getElementById('logo-home');
const footerSupportLink = document.getElementById('footer-support-link');
const themeToggleBtn = document.getElementById('theme-toggle');

// Inscription Form Elements
const formInscription = document.getElementById('form-inscription');
const inputRegisterFirstname = document.getElementById('register-firstname');
const inputRegisterLastname = document.getElementById('register-lastname');
const inputRegisterUsername = document.getElementById('register-username');
const selectRegisterService = document.getElementById('register-service');
const btnSubmitInscription = document.getElementById('btn-submit-inscription');
const feedbackInscription = document.getElementById('feedback-inscription');

// Support Form Elements
const formSupport = document.getElementById('form-support');
const inputSupportUsername = document.getElementById('support-username');
const textareaSupportDescription = document.getElementById('support-description');
const btnSubmitSupport = document.getElementById('btn-submit-support');
const feedbackSupport = document.getElementById('feedback-support');

// Password Strength Checker Elements
const strengthInput = document.getElementById('strength-checker-input');
const strengthEyeBtn = document.getElementById('strength-eye-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthStatus = document.getElementById('strength-status');
const crackTime = document.getElementById('crack-time');

// --- 1. SINGLE PAGE ROUTING & NAVIGATION ---
function navigateToPage(targetPageId) {
  pages.forEach(page => {
    if (page.id === targetPageId) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  navButtons.forEach(btn => {
    if (btn.getAttribute('data-target') === targetPageId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Scroll to top when page changes
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Attach event listeners for nav buttons
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    navigateToPage(target);
  });
});

// Logo acts as home button
logoHome.addEventListener('click', (e) => {
  e.preventDefault();
  navigateToPage('page-home');
});

// Footer bug report link directs to support
footerSupportLink.addEventListener('click', (e) => {
  e.preventDefault();
  navigateToPage('page-support');
});

// Beta warning banner support link directs to support
const betaSupportLink = document.getElementById('beta-support-link');
if (betaSupportLink) {
  betaSupportLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToPage('page-support');
  });
}

// Guide registration link directs to registration form
const guideRegisterLink = document.getElementById('guide-register-link');
if (guideRegisterLink) {
  guideRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToPage('page-register');
  });
}


// --- 2. DARK/LIGHT THEME SWITCHER ---
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});


// --- 3. DYNAMIC SERVICES POPULATION ---
function initServicesDropdown() {
  if (!selectRegisterService) return;
  
  availableServices.forEach(service => {
    const option = document.createElement('option');
    option.value = service.id;
    option.textContent = service.name;
    selectRegisterService.appendChild(option);
  });
}


// --- 4. INTERACTIVE PASSWORD STRENGTH CALCULATOR ---
// Show/Hide password toggle
strengthEyeBtn.addEventListener('click', () => {
  const isPassword = strengthInput.type === 'password';
  strengthInput.type = isPassword ? 'text' : 'password';
  
  // Toggle icon representation
  strengthEyeBtn.innerHTML = isPassword 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
        <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
        <line x1="2" y1="2" x2="22" y2="22"/>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`;
});

// Analyze password strength & estimate crack time
strengthInput.addEventListener('input', () => {
  const password = strengthInput.value;
  
  if (!password) {
    strengthBar.style.width = '0%';
    strengthBar.style.backgroundColor = '#ef4444';
    strengthStatus.textContent = 'Entrez des caractères...';
    crackTime.textContent = '';
    return;
  }
  
  let score = 0;
  
  // Criteria checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  
  const varietyCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
  score += Math.max(0, varietyCount - 1); // Up to 3 additional points for variety
  
  // Caps core score at 5
  score = Math.min(score, 5);
  
  // Custom feedback mappings
  let statusText = '';
  let color = '';
  let width = '';
  let estimatedTime = '';
  
  switch(score) {
    case 0:
    case 1:
      statusText = 'Très faible';
      color = '#ef4444'; // Red
      width = '20%';
      estimatedTime = 'Instantané ⚡';
      break;
    case 2:
      statusText = 'Faible';
      color = '#f97316'; // Orange
      width = '40%';
      estimatedTime = 'Quelques secondes ⏳';
      break;
    case 3:
      statusText = 'Moyen';
      color = '#eab308'; // Yellow
      width = '60%';
      estimatedTime = 'Quelques heures / jours 📅';
      break;
    case 4:
      statusText = 'Fort';
      color = '#10b981'; // Green
      width = '80%';
      estimatedTime = 'Quelques décennies 🛡️';
      break;
    case 5:
      statusText = 'Très fort';
      color = '#059669'; // Dark green
      width = '100%';
      estimatedTime = '+100 millions d\'années 🌌';
      break;
  }
  
  // Special check for robust base + suffix strategy (e.g. CasseroleArbuste48!Bonapp)
  if (password.length >= 22 && hasUpper && hasLower && hasDigit && hasSpecial) {
    statusText = 'Parfait & Unique !';
    color = '#0ea5e9'; // Blue / Premium Accent
    estimatedTime = 'Inviolable (Éternité) 💎';
  }
  
  strengthBar.style.width = width;
  strengthBar.style.backgroundColor = color;
  strengthStatus.textContent = `Force : ${statusText}`;
  strengthStatus.style.color = color;
  crackTime.textContent = `Temps de crack estimé : ${estimatedTime}`;
});


// --- 5. USERNAME RESTRICTION / SANITIZATION ---
// Prevent typing invalid characters in username fields
function restrictUsernameInput(inputElement) {
  inputElement.addEventListener('input', () => {
    // Replace any character not matching alphanumeric, dot, underscore, or hyphen
    const originalValue = inputElement.value;
    const sanitizedValue = originalValue.replace(/[^a-zA-Z0-9._-]/g, '');
    
    if (originalValue !== sanitizedValue) {
      inputElement.value = sanitizedValue;
    }
  });
}

restrictUsernameInput(inputRegisterUsername);
restrictUsernameInput(inputSupportUsername);


// --- 6. FORM INSCRIPTION SUBMISSION ---
formInscription.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Reset previous feedback state
  feedbackInscription.className = 'feedback-box';
  feedbackInscription.textContent = '';
  
  const firstName = inputRegisterFirstname.value.trim();
  const lastName = inputRegisterLastNameVal(); // Helper to catch lastname (it was ID register-lastname but let's check input name)
  const username = inputRegisterUsername.value.trim();
  const service = selectRegisterService.value;
  
  // Validation
  if (!firstName || !lastName || !username || !service) {
    showFeedback(feedbackInscription, 'Veuillez remplir tous les champs du formulaire.', 'error');
    return;
  }
  
  if (username.includes('@')) {
    showFeedback(feedbackInscription, "L'identifiant ne doit pas contenir le symbole @. Le domaine @kluft.pass est ajouté automatiquement.", 'error');
    return;
  }
  
  try {
    // Set loading state
    btnSubmitInscription.disabled = true;
    btnSubmitInscription.classList.add('loading');
    
    // Call API submit function
    await submitInscription({ firstName, lastName, username, service });
    
    // Success feedback
    showFeedback(
      feedbackInscription, 
      `Inscription réussie ! Votre demande pour accéder à "${getServiceNameById(service)}" sous l'identifiant ${username}@kluft.pass a bien été enregistrée et est en cours de validation par un administrateur.`, 
      'success'
    );
    formInscription.reset();
    
  } catch (error) {
    console.error(error);
    showFeedback(feedbackInscription, `Une erreur est survenue lors de l'inscription : ${error.message}. Veuillez réessayer.`, 'error');
  } finally {
    // Clear loading state
    btnSubmitInscription.disabled = false;
    btnSubmitInscription.classList.remove('loading');
  }
});

// Helper for lastName input because of name vs id selector
function inputRegisterLastNameVal() {
  return inputRegisterLastname ? inputRegisterLastname.value.trim() : '';
}

// Get service name from ID for output message
function getServiceNameById(serviceId) {
  const service = availableServices.find(s => s.id === serviceId);
  return service ? service.name : serviceId;
}


// --- 7. FORM SUPPORT SUBMISSION ---
formSupport.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Reset previous feedback state
  feedbackSupport.className = 'feedback-box';
  feedbackSupport.textContent = '';
  
  const username = inputSupportUsername.value.trim();
  const issueDescription = textareaSupportDescription.value.trim();
  
  // Validation
  if (!username || !issueDescription) {
    showFeedback(feedbackSupport, 'Veuillez renseigner votre identifiant et décrire votre problème.', 'error');
    return;
  }
  
  if (username.includes('@')) {
    showFeedback(feedbackSupport, "L'identifiant ne doit pas contenir le symbole @. Saisissez uniquement la partie locale de votre adresse.", 'error');
    return;
  }
  
  try {
    // Set loading state
    btnSubmitSupport.disabled = true;
    btnSubmitSupport.classList.add('loading');
    
    // Call API submit function
    await submitSupport({ username, issueDescription });
    
    // Success feedback
    showFeedback(
      feedbackSupport, 
      `Votre ticket de support sous l'identifiant ${username}@kluft.pass a été soumis avec succès. Nous vous contacterons pour résoudre le problème. Merci !`, 
      'success'
    );
    formSupport.reset();
    
  } catch (error) {
    console.error(error);
    showFeedback(feedbackSupport, `Une erreur est survenue lors de l'envoi du message : ${error.message}. Veuillez réessayer.`, 'error');
  } finally {
    // Clear loading state
    btnSubmitSupport.disabled = false;
    btnSubmitSupport.classList.remove('loading');
  }
});


// --- Helper to display feedback messages ---
function showFeedback(element, message, type) {
  element.textContent = message;
  element.className = `feedback-box show ${type}`;
}


// --- 8. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initServicesDropdown();
});
// Execute immediately as well if DOMContentLoaded already fired (for Vite environment)
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initTheme();
  initServicesDropdown();
}
