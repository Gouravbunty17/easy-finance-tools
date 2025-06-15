import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary mb-6 text-center">About EasyFinanceTools</h1>

      <p className="text-lg text-neutral-dark dark:text-neutral-300 leading-relaxed mb-6">
        EasyFinanceTools was created with one mission: to empower everyday people to take control of their
        financial future. We believe that financial literacy should be accessible, practical, and free.
      </p>

      <p className="text-lg text-neutral-dark dark:text-neutral-300 leading-relaxed mb-6">
        Whether you're tracking your expenses, planning your investments, or calculating your dividends, our
        tools are designed to make money management easy and intuitive. No jargon, no clutter — just what you
        need to build confidence with your money.
      </p>

      <h2 className="text-2xl font-semibold text-primary mt-10 mb-4">Why We Exist</h2>
      <ul className="list-disc pl-6 text-neutral-dark dark:text-neutral-300 space-y-2">
        <li>To simplify personal finance with smart, easy-to-use tools</li>
        <li>To support your journey toward financial freedom</li>
        <li>To offer trustworthy, ad-free calculators without login walls</li>
      </ul>

      <h2 className="text-2xl font-semibold text-primary mt-10 mb-4">Meet the Creator</h2>
      <p className="text-lg text-neutral-dark dark:text-neutral-300">
        Hi, I'm Gourav Kumar — the creator behind EasyFinanceTools. As someone passionate about finance and
        technology, I wanted to build a space where tools and education come together to help people thrive.
      </p>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-10">
        🇨🇦 Built in Canada • Focused on clarity, community, and confidence
      </p>
    </div>
  );
};

export default About;
