import React, { useEffect, useState } from 'react';
import { TwitterData } from '../../../types/index';
import { fetchTwitterMetrics } from '../../../services/twitterApi';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, IconButton, Button, Divider } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { Sparkles } from 'lucide-react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

interface TwitterMetricsProps {
  companyName: string;
  identifier: string;
  color: string;
}

const TwitterMetrics: React.FC<TwitterMetricsProps> = ({ companyName, identifier, color }) => {
  const [data, setData] = useState<TwitterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const loadData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const twitterData = await fetchTwitterMetrics(companyName, identifier);
      if (!twitterData) {
        throw new Error('Failed to fetch Twitter data');
      }
      
      setData(twitterData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load Twitter metrics';
      setError(errorMessage);
      console.error('Error loading Twitter data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyName, identifier]);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setRefreshing(true);
    await loadData(true);
    setRefreshing(false);
  };

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button 
          onClick={() => loadData(true)}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No Twitter data available</Typography>
      </Box>
    );
  }

  const { profile, followerStats, contentAnalysis } = data;

  const renderTrend = (value: number) => {
    if (value > 0) return <TrendingUp color="success" />;
    if (value < 0) return <TrendingDown color="error" />;
    return <TrendingFlat color="action" />;
  };

  const formatNumber = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    return value.toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        borderBottom: '2px solid',
        borderColor: `${color}20`,
        pb: 2
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700,
          background: `linear-gradient(45deg, ${color}, ${color}99)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Twitter Analytics
        </Typography>
        <IconButton 
          onClick={() => setSummaryOpen(true)}
          sx={{ 
            bgcolor: `${color}10`,
            '&:hover': { bgcolor: `${color}20` }
          }}
        >
          <Sparkles size={22} color={color} />
        </IconButton>
      </Box>
      <Dialog open={summaryOpen} onClose={() => setSummaryOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>AI Summary of Recent Tweets</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {data.summary ? data.summary : 'No summary available.'}
          </Typography>
        </DialogContent>
      </Dialog>

      <Grid container spacing={3}>
        {/* Profile Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {profile.data.name} (@{profile.data.username})
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {profile.data.description}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Followers</Typography>
                  <Typography variant="h6">
                    {profile?.data?.followers?.toLocaleString() || '0'}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Following</Typography>
                  <Typography variant="h6">
                    {profile?.data?.following?.toLocaleString() || '0'}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Tweets</Typography>
                  <Typography variant="h6">
                    {profile?.data?.tweets?.toLocaleString() || '0'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Follower Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Follower Growth
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">24h Change</Typography>
                  <Box display="flex" alignItems="center">
                    {renderTrend(followerStats?.oneDayChange?.percentage || 0)}
                    <Typography variant="h6" ml={1}>
                      {followerStats?.oneDayChange?.count?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {followerStats?.oneDayChange?.percentage ? 
                      `${followerStats.oneDayChange.percentage > 0 ? '+' : ''}${followerStats.oneDayChange.percentage.toFixed(2)}%` : 
                      'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">7d Change</Typography>
                  <Box display="flex" alignItems="center">
                    {renderTrend(followerStats?.oneWeekChange?.percentage || 0)}
                    <Typography variant="h6" ml={1}>
                      {followerStats?.oneWeekChange?.count?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {followerStats?.oneWeekChange?.percentage ? 
                      `${followerStats.oneWeekChange.percentage > 0 ? '+' : ''}${followerStats.oneWeekChange.percentage.toFixed(2)}%` : 
                      'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Engagement Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Engagement Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2">Overall Engagement Rate</Typography>
                  <Typography variant="h6">
                    {contentAnalysis?.engagementRate?.toFixed(2) || '0.00'}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Based on last {contentAnalysis?.metrics?.recentTweetsCount || 0} tweets
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2">Per Post Engagement</Typography>
                  <Typography variant="h6">
                    {contentAnalysis?.metrics?.avgEngagementRate?.toFixed(2) || '0.00'}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Average per individual post
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2">Daily Engagement Rate</Typography>
                  <Typography variant="h6">
                    {contentAnalysis?.metrics?.replies24h ? 
                      ((contentAnalysis.metrics.replies24h / profile.data.followers) * 100).toFixed(2) : 
                      '0.00'}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last 24 hours
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Total Likes</Typography>
                  <Typography variant="h6">
                    {contentAnalysis?.metrics?.totalLikes?.toLocaleString() || '0'}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Total Retweets</Typography>
                  <Typography variant="h6">
                    {contentAnalysis?.metrics?.totalRetweets?.toLocaleString() || '0'}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Total Replies</Typography>
                  <Typography variant="h6">
                    {formatNumber(contentAnalysis.metrics.totalReplies)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Total Favorites</Typography>
                  <Typography variant="h6">
                    {formatNumber(contentAnalysis.metrics.totalFavorites)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Tweet Frequency (7d)</Typography>
                  <Typography variant="h6">
                    {contentAnalysis?.metrics?.tweetFrequency7d?.toLocaleString() || '0'}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Reply Frequency (7d)</Typography>
                  <Typography variant="h6">
                    {contentAnalysis?.metrics?.replyFrequency7d?.toLocaleString() || '0'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Source and Last Updated */}
        {data && (
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 2,
              px: 2,
              py: 1,
              bgcolor: 'background.paper',
              borderRadius: 1
            }}>
              <Typography variant="body2" color="text.secondary">
                Data Source: {data._source === 'cache' ? 'Cache' : 'API'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Updated: {new Date(data._lastUpdated || '').toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TwitterMetrics; 