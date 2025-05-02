import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Dialog, DialogTitle, DialogContent, IconButton, Alert, Box, Divider, Button } from '@mui/material';
import { Close as CloseIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { fetchAllSocialMediaData } from '../../services/socialMediaApi';
import { Company, SocialMediaData, Post } from '../../types/index';
import OnchainMetrics from './platforms/OnchainMetrics';
import TwitterMetrics from './platforms/TwitterMetrics';

interface CompanyMetricsProps {
  company: Company;
}

export const CompanyMetrics: React.FC<CompanyMetricsProps> = ({ company }) => {
  const [socialMediaData, setSocialMediaData] = useState<{
    linkedIn: SocialMediaData | null;
    twitter: SocialMediaData | null;
    telegram: SocialMediaData | null;
    medium: SocialMediaData | null;
    onchain: SocialMediaData | null;
  }>({
    linkedIn: null,
    twitter: null,
    telegram: null,
    medium: null,
    onchain: null
  });
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platformErrors, setPlatformErrors] = useState<Record<string, string>>({});
  const [refreshingOnchain, setRefreshingOnchain] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setPlatformErrors({});

        // Fetch onchain data first
        let onchainData = null;
        if (company.identifiers.defillama) {
          try {
            const onchainResponse = await fetch(`/api/cache/${company.name}/onchain/${company.identifiers.defillama}`);
            const onchainResult = await onchainResponse.json();
            if (onchainResponse.ok && onchainResult.success) {
              onchainData = onchainResult.data;
            }
          } catch (error) {
            console.error('Error fetching onchain data:', error);
          }
        }

        // Fetch other social media data
        const data = await fetchAllSocialMediaData(
          {
            linkedIn: company.identifiers.linkedIn,
            twitter: company.identifiers.twitter,
            telegram: undefined,
            medium: company.identifiers.medium,
            onchain: company.onchainAddress
          },
          company.name
        );

        setSocialMediaData({
          ...data,
          onchain: onchainData || data.onchain
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch social media data';
        setError(errorMessage);
        console.error('Error fetching social media data:', err);
        
        if (err instanceof Error && err.message.includes('Failed to refresh')) {
          const platformMatch = err.message.match(/Failed to refresh (\w+) cache/);
          if (platformMatch && platformMatch[1]) {
            const platform = platformMatch[1].toLowerCase();
            setPlatformErrors(prev => ({
              ...prev,
              [platform]: err.message
            }));
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [company]);

  const handlePlatformClick = (platform: string) => {
    console.log(`Platform clicked: ${platform}`);
    setSelectedPlatform(platform);
  };

  const handleCloseDialog = () => {
    setSelectedPlatform(null);
  };

  const handleForceRefreshOnchain = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!company.identifiers.defillama) {
      console.error('No DeFi Llama identifier provided');
      return;
    }
    
    try {
      setRefreshingOnchain(true);
      
      // Call the refresh endpoint with force refresh
      const response = await fetch(`/api/cache/${company.name}/onchain/${company.identifiers.defillama}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force: true })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Failed to refresh Onchain data: ${data.details || data.error}`);
      }
      
      console.log('Received refreshed onchain data:', data);
      
      // Update the onchain data in state
      setSocialMediaData(prev => ({
        ...prev,
        onchain: data
      }));
      
    } catch (error) {
      console.error('Error refreshing Onchain data:', error);
      setPlatformErrors(prev => ({
        ...prev,
        onchain: error instanceof Error ? error.message : 'Failed to refresh Onchain data'
      }));
    } finally {
      setRefreshingOnchain(false);
    }
  };

  const renderPlatformCard = (platform: string, data: SocialMediaData | null) => {
    const platformLower = platform.toLowerCase();
    const platformError = platformErrors[platformLower];
    
    if (!data) {
      return (
        <Card 
          sx={{ 
            cursor: 'pointer', 
            '&:hover': { boxShadow: 6 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={() => handlePlatformClick(platform)}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">
                {platform}
              </Typography>
              {platformLower === 'onchain' && company.identifiers.defillama && (
                <Button
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={handleForceRefreshOnchain}
                  disabled={refreshingOnchain}
                  sx={{ minWidth: 'auto' }}
                >
                  {refreshingOnchain ? 'Refreshing...' : 'Force Refresh'}
                </Button>
              )}
            </Box>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : platformError ? (
              <Alert severity="error" sx={{ mt: 1 }}>
                {platformError}
              </Alert>
            ) : (
              <Typography color="textSecondary">No data available</Typography>
            )}
          </CardContent>
        </Card>
      );
    }

    const stats = data.followerStats;
    const profile = data.profile;

    // Special handling for onchain data
    if (platformLower === 'onchain') {
      return (
        <Card 
          sx={{ 
            cursor: 'pointer',
            '&:hover': { boxShadow: 6 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={() => handlePlatformClick(platform)}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">
                {platform}
              </Typography>
              {company.identifiers.defillama && (
                <Button
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={handleForceRefreshOnchain}
                  disabled={refreshingOnchain}
                  sx={{ minWidth: 'auto' }}
                >
                  {refreshingOnchain ? 'Refreshing...' : 'Force Refresh'}
                </Button>
              )}
            </Box>
            <Typography variant="body1">
              Total Daily Fees: ${data.totalDailyFees?.toLocaleString() || data.total24h?.toLocaleString() || 'N/A'}
            </Typography>
            <Typography variant="body1">
              Weekly Fees: ${data.weeklyFees?.toLocaleString() || data.total7d?.toLocaleString() || 'N/A'}
            </Typography>
            <Typography variant="body1">
              All Time Revenue: ${data.totalAllTime?.toLocaleString() || 'N/A'}
            </Typography>
            <Typography variant="body1">
              24h Change: {data.change_1d ? `${data.change_1d.toFixed(2)}%` : 'N/A'}
            </Typography>
            <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(0,0,0,0.12)' }}>
              <Typography variant="caption" color="textSecondary">
                Data Source: {data._source === 'cache' ? 'Cache' : 'API'}
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block">
                Last Updated: {data._lastUpdated ? new Date(data._lastUpdated).toLocaleString() : 'N/A'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card 
        sx={{ 
          cursor: 'pointer',
          '&:hover': { boxShadow: 6 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={() => handlePlatformClick(platform)}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">
              {platform}
            </Typography>
          </Box>
          <Typography variant="body1">
            Followers: {stats?.totalFollowers?.toLocaleString() || stats?.current?.toLocaleString() || 'N/A'}
          </Typography>
          <Typography variant="body1">
            Posts: {profile?.postCount?.toLocaleString() || profile?.postsCount?.toLocaleString() || 'N/A'}
          </Typography>
          <Typography variant="body1">
            Engagement Rate: {data.contentAnalysis?.metrics?.avgEngagementRate ? 
              (data.contentAnalysis.metrics.avgEngagementRate * 100).toFixed(2) + '%' : 'N/A'}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const renderPlatformDetails = (platform: string, data: SocialMediaData | null) => {
    if (!data) return null;

    // Special handling for onchain data
    if (platform.toLowerCase() === 'onchain') {
      return (
        <Dialog
          open={!!selectedPlatform}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {platform} Metrics
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <OnchainMetrics 
              companyName={company.name}
              companyId={company.id} 
              identifiers={{ defillama: company.identifiers.defillama }}
              timeRange="7d"
              chartType="line"
              color="#3f51b5"
              onTimeRangeChange={() => {}}
              onChartTypeChange={() => {}}
            />
          </DialogContent>
        </Dialog>
      );
    }

    // Special handling for Twitter data
    if (platform.toLowerCase() === 'twitter') {
      return (
        <Dialog
          open={!!selectedPlatform}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {platform} Metrics
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TwitterMetrics 
              companyName={company.name}
              identifier={company.identifiers.twitter || ''}
              color="#1DA1F2"
            />
          </DialogContent>
        </Dialog>
      );
    }

    const { profile, followerStats, contentAnalysis, posts } = data;

    return (
      <Dialog
        open={!!selectedPlatform}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {platform} Metrics
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Profile Information</Typography>
              <Box sx={{ mt: 1 }}>
                <Typography><strong>Name:</strong> {profile?.displayName || profile?.name || 'N/A'}</Typography>
                <Typography><strong>Username:</strong> {profile?.username || profile?.handle || 'N/A'}</Typography>
                <Typography><strong>Bio:</strong> {profile?.bio || 'N/A'}</Typography>
                <Typography><strong>Location:</strong> {profile?.location || 'N/A'}</Typography>
                <Typography><strong>Website:</strong> {profile?.url || profile?.website || 'N/A'}</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Follower Statistics</Typography>
              <Box sx={{ mt: 1 }}>
                <Typography><strong>Total Followers:</strong> {followerStats?.totalFollowers?.toLocaleString() || followerStats?.current?.toLocaleString() || 'N/A'}</Typography>
                <Typography><strong>Followers Growth (1 week):</strong> {followerStats?.oneWeekChange?.percentage?.toFixed(2) || followerStats?.followersChange?.percentage?.toFixed(2) || 'N/A'}%</Typography>
                <Typography><strong>Engagement Rate:</strong> {contentAnalysis?.metrics?.avgEngagementRate ? 
                  (contentAnalysis.metrics.avgEngagementRate * 100).toFixed(2) + '%' : 'N/A'}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Content Analysis</Typography>
              <Box sx={{ mt: 1 }}>
                <Typography><strong>Average Engagement Rate:</strong> {contentAnalysis?.metrics?.avgEngagementRate ? 
                  (contentAnalysis.metrics.avgEngagementRate * 100).toFixed(2) + '%' : 'N/A'}</Typography>
                <Typography><strong>Total Likes:</strong> {contentAnalysis?.metrics?.totalLikes?.toLocaleString() || 'N/A'}</Typography>
                <Typography><strong>Total Retweets:</strong> {contentAnalysis?.metrics?.totalRetweets?.toLocaleString() || 'N/A'}</Typography>
                <Typography><strong>Recent Posts:</strong> {contentAnalysis?.metrics?.recentTweetsCount?.toLocaleString() || 'N/A'}</Typography>
              </Box>
            </Grid>

            {posts && posts.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Recent Posts</Typography>
                <Box sx={{ mt: 1 }}>
                  {posts.slice(0, 3).map((post: Post, index: number) => (
                    <Box key={post.id || index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                      <Typography variant="body2" color="textSecondary">{new Date(post.date).toLocaleDateString()}</Typography>
                      <Typography variant="body1" sx={{ my: 1 }}>{post.text}</Typography>
                      <Typography variant="body2">
                        <strong>Likes:</strong> {post.likes?.toLocaleString() || 'N/A'} | 
                        <strong> Comments:</strong> {post.comments?.toLocaleString() || 'N/A'} | 
                        <strong> Shares:</strong> {post.shares?.toLocaleString() || 'N/A'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div>
      {error && !Object.keys(platformErrors).length && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          {renderPlatformCard('LinkedIn', socialMediaData.linkedIn)}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderPlatformCard('Twitter', socialMediaData.twitter)}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderPlatformCard('Telegram', socialMediaData.telegram)}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderPlatformCard('Medium', socialMediaData.medium)}
        </Grid>
        {company.onchainAddress && (
          <Grid item xs={12} sm={6} md={3}>
            {renderPlatformCard('Onchain', socialMediaData.onchain)}
          </Grid>
        )}
      </Grid>

      {selectedPlatform && (
        renderPlatformDetails(
          selectedPlatform,
          socialMediaData[selectedPlatform.toLowerCase() as keyof typeof socialMediaData]
        )
      )}
    </div>
  );
}; 