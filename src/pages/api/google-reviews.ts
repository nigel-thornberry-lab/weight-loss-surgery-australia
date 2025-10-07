import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const placeId = url.searchParams.get('placeId');
  
  if (!placeId) {
    return new Response(JSON.stringify({ error: 'Missing placeId parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Get API key from environment variable
  const API_KEY = import.meta.env.GOOGLE_PLACES_API_KEY;
  
  if (!API_KEY) {
    console.error('GOOGLE_PLACES_API_KEY not configured');
    return new Response(JSON.stringify({ 
      error: 'API key not configured',
      message: 'Please add GOOGLE_PLACES_API_KEY to your environment variables'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Fetch place details including reviews from Google Places API
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total,name&key=${API_KEY}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      return new Response(JSON.stringify({
        success: true,
        reviews: data.result.reviews || [],
        rating: data.result.rating || 0,
        total_ratings: data.result.user_ratings_total || 0,
        name: data.result.name || ''
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600' // Cache for 1 hour
        }
      });
    } else if (data.status === 'ZERO_RESULTS') {
      return new Response(JSON.stringify({
        success: false,
        error: 'No results found for this Place ID',
        reviews: [],
        rating: 0,
        total_ratings: 0
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (data.status === 'INVALID_REQUEST') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid Place ID format',
        reviews: [],
        rating: 0,
        total_ratings: 0
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (data.status === 'OVER_QUERY_LIMIT') {
      return new Response(JSON.stringify({
        success: false,
        error: 'API quota exceeded',
        message: 'Please check your Google Cloud billing settings'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (data.status === 'REQUEST_DENIED') {
      return new Response(JSON.stringify({
        success: false,
        error: 'API request denied',
        message: 'Please check your API key restrictions and ensure Places API is enabled'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error(`Google Places API error: ${data.status}`);
    }
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to fetch reviews',
      message: error instanceof Error ? error.message : 'Unknown error',
      reviews: [],
      rating: 0,
      total_ratings: 0
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
