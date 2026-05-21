# Contact Form Email Setup

EasyFinanceTools.com sends contact form submissions through the Vercel serverless route at `/api/contact` using Resend.

## Required Vercel Environment Variable

```bash
RESEND_API_KEY=your_resend_api_key
```

Set this in Vercel for Production, Preview, and Development environments as needed.

## Optional Sender Variable

```bash
CONTACT_FROM_EMAIL="Easy Finance Tools <contact@easyfinancetools.com>"
```

Only use a custom sender after the sending domain is verified in Resend. If this is not set, the function uses Resend's default onboarding sender.

## Delivery

Submissions are sent to:

```text
gouravkumarpb08@gmail.com
```

The email includes the sender name, sender email, message, and timestamp. The sender email is also set as the reply-to address.

## Spam Protection

The frontend includes a hidden honeypot field and a form-start timestamp. The API silently accepts honeypot submissions and rejects unrealistically fast submissions.
