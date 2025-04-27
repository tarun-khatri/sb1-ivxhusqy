import { LinkedInData, SocialProfile, FollowerStats, ContentAnalysis, Post } from '../types/index';
import axios from 'axios';

const LINKEDIN_API_BASE_URL = 'https://linkedin-data-api.p.rapidapi.com';

export async function fetchLinkedInData(identifier: string, companyName: string): Promise<LinkedInData | null> {
  if (!identifier) {
    console.warn('No LinkedIn identifier provided');
    return null;
  }

  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY || process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    console.error('No RapidAPI key found. Please set VITE_RAPIDAPI_KEY or RAPIDAPI_KEY environment variable.');
    return null;
  }
  
  const apiHost = 'linkedin-data-api.p.rapidapi.com';

  const companyDetailsOptions = {
    method: 'GET',
    url: `${LINKEDIN_API_BASE_URL}/get-company-details`,
    params: { username: identifier },
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost
    }
  };

  const companyPostsOptions = {
    method: 'GET',
    url: `${LINKEDIN_API_BASE_URL}/get-company-posts`,
    params: { username: identifier, start: '0' },
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': apiHost
    }
  };

  try {
    // Fetch both endpoints in parallel
    const [companyDetailsRes, companyPostsRes] = await Promise.all([
      axios.request(companyDetailsOptions),
      axios.request(companyPostsOptions)
    ]);
    
    // Check if responses are successful
    if (!companyDetailsRes.data?.success) {
      console.warn('LinkedIn company details API returned unsuccessful response:', companyDetailsRes.data);
    }
    
    if (!companyPostsRes.data?.success) {
      console.warn('LinkedIn company posts API returned unsuccessful response:', companyPostsRes.data);
    }
    
    const companyProfile = companyDetailsRes.data;
    const posts = companyPostsRes.data;

    // Map company details to SocialProfile and FollowerStats
    let profile: SocialProfile = {
      platform: 'LinkedIn',
      profileId: companyProfile?.data?.id?.toString() || identifier,
      displayName: companyProfile?.data?.name || companyName,
      profileImage: companyProfile?.data?.Images?.logo || '',
      bio: companyProfile?.data?.description || '',
      location: companyProfile?.data?.headquarter?.city || '',
      url: companyProfile?.data?.linkedinUrl || `https://www.linkedin.com/company/${identifier}/`,
      followers: companyProfile?.data?.followerCount || 0,
      postsCount: Array.isArray(posts?.data) ? posts.data.length : 0
    };

    let followerStats: FollowerStats = {
      current: companyProfile?.data?.followerCount || 0
    };

    // Map posts to Post[]
    let recentPosts: Post[] = Array.isArray(posts?.data)
      ? posts.data.map((post: any) => ({
          id: post.urn || `post-${Math.random().toString(36).substring(2, 9)}`,
          platform: 'LinkedIn',
          authorName: post.author?.firstName
            ? `${post.author.firstName} ${post.author.lastName}`
            : post.company?.name || companyName,
          authorAvatar: '',
          text: post.text || '',
          media: post.video
            ? post.video.map((v: any) => ({ type: 'video', url: v.url }))
            : post.image
            ? post.image.map((img: any) => ({ type: 'image', url: img.url }))
            : [],
          date: post.postedAt || new Date().toISOString(),
          postUrl: post.postUrl || '',
          likes: post.likeCount || 0,
          comments: post.commentsCount || 0,
          reposts: post.repostsCount || 0,
          engagement: post.totalReactionCount || 0,
          sentiment: 'neutral'
        }))
      : [];

    let contentAnalysis: ContentAnalysis = {
      recentPosts
    };

    // Return both raw API and normalized data
    return {
      companyProfile,
      posts,
      profile,
      followerStats,
      contentAnalysis
    } as any;
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
    }
    return null;
  }
}

export async function fetchLinkedInMetrics(identifier: string): Promise<LinkedInData | null> {
  if (!identifier) {
    console.warn('No LinkedIn identifier provided');
    return null;
  }

  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY || process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    console.error('No RapidAPI key found. Please set VITE_RAPIDAPI_KEY or RAPIDAPI_KEY environment variable.');
    return null;
  }

  try {
    // Fetch company profile
    const companyProfileOptions = {
      method: 'GET',
      url: `${LINKEDIN_API_BASE_URL}/company`,
      params: { username: identifier },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'linkedin-data-api.p.rapidapi.com'
      }
    };

    // Fetch company posts
    const companyPostsOptions = {
      method: 'GET',
      url: `${LINKEDIN_API_BASE_URL}/get-company-posts`,
      params: { username: identifier },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'linkedin-data-api.p.rapidapi.com'
      }
    };

    // Make both API calls in parallel
    const [companyProfileResponse, companyPostsResponse] = await Promise.all([
      axios.request(companyProfileOptions),
      axios.request(companyPostsOptions)
    ]);
    
    // Check if responses are successful
    if (!companyProfileResponse.data?.success) {
      console.warn('LinkedIn company profile API returned unsuccessful response:', companyProfileResponse.data);
    }
    
    if (!companyPostsResponse.data?.success) {
      console.warn('LinkedIn company posts API returned unsuccessful response:', companyPostsResponse.data);
    }

    return {
      companyProfile: companyProfileResponse.data,
      posts: companyPostsResponse.data
    };

  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
    }
    return null;
  }
}