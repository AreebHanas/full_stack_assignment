import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  return (
    <>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="content">
          <h1>Welcome to SyncBoard</h1>
          <p>Manage your projects and tasks easily.</p>
        </main>
      </div>
    </>
  )
}

export default App
