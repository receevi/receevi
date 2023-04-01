import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhook } from '../../lib/verify';
import { WebHookRequest } from '../../types/webhook';
import { createServiceClient } from '../../lib/supabase/service-client';

export async function GET(request: Request) {
  const urlDecoded = new URL(request.url)
  const urlParams = urlDecoded.searchParams
  let mode = urlParams.get('hub.mode');
  let token = urlParams.get('hub.verify_token');
  let challenge = urlParams.get('hub.challenge');
  if (mode && token && challenge && mode == 'subscribe') {
    const isValid = token == process.env.WEBHOOK_VERIFY_TOKEN
    if (isValid) {
      return new NextResponse(challenge)
    } else {
      return new NextResponse(null, { status: 403 })
    }
  } else {
    return new NextResponse(null, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  const headersList = headers();
  const xHubSigrature256 = headersList.get('x-hub-signature-256');
  const rawRequestBody = await request.text()
  console.log('rawRequestBody', rawRequestBody)
  if (!xHubSigrature256 || !verifyWebhook(rawRequestBody, xHubSigrature256)) {
    return new NextResponse(null, { status: 401 })
  }
  const webhookBody = JSON.parse(rawRequestBody) as WebHookRequest;
  if (webhookBody.entry.length > 0) {
    const supabase = createServiceClient()
    let { error } = await supabase
        .from('webhook')
        .insert(webhookBody.entry.map((entry) => {
          return { payload: entry }
        }))
    if (error) throw error
  }
  return new NextResponse()
}
