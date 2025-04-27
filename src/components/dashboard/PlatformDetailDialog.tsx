import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber, formatPercentage, fetchDefiLlamaData } from '../../services';
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
import { TwitterMetrics } from './platforms/TwitterMetrics';
import { GitHubMetrics } from './platforms/GitHubMetrics';
import { LinkedInMetrics } from './platforms/LinkedInMetrics';
import { MediumMetrics } from './platforms/MediumMetrics';
import { OnchainMetrics } from './platforms/OnchainMetrics';

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

export interface PlatformDetailDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon: React.ElementType;
  color: string;
  data: any;
  loading: boolean;
}

export const PlatformDetailDialog: React.FC<PlatformDetailDialogProps> = ({ 
  open, 
  onClose, 
  title, 
  icon: Icon, 
  color, 
  data, 
  loading 
}) => {
  console.log('PlatformDetailDialog rendered with:', {
    open,
    title,
    data,
    loading
  });

  const [defiLlamaData, setDefiLlamaData] = useState<any>(null);
  const [defiLlamaLoading, setDefiLlamaLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  // Reset state when dialog opens with a new title
  useEffect(() => {
    if (open) {
      console.log(`Dialog opened for ${title} with data:`, data);
    }
  }, [open, title, data]);
  
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

  const renderPlatformContent = () => {
    console.log('Rendering platform content for:', title);
    console.log('Platform data:', data);

    if (!data) {
      console.log('No data available for platform');
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No data available for {title}
          </Typography>
        </Box>
      );
    }

    switch (title) {
      case 'Twitter':
        return <TwitterMetrics data={data} color={color} />;
      case 'GitHub':
        return <GitHubMetrics data={data} color={color} />;
      case 'LinkedIn':
        return <LinkedInMetrics data={data} color={color} />;
      case 'Medium':
        return <MediumMetrics data={data} color={color} />;
      case 'Onchain':
        console.log('Rendering OnchainMetrics with data:', data);
        return (
          <OnchainMetrics
            data={data}
            defiLlamaData={defiLlamaData}
            defiLlamaLoading={defiLlamaLoading}
            chartData={chartData}
            timeRange={timeRange}
            chartType={chartType}
            color={color}
            onTimeRangeChange={(event, newTimeRange) => {
              if (newTimeRange !== null) setTimeRange(newTimeRange);
            }}
            onChartTypeChange={(event, newChartType) => {
              if (newChartType !== null) setChartType(newChartType);
            }}
          />
        );
      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No metrics available for {title}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center',
        borderBottom: `1px solid ${color}20`,
        pb: 2
      }}>
        <Icon size={24} color={color} style={{ marginRight: 12 }} />
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {title} Metrics
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          renderPlatformContent()
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 