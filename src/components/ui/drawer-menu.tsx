
import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";

interface DrawerMenuProps {
  items: {
    label: string;
    href: string;
    onClick?: () => void;
  }[];
  ctaButton?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

export function DrawerMenu({ items, ctaButton, className = "" }: DrawerMenuProps) {
  const [open, setOpen] = useState(false);
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleItemClick = () => {
    setOpen(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-galaxy-dark/95 backdrop-blur-lg border-galaxy-purple/30 p-0 w-full max-w-xs">
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <SheetClose asChild>
              <Button variant="ghost" size="icon" aria-label="Fechar menu">
                <X size={24} />
              </Button>
            </SheetClose>
          </div>
          
          <nav className="flex-1 px-6 pb-6">
            <motion.div 
              className="flex flex-col space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  {item.onClick ? (
                    <button
                      onClick={() => {
                        item.onClick?.();
                        handleItemClick();
                      }}
                      className="text-lg text-gray-200 hover:text-white hover:neon-text-cyan transition-colors py-2"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={handleItemClick}
                      className="text-lg text-gray-200 hover:text-white hover:neon-text-cyan transition-colors py-2 block"
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
            
            {ctaButton && (
              <motion.div
                className="mt-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to={ctaButton.href}
                  onClick={() => {
                    ctaButton.onClick?.();
                    handleItemClick();
                  }}
                  className="neon-button w-full flex items-center justify-center py-3"
                >
                  {ctaButton.label}
                </Link>
              </motion.div>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
