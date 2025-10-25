import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Rocket, Sparkles, TrendingUp, Gift } from "lucide-react";

const illustrations = [
  {
    icon: Rocket,
    title: "Hunt Airdrops",
    description: "Track unlimited crypto airdrops",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Sparkles,
    title: "Earn Rewards",
    description: "Never miss an opportunity",
    color: "from-accent/20 to-accent/5",
  },
  {
    icon: TrendingUp,
    title: "Level Up",
    description: "Build streaks & unlock achievements",
    color: "from-green-500/20 to-green-500/5",
  },
  {
    icon: Gift,
    title: "Stay Organized",
    description: "Manage all your tasks in one place",
    color: "from-purple-500/20 to-purple-500/5",
  },
];

export function AirdropIllustrations() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Auto-rotate illustrations
    const startRotation = () => {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % illustrations.length);
      }, 4000);
    };

    startRotation();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Kill all GSAP tweens
      tweensRef.current.forEach((tween) => {
        if (tween && tween.kill) {
          tween.kill();
        }
      });
      tweensRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const cards = container.querySelectorAll(".illustration-card");

    // Kill previous tweens before creating new ones
    tweensRef.current.forEach((tween) => {
      if (tween && tween.kill) {
        tween.kill();
      }
    });
    tweensRef.current = [];

    cards.forEach((card, index) => {
      if (index === currentIndex) {
        const tween1 = gsap.fromTo(
          card,
          {
            opacity: 0,
            scale: 0.8,
            rotateY: -90,
            z: -200,
          },
          {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            z: 0,
            duration: 0.8,
            ease: "back.out(1.4)",
          }
        );
        tweensRef.current.push(tween1);

        // Animate icon
        const icon = card.querySelector(".illustration-icon");
        if (icon) {
          const tween2 = gsap.fromTo(
            icon,
            { scale: 0, rotation: -180 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              delay: 0.2,
              ease: "back.out(2)",
            }
          );
          tweensRef.current.push(tween2);
        }

        // Animate text
        const title = card.querySelector(".illustration-title");
        const desc = card.querySelector(".illustration-desc");

        if (title) {
          const tween3 = gsap.fromTo(
            title,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.3 }
          );
          tweensRef.current.push(tween3);
        }

        if (desc) {
          const tween4 = gsap.fromTo(
            desc,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.4 }
          );
          tweensRef.current.push(tween4);
        }
      } else {
        const tween = gsap.to(card, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
        });
        tweensRef.current.push(tween);
      }
    });
  }, [currentIndex]);

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px] flex items-center justify-center perspective-1000">
      <div ref={containerRef} className="relative w-full max-w-md h-full">
        {illustrations.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`illustration-card absolute inset-0 ${
                index === currentIndex
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }`}
              style={{
                opacity: 0,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={`relative h-full bg-gradient-to-br ${item.color} backdrop-blur-sm rounded-2xl border border-primary/10 p-8 shadow-2xl`}
              >
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
                <div className="absolute bottom-4 left-4 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-8 pb-20 lg:pb-24">
                  {/* Icon */}
                  <div className="illustration-icon relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150" />
                    <div className="relative bg-gradient-to-br from-primary to-accent p-6 rounded-full shadow-lg">
                      <Icon className="w-16 h-16 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="space-y-2">
                    <h3 className="illustration-title text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {item.title}
                    </h3>
                    <p className="illustration-desc text-lg text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  {/* Floating particles around */}
                  <div
                    className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-ping"
                    style={{ animationDelay: "0s", animationDuration: "2s" }}
                  />
                  <div
                    className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-accent/40 rounded-full animate-ping"
                    style={{ animationDelay: "0.5s", animationDuration: "2s" }}
                  />
                  <div
                    className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary/30 rounded-full animate-ping"
                    style={{ animationDelay: "1s", animationDuration: "2s" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-12 lg:bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
        {illustrations.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = setInterval(() => {
                  setCurrentIndex((prev) => (prev + 1) % illustrations.length);
                }, 4000);
              }
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "w-2 bg-primary/30 hover:bg-primary/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
