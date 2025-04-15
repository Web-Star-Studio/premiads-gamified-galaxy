
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock brands data
const featuredBrands = [
  {
    id: 1,
    name: "TechVerse",
    logo: "T",
    color: "text-neon-cyan",
    activeMissions: 2
  },
  {
    id: 2,
    name: "EcoStyle",
    logo: "E",
    color: "text-neon-lime",
    activeMissions: 1
  },
  {
    id: 3,
    name: "LuxeBeauty",
    logo: "L",
    color: "text-neon-pink",
    activeMissions: 3
  }
];

const BrandsPreview = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel p-6 mt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Marcas Parceiras</h2>
        <ShoppingBag className="w-5 h-5 text-neon-cyan" />
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        {featuredBrands.map((brand) => (
          <motion.div
            key={brand.id}
            className="bg-galaxy-deepPurple/30 rounded-lg p-3 text-center border border-galaxy-purple/20 hover:border-galaxy-purple/50 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-10 h-10 rounded-full ${brand.color} bg-galaxy-deepPurple/50 mx-auto mb-2 flex items-center justify-center font-heading text-lg`}>
              {brand.logo}
            </div>
            <h3 className="text-sm font-medium truncate">{brand.name}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {brand.activeMissions} {brand.activeMissions === 1 ? "missão" : "missões"}
            </p>
          </motion.div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        className="w-full justify-between mt-2 border-galaxy-purple/30 hover:bg-galaxy-deepPurple/50"
        // In a real implementation, this would navigate to a brands page
        onClick={() => console.log("Navigate to brands page")}
      >
        <div className="flex items-center">
          <ShoppingBag className="w-4 h-4 mr-2" />
          <span>Explorar Todas as Marcas</span>
        </div>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default BrandsPreview;
