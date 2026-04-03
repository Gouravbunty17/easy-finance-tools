import React, { useState } from "react";
import SEO from "../components/SEO";

const initialForm = {
  name: "",
  email: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", message: "Please fill in your name, email, and message." });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "We could not send your message right now.");
      }

      setForm(initialForm);
      setStatus({
        type: "success",
        message: "Message sent successfully. Check your inbox destination and reply settings in EmailJS if you want to verify delivery.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "We could not send your message right now.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Contact EasyFinanceTools"
        description="Contact EasyFinanceTools with questions, feedback, calculator issues, or partnership inquiries."
        canonical="https://easyfinancetools.com/contact"
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            Contact and support
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">Contact EasyFinanceTools</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Questions, bug reports, calculator feedback, or partnership ideas. Send a message and it will be routed through the live contact backend.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_360px]">
          <form onSubmit={handleSubmit} className="surface-card p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Send a message</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Use this form for support, corrections, partnership inquiries, or feature requests.
              </p>
            </div>

            <div className="grid gap-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Your name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={updateField("name")}
                  placeholder="John Smith"
                  className="focus-ring w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Email address</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  placeholder="john@example.com"
                  className="focus-ring w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Message</span>
                <textarea
                  rows={7}
                  value={form.message}
                  onChange={updateField("message")}
                  placeholder="Tell us what you need help with, what looks wrong, or what you want us to build next."
                  className="focus-ring w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              {status.message && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200"
                      : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-secondary px-6 py-4 text-sm font-bold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </div>
          </form>

          <div className="space-y-5">
            <div className="surface-soft p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">What to expect</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Messages are sent through the site contact backend instead of a fake success state.</li>
                <li>Use a valid reply email so responses can reach you.</li>
                <li>Bug reports are most helpful when you include the page URL and what went wrong.</li>
              </ul>
            </div>

            <div className="surface-card p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Best reasons to reach out</h3>
              <div className="mt-3 grid gap-3">
                {[
                  "Calculator bug or wrong assumption",
                  "SEO/content correction",
                  "Partnership or sponsorship inquiry",
                  "Feature request for a new Canadian finance tool",
                ].map((item) => (
                  <div key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
