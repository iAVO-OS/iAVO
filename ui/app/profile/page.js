'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [formData, setFormData] = useState({
    creator_id: '',
    name: '',
    tier: ''
  });
  const [responseMsg, setResponseMsg] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:7777/creator/update-profile', formData);
      setResponseMsg(JSON.stringify(res.data, null, 2));
    } catch (error) {
      setResponseMsg('Error updating profile');
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Creator ID:
          <input name="creator_id" value={formData.creator_id} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Name:
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Tier:
          <input name="tier" value={formData.tier} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Update Profile</button>
      </form>
      {responseMsg && (
        <pre className="mt-4">{responseMsg}</pre>
      )}
    </main>
  );
}
