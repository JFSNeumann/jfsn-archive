/* form-validation.js — Real-time form field validation with feedback */

const FormValidation = {
  forms: [],
  validationRules: {},

  init() {
    this.attachToForms();
    this.setupValidationRules();
  },

  setupValidationRules() {
    this.validationRules = {
      'email': (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      'url': (value) => /^https?:\/\/.+/.test(value),
      'phone': (value) => /^\d{10,}$/.test(value.replace(/\D/g, '')),
      'number': (value) => !isNaN(value) && value !== '',
      'required': (value) => value.trim().length > 0,
      'minlength': (value, min) => value.length >= parseInt(min),
      'maxlength': (value, max) => value.length <= parseInt(max),
      'match': (value, targetSelector) => {
        const target = document.querySelector(targetSelector);
        return target ? value === target.value : true;
      }
    };
  },

  attachToForms() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      this.forms.push(form);

      // Real-time validation on input
      form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('invalid')) {
            this.validateField(field);
          }
        });
      });

      // Form submission
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });
    });
  },

  validateField(field) {
    const rules = field.getAttribute('data-rules');
    if (!rules) {
      this.clearFieldErrors(field);
      return true;
    }

    const ruleList = rules.split('|');
    let isValid = true;
    let errorMessage = '';

    for (const rule of ruleList) {
      const [ruleName, ...params] = rule.split(':');
      const ruleFn = this.validationRules[ruleName];

      if (ruleFn) {
        const valid = ruleFn(field.value, ...params);
        if (!valid) {
          isValid = false;
          errorMessage = this.getErrorMessage(field, ruleName);
          break;
        }
      }
    }

    if (isValid) {
      this.clearFieldErrors(field);
    } else {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  },

  validateForm(form) {
    let isValid = true;
    form.querySelectorAll('input, textarea, select').forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  },

  showFieldError(field, message) {
    field.classList.add('invalid');
    field.classList.remove('valid');

    // Remove existing error message
    this.clearFieldErrors(field);

    // Add error message
    const errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    errorEl.setAttribute('role', 'alert');

    field.parentNode.insertBefore(errorEl, field.nextSibling);
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', `error-${field.name || field.id}`);
    errorEl.id = `error-${field.name || field.id}`;
  },

  clearFieldErrors(field) {
    field.classList.remove('invalid');
    field.classList.add('valid');

    const errorEl = field.parentNode.querySelector('.form-error');
    if (errorEl) {
      errorEl.remove();
    }

    field.setAttribute('aria-invalid', 'false');
  },

  getErrorMessage(field, rule) {
    const messages = {
      'required': `${field.placeholder || 'This field'} is required`,
      'email': 'Please enter a valid email address',
      'url': 'Please enter a valid URL',
      'phone': 'Please enter a valid phone number',
      'number': 'Please enter a valid number',
      'minlength': `Minimum length is ${field.getAttribute('data-minlength')} characters`,
      'maxlength': `Maximum length is ${field.getAttribute('data-maxlength')} characters`,
      'match': 'Values do not match'
    };
    return messages[rule] || 'Invalid input';
  },

  // Utility: validate a single field
  validateFieldId(fieldId) {
    const field = document.getElementById(fieldId);
    return field ? this.validateField(field) : false;
  },

  // Utility: reset form validation state
  resetForm(form) {
    form.querySelectorAll('input, textarea, select').forEach(field => {
      this.clearFieldErrors(field);
    });
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => FormValidation.init());
} else {
  FormValidation.init();
}
