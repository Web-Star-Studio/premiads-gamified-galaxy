
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import AdvertiserHeader from '@/components/advertiser/AdvertiserHeader';
import { CreditsPurchase } from '@/components/advertiser/credits';

const CreditsPage = () => {
  const { userName } = useUser();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserCredits = async () => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        
        if (userId) {
          const { data, error } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();
          
          if (error) throw error;
          if (data) {
            setCredits(data.credits || 0);
          }
        }
      } catch (error) {
        console.error('Error fetching user credits:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserCredits();
  }, []);

  return (
    <div className="min-h-screen bg-galaxy-dark">
      <Helmet>
        <title>Créditos | PremiAds</title>
      </Helmet>
      
      <AdvertiserHeader 
        title="Gerenciamento de Créditos" 
        description="Compre e gerencie seus créditos para campanhas"
        userName={userName}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-galaxy-deepPurple/40 rounded-lg w-3/4"></div>
              <div className="h-80 bg-galaxy-deepPurple/30 rounded-lg"></div>
            </div>
          ) : (
            <CreditsPurchase currentCredits={credits} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;
