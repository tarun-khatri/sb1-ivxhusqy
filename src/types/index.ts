export interface TwitterProfile {
  username: string;
  displayName: string;
  profileImage: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  isCrypto: boolean;
  cryptoToken?: string;
}

export interface FollowerHistory {
  date: string;
  count: number;
}

export interface FollowerStats {
  current: number;
  oneDayChange: {
    count: number;
    percentage: number;
  };
  oneWeekChange: {
    count: number;
    percentage: number;
  };
  oneMonthChange: {
    count: number;
    percentage: number;
  };
  history: FollowerHistory[];
}

export interface Tweet {
  id: string;
  text: string;
  date: string;
  likes: number;
  retweets: number;
  replies: number;
  engagement: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface TweetAnalysis {
  mostViralTweet: Tweet;
  frequentWords: {
    word: string;
    count: number;
  }[];
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  averageEngagement: number;
  postsPerDay: number;
}

export interface CryptoData {
  name: string;
  symbol: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
}

export interface TwitterAccountData {
  profile: TwitterProfile;
  followerStats: FollowerStats;
  tweetAnalysis: TweetAnalysis;
  cryptoData?: CryptoData;
}

export interface TrackedAccount {
  username: string;
  addedDate: string;
}