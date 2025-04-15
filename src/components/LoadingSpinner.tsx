
import { memo } from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark bg-opacity-80">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin mb-4"></div>
        <p className="text-neon-cyan font-heading">Carregando...</p>
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(LoadingSpinner);
