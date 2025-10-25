import React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Rocket,
  Trophy,
  Bell,
  Users,
  Sparkles,
  Shield,
  Play,
  ClipboardList,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GuidelinesDrawerProps {
  children: React.ReactNode;
}

export default function GuidelinesDrawer({ children }: GuidelinesDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[90vh] sm:h-[85vh] flex flex-col">
        <div className="container mx-auto max-w-3xl flex flex-col h-full overflow-hidden">
          <DrawerHeader className="flex-shrink-0 pb-2 px-4 lg:px-6">
            <DrawerTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              App Guidelines
            </DrawerTitle>
            <DrawerDescription>
              Learn how to use the Airdrop Tracker app effectively
            </DrawerDescription>
          </DrawerHeader>

          <div
            className="flex-1 overflow-y-auto overflow-x-hidden px-4 lg:px-6 overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Welcome to Airdrop Tracker
              </h3>
              <p className="text-muted-foreground">
                Your all-in-one crypto airdrop companion! Track tasks, discover
                new opportunities, earn achievements, and join an active
                community of airdrop hunters.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full pb-4">
              <AccordionItem value="getting-started">
                <AccordionTrigger className="text-lg font-medium">
                  <span className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    Getting Started
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2">To start tracking your airdrops:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Create an account or sign in</li>
                    <li>
                      Click the <strong>"Add Task"</strong> button in the header
                    </li>
                    <li>Fill in the details of your airdrop task</li>
                    <li>Save the task to start tracking it</li>
                  </ol>
                  <p className="mt-2">
                    The more tasks you add, the better overview you'll have of
                    all your opportunities.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="task-management">
                <AccordionTrigger className="text-lg font-medium">
                  <span className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Task Management
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2">
                    Each task card represents an airdrop opportunity:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Mark tasks as complete when you've performed the required
                      action
                    </li>
                    <li>Edit tasks to update their details</li>
                    <li>Delete tasks you're no longer interested in</li>
                    <li>
                      Click on the task title to visit the related website
                    </li>
                  </ul>
                  <p className="mt-2">
                    Tasks are color-coded by intensity - green for easy tasks,
                    yellow for medium, and red for hard tasks that require more
                    effort.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="timers">
                <AccordionTrigger className="text-lg font-medium">
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Timer Types
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2">Choose the right timer for your task:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Daily:</strong> For tasks you need to complete
                      once every day
                    </li>
                    <li>
                      <strong>Weekly:</strong> For tasks required once a week
                    </li>
                    <li>
                      <strong>Monthly:</strong> For tasks needed once a month
                    </li>
                    <li>
                      <strong>Custom:</strong> Set a specific hour interval for
                      specialized tasks
                    </li>
                  </ul>
                  <p className="mt-2">
                    The progress bar on each task shows time remaining until the
                    task is due again.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="stats-tracking">
                <AccordionTrigger className="text-lg font-medium">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Stats & Progress
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2">
                    Monitor your progress with our stats tracker:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>View your completion rate</li>
                    <li>See your experience level based on task completion</li>
                    <li>Get motivational messages based on your performance</li>
                  </ul>
                  <p className="mt-2">
                    Higher completion rates increase your chances of qualifying
                    for airdrops, as many projects reward consistent
                    participation.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="explorer">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" />
                    Airdrop Explorer
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2">
                    Discover verified airdrop opportunities curated by our team:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Browse Airdrops:</strong> Find new projects across
                      DeFi, Gaming, NFT, and Infrastructure categories
                    </li>
                    <li>
                      <strong>Filter & Search:</strong> Use search bar and
                      filters to find airdrops matching your interests
                    </li>
                    <li>
                      <strong>Featured Projects:</strong> Look for ⭐ Featured
                      badges for high-quality opportunities
                    </li>
                    <li>
                      <strong>New Alerts:</strong> Get notified when new
                      airdrops are added (✨ NEW badge)
                    </li>
                    <li>
                      <strong>Quick Actions:</strong> Click "Join Airdrop" to
                      participate or ℹ️ to learn more
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">
                    💡 Tip: Check Explorer regularly for fresh opportunities!
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="gamification">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    Achievements & Gamification
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2">
                    Level up your airdrop hunting with achievements and rewards:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Daily Streaks:</strong> Complete tasks daily to
                      build streaks and unlock future bonuses
                    </li>
                    <li>
                      <strong>Experience Levels:</strong> Earn XP from task
                      completion and level up (Beginner → Master)
                    </li>
                    <li>
                      <strong>Achievement Badges:</strong> Unlock special badges
                      for milestones (First Task, Week Warrior, etc.)
                    </li>
                    <li>
                      <strong>Progress Tracking:</strong> View your stats on the
                      Profile page
                    </li>
                    <li>
                      <strong>Leaderboard coming soon:</strong> Your stats
                      prepare you for future community competitions
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">
                    🏆 Higher levels = More motivation to stay consistent!
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="notifications">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    Notifications Center
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2">
                    Stay informed with real-time notifications:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Task Alerts:</strong> Get notified when tasks are
                      completed or due soon
                    </li>
                    <li>
                      <strong>Achievement Unlocks:</strong> Celebrate when you
                      earn new badges or reach milestones
                    </li>
                    <li>
                      <strong>New Airdrops:</strong> Alerts when fresh
                      opportunities are added to Explorer
                    </li>
                    <li>
                      <strong>Streak Reminders:</strong> Don't break your streak
                      - get reminded to complete daily tasks
                    </li>
                    <li>
                      <strong>Notification Center:</strong> Click the bell icon
                      in navigation to view all notifications
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">
                    🔔 Unread notifications show a red badge on the bell icon
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="community">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Live Community
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2">
                    You're not alone! See who's grinding with you:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Live User Count:</strong> Green indicator shows
                      how many hunters are active (last 5 minutes)
                    </li>
                    <li>
                      <strong>Navbar Display:</strong> Desktop users see count
                      in top navigation. Hover and click the X to hide it if
                      distracting. Click the eye icon to show it again.
                    </li>
                    <li>
                      <strong>Footer Display:</strong> Mobile users see count at
                      the bottom (always visible)
                    </li>
                    <li>
                      <strong>Profile Stats:</strong> View detailed community
                      activity on your Profile page
                    </li>
                    <li>
                      <strong>Auto-Updates:</strong> Count refreshes every 30
                      seconds automatically
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">
                    💪 Grinding solo or with others - you've got this!
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Account & Security
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2">Your account security features:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Email Verification:</strong> Verify your email
                      after signup for added security
                    </li>
                    <li>
                      <strong>Social Login:</strong> Sign in with Google, Apple,
                      or Twitter for convenience
                    </li>
                    <li>
                      <strong>Account Linking:</strong> Link multiple auth
                      methods to one account
                    </li>
                    <li>
                      <strong>Password Change:</strong> Update your password
                      anytime from Profile → Security Settings
                    </li>
                    <li>
                      <strong>Remember Me:</strong> Stay logged in across
                      browser sessions
                    </li>
                    <li>
                      <strong>Account Deletion:</strong> Permanently delete your
                      account and data if needed
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-500">
                    ⚠️ We NEVER ask for wallet addresses or private keys!
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="best-practices">
                <AccordionTrigger className="text-lg font-medium">
                  Pro Tips & Best Practices
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2 font-medium">Task Management:</p>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>
                      <strong>Add thumbnail URLs</strong> to make your task
                      cards more recognizable
                    </li>
                    <li>
                      <strong>Set appropriate intensity levels</strong> to help
                      prioritize your time
                    </li>
                    <li>
                      <strong>Use descriptive titles</strong> that clearly
                      identify the project
                    </li>
                    <li>
                      <strong>Set deadlines</strong> for time-sensitive airdrops
                    </li>
                  </ul>

                  <p className="mb-2 font-medium">Maximize Efficiency:</p>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>
                      <strong>Check daily</strong> to maintain streaks and
                      completion rates
                    </li>
                    <li>
                      <strong>Explore new airdrops</strong> weekly to find
                      opportunities
                    </li>
                    <li>
                      <strong>Complete easy tasks first</strong> for quick wins
                    </li>
                    <li>
                      <strong>Read notifications</strong> to stay updated
                    </li>
                  </ul>

                  <p className="mb-2 font-medium">Level Up Faster:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Maintain daily streaks</strong> for bonus XP
                    </li>
                    <li>
                      <strong>Complete all tasks</strong> for 100% daily
                      completion
                    </li>
                    <li>
                      <strong>Unlock achievements</strong> for extra rewards
                    </li>
                    <li>
                      <strong>Stay active</strong> to contribute to community
                      stats
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <DrawerFooter className="flex-shrink-0 border-t bg-background pt-4 pb-8 px-4 lg:px-6">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close Guidelines
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
