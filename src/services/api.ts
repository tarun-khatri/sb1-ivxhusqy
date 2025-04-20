import { 
  TwitterData, 
  LinkedInData, 
  MediumData, 
  SocialProfile, 
  FollowerStats, 
  ContentAnalysis,
  Company, 
  CryptoData,
  CompetitorData,
  Post
} from '../types';
import axios from 'axios';

// --- Placeholder API Functions ---
// These functions simulate fetching data for each platform.
// Replace these with actual API calls using RapidAPI or other services.

// MOCK DELAY - Simulate network latency
const MOCK_API_DELAY = 800; // milliseconds


// --- Twitter/X Data Fetching ---
export async function fetchTwitterData(username: string, companyName: string): Promise<TwitterData | null> {
  if (!username) {
    console.warn('No Twitter username provided');
    return null;
  }

  console.log(`Fetching Twitter data from RapidAPI for @${username}`);

  try {
    const options = {
      method: 'GET',
      url: 'https://twitter154.p.rapidapi.com/user/details',
      params: {
        username: username
        // user_id is optional in the API, username should suffice
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'twitter154.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    const data = response.data;

    if (!data) {
      console.warn(`No Twitter data found for @${username}`);
      return null;
    }

    console.log("Received Twitter User Detail Data:", JSON.stringify(data, null, 2));

    // Process the data to fit the TwitterData type based on provided response
    const profile: SocialProfile = {
      platform: 'Twitter',
      username: data.username,
      displayName: data.name,
      profileImage: data.profile_pic_url,
      bio: data.description,
      location: data.location,
      url: `https://twitter.com/${data.username}`,
      followers: data.follower_count,
      following: data.following_count,
      postsCount: data.number_of_tweets,
      joinedDate: data.creation_date
    };

    const followerStats: FollowerStats = {
      current: data.follower_count
      // Add other follower stats if available from the API
    };

    const analysis: ContentAnalysis = {
      // Add content analysis if available from the API
    };

    return {
      profile: profile,
      followerStats: followerStats,
      contentAnalysis: analysis
    };

  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    return null;
  }
}

// --- LinkedIn Data Fetching ---
export async function fetchLinkedInData(identifier: string, companyName: string): Promise<LinkedInData | null> {
  if (!identifier) {
    console.warn('No LinkedIn identifier provided');
    return null;
  }

  console.log(`Fetching LinkedIn posts from RapidAPI for ${identifier}`);

  const options = {
    method: 'GET',
    url: 'https://linkedin-data-api.p.rapidapi.com/get-company-posts',
    params: {
      username: identifier, // Use the company's LinkedIn username/handle
      start: '0'
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'linkedin-data-api.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const responseData = response.data;

    if (!responseData || !responseData.success || !responseData.data || responseData.data.length === 0) {
        console.warn(`No LinkedIn posts found for ${identifier}`);
        // Still return basic profile structure even if no posts are found
    }

    const posts: Post[] = responseData.data ? responseData.data.map((post: any) => ({
        id: post.urn, // Using URN as ID
        platform: 'LinkedIn',
        authorName: post.author?.firstName ? `${post.author.firstName} ${post.author.lastName}` : post.company?.name || companyName,
        authorAvatar: '' ,// API doesn't seem to provide this
        text: post.text,
        media: post.video ? [{ type: 'video', url: post.video[0]?.url }] : (post.image ? post.image.map((img: any) => ({ type: 'image', url: img.url })) : []),
        date: post.postedAt, // Relative date, may need conversion
        postUrl: post.postUrl,
        likes: post.likeCount,
        comments: post.commentsCount,
        reposts: post.repostsCount,
        engagement: post.totalReactionCount, // Using totalReactionCount as engagement
        sentiment: 'neutral' // Placeholder, sentiment analysis would require additional logic/API
    })) : [];

    // Create placeholder profile data as this endpoint focuses on posts
    const profile: SocialProfile = {
      platform: 'LinkedIn',
      profileId: identifier,
      displayName: companyName, // Assuming companyName is passed correctly
      profileImage: '' ,// Placeholder - Not provided by this endpoint
      bio: '' ,// Placeholder - Not provided by this endpoint
      url: `https://www.linkedin.com/company/${identifier}/`,
      followers: undefined, // Placeholder - Not provided by this endpoint
      postsCount: posts.length // Can estimate from the posts fetched
    };

    const followerStats: FollowerStats = {
      current: undefined // Placeholder - Not provided by this endpoint
    };
    
    const contentAnalysis: ContentAnalysis = {
        recentArticles: posts
    };

    return {
      profile: profile,
      followerStats: followerStats,
      contentAnalysis: contentAnalysis
    };

  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    return null;
  }
}

// --- Medium Data Fetching ---
export async function fetchMediumData(username: string, companyName: string): Promise<MediumData | null> {

  if (!username) {
    console.warn('No Medium username provided');
    return null;
  }

  console.log(`Simulating API call to fetch Medium data for @${username}`);

 

  try {
   return null; 


  } catch (error) {
    console.error('Error fetching Medium data:', error);
    return null;
  }
}

// --- Crypto Data Fetching ---
export async function fetchCryptoDataBySymbolOrId(symbolOrId: string): Promise<CryptoData | null> {
  if (!symbolOrId) {
      console.warn('No Crypto symbolOrId provided');
      return null;
  }

  console.log(`Fetching Crypto data from CoinMarketCap for ${symbolOrId}`);

   try {
        // Replace with actual CMC API call using process.env.CMC_API_KEY
        // Remember to map the response correctly to CryptoData type

        return null;
    } catch (error) {
        console.error(`Error fetching Crypto data for ${symbolOrId}:`, error);
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
