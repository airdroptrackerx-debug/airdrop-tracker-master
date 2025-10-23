export const applyTheme = (theme: 'light' | 'dark') => {
  const root = document.documentElement;
  root.className = theme;
  root.style.colorScheme = theme;
  localStorage.setItem('theme', theme);
};

export const getSavedTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
};
