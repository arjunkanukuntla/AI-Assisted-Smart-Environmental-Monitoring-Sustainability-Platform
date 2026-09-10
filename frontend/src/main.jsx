import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

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
