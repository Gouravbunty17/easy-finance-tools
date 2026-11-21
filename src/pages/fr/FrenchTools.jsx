import React from "react";
import {Link} from "react-router-dom";
import SEO from "../../components/SEO";

const tools=[
 {name:"Calculateur hypothécaire",description:"Estimez le versement mensuel, le capital emprunté, l'assurance prêt et le taux de qualification.",path:"/fr/outils/calculateur-hypothecaire",fr:true},
 {name:"Calculateur CELI",description:"Droits de cotisation estimés et croissance de l'épargne.",path:"/tools/tfsa-calculator"},
 {name:"Calculateur REER",description:"Déduction fiscale et projections d'épargne-retraite.",path:"/tools/rrsp-calculator"},
 {name:"Calculateur CELIAPP",description:"Épargne pour une première propriété et cotisations admissibles.",path:"/tools/fhsa-calculator"},
 {name:"Calculateur d'impôt sur le revenu",description:"Estimation du revenu après impôt selon la province.",path:"/tools/income-tax-calculator"}
];
export default function FrenchTools(){
 return <main className="mx-auto max-w-6xl flex-1 px-4 py-12 sm:px-6">
  <SEO title="Calculateurs financiers pour les Canadiens | Outils en français" description="Trouvez votre calculateur financier au Canada. Hypothèque disponible en français; CELI, REER, CELIAPP et impôt actuellement en anglais." canonical="https://easyfinancetools.com/fr/outils"/>
  <p className="eft-eyebrow">Outils financiers · Canada</p>
  <h1 className="eft-display mt-3 text-3xl font-extrabold text-primary dark:text-white sm:text-4xl">Calculateurs financiers gratuits</h1>
  <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700 dark:text-slate-300">Choisissez un objectif, entrez vos paramètres et examinez les hypothèses. Aucun compte n'est nécessaire. La traduction française est en cours et la langue disponible figure sur chaque outil.</p>
  <div className="mt-8 grid gap-4 md:grid-cols-2">
   {tools.map(tool=><Link key={tool.path} to={tool.path} hrefLang={tool.fr?"fr-CA":"en-CA"} className="eft-tool-card p-6">
    <span className="text-xs font-bold uppercase tracking-wider text-secondary">{tool.fr?"En français":"En anglais"}</span>
    <h2 className="mt-3 text-xl font-bold text-primary dark:text-white">{tool.name}</h2>
    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{tool.description}</p>
    <span className="mt-4 inline-block text-sm font-bold text-secondary">Ouvrir le calculateur →</span>
   </Link>)}
  </div>
  <section className="eft-surface mt-10 p-6">
   <h2 className="text-xl font-bold text-primary dark:text-white">Avant de commencer</h2>
   <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Pour une hypothèque, préparez le prix d'achat, la mise de fonds, un taux indicatif et la période d'amortissement. Pour un compte enregistré, consultez vos droits de cotisation personnels auprès de l'Agence du revenu du Canada (ARC).</p>
   <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Les outils marqués « en anglais » ouvrent la page anglaise actuelle. Ils ne sont pas encore traduits; nous préférons le signaler plutôt que présenter une traduction incomplète comme une version française.</p>
  </section>
  <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Information éducative seulement. Vérifiez les hypothèses, les règles applicables et les conditions de votre prêteur avant toute décision importante.</p>
 </main>;
}
