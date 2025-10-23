import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AirdropProject } from '@/types/airdrop';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/context/NotificationContext';
import { toast } from 'sonner';
import { 
  Search, 
  ExternalLink, 
  Info, 
  Rocket, 
  TrendingUp,
  Filter,
  Sparkles,
  Calendar,
  Award
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Explorer() {
  const [projects, setProjects] = useState<AirdropProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<AirdropProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchQuery, categoryFilter, statusFilter, projects]);

  const fetchProjects = async () => {
    try {
      const projectsQuery = query(
        collection(db, 'airdropProjects'),
        orderBy('featured', 'desc'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(projectsQuery);
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        endDate: doc.data().endDate?.toDate(),
      })) as AirdropProject[];
      
      // Check for new projects
      checkForNewProjects(projectsData);
      
      setProjects(projectsData);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      // If permission error, it means Firestore rules need to be deployed
      if (error?.message?.includes('permission')) {
        console.error('⚠️ Firestore rules may not be deployed. Run: firebase deploy --only firestore:rules');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkForNewProjects = (projectsData: AirdropProject[]) => {
    const lastVisit = localStorage.getItem('last_explorer_visit');
    const currentVisit = new Date().toISOString();
    
    if (lastVisit && projectsData.length > 0) {
      const lastVisitDate = new Date(lastVisit);
      const newProjects = projectsData.filter(project => 
        project.createdAt && project.createdAt > lastVisitDate
      );
      
      if (newProjects.length > 0) {
        // Show toast notification
        toast.success(`${newProjects.length} new airdrop${newProjects.length > 1 ? 's' : ''} available!`, {
          description: newProjects[0].name + (newProjects.length > 1 ? ` and ${newProjects.length - 1} more` : ''),
          duration: 5000,
        });
        
        // Add to notification center
        addNotification({
          type: 'progress',
          title: `🚀 New Airdrop${newProjects.length > 1 ? 's' : ''} Available!`,
          message: `${newProjects.length} new opportunity${newProjects.length > 1 ? 'ies' : ''} added: ${newProjects.map(p => p.name).join(', ')}`,
          icon: '🎁'
        });
      }
    }
    
    // Update last visit timestamp
    localStorage.setItem('last_explorer_visit', currentVisit);
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const trackClick = async (projectId: string, type: 'registration' | 'about') => {
    try {
      await updateDoc(doc(db, 'airdropProjects', projectId), {
        clicks: increment(1)
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'upcoming': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'ended': return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'defi': return TrendingUp;
      case 'gaming': return Award;
      case 'infrastructure': return Rocket;
      default: return Sparkles;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading airdrops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Airdrop Explorer</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Discover{' '}
            <span className="text-primary dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-primary dark:to-accent">
              Legitimate Airdrops
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore verified airdrop campaigns and maximize your crypto earnings with trusted projects.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search airdrops by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="DeFi">DeFi</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="NFT">NFT</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> airdrop{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <Rocket className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No airdrops found</h3>
            <p className="text-muted-foreground">
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Check back soon for new opportunities!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const CategoryIcon = getCategoryIcon(project.category);
              
              // Check if project is new (added in last 7 days)
              const isNew = project.createdAt && 
                (Date.now() - project.createdAt.getTime()) < 7 * 24 * 60 * 60 * 1000;
              
              return (
                <Card 
                  key={project.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Project Image/Logo */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center overflow-hidden">
                    {project.logoUrl ? (
                      <img 
                        src={project.logoUrl} 
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={project.logoUrl ? 'hidden' : 'flex items-center justify-center w-full h-full'}>
                      <CategoryIcon className="h-20 w-20 text-primary/40" />
                    </div>
                    
                    {/* NEW Badge - Top Right if not featured */}
                    {isNew && !project.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-500 text-white hover:bg-green-600 font-semibold animate-pulse">
                          ✨ NEW
                        </Badge>
                      </div>
                    )}
                    
                    {/* Featured Badge - Takes priority over NEW */}
                    {project.featured && (
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <Badge className="bg-yellow-500 text-black hover:bg-yellow-600 font-semibold">
                          ⭐ Featured
                        </Badge>
                        {isNew && (
                          <Badge className="bg-green-500 text-white hover:bg-green-600 font-semibold text-xs">
                            NEW
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`border ${getStatusColor(project.status)}`}>
                        {project.status?.toUpperCase() || 'ACTIVE'}
                      </Badge>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold line-clamp-1">{project.name}</h3>
                        {project.category && (
                          <Badge variant="secondary" className="flex-shrink-0 text-xs">
                            {project.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Metadata */}
                    {(project.reward || project.endDate) && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {project.reward && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Award className="h-3 w-3" />
                            <span>{project.reward}</span>
                          </div>
                        )}
                        {project.endDate && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Ends {project.endDate.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Requirements */}
                    {project.requirements && (
                      <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg line-clamp-2">
                        {project.requirements}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        onClick={() => {
                          trackClick(project.id, 'registration');
                          window.open(project.registrationUrl, '_blank');
                        }}
                      >
                        <Rocket className="h-4 w-4 mr-2" />
                        Join Airdrop
                      </Button>
                      
                      {project.aboutUrl && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            trackClick(project.id, 'about');
                            window.open(project.aboutUrl, '_blank');
                          }}
                          title="Learn More"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/20">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              New airdrops are added regularly. Check back often to discover fresh opportunities!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
