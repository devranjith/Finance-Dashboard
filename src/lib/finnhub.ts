const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

export async function fetchLiveMarketHeadlines(): Promise<string[]> {
  if (!FINNHUB_API_KEY) {
    throw new Error('Missing VITE_FINNHUB_API_KEY in .env.local');
  }

  try {
    const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);
    const data = await response.json();
    
    // Grab the top 10 headlines to give the AI good context
    const headlines = data.slice(0, 10).map((item: any) => item.headline);
    return headlines;
  } catch (error) {
    console.error('Error fetching Finnhub news:', error);
    throw error;
  }
}
