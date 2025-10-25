import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/context/TasksContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Award,
  Edit2,
  Save,
  X,
  ArrowLeft,
  Moon,
  Sun,
  Lock,
  Shield,
  Trash2,
  AlertTriangle,
  Key,
  Eye,
  EyeOff,
  Flame,
  Share2,
  Bitcoin,
  Twitter,
  MessageCircle,
  Copy,
  Check,
  Facebook,
  Send,
  Linkedin,
  Youtube,
} from "lucide-react";
import { BadgeLevel } from "@/types/user";
import { useTheme } from "@/components/ThemeProvider";
import {
  getLevelInfo,
  getNextLevelInfo,
  getProgressToNextLevel,
  getTasksToNextLevel,
} from "@/utils/levelingSystem";
import { gsap } from "gsap";
import { PasswordStrength } from "@/components/PasswordStrength";

// Share functionality
const shareToWhatsApp = (text: string) => {
  const message = `${text}\n\n${window.location.origin}`;
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

const shareToTelegram = (text: string) => {
  const url = `https://t.me/share/url?url=${encodeURIComponent(
    window.location.origin
  )}&text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

const shareToFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    window.location.origin
  )}`;
  window.open(url, "_blank");
};

const shareToTwitter = (text: string) => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(window.location.origin)}`;
  window.open(url, "_blank");
};

const shareToLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    window.location.origin
  )}`;
  window.open(url, "_blank");
};

