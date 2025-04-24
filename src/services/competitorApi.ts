import { Company, CompetitorData } from '../types';
import { fetchTwitterMetrics } from './twitterApi';
import { fetchLinkedInMetrics } from './linkedInApi';
import { fetchMediumMetrics } from './mediumApi';
import { fetchCryptoDataBySymbolOrId } from './cryptoApi';

export async function fetchAllCompetitorData(company: Company): Promise<CompetitorData> {
  if (!company) {
    return { twitter: null, linkedIn: null, medium: null, cryptoData: null };
  }

  console.log(`--- Fetching all data for ${company.name} ---`);

  const twitterPromise = company.identifiers?.twitter 
    ? fetchTwitterMetrics(company.identifiers.twitter)
    : Promise.resolve(null);
    
  const linkedInPromise = company.identifiers?.linkedIn 
    ? fetchLinkedInMetrics(company.identifiers.linkedIn)
    : Promise.resolve(null);
    
  const mediumPromise = company.identifiers?.medium 
    ? fetchMediumMetrics(company.identifiers.medium)
    : Promise.resolve(null);

  const cryptoPromise = company.cmcSymbolOrId
    ? fetchCryptoDataBySymbolOrId(company.cmcSymbolOrId)
    : Promise.resolve(null);

  try {
    const [twitterResult, linkedInResult, mediumResult, cryptoResult] = await Promise.all([
      twitterPromise,
      linkedInPromise,
      mediumPromise,
      cryptoPromise,
    ]);

    console.log(`--- Finished fetching for ${company.name} ---`);
    return {
      twitter: twitterResult,
      linkedIn: linkedInResult,
      medium: mediumResult,
      cryptoData: cryptoResult,
    };
  } catch (error) {
    console.error("Error in fetchAllCompetitorData:", error);
    return { twitter: null, linkedIn: null, medium: null, cryptoData: null };
  }
} 