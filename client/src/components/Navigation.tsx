import { Brain, LayoutDashboard, Upload, MessageSquare, Lightbulb, Search, Moon, Sun } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Home', icon: Brain },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/import', label: 'Import', icon: Upload },
    { path: '/conversations', label: 'Conversations', icon: MessageSquare },
    { path: '/ideas', label: 'Ideas', icon: Lightbulb },
    { path: '/search', label: 'Search', icon: Search },
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors"
          >
            <Brain className="h-6 w-6 text-primary" />
            IdeasMiner
          </button>
          
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'secondary' : 'ghost'}
                  onClick={() => setLocation(item.path)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </nav>
  );
}

