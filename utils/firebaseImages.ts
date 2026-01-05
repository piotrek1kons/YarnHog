import { storage } from '../FirebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';

const FIREBASE_STORAGE_BASE = 'gs://yarnhog-5feac.firebasestorage.app';

// Cache dla URL-i, aby nie pobierać ich wielokrotnie
const imageUrlCache: { [key: string]: string } = {};

/**
 * Pobiera URL obrazu z Firebase Storage
 * @param imagePath - ścieżka do obrazu w Firebase Storage (np. 'img/logo.png')
 * @returns Promise z URL-em do obrazu
 */
export const getFirebaseImageUrl = async (imagePath: string): Promise<string> => {
  if (imageUrlCache[imagePath]) {
    return imageUrlCache[imagePath];
  }

  try {
    const imageRef = ref(storage, imagePath);
    const url = await getDownloadURL(imageRef);
    imageUrlCache[imagePath] = url;
    return url;
  } catch (error) {
    console.error(`Error loading image ${imagePath}:`, error);
    throw error;
  }
};

// Eksportujemy nazwy obrazów jako stałe
export const FIREBASE_IMAGES = {
  LOGO: 'img/logo.png',
  NAV_ARROW: 'img/nav-arrow.png',
  TUTORIALS: 'img/tutorials.png',
  PROJECTS: 'img/projects.png',
  PROFILE: 'img/profile.png',
  COMMUNITY: 'img/community.png',
  MATERIALS: 'img/materials.png',
  HOME: 'img/home.png',
  ROW_COUNTER: 'img/row-counter.png',
  OTHER: 'img/other.png',
} as const;
