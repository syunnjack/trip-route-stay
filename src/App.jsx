import { useMemo, useState } from 'react'
import './App.css'

const saveKey = 'trip-route-stay.saved'
const postKey = 'trip-route-stay.posts'

const routes = [
  {
    id: 'nagoya-shizuoka',
    title: '名古屋から静岡へ行く高速バス遠征',
    origin: '名古屋',
    destination: '静岡',
    intent: '到着後すぐ泊まる',
    price: '2,400円台から',
    arrival: '22:40以降',
    score: 94,
    tags: ['高速バス', '喫煙可ホテル', '深夜チェックイン', '駅近'],
    spots: ['静岡駅前ホテル', '深夜営業の飲食店', 'シャワー付き漫画喫茶'],
    revenue: 'ホテル予約アフィリエイト + 深夜飲食店送客',
  },
  {
    id: 'tokyo-nagoya-live',
    title: '東京から名古屋ライブ遠征',
    origin: '東京',
    destination: '名古屋',
    intent: '終演後に休む',
    price: '3,000円台から',
    arrival: 'ライブ終演後',
    score: 91,
    tags: ['ライブ遠征', 'バストイレ付き', '女性向け', '終電後'],
    spots: ['会場周辺ホテル', '栄の深夜カフェ', '名駅バス停'],
    revenue: '宿泊予約 + 周辺スポット掲載課金',
  },
  {
    id: 'osaka-tokyo-morning',
    title: '大阪から東京へ早朝到着',
    origin: '大阪',
    destination: '東京',
    intent: '朝まで時間をつぶす',
    price: '3,500円台から',
    arrival: '05:30前後',
    score: 88,
    tags: ['早朝到着', '朝風呂', '荷物預かり', '漫画喫茶'],
    spots: ['朝風呂施設', '荷物預かりロッカー', '始発までの休憩所'],
    revenue: '休憩施設送客 + コインロッカー広告',
  },
  {
    id: 'nagoya-rccourse',
    title: '名古屋発ラジコン・レトロスポット遠征',
    origin: '名古屋',
    destination: '関東',
    intent: '趣味スポットを回る',
    price: '週末パック向け',
    arrival: '土曜午前',
    score: 86,
    tags: ['趣味遠征', 'レトロゲーム', 'RCコース', '周辺宿'],
    spots: ['RCサーキット', 'レトロゲーム店', '安い宿'],
    revenue: '趣味施設送客 + 物販/宿泊アフィリエイト',
  },
]

const techStack = [
  ['Frontend', 'Vite + React 19. Static first, fast build, easy GitHub Pages deployment.'],
  ['Data', 'Phase 1 uses local JSON seed data and localStorage UGC. Phase 2 can move to Supabase or Cloudflare D1.'],
  ['SEO/AIO/LLMO', 'Route pages, FAQ blocks, structured data, llms.txt, sitemap, and answer-first copy.'],
  ['Revenue', 'Hotel affiliate, bus affiliate, local listing ads, coupon leads, sponsored route pages, LINE alerts.'],
  ['Growth', 'UGC reports, destination pages, route pages, event pages, X share cards, LINE reminder flows.'],
]

const faqs = [
  ['どんな人向けですか？', '高速バス、ライブ、スポーツ、ゲーム、ダーツ、レトロスポットなどの遠征で、到着後の宿や休憩場所を探す人向けです。'],
  ['収益化の中心は何ですか？', '宿泊予約、バス予約、漫画喫茶や飲食店への送客、掲載課金、LINE通知の有料化です。'],
  ['なぜSEOに強いですか？', '出発地、到着地、到着時間、目的、条件を組み合わせたロングテール検索ページを量産できるからです。'],
]

function readArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? []
  } catch {
    return []
  }
}

