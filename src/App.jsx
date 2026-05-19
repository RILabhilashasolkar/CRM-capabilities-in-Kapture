import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import TicketList from './components/tickets/TicketList'
import ServiceOrdersView from './components/serviceOrders/ServiceOrdersView'

function App() {
  const [activeSection, setActiveSection] = useState('tickets')
  const [activeView, setActiveView] = useState('All Pending')

  const handleSectionChange = (section) => {
    setActiveSection(section)
    if (section === 'tickets') setActiveView('All Pending')
    if (section === 'serviceOrders') setActiveView('so-dashboard')
  }

  const handleViewChange = (view) => {
    setActiveView(view)
  }

  const headerTitle = activeSection === 'serviceOrders' ? 'Service Orders — CRM' : 'Tickets'

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f0f2f5' }}>
        <Header title={headerTitle} />
        <div style={{ flex: 1, overflow: 'hidden', background: 'white' }}>
          {activeSection === 'tickets' && (
            <TicketList view={activeView} />
          )}
          {activeSection === 'serviceOrders' && (
            <ServiceOrdersView activeView={activeView} onViewChange={handleViewChange} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
