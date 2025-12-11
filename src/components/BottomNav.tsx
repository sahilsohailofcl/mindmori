import { motion } from "framer-motion";
import { Home, Target, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Target, label: "Missions", path: "/missions" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border px-4 py-2 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
              )
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center gap-1"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={isActive ? { y: [0, -2, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <item.icon className="w-6 h-6" />
                </motion.div>
                <span className="text-xs font-semibold">{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
