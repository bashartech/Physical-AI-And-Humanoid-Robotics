'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import { createAuthClient } from "better-auth/react";

export default function SignupPage() {
  // const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '', // Better Auth typically uses name
    skillLevel: '',
    hardwareExperience: '',
    softwareExperience: '',
    programmingLevel: '',
    preferredLearningStyle: '',
    preferredLanguage: 'en'
  });
  const [error, setError] = useState('');

  // Initialize Better Auth client
  const client = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || "https://physical-ai-and-humanoid-robotics-ebon-seven.vercel.app/",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // First, create the user with Better Auth
      const userResult = await client.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name || formData.email.split('@')[0], // Use name from form or derive from email
      });

      console.log("USER_RESULT",userResult)
      console.log("ERROR", userResult.error)
      if (userResult.error) {
        setError(userResult.error.message || userResult.error.code || 'Signup failed');
        return;
      }

      // After successful user creation, store profile data in our custom table
      // Extract user data from the result - properly check the type structure
      let userId: string | undefined;

      // Type guard to check if userResult has the expected structure
      if (userResult && typeof userResult === 'object') {
        // Check if it has a user property
        if ('user' in userResult && userResult.user && typeof userResult.user === 'object' && 'id' in userResult.user) {
          userId = (userResult.user as { id: string }).id;
        }
        // Check if it has a data property with user
        else if ('data' in userResult && userResult.data && typeof userResult.data === 'object' &&
                 'user' in userResult.data && userResult.data.user &&
                 typeof userResult.data.user === 'object' && 'id' in userResult.data.user) {
          userId = (userResult.data.user as { id: string }).id;
        }
      }

      if (!userId) {
        setError('User creation failed - no user ID returned');
        return;
      }

      // Make a separate API call to store profile data
      const profileResponse = await fetch('/api/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, // This would be the Better Auth user ID
          skillLevel: formData.skillLevel,
          hardwareExperience: formData.hardwareExperience,
          softwareExperience: formData.softwareExperience,
          programmingLevel: formData.programmingLevel,
          preferredLearningStyle: formData.preferredLearningStyle,
          preferredLanguage: formData.preferredLanguage,
        }),
      });

      if (profileResponse.ok) {
        // Successful signup with profile data - redirect to frontend
        window.location.href = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://physical-ai-and-humanoid-robotics-x.vercel.app/';
      } else {
        const errorData = await profileResponse.json();
        setError(errorData.message || 'Profile creation failed');
      }
    } catch (err) {
      setError('An error occurred during signup');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-4">
            <div>
              <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-900">
                Skill Level
              </label>
              <select
                id="skillLevel"
                name="skillLevel"
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm rounded-md"
                value={formData.skillLevel}
                onChange={handleChange}
              >
                <option value="">Select your skill level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label htmlFor="hardwareExperience" className="block text-sm font-medium text-gray-900">
                Hardware Experience
              </label>
              <textarea
                id="hardwareExperience"
                name="hardwareExperience"
                rows={3}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm"
                placeholder="Describe your experience with hardware development..."
                value={formData.hardwareExperience}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="softwareExperience" className="block text-sm font-medium text-gray-900">
                Software Experience
              </label>
              <textarea
                id="softwareExperience"
                name="softwareExperience"
                rows={3}
                className="mt-1 block w-full p-2 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Describe your experience with software development..."
                value={formData.softwareExperience}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="programmingLevel" className="block text-sm font-medium text-gray-900">
                Programming Level
              </label>
              <input
                type="text"
                id="programmingLevel"
                name="programmingLevel"
                className="mt-1 block w-full p-2 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Your programming experience level..."
                value={formData.programmingLevel}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="preferredLearningStyle" className="block text-sm font-medium text-gray-900">
                Preferred Learning Style
              </label>
              <select
                id="preferredLearningStyle"
                name="preferredLearningStyle"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={formData.preferredLearningStyle}
                onChange={handleChange}
              >
                <option value="">Select your preferred learning style</option>
                <option value="visual">Visual</option>
                <option value="auditory">Auditory</option>
                <option value="reading">Reading/Writing</option>
                <option value="kinesthetic">Kinesthetic</option>
              </select>
            </div>

            <div>
              <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700">
                Preferred Language
              </label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                className="mt-1 text-gray-900 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={formData.preferredLanguage}
                onChange={handleChange}
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}