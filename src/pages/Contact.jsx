import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Wait for reCAPTCHA token
      const token = await window.grecaptcha.enterprise.execute('6Lfq02ErAAAAACKsvPNiYQ5IktFs-fgD-RLPs1G5', { action: 'submit' });

      const response = await fetch('https://formspree.io/f/xkgbbqoa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, 'g-recaptcha-response': token }),
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      setError('There was a problem sending your message. Please try again later.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary mb-6 text-center">Contact Us</h1>

      {submitted ? (
        <div className="bg-green-100 text-green-800 p-4 rounded text-center">
          Thank you for your message! We'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md">
          <label className="block mb-4">
            <span className="block font-semibold mb-1">Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded bg-white dark:bg-neutral-800 dark:text-white"
            />
          </label>

          <label className="block mb-4">
            <span className="block font-semibold mb-1">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded bg-white dark:bg-neutral-800 dark:text-white"
            />
          </label>

          <label className="block mb-4">
            <span className="block font-semibold mb-1">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-2 border rounded bg-white dark:bg-neutral-800 dark:text-white"
            ></textarea>
          </label>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <button
            type="submit"
            className="bg-secondary hover:bg-primary text-white font-semibold px-6 py-2 rounded transition"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
