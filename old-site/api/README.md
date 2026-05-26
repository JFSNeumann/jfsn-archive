# API Documentation

## Contact Form Handler

### PHP Handler (`contact.php`)

**Endpoint:** `/api/contact.php`  
**Method:** POST  
**Content-Type:** application/json

#### Request Format

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Your message here",
  "csrf_token": "generated-token",
  "website": "" // Honeypot field (should be empty)
}
```

#### Response Format

**Success (200):**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully."
}
```

**Error (400/403/429/500):**
```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Valid email address is required"
    }
  ]
}
```

#### Security Features

- ✅ CSRF token validation
- ✅ Rate limiting (5 submissions per hour per IP)
- ✅ Input sanitization
- ✅ Email validation
- ✅ Honeypot spam protection
- ✅ XSS prevention

#### Configuration

Update the email address in `contact.php`:
```php
$to = 'your-email@example.com'; // Line 120
```

---

## Alternative Implementations

### Option 1: Node.js Handler

If you prefer Node.js, create `api/contact.js`:

```javascript
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5
});

app.use('/contact', limiter);
app.use(express.json());

app.post('/contact', (req, res) => {
  // Validation and email sending logic
});
```

### Option 2: Third-Party Services

**Formspree:**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Netlify Forms:**
```html
<form netlify>
  <!-- Form fields -->
</form>
```

**EmailJS:**
```javascript
emailjs.send('service_id', 'template_id', formData);
```

---

## Testing

Test the endpoint:
```bash
curl -X POST http://localhost:8082/api/contact.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message","csrf_token":"test-token"}'
```
