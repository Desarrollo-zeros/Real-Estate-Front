/**
 * Builds the full image URL for backend-hosted images
 * @param imageUrl - Relative URL from backend (e.g., "/uploads/owners/123.jpg") or full URL
 * @returns Full URL to the image
 */
export function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return '/placeholder-image.jpg'; // Fallback image
  }

  // If it's already a full URL (http/https) or blob URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('blob:')) {
    return imageUrl;
  }

  // Get base URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
  
  // Remove /api/v1 from base URL if present (since we want root URL for static files)
  const rootUrl = baseUrl.replace('/api/v1', '');

  // Ensure imageUrl starts with /
  const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

  return `${rootUrl}${normalizedPath}`;
}

/**
 * Gets owner photo URL
 */
export function getOwnerPhotoUrl(photoUrl: string | null | undefined): string {
  return getImageUrl(photoUrl);
}

/**
 * Gets property image URL
 */
export function getPropertyImageUrl(fileUrl: string | null | undefined): string {
  return getImageUrl(fileUrl);
}
