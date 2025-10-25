import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  Activity,
  Eye,
  MousePointerClick,
  Calendar,
  Zap,
  BarChart3,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import { LiveCommunityIndicator } from "@/components/LiveCommunityIndicator";

interface AnalyticsData {
  totalUsers: number;
  activeUsers24h: number;
  activeUsers7d: number;
  totalTasks: number;
  totalAirdrops: number;
  airdropClicks: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  averageDailyUsers: number;
}

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers24h: 0,
    activeUsers7d: 0,
    totalTasks: 0,
    totalAirdrops: 0,
    airdropClicks: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    averageDailyUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));

      // Total users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const totalUsers = usersSnapshot.size;

      // Active users (24h)
      const activeUsers24hQuery = query(
        collection(db, "userActivity"),
        where("lastSeen", ">", Timestamp.fromDate(oneDayAgo))
      );
      const activeUsers24h = (await getDocs(activeUsers24hQuery)).size;

      // Active users (7d)
      const activeUsers7dQuery = query(
        collection(db, "userActivity"),
        where("lastSeen", ">", Timestamp.fromDate(sevenDaysAgo))
      );
      const activeUsers7d = (await getDocs(activeUsers7dQuery)).size;

      // New users today
      const newUsersTodayQuery = query(
        collection(db, "users"),
        where("createdAt", ">", Timestamp.fromDate(startOfToday))
      );
      const newUsersToday = (await getDocs(newUsersTodayQuery)).size;

      // New users this week
      const newUsersWeekQuery = query(
        collection(db, "users"),
        where("createdAt", ">", Timestamp.fromDate(sevenDaysAgo))
      );
      const newUsersThisWeek = (await getDocs(newUsersWeekQuery)).size;

      // Total airdrops
      const airdropsSnapshot = await getDocs(collection(db, "airdropProjects"));
      const totalAirdrops = airdropsSnapshot.size;

      // Calculate total clicks across all airdrops
      let totalClicks = 0;
      airdropsSnapshot.docs.forEach((doc) => {
        totalClicks += doc.data().clicks || 0;
      });

      // Calculate average daily users (based on 7-day data)
      const averageDailyUsers = Math.round(activeUsers7d / 7);

      // Total tasks across all users
      const tasksSnapshot = await getDocs(collection(db, "tasks"));
      const totalTasks = tasksSnapshot.size;

      const analyticsData = {
        totalUsers,
        activeUsers24h,
        activeUsers7d,
        totalTasks,
        totalAirdrops,
        airdropClicks: totalClicks,
        newUsersToday,
        newUsersThisWeek,
        averageDailyUsers,
      };

      setAnalytics(analyticsData);

      // Cache active user count for non-admin users to display
      localStorage.setItem(
        "cached_active_users_count",
        JSON.stringify({
          count: activeUsers24h,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      trend: "+" + analytics.newUsersToday + " today",
    },
    {
      title: "Active (24h)",
      value: analytics.activeUsers24h,
      icon: Activity,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      trend:
        ((analytics.activeUsers24h / analytics.totalUsers) * 100).toFixed(1) +
        "% of total",
    },
    {
      title: "Active (7d)",
      value: analytics.activeUsers7d,
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      trend: "Avg: " + analytics.averageDailyUsers + "/day",
    },
    {
      title: "Total Airdrops",
      value: analytics.totalAirdrops,
      icon: Zap,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      trend: analytics.airdropClicks + " total clicks",
    },
    {
      title: "New Users (Today)",
      value: analytics.newUsersToday,
      icon: Calendar,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      trend: "+" + analytics.newUsersThisWeek + " this week",
    },
    {
      title: "Avg Click-Through",
      value:
        analytics.totalAirdrops > 0
          ? Math.round(analytics.airdropClicks / analytics.totalAirdrops)
          : 0,
      icon: MousePointerClick,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      trend: "Per airdrop",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights into your platform's performance
          </p>
        </div>

        {/* Live Community Card */}
        <div className="mb-8">
          <LiveCommunityIndicator variant="profile" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`p-6 border ${stat.border} ${stat.bg} hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.title}
                    </p>
                    <p className={`text-4xl font-bold mt-2 ${stat.color}`}>
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Engagement */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">User Engagement</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    24h Active Rate
                  </span>
                  <span className="text-sm font-semibold">
                    {(
                      (analytics.activeUsers24h / analytics.totalUsers) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${
                        (analytics.activeUsers24h / analytics.totalUsers) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    7d Active Rate
                  </span>
                  <span className="text-sm font-semibold">
                    {(
                      (analytics.activeUsers7d / analytics.totalUsers) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{
                      width: `${
                        (analytics.activeUsers7d / analytics.totalUsers) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Growth This Week
                  </span>
                  <span className="text-sm font-semibold">
                    +{analytics.newUsersThisWeek} users
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500"
                    style={{
                      width: `${Math.min(
                        (analytics.newUsersThisWeek / analytics.totalUsers) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Revenue Potential */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Monetization Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-sm font-semibold mb-2">
                  💰 Referral Revenue Potential
                </p>
                <p className="text-2xl font-bold text-primary mb-1">
                  {analytics.airdropClicks} clicks
                </p>
                <p className="text-xs text-muted-foreground">
                  Your Explorer referral links have generated this many
                  click-throughs
                </p>
              </div>

              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-sm font-semibold mb-2">
                  📊 Ad Revenue Opportunities
                </p>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li>
                    • <strong>Google AdSense:</strong> ~$2-5 per 1000 page views
                  </li>
                  <li>
                    • <strong>Display Ads:</strong> Estimated $
                    {(((analytics.activeUsers24h * 5) / 1000) * 3).toFixed(2)}
                    /day
                  </li>
                  <li>
                    • <strong>Affiliate Links:</strong> 5-20% commission per
                    signup
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-sm font-semibold mb-2">
                  🎯 Recommended Next Steps
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>✓ Apply for Google AdSense</li>
                  <li>✓ Join crypto affiliate programs</li>
                  <li>✓ Offer premium features</li>
                  <li>✓ Partner with airdrop platforms</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Quick Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-muted-foreground mb-1">Retention Rate</p>
              <p className="text-2xl font-bold">
                {(
                  (analytics.activeUsers7d / analytics.totalUsers) *
                  100
                ).toFixed(0)}
                %
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-muted-foreground mb-1">Daily Active Growth</p>
              <p className="text-2xl font-bold text-green-600">
                +
                {Math.round(
                  (analytics.newUsersToday / analytics.totalUsers) * 100
                )}
                %
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-muted-foreground mb-1">Avg. Airdrop CTR</p>
              <p className="text-2xl font-bold">
                {analytics.totalAirdrops > 0 && analytics.activeUsers24h > 0
                  ? (
                      (analytics.airdropClicks /
                        (analytics.activeUsers24h * analytics.totalAirdrops)) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-muted-foreground mb-1">Platform Health</p>
              <p className="text-2xl font-bold text-green-600">
                {analytics.activeUsers24h > 10 ? "🟢 Healthy" : "🟡 Growing"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