function App() {
  const [query, setQuery] = useState('名古屋')
  const [filter, setFilter] = useState('すべて')
  const [saved, setSaved] = useState(() => readArray(saveKey))
  const [posts, setPosts] = useState(() => readArray(postKey))
  const [form, setForm] = useState({ title: '', route: '名古屋から静岡', memo: '' })
  const filters = ['すべて', '高速バス', 'ライブ遠征', '早朝到着', '趣味遠征']

  const filteredRoutes = useMemo(() => routes.filter((route) => {
    const haystack = [route.title, route.origin, route.destination, route.intent, route.tags.join(' '), route.spots.join(' ')].join(' ')
    return haystack.includes(query) && (filter === 'すべて' || route.tags.includes(filter))
  }), [query, filter])

  function toggleSave(id) {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem(saveKey, JSON.stringify(next))
  }

  function addPost(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.memo.trim()) return
    const next = [{ ...form, id: crypto.randomUUID(), date: new Date().toLocaleDateString('ja-JP') }, ...posts]
    setPosts(next)
    localStorage.setItem(postKey, JSON.stringify(next))
    setForm({ title: '', route: '名古屋から静岡', memo: '' })
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Priority 1 / travel x stay x local spots</p>
          <h1>Trip Route Stay</h1>
          <p className="lead">高速バス・電車・遠征ルートの到着地から、宿泊、喫煙可、バストイレ付き、深夜営業、漫画喫茶、周辺スポットへつなぐ収益導線型ナビです。</p>
        </div>
        <aside className="hero-panel">
          <span>AI answer block</span>
          <strong>到着地検索の直後に、泊まる・休む・食べるを提示する。</strong>
          <p>予約アフィリエイトと地域店舗の掲載課金を同時に狙えるため、PDF内アイデアの中でも最優先で深掘りします。</p>
        </aside>
      </section>

      <section className="controls" aria-label="検索条件">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="出発地・到着地・条件で検索" />
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          {filters.map((item) => <option key={item}>{item}</option>)}
        </select>
      </section>

      <section className="metrics">
        <article><span>Route seeds</span><strong>{routes.length}</strong></article>
        <article><span>Saved leads</span><strong>{saved.length}</strong></article>
        <article><span>UGC reports</span><strong>{posts.length}</strong></article>
      </section>

      <section className="route-grid">
        {filteredRoutes.map((route) => (
          <article className="route-card" key={route.id}>
            <div className="card-top">
              <span>{route.origin} / {route.destination}</span>
              <b>{route.score}</b>
            </div>
            <h2>{route.title}</h2>
            <p>{route.intent} / {route.arrival} / {route.price}</p>
            <div className="tag-row">{route.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="spot-list">
              {route.spots.map((spot) => <span key={spot}>{spot}</span>)}
            </div>
            <p className="revenue">収益導線: {route.revenue}</p>
            <button type="button" onClick={() => toggleSave(route.id)}>{saved.includes(route.id) ? '保存済み' : '送客候補に保存'}</button>
          </article>
        ))}
      </section>

      <section className="split">
        <div className="panel">
          <h2>技術選定</h2>
          {techStack.map(([label, body]) => <article key={label}><b>{label}</b><p>{body}</p></article>)}
        </div>
        <div className="panel">
          <h2>UGC投稿</h2>
          <p>到着時間、閉店、喫煙可、風呂、荷物預かり、女性向け安心情報などをユーザー投稿で更新します。</p>
          <form className="ugc-form" onSubmit={addPost}>
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="投稿タイトル" />
            <input value={form.route} onChange={(event) => setForm({ ...form, route: event.target.value })} placeholder="対象ルート" />
            <input value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} placeholder="現地メモ・口コミ・訂正情報" />
            <button>投稿</button>
          </form>
          <div className="post-list">
            {posts.length === 0 && <p className="empty">初期状態です。公開後は現地レポートを集めて鮮度を作ります。</p>}
            {posts.map((post) => <article key={post.id}><b>{post.title}</b><p>{post.memo}</p><small>{post.route} / {post.date}</small></article>)}
          </div>
        </div>
      </section>

      <section className="seo-section">
        <h2>SEO / AIO / LLMOで狙うページ群</h2>
        <div className="seo-grid">
          <article><b>路線ページ</b><p>名古屋から静岡 高速バス 宿、東京 早朝到着 休憩など。</p></article>
          <article><b>条件ページ</b><p>喫煙可、バストイレ付き、深夜チェックイン、朝風呂、荷物預かり。</p></article>
          <article><b>イベント遠征</b><p>ライブ、スポーツ、ダーツ、レトロゲーム、RCコース遠征。</p></article>
        </div>
      </section>

      <section className="faq-section">
        <h2>FAQ</h2>
        <div className="faq-grid">
          {faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}
        </div>
      </section>
    </main>
  )
}

export default App
