import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import { REGISTERED_ACCOUNT_LIMITS } from "../../config/financial";

const money = new Intl.NumberFormat("fr-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0});
const tools = [
 {name:"Calculateur hypothécaire",desc:"Estimez les versements mensuels, l'assurance prêt et le taux de qualification.",path:"/fr/outils/calculateur-hypothecaire",fr:true},
 {name:"CELI",desc:"Estimez les droits de cotisation et la croissance de votre épargne.",path:"/tools/tfsa-calculator"},
 {name:"REER",desc:"Comparez les déductions fiscales et l'épargne-retraite.",path:"/tools/rrsp-calculator"},
 {name:"CELIAPP",desc:"Planifiez une première habitation et les cotisations admissibles.",path:"/tools/fhsa-calculator"},
 {name:"Impôt sur le revenu",desc:"Estimez le revenu après impôt selon les paramètres de votre province.",path:"/tools/income-tax-calculator"}
];
export default function FrenchHome(){
 return <main className="flex-1">
  <SEO title="Calculateurs financiers gratuits au Canada | EasyFinanceTools" description="Des outils financiers canadiens gratuits. Calculez votre hypothèque en français et découvrez les calculateurs CELI, REER, CELIAPP et impôt disponibles en anglais." canonical="https://easyfinancetools.com/fr"/>
  <section className="bg-[#0B2447] px-4 py-14 text-white sm:py-20">
   <div className="mx-auto max-w-6xl">
    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#70DEC5]">Outils financiers pour les Canadiens</p>
    <h1 className="eft-display mt-5 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">Prenez des décisions financières plus éclairées.</h1>
    <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">Estimez vos versements hypothécaires, explorez les comptes d'épargne enregistrés et comprenez les limites de chaque calcul. Gratuit et sans inscription.</p>
    <div className="mt-7 flex flex-wrap gap-3">
     <Link to="/fr/outils/calculateur-hypothecaire" className="eft-brand-button !bg-[#60DABF] !text-[#092941]">Calculer mon hypothèque →</Link>
     <Link to="/fr/outils" className="focus-ring inline-flex min-h-11 items-center rounded-xl border border-white/30 px-5 text-sm font-bold text-white hover:bg-white/10">Voir tous les outils</Link>
    </div>
    <p className="mt-6 max-w-3xl text-sm leading-6 text-blue-100">La version française est lancée progressivement : la page d'accueil et le calculateur hypothécaire sont accessibles en français. Les autres outils restent en anglais pour le moment.</p>
   </div>
  </section>
  <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
   <p className="eft-eyebrow">Repères nationaux pour 2026</p>
   <h2 className="mt-2 text-3xl font-bold text-primary dark:text-white">Comprendre les plafonds de cotisation</h2>
   <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">Ces plafonds publiés ne représentent pas nécessairement vos droits personnels. Consultez votre historique et les renseignements de l'Agence du revenu du Canada (ARC) avant de cotiser.</p>
   <div className="mt-6 grid gap-4 sm:grid-cols-3">
    {[
     {label:"Plafond annuel du CELI en 2026",value:REGISTERED_ACCOUNT_LIMITS.tfsaAnnualLimit,note:"Les droits personnels dépendent notamment de votre historique."},
     {label:"Plafond REER en dollars pour 2026",value:REGISTERED_ACCOUNT_LIMITS.rrspMaxContribution2026,note:"Le montant déductible dépend de vos propres droits REER."},
     {label:"Plafond annuel du CELIAPP",value:REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit,note:"Des conditions d'admissibilité et de report s'appliquent."}
    ].map(card=><div key={card.label} className="eft-surface p-5"><p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{card.label}</p><p className="eft-metric mt-2 text-3xl font-extrabold text-primary dark:text-white">{money.format(card.value)}</p><p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">{card.note}</p></div>)}
   </div>
  </section>
  <section className="border-y border-slate-200 bg-slate-50 px-4 py-14 dark:border-slate-800 dark:bg-slate-900/30">
   <div className="mx-auto max-w-6xl">
    <h2 className="text-3xl font-bold text-primary dark:text-white">Choisissez un calculateur</h2>
    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">La langue de chaque outil est indiquée clairement.</p>
    <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
     {tools.map(tool=><Link key={tool.path} to={tool.path} hrefLang={tool.fr?"fr-CA":"en-CA"} className="eft-tool-card p-6">
       <span className="text-xs font-bold uppercase tracking-wider text-secondary">{tool.fr?"Disponible en français":"Disponible en anglais"}</span>
       <h3 className="mt-3 text-xl font-bold text-primary dark:text-white">{tool.name}</h3>
       <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{tool.desc}</p>
       <span className="mt-4 inline-block text-sm font-bold text-secondary">Ouvrir l'outil →</span>
     </Link>)}
    </div>
   </div>
  </section>
  <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
   <h2 className="text-2xl font-bold text-primary dark:text-white">Utiliser ces estimations de façon responsable</h2>
   <div className="mt-4 grid gap-6 text-sm leading-7 text-slate-700 dark:text-slate-300 md:grid-cols-2">
    <p>Une simulation hypothécaire peut montrer l'effet du taux et de la mise de fonds sur le paiement. Cependant, elle ne confirme pas votre admissibilité au crédit, votre capacité d'emprunt ni l'ensemble des dépenses d'achat.</p>
    <p>Pour le CELI, le REER et le CELIAPP, les limites nationales ne remplacent pas vos droits individuels. Au Québec, les frais municipaux et certaines règles provinciales exigent une vérification particulière.</p>
   </div>
   <p className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-100"><strong>Information éducative seulement.</strong> Ces calculs ne constituent pas des conseils financiers, fiscaux, juridiques ou hypothécaires personnalisés. Vérifiez les données importantes auprès de sources officielles et de professionnels compétents.</p>
  </section>
 </main>;
}
