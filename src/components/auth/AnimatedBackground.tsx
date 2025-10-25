import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;

    // Create floating parachutes
    const createParachute = (delay: number) => {
      if (!isMounted || !containerRef.current) return;
      
      const parachute = document.createElement('div');
      parachute.className = 'absolute pointer-events-none';
      parachute.innerHTML = `
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 5C15 5 10 8 8 12C6 16 5 20 5 25H35C35 20 34 16 32 12C30 8 25 5 20 5Z" 
                fill="currentColor" 
                class="text-primary/20" 
                opacity="0.6"/>
          <path d="M8 25L15 35L20 25" stroke="currentColor" class="text-primary/30" stroke-width="1"/>
          <path d="M32 25L25 35L20 25" stroke="currentColor" class="text-primary/30" stroke-width="1"/>
          <circle cx="20" cy="40" r="3" fill="currentColor" class="text-primary/40"/>
        </svg>
      `;
      
      parachute.style.left = `${Math.random() * 100}%`;
      parachute.style.top = '-60px';
      containerRef.current?.appendChild(parachute);

      const duration = 15 + Math.random() * 10;
      const horizontalMovement = (Math.random() - 0.5) * 200;

      const tween1 = gsap.to(parachute, {
        y: window.innerHeight + 100,
        x: horizontalMovement,
        rotation: Math.random() * 20 - 10,
        duration: duration,
        ease: 'none',
        delay: delay,
        onComplete: () => {
          if (isMounted && parachute.parentNode) {
            parachute.remove();
            createParachute(0);
          }
        }
      });

      // Swaying animation
      const tween2 = gsap.to(parachute, {
        x: `+=${Math.random() * 40 - 20}`,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      tweensRef.current.push(tween1, tween2);
    };

    // Create floating coins
    const createCoin = (delay: number) => {
      if (!isMounted || !containerRef.current) return;
      
      const coin = document.createElement('div');
      coin.className = 'absolute pointer-events-none';
      coin.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="14" fill="url(#coinGradient)" stroke="currentColor" class="text-accent/40" stroke-width="1"/>
          <circle cx="15" cy="15" r="10" fill="currentColor" class="text-accent/20"/>
          <text x="15" y="19" text-anchor="middle" font-size="14" font-weight="bold" fill="currentColor" class="text-accent">$</text>
          <defs>
            <linearGradient id="coinGradient" x1="0" y1="0" x2="30" y2="30">
              <stop offset="0%" stop-color="currentColor" class="text-accent/30"/>
              <stop offset="100%" stop-color="currentColor" class="text-accent/10"/>
            </linearGradient>
          </defs>
        </svg>
      `;
      
      coin.style.left = `${Math.random() * 100}%`;
      coin.style.top = `${window.innerHeight + 50}px`;
      containerRef.current?.appendChild(coin);

      const duration = 12 + Math.random() * 8;

      const tween1 = gsap.to(coin, {
        y: -window.innerHeight - 100,
        x: (Math.random() - 0.5) * 150,
        rotation: 360 + Math.random() * 360,
        duration: duration,
        ease: 'none',
        delay: delay,
        onComplete: () => {
          if (isMounted && coin.parentNode) {
            coin.remove();
            createCoin(0);
          }
        }
      });

      // Wobble animation
      const tween2 = gsap.to(coin, {
        scale: 1.2,
        duration: 1.5 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      tweensRef.current.push(tween1, tween2);
    };

    // Create sparkles
    const createSparkle = () => {
      if (!isMounted || !containerRef.current) return;
      
      const sparkle = document.createElement('div');
      sparkle.className = 'absolute pointer-events-none';
      sparkle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 0L11 9L10 20L9 9L10 0Z" fill="currentColor" class="text-primary/40"/>
          <path d="M0 10L9 11L20 10L9 9L0 10Z" fill="currentColor" class="text-primary/40"/>
        </svg>
      `;
      
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      containerRef.current?.appendChild(sparkle);

      const tween = gsap.fromTo(sparkle, 
        { scale: 0, opacity: 0, rotation: 0 },
        { 
          scale: 1, 
          opacity: 0.6, 
          rotation: 180,
          duration: 0.6,
          ease: 'back.out(1.7)',
          onComplete: () => {
            if (isMounted && sparkle.parentNode) {
              gsap.to(sparkle, {
                scale: 0,
                opacity: 0,
                duration: 0.4,
                delay: 0.3,
                onComplete: () => {
                  if (sparkle.parentNode) sparkle.remove();
                }
              });
            }
          }
        }
      );

      tweensRef.current.push(tween);
    };

    // Initialize animations
    const parachutes = 5;
    const coins = 4;
    
    for (let i = 0; i < parachutes; i++) {
      createParachute(i * 3);
    }
    
    for (let i = 0; i < coins; i++) {
      createCoin(i * 4);
    }

    // Sparkle at random intervals
    const sparkleInterval = setInterval(() => {
      if (isMounted && Math.random() > 0.7) {
        createSparkle();
      }
    }, 800);

    return () => {
      isMounted = false;
      clearInterval(sparkleInterval);
      
      // Kill all GSAP animations
      tweensRef.current.forEach(tween => {
        if (tween && tween.kill) {
          tween.kill();
        }
      });
      tweensRef.current = [];
      
      // Clear container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
