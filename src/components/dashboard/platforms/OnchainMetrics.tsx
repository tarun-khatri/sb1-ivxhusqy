import React from 'react';
import { Grid, Typography, Box, Paper, ToggleButtonGroup, ToggleButton, CircularProgress } from '@mui/material';
import { BarChart, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber, formatPercentage } from '../../../services';
import { Line, Bar } from 'react-chartjs-2';
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

// Register Chart.js components
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

interface OnchainMetricsProps {
  data: any;
  defiLlamaData: any;
  defiLlamaLoading: boolean;
  chartData: any[];
  timeRange: '7d' | '30d' | '90d';
  chartType: 'line' | 'bar';
  color: string;
  onTimeRangeChange: (event: React.MouseEvent<HTMLElement>, newTimeRange: '7d' | '30d' | '90d' | null) => void;
  onChartTypeChange: (event: React.MouseEvent<HTMLElement>, newChartType: 'line' | 'bar' | null) => void;
}

export const OnchainMetrics: React.FC<OnchainMetricsProps> = ({ 
  data, 
  defiLlamaData,
  defiLlamaLoading,
  chartData,
  timeRange,
  chartType,
  color,
  onTimeRangeChange,
  onChartTypeChange
}) => {
  console.log('OnchainMetrics rendered with data:', data);
  
  if (!data || !data.metrics) {
    console.log('No data or metrics available for OnchainMetrics');
    return null;
  }

  const renderGrowthChip = (value: number | undefined, label: string) => {
    if (value === undefined) return null;
    const isPositive = value >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const chipColor = isPositive ? 'success' : 'error';
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Icon size={16} color={isPositive ? '#4caf50' : '#f44336'} style={{ marginRight: 4 }} />
        <Typography 
          variant="body2" 
          sx={{ 
            color: isPositive ? '#4caf50' : '#f44336',
            fontWeight: 'medium'
          }}
        >
          {label}: {formatPercentage(value)}
        </Typography>
      </Box>
    );
  };

  const prepareChartData = () => {
    if (!chartData || chartData.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
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
        type: 'category' as const,
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
        type: 'linear' as const,
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

  return (
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
              ${Number(data.metrics.averageTransactionValue || 0).toFixed(2)}
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
                  onChange={onTimeRangeChange}
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
              <Box sx={{ height: 300, position: 'relative', mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <ToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={onChartTypeChange}
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
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    7D Revenue
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    ${formatNumber(defiLlamaData.total7d || 0)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    All Time Revenue
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    ${formatNumber(defiLlamaData.totalAllTime || 0)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
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
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </>
  );
}; 