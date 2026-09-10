import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Catch any global errors (including Leaflet internal async errors) that
// React's ErrorBoundary cannot catch (errors in timers, animation frames, etc.)
window.addEventListener('error', (e) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="background:#090E0B;color:#10B981;font-family:monospace;padding:40px;min-height:100vh">
      <h1 style="color:#ef4444;margin-bottom:16px">⚠ GLOBAL JS ERROR</h1>
      <pre style="color:#ef4444;font-size:12px;background:#111813;padding:16px;word-break:break-word;white-space:pre-wrap">${e.message}\n\n${e.filename}:${e.lineno}</pre>
    </div>`;
  }
});

window.addEventListener('unhandledrejection', (e) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="background:#090E0B;color:#10B981;font-family:monospace;padding:40px;min-height:100vh">
      <h1 style="color:#ef4444;margin-bottom:16px">⚠ UNHANDLED PROMISE REJECTION</h1>
      <pre style="color:#ef4444;font-size:12px;background:#111813;padding:16px;word-break:break-word;white-space:pre-wrap">${String(e.reason)}</pre>
    </div>`;
  }
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('App crashed:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#090E0B', color: '#10B981', fontFamily: 'monospace', padding: '40px', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '18px', marginBottom: '16px' }}>⚠ SYSTEM CRASH — ERROR BOUNDARY TRIGGERED</h1>
          <pre style={{ color: '#ef4444', fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#111813', padding: '20px', borderRadius: '4px' }}>
            {this.state.error?.toString()}{'\n\n'}{this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)
