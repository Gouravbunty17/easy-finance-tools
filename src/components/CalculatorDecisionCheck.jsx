import DecisionFramework from './DecisionFramework';

export default function CalculatorDecisionCheck({ className = '' }) {
  return (
    <div className={className}>
      <DecisionFramework
        compact
        title="Use this result as a decision check"
        intro="Run the number, then check the tradeoff, the rule, the weak assumption, and the next page that tests it. That keeps the calculator useful without treating the result as advice."
      />
    </div>
  );
}
