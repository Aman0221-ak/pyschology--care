import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './Profile.css';

const Spinner = () => (
  <div className="spinner-overlay">
    <div className="spinner-circle"></div>
  </div>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const fetchProfile = useCallback(async () => {
    if (!token) {
      return setLoading(false); 
    }

    try {
      const res = await axios.get('http://localhost:8000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.user) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.put("http://localhost:8000/api/users/update-profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.user) {
        setUser(res.data.user);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!image) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await axios.post('http://localhost:8000/api/users/upload-profile-picture', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: res.data.profilePicture,
      }));
      setImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  if (loading) return <Spinner />;

  return (
    <div className="profile-container centered">
      <div className="theme-toggle">
        <button onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="profile-image-top">
        <img
          src={user.profilePicture || '/default-avatar.png'}
          alt="Profile"
          className="profile-picture"
        />
        <div className="button-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button className="change-profile-btn" onClick={handleButtonClick}>
            Change Profile Picture
          </button>
          {image && (
            uploading ? (
              <Spinner />
            ) : (
              <button className="upload-btn" onClick={uploadImage}>Upload</button>
            )
          )}
        </div>
      </div>

      <div className="profile-card">
        <h2 className="user-name">{user.name}</h2>

        <div className="profile-info-vertical">
          {editMode ? (
            <>
              <div className="detail-row"><label>Email</label><input name="email" value={user.email || ''} disabled /></div>
              <div className="detail-row"><label>Phone</label><input name="phone" value={user.phone || ''} onChange={handleChange} /></div>
              <div className="detail-row"><label>Date of Birth</label><input type="date" name="dob" value={user.dob || ''} onChange={handleChange} /></div>
              <div className="detail-row"><label>Nationality</label><input name="nationality" value={user.nationality || ''} onChange={handleChange} /></div>
              <div className="detail-row"><label>Gender</label><input name="gender" value={user.gender || ''} onChange={handleChange} /></div>
              <div className="detail-row"><label>Language</label><input name="language" value={user.language || ''} onChange={handleChange} /></div>
              <div className="detail-row"><label>Time Zone</label><input name="timeZone" value={user.timeZone || ''} onChange={handleChange} /></div>
            </>
          ) : (
            <>
              <div className="detail-row"><label>Email</label><span>{user.email}</span></div>
              <div className="detail-row"><label>Phone</label><span>{user.phone || 'Not provided'}</span></div>
              <div className="detail-row"><label>Date of Birth</label><span>{user.dob || 'Not provided'}</span></div>
              <div className="detail-row"><label>Nationality</label><span>{user.nationality || 'Not provided'}</span></div>
              <div className="detail-row"><label>Gender</label><span>{user.gender || 'Not provided'}</span></div>
              <div className="detail-row"><label>Language</label><span>{user.language || 'Not provided'}</span></div>
              <div className="detail-row"><label>Time Zone</label><span>{user.timeZone || 'Not provided'}</span></div>
            </>
          )}
          <div className="detail-row"><label>Account Created</label><span>{new Date(user.createdAt).toDateString()}</span></div>
          <div className="detail-row"><label>Last Login</label><span>{user.lastLogin || 'Not available'}</span></div>
        </div>

        <div className="profile-buttons">
          {editMode ? (
            saving ? <Spinner /> : (
              <button className="save-button" onClick={saveProfile}>Save</button>
            )
          ) : (
            <button className="edit-button" onClick={() => setEditMode(true)}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
