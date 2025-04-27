import axios from 'axios';
import { OnchainData } from '../types';

const LLAMA_API_BASE_URL = 'https://api.llama.fi';

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const fetchOnchainMetrics = async (protocol: string): Promise<OnchainData> => {
  console.log(`Fetching onchain metrics for protocol: ${protocol}`);
  
  try {
    // Fetch protocol data and fees data
    console.log(`Making API calls to ${LLAMA_API_BASE_URL} for ${protocol}`);
    const [protocolResponse, feesResponse] = await Promise.all([
      axios.get(`${LLAMA_API_BASE_URL}/protocol/${protocol}`),
      axios.get(`${LLAMA_API_BASE_URL}/summary/fees/${protocol}`)
    ]);

    console.log('Protocol API response:', protocolResponse.status);
    console.log('Fees API response:', feesResponse.status);

    const protocolData = protocolResponse.data;
    const feesData = feesResponse.data;

    console.log('Protocol data:', protocolData.name);
    console.log('Fees data available:', !!feesData);

    // Get daily and weekly metrics from fees data
    const dailyFees = feesData.total24h || 0;
    const prevDailyFees = feesData.total48hto24h || 0;
    const weeklyFees = feesData.total7d || 0;

    console.log('Daily fees:', dailyFees);
    console.log('Previous daily fees:', prevDailyFees);
    console.log('Weekly fees:', weeklyFees);

    // Calculate growth rates based on fees
    const transactionGrowth24h = calculatePercentageChange(dailyFees, prevDailyFees);
    const transactionGrowth7d = calculatePercentageChange(weeklyFees / 7, prevDailyFees);

    // Calculate active wallets from fees data
    const activeWallets = feesData.uniqueAddresses24h || Math.floor(dailyFees / 100); // fallback estimation
    const prevActiveWallets = feesData.uniqueAddresses48hto24h || Math.floor(prevDailyFees / 100);
    const activeWalletsGrowth24h = calculatePercentageChange(activeWallets, prevActiveWallets);

    // Estimate transactions and average value from fees
    const transactions24h = feesData.transactions24h || Math.floor(dailyFees / 10);
    const averageTransactionValue = transactions24h > 0 ? dailyFees / transactions24h : 0;

    const result = {
      profile: {
        name: protocolData.name,
        description: protocolData.description,
        logo: protocolData.logo,
        website: protocolData.url
      },
      metrics: {
        totalTransactions: protocolData.totalFees || 0,
        transactionGrowth24h,
        transactionGrowth7d,
        activeWallets,
        activeWalletsGrowth24h,
        averageTransactionValue
      },
      recentActivity: {
        transactions24h,
        uniqueAddresses24h: activeWallets
      }
    };

    console.log('Returning onchain data:', result);
    return result;
  } catch (error) {
    console.error('Error fetching onchain metrics:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
    }
    throw error;
  }
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatPercentage = (num: number): string => {
  return num.toFixed(1) + '%';
}; 