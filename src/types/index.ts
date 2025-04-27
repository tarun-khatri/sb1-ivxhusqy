// --- Generic Types ---

export interface SocialProfile {
  platform: 'Twitter' | 'LinkedIn' | 'Medium';
  username?: string; // Twitter, Medium
  profileId?: string; // LinkedIn
  displayName: string;
  profileImage: string;
  bio?: string;
  location?: string;
  url?: string;
  followers?: number; // Twitter, LinkedIn (Company), Medium (Publication)
  following?: number; // Twitter, LinkedIn (Personal)
  connections?: number; // LinkedIn (Personal)
  postsCount?: number;
  joinedDate?: string;
}

export interface FollowerHistory {
  date: string;
  count: number;
}

export interface FollowerStats {
  current?: number;
  oneDayChange?: { count: number; percentage: number };
  oneWeekChange?: { count: number; percentage: number };
  oneMonthChange?: { count: number; percentage: number };
  history?: FollowerHistory[];
}

export interface Post {
  id: string;
  platform: 'Twitter' | 'LinkedIn' | 'Medium';
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
  text: string;
  media?: { type: string; url: string }[];
  date: string;
  postUrl: string;
  likes?: number; // Twitter, LinkedIn
  retweets?: number; // Twitter
  reposts?: number; // LinkedIn
  replies?: number; // Twitter
  comments?: number; // LinkedIn, Medium
  claps?: number; // Medium
  engagement?: number; // Combined/calculated metric
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface ContentAnalysis {
  recentPosts?: Post[];
  metrics?: {
    engagementRate: number; // Engagement rate as percentage
    avgEngagementRate: number; // Average engagements per post
    replies24h: number;
    replies7d: number;
    totalLikes: number;
    totalRetweets: number;
    totalReplies: number;
    recentTweetsCount: number;
  };
}

// --- Platform Specific Types ---

export interface TwitterData {
  profile: SocialProfile;
  followerStats: FollowerStats;
  contentAnalysis: ContentAnalysis;
}

export interface LinkedInPost {
  text: string;
  totalReactionCount: number;
  likeCount: number;
  appreciationCount?: number;
  empathyCount?: number;
  InterestCount?: number;
  praiseCount?: number;
  commentsCount: number;
  repostsCount: number;
  postUrl: string;
  postedAt: string;
  urn: string;
  author?: {
    firstName?: string;
    lastName?: string;
    username?: string;
    url?: string;
  };
  company?: {
    name: string;
    url: string;
    urn: string;
  };
}

export interface LinkedInCompanyData {
  id: string;
  name: string;
  universalName: string;
  linkedinUrl: string;
  tagline: string;
  description: string;
  Images: {
    logo: string;
    cover: string;
  };
  staffCount: number;
  headquarter: {
    countryCode: string;
    geographicArea: string;
    country: string;
    city: string;
    description: string;
    headquarter: boolean;
  };
  locations: Array<{
    countryCode: string;
    geographicArea: string;
    country: string;
    city: string;
    description: string;
    headquarter: boolean;
  }>;
  industries: string[];
  website: string;
  founded: {
    year: number;
  };
  followerCount: number;
  staffCountRange: string;
}

export interface LinkedInApiResponse {
  success: boolean;
  message: string;
  data: LinkedInCompanyData | LinkedInPost[];
}

export interface LinkedInData {
  companyProfile: LinkedInApiResponse;
  posts: LinkedInApiResponse;
}

export interface MediumData {
  profile: SocialProfile; // Can be Author or Publication Profile
  followerStats?: FollowerStats; // For Publications
  contentAnalysis?: ContentAnalysis; // Now includes recentPosts
  // Removed recentPosts specific property here as it's part of ContentAnalysis
}

// --- GitHub Data Type ---
export interface GitHubData {
  profile: {
    username: string;
    name: string;
    followers: number;
    following: number;
    publicRepos: number;
    avatarUrl: string;
  };
  metrics?: {
    stars: number;
    forks: number;
    watchers: number;
  };
}

// --- Onchain Data Type ---
export interface OnchainData {
  profile: {
    name: string;
    description: string;
    logo?: string;
    website?: string;
  };
  metrics: {
    totalTransactions: number;
    transactionGrowth24h: number;
    transactionGrowth7d: number;
    activeWallets: number;
    activeWalletsGrowth24h: number;
    averageTransactionValue: number;
  };
  recentActivity: {
    transactions24h: number;
    uniqueAddresses24h: number;
  };
}

// --- Crypto Data Type ---
export interface CryptoData {
  id: string | number; // CMC ID or Symbol
  name: string;
  symbol: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap?: number;
  volume24h?: number;
}

// --- Dashboard State & Props ---

export interface Company {
  id: string; // Add a unique ID for stable state updates
  name: string;
  identifiers: {
    twitter?: string; // username
    linkedIn?: string; // Company page ID/URL or Personal profile ID/URL
    medium?: string; // username or publication slug
    github?: string; // GitHub username
    defillama?: string; // DefiLlama protocol identifier
  };
  onchainAddress?: string; // Added field for onchain address
  cmcSymbolOrId?: string; // Added field for CMC token identifier
}

export interface CompetitorData {
  twitter?: TwitterData | null;
  linkedIn?: LinkedInData | null;
  medium?: MediumData | null;
  cryptoData?: CryptoData | null; // Added field for crypto data
  onchainData?: OnchainData | null; // Added field for onchain data
  github?: GitHubData | null; // Added field for GitHub data
}
