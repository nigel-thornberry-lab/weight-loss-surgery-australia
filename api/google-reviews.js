// Vercel Serverless Function for Google Reviews
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { placeId } = req.query;
  
  if (!placeId) {
    return res.status(400).json({ 
      error: 'Missing placeId parameter',
      message: 'Please provide a placeId query parameter'
    });
  }
  
  // Get API key from environment variable
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!API_KEY) {
    console.error('GOOGLE_PLACES_API_KEY not configured');
    return res.status(500).json({ 
      error: 'API key not configured',
      message: 'Please add GOOGLE_PLACES_API_KEY to your environment variables'
    });
  }
  
  try {
    // Fetch place details including reviews from Google Places API
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total,name&key=${API_KEY}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      return res.status(200).json({
        success: true,
        reviews: data.result.reviews || [],
        rating: data.result.rating || 0,
        total_ratings: data.result.user_ratings_total || 0,
        name: data.result.name || ''
      });
    } else if (data.status === 'ZERO_RESULTS') {
      return res.status(200).json({
        success: false,
        error: 'No results found for this Place ID',
        reviews: [],
        rating: 0,
        total_ratings: 0
      });
    } else if (data.status === 'INVALID_REQUEST') {
      return res.status(400).json({
        success: false,
        error: 'Invalid Place ID format',
        message: 'Please check that the Place ID is correct',
        reviews: [],
        rating: 0,
        total_ratings: 0
      });
    } else if (data.status === 'OVER_QUERY_LIMIT') {
      return res.status(429).json({
        success: false,
        error: 'API quota exceeded',
        message: 'Please check your Google Cloud billing settings'
      });
    } else if (data.status === 'REQUEST_DENIED') {
      return res.status(403).json({
        success: false,
        error: 'API request denied',
        message: 'Please check your API key restrictions and ensure Places API is enabled',
        details: data.error_message || 'No additional details'
      });
    } else {
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch reviews',
      message: error.message || 'Unknown error',
      reviews: [],
      rating: 0,
      total_ratings: 0
    });
  }
}
