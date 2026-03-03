import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import QuickActions from '../components/QuickActions'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import { campusWalk, foundTeddy, lostSuitcase, illustrationWaiting, computerLab } from '../assets'
import { Inbox, AlertTriangle, ClipboardCheck, ShoppingBag, MessageSquareText } from 'lucide-react'

function formatNumber(n) {
  try {
    return new Intl.NumberFormat().format(n)
  } catch {
    return String(n)
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let ignore = false
    async function run() {
      try {
        const res = await fetch('/api/stats')
        if (!res.ok) throw new Error('bad response')
        const data = await res.json()
        if (!ignore) setStats(data)
      } catch {
        // fallback mock
        if (!ignore)
          setStats({
            foundOpen: 12,
            lostOpen: 9,
            claimsPending: 4,
            marketActive: 18,
            socialToday: 7,
          })
      }
    }
    run()
    return () => {
      ignore = true
    }
  }, [])

  const cards = useMemo(() => {
    return [
      {
        title: 'Teddy Bear',
        place: 'Main Gate / Bus Stand',
        when: 'Today · 2:10 PM',
        image: foundTeddy,
        tag: 'FOUND',
        tagClass: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      {
        title: 'Purple Suitcase',
        place: 'Library',
        when: 'Yesterday · 6:40 PM',
        image: lostSuitcase,
        tag: 'LOST',
        tagClass: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      {
        title: 'Campus Notice',
        place: 'Computer Lab',
        when: 'Today · 9:00 AM',
        image: computerLab,
        tag: 'SOCIAL',
        tagClass: 'bg-pink-50 text-pink-700 border-pink-200',
      },
    ]
  }, [])

  return (
    <div className="grid gap-4">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <img
          src={campusWalk}
          alt="Campus"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/40" />
        <div className="relative p-6 md:p-8">
          <div className="text-xs font-medium tracking-wide text-sky-700">
            LOST &amp; FOUND PLATFORM · A SINGLE WEB APP, MORE SOLUTIONS
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
            Welcome to the Campus Community Hub
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-700">
            Post found items, report lost items, claim safely with proof, buy/sell on the marketplace, and
            stay connected with the social feed — all in one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/found"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Post a Found Item
            </Link>
            <Link
              to="/lost"
              className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500"
            >
              Report a Lost Item
            </Link>
            <Link
              to="/claims"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Claim an Item
            </Link>
          </div>
        </div>
      </section>

      {/* TOP BUTTON BAR */}
      <QuickActions />

      {/* STATS */}
      <section className="grid gap-3 md:grid-cols-5">
        <StatCard
          label="Open Found Posts"
          value={stats ? formatNumber(stats.foundOpen) : '—'}
          hint="Items posted by students"
          Icon={Inbox}
          accent="from-blue-500 to-sky-500"
        />
        <StatCard
          label="Open Lost Reports"
          value={stats ? formatNumber(stats.lostOpen) : '—'}
          hint="Currently searching"
          Icon={AlertTriangle}
          accent="from-amber-500 to-orange-500"
        />
        <StatCard
          label="Pending Claims"
          value={stats ? formatNumber(stats.claimsPending) : '—'}
          hint="Proof review needed"
          Icon={ClipboardCheck}
          accent="from-emerald-500 to-lime-500"
        />
        <StatCard
          label="Marketplace Listings"
          value={stats ? formatNumber(stats.marketActive) : '—'}
          hint="Active student items"
          Icon={ShoppingBag}
          accent="from-violet-500 to-fuchsia-500"
        />
        <StatCard
          label="Social Posts Today"
          value={stats ? formatNumber(stats.socialToday) : '—'}
          hint="Campus engagement"
          Icon={MessageSquareText}
          accent="from-pink-500 to-rose-500"
        />
      </section>

      {/* CONTENT GRID */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card
          title="Recent Highlights"
          subtitle="Latest activity from your campus"
          action={
            <Link
              to="/social"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
            >
              View Feed
            </Link>
          }
        >
          <div className="grid gap-3">
            {cards.map((c) => (
              <div key={c.title} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <img src={c.image} alt={c.title} className="h-14 w-20 rounded-xl object-cover" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-medium text-slate-900">{c.title}</div>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] ${c.tagClass}`}
                    >
                      {c.tag}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-xs text-slate-600">{c.place}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{c.when}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="How a Claim Works" subtitle="Safer return with proof + admin moderation">
          <ol className="grid gap-3 text-sm text-slate-700">
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="font-medium text-slate-900">1) Find the item post</span>
              <div className="mt-1 text-xs text-slate-600">Search by category, location, and date.</div>
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="font-medium text-slate-900">2) Submit proof</span>
              <div className="mt-1 text-xs text-slate-600">
                Add matching details (serial number, unique marks, photos, etc).
              </div>
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="font-medium text-slate-900">3) Verify &amp; return</span>
              <div className="mt-1 text-xs text-slate-600">
                Admin/owner approves and item is marked returned &amp; closed.
              </div>
            </li>
          </ol>
          <div className="mt-4">
            <Link
              to="/claims"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Go to Claims
            </Link>
          </div>
        </Card>

        <Card title="Community Help" subtitle="Keep your campus safe and organized">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <img src={illustrationWaiting} alt="Community" className="h-36 w-full rounded-2xl object-cover" />
            <div className="mt-3 text-sm font-medium text-slate-900">Use clear photos &amp; locations</div>
            <div className="mt-1 text-xs text-slate-600">
              It increases the recovery rate and reduces fake claims.
            </div>
          </div>

          <div className="mt-3 grid gap-2 text-xs text-slate-700">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="font-medium text-slate-900">Tip:</span> Never share personal IDs publicly. Use the
              claim workflow.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="font-medium text-slate-900">Tip:</span> Found a phone? Post it as “Found”, not in
              social feed.
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
