# Whatsapp Webhook

## Shape project future with Your Feedback
Help us improve our open-source "WhatsApp Webhook" project! Share your thoughts and suggestions in our community discussion: [Click here](https://github.com/whatsapp-webhook/whatsapp-webhook/discussions/2)

## * IN PROGRESS *

This project is meant to be used as whatsapp cloud api webhook receiver. This project is currently in progress.

## Work done so far
- Login with admin user working
- Contacts list just like in whatsapp web
- Can receive text message
- Can send text message (Other messsage types are yet to be done)
![alt text](images/message1.png)

## Roadmap
- User should be able to view received all type of messages


## Installation

### Prerequisites

- Whatsapp cloud API permanent token
    - To generate permanent token, you can follow this popular stackoverflow answer - https://stackoverflow.com/a/74253066

- Facebook app secret
    - Go to https://developers.facebook.com/apps/
    - Choose your app
    - Go to Settings > Basic
    - Get `App secret`

- Supabase account
    - Create an account and a project on https://supabase.com/
    - Get anon, service_role and project URL from there

- Geenrate random `JWT_SECRET_KEY`
    - `openssl rand -hex 32`

- Generate random `WEBHOOK_VERIFY_TOKEN`
    - `openssl rand -hex 32`

### Vercel setup
- [Deploy to vercel](https://vercel.com/new/git/external?repository-url=https://github.com/whatsapp-webhook/whatsapp-webhook&project-name=whatsapp-webhook&repository-name=whatsapp-webhook)
- Wait till build is finishd and hit Continue to dashbaoard
- Go to Settings > Environment variables
- Add following environment variables
    - `JWT_SECRET_KEY` - JWT secret key you generated in prerequisites
    - `WEBHOOK_VERIFY_TOKEN` - Whatsapp webhook verify token you generated in prerequisites
    - `WHATSAPP_ACCESS_TOKEN` - Whatsapp cloud API permanent token
    - `FACEBOOK_APP_SECRET` - Facebook app secret
    - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
    - `SUPABASE_SERVICE_ROLE` - Supabase service role
    - `WHATSAPP_API_PHONE_NUMBER_ID` - Phone number id from Whatsapp Cloud API
- Go to `Deployment`
- Click on three dot icon on last deployment and click "Redeploy" to refersh environment variables

### Supabase setup
- Create account at https://supabase.com/
- Create a project
- Clone this repository in your Computer
    - `git clone git@github.com:whatsapp-webhook/whatsapp-webhook.git`
- Install supabase cli from here - https://supabase.com/docs/guides/cli
- Go to https://app.supabase.com/account/tokens and generate access token
- Login into supabase cli
    ```
    supabase login
    ```
    - Paste access token in this command
- Link supabase account (Reference Id can be found in Project Settings)
    ```bash
    supabase link --project-ref <Reference Id>
    ```
    - Get Reference Id from Supabase > Project Settings > General
- Create database schema
    ```bash
    supabase db push
    ```
- Go to Supabase > Authentication > Add user > Create New User
- Enter email address and new password to create a user

### Whatsapp setup
- Go to https://developers.facebook.com/apps/
- Select App
- Go to Whatsapp > Configuration
- Under Webook, click Edit button
- Add callback URL
    - URL will be Vercel's deployment + `/webhook`
    - If your webhook deployment URL is `https://whatsapp-webhook.vercel.app/` then Callback URL will be `https://whatsapp-webhook.vercel.app/webhook`
- Add Verify token from environment variable `WEBHOOK_VERIFY_TOKEN`
- Click Verify and save
- Under Webhook fields click Manage
- Click subscribe checkbox in messages row and hit Done


### Test the integration
- Send test message to the whatsapp number
- Visit deplyoment URL
- See if message is received


## Running locally

- Copy `.env.local.example` into `.env.local`
- Fill all environment variables in `.env.local`
- Run the development server:
    ```bash
    npm run dev
    ```
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Disclaimer
This project is not affiliated with Whatsapp Inc. Whatsapp is a registered trademark of Whatsapp, Inc.
