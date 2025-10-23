import { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { gsap } from 'gsap';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function AnimatedInput({ onFocus, onBlur, ...props }: AnimatedInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inputRef.current || !glowRef.current) return;

    const input = inputRef.current;
    const glow = glowRef.current;

    const handleFocus = (e: FocusEvent) => {
      gsap.to(glow, {
        opacity: 0.6,
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(input, {
        scale: 1.01,
        duration: 0.2,
        ease: 'back.out(2)'
      });
      
      if (onFocus) onFocus(e as any);
    };

    const handleBlur = (e: FocusEvent) => {
      gsap.to(glow, {
        opacity: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.in'
      });
      
      gsap.to(input, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.in'
      });
      
      if (onBlur) onBlur(e as any);
    };

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);

    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
    };
  }, [onFocus, onBlur]);

  return (
    <div className="relative">
      <div
        ref={glowRef}
        className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-md blur-sm pointer-events-none"
        style={{ opacity: 0 }}
      />
      <Input ref={inputRef} {...props} className={`relative ${props.className || ''}`} />
    </div>
  );
}
