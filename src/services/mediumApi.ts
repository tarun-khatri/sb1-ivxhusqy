import { MediumData, SocialProfile, FollowerStats, ContentAnalysis, Post } from '../types';

// Mock data for Medium metrics
const mockMediumData: MediumData = {
  profile: {
    platform: 'Medium',
    profileId: 'phantom-blog',
    displayName: 'Phantom Blog',
    profileImage: 'https://example.com/phantom-blog.png',
    bio: 'Official blog of Phantom - The friendly crypto wallet',
    url: 'https://medium.com/@phantom-blog',
    followers: 2000,
    postsCount: 45
  },
  followerStats: {
    current: 2000,
    oneDayChange: { count: 20, percentage: 1 },
    oneWeekChange: { count: 100, percentage: 5.2 },
    oneMonthChange: { count: 300, percentage: 17.6 }
  },
  contentAnalysis: {
    recentPosts: [
      {
        id: '1',
        platform: 'Medium',
        authorName: 'Phantom Blog',
        authorAvatar: 'https://example.com/phantom-blog.png',
        text: 'Introducing New Security Features in Phantom Wallet',
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        postUrl: 'https://medium.com/@phantom-blog/new-security-features',
        likes: 150,
        comments: 25,
        reposts: 45,
        engagement: 220,
        sentiment: 'positive'
      }
    ],
    metrics: {
      engagementRate: 11,
      avgEngagementRate: 220,
      totalLikes: 3500,
      totalComments: 850,
      totalClaps: 12000,
      postsLastMonth: 8
    }
  }
};

export async function fetchMediumMetrics(identifier: string): Promise<MediumData | null> {
  if (!identifier) {
    console.warn('No Medium identifier provided');
    return null;
  }

  console.log('Fetching Medium metrics for:', identifier);
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data with the correct identifier
    return {
      ...mockMediumData,
      profile: {
        ...mockMediumData.profile,
        profileId: identifier
      }
    };
  } catch (error) {
    console.error('Error fetching Medium metrics:', error);
    return null;
  }
}
