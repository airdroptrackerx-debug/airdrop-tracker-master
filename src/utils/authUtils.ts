export function getExperienceLevel(taskCount: number): string {
  if (taskCount === 0) return 'Beginner';
  if (taskCount < 5) return 'Novice';
  if (taskCount < 10) return 'Intermediate';
  if (taskCount < 20) return 'Advanced';
  return 'Expert';
}
