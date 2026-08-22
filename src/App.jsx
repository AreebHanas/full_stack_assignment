import React, { useState, useEffect } from 'react';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showLogoutOverlay, setShowLogoutOverlay] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  const [user, setUser] = useState({
    name: 'Sarah Connor',
    email: 'sarah.connor@syncboard.io',
    role: 'Project Manager (Member 9)',
    bio: 'Lead coordinator for Member 9 operations at SyncBoard. Focused on scrum execution, component design, and collaborative dashboard components. Let\'s build something clean and functional!',
    avatar: './assets/avatar_profile.png'
  });

  const [settings, setSettings] = useState({
    darkMode: false,
    taskNotifications: true,
    emailNotifications: true
  });

  // Modal Passwords input states
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [isChangingPass, setIsChangingPass] = useState(false);

  // --- INITIALIZATION / PERSISTENCE ---
  useEffect(() => {
    // Load config states from localStorage
    const savedUser = localStorage.getItem('sb_user_profile');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { console.error(e); }
    }

    const savedSettings = localStorage.getItem('sb_user_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        document.documentElement.setAttribute('data-theme', parsed.darkMode ? 'dark' : 'light');
      } catch (e) { console.error(e); }
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSettings(prev => ({ ...prev, darkMode: prefersDark }));
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Sync settings theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
    localStorage.setItem('sb_user_settings', JSON.stringify(settings));
  }, [settings]);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('sb_user_profile', JSON.stringify(updatedUser));
  };

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // --- TOAST SYSTEMS ---
  const addToast = (title, msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, msg, type }]);
    
    // Auto dismiss after 4.5s
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- PASSWORD ACTIONS ---
  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      addToast('Incomplete Form', 'Please fill in all requested password coordinates.', 'error');
      return;
    }
    if (passwords.new.length < 8) {
      addToast('Weak Password', 'New password must contain at least 8 characters.', 'error');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      addToast('Password Mismatch', 'New and Confirmation passwords do not match.', 'error');
      return;
    }

    setIsChangingPass(true);
    setTimeout(() => {
      setIsChangingPass(false);
      setShowPassModal(false);
      setPasswords({ current: '', new: '', confirm: '' });
      addToast('Security Restructured', 'Your account credentials password updated successfully.', 'success');
    }, 1200);
  };

  const togglePasswordVisibility = (key) => {
    setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Logout actions
  const triggerLogoutSeq = () => {
    setShowLogoutOverlay(true);
  };

  const handleLoginBack = () => {
    setShowLogoutOverlay(false);
    setActiveTab('profile');
    addToast('Logged Back In', 'Session reconstructed. Welcome back to SyncBoard workspace!', 'success');
  };

  return (
    <div className="app-container">
      
      {/* 1. SIDEBAR Navigation */}
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`} id="app-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4" />
            </svg>
          </div>
          <div className="logo-text">SyncBoard <span className="logo-badge">M9</span></div>
        </div>

        <ul className="sidebar-menu">
          <li className="menu-label">Workspace</li>
          <li>
            <button className="menu-item disabled" disabled title="Feature coming soon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button className="menu-item disabled" disabled>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              <span>Tasks</span>
            </button>
          </li>
          <li>
            <button className="menu-item disabled" disabled>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span>Boards</span>
            </button>
          </li>
          <li>
            <button className="menu-item disabled" disabled>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>Members</span>
            </button>
          </li>
          
          <li className="menu-label" style={{ marginTop: '15px' }}>Preferences</li>
          <li>
            <button 
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setIsMobileOpen(false); }}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Profile</span>
            </button>
          </li>
          <li>
            <button 
              className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => { setActiveTab('settings'); setIsMobileOpen(false); }}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Settings</span>
            </button>
          </li>
        </ul>
        
        <div className="sidebar-footer">
          <button className="logout-btn-sidebar" onClick={triggerLogoutSeq}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Sidebar background drawer overlay on mobile screens */}
      {isMobileOpen && (
        <div className="sidebar-overlay active" onClick={() => setIsMobileOpen(false)}></div>
      )}

      {/* 2. MAIN HEADER & Body Layout */}
      <main className="main-wrapper">
        <header className="top-header">
          <div className="top-header-left">
            <button className="mobile-toggle" onClick={() => setIsMobileOpen(true)} aria-label="Toggle Navigation">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <nav className="breadcrumb">
              <span>SyncBoard</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">
                {activeTab === 'profile' ? 'User Profile' : 'Settings'}
              </span>
            </nav>
          </div>

          <div className="top-header-right">
            <div className="header-search">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input type="text" placeholder="Search tasks, boards..." defaultValue="" />
            </div>
            
            <button className="header-icon-badge" aria-label="Inbox notification alerts">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span className="badge-dot"></span>
            </button>
            
            <div className="header-user-status">
              <div className="header-user-avatar">
                <img src={user.avatar} alt="User avatar thumbnail" />
                <span className="header-user-status-dot"></span>
              </div>
              <div className="header-user-info">
                <span className="header-username">{user.name}</span>
                <span className="header-userrole">{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        <section className="content-body">
          <header className="content-header">
            <h1>{activeTab === 'profile' ? 'User Profile' : 'Settings & Preferences'}</h1>
            <p>
              {activeTab === 'profile' 
                ? 'Manage your SyncBoard profile and credentials information.' 
                : 'Monitor appearance styles, notifications status, and team credentials details.'
              }
            </p>
          </header>

          {/* PAGE ROUTER RENDERING */}
          {activeTab === 'profile' ? (
            <Profile user={user} onUserUpdate={handleUserUpdate} addToast={addToast} />
          ) : (
            <Settings 
              settings={settings} 
              onSettingsChange={handleSettingsChange}
              onChangePasswordClick={() => setShowPassModal(true)}
              onLogoutClick={triggerLogoutSeq}
              addToast={addToast}
            />
          )}
        </section>
      </main>

      {/* 3. TOAST MESSAGES */}
      <div id="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type} toast-in`}>
            <div className="toast-icon">
              {toast.type === 'success' ? (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : toast.type === 'error' ? (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              ) : (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
            </div>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-msg">{toast.msg}</div>
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* 4. PASSWORD CHANGE MODAL */}
      {showPassModal && (
        <div className="modal-overlay active">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Change Account Password</h3>
              <button className="modal-close" onClick={() => setShowPassModal(false)}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handlePasswordChangeSubmit}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div className="form-group">
                    <label htmlFor="pass-current" className="form-label">Current Password</label>
                    <div className="input-password-wrap">
                      <input 
                        type={showPasswords.current ? 'text' : 'password'} 
                        id="pass-current" 
                        className="form-input" 
                        required 
                        placeholder="••••••••" 
                        value={passwords.current}
                        onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                      />
                      <button 
                        type="button" 
                        className="password-toggle-eye" 
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="pass-new" className="form-label">New Password</label>
                    <div className="input-password-wrap">
                      <input 
                        type={showPasswords.new ? 'text' : 'password'} 
                        id="pass-new" 
                        className="form-input" 
                        required 
                        placeholder="••••••••" 
                        value={passwords.new}
                        onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                      />
                      <button 
                        type="button" 
                        className="password-toggle-eye" 
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Must be at least 8 characters long.</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="pass-confirm" className="form-label">Confirm New Password</label>
                    <div className="input-password-wrap">
                      <input 
                        type={showPasswords.confirm ? 'text' : 'password'} 
                        id="pass-confirm" 
                        className="form-input" 
                        required 
                        placeholder="••••••••" 
                        value={passwords.confirm}
                        onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                      />
                      <button 
                        type="button" 
                        className="password-toggle-eye" 
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPassModal(false)}>Cancel</button>
                <button type="submit" className={`btn btn-primary ${isChangingPass ? 'btn-loading' : ''}`}>
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. LOGOUT CONFIRMED OVERLAY */}
      <div className={`logout-overlay ${showLogoutOverlay ? 'active' : ''}`}>
        <div className="logout-card">
          <div className="logout-anim-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </div>
          <h2>Successfully Logged Out</h2>
          <p>Your SyncBoard local session has been terminated.</p>
          <button className="login-again-btn" onClick={handleLoginBack}>Log Back In</button>
        </div>
      </div>

    </div>
  );
}
