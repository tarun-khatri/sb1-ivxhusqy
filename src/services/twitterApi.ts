import { TwitterData, SocialProfile, FollowerStats, ContentAnalysis, Post } from '../types';
import axios from 'axios';

const RAPIDAPI_HOST = 'twitter154.p.rapidapi.com';

const api = axios.create({
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST
  }
});

async function fetchUserDetails(username: string): Promise<any> {
  try {
    const response = await api.get('https://twitter154.p.rapidapi.com/user/details', {
      params: { username }
    });
    console.log('User details response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
}

async function fetchUserTweets(username: string): Promise<any> {
  try {
    const response = await api.get('https://twitter154.p.rapidapi.com/user/tweets', {
      params: { username, limit: '100' }
    });
    console.log('User tweets response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching user tweets:', error);
    throw error;
  }
}

async function calculateEngagementMetrics(tweets: any[], followerCount: number): Promise<{
  engagementRate: number;
  avgEngagementRate: number;
  replies24h: number;
  replies7d: number;
  totalLikes: number;
  totalRetweets: number;
  totalReplies: number;
  recentTweetsCount: number;
}> {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let totalEngagements = 0;
  let replies24h = 0;
  let replies7d = 0;
  let totalLikes = 0;
  let totalRetweets = 0;
  let totalReplies = 0;

  tweets.forEach(tweet => {
    const tweetDate = new Date(tweet.creation_date);
    
    // Count total engagements (likes + retweets + replies)
    const likes = parseInt(tweet.favorite_count) || 0;
    const retweets = parseInt(tweet.retweet_count) || 0;
    const replies = parseInt(tweet.reply_count) || 0;
    const tweetEngagements = likes + retweets + replies;
    
    totalEngagements += tweetEngagements;
    totalLikes += likes;
    totalRetweets += retweets;
    totalReplies += replies;

    // Count replies for different time periods
    if (tweetDate >= oneDayAgo) {
      replies24h += replies;
    }
    if (tweetDate >= sevenDaysAgo) {
      replies7d += replies;
    }
  });

  const avgEngagementRate = tweets.length > 0 ? totalEngagements / tweets.length : 0;
  
  // Calculate engagement rate as percentage: (avg engagements per post / followers) * 100
  const engagementRate = followerCount > 0 
    ? (avgEngagementRate / followerCount) * 100 
    : 0;

  return {
    engagementRate,
    avgEngagementRate,
    replies24h,
    replies7d,
    totalLikes,
    totalRetweets,
    totalReplies,
    recentTweetsCount: tweets.length
  };
}

export async function fetchTwitterData(username: string, companyName: string): Promise<TwitterData | null> {
  if (!username) {
    console.warn('No Twitter username provided');
    return null;
  }

  try {
    // Fetch user details and tweets in parallel
    const [userDetails, userTweets] = await Promise.all([
      fetchUserDetails(username),
      fetchUserTweets(username)
    ]);

    if (!userDetails) {
      console.warn(`No Twitter data found for @${username}`);
      return null;
    }

    // Get follower count and ensure it's a number
    const followerCount = parseInt(userDetails.follower_count) || 0;
    console.log('Follower count:', followerCount);

    // Calculate engagement metrics
    const metrics = await calculateEngagementMetrics(userTweets.results || [], followerCount);
    console.log('Calculated metrics:', metrics);

    // Transform the data into the expected TwitterData interface structure
    const twitterData: TwitterData = {
      profile: {
        platform: 'Twitter',
        username: userDetails.username,
        displayName: userDetails.name,
        profileImage: userDetails.profile_pic_url,
        bio: userDetails.description,
        location: userDetails.location,
        url: `https://twitter.com/${userDetails.username}`,
        followers: followerCount,
        following: parseInt(userDetails.following_count) || 0,
        postsCount: parseInt(userDetails.tweets_count) || 0,
        joinedDate: userDetails.creation_date
      },
      followerStats: {
        current: followerCount,
        oneDayChange: {
          count: 0,
          percentage: 0
        }
      },
      contentAnalysis: {
        recentPosts: userTweets.results?.map((tweet: any) => ({
          id: tweet.id,
          platform: 'Twitter',
          authorId: userDetails.user_id,
          authorName: userDetails.name,
          authorAvatar: userDetails.profile_pic_url,
          text: tweet.text,
          date: tweet.creation_date,
          postUrl: `https://twitter.com/${userDetails.username}/status/${tweet.id}`,
          likes: parseInt(tweet.favorite_count) || 0,
          retweets: parseInt(tweet.retweet_count) || 0,
          replies: parseInt(tweet.reply_count) || 0,
          engagement: parseInt(tweet.favorite_count) + parseInt(tweet.retweet_count) + parseInt(tweet.reply_count)
        })),
        metrics: {
          engagementRate: metrics.engagementRate,
          avgEngagementRate: metrics.avgEngagementRate,
          replies24h: metrics.replies24h,
          replies7d: metrics.replies7d,
          totalLikes: metrics.totalLikes,
          totalRetweets: metrics.totalRetweets,
          totalReplies: metrics.totalReplies,
          recentTweetsCount: metrics.recentTweetsCount
        }
      }
    };

    return twitterData;
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    return null;
  }
}

export async function fetchTwitterMetrics(username: string): Promise<TwitterData | null> {
  return fetchTwitterData(username, '');
}