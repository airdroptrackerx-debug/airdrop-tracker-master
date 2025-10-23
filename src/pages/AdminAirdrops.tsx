import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { AirdropProject } from '@/types/airdrop';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, ExternalLink, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAirdrops() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<AirdropProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AirdropProject | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
    registrationUrl: '',
    aboutUrl: '',
    category: 'DeFi',
    status: 'active' as 'active' | 'upcoming' | 'ended',
    featured: false,
    requirements: '',
    reward: '',
    endDate: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projectsQuery = query(
        collection(db, 'airdropProjects'),
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
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (project?: AirdropProject) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        logoUrl: project.logoUrl || '',
        registrationUrl: project.registrationUrl,
        aboutUrl: project.aboutUrl || '',
        category: project.category || 'DeFi',
        status: project.status || 'active',
        featured: project.featured || false,
        requirements: project.requirements || '',
        reward: project.reward || '',
        endDate: project.endDate ? project.endDate.toISOString().split('T')[0] : '',
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        logoUrl: '',
        registrationUrl: '',
        aboutUrl: '',
        category: 'DeFi',
        status: 'active',
        featured: false,
        requirements: '',
        reward: '',
        endDate: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProject(null);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.registrationUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        logoUrl: formData.logoUrl || null,
        registrationUrl: formData.registrationUrl,
        aboutUrl: formData.aboutUrl || null,
        category: formData.category,
        status: formData.status,
        featured: formData.featured,
        requirements: formData.requirements || null,
        reward: formData.reward || null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        updatedAt: serverTimestamp(),
        ...(editingProject ? {} : {
          createdAt: serverTimestamp(),
          createdBy: user?.uid,
          views: 0,
          clicks: 0,
        }),
      };

      if (editingProject) {
        await updateDoc(doc(db, 'airdropProjects', editingProject.id), projectData);
        toast.success('Project updated successfully!');
      } else {
        // Create new project
        const docRef = await addDoc(collection(db, 'airdropProjects'), projectData);
        
        // Create global notification for new airdrop
        await addDoc(collection(db, 'globalNotifications'), {
          type: 'new_airdrop',
          projectId: docRef.id,
          projectName: formData.name,
          category: formData.category,
          featured: formData.featured,
          createdAt: serverTimestamp(),
          read: false
        });
        
        toast.success('🎉 Project created and users will be notified!');
      }

      handleCloseDialog();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteDoc(doc(db, 'airdropProjects', projectId));
      toast.success('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Airdrop Projects</h1>
            <p className="text-muted-foreground mt-1">
              Add and manage airdrop campaigns for users to discover
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Projects List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="p-6">
              <div className="flex gap-4">
                {/* Logo */}
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {project.logoUrl ? (
                    <img 
                      src={project.logoUrl} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {project.name[0]}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg truncate">{project.name}</h3>
                    {project.featured && (
                      <span className="text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full flex-shrink-0">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs mb-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {project.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${
                      project.status === 'active' ? 'bg-green-500/10 text-green-600' :
                      project.status === 'upcoming' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-gray-500/10 text-gray-600'
                    }`}>
                      {project.status}
                    </span>
                    {project.clicks !== undefined && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full">
                        {project.clicks} clicks
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(project)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(project.registrationUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No projects yet. Add your first airdrop campaign!</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Project
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? 'Update project details' : 'Add a new airdrop campaign for users to discover'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Grass Airdrop"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the airdrop project..."
                rows={3}
              />
            </div>

            {/* Logo URL */}
            <div>
              <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Direct link to project logo image
              </p>
            </div>

            {/* Registration URL (with referral) */}
            <div>
              <Label htmlFor="registrationUrl">Registration URL (With Your Referral Code) *</Label>
              <Input
                id="registrationUrl"
                value={formData.registrationUrl}
                onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                placeholder="https://example.com/register?ref=yourcode"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include your referral code in the URL for monetization
              </p>
            </div>

            {/* About URL */}
            <div>
              <Label htmlFor="aboutUrl">About/Info URL (Optional)</Label>
              <Input
                id="aboutUrl"
                value={formData.aboutUrl}
                onChange={(e) => setFormData({ ...formData, aboutUrl: e.target.value })}
                placeholder="https://example.com/about"
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DeFi">DeFi</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="NFT">NFT</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Requirements & Reward */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Input
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="e.g., Twitter follow"
                />
              </div>

              <div>
                <Label htmlFor="reward">Potential Reward</Label>
                <Input
                  id="reward"
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  placeholder="e.g., 100 tokens"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="featured" className="cursor-pointer">Featured Project</Label>
                <p className="text-xs text-muted-foreground">Show at the top of the list</p>
              </div>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
