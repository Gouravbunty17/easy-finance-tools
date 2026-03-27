import React, { useState } from "react";
export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary dark:text-accent mb-4">Contact Us</h1>
      <p className="text-gray-500 mb-10">Have a question, suggestion, or found a bug? We'd love to hear from you.</p>
      {sent ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-green-700">Message Sent!</h2>
          <p className="text-green-600 mt-2">Thanks for reaching out. We'll get back to you soon.</p>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Your Name</label>
            <input type="text" placeholder="John Smith" className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email Address</label>
            <input type="email" placeholder="john@example.com" className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Message</label>
            <textarea rows={5} placeholder="Your message..." className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none resize-none" />
          </div>
          <button onClick={() => setSent(true)} className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition">
            Send Message
          </button>
        </div>
      )}
    </section>
  );
}
