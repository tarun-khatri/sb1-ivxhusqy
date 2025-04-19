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
  mostEngagingPost?: Post;
  frequentWords?: { word: string; count: number }[];
  sentimentBreakdown?: {
    positive: number;
    negative: number;
    neutral: number;
  };
  averageEngagement?: number;
  postsPerPeriod?: number; // e.g., per day or week
  postTypes?: { [type: string]: number }; // e.g., text, image, video
}

// --- Platform Specific Types ---

export interface TwitterData {
  profile: SocialProfile;
  followerStats: FollowerStats;
  contentAnalysis: ContentAnalysis;
  // Removed crypto-specific fields from here
}

export interface LinkedInData {
  profile: SocialProfile; // Can be Company or Personal Profile
  followerStats?: FollowerStats; // For Company pages
  contentAnalysis?: ContentAnalysis;
  recentArticles?: Post[]; // Specific to LinkedIn?
}

export interface MediumData {
  profile: SocialProfile; // Can be Author or Publication Profile
  followerStats?: FollowerStats; // For Publications
  contentAnalysis?: ContentAnalysis;
  recentPosts?: Post[];
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
  // Add other relevant fields from CMC or other crypto APIs
}

// --- Dashboard State & Props ---

export interface Company {
  id: string; // Add a unique ID for stable state updates
  name: string;
  identifiers: {
    twitter?: string; // username
    linkedIn?: string; // Company page ID/URL or Personal profile ID/URL
    medium?: string; // username or publication slug
  };
  cmcSymbolOrId?: string; // Added field for CMC token identifier
}

export interface CompetitorData {
  twitter?: TwitterData | null;
  linkedIn?: LinkedInData | null;
  medium?: MediumData | null;
  cryptoData?: CryptoData | null; // Added field for crypto data
}
