import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Replace with your API call
        const response = await fetch("/api/service-provider/profile");
        const data = await response.json();

        setProfile(data);
        if (data.location) {
          setLocation({
            latitude: data.location.coordinates[1],
            longitude: data.location.coordinates[0],
          });
        }
        reset(data); // Reset form with fetched data
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const handleLocationChange = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast.success("Location updated successfully");
        },
        (error) => {
          toast.error(`Error getting location: ${error.message}`);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser");
    }
  };

  // Submit form
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const updatedData = {
        ...data,
        workingRadiusInKm: Number(data.workingRadiusInKm),
        location: {
          type: "Point",
          coordinates: [location.longitude, location.latitude],
        },
      };

      // Replace with your API call
      const response = await fetch("/api/service-provider/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.error("Failed to update profile");
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Service Provider Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              form="profileForm"
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <form id="profileForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Verification Status */}
          <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Account Status</h2>
            <div className="flex flex-wrap gap-4">
              <div
                className={`px-3 py-1 rounded-full ${
                  profile?.isProfileCompleted
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                Profile{" "}
                {profile?.isProfileCompleted ? "Completed" : "Incomplete"}
              </div>
              <div
                className={`px-3 py-1 rounded-full ${
                  profile?.isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {profile?.isVerified ? "Verified" : "Not Verified"}
              </div>
              <div
                className={`px-3 py-1 rounded-full ${
                  profile?.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {profile?.isAvailable ? "Available" : "Not Available"}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register("isAvailable")}
                  value="true"
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600"
                  defaultChecked={profile?.isAvailable}
                />
                <span className="ml-2">Available</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register("isAvailable")}
                  value="false"
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600"
                  defaultChecked={!profile?.isAvailable}
                />
                <span className="ml-2">Not Available</span>
              </label>
            </div>
          </div>

          {/* Working Radius */}
          <div>
            <label
              htmlFor="workingRadiusInKm"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Working Radius (km)
            </label>
            <input
              id="workingRadiusInKm"
              type="number"
              {...register("workingRadiusInKm", {
                required: "Working radius is required",
                min: { value: 1, message: "Minimum 1 km" },
                max: { value: 100, message: "Maximum 100 km" },
              })}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.workingRadiusInKm ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.workingRadiusInKm && (
              <p className="mt-1 text-sm text-red-600">
                {errors.workingRadiusInKm.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={location.latitude.toFixed(6)}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
              <input
                type="text"
                value={location.longitude.toFixed(6)}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={handleLocationChange}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Current location coordinates (latitude, longitude)
            </p>
          </div>

          {/* Skills */}
          <div className="md:col-span-2">
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Skills
            </label>
            {isEditing ? (
              <>
                <input
                  id="skills"
                  type="text"
                  {...register("skills")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="AC Repair, Plumbing, Electrical (comma separated)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter your skills separated by commas
                </p>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Stats Section */}
      {!isEditing && (
        <div className="mt-8 pt-6 border-t">
          <h2 className="text-lg font-semibold mb-4">Profile Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-semibold">
                {new Date(profile?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-semibold">
                {new Date(profile?.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Service Area</p>
              <p className="font-semibold">
                {profile?.workingRadiusInKm} km radius
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold truncate">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
