import { 
  TwitterData, 
  LinkedInData, 
  MediumData, 
  SocialProfile, 
  FollowerStats, 
  ContentAnalysis,
  Company, 
  CryptoData,
  CompetitorData
} from '../types';

// --- Placeholder API Functions ---
// These functions simulate fetching data for each platform.
// Replace these with actual API calls using RapidAPI or other services.

// MOCK DELAY - Simulate network latency
const MOCK_API_DELAY = 800; // milliseconds

// --- Twitter/X Data Fetching ---
export async function fetchTwitterData(username: string, companyName: string): Promise<TwitterData | null> {
  if (!username) return null;

  console.log(`Simulating API call to fetch Twitter data for @${username}`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

  // Simulate success or failure (e.g., 90% success rate)
  if (Math.random() < 0.9) {
    // Mock successful response
    const mockProfile: SocialProfile = {
      platform: 'Twitter',
      username: username,
      displayName: `${companyName} (X)`,
      profileImage: `https://unavatar.io/twitter/${username}`,
      bio: `Mock bio for ${companyName} on Twitter/X. Analyzing the competition.`,
      location: 'Mock Location',
      url: `https://twitter.com/${username}`,
      followers: Math.floor(Math.random() * 100000) + 1000,
      following: Math.floor(Math.random() * 1000) + 50,
      postsCount: Math.floor(Math.random() * 5000) + 200,
      joinedDate: '2023-01-15',
    };

    const mockFollowerStats: FollowerStats = {
      current: mockProfile.followers,
      oneDayChange: { count: Math.floor(Math.random() * 200) - 100, percentage: Math.random() * 2 - 1 },
      oneWeekChange: { count: Math.floor(Math.random() * 1000) - 500, percentage: Math.random() * 5 - 2.5 },
      oneMonthChange: { count: Math.floor(Math.random() * 5000) - 2500, percentage: Math.random() * 10 - 5 },
      history: [
        { date: '2024-07-10', count: (mockProfile.followers || 0) - 2500 },
        { date: '2024-07-17', count: (mockProfile.followers || 0) - 1500 },
        { date: '2024-07-24', count: (mockProfile.followers || 0) - 500 },
        { date: '2024-07-31', count: mockProfile.followers || 0 },
      ],
    };

    const mockAnalysis: ContentAnalysis = {
       averageEngagement: Math.random() * 0.05, // 0-5% engagement rate
       postsPerPeriod: Math.random() * 5 + 1, // 1-6 posts per day (mock)
       sentimentBreakdown: { positive: 0.6, negative: 0.1, neutral: 0.3 }
    };

    return {
      profile: mockProfile,
      followerStats: mockFollowerStats,
      contentAnalysis: mockAnalysis,
    };
  } else {
    // Mock failure
    console.error(`Mock API Error: Could not fetch Twitter data for @${username}`);
    return null;
    // OR: throw new Error('Failed to fetch Twitter data'); // depending on how you handle errors
  }
}

// --- LinkedIn Data Fetching ---
export async function fetchLinkedInData(identifier: string, companyName: string): Promise<LinkedInData | null> {
  if (!identifier) return null;

  console.log(`Simulating API call to fetch LinkedIn data for identifier: ${identifier}`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY + 200)); // Slightly longer delay

  // LinkedIn data is harder to get, simulate lower success or less data
  if (Math.random() < 0.7) { 
    const mockProfile: SocialProfile = {
      platform: 'LinkedIn',
      profileId: identifier,
      displayName: `${companyName} (LinkedIn)`,
      profileImage: `https://unavatar.io/linkedin/${identifier}`, // May not work for company pages
      bio: `Mock company description for ${companyName} on LinkedIn. Focus on professional networking.`,
      url: `https://www.linkedin.com/company/${identifier}`, // Example URL structure
      followers: Math.floor(Math.random() * 50000) + 500,
      postsCount: Math.floor(Math.random() * 1000) + 50,
    };

    // Mock limited follower stats if available
    const mockFollowerStats: FollowerStats = {
        current: mockProfile.followers,
        // LinkedIn API might not provide detailed history easily
    };

    return {
      profile: mockProfile,
      followerStats: mockFollowerStats,
      // Content analysis might be very limited or unavailable
    };
  } else {
    console.error(`Mock API Error: Could not fetch LinkedIn data for ${identifier}`);
    return null;
  }
}

