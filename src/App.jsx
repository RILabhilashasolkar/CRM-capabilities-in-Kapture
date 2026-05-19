import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import TicketList from './components/tickets/TicketList'
import SOUHome from './components/sou/SOUHome'
import RaiseServiceRequest from './components/sou/RaiseServiceRequest'
import TrackServiceRequest from './components/sou/TrackServiceRequest'
import ServiceOrderDetail from './components/sou/ServiceOrderDetail'
import { TrackComplaintPage } from './components/sou/TrackComplaint'

function App() {
  const [activeSection, setActiveSection] = useState('tickets')
  const [activeView, setActiveView] = useState('All Pending')
  // SOU navigation: null = home, 'raise-sr', 'track-sr', 'raise-complaint', 'track-complaint', 'so-detail'
  const [souPage, setSouPage] = useState(null)
  const [souSOId, setSouSOId] = useState(null)

  const handleSectionChange = (section) => {
    setActiveSection(section)
    if (section === 'tickets') setActiveView('All Pending')
    if (section === 'sou') setSouPage(null)
  }

  const handleSOUNavigate = (page, soId) => {
    setSouPage(page)
    if (soId) setSouSOId(soId)
  }

  const handleSOUBack = () => {
    if (souPage === 'so-detail') {
      setSouPage(null)
    } else {
      setSouPage(null)
    }
  }

  const renderSOU = () => {
    switch (souPage) {
      case 'raise-sr':
        return <RaiseServiceRequest onBack={() => setSouPage(null)} />
      case 'track-sr':
        return <TrackServiceRequest onBack={() => setSouPage(null)} />
      case 'track-complaint':
        return <TrackComplaintPage onBack={() => setSouPage(null)} />
      case 'so-detail':
        return <ServiceOrderDetail soId={souSOId} onBack={() => setSouPage(null)} />
      default:
        return <SOUHome onNavigate={handleSOUNavigate} />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {activeSection === 'sou' ? (
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {/* SOU has its own full-screen layout with blue header — no Kapture chrome */}
          {renderSOU()}
          {/* Floating back-to-Kapture pill */}
          <button
            onClick={() => setActiveSection('tickets')}
            style={{
              position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
              background: '#2b2d8a', color: 'white', border: 'none',
              borderRadius: 24, padding: '8px 18px', fontSize: 13,
              fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(43,45,138,0.4)'
            }}
          >
            ← Back to Kapture
          </button>
        </div>
      ) : (
        <>
          <Sidebar
            activeView={activeView}
            onViewChange={setActiveView}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f0f2f5' }}>
            <Header title="Tickets" />
            <div style={{ flex: 1, overflow: 'hidden', background: 'white' }}>
              <TicketList view={activeView} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
