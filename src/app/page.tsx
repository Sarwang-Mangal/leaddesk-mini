import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'LeadDesk Mini — Turn enquiries into your next opportunity',
  description:
    'Submit your project enquiry and get a fast, clear response. We respond to every genuine lead.',
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">LeadDesk Mini</span>
          </div>
          <Link
            href="/admin"
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Admin →
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-medium text-indigo-700">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Now taking enquiries
              </div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Turn enquiries into your{' '}
                <span className="text-indigo-600">next opportunity.</span>
              </h1>
              <p className="text-lg text-slate-600">
                Share your project details and budget — we&apos;ll get back to you
                quickly with a clear, straightforward response.
              </p>
            </div>
          </div>
        </section>

        {/* Form section */}
        <section className="py-12 sm:py-16" aria-label="Enquiry form">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_420px] lg:items-start">
              {/* Trust points */}
              <div className="space-y-8 lg:pt-4">
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-slate-900">
                    Why enquire through LeadDesk Mini?
                  </h2>
                  <p className="text-slate-600">
                    We handle every enquiry with care. No spam, no vague
                    responses — just clear, timely follow-ups.
                  </p>
                </div>

                <ul className="space-y-6">
                  {[
                    {
                      icon: '⚡',
                      title: 'Fast response',
                      desc: 'Every enquiry is reviewed and responded to promptly.',
                    },
                    {
                      icon: '💷',
                      title: 'Clear budgets',
                      desc: 'Tell us your budget upfront so we can give you an honest, relevant reply.',
                    },
                    {
                      icon: '📋',
                      title: 'Simple follow-up',
                      desc: 'We track every lead — nothing slips through the cracks.',
                    },
                  ].map(({ icon, title, desc }) => (
                    <li key={title} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                        {icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{title}</h3>
                        <p className="mt-0.5 text-sm text-slate-600">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* The form card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md sm:p-8">
                <h2 className="mb-1 text-xl font-bold text-slate-900">
                  Send your enquiry
                </h2>
                <p className="mb-6 text-sm text-slate-500">
                  All fields are required.
                </p>
                <LeadForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
