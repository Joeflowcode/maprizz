import { MarketingShell } from "@/components/layout/marketing-shell";
import { LegalDocument } from "@/components/marketing/sections";
import { site } from "@/lib/site";

export default function TermsPage() {
  return (
    <MarketingShell>
      <LegalDocument title="Terms of Service" updated="September 4, 2026">
        <section>
          <h2>Products</h2>
          <p>
            Maprizz sells NFC cards, NFC review stands and related setup. Each product
            is programmed with a permanent Maprizz short URL that redirects to a
            destination you control. Prices are shown in US dollars and charged once at
            checkout. Applicable taxes and shipping, if any, are shown before you pay.
          </p>
        </section>
        <section>
          <h2>Your profile and links</h2>
          <p>
            You are responsible for the accuracy of the business information, links and
            logo you provide, and you confirm you have the right to use them. We may
            disable a link or profile that is used for unlawful, misleading or abusive
            content.
          </p>
        </section>
        <section>
          <h2>Short URLs and service continuity</h2>
          <p>
            We intend to keep Maprizz short URLs working for the life of the product. If
            we ever need to discontinue the redirect service we will give reasonable
            notice so you can reprogram your products.
          </p>
        </section>
        <section>
          <h2>Review practices</h2>
          <p>
            Maprizz review stands make it easy for a customer to open your Google review
            form. You agree not to offer incentives for reviews, selectively solicit
            (&ldquo;gate&rdquo;) reviews, or post reviews on your own behalf. Maprizz
            reports taps on your review link; it does not and cannot report how many
            reviews were submitted.
          </p>
        </section>
        <section>
          <h2>Compatibility</h2>
          <p>
            NFC products work with NFC-enabled modern smartphones. A QR code is printed
            as a backup. We cannot guarantee compatibility with every device.
          </p>
        </section>
        <section>
          <h2>Returns and defects</h2>
          <p>
            Products are made to order with your branding. If a card or stand arrives
            damaged or fails to read, contact us within 30 days and we will replace it.
          </p>
        </section>
        <section>
          <h2>No ranking guarantees</h2>
          <p>
            Search engines control their own results. Maprizz does not guarantee any
            ranking, review count or business outcome.
          </p>
        </section>
        <section>
          <h2>Third-party services and trademarks</h2>
          <p>
            Payments are processed by Stripe under Stripe&apos;s terms. {site.disclaimer}
          </p>
        </section>
        <section>
          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Maprizz is not liable for indirect,
            incidental or consequential damages arising from use of our products or this
            website. Our total liability is limited to the amount you paid for the
            product in question.
          </p>
        </section>
        <section>
          <h2>Governing law and contact</h2>
          <p>
            These terms are governed by the laws of the State of Oregon. Questions? Email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </section>
      </LegalDocument>
    </MarketingShell>
  );
}
