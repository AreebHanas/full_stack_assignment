import React from 'react';

export default function Settings({ settings, onSettingsChange, onChangePasswordClick, onLogoutClick, addToast }) {
  
  const handleToggle = (key, friendlyName) => {
    const newValue = !settings[key];
    onSettingsChange(key, newValue);
    addToast(
      'Settings Configured', 
      `${friendlyName} has been successfully ${newValue ? 'activated' : 'deactivated'}.`, 
      'info'
    );
  };

  const handleModeCardClick = (targetMode) => {
    const isDark = targetMode === 'dark';
    if (settings.darkMode !== isDark) {
      onSettingsChange('darkMode', isDark);
      addToast(
        `${isDark ? 'Dark' : 'Light'} Mode Active`, 
        `Switched background workspace appearance to ${targetMode} mode.`, 
        'info'
      );
    }
  };

  return (
    <div id="view-settings" className="page-view active">
      <div className="settings-grid">
        
        {/* Appearance & Mode Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
              </svg>
              <span>Appearance & Mode</span>
            </h2>
          </div>
          
          <div className="card-body">
            <div className="settings-row">
              <div className="settings-info">
                <h3 className="settings-title">Dark Mode Toggle</h3>
                <p className="settings-desc">Dynamically switches workspace theme configuration styles using variable attributes.</p>
              </div>
              <div className="settings-action">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    id="dark-mode-toggle"
                    checked={settings.darkMode}
                    onChange={() => handleToggle('darkMode', 'Dark Mode')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-row" style={{ alignItems: 'center' }}>
              <div className="settings-info">
                <h3 className="settings-title">Quick Palette Mode</h3>
                <p className="settings-desc">Select your explicit workspace layout theme quickly using simple target cards.</p>
              </div>
              <div className="settings-action">
                <div className="theme-selector-group">
                  <div 
                    className={`theme-card-option ${!settings.darkMode ? 'active' : ''}`}
                    onClick={() => handleModeCardClick('light')}
                    id="theme-option-light"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"></path>
                    </svg>
                    <span>Light</span>
                  </div>
                  
                  <div 
                    className={`theme-card-option ${settings.darkMode ? 'active' : ''}`}
                    onClick={() => handleModeCardClick('dark')}
                    id="theme-option-dark"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                    <span>Dark</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span>Notification Settings</span>
            </h2>
          </div>
          
          <div className="card-body">
            <div className="settings-row">
              <div className="settings-info">
                <h3 className="settings-title">Task Notifications</h3>
                <p className="settings-desc">Alert me and play dashboard notification audio when a task is updated or assigned to me.</p>
              </div>
              <div className="settings-action">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    id="toggle-task-notifications"
                    checked={settings.taskNotifications}
                    onChange={() => handleToggle('taskNotifications', 'Task Notifications')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <h3 className="settings-title">Email Notifications</h3>
                <p class="settings-desc">Receive weekly dashboard email digests, project summaries, and security alert events.</p>
              </div>
              <div className="settings-action">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    id="toggle-email-notifications"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications', 'Weekly Email digests')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Account Setting & Security Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <span>Account Setting & Security</span>
            </h2>
          </div>
          
          <div className="card-body">
            <div className="settings-row">
              <div className="settings-info">
                <h3 className="settings-title">Change Password</h3>
                <p className="settings-desc">Modifies the security password values used to authenticate current session tokens.</p>
              </div>
              <div className="settings-action">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  id="btn-change-password"
                  onClick={onChangePasswordClick}
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <h3 className="settings-title">Log Out</h3>
                <p className="settings-desc">Explicitly logs out. Destroys browser current environment cache credentials details.</p>
              </div>
              <div className="settings-action">
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  id="btn-logout-settings"
                  onClick={onLogoutClick}
                >
                  Log Out Account
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
