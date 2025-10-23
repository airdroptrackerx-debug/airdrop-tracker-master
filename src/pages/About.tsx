import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Rocket, 
  Target, 
  Users, 
  Zap, 
  Shield, 
  TrendingUp, 
  Award,
  Flame,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animation
    if (heroRef.current) {
      gsap.from(heroRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }

    // Story sections scroll animations
    storyRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.from(ref, {
          scrollTrigger: {
            trigger: ref,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          x: index % 2 === 0 ? -100 : 100,
          duration: 1,
          ease: 'power3.out'
        });
      }
    });

    // Features grid animation
    if (featuresRef.current) {
      // Set initial state
      gsap.set(featuresRef.current.children, { opacity: 1, y: 0 });
      
      // Animate on scroll
      gsap.from(featuresRef.current.children, {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out'
      });
    }

    // Stats counter animation
    if (statsRef.current) {
      const stats = statsRef.current.querySelectorAll('.stat-number');
      stats.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target') || '0');
        gsap.from(stat, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
          textContent: 0,
          duration: 2,
          ease: 'power1.inOut',
          snap: { textContent: 1 },
          onUpdate: function() {
            stat.textContent = Math.ceil(this.targets()[0].textContent).toString();
          }
        });
      });
    }

    // CTA animation
    if (ctaRef.current) {
      gsap.from(ctaRef.current, {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: Target,
      title: 'Task Management',
      description: 'Organize and track all your crypto airdrop tasks in one place',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Flame,
      title: 'Daily Streaks',
      description: 'Build consistency with login streaks and milestone rewards',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Award,
      title: 'Level System',
      description: 'Progress from Novice Explorer to Crypto Titan as you complete tasks',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Instant synchronization across all your devices',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with enterprise-grade security',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of users tracking airdrops together',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'User First',
      description: 'Every feature is designed with your success in mind'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Constantly evolving with the latest crypto trends'
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'Helping you maximize every airdrop opportunity'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="container relative mx-auto px-4" ref={heroRef}>
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Rocket className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">About Airdrop Tracker</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Your Personal{' '}
              <span className="text-primary dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-primary dark:via-purple-500 dark:to-accent">
                Crypto Airdrop
              </span>{' '}
              Command Center
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Track, manage, and never miss another airdrop opportunity. Built by crypto enthusiasts, for crypto enthusiasts.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-4 w-full max-w-md mx-auto">
              <Button 
                size="lg" 
                onClick={() => navigate('/')}
                className="bg-primary text-white hover:bg-primary/90 flex-1 min-w-[180px] py-4 sm:py-3 text-base sm:text-sm"
              >
                <Rocket className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/donate')}
                className="flex-1 min-w-[180px] py-4 sm:py-3 text-base sm:text-sm"
              >
                <Heart className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                Support Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 space-y-24">
          {/* Story 1: The Problem */}
          <div 
            ref={el => storyRefs.current[0] = el}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Chapter 1</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">The Problem We Solved</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                In the fast-paced world of crypto airdrops, opportunities come and go in the blink of an eye. 
                Missing a task, forgetting a deadline, or losing track of requirements meant leaving money on the table.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We experienced this frustration firsthand. Sticky notes everywhere, spreadsheets that quickly became outdated, 
                and the constant anxiety of "Did I complete that task?"
              </p>
            </div>
            <Card className="p-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Missed Opportunities</h4>
                    <p className="text-sm text-muted-foreground">Forgetting tasks meant lost airdrops</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">No Organization</h4>
                    <p className="text-sm text-muted-foreground">Tasks scattered across multiple tools</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Zero Motivation</h4>
                    <p className="text-sm text-muted-foreground">No tracking of progress or achievements</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Story 2: The Solution */}
          <div 
            ref={el => storyRefs.current[1] = el}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 md:order-1">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Centralized Hub</h4>
                    <p className="text-sm text-muted-foreground">All your airdrop tasks in one place</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Flame className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Gamification</h4>
                    <p className="text-sm text-muted-foreground">Streaks and levels keep you motivated</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Beautiful UX</h4>
                    <p className="text-sm text-muted-foreground">Intuitive design that's a joy to use</p>
                  </div>
                </div>
              </div>
            </Card>
            <div className="space-y-6 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Chapter 2</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">Our Solution</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We built Airdrop Tracker to be the tool we wished existed. A beautiful, intuitive platform 
                that makes tracking airdrops not just easy, but actually enjoyable.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With gamification features like daily streaks and leveling systems, we turned airdrop hunting 
                from a chore into an engaging experience that rewards consistency and dedication.
              </p>
            </div>
          </div>

          {/* Story 3: The Impact */}
          <div 
            ref={el => storyRefs.current[2] = el}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Chapter 3</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">Making an Impact</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, thousands of crypto enthusiasts use Airdrop Tracker daily to stay on top of their opportunities. 
                Our users have completed hundreds of thousands of tasks and maintained impressive streaks.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                But we're just getting started. We're constantly innovating, adding new features, and listening to 
                our community to make Airdrop Tracker the best it can be.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4" ref={statsRef}>
              <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="stat-number text-4xl font-bold text-primary mb-2" data-target="10000">0</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                <div className="stat-number text-4xl font-bold text-green-600 dark:text-green-400 mb-2" data-target="50000">0</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-orange-500/10 to-red-500/10">
                <div className="stat-number text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2" data-target="100">0</div>
                <div className="text-sm text-muted-foreground">Day Streaks</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <div className="stat-number text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2" data-target="99">0</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to maximize your airdrop success
            </p>
          </div>

          <div ref={featuresRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <Card 
            ref={ctaRef}
            className="p-12 text-center bg-gradient-to-br from-primary via-purple-500 to-accent border-0 text-white"
          >
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Join the Revolution</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                Ready to Level Up Your Airdrop Game?
              </h2>
              
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Join thousands of users who are already maximizing their airdrop opportunities with Airdrop Tracker.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-4 w-full max-w-md mx-auto">
                <Button 
                  size="lg"
                  onClick={() => navigate('/')}
                  className="bg-white text-primary hover:bg-white/90 flex-1 min-w-[200px] py-4 sm:py-3 text-base sm:text-sm"
                >
                  <Rocket className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                  Start Tracking
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/donate')}
                  className="bg-white text-primary hover:bg-white/90 flex-1 min-w-[200px] py-4 sm:py-3 text-base sm:text-sm"
                >
                  <Heart className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                  Support Development
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
