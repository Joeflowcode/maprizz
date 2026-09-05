import { MarketingShell } from "@/components/layout/marketing-shell";
import { LegalDocument } from "@/components/marketing/sections";
import { site } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <LegalDocument title="Privacy Policy" updated="September 4, 2026">
        <section>
          <h2>The short version</h2>
          <p>
            We collect what we need to build your card, run your profile page and
            show you how it&apos;s used. We don&apos;t sell information. We don&apos;t
            track the people who tap your card beyond a count.
          </p>
        </section>
        <section>
          <h2>Information customers give us</h2>
          <p>
            When you order or when we set you up in person, we collect your business
            name, contact name, phone, email, website, address, social links, booking
            link, Google links and logo. This information is used to produce your NFC
            products and to publish your Maprizz profile page if your package includes
            one. Payments are processed by Stripe; we never see or store full card
            numbers.
          </p>
        </section>
        <section>
          <h2>Information about people who tap or scan</h2>
          <p>
            When someone opens a Maprizz short link (for example maprizz.com/t/ABC123)
            we record that a tap happened, the time, the referring page if the browser
            sends one, and the browser&apos;s user-agent string. We do not record names,
            precise location or persistent identifiers, and we do not set tracking
            cookies on profile pages. Tap counts are shown to the business that owns
            the link.
          </p>
          <p>
            Maprizz can see that a review link was tapped. It cannot see whether a
            review was written, and we never claim otherwise.
          </p>
        </section>
        <section>
          <h2>Free audit and contact requests</h2>
          <p>
            If you request a free business audit we store what you enter (business
            name, your name, email, phone, website, Google Business Profile link and
            notes) so we can review your business and reply.
          </p>
        </section>
        <section>
          <h2>Accounts</h2>
          <p>
            Customer accounts use email sign-in links. We store your email address and
            a role (customer or admin). Session cookies keep you signed in; they are
            essential and not used for advertising.
          </p>
        </section>
        <section>
          <h2>Who we share it with</h2>
          <p>
            Service providers that help us operate: hosting, database and authentication
            (Supabase), payments (Stripe) and transactional email. They process
            information only on our behalf. We do not sell personal information.
          </p>
        </section>
        <section>
          <h2>Retention and your choices</h2>
          <p>
            We keep customer and order records while you are a customer and for a
            reasonable period afterward for accounting. You can ask us to correct or
            delete your information, or to disable your profile page, by emailing{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </section>
        <section>
          <h2>Third-party trademarks</h2>
          <p>{site.disclaimer}</p>
        </section>
        <section>
          <h2>Changes and contact</h2>
          <p>
            We may update this policy as our products change. Questions? Email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </section>
      </LegalDocument>
    </MarketingShell>
  );
}
