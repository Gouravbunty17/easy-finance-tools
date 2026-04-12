import React, { useMemo, useState } from "react";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import NumberInput from "../../components/NumberInput";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

function getWorkWeeks(vacationWeeks, paidVacation) {
  return paidVacation ? 52 : Math.max(1, 52 - vacationWeeks);
}

export default function SalaryToHourlyCalculator() {
  const [annualSalary, setAnnualSalary] = useState(85000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [vacationWeeks, setVacationWeeks] = useState(2);
  const [paidVacation, setPaidVacation] = useState(true);

  const result = useMemo(() => {
    const salary = asNumber(annualSalary);
    const hours = Math.max(1, asNumber(hoursPerWeek, 40));
    const vacation = Math.max(0, asNumber(vacationWeeks, 0));
    const workWeeks = getWorkWeeks(vacation, paidVacation);
    const workHours = workWeeks * hours;
    const effectiveHourly = workHours > 0 ? salary / workHours : 0;

    return {
      effectiveHourly,
      weekly: salary / 52,
      biWeekly: salary / 26,
      semiMonthly: salary / 24,
      monthly: salary / 12,
      workWeeks,
      workHours,
    };
  }, [annualSalary, hoursPerWeek, vacationWeeks, paidVacation]);

  return (
    <CalculatorLayout
      title="Salary to Hourly Calculator Canada"
      description="Convert annual salary into hourly, weekly, bi-weekly, semi-monthly, and monthly pay with clean input boxes. Useful for comparing job offers and understanding the effect of vacation weeks."
      canonical="https://easyfinancetools.com/tools/salary-to-hourly-calculator"
      badge="Job offer planning"
      results={
        <>
          <ResultCard
            label="Effective hourly rate"
            value={fmtCAD(result.effectiveHourly, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            hint={`${fmtNum(result.workHours)} working hours across ${fmtNum(result.workWeeks)} weeks.`}
            tone="primary"
          />
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
        <div className="grid gap-5 md:grid-cols-2">
          <NumberInput
            id="salary-annual"
            label="Annual salary"
            prefix="$"
            value={annualSalary}
            onChange={(value) => setAnnualSalary(parseNumericInput(value))}
            placeholder="85000"
            hint="Use your gross salary before deductions."
          />
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
            hint="Only affects your effective hourly rate if the time is unpaid."
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
              Salary already includes paid vacation weeks
            </label>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Turn this off for freelance, contract, or hourly comparisons where time off reduces billable hours.
            </p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
