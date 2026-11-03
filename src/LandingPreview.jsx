import { ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, CircleDollarSign, FileUp, LayoutDashboard, Menu, PieChart, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { useState } from "react";
import "./landing.css";

const featureCards = [
  { icon: TrendingUp, title: "See the trend, not just the total.", text: "Follow revenue over time and spot the moments that deserve a closer look.", tone: "violet", href: "/analytics" },
  { icon: PieChart, title: "Know what moves the mix.", text: "Compare regions, categories, and sales channels in one clear view.", tone: "green", href: "/sales" },
  { icon: FileUp, title: "Bring your own numbers.", text: "Upload a CSV and get a custom analysis from the data you already have.", tone: "coral", href: "/custom-analysis" }
];

export default function LandingPreview() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <main className="insight-page">
    <section className="insight-hero" id="home">
      <div className="insight-orb insight-orb-one"/><div className="insight-orb insight-orb-two"/>
      <header className="insight-header">
        <a className="insight-brand" href="#home" aria-label="InsightX home"><span className="insight-brand-mark"><BarChart3 size={19}/></span><span>Insight<span>X</span></span></a>
        <button className="insight-menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><Menu size={20}/></button>
        <nav className={`insight-nav${menuOpen ? " insight-nav-open" : ""}`} aria-label="Main navigation"><a href="#features" onClick={() => setMenuOpen(false)}>Features</a><a href="#overview" onClick={() => setMenuOpen(false)}>How it works</a><a href="#insights" onClick={() => setMenuOpen(false)}>Insights</a><a className="insight-nav-cta" href="/">Open dashboard <ArrowUpRight size={15}/></a></nav>
      </header>

      <div className="insight-hero-grid">
        <div className="insight-hero-copy">
          <div className="insight-eyebrow"><span/> A clearer view of your business</div>
          <h1>See the story<br/>behind <em>every number.</em></h1>
          <p>Sales, customers, and performance—brought together in one calm, considered workspace.</p>
        <div className="insight-hero-actions"><a className="insight-primary-button" href="/">Explore the dashboard <ArrowRight size={16}/></a><a className="insight-secondary-link" href="#features">Take a closer look <ArrowDownRight size={16}/></a></div>
          <div className="insight-proof"><div className="insight-avatars"><span>SA</span><span>MK</span><span>JT</span></div><span>Made for teams who make data matter</span></div>
        </div>

        <div className="insight-dashboard-card" aria-label="Illustration of the InsightX analytics dashboard">
          <div className="insight-dash-top"><div className="insight-dash-brand"><span><BarChart3 size={13}/></span> insight<span>X</span></div><div className="insight-dash-actions"><i/><i/><i/></div></div>
          <div className="insight-dash-heading"><div><small>MONDAY, NOVEMBER 3</small><h2>Revenue overview</h2></div><span className="insight-period">Last 12 months <span>⌄</span></span></div>
          <div className="insight-dash-kpis"><div><span>Total sales</span><b>₹50.19L</b><small className="insight-positive">↗ 12.8%</small></div><div><span>Sales records</span><b>1,000</b><small className="insight-positive">↗ 8.2%</small></div><div><span>Units sold</span><b>25,355</b><small className="insight-negative">↘ 2.4%</small></div></div>
          <div className="insight-chart-title"><span>Revenue performance</span><small>Monthly</small></div>
          <div className="insight-line-chart"><div className="insight-chart-grid"><i/><i/><i/><i/></div><svg viewBox="0 0 520 160" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="landingChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8e83ff" stopOpacity=".35"/><stop offset="1" stopColor="#8e83ff" stopOpacity="0"/></linearGradient></defs><path className="insight-chart-area" d="M0 115 C38 105 40 95 79 100 S130 123 170 88 S222 68 259 76 S306 100 344 58 S399 82 432 47 S485 33 520 12 V160 H0Z"/><path className="insight-chart-stroke" d="M0 115 C38 105 40 95 79 100 S130 123 170 88 S222 68 259 76 S306 100 344 58 S399 82 432 47 S485 33 520 12"/></svg><div className="insight-chart-labels"><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span></div></div>
          <div className="insight-dash-bottom"><span><i/> Online</span><span><i/> Retail</span><span className="insight-dash-updated">Updated just now</span></div>
        </div>
      </div>
      <div className="insight-hero-footer"><span><Sparkles size={14}/> Less guesswork. More good decisions.</span><span>01 / 03</span></div>
    </section>

    <section className="insight-metric-strip" aria-label="Dashboard sample metrics"><div><span className="insight-metric-icon"><CircleDollarSign size={17}/></span><span><small>SALES TRACKED</small><b>₹50.19L</b></span><em>+12.8%</em></div><div><span className="insight-metric-icon"><Users size={17}/></span><span><small>SALES RECORDS</small><b>1,000</b></span><em>All in one view</em></div><div><span className="insight-metric-icon"><Zap size={17}/></span><span><small>UNITS SOLD</small><b>25,355</b></span><em>Across 4 regions</em></div><a href="/" className="insight-strip-link">Explore your dashboard <ArrowUpRight size={15}/></a></section>

    <section className="insight-intro" id="overview"><div className="insight-section-kicker">A LITTLE MORE CLARITY</div><div><h2>Good decisions start<br/>with a <em>better view.</em></h2><p>InsightX brings your key numbers into focus. Track what is changing, understand what is driving it, and spend less time searching for answers.</p></div><a className="insight-text-link" href="/">Step into InsightX <ArrowUpRight size={16}/></a></section>

    <section className="insight-features" id="features"><div className="insight-feature-heading"><div><div className="insight-section-kicker">THE SIGNAL IN YOUR SALES</div><h2>Everything connected.<br/><em>Nothing overwhelming.</em></h2></div><p>From the first glance to the deeper question, your data stays easy to follow.</p></div><div className="insight-feature-grid">{featureCards.map(({ icon: Icon, title, text, tone, href }, index) => <article className={`insight-feature-card insight-tone-${tone}`} key={title}><div className="insight-feature-top"><span className="insight-feature-icon"><Icon size={18}/></span><span>0{index + 1}</span></div><div className="insight-feature-art" aria-hidden="true">{index === 0 ? <div className="insight-mini-line"><i/><i/><i/><i/><i/><svg viewBox="0 0 220 60"><path d="M2 48 C35 44 38 23 71 33 S108 44 135 18 S174 29 218 4"/></svg></div> : index === 1 ? <div className="insight-mini-bars"><i/><i/><i/><i/><i/><i/></div> : <div className="insight-mini-upload"><span><FileUp size={21}/></span><i/><i/><i/></div>}</div><h3>{title}</h3><p>{text}</p><a href={href} aria-label={`Explore ${title}`}><ArrowUpRight size={16}/></a></article>)}</div></section>

    <section className="insight-story" id="insights"><div className="insight-story-visual"><div className="insight-story-window"><div className="insight-window-top"><span/><span/><span/><b>Sales by region</b></div><div className="insight-region-bars"><div><i style={{ height: "88%" }}/><span>North</span></div><div><i style={{ height: "68%" }}/><span>East</span></div><div><i style={{ height: "76%" }}/><span>West</span></div><div><i style={{ height: "54%" }}/><span>South</span></div></div><div className="insight-window-legend"><i/> Revenue <b>₹12.6L</b></div></div><span className="insight-story-orbit insight-story-orbit-a"/><span className="insight-story-orbit insight-story-orbit-b"/></div><div className="insight-story-copy"><div className="insight-section-kicker">FROM RAW DATA TO REAL DIRECTION</div><h2>Find the detail<br/>that <em>changes everything.</em></h2><p>Follow the patterns across time, regions, and products. Then bring your own CSV into Custom Analysis and ask a better question.</p><ul><li><span><TrendingUp size={15}/></span> Trends that put performance in context</li><li><span><PieChart size={15}/></span> Clear comparisons across your business</li><li><span><FileUp size={15}/></span> Your uploaded data, your own analysis</li></ul><a className="insight-outline-button" href="/custom-analysis">See your custom analysis <ArrowUpRight size={16}/></a></div></section>

    <section className="insight-cta"><div className="insight-cta-mark"><LayoutDashboard size={20}/></div><div className="insight-section-kicker">YOUR NEXT CLEAR DECISION</div><h2>Make room for the<br/><em>bigger picture.</em></h2><p>Bring the work into focus with InsightX.</p><a className="insight-primary-button" href="/">Open the dashboard <ArrowRight size={16}/></a><span className="insight-cta-glow"/></section>

    <footer className="insight-footer"><a className="insight-brand" href="#home"><span className="insight-brand-mark"><BarChart3 size={18}/></span><span>Insight<span>X</span></span></a><span>Revenue intelligence, made clear.</span><a href="#home">Back to top ↑</a></footer>
  </main>;
}
