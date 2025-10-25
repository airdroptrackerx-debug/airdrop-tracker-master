import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  Users,
  MousePointerClick,
  Zap,
  Globe,
  Star,
  ExternalLink,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export default function AdminMonetization() {
  const navigate = useNavigate();
  const revenueStreams = [
    {
      title: "Google AdSense",
      icon: Globe,
      difficulty: "Easy",
      potential: "$2-5 per 1000 views",
      color: "from-blue-500 to-cyan-500",
      setup: [
        "Sign up at google.com/adsense",
        "Add your website",
        "Place ad code in strategic locations",
        "Wait for approval (1-2 weeks)",
      ],
      tips: [
        "Place ads above fold for better visibility",
        "Use responsive ad units",
        "Avoid ad-heavy pages (hurts UX)",
        "Typical CPM: $2-5 for crypto niche",
      ],
    },
    {
      title: "Affiliate Marketing",
      icon: TrendingUp,
      difficulty: "Medium",
      potential: "5-50% per conversion",
      color: "from-purple-500 to-pink-500",
      setup: [
        "Join crypto exchange affiliate programs",
        "Get unique referral links",
        "Embed in airdrop listings",
        "Track conversions",
      ],
      programs: [
        "Binance Affiliate: Up to 50% commission",
        "Coinbase: $10 per referral",
        "Crypto.com: Tiered commissions",
        "KuCoin: 20-40% trading fees",
      ],
    },
    {
      title: "Premium Features",
      icon: Star,
      difficulty: "Medium",
      potential: "$5-20/month per user",
      color: "from-yellow-500 to-orange-500",
      ideas: [
        "Advanced analytics dashboard",
        "Priority airdrop notifications",
        "Task automation tools",
        "Ad-free experience",
        "Custom task categories",
        "Export data features",
      ],
    },
    {
      title: "Sponsored Airdrops",
      icon: Zap,
      difficulty: "Hard",
      potential: "$100-500 per listing",
      color: "from-green-500 to-emerald-500",
      approach: [
        "Contact airdrop projects directly",
        'Offer "Featured" placement',
        "Charge for guaranteed visibility",
        "Provide analytics reports",
      ],
      pricing: [
        "Featured listing: $100-200/week",
        "Top banner: $300-500/week",
        "Newsletter mention: $50-100",
        "Package deals for multi-week campaigns",
      ],
    },
  ];

  const quickWins = [
    {
      title: "Your Explorer Referrals",
      icon: MousePointerClick,
      description:
        "Already set up! Every airdrop click uses your referral codes",
      status: "✅ Active",
      color: "text-green-600",
    },
    {
      title: "Join CoinMarketCap Affiliate",
      icon: TrendingUp,
      description: "Easy approval, crypto-focused audience",
      status: "🔗 Quick Setup",
      color: "text-blue-600",
    },
    {
      title: "Add Donation CTA",
      icon: DollarSign,
      description: "You already have donation page - promote it more",
      status: "✅ Already Have",
      color: "text-purple-600",
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
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Monetization Guide</h1>
              <p className="text-muted-foreground mt-1">
                Turn your traffic into revenue with these proven strategies
              </p>
            </div>
          </div>
        </div>

        {/* Quick Wins */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            Quick Wins (Start Today!)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickWins.map((win, idx) => {
              const Icon = win.icon;
              return (
                <div key={idx} className="p-4 bg-background rounded-lg">
                  <Icon className={`h-6 w-6 ${win.color} mb-2`} />
                  <h3 className="font-semibold mb-1">{win.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {win.description}
                  </p>
                  <Badge className="text-xs">{win.status}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Revenue Streams */}
        <div className="space-y-6">
          {revenueStreams.map((stream, index) => {
            const Icon = stream.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-br ${stream.color}`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{stream.title}</h3>
                      <Badge
                        variant={
                          stream.difficulty === "Easy" ? "default" : "secondary"
                        }
                      >
                        {stream.difficulty}
                      </Badge>
                    </div>
                    <p className="text-lg text-primary font-semibold mb-1">
                      💰 {stream.potential}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Setup Steps */}
                  {stream.setup && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Setup Steps
                      </h4>
                      <ol className="space-y-2">
                        {stream.setup.map((step, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex gap-2"
                          >
                            <span className="font-semibold text-primary">
                              {idx + 1}.
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Tips / Programs / Ideas / Approach */}
                  {stream.tips && (
                    <div>
                      <h4 className="font-semibold mb-3">💡 Pro Tips</h4>
                      <ul className="space-y-2">
                        {stream.tips.map((tip, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex gap-2"
                          >
                            <span>•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {stream.programs && (
                    <div>
                      <h4 className="font-semibold mb-3">
                        🎯 Recommended Programs
                      </h4>
                      <ul className="space-y-2">
                        {stream.programs.map((program, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex gap-2"
                          >
                            <span>•</span>
                            {program}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {stream.ideas && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold mb-3">💎 Feature Ideas</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {stream.ideas.map((idea, idx) => (
                          <div
                            key={idx}
                            className="text-sm p-2 bg-muted rounded text-muted-foreground"
                          >
                            • {idea}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {stream.approach && (
                    <div>
                      <h4 className="font-semibold mb-3">📋 Approach</h4>
                      <ul className="space-y-2">
                        {stream.approach.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex gap-2"
                          >
                            <span>•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {stream.pricing && (
                    <div>
                      <h4 className="font-semibold mb-3">💵 Pricing Guide</h4>
                      <ul className="space-y-2">
                        {stream.pricing.map((price, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex gap-2"
                          >
                            <span>•</span>
                            {price}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Resources */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Useful Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <a
                href="https://adsense.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Google AdSense</p>
                  <p className="text-xs text-muted-foreground">
                    Sign up for display ads
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </a>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <a
                href="https://www.binance.com/en/activity/affiliate"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TrendingUp className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Binance Affiliate</p>
                  <p className="text-xs text-muted-foreground">
                    Up to 50% commission
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </a>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <a
                href="https://help.coinbase.com/en/coinbase/other-topics/other/the-coinbase-referral-program"
                target="_blank"
                rel="noopener noreferrer"
              >
                <DollarSign className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Coinbase Referrals</p>
                  <p className="text-xs text-muted-foreground">
                    Earn per sign-up
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </a>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <a
                href="https://stripe.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Stripe</p>
                  <p className="text-xs text-muted-foreground">
                    Accept premium payments
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </a>
            </Button>
          </div>
        </Card>

        {/* Revenue Calculator */}
        <Card className="p-6 mt-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <h2 className="text-xl font-bold mb-4">
            📊 Potential Revenue Calculator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-background rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                AdSense (Low)
              </p>
              <p className="text-2xl font-bold">$50-200/mo</p>
              <p className="text-xs text-muted-foreground mt-1">
                With 1000 daily users
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Affiliates (Moderate)
              </p>
              <p className="text-2xl font-bold">$200-1000/mo</p>
              <p className="text-xs text-muted-foreground mt-1">
                5% conversion rate
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Premium (High)
              </p>
              <p className="text-2xl font-bold">$500-5000/mo</p>
              <p className="text-xs text-muted-foreground mt-1">
                100 paying users @$10/mo
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Sponsored (Variable)
              </p>
              <p className="text-2xl font-bold">$400-2000/mo</p>
              <p className="text-xs text-muted-foreground mt-1">
                4-10 sponsors/month
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-background rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              🎯 Realistic Total (Combined Strategies):
            </p>
            <p className="text-4xl font-bold text-primary">
              $1,150 - $8,200/month
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Based on moderate traffic (1000 daily active users) and
              diversified revenue streams
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
