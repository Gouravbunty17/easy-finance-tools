import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [submitted, setSubmitted] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setSubmitted(true);
    }, (error) => {
      console.error(error.text);
      alert("❌ Failed to send. Please try again.");
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-xl">
      <h1 className="text-4xl font-bold text-primary mb-4">Contact Us</h1>
      <p className="text-lg text-neutral-dark mb-6">Send us your questions, feedback, or just say hello.</p>

      {submitted ? (
        <div className="text-green-600 text-lg font-medium">✅ Thank you! Your message was sent.</div>
      ) : (
        <form ref={form} onSubmit={sendEmail} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input type="text" name="title" required className="mt-1 w-full border rounded-md px-4 py-2 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input type="text" name="name" required className="mt-1 w-full border rounded-md px-4 py-2 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" name="email" required className="mt-1 w-full border rounded-md px-4 py-2 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea name="message" rows="4" required className="mt-1 w-full border rounded-md px-4 py-2 dark:bg-neutral-900" />
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
