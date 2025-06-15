import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      alert('Please verify that you are not a robot.');
      return;
    }

    try {
      const response = await fetch('https://formspree.io/f/xkgbbqoa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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

          <div className="mb-4">
            <ReCAPTCHA
              sitekey="6LceGGIrAAAAAFSrTPeqBIYo52peqMEubhqIguu1"
              onChange={() => setCaptchaVerified(true)}
              onExpired={() => setCaptchaVerified(false)}
            />
          </div>

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
