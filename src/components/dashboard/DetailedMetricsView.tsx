import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Divider,
  Avatar,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  X,
  Twitter,
  Linkedin,
  BookOpen,
  BarChart,
  ArrowLeft,
  Users,
  DollarSign,
  Activity,
} from 'lucide-react';
import { Company } from '../../types';
import { 
  fetchOnchainMetrics,
  fetchTwitterMetrics,
  fetchLinkedInMetrics,
  fetchMediumMetrics,
  formatNumber,
  formatPercentage,
  fetchDefiLlamaData
} from '../../services';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DetailedMetricsViewProps {
  selectedCompany: Company | null;
}

interface PlatformCardProps {
  title: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
  metrics?: any;
  loading?: boolean;
}

interface PlatformDetailDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon: React.ElementType;
  color: string;
  data: any;
  loading: boolean;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ 
  title, 
  icon: Icon, 
  color, 
  onClick, 
  metrics, 
  loading 
}) => {
  const getMetricValue = () => {
    if (!metrics) return 0;
    
    switch (title) {
      case 'Twitter':
        return metrics.profile?.followers || 0;
      case 'LinkedIn':
        return metrics.followers || 0;
      case 'Medium':
        return metrics.followers || 0;
      case 'Onchain':
        return metrics.activeWallets || 0;
      default:
        return 0;
    }
  };

  const getMetricLabel = () => {
    switch (title) {
      case 'Onchain':
        return 'Active Wallets';
      case 'Twitter':
        return 'Followers';
      case 'LinkedIn':
        return 'Followers';
      case 'Medium':
        return 'Followers';
      default:
        return 'Followers';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 3,
        },
        borderLeft: `4px solid ${color}`,
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon size={24} color={color} />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : metrics ? (
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {formatNumber(getMetricValue())}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getMetricLabel()}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Click to view metrics
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export const PlatformDetailDialog: React.FC<PlatformDetailDialogProps> = ({ 
  open, 
  onClose, 
  title, 
  icon: Icon, 
  color, 
  data, 
  loading 
}) => {
  const [defiLlamaData, setDefiLlamaData] = useState<any>(null);
  const [defiLlamaLoading, setDefiLlamaLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  useEffect(() => {
    if (open && title === 'Onchain' && data?.profile?.name) {
      setDefiLlamaLoading(true);
      fetchDefiLlamaData(data.profile.name)
        .then(result => {
          setDefiLlamaData(result);
          if (result?.totalDataChart) {
            // Process chart data
            const processedData = result.totalDataChart
              .filter((item: any) => item[1] > 0) // Filter out zero values
              .map((item: any) => ({
                date: new Date(item[0] * 1000),
                value: item[1]
              }));
            setChartData(processedData);
          }
        })
        .finally(() => setDefiLlamaLoading(false));
    }
  }, [open, title, data?.profile?.name]);

  const filterChartData = (range: '7d' | '30d' | '90d') => {
    if (!defiLlamaData?.totalDataChart) return [];
    
    const now = new Date();
    let daysAgo = 7;
    
    if (range === '30d') daysAgo = 30;
    if (range === '90d') daysAgo = 90;
    
    const cutoffDate = new Date(now);
    cutoffDate.setDate(now.getDate() - daysAgo);
    
    return defiLlamaData.totalDataChart
      .filter((item: any) => {
        const itemDate = new Date(item[0] * 1000);
        return itemDate >= cutoffDate && item[1] > 0;
      })
      .map((item: any) => ({
        date: new Date(item[0] * 1000),
        value: item[1]
      }));
  };

  useEffect(() => {
    if (defiLlamaData?.totalDataChart) {
      setChartData(filterChartData(timeRange));
    }
  }, [timeRange, defiLlamaData]);

  const handleTimeRangeChange = (event: React.MouseEvent<HTMLElement>, newTimeRange: '7d' | '30d' | '90d' | null) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const handleChartTypeChange = (event: React.MouseEvent<HTMLElement>, newChartType: 'line' | 'bar' | null) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const prepareChartData = () => {
    const labels = chartData.map(item => 
      item.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    );
    
    const values = chartData.map(item => item.value);
    
    return {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: values,
          borderColor: color,
          backgroundColor: chartType === 'bar' ? color : 'rgba(63, 81, 181, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          tension: 0.3,
          fill: chartType === 'line',
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `$${formatNumber(context.raw)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return `$${formatNumber(value)}`;
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  if (!data) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon sx={{ color }} />
            <Typography variant="h6">{title} Metrics</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No data available for {title}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const renderGrowthChip = (value: number | undefined, label: string) => {
    if (value === undefined) return null;
    const isPositive = value >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'success' : 'error';
    
    return (
      <Chip
        icon={<Icon size={16} />}
        label={`${label}: ${formatPercentage(value)}`}
        color={color}
        size="small"
        sx={{ mr: 1, mb: 1 }}
      />
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon sx={{ color }} />
          <Typography variant="h6">{title} Metrics</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ overflow: 'auto', flex: 1 }}>
        {!loading ? (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                {data.profile?.displayName || title}
              </Typography>
              {data.profile?.bio && (
                <Typography variant="body1" color="text.secondary">
                  {data.profile.bio}
                </Typography>
              )}
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                {data.profile?.followers !== undefined && (
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(data.profile.followers)} followers
                  </Typography>
                )}
                {data.profile?.following !== undefined && (
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(data.profile.following)} following
                  </Typography>
                )}
                {data.profile?.postsCount !== undefined && (
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(data.profile.postsCount)} posts
                  </Typography>
                )}
              </Box>
            </Box>

            {title === 'Onchain' && data.metrics && (
              <>
                {/* Key Metrics Section */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
                  Key Metrics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <BarChart size={20} color={color} style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" fontWeight="medium">
                          Total Transactions
                        </Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: color }}>
                        {formatNumber(data.metrics.totalTransactions || 0)}
                      </Typography>
                      <Box sx={{ mt: 'auto' }}>
                        {renderGrowthChip(data.metrics.transactionGrowth24h, '24h')}
                        {renderGrowthChip(data.metrics.transactionGrowth7d, '7d')}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Users size={20} color={color} style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" fontWeight="medium">
                          Active Wallets
                        </Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: color }}>
                        {formatNumber(data.metrics.activeWallets || 0)}
                      </Typography>
                      <Box sx={{ mt: 'auto' }}>
                        {renderGrowthChip(data.metrics.activeWalletsGrowth24h, '24h')}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TrendingUp size={20} color={color} style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" fontWeight="medium">
                          Average Transaction Value
                        </Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: color }}>
                        ${formatNumber(data.metrics.averageTransactionValue || 0)}
                      </Typography>
                      <Box sx={{ mt: 'auto' }}>
                        <Typography variant="body2" color="text.secondary">
                          Based on {formatNumber(data.recentActivity?.transactions24h || 0)} transactions in 24h
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Recent Activity Section */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      height: '100%'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <BarChart size={20} color={color} style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" fontWeight="medium">
                          Transactions (24h)
                        </Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: color }}>
                        {formatNumber(data.recentActivity?.transactions24h || 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {formatPercentage(data.metrics.transactionGrowth24h)} change from previous day
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      height: '100%'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Users size={20} color={color} style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" fontWeight="medium">
                          Unique Addresses (24h)
                        </Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: color }}>
                        {formatNumber(data.recentActivity?.uniqueAddresses24h || 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {formatPercentage(data.metrics.activeWalletsGrowth24h)} change from previous day
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Revenue Chart Section */}
                {defiLlamaData && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                      Revenue Data
                    </Typography>
                    
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: color }}>
                            ${formatNumber(defiLlamaData.total24h || 0)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            24h Revenue
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <ToggleButtonGroup
                            value={timeRange}
                            exclusive
                            onChange={handleTimeRangeChange}
                            size="small"
                            aria-label="time range"
                          >
                            <ToggleButton value="7d" aria-label="7 days">
                              7D
                            </ToggleButton>
                            <ToggleButton value="30d" aria-label="30 days">
                              30D
                            </ToggleButton>
                            <ToggleButton value="90d" aria-label="90 days">
                              90D
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Box>
                      </Box>
                      
                      {defiLlamaLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : chartData.length > 0 ? (
                        <Box sx={{ height: 300, position: 'relative' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <ToggleButtonGroup
                              value={chartType}
                              exclusive
                              onChange={handleChartTypeChange}
                              size="small"
                              aria-label="chart type"
                            >
                              <ToggleButton value="line" aria-label="line chart">
                                Line
                              </ToggleButton>
                              <ToggleButton value="bar" aria-label="bar chart">
                                Bar
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </Box>
                          
                          {chartType === 'line' ? (
                            <Line data={prepareChartData()} options={chartOptions} />
                          ) : (
                            <Bar data={prepareChartData()} options={chartOptions} />
                          )}
                        </Box>
                      ) : (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                          <Typography variant="body1" color="text.secondary">
                            No revenue data available
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            7D Revenue
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            ${formatNumber(defiLlamaData.total7d || 0)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            All Time Revenue
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            ${formatNumber(defiLlamaData.totalAllTime || 0)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            24h Change
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {defiLlamaData.change_1d >= 0 ? (
                              <TrendingUp size={16} color="#4caf50" style={{ marginRight: 4 }} />
                            ) : (
                              <TrendingDown size={16} color="#f44336" style={{ marginRight: 4 }} />
                            )}
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: defiLlamaData.change_1d >= 0 ? '#4caf50' : '#f44336'
                              }}
                            >
                              {formatPercentage(defiLlamaData.change_1d)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                )}
              </>
            )}
            
            {title === 'Twitter' && data && (
              <Grid container spacing={3}>
                {/* Profile Header */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    position: 'relative', 
                    mb: 3, 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}>
                    {data.profile.profileImage && (
                      <Box 
                        component="img" 
                        src={data.profile.profileImage} 
                        alt="Profile Banner"
                        sx={{ 
                          width: '100%', 
                          height: 200, 
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: -40, 
                      left: 20, 
                      display: 'flex', 
                      alignItems: 'flex-end'
                    }}>
                      <Avatar
                        src={data.profile.profileImage}
                        alt={data.profile.displayName}
                        sx={{ 
                          width: 100, 
                          height: 100, 
                          border: '4px solid white',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 5, pl: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      {data.profile.displayName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">@{data.profile.username}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{data.profile.bio}</Typography>
                  </Box>
                </Grid>

                {/* Key Metrics */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(29,161,242,0.05)' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Followers
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1DA1F2' }}>
                      {formatNumber(data.profile.followers || 0)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(29,161,242,0.05)' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Following
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1DA1F2' }}>
                      {formatNumber(data.profile.following || 0)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(29,161,242,0.05)' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Total Tweets
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1DA1F2' }}>
                      {formatNumber(data.profile.postsCount || 0)}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Engagement Metrics */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(29,161,242,0.05)' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Engagement Metrics</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Engagement Rate</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1DA1F2' }}>
                          {formatPercentage(data.contentAnalysis.metrics.engagementRate || 0)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Replies (24h)</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1DA1F2' }}>
                          {formatNumber(data.contentAnalysis.metrics.replies24h || 0)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Replies (7d)</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1DA1F2' }}>
                          {formatNumber(data.contentAnalysis.metrics.replies7d || 0)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Total Likes</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1DA1F2' }}>
                          {formatNumber(data.contentAnalysis.metrics.totalLikes || 0)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Total Retweets</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1DA1F2' }}>
                          {formatNumber(data.contentAnalysis.metrics.totalRetweets || 0)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Total Replies</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1DA1F2' }}>
                          {formatNumber(data.contentAnalysis.metrics.totalReplies || 0)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Profile Details */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(29,161,242,0.05)' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Profile Details</Typography>
                    <Grid container spacing={2}>
                      {data.profile.location && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                          <Typography variant="body1">{data.profile.location}</Typography>
                        </Grid>
                      )}
                      {data.profile.url && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary">Website</Typography>
                          <Typography 
                            variant="body1" 
                            component="a" 
                            href={data.profile.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ color: '#1DA1F2', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                          >
                            {data.profile.url}
                          </Typography>
                        </Grid>
                      )}
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Account Created</Typography>
                        <Typography variant="body1">
                          {data.profile.joinedDate ? new Date(data.profile.joinedDate).toLocaleDateString() : 'Not available'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}
            
            {title === 'LinkedIn' && data.metrics && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Followers
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(data.metrics.followers || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Employees
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(data.metrics.employees || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Posts
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(data.metrics.posts || 0)}
                  </Typography>
                </Grid>
                {data.metrics.engagementRate !== undefined && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Engagement Rate
                    </Typography>
                    <Typography variant="h4">
                      {formatPercentage(data.metrics.engagementRate)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
            
            {title === 'Medium' && data.metrics && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Followers
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(data.metrics.followers || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Stories
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(data.metrics.stories || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Claps
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(data.metrics.claps || 0)}
                  </Typography>
                </Grid>
                {data.metrics.engagementRate !== undefined && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Engagement Rate
                    </Typography>
                    <Typography variant="h4">
                      {formatPercentage(data.metrics.engagementRate)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const DetailedMetricsView: React.FC<DetailedMetricsViewProps> = ({ selectedCompany }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<Record<string, boolean>>({
    onchain: false,
    twitter: false,
    linkedin: false,
    medium: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [onchainData, setOnchainData] = useState<any>(null);
  const [twitterData, setTwitterData] = useState<any>(null);
  const [linkedinData, setLinkedinData] = useState<any>(null);
  const [mediumData, setMediumData] = useState<any>(null);
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCompany) return;
      
      setError(null);
      
      try {
        setLoading({
          onchain: true,
          twitter: true,
          linkedin: true,
          medium: true,
        });
        
        console.log('Selected company:', selectedCompany);
        
        const [onchain, twitter, linkedin, medium] = await Promise.all([
          fetchOnchainMetrics(selectedCompany.name.toLowerCase()),
          selectedCompany.identifiers?.twitter ? fetchTwitterMetrics(selectedCompany.identifiers.twitter) : Promise.resolve(null),
          selectedCompany.identifiers?.linkedin ? fetchLinkedInMetrics(selectedCompany.identifiers.linkedin) : Promise.resolve(null),
          selectedCompany.identifiers?.medium ? fetchMediumMetrics(selectedCompany.identifiers.medium) : Promise.resolve(null),
        ]);
        
        console.log('Onchain data:', onchain);
        
        // Ensure totalTransactions is properly set
        if (onchain && onchain.metrics) {
          onchain.metrics.totalTransactions = onchain.metrics.totalTransactions || 0;
        }
        
        setOnchainData(onchain);
        setTwitterData(twitter);
        setLinkedinData(linkedin);
        setMediumData(medium);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to fetch metrics data. Please try again later.');
      } finally {
        setLoading({
          onchain: false,
          twitter: false,
          linkedin: false,
          medium: false,
        });
      }
    };

    fetchData();
  }, [selectedCompany]);

  const handleOpenDialog = (platform: string) => {
    setOpenDialog(platform);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  if (!selectedCompany) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          No company selected
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowLeft />}
          onClick={handleBackToDashboard}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowLeft />}
          onClick={handleBackToDashboard}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowLeft />}
          onClick={handleBackToDashboard}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">
          {selectedCompany.name} - Metrics
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Onchain Metrics Card */}
        <Grid item xs={12} sm={6} md={3}>
          <PlatformCard
            title="Onchain"
            icon={BarChart}
            color="#3f51b5"
            onClick={() => handleOpenDialog('onchain')}
            metrics={onchainData?.metrics}
            loading={loading.onchain}
          />
        </Grid>
        
        {/* Twitter Metrics Card */}
        <Grid item xs={12} sm={6} md={3}>
          <PlatformCard
            title="Twitter"
            icon={Twitter}
            color="#1DA1F2"
            onClick={() => handleOpenDialog('twitter')}
            metrics={twitterData}
            loading={loading.twitter}
          />
        </Grid>
        
        {/* LinkedIn Metrics Card */}
        <Grid item xs={12} sm={6} md={3}>
          <PlatformCard
            title="LinkedIn"
            icon={Linkedin}
            color="#0077B5"
            onClick={() => handleOpenDialog('linkedin')}
            metrics={linkedinData?.metrics}
            loading={loading.linkedin}
          />
        </Grid>
        
        {/* Medium Metrics Card */}
        <Grid item xs={12} sm={6} md={3}>
          <PlatformCard
            title="Medium"
            icon={BookOpen}
            color="#000000"
            onClick={() => handleOpenDialog('medium')}
            metrics={mediumData?.metrics}
            loading={loading.medium}
          />
        </Grid>
      </Grid>
      
      {/* Dialogs for each platform */}
      <PlatformDetailDialog
        open={openDialog === 'onchain'}
        onClose={handleCloseDialog}
        title="Onchain"
        icon={BarChart}
        color="#3f51b5"
        data={onchainData}
        loading={loading.onchain}
      />
      
      <PlatformDetailDialog
        open={openDialog === 'twitter'}
        onClose={handleCloseDialog}
        title="Twitter"
        icon={Twitter}
        color="#1DA1F2"
        data={twitterData}
        loading={loading.twitter}
      />
      
      <PlatformDetailDialog
        open={openDialog === 'linkedin'}
        onClose={handleCloseDialog}
        title="LinkedIn"
        icon={Linkedin}
        color="#0077B5"
        data={linkedinData}
        loading={loading.linkedin}
      />
      
      <PlatformDetailDialog
        open={openDialog === 'medium'}
        onClose={handleCloseDialog}
        title="Medium"
        icon={BookOpen}
        color="#000000"
        data={mediumData}
        loading={loading.medium}
      />
    </Box>
  );
};

export default DetailedMetricsView; 