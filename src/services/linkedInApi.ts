import { SocialMediaData } from '../types/index';
import { fetchSocialMediaDataWithCache } from './socialMediaApi';

export async function fetchLinkedInData(identifier: string, companyName: string): Promise<SocialMediaData | null> {
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
    return data;
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