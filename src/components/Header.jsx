import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

const navLinks = [{ name: "Calculators", path: "/tools" }, { name: "Guides", path: "/blog" }, { name: "About", path: "/about" }];
function Icon({ name, size = 19 }) {
  const shared={stroke:"currentColor",strokeWidth:"1.85",strokeLinecap:"round",strokeLinejoin:"round",fill:"none"};
  if(name==="search") return <svg {...shared} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="7.2"/><path d="m16 16 5 5"/></svg>;
  if(name==="sun") return <svg {...shared} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>;
  if(name==="moon") return <svg {...shared} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 14.9A8.8 8.8 0 0 1 9.1 3.6 8.9 8.9 0 1 0 20.4 14.9Z"/></svg>;
  if(name==="menu") return <svg {...shared} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
  if(name==="close") return <svg {...shared} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>;
  return null;
}
export default function Header({ onOpenSearch }) {
  const location=useLocation();
  const [open,setOpen]=useState(false),[dark,setDark]=useState(false),[ready,setReady]=useState(false);
  useEffect(()=>{setDark(localStorage.getItem("theme")==="dark");setReady(true);},[]);
  useEffect(()=>{if(!ready)return;document.documentElement.classList.toggle("dark",dark);localStorage.setItem("theme",dark?"dark":"light");},[ready,dark]);
  useEffect(()=>{setOpen(false);},[location.pathname]);
  useEffect(()=>{if(!open)return;const onEsc=e=>{if(e.key==="Escape")setOpen(false);};window.addEventListener("keydown",onEsc);return()=>window.removeEventListener("keydown",onEsc);},[open]);
  const openSearch=()=>{setOpen(false);onOpenSearch?.();};
  const navClass=({isActive})=>`focus-ring flex min-h-11 items-center rounded-xl px-4 text-sm font-bold transition ${isActive?"eft-nav-active":"text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800"}`;
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0B1D32]/95" role="banner">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Logo size="sm" />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map(link=><NavLink key={link.path} to={link.path} className={navClass}>{link.name}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <button type="button" onClick={openSearch} aria-label="Search calculators and guides" title="Search (Ctrl+K)" className="focus-ring flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Icon name="search" size={17}/><span>Search</span><kbd className="ml-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs dark:border-slate-600 dark:bg-slate-900">⌘ K</kbd>
          </button>
          <button type="button" onClick={()=>setDark(x=>!x)} aria-label={dark?"Switch to light mode":"Switch to dark mode"} className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><Icon name={dark?"sun":"moon"}/></button>
          <Link to="/tools" className="eft-brand-button ml-1 text-sm">Explore tools <span aria-hidden="true">→</span></Link>
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <button type="button" onClick={openSearch} aria-label="Search calculators and guides" className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"><Icon name="search"/></button>
          <button type="button" onClick={()=>setDark(x=>!x)} aria-label={dark?"Switch to light mode":"Switch to dark mode"} className="focus-ring hidden h-11 w-11 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800 sm:flex"><Icon name={dark?"sun":"moon"}/></button>
          <button type="button" aria-controls="eft-mobile-navigation" aria-expanded={open} aria-label={open?"Close navigation menu":"Open navigation menu"} onClick={()=>setOpen(x=>!x)} className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-white"><Icon name={open?"close":"menu"} size={24}/></button>
        </div>
      </div>
      {open && <nav id="eft-mobile-navigation" aria-label="Mobile navigation" className="border-t border-slate-200 bg-white px-4 py-4 shadow-xl dark:border-slate-800 dark:bg-[#0B1D32] md:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-2">
          {navLinks.map(link=><NavLink key={link.path} to={link.path} className={navClass}>{link.name}</NavLink>)}
          <Link to="/contact" className="focus-ring flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-slate-600 dark:text-slate-200">Contact</Link>
          <button type="button" onClick={openSearch} className="focus-ring flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-left text-sm font-semibold dark:border-slate-700"><Icon name="search"/> Search tools and guides</button>
          <button type="button" onClick={()=>setDark(x=>!x)} className="focus-ring flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm font-semibold text-slate-600 dark:text-slate-200 sm:hidden"><Icon name={dark?"sun":"moon"} />{dark?"Light appearance":"Dark appearance"}</button>
          <Link to="/tools" className="eft-brand-button mt-1" onClick={()=>setOpen(false)}>Start with a calculator <span aria-hidden="true">→</span></Link>
        </div>
      </nav>}
    </header>
  );
}
