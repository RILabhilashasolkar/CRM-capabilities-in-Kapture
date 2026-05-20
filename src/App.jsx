import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import TicketList from './components/tickets/TicketList'
import CRMSearch from './components/crm/CRMSearch'
import CRMOrderList from './components/crm/CRMOrderList'
import CRMOrderDetail from './components/crm/CRMOrderDetail'
import CRMSODetail from './components/crm/CRMSODetail'
import CRMCreateSR from './components/crm/CRMCreateSR'
import CRMRaiseComplaint from './components/crm/CRMRaiseComplaint'
import { serviceOrders } from './data/dummyData'

function App() {
  const [section, setSection] = useState('tickets')
  const [ticketView, setTicketView] = useState('All Pending')

  // CRM navigation stack: each entry = { step, ...data }
  const [crmStack, setCrmStack] = useState([{ step: 'search' }])
  const crmState = crmStack[crmStack.length - 1]

  const crmPush = (state) => setCrmStack(prev => [...prev, state])
  const crmBack = () => setCrmStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev)
  const crmReset = () => setCrmStack([{ step: 'search' }])

  const handleSectionChange = (s) => {
    setSection(s)
    if (s === 'crm') crmReset()
    if (s === 'tickets') setTicketView('All Pending')
  }

  // CRM handlers
  const handleSearchResult = (result) => {
    if (result.mode === 'soNumber') {
      crmPush({ step: 'soDetail', so: result.serviceOrder, fromPage: 'soNumber' })
    } else {
      crmPush({ step: 'orderList', result })
    }
  }

  const handleSelectOrder = (order, customer) => {
    crmPush({ step: 'orderDetail', order, customer })
  }

  const handleSelectSO = (so, fromPage) => {
    crmPush({ step: 'soDetail', so, fromPage })
  }

  const handleCreateSR = (order, product) => {
    const customer = crmStack.find(s => s.result?.customer)?.result?.customer
      || crmStack.find(s => s.customer)?.customer
    crmPush({ step: 'createSR', order, product, customer })
  }

  const handleCreateTicket = (order, so) => {
    // For now: navigate back — ticket creation reuses existing flow
    alert(`Creating ticket for ${so ? `Service Order #${so.id}` : `Order ${order?.orderId || ''}`}\n\nIn production: opens Kapture ticket creation with pre-filled order/SO data.`)
  }

  const handleRaiseComplaint = (so) => {
    crmPush({ step: 'raiseComplaint', so })
  }

  const handleSRSuccess = (soId) => {
    // Find or mock the new SO and navigate to its detail
    const newSO = serviceOrders.find(s => s.id === soId) || serviceOrders[0]
    crmPush({ step: 'soDetail', so: newSO, fromPage: 'srSuccess' })
  }

  const handleComplaintSuccess = (compId) => {
    crmBack() // go back to SO detail
  }

  const renderCRM = () => {
    switch (crmState.step) {
      case 'search':
        return <CRMSearch onResult={handleSearchResult} />

      case 'orderList':
        return (
          <CRMOrderList
            result={crmState.result}
            onSelectOrder={handleSelectOrder}
            onSelectSO={handleSelectSO}
            onCreateSR={handleCreateSR}
            onCreateTicket={handleCreateTicket}
            onBack={crmBack}
          />
        )

      case 'orderDetail':
        return (
          <CRMOrderDetail
            order={crmState.order}
            customer={crmState.customer}
            onSelectSO={handleSelectSO}
            onCreateSR={handleCreateSR}
            onCreateTicket={handleCreateTicket}
            onBack={crmBack}
          />
        )

      case 'soDetail':
        return (
          <CRMSODetail
            so={crmState.so}
            fromPage={crmState.fromPage}
            onRaiseComplaint={handleRaiseComplaint}
            onCreateTicket={handleCreateTicket}
            onBack={crmBack}
          />
        )

      case 'createSR':
        return (
          <CRMCreateSR
            order={crmState.order}
            product={crmState.product}
            customer={crmState.customer}
            onBack={crmBack}
            onSuccess={handleSRSuccess}
          />
        )

      case 'raiseComplaint':
        return (
          <CRMRaiseComplaint
            so={crmState.so}
            onBack={crmBack}
            onSuccess={handleComplaintSuccess}
          />
        )

      default:
        return <CRMSearch onResult={handleSearchResult} />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        activeSection={section}
        onSectionChange={handleSectionChange}
        activeView={ticketView}
        onViewChange={setTicketView}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header title={section === 'crm' ? 'Orders & Service' : 'Tickets'} />
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {section === 'tickets' && <TicketList view={ticketView} />}
          {section === 'crm' && renderCRM()}
          {section !== 'tickets' && section !== 'crm' && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 14 }}>
              {section.charAt(0).toUpperCase() + section.slice(1)} section coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
