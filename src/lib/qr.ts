import "server-only";
import QRCode from "qrcode";

/** Inline QR for arbitrary URLs (e.g. a Stripe payment link shown to a customer in person). */
export function qrDataUrl(text: string, size = 512) {
  return QRCode.toDataURL(text, { errorCorrectionLevel: "M", margin: 2, width: size, color: { dark: "#16120e", light: "#ffffff" } });
}
