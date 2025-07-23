import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import OuterContainer from '../components/OuterContainer';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isDirty } 
  } = useForm();

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API call
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        setProfile(data);
        reset(data); // Initialize form with fetched data
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      // Replace with your actual API call
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <OuterContainer>
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
          >
            <FiEdit2 size={16} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                reset(profile);
                setIsEditing(false);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              <FiX size={16} /> Cancel
            </button>
            <button
              form="profileForm"
              type="submit"
              disabled={!isDirty || isLoading}
              className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 disabled:opacity-50"
            >
              <FiCheck size={16} /> {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <form id="profileForm" onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
            <FiUser className="mr-2" /> Name
          </label>
          {isEditing ? (
            <input
              type="text"
              {...register('name', { 
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
          ) : (
            <p className="px-3 py-2 border border-transparent">{profile?.name}</p>
          )}
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
            <FiMail className="mr-2" /> Email
          </label>
          {isEditing ? (
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: { 
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
          ) : (
            <p className="px-3 py-2 border border-transparent">{profile?.email}</p>
          )}
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
            <FiPhone className="mr-2" /> Phone
          </label>
          {isEditing ? (
            <input
              type="tel"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: 'Please enter a valid phone number'
                }
              })}
              className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
          ) : (
            <p className="px-3 py-2 border border-transparent">{profile?.phone}</p>
          )}
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </form>

      {/* Account Info (Non-editable) */}
      <div className="mt-6 pt-4 border-t">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Account Information</h2>
        <div className="text-sm text-gray-600">
          <p>Member since: {new Date(profile?.createdAt).toLocaleDateString()}</p>
          <p className="mt-1">Last updated: {new Date(profile?.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
    </OuterContainer>
  );
}