import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Load test utilities in development
if (import.meta.env.DEV) {
  import('./utils/testUtils');
}

createRoot(document.getElementById("root")!).render(<App />);
