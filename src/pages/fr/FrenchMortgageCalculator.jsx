import React, {useMemo,useState} from "react";
import {Link} from "react-router-dom";
import SEO from "../../components/SEO";
import ToolPageSchema from "../../components/ToolPageSchema";
import {DEFAULT_ASSUMPTIONS,getMortgageMinimumDownPayment,getCmhcPremium,getMortgagePayment,getMortgageStressTestRate} from "../../config/financial";
import {mortgageOfficialSources} from "../../config/officialSources";
import {parseNumericInput,asNumber} from "../../lib/numericInputs";
import useCalculatorEngagement from "../../hooks/useCalculatorEngagement";

const dollars=new Intl.NumberFormat("fr-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0});
const pct=new Intl.NumberFormat("fr-CA",{maximumFractionDigits:2});
const money=n=>dollars.format(Number.isFinite(n)?n:0);
const safe=(n,min,max)=>Math.min(Math.max(asNumber(n),min),max);
function Field({id,label,value,set,step="1000",unit="$ CA"}){
 return <div>
  <label htmlFor={id} className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</label>
  <div className="relative">
   <input id={id} type="number" min="0" inputMode="decimal" step={step} value={value} onChange={e=>set(parseNumericInput(e.target.value))}
    className="focus-ring min-h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 pr-16 text-base font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"/>
   <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">{unit}</span>
  </div>
 </div>;
}
function Metric({label,value,detail,primary=false}){
 return <div className={primary?"rounded-2xl bg-[#0B2447] p-4 text-white":"rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"}>
  <p className="text-xs font-bold uppercase tracking-wide opacity-80">{label}</p>
  <p className="eft-metric mt-2 break-words text-2xl font-extrabold">{value}</p>
  {detail?<p className="mt-2 text-xs leading-5 opacity-80">{detail}</p>:null}
 </div>;
}
export default function FrenchMortgageCalculator(){
 const defaults=DEFAULT_ASSUMPTIONS.mortgage;
 const [homePrice,setHomePrice]=useState(String(defaults.homePrice));
 const [down,setDown]=useState(String(defaults.downPayment));
 const [rate,setRate]=useState(String(defaults.rate));
 const [years,setYears]=useState(defaults.amortization);
 useCalculatorEngagement("mortgage_calculator_fr",[homePrice,down,rate,years]);
 const result=useMemo(()=>{
  const price=safe(homePrice,0,50000000),deposit=safe(down,0,50000000),annualRate=safe(rate,0,30);
  const months=years*12;
  const principal=Math.max(0,price-deposit);
  const downRatio=price>0?deposit/price:0;
  const minDown=getMortgageMinimumDownPayment(price);
  const premium=downRatio<0.2&&price<1500000?getCmhcPremium(principal,price||1):0;
  const financed=principal+premium;
  const monthly=getMortgagePayment(financed,annualRate,months);
  const stressRate=getMortgageStressTestRate(annualRate);
  return {price,deposit,minDown,premium,financed,monthly,
   interest:Math.max(0,monthly*months-financed),
   stressRate,stressPayment:getMortgagePayment(financed,stressRate,months),
   downRatio,underMinimum:price>0&&deposit<minDown,
   needsLargeDown:price>=1500000&&downRatio<0.2,depositTooHigh:deposit>price};
 },[homePrice,down,rate,years]);
 return <main className="mx-auto max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
  <SEO title="Calculateur hypothécaire Canada 2026 | Versements mensuels" description="Calculateur hypothécaire gratuit en français au Canada : estimation du paiement mensuel, de l'assurance prêt, du capital emprunté et du taux de qualification." canonical="https://easyfinancetools.com/fr/outils/calculateur-hypothecaire"/>
  <ToolPageSchema name="Calculateur hypothécaire en français" description="Calculateur canadien des versements hypothécaires, de la mise de fonds et de l'assurance prêt." canonical="https://easyfinancetools.com/fr/outils/calculateur-hypothecaire" breadcrumbs={[{name:"Accueil",item:"https://easyfinancetools.com/fr"},{name:"Calculateurs",item:"https://easyfinancetools.com/fr/outils"},{name:"Hypothèque",item:"https://easyfinancetools.com/fr/outils/calculateur-hypothecaire"}]}/>
  <header className="mb-6 max-w-4xl">
   <p className="eft-eyebrow">Hypothèque · Canada · 2026</p>
   <h1 className="eft-display mt-3 text-3xl font-extrabold text-primary dark:text-white sm:text-4xl">Calculateur hypothécaire</h1>
   <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">Entrez le prix de votre propriété, votre mise de fonds et le taux proposé. Les versements et les frais d'assurance sont estimés immédiatement.</p>
  </header>
  <a href="#fr-mortgage-results" className="focus-ring mb-4 flex min-h-14 items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 text-sm text-primary dark:border-teal-900 dark:bg-teal-950/30 dark:text-white lg:hidden">
   <span>Paiement : <strong className="eft-metric">{money(result.monthly)}</strong></span><span className="shrink-0 font-bold text-secondary">Résultats ↓</span>
  </a>
  <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(350px,.88fr)]" aria-label="Calculateur hypothécaire et résultats">
   <div className="eft-surface space-y-5 p-5 sm:p-7">
    <h2 className="text-xl font-bold text-primary dark:text-white">Votre scénario hypothécaire</h2>
    <Field id="fr-home-price" label="Prix de la propriété" value={homePrice} set={setHomePrice}/>
    <Field id="fr-down-payment" label="Mise de fonds" value={down} set={setDown}/>
    <Field id="fr-mortgage-rate" label="Taux d'intérêt annuel" value={rate} set={setRate} step="0.05" unit="%"/>
    <div>
     <label htmlFor="fr-amortization" className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">Amortissement</label>
     <select id="fr-amortization" value={years} onChange={e=>setYears(Number(e.target.value))} className="focus-ring min-h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-base font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
      {[5,10,15,20,25,30].map(n=><option key={n} value={n}>{n} ans</option>)}
     </select>
     <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Un amortissement de 30 ans n'est pas admissible pour tous les types de prêt.</p>
    </div>
   </div>
   <div id="fr-mortgage-results" className="eft-surface scroll-mt-24 p-5 sm:p-7 lg:sticky lg:top-24" aria-live="polite" aria-label="Résultats hypothécaires">
    <p className="eft-eyebrow">Estimation instantanée · CAD</p>
    <h2 className="mt-2 text-xl font-bold text-primary dark:text-white">Paiements et coûts estimés</h2>
    <div className="mt-4 grid gap-3">
     <Metric label="Versement mensuel" value={money(result.monthly)} primary detail="Sans taxes foncières ni assurance habitation."/>
     <Metric label="Capital financé, assurance comprise" value={money(result.financed)} detail={`Prime d'assurance prêt estimée : ${money(result.premium)}`}/>
     <Metric label="Intérêts sur l'amortissement" value={money(result.interest)} detail="Suppose le même taux pendant toute la durée de l'amortissement."/>
     <Metric label="Versement au taux de qualification" value={money(result.stressPayment)} detail={`Taux de qualification indicatif : ${pct.format(result.stressRate)} %`}/>
    </div>
    {result.underMinimum?<p role="alert" className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/20 dark:text-amber-100">La mise de fonds est inférieure au minimum indicatif pour ce prix ({money(result.minDown)}). Ce scénario n'indique pas un prêt admissible.</p>:null}
    {result.needsLargeDown?<p role="alert" className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">Pour une propriété de 1,5 million de dollars ou plus, une mise de fonds de 20 % est normalement requise.</p>:null}
    {result.depositTooHigh?<p role="alert" className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">La mise de fonds dépasse le prix : corrigez vos montants.</p>:null}
    <p className="mt-4 text-xs leading-6 text-slate-600 dark:text-slate-300">Résultats éducatifs seulement. Ils ne constituent pas une préautorisation hypothécaire et n'incluent pas toutes les taxes et tous les frais de clôture.</p>
   </div>
  </section>
  <section className="mt-9 grid gap-5 lg:grid-cols-2">
   <div className="eft-surface p-6">
    <h2 className="text-xl font-bold text-primary dark:text-white">Mise de fonds et assurance prêt</h2>
    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Une mise de fonds inférieure à 20 % peut nécessiter une assurance prêt hypothécaire pour une propriété admissible. La prime est généralement ajoutée au capital emprunté; certaines taxes provinciales sur cette prime peuvent être payables séparément.</p>
    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">La mise de fonds saisie représente {pct.format(result.downRatio*100)} % du prix. Minimum indicatif : {money(result.minDown)}.</p>
   </div>
   <div className="eft-surface p-6">
    <h2 className="text-xl font-bold text-primary dark:text-white">Paiement et qualification</h2>
    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Le paiement calculé à un taux de qualification plus élevé sert uniquement de repère. La préautorisation dépend aussi du revenu, des dettes, des frais de propriété et de la politique du prêteur.</p>
    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Au Québec, vérifiez la taxe de bienvenue et les autres frais municipaux. Cette version initiale ne les calcule pas.</p>
   </div>
  </section>
  <section className="eft-surface mt-7 p-6">
   <h2 className="text-xl font-bold text-primary dark:text-white">Sources et limites du calcul</h2>
   <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Le calcul réutilise les mêmes fonctions de paiement hypothécaire, de mise de fonds minimale, d'assurance prêt et de taux de qualification que notre version anglaise. Il suppose un taux inchangé pendant l'amortissement et ne modélise pas encore les remboursements anticipés.</p>
   <ul className="mt-4 space-y-3 text-sm">{mortgageOfficialSources.slice(0,3).map((source,i)=><li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="font-bold text-secondary hover:underline">{["ACFC — Hypothèques","ACFC — Préparation hypothécaire","SCHL — Assurance prêt hypothécaire"][i]} ↗</a></li>)}</ul>
   <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Certaines pages officielles peuvent s'ouvrir en anglais. Vérifiez les règles actuelles et les conditions particulières auprès de votre prêteur.</p>
   <Link to="/tools/mortgage-calculator" hrefLang="en-CA" className="mt-4 inline-block text-sm font-bold text-secondary hover:underline">Version anglaise avec plus d'options : versements accélérés et remboursements anticipés →</Link>
  </section>
 </main>;
}
