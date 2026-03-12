import { data } from "react-router";
import { z } from "zod";
import { emailClient, EMAIL_FROM, EMAIL_TO } from "~/lib/email/email-client.server";

const contactFormSchema = z.object({
  name: z.string().min(1),
  organization: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const parsed = contactFormSchema.safeParse({
    name: formData.get("name"),
    organization: formData.get("organization"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return data({ error: "Invalid form data" }, { status: 400 });
  }

  const { name, organization, email, message } = parsed.data;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="margin-top: 0; border-bottom: 2px solid #e85d04; padding-bottom: 12px;">New Contact Form Submission</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 10px 0; font-weight: bold; width: 140px; vertical-align: top; color: #555;">Name</td>
      <td style="padding: 10px 0;">${name}</td>
    </tr>
    <tr style="background: #f9f9f9;">
      <td style="padding: 10px 8px; font-weight: bold; vertical-align: top; color: #555;">Organization</td>
      <td style="padding: 10px 8px;">${organization}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; font-weight: bold; vertical-align: top; color: #555;">Email</td>
      <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #e85d04;">${email}</a></td>
    </tr>
    <tr style="background: #f9f9f9;">
      <td style="padding: 10px 8px; font-weight: bold; vertical-align: top; color: #555;">Message</td>
      <td style="padding: 10px 8px; white-space: pre-wrap;">${message}</td>
    </tr>
  </table>
  <p style="margin-top: 24px; font-size: 12px; color: #999;">Sent from theadpharm.com contact form</p>
</body>
</html>`.trim();

  const { error } = await emailClient.send({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    replyTo: `${name} <${email}>`,
    subject: `New Contact: ${name} — ${organization}`,
    html,
    text: `New Contact Form Submission\n\nName: ${name}\nOrganization: ${organization}\nEmail: ${email}\n\nMessage:\n${message}`,
  });

  if (error) {
    console.error("[api.contact] Email send failed:", error.message);
    return data({ error: "Failed to send message. Please try again." }, { status: 500 });
  }

  return data({ success: true });
}
