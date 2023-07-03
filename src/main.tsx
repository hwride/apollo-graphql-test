import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // Disabling strict mode because the double rendering causing some confusing
  // logging, e.g. onQueryUpdated was logging the same query twice even with
  // React DevTools strict mode double logging disabled.
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)
