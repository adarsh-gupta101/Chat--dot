import { EmailTemplate } from "@/components/email/payment-sucessful";

import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function PaymentSuccessEmail(email: string, username: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Adarsh@ship-your-saas.com",
      to: email,
      subject: "🎉You have bought Ship Your SaaS!",
      react: EmailTemplate({ firstName: username }) as React.ReactElement,
      reply_to: "adarshguptaworks@gmail.com",
    });
    console.log(data);
  } catch (error) {
    console.log(error);
    return error;
  }
}