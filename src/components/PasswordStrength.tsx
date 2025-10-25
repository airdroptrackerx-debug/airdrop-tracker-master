import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrength({
  password,
  showRequirements = true,
}: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;

    // Length check
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Complexity checks
    if (/[a-z]/.test(password)) score++; // lowercase
    if (/[A-Z]/.test(password)) score++; // uppercase
    if (/[0-9]/.test(password)) score++; // numbers
    if (/[^A-Za-z0-9]/.test(password)) score++; // special chars

    // Determine strength
    if (score <= 2) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { score: 2, label: "Fair", color: "bg-orange-500" };
    if (score <= 5) return { score: 3, label: "Good", color: "bg-yellow-500" };
    if (score <= 6) return { score: 4, label: "Strong", color: "bg-green-500" };
    return { score: 5, label: "Very Strong", color: "bg-emerald-500" };
  }, [password]);

  const requirements = useMemo(
    () => [
      { met: password.length >= 6, text: "At least 6 characters" },
      { met: /[A-Z]/.test(password), text: "One uppercase letter" },
      { met: /[a-z]/.test(password), text: "One lowercase letter" },
      { met: /[0-9]/.test(password), text: "One number" },
    ],
    [password]
  );

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength:</span>
          <span
            className={`font-semibold ${
              strength.score === 1
                ? "text-red-600"
                : strength.score === 2
                ? "text-orange-600"
                : strength.score === 3
                ? "text-yellow-600"
                : strength.score === 4
                ? "text-green-600"
                : "text-emerald-600"
            }`}
          >
            {strength.label}
          </span>
        </div>
        <div className="flex gap-1 h-1.5">
          {[1, 2, 3, 4, 5].map((bar) => (
            <div
              key={bar}
              className={`flex-1 rounded-full transition-all duration-300 ${
                bar <= strength.score ? strength.color : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements */}
      {showRequirements && (
        <div className="space-y-1 pt-1">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              {req.met ? (
                <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
              ) : (
                <X className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              )}
              <span
                className={req.met ? "text-green-600" : "text-muted-foreground"}
              >
                {req.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
