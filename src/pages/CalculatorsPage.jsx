import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function CalculatorsPage() {
  const calculators = [
    {
      title: "Compound Interest Calculator",
      description: "See how your investment can grow over time through compound interest.",
      link: "/calculators/compound-interest",
    },
    {
      title: "Savings Goal Calculator",
      description: "Plan how much you need to save to reach your future financial targets.",
      link: "/calculators/savings-goal",
    },
    {
      title: "College Savings Calculator",
      description: "Estimate how much you’ll need to put aside for education costs.",
      link: "/calculators/college-savings",
    },
    {
      title: "Required Minimum Distribution (RMD) Calculator",
      description: "Estimate your required minimum withdrawals in retirement.",
      link: "/calculators/rmd",
    },
    {
      title: "TFSA Calculator",
      description: "Estimate your potential tax-free growth in a Canadian TFSA account.",
      link: "/calculators/tfsa",
    },
    {
      title: "RRSP Calculator",
      description: "See your potential savings in a Canadian RRSP account, including tax advantages.",
      link: "/calculators/rrsp",
    },
  ];

  useEffect(() => {
    try {
      if (window.adsbygoogle && process.env.NODE_ENV !== "development") {
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: "/calculators",
      });
    }
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-6">Financial Calculators</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8">
        Explore our calculators to plan, track, and optimize your financial future. All free, no sign-up needed.
      </p>

      <div className="mb-8 flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-4262496331692202"
          data-ad-slot="9988776655"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => (
          <div
            key={calc.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2 text-primary dark:text-accent">
                {calc.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{calc.description}</p>
            </div>
            <Link
              to={calc.link}
              className="inline-block mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition self-start"
            >
              Open
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
