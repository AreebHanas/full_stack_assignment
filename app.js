/**
 * SyncBoard Dashboard Interactive Operations
 * Native JavaScript logic for navigation, storage, toggles, themes, overlays, and toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  const state = {
    user: {
      name: 'Sarah Connor',
      email: 'sarah.connor@syncboard.io',
      role: 'Project Manager (Member 9)',
      bio: 'Lead coordinator for Member 9 operations at SyncBoard. Focused on scrum execution, component design, and collaborative dashboard components. Let\'s build something clean and functional!',
      avatar: './assets/avatar_profile.png'
    },
    settings: {
      darkMode: false,
      taskNotifications: true,
      emailNotifications: true,
      pushNotifications: false
    }
  };

  // --- HTML ELEMENTS RETRIEVAL ---
  const DOM = {
    // Navigation
    navProfileBtn: document.getElementById('nav-profile'),
    navSettingsBtn: document.getElementById('nav-settings'),
    sidebarItems: document.querySelectorAll('.sidebar-menu .menu-item:not(.disabled)'),
    breadcrumbActive: document.getElementById('breadcrumb-active'),
    pageTitle: document.getElementById('page-heading-title'),
    pageDesc: document.getElementById('page-heading-desc'),
    
    // Page views
    viewProfile: document.getElementById('view-profile'),
    viewSettings: document.getElementById('view-settings'),
    
    // Profile Elements
    profileForm: document.getElementById('profile-edit-form'),
    profileNameInput: document.getElementById('profile-name'),
    profileEmailInput: document.getElementById('profile-email'),
    profileRoleInput: document.getElementById('profile-role'),
    profileBioInput: document.getElementById('profile-bio'),
    profileSubmitBtn: document.getElementById('profile-submit'),
    
    // Profile Display Cards
    cardAvatarImg: document.getElementById('card-avatar-img'),
    cardProfileName: document.getElementById('card-profile-name'),
    cardProfileEmail: document.getElementById('card-profile-email'),
    cardProfileRole: document.getElementById('card-profile-role'),
    headerAvatarImg: document.getElementById('header-avatar-img'),
    headerUsername: document.getElementById('header-username'),
    headerUserrole: document.getElementById('header-userrole'),
    
    // Image Upload
    avatarFileWrap: document.getElementById('avatar-edit-overlay'),
    avatarFileInput: document.getElementById('avatar-file-input'),

    // Settings Toggle Elements
    toggleDarkModeSlider: document.getElementById('dark-mode-toggle'),
    themeOptionLight: document.getElementById('theme-option-light'),
    themeOptionDark: document.getElementById('theme-option-dark'),
    toggleTaskNotif: document.getElementById('toggle-task-notifications'),
    toggleEmailNotif: document.getElementById('toggle-email-notifications'),
    
    // Security & Account
    btnChangePasswordTrigger: document.getElementById('btn-change-password'),
    btnLogoutSettings: document.getElementById('btn-logout-settings'),
    btnLogoutSidebar: document.getElementById('btn-logout-sidebar'),
    
    // Password Modal
    passModal: document.getElementById('password-modal'),
    passModalClose: document.getElementById('password-modal-close'),
    passModalCancel: document.getElementById('password-modal-cancel'),
    passForm: document.getElementById('password-change-form'),
    passInputCurrent: document.getElementById('pass-current'),
    passInputNew: document.getElementById('pass-new'),
    passInputConfirm: document.getElementById('pass-confirm'),
    
    // Responsive sidebar
    mobileToggle: document.getElementById('mobile-toggle-btn'),
    sidebar: document.getElementById('app-sidebar'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    
    // Toasts & Dialogs
    toastContainer: document.getElementById('toast-container'),
    logoutOverlay: document.getElementById('logout-overlay'),
    btnLoginAgain: document.getElementById('btn-login-again')
  };

  // --- INITIALIZATION ---
  function init() {
    loadSessionData();
    applyTheme(state.settings.darkMode ? 'dark' : 'light');
    syncUiWithState();
    setupEventListeners();
  }

  // --- CORE STORAGE AND SESSION SYNC ---
  function loadSessionData() {
    // Load profile configurations
    const savedUser = localStorage.getItem('sb_user_profile');
    if (savedUser) {
      try {
        state.user = { ...state.user, ...JSON.parse(savedUser) };
      } catch (err) {
        console.error('Failed to parse saved user data:', err);
      }
    }
    
    // Load system settings configurations
    const savedSettings = localStorage.getItem('sb_user_settings');
    if (savedSettings) {
      try {
        state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
      } catch (err) {
        console.error('Failed to parse saved settings:', err);
      }
    } else {
      // Respect user's system preferences initially if not defined
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      state.settings.darkMode = prefersDark;
    }
  }

  function saveProfileData() {
    localStorage.setItem('sb_user_profile', JSON.stringify(state.user));
  }

  function saveSettingsData() {
    localStorage.setItem('sb_user_settings', JSON.stringify(state.settings));
  }

  // --- UI SYNC UTILITY ---
  function syncUiWithState() {
    // Sync forms inputs
    DOM.profileNameInput.value = state.user.name;
    DOM.profileEmailInput.value = state.user.email;
    DOM.profileRoleInput.value = state.user.role;
    DOM.profileBioInput.value = state.user.bio;

    // Sync HTML layouts
    updateProfileDisplayCards();
    
    // Sync settings toggles
    DOM.toggleDarkModeSlider.checked = state.settings.darkMode;
    DOM.toggleTaskNotif.checked = state.settings.taskNotifications;
    DOM.toggleEmailNotif.checked = state.settings.emailNotifications;
    
    syncThemeOptionCards(state.settings.darkMode ? 'dark' : 'light');
  }

  function updateProfileDisplayCards() {
    // Left avatar intro card
    DOM.cardAvatarImg.src = state.user.avatar;
    DOM.cardProfileName.textContent = state.user.name;
    DOM.cardProfileEmail.textContent = state.user.email;
    DOM.cardProfileRole.textContent = state.user.role;

    // Header header user summary
    DOM.headerAvatarImg.src = state.user.avatar;
    DOM.headerUsername.textContent = state.user.name;
    DOM.headerUserrole.textContent = state.user.role;
  }

  function syncThemeOptionCards(theme) {
    if (theme === 'dark') {
      DOM.themeOptionDark.classList.add('active');
      DOM.themeOptionLight.classList.remove('active');
    } else {
      DOM.themeOptionLight.classList.add('active');
      DOM.themeOptionDark.classList.remove('active');
    }
  }

  // --- TOAST NOTIFICATIONS MANAGER ---
  function showToast(title, message, type = 'success') {
    // Create new element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Pick custom icon based on type
    let svgIcon = '';
    if (type === 'success') {
      svgIcon = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>`;
    } else if (type === 'error') {
      svgIcon = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
    } else {
      svgIcon = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${svgIcon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close message">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    `;

    DOM.toastContainer.appendChild(toast);

    // Setup clear actions
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));

    // Auto dismiss
    setTimeout(() => {
      dismissToast(toast);
    }, 4500);
  }

  function dismissToast(toast) {
    if (toast && toast.parentNode) {
      toast.classList.add('toast-out');
      setTimeout(() => {
        if (toast.parentNode) {
          DOM.toastContainer.removeChild(toast);
        }
      }, 300);
    }
  }

  // --- INTERACTIVE ROUTING / NAVIGATION ---
  function navigateTo(targetPageId) {
    // Update structural layout rendering
    if (targetPageId === 'profile') {
      DOM.viewProfile.classList.add('active');
      DOM.viewSettings.classList.remove('active');
      
      DOM.navProfileBtn.classList.add('active');
      DOM.navSettingsBtn.classList.remove('active');
      
      DOM.breadcrumbActive.textContent = 'User Profile';
      DOM.pageTitle.textContent = 'User Profile';
      DOM.pageDesc.textContent = 'Manage your SyncBoard profile and credentials information.';
    } else if (targetPageId === 'settings') {
      DOM.viewProfile.classList.remove('active');
      DOM.viewSettings.classList.add('active');
      
      DOM.navProfileBtn.classList.remove('active');
      DOM.navSettingsBtn.classList.add('active');
      
      DOM.breadcrumbActive.textContent = 'Settings';
      DOM.pageTitle.textContent = 'Settings & Preferences';
      DOM.pageDesc.textContent = 'Monitor appearance styles, notifications status, and team credentials details.';
    }

    // Force close mobile drawer navigation
    DOM.sidebar.classList.remove('mobile-open');
    DOM.sidebarOverlay.classList.remove('active');
  }

  // --- THEMATIQUE SWITCHER CONTROL ---
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const isDark = (theme === 'dark');
    state.settings.darkMode = isDark;
    
    // Sync states
    DOM.toggleDarkModeSlider.checked = isDark;
    syncThemeOptionCards(theme);
    saveSettingsData();
  }

  // --- EVENT LISTENERS REGISTRATION ---
  function setupEventListeners() {
    // 1. Sidebar Page Navigation Switchers
    DOM.navProfileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('profile');
    });

    DOM.navSettingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('settings');
    });

    // 2. Responsive Hamburger Mobile Controls
    DOM.mobileToggle.addEventListener('click', () => {
      DOM.sidebar.classList.add('mobile-open');
      DOM.sidebarOverlay.classList.add('active');
    });

    DOM.sidebarOverlay.addEventListener('click', () => {
      DOM.sidebar.classList.remove('mobile-open');
      DOM.sidebarOverlay.classList.remove('active');
    });

    // 3. Profile Avatar Mock Image Upload
    DOM.avatarFileWrap.addEventListener('click', () => {
      DOM.avatarFileInput.click();
    });

    DOM.avatarFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showToast('Invalid File Type', 'Please upload a valid image file formats.', 'error');
          return;
        }
        
        // Read file contents as base64 URL
        const reader = new FileReader();
        reader.onload = function(evt) {
          state.user.avatar = evt.target.result;
          DOM.cardAvatarImg.src = state.user.avatar;
          DOM.headerAvatarImg.src = state.user.avatar;
          saveProfileData();
          showToast('Avatar Adjusted', 'Your profile image has been successfully updated.', 'success');
        };
        reader.readAsDataURL(file);
      }
    });

    // 4. Submit Profile Changes Operations
    DOM.profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validation check
      const name = DOM.profileNameInput.value.trim();
      const email = DOM.profileEmailInput.value.trim();
      const role = DOM.profileRoleInput.value.trim();
      const bio = DOM.profileBioInput.value.trim();

      if (!name || !email) {
        showToast('Required Fields', 'Full Name and Email Address are strictly required.', 'error');
        return;
      }

      // Start button loading visual cues
      DOM.profileSubmitBtn.classList.add('btn-loading');
      
      // Simulate backend save timer delay
      setTimeout(() => {
        state.user.name = name;
        state.user.email = email;
        state.user.role = role;
        state.user.bio = bio;

        saveProfileData();
        updateProfileDisplayCards();
        
        DOM.profileSubmitBtn.classList.remove('btn-loading');
        showToast('Changes Saved', 'Your user profile details have been securely recorded.', 'success');
      }, 1000);
    });

    // Reset profile button trigger
    DOM.profileForm.querySelector('.btn-secondary').addEventListener('click', (e) => {
      e.preventDefault();
      // Restore initial inputs state
      DOM.profileNameInput.value = state.user.name;
      DOM.profileEmailInput.value = state.user.email;
      DOM.profileRoleInput.value = state.user.role;
      DOM.profileBioInput.value = state.user.bio;
      showToast('Form Reset', 'Reverted form values to original state.', 'info');
    });

    // 5. Apperance/Theme Toggling Modes
    // Toggle switch slider
    DOM.toggleDarkModeSlider.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      applyTheme(theme);
      showToast(`${e.target.checked ? 'Dark' : 'Light'} Mode Active`, `Switched background workspace appearance to ${theme} mode.`, 'info');
    });

    // Quick light theme card option
    DOM.themeOptionLight.addEventListener('click', () => {
      if (state.settings.darkMode) {
        applyTheme('light');
        showToast('Light Mode Active', 'Switched background workspace appearance to light mode.', 'info');
      }
    });

    // Quick dark theme card option
    DOM.themeOptionDark.addEventListener('click', () => {
      if (!state.settings.darkMode) {
        applyTheme('dark');
        showToast('Dark Mode Active', 'Switched background workspace appearance to dark mode.', 'info');
      }
    });

    // 6. Notifications Switch Toggles
    DOM.toggleTaskNotif.addEventListener('change', (e) => {
      state.settings.taskNotifications = e.target.checked;
      saveSettingsData();
      showToast('Notifications Configured', `Task notifications have been ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
    });

    DOM.toggleEmailNotif.addEventListener('change', (e) => {
      state.settings.emailNotifications = e.target.checked;
      saveSettingsData();
      showToast('Notifications Configured', `Weekly digest email settings ${e.target.checked ? 'activated' : 'deactivated'}.`, 'info');
    });

    // 7. Security Action Triggers
    // Change password modal show
    DOM.btnChangePasswordTrigger.addEventListener('click', () => {
      DOM.passModal.classList.add('active');
      DOM.passInputCurrent.focus();
    });

    // Change password modal hides actions
    const hidePassModal = () => {
      DOM.passModal.classList.remove('active');
      DOM.passForm.reset();
    };

    DOM.passModalClose.addEventListener('click', hidePassModal);
    DOM.passModalCancel.addEventListener('click', hidePassModal);
    DOM.passModal.addEventListener('click', (e) => {
      if (e.target === DOM.passModal) {
        hidePassModal();
      }
    });

    // Handle Password Eye Toggles
    const eyeBtns = DOM.passForm.querySelectorAll('.password-toggle-eye');
    eyeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const inputId = btn.getAttribute('data-input-id');
        const inputField = document.getElementById(inputId);
        if (inputField) {
          const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
          inputField.setAttribute('type', type);
          
          // Switch SVG path icons
          if (type === 'text') {
            btn.innerHTML = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>`;
          } else {
            btn.innerHTML = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`;
          }
        }
      });
    });

    // Password change submission
    DOM.passForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentPass = DOM.passInputCurrent.value;
      const newPass = DOM.passInputNew.value;
      const confirmPass = DOM.passInputConfirm.value;

      if (!currentPass || !newPass || !confirmPass) {
        showToast('Incomplete Form', 'Please fill in all requested password coordinates.', 'error');
        return;
      }

      if (newPass.length < 8) {
        showToast('Weak Password', 'New password must contain at least 8 characters.', 'error');
        return;
      }

      if (newPass !== confirmPass) {
        showToast('Password Mismatch', 'New and Confirmation passwords do not match.', 'error');
        return;
      }

      // Dynamic feedback submit loader
      const submitBtn = DOM.passForm.querySelector('button[type="submit"]');
      submitBtn.classList.add('btn-loading');

      setTimeout(() => {
        submitBtn.classList.remove('btn-loading');
        hidePassModal();
        showToast('Security Restructured', 'Your account credentials password updated successfully.', 'success');
      }, 1200);
    });

    // 8. Logout Actions Triggers (from account card or sidebar footer)
    const triggerLogoutSequence = () => {
      DOM.logoutOverlay.classList.add('active');
    };

    DOM.btnLogoutSettings.addEventListener('click', triggerLogoutSequence);
    DOM.btnLogoutSidebar.addEventListener('click', (e) => {
      e.preventDefault();
      triggerLogoutSequence();
    });

    DOM.btnLoginAgain.addEventListener('click', () => {
      DOM.logoutOverlay.classList.remove('active');
      navigateTo('profile');
      showToast('Logged Back In', 'Session reconstructed. Welcome back to SyncBoard workspace!', 'success');
    });
  }

  // --- EXECUTE INITIALIZATION ---
  init();
});
