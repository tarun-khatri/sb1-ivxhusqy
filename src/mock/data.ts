import { TwitterAccountData, TrackedAccount } from '../types';

// Mock data for Twitter accounts
export const mockAccounts: Record<string, TwitterAccountData> = {
  elonmusk: {
    profile: {
      username: 'elonmusk',
      displayName: 'Elon Musk',
      profileImage: 'https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg',
      bio: 'Chief Twit at Twitter, CEO of Tesla and SpaceX',
      location: 'Mars',
      followers: 128500000,
      following: 177,
      isCrypto: true,
      cryptoToken: 'DOGE',
    },
    followerStats: {
      current: 128500000,
      oneDayChange: {
        count: 24500,
        percentage: 0.019,
      },
      oneWeekChange: {
        count: 154600,
        percentage: 0.121,
      },
      oneMonthChange: {
        count: 687400,
        percentage: 0.538,
      },
      history: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(128500000 - 687400 + (i * 687400) / 29 + Math.random() * 10000 - 5000),
      })),
    },
    tweetAnalysis: {
      mostViralTweet: {
        id: '123456789',
        text: 'Twitter algorithm will be open source',
        date: '2023-07-12',
        likes: 785400,
        retweets: 98700,
        replies: 45600,
        engagement: 929700,
        sentiment: 'positive',
      },
      frequentWords: [
        { word: 'Twitter', count: 76 },
        { word: 'Tesla', count: 58 },
        { word: 'SpaceX', count: 42 },
        { word: 'Rocket', count: 31 },
        { word: 'Doge', count: 29 },
        { word: 'Mars', count: 28 },
        { word: 'Launch', count: 26 },
        { word: 'AI', count: 25 },
        { word: 'Crypto', count: 24 },
        { word: 'Free', count: 21 },
      ],
      sentimentBreakdown: {
        positive: 63,
        negative: 15,
        neutral: 22,
      },
      averageEngagement: 175000,
      postsPerDay: 7.3,
    },
    cryptoData: {
      name: 'Dogecoin',
      symbol: 'DOGE',
      currentPrice: 0.1325,
      priceChange24h: 0.00723,
      priceChangePercentage24h: 5.78,
    },
  },
  naval: {
    profile: {
      username: 'naval',
      displayName: 'Naval',
      profileImage: 'https://pbs.twimg.com/profile_images/1720043296794198016/XQW8MeZN_400x400.jpg',
      bio: 'https://nav.al',
      location: 'Universe 25',
      followers: 2100000,
      following: 530,
      isCrypto: true,
      cryptoToken: 'BTC',
    },
    followerStats: {
      current: 2100000,
      oneDayChange: {
        count: 1200,
        percentage: 0.057,
      },
      oneWeekChange: {
        count: 8600,
        percentage: 0.412,
      },
      oneMonthChange: {
        count: 37800,
        percentage: 1.83,
      },
      history: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(2100000 - 37800 + (i * 37800) / 29 + Math.random() * 1000 - 500),
      })),
    },
    tweetAnalysis: {
      mostViralTweet: {
        id: '987654321',
        text: 'Learn to sell. Learn to build. If you can do both, you will be unstoppable.',
        date: '2023-08-05',
        likes: 124500,
        retweets: 35800,
        replies: 4200,
        engagement: 164500,
        sentiment: 'positive',
      },
      frequentWords: [
        { word: 'Wealth', count: 68 },
        { word: 'Knowledge', count: 65 },
        { word: 'Learning', count: 54 },
        { word: 'Money', count: 46 },
        { word: 'Bitcoin', count: 42 },
        { word: 'Happiness', count: 38 },
        { word: 'Reading', count: 36 },
        { word: 'Freedom', count: 34 },
        { word: 'Leverage', count: 32 },
        { word: 'Time', count: 30 },
      ],
      sentimentBreakdown: {
        positive: 78,
        negative: 5,
        neutral: 17,
      },
      averageEngagement: 85000,
      postsPerDay: 0.8,
    },
    cryptoData: {
      name: 'Bitcoin',
      symbol: 'BTC',
      currentPrice: 67250.23,
      priceChange24h: 1250.45,
      priceChangePercentage24h: 1.89,
    },
  },
  google: {
    profile: {
      username: 'Google',
      displayName: 'Google',
      profileImage: 'https://pbs.twimg.com/profile_images/1605297940242669568/q8-vPggS_400x400.jpg',
      bio: 'Organizing the world\'s information and making it universally accessible and useful.',
      location: 'Mountain View, CA',
      followers: 29800000,
      following: 332,
      isCrypto: false,
    },
    followerStats: {
      current: 29800000,
      oneDayChange: {
        count: 5400,
        percentage: 0.018,
      },
      oneWeekChange: {
        count: 32700,
        percentage: 0.11,
      },
      oneMonthChange: {
        count: 145600,
        percentage: 0.49,
      },
      history: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(29800000 - 145600 + (i * 145600) / 29 + Math.random() * 3000 - 1500),
      })),
    },
    tweetAnalysis: {
      mostViralTweet: {
        id: '456789123',
        text: 'Introducing Gemini, our most capable AI model yet.',
        date: '2023-09-10',
        likes: 156700,
        retweets: 45200,
        replies: 15800,
        engagement: 217700,
        sentiment: 'positive',
      },
      frequentWords: [
        { word: 'AI', count: 87 },
        { word: 'Google', count: 76 },
        { word: 'Search', count: 54 },
        { word: 'Android', count: 48 },
        { word: 'Gemini', count: 42 },
        { word: 'Pixel', count: 38 },
        { word: 'Chrome', count: 35 },
        { word: 'Cloud', count: 32 },
        { word: 'Innovation', count: 29 },
        { word: 'Technology', count: 28 },
      ],
      sentimentBreakdown: {
        positive: 72,
        negative: 8,
        neutral: 20,
      },
      averageEngagement: 65000,
      postsPerDay: 3.5,
    },
  },
};

// Mock tracked accounts
export const mockTrackedAccounts: TrackedAccount[] = [
  {
    username: 'elonmusk',
    addedDate: '2023-08-15',
  },
  {
    username: 'naval',
    addedDate: '2023-09-20',
  },
  {
    username: 'Google',
    addedDate: '2023-10-05',
  },
];

// Mock function to get account data
export const getAccountData = (username: string): TwitterAccountData | null => {
  const normalizedUsername = username.toLowerCase().replace('@', '');
  return mockAccounts[normalizedUsername] || null;
};

// Mock function to track an account
export const trackAccount = (username: string): void => {
  console.log(`Account ${username} tracked`);
};

// Mock function to untrack an account
export const untrackAccount = (username: string): void => {
  console.log(`Account ${username} untracked`);
};

// Mock function to check if account is tracked
export const isAccountTracked = (username: string): boolean => {
  return mockTrackedAccounts.some(
    (account) => account.username.toLowerCase() === username.toLowerCase()
  );
};