import { Resend } from "resend";
import { getSiteSettings } from "./site-settings";

export async function sendNewOrderNotification(params: {
  orderId: string;
  totalDzd: number;
  shippingName: string;
  toEmail: string;
}) {
  const settings = await getSiteSettings();
  const resendApiKey = settings.resend_api_key?.trim() || process.env.RESEND_API_KEY;
  if (!resendApiKey) return;

  const resend = new Resend(resendApiKey);
  const fromEmail = settings.email_from?.trim() || (process.env.EMAIL_FROM ?? "Sani Modern <onboarding@resend.dev>");
  const baseUrl = settings.site_url?.trim() || (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL ?? "");
  const dashboardLink = baseUrl ? `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/dashboard/commandes/${params.orderId}` : null;

  const html = `
    <h2>Nouvelle commande</h2>
    <p><strong>N° commande :</strong> ${params.orderId}</p>
    <p><strong>Total :</strong> ${params.totalDzd.toLocaleString("fr-DZ")} DA</p>
    <p><strong>Client :</strong> ${params.shippingName}</p>
    ${dashboardLink ? `<p><a href="${dashboardLink}">Voir la commande dans le tableau de bord</a></p>` : ""}
  `;

  await resend.emails.send({
    from: fromEmail,
    to: [params.toEmail],
    subject: `[Sani Modern OEB] Nouvelle commande ${params.orderId.slice(0, 8)}`,
    html,
  });
}
