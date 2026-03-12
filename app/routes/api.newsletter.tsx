import { data } from "react-router";
import { z } from "zod";
import { emailClient, EMAIL_FROM, EMAIL_TO } from "~/lib/email/email-client.server";

const newsletterFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const parsed = newsletterFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return data({ error: "Invalid form data" }, { status: 400 });
  }

  const { firstName, lastName, email } = parsed.data;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="margin-top: 0; border-bottom: 2px solid #e85d04; padding-bottom: 12px;">New Newsletter Subscriber</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 10px 0; font-weight: bold; width: 140px; vertical-align: top; color: #555;">Name</td>
      <td style="padding: 10px 0;">${firstName} ${lastName}</td>
    </tr>
    <tr style="background: #f9f9f9;">
      <td style="padding: 10px 8px; font-weight: bold; vertical-align: top; color: #555;">Email</td>
      <td style="padding: 10px 8px;"><a href="mailto:${email}" style="color: #e85d04;">${email}</a></td>
    </tr>
  </table>
  <p style="margin-top: 24px; font-size: 12px; color: #999;">Sent from theadpharm.com newsletter subscription form</p>
</body>
</html>`.trim();

  const { error } = await emailClient.send({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: `New Newsletter Subscriber: ${firstName} ${lastName}`,
    html,
    text: `New Newsletter Subscriber\n\nName: ${firstName} ${lastName}\nEmail: ${email}`,
  });

  if (error) {
    console.error("[api.newsletter] Email send failed:", error.message);
    return data({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }

  return data({ success: true });
}
