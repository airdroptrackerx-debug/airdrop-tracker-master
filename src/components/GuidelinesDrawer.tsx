
import React from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface GuidelinesDrawerProps {
  children: React.ReactNode;
}

export default function GuidelinesDrawer({ children }: GuidelinesDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] overflow-auto">
        <div className="container mx-auto max-w-3xl">
          <DrawerHeader>
            <DrawerTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              App Guidelines
            </DrawerTitle>
            <DrawerDescription>
              Learn how to use the Airdrop Tracker app effectively
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 lg:p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Welcome to Airdrop Tracker</h3>
              <p className="text-muted-foreground">
                This app helps you stay on top of your crypto airdrop tasks, ensuring you never miss an opportunity to earn rewards.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="getting-started">
                <AccordionTrigger className="text-lg font-medium">Getting Started</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2">To start tracking your airdrops:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Create an account or sign in</li>
                    <li>Click the <strong>"Add Task"</strong> button in the header</li>
                    <li>Fill in the details of your airdrop task</li>
                    <li>Save the task to start tracking it</li>
                  </ol>
                  <p className="mt-2">
                    The more tasks you add, the better overview you'll have of all your opportunities.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="task-management">
                <AccordionTrigger className="text-lg font-medium">Task Management</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2">Each task card represents an airdrop opportunity:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Mark tasks as complete when you've performed the required action</li>
                    <li>Edit tasks to update their details</li>
                    <li>Delete tasks you're no longer interested in</li>
                    <li>Click on the task title to visit the related website</li>
                  </ul>
                  <p className="mt-2">
                    Tasks are color-coded by intensity - green for easy tasks, yellow for medium, and red for hard tasks that require more effort.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="timers">
                <AccordionTrigger className="text-lg font-medium">Timer Types</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="mb-2">Choose the right timer for your task:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Daily:</strong> For tasks you need to complete once every day
                    </li>
                    <li>
                      <strong>Weekly:</strong> For tasks required once a week
                    </li>
                    <li>
                      <strong>Monthly:</strong> For tasks needed once a month
                    </li>
                    <li>
                      <strong>Custom:</strong> Set a specific hour interval for specialized tasks
                    </li>
                  </ul>
                  <p className="mt-2">
                    The progress bar on each task shows time remaining until the task is due again.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="stats-tracking">
                <AccordionTrigger className="text-lg font-medium">Stats & Progress</AccordionTrigger>
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
                    Higher completion rates increase your chances of qualifying for airdrops, as many projects reward consistent participation.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="best-practices">
                <AccordionTrigger className="text-lg font-medium">Best Practices</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Add thumbnail URLs</strong> to make your task cards more recognizable
                    </li>
                    <li>
                      <strong>Set appropriate intensity levels</strong> to help prioritize your time
                    </li>
                    <li>
                      <strong>Complete tasks regularly</strong> to maintain high completion rates
                    </li>
                    <li>
                      <strong>Check the app daily</strong> to see which tasks need attention
                    </li>
                    <li>
                      <strong>Add descriptive titles</strong> that clearly identify the project
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close Guidelines</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
