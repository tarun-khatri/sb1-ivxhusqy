import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Alert, Paper, Button } from '@mui/material';
import { getAccountData } from '../mock/data';
import { TwitterAccountData } from '../types';
import ProfileCard from '../components/dashboard/ProfileCard';
import FollowerStats from '../components/dashboard/FollowerStats';
import TweetAnalysisCard from '../components/dashboard/TweetAnalysisCard';
import CryptoCard from '../components/dashboard/CryptoCard';

interface DashboardProps {
  username: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ username }) => {
  const [accountData, setAccountData] = useState<TwitterAccountData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    setLoading(true);
    setError(null);

    // Simulate API call with setTimeout
    setTimeout(() => {
      const data = getAccountData(username);
      
      if (data) {
        setAccountData(data);
        setLoading(false);
      } else {
        setError(`Account @${username} not found. Try searching for another account.`);
        setLoading(false);
      }
    }, 1000);
  }, [username]);

  if (!username) {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 64px - 48px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Twitter Competitor Analysis Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mb: 3 }}>
          Enter a Twitter username in the search bar above to analyze their account metrics, follower growth, and tweet patterns.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try searching for: <Button size="small">elonmusk</Button>, <Button size="small">naval</Button>, or <Button size="small">Google</Button>
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1">Loading data for @{username}...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!accountData) return null;

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ProfileCard profile={accountData.profile} />
          {accountData.cryptoData && (
            <CryptoCard data={accountData.cryptoData} />
          )}
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FollowerStats stats={accountData.followerStats} />
            </Grid>
            
            <Grid item xs={12}>
              <TweetAnalysisCard analysis={accountData.tweetAnalysis} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;