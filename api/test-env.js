// Test endpoint to verify environment variable is set
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  return res.status(200).json({
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET',
    allEnvVars: Object.keys(process.env).filter(k => k.includes('GOOGLE') || k.includes('PLACES'))
  });
}
