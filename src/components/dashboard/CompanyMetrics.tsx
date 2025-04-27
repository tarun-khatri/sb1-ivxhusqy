import React, { useState, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import { Twitter, Github, Linkedin, FileText, BarChart } from 'lucide-react';
import { PlatformCard } from './PlatformCard';
import { PlatformDetailDialog } from './PlatformDetailDialog';
import { Company, CompetitorData, LinkedInData, OnchainData } from '../../types';
import { fetchAllCompetitorData } from '../../services/competitorApi';
import { fetchOnchainMetrics } from '../../services/onchainApi';
import { fetchLinkedInData } from '../../services/linkedInApi';

interface CompanyMetricsProps {
  company: Company;
}

export const CompanyMetrics: React.FC<CompanyMetricsProps> = ({ company }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [competitorData, setCompetitorData] = useState<CompetitorData | null>(null);
  const [onchainData, setOnchainData] = useState<OnchainData | null>(null);
  const [linkedInData, setLinkedInData] = useState<LinkedInData | null>(null);

  // Fetch LinkedIn data separately
  useEffect(() => {
    const fetchLinkedInDataDirectly = async () => {
      if (!company) return;
      
      try {
        const linkedInId = company.identifiers?.linkedIn;
        if (linkedInId) {
          console.log('Fetching LinkedIn data directly for:', linkedInId);
          const data = await fetchLinkedInData(linkedInId, company.name);
          console.log('Fetched LinkedIn data directly:', data);
          if (data?.companyProfile?.success && data?.posts?.success) {
            setLinkedInData(data);
          } else {
            console.warn('LinkedIn data fetch was not successful:', data);
          }
        }
      } catch (error) {
        console.error('Error fetching LinkedIn data:', error);
      }
    };

    fetchLinkedInDataDirectly();
  }, [company]);

  // Fetch onchain data separately
  useEffect(() => {
    const fetchOnchainData = async () => {
      if (!company) return;
      
      try {
        const onchainId = company.identifiers?.defillama || company.onchainAddress;
        if (onchainId) {
          console.log('Fetching onchain data directly for:', onchainId);
          const data = await fetchOnchainMetrics(onchainId);
          console.log('Fetched onchain data directly:', data);
          setOnchainData(data);
        }
      } catch (error) {
        console.error('Error fetching onchain data:', error);
      }
    };

    fetchOnchainData();
  }, [company]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching data for company:', company);
        const data = await fetchAllCompetitorData(company);
        console.log('Received competitor data:', data);
        setCompetitorData(data);
      } catch (error) {
        console.error('Error fetching competitor data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (company) {
      fetchData();
    }
  }, [company]);

  const handlePlatformClick = async (platform: string) => {
    console.log('Platform clicked:', platform);
    setSelectedPlatform(platform);
    
    if (platform === 'LinkedIn' && !linkedInData) {
      try {
        const linkedInId = company.identifiers?.linkedIn;
        if (linkedInId) {
          console.log('Fetching LinkedIn data on click for:', linkedInId);
          const data = await fetchLinkedInData(linkedInId, company.name);
          console.log('Fetched LinkedIn data on click:', data);
          if (data?.companyProfile?.success && data?.posts?.success) {
            setLinkedInData(data);
          } else {
            console.warn('LinkedIn data fetch was not successful:', data);
          }
        }
      } catch (error) {
        console.error('Error fetching LinkedIn data:', error);
      }
    }
    
    if (platform === 'Onchain' && !onchainData) {
      try {
        const onchainId = company.identifiers?.defillama || company.onchainAddress;
        if (onchainId) {
          const data = await fetchOnchainMetrics(onchainId);
          setOnchainData(data);
        }
      } catch (error) {
        console.error('Error fetching onchain data:', error);
      }
    }
    
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPlatform(null);
  };

  const getPlatformData = () => {
    if (!selectedPlatform) return null;

    switch (selectedPlatform) {
      case 'Twitter':
        return competitorData?.twitter || null;
      case 'GitHub':
        return competitorData?.github || null;
      case 'LinkedIn':
        return linkedInData || null;
      case 'Medium':
        return competitorData?.medium || null;
      case 'Onchain':
        return onchainData || null;
      default:
        return null;
    }
  };

  const platforms = [
    {
      title: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      metrics: competitorData?.twitter || null
    },
    {
      title: 'GitHub',
      icon: Github,
      color: '#24292E',
      metrics: competitorData?.github || null
    },
    {
      title: 'LinkedIn',
      icon: Linkedin,
      color: '#0A66C2',
      metrics: linkedInData || null
    },
    {
      title: 'Medium',
      icon: FileText,
      color: '#000000',
      metrics: competitorData?.medium || null
    },
    {
      title: 'Onchain',
      icon: BarChart,
      color: '#3F51B5',
      metrics: onchainData || null
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {platforms.map((platform) => (
          <Grid item xs={12} sm={6} md={4} key={platform.title}>
            <PlatformCard
              title={platform.title}
              icon={platform.icon}
              color={platform.color}
              onClick={() => handlePlatformClick(platform.title)}
              metrics={platform.metrics}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>

      <PlatformDetailDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={selectedPlatform || ''}
        icon={platforms.find(p => p.title === selectedPlatform)?.icon || Twitter}
        color={platforms.find(p => p.title === selectedPlatform)?.color || '#000'}
        data={getPlatformData()}
        loading={loading}
      />
    </Box>
  );
}; 