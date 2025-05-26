import { motion } from "framer-motion";
import { Form } from "@/components/ui/form";
import { useProfileForm } from "./hooks/useProfileForm";
import { ProfileHeader } from "./sections/ProfileHeader";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { AdditionalInfoSection } from "./sections/AdditionalInfoSection";
import { SocialLinksSection } from "./sections/SocialLinksSection";
import { FormFooter } from "./sections/FormFooter";

const ProfileForm = () => {
  const { form, loading, pointsAwarded, hasCompletedBefore, onSubmit } = useProfileForm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-6 sm:p-8 rounded-lg"
    >
      <ProfileHeader 
        hasCompletedBefore={hasCompletedBefore} 
        pointsAwarded={pointsAwarded} 
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoSection form={form} />
          
          <div className="border-t border-galaxy-purple/20 pt-6">
            <h3 className="text-lg font-bold mb-4">Informações Adicionais</h3>
            <AdditionalInfoSection form={form} />
          </div>
          
          <div className="border-t border-galaxy-purple/20 pt-6">
            <h3 className="text-lg font-bold mb-4">Redes Sociais</h3>
            <SocialLinksSection form={form} />
          </div>
          
          <FormFooter loading={loading} />
        </form>
      </Form>
    </motion.div>
  );
};

export default ProfileForm;
