/** Marketing copy that appears on more than one page lives here. */

export const customerPath = [
  {
    title: "Find you",
    body: "When someone nearby searches for what you do, your Google listing should be complete, current, and easy to choose.",
  },
  {
    title: "Trust you",
    body: "Recent photos, honest reviews, and a website that looks like the business they just met in person.",
  },
  {
    title: "Contact you",
    body: "Call, text, request a quote, or book — on a phone, in one tap. No hunting for a number.",
  },
] as const;

export const serviceOffers = [
  {
    index: "01",
    id: "google",
    kicker: "Google Business Profile",
    title: "Be easier to find.",
    body: "Accurate services, fresh photos, current hours, and a profile that gives nearby customers a reason to take a closer look.",
    points: "Profile setup · Ongoing updates · Local visibility",
  },
  {
    index: "02",
    id: "website",
    kicker: "Websites + local SEO",
    title: "Make the next step obvious.",
    body: "A fast website that explains what you do, shows where you work, and makes calling or requesting a quote simple on any phone.",
    points: "Clear service pages · Mobile design · Quote requests",
  },
  {
    index: "03",
    id: "reviews",
    kicker: "Reviews + tap cards",
    title: "Let good work build trust.",
    body: "Make it easy for customers to leave an honest review and keep your contact details handy. One tap, with a QR code as backup.",
    points: "Review stands · Smart business cards · Review replies",
  },
] as const;

export const howItWorks = [
  {
    title: "Send us your business.",
    body: "Share your business name, town, and website or Google listing. No passwords needed.",
  },
  {
    title: "See your opportunities.",
    body: "We review your profile, website, and review process. You get priorities explained in plain English.",
  },
  {
    title: "Choose what we handle.",
    body: "Pick a focused service or the complete plan. Each month, see the work completed and the metrics available.",
  },
] as const;

export const cardHowItWorks = [
  {
    title: "We build it.",
    body: "Add your logo, business information, website and links. We program the card and set up your permanent Maprizz URL.",
  },
  {
    title: "They tap it.",
    body: "A customer taps the card or scans the QR code. No app to download, nothing to type.",
  },
  {
    title: "They connect.",
    body: "Your website, contact info, directions, booking page or review link opens instantly.",
  },
] as const;

export const whatWeCheck = [
  {
    title: "Google listing",
    body: "Name, categories, services, hours, photos, description, and whether the profile matches how you actually take work.",
  },
  {
    title: "How people reach you",
    body: "Click-to-call, quote forms, booking links, and whether the next step is obvious on a phone.",
  },
  {
    title: "Website basics",
    body: "Speed, mobile layout, service pages, and whether your town and trade are stated clearly.",
  },
  {
    title: "Reviews",
    body: "How recent they are, whether you reply, and whether you have a simple, allowed way to ask after a job.",
  },
  {
    title: "Consistency",
    body: "Phone, address, and website matching across Google, the site, and anywhere else a customer might look.",
  },
  {
    title: "What to skip",
    body: "We will not invent an SEO score, promise a ranking, or recommend ads you do not need yet.",
  },
] as const;

export const trustPoints = [
  "Your Google profile stays in your account.",
  "Your domain and content stay yours.",
  "Clear deliverables, without ranking guarantees.",
] as const;

export const faqs = [
  {
    question: "Do I need a monthly plan to use the cards?",
    answer:
      "No. The Tap Card, Smart Business Card and Business Kit are one-time purchases and do not require a monthly service plan. Plans are for businesses that want Maprizz to actively run their Google presence or website.",
  },
  {
    question: "Am I locked into a contract?",
    answer:
      "Plans are billed monthly through Stripe — first charge today, then automatically every month. Google Foundations is month to month from day one. Website plans have a 6-month minimum because we build the site up front; after that, month to month. Cancel by email, no hoops.",
  },
  {
    question: "Who owns the website and the Google profile?",
    answer:
      "You do. Your domain stays in your name, your Google Business Profile stays under your Google account (we're added as a manager), and if you leave we hand over the site files.",
  },
  {
    question: "Can you guarantee rankings or a number of reviews?",
    answer:
      "No. Rankings depend on factors such as relevance, distance, and competition. We commit to the work in your plan and report the metrics available to us. Review-link taps are not the same as completed reviews or booked jobs.",
  },
  {
    question: "How fast do you reply to an audit?",
    answer:
      "A real person looks at your listing and website and replies within two business days with the fixes that matter most. No automated score and no obligation to buy.",
  },
  {
    question: "Do you only work in Bend?",
    answer:
      "Joey is based in Bend and focuses on Central Oregon businesses. Cards ship nationwide. If you are outside the area, request an audit — we will tell you honestly whether a monthly plan is a fit.",
  },
] as const;

export const cardFaqs = [
  {
    question: "Does the customer need an app?",
    answer:
      "No. NFC-enabled modern smartphones read the card natively and open the link in the browser. Every card also carries a QR code as a backup for phones without NFC.",
  },
  {
    question: "What happens if I change my website or phone number later?",
    answer:
      "Nothing changes on the card. Every Maprizz product points to a permanent short URL like maprizz.com/t/ABC123. You change where it goes from your dashboard and the card keeps working.",
  },
  {
    question: "Can Maprizz tell me how many Google reviews I got?",
    answer:
      "A tap is not a completed review. Maprizz tracks how many people opened your review link. Your visible Google review count is a different number, and we report them separately. We never claim to count reviews Google does not share.",
  },
  {
    question: "What's the difference between the Tap Card and the Smart Business Card?",
    answer:
      "The Tap Card opens one destination, usually your website. The Smart Business Card opens a Maprizz profile page with Call, Text, Website, Directions, socials and Save Contact all on one screen. Both use the same permanent URL system.",
  },
] as const;
