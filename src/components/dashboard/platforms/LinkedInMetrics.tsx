import React from 'react';
import {
  Grid, Typography, Box, Card, CardContent, Avatar, Chip, Link, Divider, Tooltip
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { SocialMediaData } from '../../../types/index';
import LaunchIcon from '@mui/icons-material/Launch';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import LanguageIcon from '@mui/icons-material/Language';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface LinkedInMetricsProps {
  data: any; // Accepts the raw MongoDB data object
  color: string;
}

const COLORS = ["#0077b5", "#00bfae", "#fbbc05", "#ea4335", "#34a853", "#a142f4", "#ff7043", "#29b6f6", "#cddc39", "#ab47bc"];

export const LinkedInMetrics: React.FC<LinkedInMetricsProps> = ({ data, color }) => {
  console.log("LinkedIn data", data);
  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No LinkedIn metrics available
        </Typography>
      </Box>
    );
  }

  // Company Overview
  const logo = data.profile?.profileImage || '';
  const name = data.profile?.displayName || data.companyName || 'N/A';
  const industry = data.profile?.industry || 'N/A';
  const description = data.profile?.bio || 'N/A';
  const website = data.profile?.website || '';
  const linkedinUrl = data.profile?.linkedinUrl || '';

  // Stats
  const followers = data.followerStats?.totalFollowers ?? data.profile?.followersCount ?? 0;
  const staffCount = data.profile?.staffCount ?? 'N/A';
  const staffCountRange = data.profile?.staffCountRange ?? 'N/A';

  // Engagement Rate
  const engagementRate = data.contentAnalysis?.metrics?.avgEngagementRate ?? data.contentAnalysis?.engagementRate ?? 'N/A';

  // Funding
  const funding = data.fundingData || {};
  const lastFunding = funding.lastFundingRound || {};
  const fundingAmount = lastFunding.moneyRaised?.amount;
  const fundingCurrency = lastFunding.moneyRaised?.currencyCode;
  const fundingType = lastFunding.fundingType;
  const fundingDate = lastFunding.announcedOn ? `${lastFunding.announcedOn.year}-${String(lastFunding.announcedOn.month).padStart(2, '0')}-${String(lastFunding.announcedOn.day).padStart(2, '0')}` : '';
  const leadInvestors = lastFunding.leadInvestors || [];
  const fundingUrl = lastFunding.fundingRoundCrunchbaseUrl;

  // Employee Distribution
  const empDist = data.employeeDistribution || {};
  const topFunctions = empDist.function?.slice(0, 5) || [];
  const topSkills = empDist.skill?.slice(0, 5) || [];
  const topLocations = empDist.location?.slice(0, 5) || [];

  // Growth
  const growth = data.growth || {};
  const followerGrowth = Array.isArray(growth.followers) ? growth.followers[0] : null;

  // Render bar chart helper
  const renderBarChart = (items: any[], label: string) => (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={items} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
        <XAxis type="number" hide />
        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 13 }} />
        <RechartsTooltip cursor={{ fill: '#f5f5f5' }} />
        <Bar dataKey="count" radius={[6, 6, 6, 6]}>
          {items.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  // Funding Info Box
  const FundingBox = () => (
    <Card sx={{ background: '#f5faff', borderLeft: `5px solid ${color}`, mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <MonetizationOnIcon sx={{ color, mr: 1 }} />
          <Typography variant="subtitle1" fontWeight={600}>Funding</Typography>
        </Box>
        {fundingType && (
          <Typography variant="body2" sx={{ mb: 0.5 }}><b>Type:</b> {fundingType}</Typography>
        )}
        {fundingAmount && (
          <Typography variant="body2" sx={{ mb: 0.5 }}><b>Amount:</b> {fundingCurrency} {Number(fundingAmount).toLocaleString()}</Typography>
        )}
        {fundingDate && (
          <Typography variant="body2" sx={{ mb: 0.5 }}><b>Date:</b> {fundingDate}</Typography>
        )}
        {leadInvestors.length > 0 && (
          <Typography variant="body2" sx={{ mb: 0.5 }}><b>Lead Investors:</b> {leadInvestors.map((inv: any) => inv.name).join(', ')}</Typography>
        )}
        {fundingUrl && (
          <Link href={fundingUrl} target="_blank" rel="noopener" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            View on Crunchbase <LaunchIcon sx={{ fontSize: 16, ml: 0.5 }} />
          </Link>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Company Overview */}
      <Card sx={{ mb: 3, p: 2, background: 'linear-gradient(90deg, #f5faff 60%, #e3e9ff 100%)', boxShadow: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar src={logo} alt={name} sx={{ width: 72, height: 72, border: `2px solid ${color}` }} />
            </Grid>
            <Grid item xs>
              <Typography variant="h5" fontWeight={700} sx={{ color }}>{name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                <BusinessIcon sx={{ fontSize: 18, color: '#888' }} />
                <Typography variant="body2" color="text.secondary">{industry}</Typography>
                <Chip label={staffCountRange} size="small" sx={{ ml: 1, background: '#e3e9ff', color: color }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                {website && (
                  <Link href={website} target="_blank" rel="noopener" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <LanguageIcon sx={{ fontSize: 18, mr: 0.5 }} /> Website <LaunchIcon sx={{ fontSize: 16, ml: 0.5 }} />
                  </Link>
                )}
                {linkedinUrl && (
                  <Link href={linkedinUrl} target="_blank" rel="noopener" sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ fontSize: 18, mr: 0.5 }} /> LinkedIn <LaunchIcon sx={{ fontSize: 16, ml: 0.5 }} />
                  </Link>
                )}
              </Box>
            </Grid>
          </Grid>
          {description && description !== 'N/A' && (
            <Typography variant="body2" sx={{ mt: 2, color: '#444' }}>{description}</Typography>
          )}
        </CardContent>
      </Card>

      {/* Stats & Funding */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ color, mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>Followers</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ color }}>{followers.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">{staffCount} employees</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <FundingBox />
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color, mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>Growth</Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ color }}>{followerGrowth ? `+${followerGrowth.toLocaleString()}` : 'N/A'}</Typography>
              <Typography variant="body2" color="text.secondary">Recent Follower Growth</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MonetizationOnIcon sx={{ color, mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>Engagement Rate</Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ color }}>{engagementRate !== 'N/A' ? `${(engagementRate * 100).toFixed(2)}%` : 'N/A'}</Typography>
              <Typography variant="body2" color="text.secondary">Avg. Engagement Rate</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Employee Distribution */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>Employee Distribution</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 1 }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Top Functions</Typography>
                {topFunctions.length > 0 ? renderBarChart(topFunctions, 'Function') : <Typography color="text.secondary">No data</Typography>}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 1 }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Top Skills</Typography>
                {topSkills.length > 0 ? renderBarChart(topSkills, 'Skill') : <Typography color="text.secondary">No data</Typography>}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 1 }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Top Locations</Typography>
                {topLocations.length > 0 ? renderBarChart(topLocations, 'Location') : <Typography color="text.secondary">No data</Typography>}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* More sections (Recent Posts, etc.) can be added here if needed */}
    </Box>
  );
}; 