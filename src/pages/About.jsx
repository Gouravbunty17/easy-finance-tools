import React from "react";

export default function About() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary dark:text-accent mb-6">
        About - EasyFinanceTools
      </h1>

      <div className="space-y-4 text-neutral-dark dark:text-neutral-light">
        <h2 className="text-2xl font-semibold mt-6 mb-2">Our Mission</h2>
        <p>
          At EasyFinanceTools, we believe financial empowerment should be accessible
          to everyone. Our mission is to simplify personal finance through intuitive
          tools and educational resources that help people make smarter money decisions.
          We&apos;re dedicated to removing the complexity from financial planning so you
          can focus on what matters most — achieving your financial goals.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Our Values</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Simplicity First: We strip away complexity to reveal clear financial insights</li>
          <li>Empowerment Through Education: We provide knowledge, not just numbers</li>
          <li>Integrity: We maintain strict editorial independence and never promote financial products for commissions</li>
          <li>Accessibility: We believe financial tools should be free and available to everyone</li>
          <li>Innovation: We continuously improve based on user feedback and financial research</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Why Choose EasyFinanceTools?</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Free Forever: We&apos;re committed to keeping our tools 100% free</li>
          <li>No Registration Required: Use our tools instantly without creating an account</li>
          <li>Privacy Focused: We never sell your data or require personal financial details</li>
          <li>Continuously Updated: Our tools evolve with changing financial landscapes</li>
          <li>Community Driven: We build what our users request most</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Join Our Mission</h2>
        <p>
          Whether you&apos;re just starting your financial journey or looking to optimize
          your wealth strategy, we&apos;re here to help. Explore our tools, read our
          educational content, and take control of your financial future.
        </p>
        <p className="font-semibold mt-4">
          EasyFinanceTools - Your partner in financial clarity.
        </p>
      </div>
    </section>
  );
}
