import { TwitterAccountData } from '../types';

const XCANCEL_BASE_URL = 'https://xcancel.com';
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

export async function fetchUserTweets(username: string) {
  try {
    const response = await fetch(`${XCANCEL_BASE_URL}/${username}`);
    if (!response.ok) throw new Error('Failed to fetch tweets');
    return await response.text(); // Returns RSS/HTML content
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
}

export async function fetchUserReplies(username: string) {
  try {
    const response = await fetch(`${XCANCEL_BASE_URL}/${username}/with_replies`);
    if (!response.ok) throw new Error('Failed to fetch replies');
    return await response.text();
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw error;
  }
}

export async function fetchCryptoPrice(symbol: string) {
  try {
    const response = await fetch(`${CMC_BASE_URL}/cryptocurrency/quotes/latest?symbol=${symbol}`, {
      headers: {
        'X-CMC_PRO_API_KEY': import.meta.env.VITE_CMC_API_KEY,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch crypto price');
    return await response.json();
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    throw error;
  }
}

// Helper function to parse tweets from xcancel HTML response
function parseTweetsFromHTML(html: string) {
  // We'll need to implement HTML parsing here
  // This is a placeholder for the parsing logic
  return {
    tweets: [],
    followerCount: 0,
    // Add other relevant data
  };
}

export async function getAccountData(username: string): Promise<TwitterAccountData | null> {
  try {
    const tweetsHTML = await fetchUserTweets(username);
    const repliesHTML = await fetchUserReplies(username);
    
    // Parse the HTML responses to extract data
    const parsedData = parseTweetsFromHTML(tweetsHTML);
    
    // This is a placeholder structure - we'll need to implement proper parsing
    return {
      profile: {
        username,
        displayName: '', // Extract from HTML
        profileImage: '', // Extract from HTML
        bio: '', // Extract from HTML
        location: '', // Extract from HTML
        followers: parsedData.followerCount,
        following: 0, // Extract from HTML
        isCrypto: false, // Determine based on content analysis
      },
      followerStats: {
        current: parsedData.followerCount,
        oneDayChange: { count: 0, percentage: 0 },
        oneWeekChange: { count: 0, percentage: 0 },
        oneMonthChange: { count: 0, percentage: 0 },
        history: [],
      },
      tweetAnalysis: {
        mostViralTweet: {
          id: '',
          text: '',
          date: '',
          likes: 0,
          retweets: 0,
          replies: 0,
          engagement: 0,
          sentiment: 'neutral',
        },
        frequentWords: [],
        sentimentBreakdown: {
          positive: 0,
          negative: 0,
          neutral: 0,
        },
        averageEngagement: 0,
        postsPerDay: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching account data:', error);
    return null;
  }
}