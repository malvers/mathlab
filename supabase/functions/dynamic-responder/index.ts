// The VGP push function runs on Supabase under the slug "dynamic-responder" (named in the dashboard);
// its code lives in ../push-on-message. This entry only lets `supabase functions deploy dynamic-responder`
// find it - importing the module starts its Deno.serve.
import '../push-on-message/index.ts';
