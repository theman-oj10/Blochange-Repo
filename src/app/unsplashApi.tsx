import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!
});

export const getRandomImage = async (query: string) => {
  try {
    const result = await unsplash.photos.getRandom({
      query,
      count: 1
    });
    
    if (result.type === 'success' && result.response) {
      const photo = Array.isArray(result.response) ? result.response[0] : result.response;
      return photo.urls.regular;
    }
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
  }
  
  // Return a default image URL if the API call fails
  return '/images/default-charity-image.jpg';
};