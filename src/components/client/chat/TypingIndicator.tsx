
import { motion } from "framer-motion";

const TypingIndicator = () => (
    <div className="flex w-max max-w-[80%] flex-col gap-1 rounded-lg px-3 py-2 text-sm bg-galaxy-deepPurple/70">
      <div className="flex items-center gap-1">
        <motion.div
          className="h-2 w-2 rounded-full bg-neon-cyan"
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.div
          className="h-2 w-2 rounded-full bg-neon-cyan"
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="h-2 w-2 rounded-full bg-neon-cyan"
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </div>
  );

export default TypingIndicator;
