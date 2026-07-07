import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

// Sanity GROQ-powered webhook target. Configure a webhook in Sanity (manage.sanity.io)
// pointing at /api/revalidate with the secret SANITY_REVALIDATE_SECRET and a
// projection of `{ _type }`. On publish, this busts the matching cache tag.
type WebhookPayload = { _type?: string };

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 });
    }

    if (!body?._type) {
      return new Response('Bad request: missing _type in payload', {
        status: 400,
      });
    }

    // Next 16 requires a cache profile; 'max' = stale-while-revalidate.
    revalidateTag(body._type, 'max');
    return NextResponse.json({ revalidated: true, tag: body._type });
  } catch (err) {
    console.error('Revalidate webhook error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(message, { status: 500 });
  }
}
