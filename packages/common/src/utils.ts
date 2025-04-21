/**
 * Format a phone number to a consistent format
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Strip all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Format based on length (US phone numbers)
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 11)}`;
  } else {
    // Handle international or other formats
    return phoneNumber;
  }
}

/**
 * Format duration in seconds to a human-readable string
 */
export function formatDuration(durationInSeconds: number): string {
  if (durationInSeconds < 60) {
    return `${durationInSeconds} sec`;
  }

  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;

  if (minutes < 60) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Check if a call might be spam based on criteria
 */
export function isLikelySpam(
  callerNumber: string,
  spamScore?: number,
  knownSpamPatterns: RegExp[] = [/^\+1800/, /^\+1888/, /^\+1877/]
): boolean {
  // If we have a spam score, use it as the primary indicator
  if (spamScore !== undefined) {
    return spamScore > 0.7; // 70% threshold
  }

  // Check against known spam patterns
  return knownSpamPatterns.some(pattern => pattern.test(callerNumber));
}

/**
 * Create a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
} 