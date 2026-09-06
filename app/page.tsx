import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, MapPin, MousePointer2, Search, Star, Wrench } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { FaqList, ProductGrid, ServicePlanGrid } from "@/components/marketing/sections";
import { ButtonLink } from "@/components/ui/button";
import { servicesFaqs } from "@/lib/catalog";

const services = [
  { icon: Search, number: "01", title: "Be easier to find.", label: "GOOGLE BUSINESS PROFILE", copy: "Accurate services, fresh photos, current hours, and a profile that gives nearby customers a reason to take a closer look.", detail: "Profile setup · Ongoing updates · Local visibility" },
  { icon: MousePointer2, number: "02", title: "Make the next step obvious.", label: "WEBSITES + LOCAL SEO", copy: "A fast website that explains what you do, shows where you work, and makes calling or requesting a quote simple on any phone.", detail: "Clear service pages · Mobile design · Quote requests" },
  { icon: Star, number: "03", title: "Let good work build trust.", label: "REVIEWS + TAP CARDS", copy: "Make it easy for customers to leave an honest review and keep your contact details handy. One tap, with a QR code as backup.", detail: "Review stands · Smart business cards · Review replies" },
];

export default function HomePage() {
  return (
    <MarketingShell>
      <section className="growth-hero">
        <div className="growth-container hero-layout">
          <div className="hero-copy rise">
            <p className="growth-eyebrow"><MapPin size={15} aria-hidden="true" /> BASED IN BEND. BUILT FOR LOCAL BUSINESS.</p>
            <h1>Your next<br />customer is<br /><span>looking for you.</span></h1>
            <p className="hero-description">You do great work. We help people find it—with a stronger Google presence, a better website, and an easier way to earn reviews.</p>
            <div className="hero-actions">
              <ButtonLink href="/audit" size="lg">Get my free business audit <ArrowRight size={18} aria-hidden="true" /></ButtonLink>
              <a className="text-link" href="#how-it-works">See how it works <ArrowDown size={16} aria-hidden="true" /></a>
            </div>
            <p className="hero-reassurance">A personal review of your business. No obligation.</p>
            <div className="hero-bottom"><span className="mini-rule" /><p>More than a website.<br /><strong>A clearer path from search to customer.</strong></p></div>
          </div>
          <div className="hero-visual rise-2">
            <div className="hero-image">
              <Image src="/images/local-craft.jpg" alt="A craftsperson hand-finishing timber in a workshop" fill priority sizes="(max-width: 800px) 100vw, 48vw" className="object-cover" />
              <div className="image-caption"><Wrench size={17} aria-hidden="true" /><span>FOR THE PEOPLE<br /><strong>WHO DO THE WORK.</strong></span></div>
            </div>
            <div className="journey-note">
              <span className="note-kicker">YOUR CUSTOMER’S NEXT STEPS</span>
              <div><span><Search size={19} aria-hidden="true" />Find you</span><ArrowRight size={15} aria-hidden="true" /><span><Star size={19} aria-hidden="true" />Trust you</span><ArrowRight size={15} aria-hidden="true" /><span><MousePointer2 size={19} aria-hidden="true" />Contact you</span></div>
            </div>
          </div>
        </div>
      </section>
      <div className="industry-strip"><div className="growth-container"><p>LOCAL WORK.<br /><strong>REAL BUSINESSES.</strong></p><ul aria-label="Businesses we help"><li>Home services</li><li>Contractors</li><li>Auto detailers</li><li>Barbers & salons</li><li>Local shops</li></ul></div></div>
      <section className="growth-section" id="services">
        <div className="growth-container">
          <div className="section-heading"><div><p className="growth-eyebrow">GOOD WORK SHOULD GET NOTICED</p><h2>Give people a reason<br />to choose <em>you.</em></h2></div><p>Your customers check Google, read reviews, and visit your website. We make those pieces work together.</p></div>
          <div className="service-story-grid">{services.map(({icon:Icon,...item})=><article key={item.number}><div className="service-top"><Icon size={27} strokeWidth={1.5} aria-hidden="true" /><span>{item.number}</span></div><p className="growth-eyebrow">{item.label}</p><h3>{item.title}</h3><p>{item.copy}</p><div className="service-detail">{item.detail}</div></article>)}</div>
        </div>
      </section>
      <section className="audit-feature" id="how-it-works">
        <div className="growth-container audit-layout">
          <div><p className="growth-eyebrow">START WITH CLARITY</p><h2>Find the gaps.<br />Make a plan.<br /><span>Get back to work.</span></h2><p>Before recommending a plan, we look at how your business shows up online. You get a short, useful list of what to improve first.</p><ButtonLink href="/audit" size="lg">Show me what to improve <ArrowRight size={18} aria-hidden="true" /></ButtonLink></div>
          <ol className="process-list">
            <li><span>01</span><div><h3>Send us your business.</h3><p>Share your business name, town, and website or Google listing. No passwords needed.</p></div></li>
            <li><span>02</span><div><h3>See your opportunities.</h3><p>We review your profile, website, and review process. You get priorities explained in plain English.</p></div></li>
            <li><span>03</span><div><h3>Choose what we handle.</h3><p>Pick a focused service or the complete plan. Each month, see the work completed and the metrics available.</p></div></li>
          </ol>
        </div>
      </section>
      <section className="growth-section" id="pricing">
        <div className="growth-container">
          <div className="section-heading"><div><p className="growth-eyebrow">CLEAR SCOPE. ONE MONTHLY PRICE.</p><h2>A plan for your<br /><em>next chapter.</em></h2></div><p>Start with the part you need, or bring your Google presence, website, and reviews together. Pricing is per business location.</p></div>
          <ServicePlanGrid />
          <div className="pricing-footnote"><p>Setup included. Website plans have a 6-month initial term.<br />Paid advertising and ad spend are not included.</p><Link href="/services" className="text-link">Compare the details <ArrowRight size={16} aria-hidden="true" /></Link></div>
        </div>
      </section>
      <section className="owner-section"><div className="growth-container owner-layout"><div className="owner-heading"><MapPin size={32} strokeWidth={1.5} aria-hidden="true" /><p className="growth-eyebrow">A LOCAL PARTNER</p><h2>A real person.<br />Invested in<br /><em>your business.</em></h2></div><div><p className="owner-intro">Hey, I’m Joey. I’m based in Bend, and I help local business owners make their online presence work harder.</p><p>You should know what you’re paying for, who’s doing the work, and what changed this month. That’s how I want to build Maprizz.</p><ul className="owner-promises"><li><Check size={18} aria-hidden="true" />Your Google profile stays in your account.</li><li><Check size={18} aria-hidden="true" />Your domain and content stay yours.</li><li><Check size={18} aria-hidden="true" />Clear deliverables, without ranking guarantees.</li></ul><a href="mailto:hello@maprizz.com" className="text-link">Talk to Joey <ArrowRight size={16} aria-hidden="true" /></a></div></div></section>
      <section className="growth-section cards-section" id="cards"><div className="growth-container"><div className="section-heading"><div><p className="growth-eyebrow">SMALL CARD. USEFUL CONNECTION.</p><h2>Make a great<br /><em>last impression.</em></h2></div><div><p>Just need a tap card or review stand? Keep it simple with a one-time purchase. No monthly plan required.</p><Link href="/demo" className="text-link mt-5">Try the interactive demo <ArrowRight size={16} aria-hidden="true" /></Link></div></div><ProductGrid /></div></section>
      <section className="growth-section faq-section"><div className="growth-container faq-layout"><div><p className="growth-eyebrow">BEFORE WE GET STARTED</p><h2>Good questions.<br /><em>Straight answers.</em></h2><a href="mailto:hello@maprizz.com" className="text-link mt-6">Ask Joey a question <ArrowRight size={16} aria-hidden="true" /></a></div><FaqList items={servicesFaqs} /></div></section>
      <section className="final-audit"><div className="growth-container"><p className="growth-eyebrow">LET’S MAKE YOUR BUSINESS EASIER TO CHOOSE</p><h2>You handle the work.<br /><span>We’ll help you get noticed.</span></h2><p>Start with a free review of your Google profile and website.</p><ButtonLink href="/audit" variant="dark" size="lg">Get my free business audit <ArrowRight size={18} aria-hidden="true" /></ButtonLink><small>No obligation. Just a useful place to start.</small></div></section>
    </MarketingShell>
  );
}
