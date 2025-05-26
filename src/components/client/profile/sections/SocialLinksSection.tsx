import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Instagram, Youtube, Twitter, Music2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../types/profileTypes";

interface SocialLinksSectionProps {
  form: UseFormReturn<ProfileFormValues>
}

export function SocialLinksSection({ form }: SocialLinksSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Instagram */}
      <FormField
        control={form.control}
        name="instagramUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2"><Instagram className="h-4 w-4 text-neon-pink"/> Instagram</FormLabel>
            <FormControl>
              <Input
                placeholder="https://instagram.com/seu_usuario"
                className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                {...field}
              />
            </FormControl>
            <FormDescription>Link para o seu perfil no Instagram.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* TikTok */}
      <FormField
        control={form.control}
        name="tiktokUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2"><Music2 className="h-4 w-4 text-neon-cyan"/> TikTok</FormLabel>
            <FormControl>
              <Input
                placeholder="https://www.tiktok.com/@seu_usuario"
                className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                {...field}
              />
            </FormControl>
            <FormDescription>Link para o seu perfil no TikTok.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* YouTube */}
      <FormField
        control={form.control}
        name="youtubeUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2"><Youtube className="h-4 w-4 text-red-500"/> YouTube</FormLabel>
            <FormControl>
              <Input
                placeholder="https://www.youtube.com/@seu_canal"
                className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                {...field}
              />
            </FormControl>
            <FormDescription>Link para o seu canal no YouTube.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Twitter */}
      <FormField
        control={form.control}
        name="twitterUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2"><Twitter className="h-4 w-4 text-sky-400"/> Twitter / X</FormLabel>
            <FormControl>
              <Input
                placeholder="https://twitter.com/seu_usuario"
                className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                {...field}
              />
            </FormControl>
            <FormDescription>Link para o seu perfil no Twitter.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default SocialLinksSection; 