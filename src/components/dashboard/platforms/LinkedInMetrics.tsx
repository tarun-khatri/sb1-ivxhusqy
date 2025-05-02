import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { Users, MessageCircle, ThumbsUp, Share2 } from 'lucide-react';
import { formatNumber } from '../../../services';
import { LinkedInData } from '../../../types/index';

interface LinkedInMetricsProps {
  data: LinkedInData;
  color: string;
}

export const LinkedInMetrics: React.FC<LinkedInMetricsProps> = ({ data, color }) => {
  if (!data?.companyProfile?.data || !data?.posts?.data) {
    console.log('No LinkedIn data available:', data);
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No LinkedIn metrics available
        </Typography>
      </Box>
    );
  }

  console.log('Rendering LinkedIn metrics with data:', data);

  const companyData = data.companyProfile.data;
  const posts = data.posts.data.posts || [];

  // Calculate total engagement metrics from posts
  const totalReactions = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
  const totalReposts = posts.reduce((sum, post) => sum + (post.reposts || 0), 0);
  const avgEngagement = posts.length > 0 ? totalReactions / posts.length : 0;

  return (
    <>
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
              {formatNumber(companyData.followers || 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {companyData.employeeCount || 'N/A'} employees
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
              <ThumbsUp size={20} color={color} style={{ marginRight: 8 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Total Reactions
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: color }}>
              {formatNumber(totalReactions)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatNumber(avgEngagement)} avg. per post
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
                Comments
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: color }}>
              {formatNumber(totalComments)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Across all posts
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
              <Share2 size={20} color={color} style={{ marginRight: 8 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Reposts
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: color }}>
              {formatNumber(totalReposts)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total shares
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Company Info Section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
        Company Info
      </Typography>
      <Box sx={{ 
        p: 3, 
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        mb: 4
      }}>
        <Typography variant="h5" gutterBottom>
          {companyData.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {companyData.description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Industry: {companyData.industry || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Website: {companyData.website || 'N/A'}
          </Typography>
        </Box>
      </Box>

      {/* Recent Posts Section */}
      {posts.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Recent Posts
          </Typography>
          <Grid container spacing={3}>
            {posts.slice(0, 5).map((post, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ 
                  p: 3, 
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {post.text || 'No content available'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {post.likes || 0} likes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.comments || 0} comments
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.reposts || 0} reposts
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  );
}; 