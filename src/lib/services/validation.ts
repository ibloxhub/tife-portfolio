// ============================================================
// Input Validation & Sanitization Helpers
// ============================================================

/**
 * Validates an email address format (RFC-compliant basic check).
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Checks that all required fields are present and non-empty.
 * Returns an array of missing field names.
 */
export function validateRequired(fields: Record<string, unknown>): string[] {
  const missing: string[] = []
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      missing.push(key)
    }
  }
  return missing
}

/**
 * Validates that a slug is URL-safe: lowercase, alphanumeric, hyphens only.
 */
export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

/**
 * Generates a URL-safe slug from a title string.
 * "My Test Project!" → "my-test-project"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // Remove special characters
    .replace(/[\s_]+/g, '-')    // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-')        // Collapse multiple hyphens
    .replace(/^-+|-+$/g, '')    // Trim leading/trailing hyphens
}

/**
 * Strips dangerous HTML tags from user input while preserving plain text.
 * Prevents XSS in user-submitted content (messages, descriptions).
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')   // Remove inline event handlers
    .replace(/on\w+='[^']*'/gi, '')
    .trim()
}

/**
 * Validates a phone number format (basic international check).
 * Allows digits, spaces, dashes, parentheses, and leading +.
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-()]{7,20}$/
  return phoneRegex.test(phone)
}

/**
 * Validates string length is within bounds.
 */
export function validateLength(value: string, min: number, max: number): boolean {
  const len = value.trim().length
  return len >= min && len <= max
}
