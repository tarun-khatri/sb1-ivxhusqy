import React from 'react';
import { Grid, Typography, Box, Paper, Avatar, Chip } from '@mui/material';
import { Users, MessageCircle, Heart, Repeat, Calendar, Globe, Link, CheckCircle } from 'lucide-react';
import { formatNumber } from '../../../services';

interface TwitterMetricsProps {
  data: any;
  color: string;
}

export const TwitterMetrics: React.FC<TwitterMetricsProps> = ({ data, color }) => {
  if (!data || !data.profile) return null;

  // Safely get values with fallbacks to prevent undefined errors
  const followers = data.profile.followers || 0;
  const following = data.profile.following || 0;
  const postsCount = data.profile.postsCount || 0;
  const favorites = data.profile.favorites || 0;
  const listed = data.profile.listed || 0;
  const replies24h = data.contentAnalysis?.metrics?.replies24h || 0;
  const likes = data.contentAnalysis?.metrics?.likes || 0;
  const retweets = data.contentAnalysis?.metrics?.retweets || 0;
  const engagementRate = data.contentAnalysis?.metrics?.engagementRate || 0;
  const totalEngagements = data.contentAnalysis?.metrics?.totalEngagements || 0;
  const averageEngagement = data.contentAnalysis?.metrics?.averageEngagement || 0;

  return (
    <>
      {/* Profile Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={data.profile.profileImage}
          alt={data.profile.displayName || ''}
          sx={{ width: 64, height: 64, mr: 2 }}
        />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {data.profile.displayName || 'Unknown'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            @{data.profile.username || 'unknown'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {data.profile.bio || ''}
          </Typography>
        </Box>
      </Box>

      {/* Key Metrics Section */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        Key Metrics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
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
                Followers
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: color }}>
              {formatNumber(followers)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatNumber(following)} following
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
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
              <MessageCircle size={20} color={color} style={{ marginRight: 8 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Total Tweets
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: color }}>
              {formatNumber(postsCount)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatNumber(replies24h)} replies (24h)
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
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
              <Heart size={20} color={color} style={{ marginRight: 8 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Favorites
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: color }}>
              {formatNumber(favorites)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatNumber(likes)} likes
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
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
              <Repeat size={20} color={color} style={{ marginRight: 8 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Listed
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: color }}>
              {formatNumber(listed)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatNumber(retweets)} retweets
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Engagement Metrics Section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
        Engagement Metrics
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
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Engagement Rate
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: color }}>
              {(engagementRate * 100).toFixed(2)}%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Based on {formatNumber(totalEngagements)} total engagements
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
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Average Engagement
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: color }}>
              {formatNumber(averageEngagement)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Per post
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Profile Details Section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
        Profile Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Calendar size={20} color={color} style={{ marginRight: 8 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Joined
              </Typography>
            </Box>
            <Typography variant="body1">
              {data.profile.joinedDate ? new Date(data.profile.joinedDate).toLocaleDateString() : 'Not available'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Globe size={20} color={color} style={{ marginRight: 8 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Location
              </Typography>
            </Box>
            <Typography variant="body1">
              {data.profile.location || 'Not specified'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Link size={20} color={color} style={{ marginRight: 8 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Website
              </Typography>
            </Box>
            <Typography variant="body1">
              {data.profile.url || 'Not specified'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle size={20} color={color} style={{ marginRight: 8 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Verification Status
              </Typography>
            </Box>
            <Chip
              label={data.profile.verified ? 'Verified' : 'Not Verified'}
              color={data.profile.verified ? 'success' : 'default'}
              size="small"
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}; 