// --- Medium Data Fetching ---
export async function fetchMediumData(username: string, companyName: string): Promise<MediumData | null> {
  if (!username) return null;

  console.log(`Simulating API call to fetch Medium data for @${username}`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY + 100));

  if (Math.random() < 0.8) {
    const mockProfile: SocialProfile = {
      platform: 'Medium',
      username: username,
      displayName: `${companyName} (Medium Blog)`,
      profileImage: `https://unavatar.io/medium/${username}`,
      bio: `Mock bio for ${companyName}'s Medium publication/author page. Sharing insights and stories.`,
      url: `https://medium.com/@${username}`, // Or publication URL
      followers: Math.floor(Math.random() * 20000) + 200, // Publication followers
      postsCount: Math.floor(Math.random() * 500) + 10,
    };
    
    // Mock limited data
     const mockFollowerStats: FollowerStats = {
        current: mockProfile.followers,
    };

    return {
      profile: mockProfile,
      followerStats: mockFollowerStats,
      // Maybe fetch recent post titles later
    };
  } else {
    console.error(`Mock API Error: Could not fetch Medium data for @${username}`);
    return null;
  }
}

// --- Crypto Data Fetching ---
export async function fetchCryptoDataBySymbolOrId(symbolOrId: string): Promise<CryptoData | null> {
  if (!symbolOrId) return null;

  console.log(`Simulating API call to fetch Crypto data for ${symbolOrId}`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

  if (Math.random() < 0.9) {
    // Mock successful response
    const mockCryptoData: CryptoData = {
      id: symbolOrId,
      name: `Mock ${symbolOrId} Token`,
      symbol: symbolOrId,
      currentPrice: Math.random() * 150 + 0.5, // Random price between 0.5 and 150.5
      priceChange24h: Math.random() * 10 - 5, // Random change between -5 and 5
      priceChangePercentage24h: Math.random() * 5 - 2.5, // Random percentage change
      marketCap: Math.floor(Math.random() * 1000000000) + 1000000,
      volume24h: Math.floor(Math.random() * 1000000) + 1000
    };
    return mockCryptoData;
  } else {
    console.error(`Mock API Error: Could not fetch Crypto data for ${symbolOrId}`);
    return null;
  }
}

// --- Combined Fetch Function (used by Dashboard) ---
export async function fetchAllCompetitorData(company: Company): Promise<CompetitorData> {
  if (!company) {
    return { twitter: null, linkedIn: null, medium: null, cryptoData: null };
  }

  console.log(`--- Fetching all data for ${company.name} ---`);

  const twitterPromise = company.identifiers.twitter 
    ? fetchTwitterData(company.identifiers.twitter, company.name)
    : Promise.resolve(null);
    
  const linkedInPromise = company.identifiers.linkedIn 
    ? fetchLinkedInData(company.identifiers.linkedIn, company.name)
    : Promise.resolve(null);
    
  const mediumPromise = company.identifiers.medium 
    ? fetchMediumData(company.identifiers.medium, company.name)
    : Promise.resolve(null);

  // Fetch Crypto Data
  const cryptoPromise = company.cmcSymbolOrId
    ? fetchCryptoDataBySymbolOrId(company.cmcSymbolOrId)
    : Promise.resolve(null);

  try {
    const [twitterResult, linkedInResult, mediumResult, cryptoResult] = await Promise.all([
      twitterPromise,
      linkedInPromise,
      mediumPromise,
      cryptoPromise, // Await crypto data
    ]);

    console.log(`--- Finished fetching for ${company.name} ---`);
    return {
      twitter: twitterResult,
      linkedIn: linkedInResult,
      medium: mediumResult,
      cryptoData: cryptoResult, // Include crypto data in the result
    };
  } catch (error) {
    console.error("Error in fetchAllCompetitorData:", error);
    // Return nulls or rethrow, depending on desired dashboard behavior
    return { twitter: null, linkedIn: null, medium: null, cryptoData: null }; 
  }
}
