<?php
/**
 * Contact Form Handler - Server-Side Validation & Processing
 * Secure form submission handler with validation, sanitization, and rate limiting
 * 
 * Security Features:
 * - CSRF token validation
 * - Rate limiting (IP-based)
 * - Input sanitization
 * - Email validation
 * - Honeypot spam protection
 * - XSS prevention
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Rate limiting configuration
$RATE_LIMIT_FILE = __DIR__ . '/rate_limit.json';
$RATE_LIMIT_WINDOW = 3600; // 1 hour
$RATE_LIMIT_MAX = 5; // Max 5 submissions per hour

// Get client IP
function getClientIP() {
    $ipKeys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR'];
    foreach ($ipKeys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

// Check rate limit
function checkRateLimit($ip, $limitFile, $window, $max) {
    $data = [];
    if (file_exists($limitFile)) {
        $data = json_decode(file_get_contents($limitFile), true) ?: [];
    }
    
    $now = time();
    $ipData = $data[$ip] ?? ['count' => 0, 'reset' => $now + $window];
    
    // Reset if window expired
    if ($now > $ipData['reset']) {
        $ipData = ['count' => 0, 'reset' => $now + $window];
    }
    
    // Check if limit exceeded
    if ($ipData['count'] >= $max) {
        return false;
    }
    
    // Increment count
    $ipData['count']++;
    $data[$ip] = $ipData;
    
    // Clean old entries
    foreach ($data as $key => $value) {
        if ($now > $value['reset']) {
            unset($data[$key]);
        }
    }
    
    file_put_contents($limitFile, json_encode($data));
    return true;
}

// Sanitize input
function sanitizeInput($input) {
    if (empty($input)) return '';
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return substr($input, 0, 2000); // Limit length
}

// Validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false && strlen($email) <= 255;
}

// Validate CSRF token (simplified - should use session-based tokens in production)
function validateCSRF($token) {
    // In production, validate against session-stored token
    // For now, check token format
    return !empty($token) && strlen($token) >= 32;
}

// Main processing
try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        // Fallback to form data
        $input = $_POST;
    }
    
    // Check rate limit
    $clientIP = getClientIP();
    if (!checkRateLimit($clientIP, $RATE_LIMIT_FILE, $RATE_LIMIT_WINDOW, $RATE_LIMIT_MAX)) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'error' => 'Too many requests. Please wait before submitting again.',
            'retryAfter' => $RATE_LIMIT_WINDOW
        ]);
        exit;
    }
    
    // Check honeypot (spam protection)
    if (!empty($input['website'])) {
        // Honeypot filled - likely spam
        http_response_code(200);
        echo json_encode(['success' => true]); // Fake success to confuse bots
        exit;
    }
    
    // Validate CSRF token
    if (empty($input['csrf_token']) || !validateCSRF($input['csrf_token'])) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Invalid security token']);
        exit;
    }
    
    // Get and validate required fields
    $name = sanitizeInput($input['name'] ?? '');
    $email = sanitizeInput($input['email'] ?? '');
    $subject = sanitizeInput($input['subject'] ?? '');
    $message = sanitizeInput($input['message'] ?? '');
    
    // Validate required fields
    $errors = [];
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = ['field' => 'name', 'message' => 'Name must be at least 2 characters'];
    }
    
    if (empty($email) || !validateEmail($email)) {
        $errors[] = ['field' => 'email', 'message' => 'Valid email address is required'];
    }
    
    if (empty($subject) || strlen($subject) < 3) {
        $errors[] = ['field' => 'subject', 'message' => 'Subject must be at least 3 characters'];
    }
    
    if (empty($message) || strlen($message) < 10) {
        $errors[] = ['field' => 'message', 'message' => 'Message must be at least 10 characters'];
    }
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }
    
    // Prepare email
    $to = 'Jeff@JFSN.com'; // Update with your email
    $emailSubject = 'Contact Form: ' . $subject;
    $emailBody = "New contact form submission:\n\n";
    $emailBody .= "Name: $name\n";
    $emailBody .= "Email: $email\n";
    $emailBody .= "Subject: $subject\n\n";
    $emailBody .= "Message:\n$message\n\n";
    $emailBody .= "---\n";
    $emailBody .= "IP: $clientIP\n";
    $emailBody .= "Time: " . date('Y-m-d H:i:s') . "\n";
    
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Send email
    $mailSent = @mail($to, $emailSubject, $emailBody, $headers);
    
    if ($mailSent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to send email. Please try again later.'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'An error occurred. Please try again later.'
    ]);
    // Log error (don't expose to user)
    error_log('Contact form error: ' . $e->getMessage());
}
