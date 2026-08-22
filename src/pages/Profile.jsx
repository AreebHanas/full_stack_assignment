import React, { useState, useRef } from 'react';

export default function Profile({ user, onUserUpdate, addToast }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
    avatar: user.avatar
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Map ID from input field to key in formData
    const key = id.replace('profile-', '');
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Invalid File Type', 'Please upload a image file format.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64Url = evt.target.result;
        setFormData(prev => ({ ...prev, avatar: base64Url }));
        onUserUpdate({ ...user, avatar: base64Url });
        addToast('Avatar Updated', 'Your profile image has been successfully updated.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      addToast('Required Fields', 'Full Name and Email Address are strictly required.', 'error');
      return;
    }

    setIsSaving(true);
    // Simulate backend update delay
    setTimeout(() => {
      onUserUpdate({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        bio: formData.bio,
        avatar: formData.avatar
      });
      setIsSaving(false);
      addToast('Changes Saved', 'Your user profile details have been securely recorded.', 'success');
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar
    });
    addToast('Form Reset', 'Reverted form values to original state.', 'info');
  };

  return (
    <div id="view-profile" className="page-view active">
      <div className="dashboard-grid">
        
        {/* Left Info Banner Card */}
        <div className="card profile-card-col">
          <div className="profile-banner"></div>
          
          <div className="card-body profile-intro-card">
            {/* Avatar Wrap */}
            <div className="profile-avatar-wrap" onClick={handleAvatarClick} title="Click to upload profile cover image">
              <img id="card-avatar-img" src={formData.avatar} alt={`${formData.name} profile`} />
              <div className="avatar-edit-overlay">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>

            <div className="profile-meta">
              <h3 id="card-profile-name">{formData.name}</h3>
              <p id="card-profile-email">{formData.email}</p>
              
              <span className="member-badge">
                <span className="badge-pulse"></span>
                <span id="card-profile-role">{formData.role || 'Member 9'}</span>
              </span>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span class="stat-num">48</span>
                <span class="stat-lbl">Tasks Done</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">5</span>
                <span class="stat-lbl">Boards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Edit Form Card */}
        <div className="card profile-form-col">
          <div className="card-header">
            <h2 className="card-title">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span>Edit Personal Information</span>
            </h2>
          </div>
          
          <div className="card-body">
            <form onSubmit={handleSubmit} id="profile-edit-form">
              <div className="form-grid">
                
                <div className="form-group">
                  <label htmlFor="profile-name" className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    id="profile-name" 
                    className="form-input" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    placeholder="Full Name" 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="profile-email" class="form-label">Email Address</label>
                  <input 
                    type="email" 
                    id="profile-email" 
                    className="form-input" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    placeholder="user@domain.com" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profile-role" className="form-label">Role / Position</label>
                  <input 
                    type="text" 
                    id="profile-role" 
                    className="form-input" 
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="e.g. Developer, PM" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profile-team" className="form-label">Team Assignment</label>
                  <input 
                    type="text" 
                    id="profile-team" 
                    className="form-input" 
                    disabled 
                    value="Group Project - Team 9" 
                  />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="profile-bio" className="form-label">Bio Description</label>
                  <textarea 
                    id="profile-bio" 
                    className="form-input" 
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Provide a brief summary of yourself..."
                  />
                </div>

              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset Changes</button>
                <button type="submit" className={`btn btn-primary ${isSaving ? 'btn-loading' : ''}`} id="profile-submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
