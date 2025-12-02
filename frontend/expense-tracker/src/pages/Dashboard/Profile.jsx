import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  FiEdit3, FiSave, FiUpload, FiUser, 
  FiPhone, FiMail, FiBriefcase 
} from 'react-icons/fi';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', job: '', phone: '', email: '', avatar: 'avatar1'
  });
  const [loading, setLoading] = useState(false);

  const avatars = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6'];

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/profile/${user?.id || 'vishalkamath'}`
      );
      setProfile(res.data);

      if (res.data) {
        setFormData(res.data);
        setEditing(false);
      } else {
        setEditing(true); 
      }
    } catch (error) {
      console.log('No profile yet, show add form');
      setEditing(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/profile', { 
        ...formData, 
        userId: user?.id || 'vishalkamath' 
      });

      setProfile(formData);
      setEditing(false);
      alert('Profile saved! 🎉');
    } catch (error) {
      alert('Error saving profile');
    }

    setLoading(false);
  };

  const toggleEdit = () => {
    // If profile doesn't exist, let the button create a new one
    if (!profile) {
      setEditing(true);
      return;
    }
    setEditing(!editing);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto space-y-8'>
        
        {/* Header */}
        <div className='text-center'>
          <div className='w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 shadow-2xl flex items-center justify-center'>
            <img 
              src={`/avatars/${formData.avatar || 'avatar1'}.jpg`} 
              alt="Avatar" 
              className='w-24 h-24 rounded-full object-cover shadow-lg'
            />
          </div>

          <h1 className='text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4'>
            Profile
          </h1>

          <p className='text-xl text-gray-600 max-w-md mx-auto'>
            {profile ? 'Edit your information' : 'Create your profile'}
          </p>
        </div>

        {/* Card */}
        <div className='bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50'>
          
          {/* Edit Button */}
          <div className='flex justify-center mb-8'>
            <button 
              onClick={toggleEdit} 
              className='px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2'
            >
              {editing ? <FiSave /> : <FiEdit3 />}
              {editing ? 'Save Profile' : profile ? 'Edit Profile' : 'Add Profile'}
            </button>
          </div>

          {/* ---------------------------- */}
          {/* --------- EDIT MODE -------- */}
          {/* ---------------------------- */}
          {editing ? (
            <form onSubmit={handleSubmit} className='max-w-md mx-auto space-y-6'>

              {/* Avatar Picker */}
              <div>
                <label className='block text-lg font-semibold mb-3 flex items-center gap-2'>
                  <FiUpload /> Profile Avatar
                </label>
                <div className='grid grid-cols-6 gap-3 mb-4'>
                  {avatars.map((av, i) => (
                    <label key={i} className='cursor-pointer'>
                      <input
                        type='radio'
                        name='avatar'
                        value={av}
                        className='hidden'
                        onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                        checked={formData.avatar === av}
                      />
                      <img 
                        src={`/avatars/${av}.jpg`} 
                        className={`w-16 h-16 rounded-full object-cover shadow-md hover:shadow-xl transition-all 
                          ${formData.avatar === av ? 'ring-4 ring-blue-500' : ''}`}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Fields */}
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                    <FiUser /> Full Name
                  </label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className='w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter your full name'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                    <FiMail /> Email
                  </label>
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className='w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                    <FiPhone /> Phone Number
                  </label>
                  <input
                    type='tel'
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className='w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                    <FiBriefcase /> Job Title
                  </label>
                  <input
                    type='text'
                    value={formData.job}
                    onChange={(e) => setFormData({...formData, job: e.target.value})}
                    className='w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-lg'
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>

            </form>

          ) : 
          
          /* ---------------------------- */
          /* -------- VIEW MODE --------- */
          /* ---------------------------- */
          profile ? (
            <div className='max-w-md mx-auto space-y-8 text-center'>

              <div className='w-48 h-48 mx-auto mb-8'>
                <img 
                  src={`/avatars/${profile.avatar}.jpg`} 
                  alt="Profile" 
                  className='w-full h-full rounded-full object-cover shadow-2xl border-8 border-white'
                />
              </div>

              <div className='space-y-4'>
                <h2 className='text-4xl font-bold text-gray-800'>{profile.name}</h2>
                <p className='text-2xl text-blue-600 font-semibold'>{profile.job}</p>

                <div className='grid md:grid-cols-2 gap-6 mt-8'>
                  
                  <div className='p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200'>
                    <div className='flex items-center gap-3 mb-2'>
                      <FiMail className='text-2xl text-blue-600' />
                      <span className='font-semibold text-gray-700'>Email:</span>
                    </div>
                    <p className='text-xl text-gray-900'>{profile.email}</p>
                  </div>

                  <div className='p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200'>
                    <div className='flex items-center gap-3 mb-2'>
                      <FiPhone className='text-2xl text-emerald-600' />
                      <span className='font-semibold text-gray-700'>Phone:</span>
                    </div>
                    <p className='text-xl text-gray-900'>{profile.phone || 'Not provided'}</p>
                  </div>

                </div>
              </div>
            </div>

          ) : (

            /* ---------------------------- */
            /* ---- NO PROFILE YET -------- */
            /* ---------------------------- */
            <div className="text-center text-lg text-gray-600 py-12">
              No profile found. Click <b>Add Profile</b> to create one.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
