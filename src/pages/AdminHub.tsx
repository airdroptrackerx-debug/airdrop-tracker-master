import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Rocket,
  Heart,
  Settings,
  DollarSign,
  Users,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

export default function AdminHub() {
  const navigate = useNavigate();

  const adminPages = [
    {
      title: "Analytics Dashboard",
      description: "View site statistics, user metrics, and revenue insights",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "from-blue-500 to-cyan-500",
      features: ["User metrics", "Revenue tracking", "Growth analytics"],
    },
    {
      title: "Manage Airdrops",
      description: "Add, edit, or remove airdrop projects from Explorer",
      icon: Rocket,
      path: "/admin/airdrops",
      color: "from-purple-500 to-pink-500",
      features: ["Create projects", "Track clicks", "Update listings"],
    },
    {
      title: "Donation Confirmations",
      description: "Review and manage user donation submissions",
      icon: Heart,
      path: "/admin/donations",
      color: "from-red-500 to-orange-500",
      features: ["View donations", "Verify submissions", "Send thanks"],
    },
    {
      title: "Monetization Guide",
      description: "Learn how to monetize your platform effectively",
      icon: DollarSign,
      path: "/admin/monetization",
      color: "from-green-500 to-emerald-500",
      features: ["AdSense setup", "Affiliate programs", "Premium features"],
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Admin Hub</h1>
              <p className="text-muted-foreground mt-1">
                Manage and monitor your Airdrop Tracker platform
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Platform Status</p>
                <p className="text-xl font-bold">🟢 Active</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Your Role</p>
                <p className="text-xl font-bold">Administrator</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Access Level</p>
                <p className="text-xl font-bold">Full Control</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Admin Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminPages.map((page, index) => {
            const Icon = page.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(page.path)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-br ${page.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {page.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {page.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                >
                  Open {page.title}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Quick Links */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">All Admin Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate("/admin/analytics")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate("/admin/airdrops")}
            >
              <Rocket className="h-4 w-4 mr-2" />
              Airdrops
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate("/admin/donations")}
            >
              <Heart className="h-4 w-4 mr-2" />
              Donations
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate("/admin/monetization")}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Monetization
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
