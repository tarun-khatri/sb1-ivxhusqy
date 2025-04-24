import { LinkedInData, SocialProfile, FollowerStats, ContentAnalysis, Post } from '../types';
import axios from 'axios';

// Mock data for LinkedIn metrics
const mockLinkedInData: LinkedInData = {
  profile: {
    platform: 'LinkedIn',
    profileId: 'phantom',
    displayName: 'Phantom',
    profileImage: 'https://example.com/phantom-logo.png',
    bio: 'The friendly crypto wallet for Solana',
    url: 'https://www.linkedin.com/company/phantom',
    followers: 5000,
    postsCount: 150
  },
  followerStats: {
    current: 5000,
    oneDayChange: { count: 50, percentage: 1 },
    oneWeekChange: { count: 200, percentage: 4.2 },
    oneMonthChange: { count: 800, percentage: 19.1 }
  },
  contentAnalysis: {
    recentPosts: [
      {
        id: '1',
        platform: 'LinkedIn',
        authorName: 'Phantom',
        authorAvatar: 'https://example.com/phantom-logo.png',
        text: 'Excited to announce our latest features for the Solana ecosystem!',
        date: new Date(Date.now() - 86400000).toISOString(),
        postUrl: 'https://linkedin.com/company/phantom/posts/1',
        likes: 250,
        comments: 45,
        reposts: 30,
        engagement: 325,
        sentiment: 'positive'
      }
    ],
    metrics: {
      engagementRate: 6.5,
      avgEngagementRate: 325,
      replies24h: 45,
      replies7d: 280,
      totalLikes: 2500,
      totalRetweets: 800,
      totalReplies: 600,
      recentTweetsCount: 150
    }
  }
};

export async function fetchLinkedInData(identifier: string, companyName: string): Promise<LinkedInData | null> {
  if (!identifier) {
    console.warn('No LinkedIn identifier provided');
    return null;
  }
  const options = {
    method: 'GET',
    url: 'https://linkedin-data-api.p.rapidapi.com/get-company-posts',
    params: {
      username: identifier,
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
    }
    const posts: Post[] = responseData.data ? responseData.data.map((post: any) => ({
      id: post.urn,
      platform: 'LinkedIn',
      authorName: post.author?.firstName ? `${post.author.firstName} ${post.author.lastName}` : post.company?.name || companyName,
      authorAvatar: '',
      text: post.text,
      media: post.video ? [{ type: 'video', url: post.video[0]?.url }] : (post.image ? post.image.map((img: any) => ({ type: 'image', url: img.url })) : []),
      date: post.postedAt,
      postUrl: post.postUrl,
      likes: post.likeCount,
      comments: post.commentsCount,
      reposts: post.repostsCount,
      engagement: post.totalReactionCount,
      sentiment: 'neutral'
    })) : [];
    const profile: SocialProfile = {
      platform: 'LinkedIn',
      profileId: identifier,
      displayName: companyName,
      profileImage: '',
      bio: '',
      url: `https://www.linkedin.com/company/${identifier}/`,
      followers: undefined,
      postsCount: posts.length
    };
    const followerStats: FollowerStats = {
      current: undefined
    };
    const contentAnalysis: ContentAnalysis = {
      recentPosts: posts
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

export async function fetchLinkedInMetrics(identifier: string): Promise<LinkedInData | null> {
  if (!identifier) {
    console.warn('No LinkedIn identifier provided');
    return null;
  }

  // For now, return mock data
  // In the future, this would make a real API call to RapidAPI
  console.log('Fetching LinkedIn metrics for:', identifier);
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return {
      ...mockLinkedInData,
      profile: {
        ...mockLinkedInData.profile,
        profileId: identifier
      }
    };
  } catch (error) {
    console.error('Error fetching LinkedIn metrics:', error);
    return null;
  }
}