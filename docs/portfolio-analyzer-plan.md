# Portfolio Analyzer Foundation

Status: planning foundation only. The public route is intentionally noindexed until a useful analyzer exists.

## Product Boundary

The analyzer should be a Canadian decision-support tool, not a recommendation engine. It can describe concentration, account fit, distribution mix, tax context, and diversification warnings. It must not recommend securities, produce buy/sell signals, or imply personalized financial advice.

## Planned Architecture

- Manual holdings table first.
- Optional CSV import later.
- No brokerage login requirement.
- Local parsing preferred where practical.
- Explicit privacy copy before uploads.
- Account labels for TFSA, RRSP, FHSA, taxable, RESP, cash, and other.
- Separate descriptive checks from educational explanations.

## Future Checks

- TFSA concentration checks.
- RRSP foreign withholding-tax awareness.
- FHSA timeline and liquidity warnings.
- Taxable-account dividend, interest, capital gain, and return-of-capital notes.
- Canadian versus US exposure estimate.
- Sector concentration.
- Single holding concentration.
- Yield concentration and covered-call income warnings.

## Safety Rules

- No fake precision risk score.
- No "best portfolio" output.
- No security recommendations.
- No trade timing.
- No account opening CTA before educational output.
- Always show limitations and official-source references where tax rules are involved.

## Launch Criteria

- Useful with sample/manual data before CSV import.
- Accessible table and result cards.
- Clear privacy behaviour.
- Build and prerender clean.
- Noindex removed only when the analyzer has real interactive value.
