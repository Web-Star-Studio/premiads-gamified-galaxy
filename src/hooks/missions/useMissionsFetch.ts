
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { Mission, MissionStatus } from "./types";
import { MissionType } from "@/hooks/useMissionsTypes";

// Mock data for when no auth session is available
const MOCK_MISSIONS = [
  {
    id: "1",
    title: "Fotografe sua compra na Ciao",
    description: "Compartilhe uma foto sua usando uma peça de roupa da Ciao e ganhe pontos!",
    brand: "Ciao",
    type: "photo" as MissionType,
    points: 50,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "available" as MissionStatus,
    requirements: [
      "Compre um produto na Ciao",
      "Tire uma foto usando o produto",
      "Publique nas redes sociais com a hashtag #CiaoStyle"
    ],
    business_type: "Moda Masculina",
    target_audience_gender: "male",
    target_audience_age_min: 18,
    target_audience_age_max: 45,
    target_audience_region: "Recife"
  },
  {
    id: "2",
    title: "Compartilhe sua experiência no Black Muu BBQ",
    description: "Visite o Black Muu BBQ, faça um check-in e compartilhe sua experiência para ganhar pontos!",
    brand: "Black Muu BBQ",
    type: "social_share" as MissionType,
    points: 30,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "available" as MissionStatus,
    requirements: [
      "Visite o Black Muu BBQ",
      "Faça um check-in",
      "Compartilhe sua experiência nas redes sociais"
    ],
    business_type: "Restaurante",
    target_audience_gender: "all",
    target_audience_age_min: 25,
    target_audience_age_max: 55,
    target_audience_region: "Recife"
  },
  {
    id: "3",
    title: "Avalie os Produtos da Vitabrasil",
    description: "Compre um produto da Vitabrasil, experimente e deixe uma avaliação honesta para ganhar pontos!",
    brand: "Vitabrasil",
    type: "survey" as MissionType,
    points: 40,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "available" as MissionStatus,
    requirements: [
      "Compre um produto da Vitabrasil",
      "Experimente o produto por pelo menos 7 dias",
      "Deixe uma avaliação honesta"
    ],
    business_type: "Suplementos",
    target_audience_gender: "all",
    target_audience_age_min: 18,
    target_audience_age_max: 45,
    target_audience_region: "Recife"
  }
];

export const useMissionsFetch = () => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { playSound } = useSounds();

  // Fetch missions from Supabase
  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if user is authenticated
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData?.session?.user?.id) {
          console.log("No authenticated user found - using mock mission data");
          setMissions(MOCK_MISSIONS);
          setLoading(false);
          playSound("chime");
          return;
        }
        
        const userId = sessionData.session.user.id;
        
        console.log("Fetching missions for user:", userId);
        
        // Get user's submissions first to determine mission status
        const { data: userSubmissions, error: submissionsError } = await supabase
          .from("mission_submissions")
          .select("mission_id, status")
          .eq("user_id", userId);
        
        if (submissionsError) {
          console.error("Error fetching submissions:", submissionsError);
          throw submissionsError;
        }
        
        console.log("User submissions:", userSubmissions?.length || 0);
        
        // Get all active missions
        const { data: missionsData, error: missionsError } = await supabase
          .from("missions")
          .select("*")
          .eq("is_active", true);
        
        if (missionsError) {
          console.error("Error fetching missions:", missionsError);
          throw missionsError;
        }

        console.log("Missions fetched:", missionsData?.length || 0);
        
        // Map missions with their status for the current user
        const mappedMissions: Mission[] = (missionsData || []).map((mission) => {
          const submission = userSubmissions?.find(s => s.mission_id === mission.id);
          
          let status: MissionStatus = "available";
          if (submission) {
            if (submission.status === "approved") {
              status = "completed";
            } else if (submission.status === "pending") {
              status = "pending_approval";
            } else {
              status = "in_progress";
            }
          }

          // Convert requirements from JSON to string array
          const requirementsArray: string[] = mission.requirements 
            ? Array.isArray(mission.requirements) 
              ? mission.requirements.map(req => String(req))
              : typeof mission.requirements === 'object' 
                ? Object.values(mission.requirements).map(req => String(req))
                : [String(mission.requirements)]
            : [];

          return {
            id: mission.id,
            title: mission.title,
            description: mission.description,
            brand: mission.advertiser_id,
            type: mission.type as MissionType,
            points: mission.points,
            deadline: mission.end_date,
            status,
            requirements: requirementsArray,
            business_type: mission.business_type,
            target_audience_gender: mission.target_audience_gender,
            target_audience_age_min: mission.target_audience_age_min,
            target_audience_age_max: mission.target_audience_age_max,
            target_audience_region: mission.target_audience_region
          };
        });

        setMissions(mappedMissions);
        console.log("Mapped missions:", mappedMissions.length);
        playSound("chime");
      } catch (error: any) {
        console.error("Error fetching missions:", error);
        setError(error.message || "Erro ao buscar missões");
        toast({
          title: "Erro ao carregar missões",
          description: error.message || "Ocorreu um erro ao buscar as missões",
          variant: "destructive",
        });
        // Fallback to mock data in case of error
        setMissions(MOCK_MISSIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [toast, playSound]);

  return { loading, missions, setMissions, error };
};
