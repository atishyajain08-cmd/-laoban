// Floating WhatsApp contact button. Set VITE_WHATSAPP_NUMBER (digits only, with
// country code, e.g. 919876543210) in .env to point it at the real number.
const NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || '910000000000';

export default function WhatsAppButton() {
  const href = `https://wa.me/${NUMBER}?text=${encodeURIComponent('Hi Laoban! I have a query.')}`;
  return (
    <a className="whatsapp-fab" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.04-.97.22-3.27-.68-2.76-1.09-4.5-3.94-4.64-4.13-.13-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.27.24-.27.53-.34.71-.34.18 0 .35 0 .51.01.16.01.39-.06.6.46.24.58.82 2 .89 2.15.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.14.15-.29.31-.13.6.17.29.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.35 1.45.29.15.46.13.63-.08.17-.21.73-.85.92-1.14.19-.29.39-.24.65-.15.27.1 1.71.81 2 .96.29.15.49.22.56.34.07.12.07.7-.17 1.38z" />
      </svg>
    </a>
  );
}