export default function Profile() {
  const {
    userProfile,
    updateUserProfile,
    changePassword,
    deleteAccount,
    linkGoogleAccount,
    linkTwitterAccount,
  } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password change state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Account deletion state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Share dialog state
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  // Refs for animations
  const levelBadgeRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setNickname(userProfile.nickname);
    }
  }, [userProfile]);

  const taskCount = tasks.length;
  const completedToday = tasks.filter((task) => task.lastCompleted).length;
  const currentLevel = getLevelInfo(taskCount);
  const nextLevel = getNextLevelInfo(taskCount);
  const progress = getProgressToNextLevel(taskCount);
  const tasksToNext = getTasksToNextLevel(taskCount);
  const currentStreak = userProfile?.streakData?.current || 0;
  const longestStreak = userProfile?.streakData?.longest || 0;

  const handleSave = async () => {
    if (!name.trim() || !nickname.trim()) {
      setError("Name and nickname cannot be empty");
      return;
    }

    setIsSavingProfile(true);
    setError("");

    try {
      await updateUserProfile({ name: name.trim(), nickname: nickname.trim() });
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update profile");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setName(userProfile.name);
      setNickname(userProfile.nickname);
    }
    setIsEditing(false);
    setError("");
  };

  const handlePasswordChange = async () => {
    setPasswordError("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!", {
        description: "Your password has been updated.",
      });

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordDialog(false);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");

    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm");
      return;
    }

    setIsDeletingAccount(true);

    try {
      await deleteAccount(deletePassword);
      toast.success("Account deleted", {
        description: "Your account and all data have been permanently deleted.",
      });
      // User will be automatically signed out and redirected
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete account");
      setIsDeletingAccount(false);
    }
  };

  const resetPasswordDialog = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setShowPasswordDialog(false);
  };

  const resetDeleteDialog = () => {
    setDeletePassword("");
    setDeleteError("");
    setShowDeletePassword(false);
    setShowDeleteDialog(false);
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      toast.success("Link copied!", {
        description: "Share link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareText = `Check out Airdrop Tracker! 🚀 The best way to manage your crypto airdrop tasks. Join me and never miss an opportunity!`;

  // Animations on mount
  useEffect(() => {
    if (levelBadgeRef.current) {
      gsap.fromTo(
        levelBadgeRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
      );
    }

    if (streakRef.current && currentStreak > 0) {
      gsap.fromTo(
        streakRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.2 }
      );
    }

    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    }
  }, [currentStreak]);

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <main
      id="main-content"
      className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl"
    >
      <div className="mb-6 sm:mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-3 sm:mb-4 -ml-2 sm:-ml-3 text-sm sm:text-base"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
          Back to Home
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={userProfile.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="flex gap-2 pt-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="flex-1"
                    disabled={isSavingProfile}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSavingProfile ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1"
                    disabled={isSavingProfile}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* EPIC Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Stats
            </CardTitle>
            <CardDescription>
              Track your progress and achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Epic Level Badge with Animation */}
            <div
              ref={levelBadgeRef}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-background via-primary/5 to-accent/10 border-2 border-primary/20"
            >
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${currentLevel.gradient} text-white font-bold text-lg shadow-2xl transform hover:scale-105 transition-transform`}
              >
                <span className="text-2xl">{currentLevel.icon}</span>
                <span>{currentLevel.level}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3 font-medium">
                {currentLevel.description}
              </p>
            </div>

            {/* Streak Display */}
            {currentStreak > 0 && (
              <div
                ref={streakRef}
                className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flame className="h-8 w-8 text-orange-500" />
                    <div>
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {currentStreak} Day{currentStreak !== 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Current Streak 🔥
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-muted-foreground">
                      Best
                    </div>
                    <div className="text-lg font-bold">{longestStreak}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid with Animation */}
            <div ref={statsRef} className="grid grid-cols-2 gap-3">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="text-3xl font-bold text-primary dark:bg-gradient-to-r dark:from-primary dark:to-accent dark:bg-clip-text dark:text-transparent">
                  {taskCount}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Total Tasks
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {completedToday}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Done Today
                </div>
              </div>
            </div>

            {/* Progress to Next Level */}
            {nextLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Next: {nextLevel.icon} {nextLevel.level}
                  </span>
                  <span className="font-bold text-primary">
                    {tasksToNext} tasks left
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${currentLevel.gradient} transition-all duration-500 ease-out`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center text-xs text-muted-foreground">
                  {progress}% Complete
                </div>
              </div>
            )}

            {!nextLevel && (
              <div className="text-center py-4">
                <p className="text-lg font-bold text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text">
                  🎉 MAX LEVEL ACHIEVED! 🎉
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  You're a legend!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {/* Donate Button */}
        <Button
          onClick={() => navigate("/donate")}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold h-14"
        >
          <Bitcoin className="h-5 w-5 mr-2" />
          Donate via Crypto
        </Button>

        {/* Share Button */}
        <Button
          onClick={handleShare}
          size="lg"
          variant="outline"
          className="border-2 border-primary h-14 font-semibold"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share App
        </Button>
      </div>

      {/* Social Links */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Connect With Us</CardTitle>
          <CardDescription>
            Join our community and stay updated!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open("https://x.com/airdroptracker", "_blank")
            }
            className="flex-1 min-w-[140px]"
          >
            Follow on X
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open("https://discord.gg/airdroptracker", "_blank")
            }
            className="flex-1 min-w-[140px]"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Join Discord
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open("https://youtube.com/@airdroptracker", "_blank")
            }
            className="flex-1 min-w-[140px]"
          >
            <Youtube className="h-4 w-4 mr-2" />
            Subscribe on YouTube
          </Button>
        </CardContent>
      </Card>

      {/* Account Linking Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-primary" />
            Linked Accounts
          </CardTitle>
          <CardDescription>
            Connect multiple login methods for easier access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Google */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Google</p>
                <p className="text-xs text-muted-foreground">
                  {userProfile?.linkedProviders?.includes("google.com")
                    ? "Connected"
                    : "Not connected"}
                </p>
              </div>
            </div>
            {userProfile?.linkedProviders?.includes("google.com") ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              >
                <Check className="h-3 w-3 mr-1" />
                Linked
              </Badge>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    await linkGoogleAccount();
                    toast.success("Google account linked successfully!");
                    window.location.reload(); // Refresh to show updated state
                  } catch (error: any) {
                    toast.error(error.message);
                  }
                }}
              >
                Link
              </Button>
            )}
          </div>

          {/* Twitter/X */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                <X className="h-5 w-5 text-white dark:text-black" />
              </div>
              <div>
                <p className="font-medium">𝕏 (Twitter)</p>
                <p className="text-xs text-muted-foreground">
                  {userProfile?.linkedProviders?.includes("twitter.com")
                    ? "Connected"
                    : "Not connected"}
                </p>
              </div>
            </div>
            {userProfile?.linkedProviders?.includes("twitter.com") ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              >
                <Check className="h-3 w-3 mr-1" />
                Linked
              </Badge>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    await linkTwitterAccount();
                    toast.success("𝕏 account linked successfully!");
                    window.location.reload(); // Refresh to show updated state
                  } catch (error: any) {
                    toast.error(error.message);
                  }
                }}
              >
                Link
              </Button>
            )}
          </div>

          {/* Email/Password */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Email & Password</p>
                <p className="text-xs text-muted-foreground">
                  {userProfile?.linkedProviders?.includes("password")
                    ? "Configured"
                    : "Not configured"}
                </p>
              </div>
            </div>
            {userProfile?.linkedProviders?.includes("password") && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              >
                <Check className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings & Account Management Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
        {/* Security Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowPasswordDialog(true)}
              className="w-full"
              variant="outline"
            >
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Account Management Card */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" />
              Account Management
            </CardTitle>
            <CardDescription>
              Permanently delete your account and data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              ⚠️ This action cannot be undone. All your tasks and data will be
              permanently deleted.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Airdrop Tracker</DialogTitle>
            <DialogDescription>
              Help others discover this amazing task manager!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => shareToWhatsApp(shareText)}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2 text-green-600" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToTelegram(shareText)}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2 text-blue-500" />
                Telegram
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToTwitter(shareText)}
                className="w-full"
              >
                X
              </Button>
              <Button
                variant="outline"
                onClick={shareToFacebook}
                className="w-full"
              >
                <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={shareToLinkedIn}
                className="w-full"
              >
                <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                LinkedIn
              </Button>
            </div>

            {/* Copy Link */}
            <div className="space-y-2">
              <Label>Or copy link</Label>
              <div className="flex gap-2">
                <Input
                  value={window.location.origin}
                  readOnly
                  className="flex-1"
                />
                <Button onClick={handleCopyLink} size="icon">
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <AlertDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Change Password
            </AlertDialogTitle>
            <AlertDialogDescription>
              Enter your current password and choose a new one. Your password
              must be at least 6 characters long.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {passwordError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-md text-sm">
                {passwordError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  disabled={isChangingPassword}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showCurrentPassword ? "Hide password" : "Show password"
                  }
                  disabled={isChangingPassword}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  disabled={isChangingPassword}
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                  disabled={isChangingPassword}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <PasswordStrength password={newPassword} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={isChangingPassword}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  disabled={isChangingPassword}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={resetPasswordDialog}
              disabled={isChangingPassword}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
              className="bg-primary hover:bg-primary/90"
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data including:
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mb-4">
              <li>Your profile information</li>
              <li>All your tasks and progress</li>
              <li>Your achievements and statistics</li>
              <li>All associated account data</li>
            </ul>

            {deleteError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-md text-sm mb-4">
                {deleteError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="delete-password">
                Enter your password to confirm
              </Label>
              <div className="relative">
                <Input
                  id="delete-password"
                  type={showDeletePassword ? "text" : "password"}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isDeletingAccount}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showDeletePassword ? "Hide password" : "Show password"
                  }
                  disabled={isDeletingAccount}
                >
                  {showDeletePassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={resetDeleteDialog}
              disabled={isDeletingAccount}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeletingAccount ? "Deleting..." : "Delete My Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
