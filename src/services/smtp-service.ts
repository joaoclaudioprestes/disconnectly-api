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
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as nodemailer.TransportOptions)

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
