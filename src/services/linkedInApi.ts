import { LinkedInData, SocialProfile, FollowerStats, ContentAnalysis, Post } from '../types/index';
import { fetchSocialMediaDataWithCache } from './socialMediaApi';

export async function fetchLinkedInData(identifier: string, companyName: string): Promise<LinkedInData | null> {
  if (!identifier) {
    console.warn('No LinkedIn identifier provided');
    return null;
  }

  try {
    const data = await fetchSocialMediaDataWithCache('LinkedIn', identifier, companyName);
    
    if (!data) {
      console.warn('LinkedIn API returned no data');
      return null;
    }

    // Transform the unified data format to LinkedIn-specific format
    return {
      companyProfile: {
        success: true,
        data: {
          name: data.profile.name || data.profile.displayName || '',
          description: data.profile.bio || '',
          website: data.profile.url || '',
          followers: data.followerStats?.current || 0,
          employeeCount: 0, // This would need to come from a different API
          industry: '', // This would need to come from a different API
        }
      },
      posts: {
        success: true,
        data: {
          posts: [], // We would need to fetch posts separately
          totalPosts: data.profile.postsCount || 0
        }
      }
    };
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    return null;
  }
}

export async function fetchLinkedInCompanyData(companyName: string) {
  try {
    return await fetchLinkedInData("company", companyName);
  } catch (error) {
    console.error("Error fetching LinkedIn company data:", error);
    throw error;
  }
}

export async function fetchLinkedInProfileData(profileId: string) {
  try {
    return await fetchLinkedInData(profileId, "");
  } catch (error) {
    console.error("Error fetching LinkedIn profile data:", error);
    throw error;
  }
}