import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Compass } from 'lucide-react';

interface TaskSearchProps {
  onSearch: (query: string) => void;
}

export function TaskSearch({ onSearch }: TaskSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search your tasks..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-12 text-base bg-card"
          />
        </div>

        {/* Airdrop Explorer Button */}
        <Button
          size="lg"
          onClick={() => navigate('/explorer')}
          className="h-12 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-primary dark:to-accent text-white hover:opacity-90 shadow-lg whitespace-nowrap font-semibold"
        >
          <Compass className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">Airdrop</span> Explorer
        </Button>
      </div>
    </div>
  );
}
