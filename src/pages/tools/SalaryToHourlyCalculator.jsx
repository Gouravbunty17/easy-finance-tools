import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import NumberInput from "../../components/NumberInput";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

function getWorkWeeks(vacationWeeks, paidVacation) {
  return paidVacation ? 52 : Math.max(1, 52 - vacationWeeks);
}

const FAQS = [
  {
    q: "Does this salary to hourly calculator show take-home pay?",
    a: "No. It converts gross pay before tax. Use the net pay calculator for payroll deductions, CPP, EI, and estimated income tax.",
  },
  {
    q: "Should I include paid vacation weeks?",
    a: "For most salaried Canadian jobs, paid vacation is already included in annual salary. For contract or freelance work, unpaid time off reduces working hours.",
  },
  {
    q: "Why does weekly hours matter?",
    a: "The same salary can mean a very different effective hourly rate if one job expects 35 hours per week and another expects 45.",
  },
  {
    q: "Can I use this for freelance pricing?",
    a: "Yes, but add business costs, unpaid admin time, taxes, benefits, and vacation separately before setting a final rate.",
  },
];

export default function SalaryToHourlyCalculator() {
  const [inputMode, setInputMode] = useState("salary"); // "salary" | "hourly"
  const [annualSalary, setAnnualSalary] = useState(85000);
  const [hourlyRate, setHourlyRate] = useState(40);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [vacationWeeks, setVacationWeeks] = useState(2);
  const [paidVacation, setPaidVacation] = useState(true);

  const result = useMemo(() => {
    const hours = Math.max(1, asNumber(hoursPerWeek, 40));
    const vacation = Math.max(0, asNumber(vacationWeeks, 0));
    const workWeeks = getWorkWeeks(vacation, paidVacation);
    const workHours = workWeeks * hours;

    let salary;
    let effectiveHourly;

    if (inputMode === "hourly") {
      const rate = asNumber(hourlyRate, 0);
      effectiveHourly = rate;
      // Annual salary from hourly = hourly * working hours over the year.
      salary = rate * workHours;
    } else {
      salary = asNumber(annualSalary, 0);
      effectiveHourly = workHours > 0 ? salary / workHours : 0;
    }

    return {
      salary,
      effectiveHourly,
      weekly: salary / 52,
      biWeekly: salary / 26,
      semiMonthly: salary / 24,
      monthly: salary / 12,
      workWeeks,
      workHours,
    };
  }, [inputMode, annualSalary, hourlyRate, hoursPerWeek, vacationWeeks, paidVacation]);

  return (
    <CalculatorLayout
      title="Salary to Hourly Calculator Canada | Convert Pay"
      description="Convert salary to hourly pay or hourly to annual salary in Canada. Estimate gross weekly, bi-weekly, semi-monthly, and monthly pay by work schedule."
      canonical="https://easyfinancetools.com/tools/salary-to-hourly-calculator"
      badge="Job offer planning"
      results={
        <>
          {inputMode === "hourly" ? (
            <ResultCard
              label="Annual salary equivalent"
              value={fmtCAD(result.salary, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
              hint={`${fmtNum(result.workHours)} working hours across ${fmtNum(result.workWeeks)} weeks.`}
              tone="primary"
            />
          ) : (
            <ResultCard
              label="Effective hourly rate"
              value={fmtCAD(result.effectiveHourly, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
              hint={`${fmtNum(result.workHours)} working hours across ${fmtNum(result.workWeeks)} weeks.`}
              tone="primary"
            />
          )}
          <ResultCard
            label="Bi-weekly pay"
            value={fmtCAD(result.biWeekly, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            hint={`Semi-monthly: ${fmtCAD(result.semiMonthly, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}
          />
          <ResultCard
            label="Monthly pay"
            value={fmtCAD(result.monthly, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            hint={`Weekly: ${fmtCAD(result.weekly, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}
            tone="success"
          />
          {inputMode === "hourly" ? (
            <ResultCard
              label="Hourly rate"
              value={fmtCAD(result.effectiveHourly, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
              hint="The rate you entered."
            />
          ) : (
            <ResultCard
              label="Annual salary"
              value={fmtCAD(result.salary, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
              hint="The salary you entered."
            />
          )}
        </>
      }
      relatedTools={[
        { href: "/tools/net-pay-calculator", title: "Pay stub calculator", body: "Move from gross salary into estimated take-home pay and payroll deductions." },
        { href: "/tools/income-tax-calculator", title: "Income tax calculator", body: "Compare salary offers after tax instead of at the gross headline number." },
        { href: "/tools/budget-tracker", title: "Budget tracker", body: "Turn your monthly pay estimate into a usable spending plan." },
      ]}
      footerNote="This is a gross-pay conversion tool. It does not include income tax, CPP, EI, or employer-specific deductions."
    >
      <div className="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">What do you want to convert?</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                inputMode === "salary"
                  ? "border-primary bg-primary/5 text-primary dark:border-accent dark:bg-accent/10 dark:text-accent"
                  : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-200"
              }`}
            >
              <input
                type="radio"
                name="conversion-mode"
                value="salary"
                checked={inputMode === "salary"}
                onChange={() => setInputMode("salary")}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <span>
                <span className="block font-semibold">Salary &rarr; Hourly</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Annual salary into hourly pay</span>
              </span>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                inputMode === "hourly"
                  ? "border-primary bg-primary/5 text-primary dark:border-accent dark:bg-accent/10 dark:text-accent"
                  : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-200"
              }`}
            >
              <input
                type="radio"
                name="conversion-mode"
                value="hourly"
                checked={inputMode === "hourly"}
                onChange={() => setInputMode("hourly")}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <span>
                <span className="block font-semibold">Hourly &rarr; Salary</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Hourly rate into annual salary</span>
              </span>
            </label>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {inputMode === "salary" ? (
            <NumberInput
              id="salary-annual"
              label="Annual salary"
              prefix="$"
              value={annualSalary}
              onChange={(value) => setAnnualSalary(parseNumericInput(value))}
              placeholder="85000"
              hint="Use your gross salary before deductions."
            />
          ) : (
            <NumberInput
              id="salary-hourly-rate"
              label="Hourly pay rate"
              prefix="$"
              value={hourlyRate}
              onChange={(value) => setHourlyRate(parseNumericInput(value))}
              placeholder="40"
              hint="Use the gross hourly rate before deductions."
            />
          )}
          <NumberInput
            id="salary-hours"
            label="Hours worked per week"
            value={hoursPerWeek}
            onChange={(value) => setHoursPerWeek(parseNumericInput(value))}
            placeholder="40"
            hint="Most full-time roles fall between 35 and 40 hours."
          />
          <NumberInput
            id="salary-vacation"
            label="Vacation weeks"
            value={vacationWeeks}
            onChange={(value) => setVacationWeeks(parseNumericInput(value))}
            placeholder="2"
            hint={
              inputMode === "hourly"
                ? "Unpaid weeks reduce the annual salary equivalent."
                : "Only affects your effective hourly rate if the time is unpaid."
            }
          />
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Vacation treatment</p>
            <label className="mt-3 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={paidVacation}
                onChange={(event) => setPaidVacation(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              {inputMode === "hourly"
                ? "Treat vacation as paid (52 working weeks)"
                : "Salary already includes paid vacation weeks"}
            </label>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Turn this off for freelance, contract, or hourly comparisons where time off reduces billable hours.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What this calculator does</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Compare job offers in hourly and annual terms</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            This calculator converts gross annual salary into an effective hourly rate, or converts an hourly rate into an annual salary estimate. It is useful for Canadian employees, contractors, students, and job seekers comparing offers with different schedules.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to use it</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Choose direction, then enter your schedule</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Use salary mode when you know the annual amount. Use hourly mode when you know the hourly rate. Then enter weekly hours and vacation treatment so the calculator can estimate working hours for the year.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Inputs explained</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What changes your pay conversion</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["Annual salary or hourly rate", "The gross pay number before income tax, CPP, EI, benefits, or other deductions."],
            ["Hours per week", "The expected working schedule used to calculate total annual hours."],
            ["Vacation weeks", "Time away from work. It changes hourly comparisons when vacation is unpaid."],
            ["Vacation treatment", "Paid vacation keeps the year at 52 paid weeks; unpaid vacation reduces working weeks."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <h3 className="font-bold text-primary dark:text-accent">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Example calculation</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Example: current work schedule</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            With the current inputs, the calculator uses {fmtNum(result.workHours)} working hours across {fmtNum(result.workWeeks)} paid weeks. That produces {inputMode === "hourly" ? `an annual salary equivalent of ${fmtCAD(result.salary)}` : `an effective hourly rate of ${fmtCAD(result.effectiveHourly, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to read your result</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Gross pay is only the starting point</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Use the hourly or salary result to compare offers at the same work schedule. Then move the annual amount into the <Link to="/tools/net-pay-calculator" className="text-primary underline dark:text-secondary">net pay calculator</Link> to estimate take-home pay and payroll deductions.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Common mistakes</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Do not compare offers on gross pay alone</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <li>- Ignoring unpaid overtime or long expected workweeks.</li>
          <li>- Comparing contractor hourly rates to employee salary without benefits, vacation, or tax differences.</li>
          <li>- Forgetting that gross pay is not the amount deposited into your bank account.</li>
          <li>- Treating semi-monthly and bi-weekly pay as the same number of cheques per year.</li>
        </ul>
      </section>

      <MethodologyPanel
        title="Methodology and assumptions"
        summary="The calculator converts between gross annual salary and gross hourly rate using weekly hours and paid or unpaid vacation treatment, then derives common pay-period equivalents."
        assumptions={[
          "Salary mode divides annual salary by modeled working hours.",
          "Hourly mode multiplies hourly rate by modeled working hours.",
          "Paid vacation is treated as 52 paid weeks; unpaid vacation reduces paid working weeks.",
          "Income tax, CPP, EI, employer benefits, pensions, overtime, and bonuses are not included.",
        ]}
        sources={[
          { label: "Government of Canada: Pay and minimum wage", href: "https://www.canada.ca/en/services/jobs/workplace/federal-labour-standards/pay-deductions.html" },
          { label: "EasyFinanceTools methodology", href: "https://easyfinancetools.com/methodology" },
        ]}
        note="Educational gross-pay estimate only. Verify compensation details with your employer, contract, or payroll documents."
      />

      <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Related tools and guides</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link to="/tools" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">All calculators</Link>
          <Link to="/tools/net-pay-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">Net pay calculator</Link>
          <Link to="/tools/inflation-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">Inflation calculator</Link>
          <Link to="/blog/how-to-start-investing-canada-2026" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">Beginner investing guide</Link>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Disclaimer</p>
        <p className="mt-3 text-sm leading-7 text-amber-800 dark:text-amber-200">
          This page estimates gross pay only. It does not replace payroll advice, employment-law review, or a detailed comparison of benefits, pension, bonus, tax, and contract terms.
        </p>
      </section>

      <FAQ items={FAQS} />
    </CalculatorLayout>
  );
}
