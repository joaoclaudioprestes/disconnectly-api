import { env } from '@/env'
import nodemailer from 'nodemailer'

interface ISmtpService {
  to: string
  subject: string
  text: string
}

export class SmtpService {
  private transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    service: env.SMTP_SERVICE,
    auth: {
      user: env.SMTP_EMAIL,
      pass: env.SMTP_GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  public async sendEmail(data: ISmtpService): Promise<void> {
    try {
      if (!data.to || !data.subject || !data.text) {
        throw new Error('Missing email parameters')
      }

      const emailOptions = {
        from: env.SMTP_EMAIL,
        to: data.to,
        subject: data.subject,
        text: data.text,
      }

      await this.transporter.sendMail(emailOptions)
    } catch (error) {
      console.error('Error sending email:', error)
      throw new Error(
        `Error sending email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
