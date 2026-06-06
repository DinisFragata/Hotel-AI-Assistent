import sgMail from "@sendgrid/mail"

export const hasSendGridConfig = !!(
  process.env.SENDGRID_API_KEY &&
  process.env.SENDGRID_FROM_EMAIL &&
  process.env.SENDGRID_TO_EMAIL
)

export async function sendOpsEmail(subject: string, body: string): Promise<boolean> {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    await sgMail.send({
      to: process.env.SENDGRID_TO_EMAIL!,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject,
      text: body,
    })
    return true
  } catch {
    return false
  }
}
