import { useState, useEffect } from 'react';

export function useUserProfile() {
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    const stored = localStorage.getItem('stoxpilot_user');
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);
  
  const updateProfile = (data: any) => {
    const newProfile = { ...profile, ...data };
    localStorage.setItem('stoxpilot_user', JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  return {
    userName: profile?.userName || 'Trader',
    market: profile?.preferredMarket || 'IN',
    style: profile?.tradingStyle || 'swing',
    risk: profile?.riskTolerance || 'moderate',
    isSetupComplete: !!profile?.setupComplete,
    updateProfile
  };
}
