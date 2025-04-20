
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MissionType = 
  | "form"    // Form filling missions
  | "photo"   // Photo upload missions 
  | "video"   // Video upload missions
  | "checkin" // Location check-in missions
  | "social"  // Social media sharing missions
  | "coupon"  // Discount coupon missions
  | "survey"  // Survey completion missions
  | "review"; // Product/service review missions

export const missionTypeLabels: Record<MissionType, string> = {
  form: "Formulário",
  photo: "Foto",
  video: "Vídeo",
  checkin: "Check-in",
  social: "Redes Sociais",
  coupon: "Cupom de Desconto",
  survey: "Pesquisa",
  review: "Avaliação"
};

export const missionTypeIcons: Record<MissionType, string> = {
  form: "clipboard-list",
  photo: "camera",
  video: "video",
  checkin: "map-pin",
  social: "share",
  coupon: "tag",
  survey: "bar-chart-2",
  review: "star"
};

export const missionTypeDescriptions: Record<MissionType, string> = {
  form: "Solicite aos clientes que preencham um formulário no seu site ou aplicativo.",
  photo: "Peça aos clientes que tirem e enviem fotos de produtos, locais ou experiências.",
  video: "Solicite aos clientes que gravem e enviem vídeos relacionados ao seu produto ou serviço.",
  checkin: "Os clientes fazem check-in em uma localização física específica.",
  social: "Incentive clientes a fazer postagens em redes sociais mencionando sua marca.",
  coupon: "Os clientes usam um cupom de desconto para comprar seus produtos ou serviços.",
  survey: "Os clientes respondem a uma pesquisa detalhada sobre suas preferências ou hábitos.",
  review: "Clientes deixam avaliações genuínas em plataformas de reviews para seu negócio."
};

export const useMissionTypes = () => {
  const [loading, setLoading] = useState(true);
  const [missionTypes, setMissionTypes] = useState<MissionType[]>([
    "form", "photo", "video", "checkin", "social", "coupon", "survey", "review"
  ]);

  useEffect(() => {
    const fetchMissionTypes = async () => {
      try {
        // In a future implementation, we could fetch mission types from Supabase
        // For now, we're using the predefined list
        setLoading(false);
      } catch (error) {
        console.error("Error fetching mission types:", error);
        setLoading(false);
      }
    };

    fetchMissionTypes();
  }, []);

  return {
    loading,
    missionTypes,
    missionTypeLabels,
    missionTypeIcons,
    missionTypeDescriptions
  };
};
