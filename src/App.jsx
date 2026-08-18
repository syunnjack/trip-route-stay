import { useMemo, useState } from 'react'
import './App.css'

const saveKey = 'trip-route-stay.saved'
const postKey = 'trip-route-stay.posts'

// 掲載しているのは表示例。実際の空室や営業状況とは連動していないため、
// 読者が実データと誤解しないよう、画面上でも「表示例」と明示する。
const routes = [
  {
    id: 'nagoya-shizuoka',
    title: '名古屋から静岡へ高速バスで行く（表示例）',
    origin: '名古屋',
    destination: '静岡',
    intent: '着いたらすぐ寝たい',
    price: '2,400円台から',
    arrival: '22:40以降に到着',
    score: 94,
    tags: ['高速バス', '喫煙可ホテル', '深夜チェックイン', '駅近'],
    spots: ['静岡駅前のホテル', '深夜まで開いている飲食店', 'シャワーが使える漫画喫茶'],
    note: '到着が遅いので、深夜でもチェックインできる宿を先に押さえておくと安心です。',
  },
  {
    id: 'tokyo-nagoya-live',
    title: '東京から名古屋へライブ遠征（表示例）',
    origin: '東京',
    destination: '名古屋',
    intent: '終演後に休みたい',
    price: '3,000円台から',
    arrival: 'ライブ終演後',
    score: 91,
    tags: ['ライブ遠征', 'バストイレ付き', '女性向け', '終電後'],
    spots: ['会場から歩けるホテル', '栄の深夜カフェ', '名古屋駅のバス停'],
    note: '終演後は周辺の宿が埋まりやすいので、会場から少し離れた駅も候補に入れておくと選びやすくなります。',
  },
  {
    id: 'osaka-tokyo-morning',
    title: '大阪から東京へ早朝に着く（表示例）',
    origin: '大阪',
    destination: '東京',
    intent: '朝まで時間をつぶしたい',
    price: '3,500円台から',
    arrival: '05:30前後に到着',
    score: 88,
    tags: ['早朝到着', '朝風呂', '荷物預かり', '漫画喫茶'],
    spots: ['朝から入れる風呂', '荷物を預けられる場所', '始発まで休める場所'],
    note: '早朝は店が開いていません。風呂と荷物置き場を決めておくと、始発までの数時間が楽になります。',
  },
  {
    id: 'nagoya-rccourse',
    title: '名古屋から趣味のスポットを回る（表示例）',
    origin: '名古屋',
    destination: '関東',
    intent: '目的の場所を回りたい',
    price: '週末の泊まりがけ向け',
    arrival: '土曜の午前に到着',
    score: 86,
    tags: ['趣味遠征', 'レトロゲーム', 'RCコース', '周辺宿'],
    spots: ['RCサーキット', 'レトロゲームの店', '安く泊まれる宿'],
    note: '目的の場所が郊外にあることが多いので、帰りの移動時間から逆算して宿を選ぶと動きやすくなります。',
  },
]

const guides = [
  ['到着が遅いとき', '深夜チェックインに対応しているか、フロントが何時までかを予約前に確認します。到着が読めないときは、当日キャンセルの条件も見ておきます。'],
  ['始発まで待つとき', '漫画喫茶、サウナ、24時間営業の店が候補になります。荷物が大きい場合は、コインロッカーの空きが朝まで残っているかが分かれ目です。'],
  ['条件で選ぶとき', '喫煙可、バストイレ付き、女性専用フロアなど、譲れない条件から先に絞ると早く決まります。'],
  ['いまの状態', 'このページで表示しているのは例です。実際の空室状況や営業時間は、各予約サイトと店舗の公式情報でご確認ください。'],
]

const faqs = [
  ['どんな人向けですか？', '高速バスや電車での遠征で、着いたあとに泊まる場所や休む場所を探す方に向けています。ライブ、スポーツ観戦、趣味のスポット巡りなど、目的は問いません。'],
  ['深夜に着いても泊まれますか？', '深夜チェックインに対応した宿を選べば泊まれます。対応時間は宿ごとに違うので、予約前の確認をおすすめします。'],
  ['ここに載っている情報は最新ですか？', '表示しているのは例です。料金や到着時間は目安として載せています。予約の前に、各サービスの公式情報をご確認ください。'],
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
          <p className="eyebrow">遠征したあとの、泊まる・休む・食べる</p>
          <h1>遠征ルート宿泊ナビ</h1>
          <p className="lead">高速バスや電車で遠征したとき、到着地から泊まる場所と休む場所を探せます。喫煙可、バストイレ付き、深夜チェックイン、朝風呂、漫画喫茶など、条件から絞り込めます。</p>
        </div>
        <aside className="hero-panel">
          <span>triproutestay.jp</span>
          <strong>着いてから探すと、もう埋まっている。</strong>
          <p>到着時間と目的から、先に押さえておく場所を決められます。いまは表示例を公開している段階です。</p>
        </aside>
      </section>

      <section className="controls" aria-label="検索条件">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="出発地・到着地・条件で探す" />
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          {filters.map((item) => <option key={item}>{item}</option>)}
        </select>
      </section>

      <section className="metrics">
        <article><span>掲載中の例</span><strong>{routes.length}</strong></article>
        <article><span>保存した数</span><strong>{saved.length}</strong></article>
        <article><span>投稿した数</span><strong>{posts.length}</strong></article>
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
            <p className="revenue">{route.note}</p>
            <button type="button" onClick={() => toggleSave(route.id)}>{saved.includes(route.id) ? '保存済み' : 'あとで見るために保存'}</button>
          </article>
        ))}
      </section>

      <section className="split">
        <div className="panel">
          <h2>宿と休憩場所の選び方</h2>
          {guides.map(([label, body]) => <article key={label}><b>{label}</b><p>{body}</p></article>)}
        </div>
        <div className="panel">
          <h2>現地の情報を教えてください</h2>
          <p>到着時間、閉店時間、喫煙の可否、風呂の有無、荷物を預けられる場所など、実際に行って分かったことを教えてください。投稿はこの端末にだけ保存されます。</p>
          <form className="ugc-form" onSubmit={addPost}>
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="場所や店の名前" />
            <input value={form.route} onChange={(event) => setForm({ ...form, route: event.target.value })} placeholder="どのルートの話か" />
            <input value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} placeholder="現地で分かったこと、変わっていたこと" />
            <button>送る</button>
          </form>
          <div className="post-list">
            {posts.length === 0 && <p className="empty">まだ投稿はありません。行ってみて分かったことを教えていただけると、次の人の助けになります。</p>}
            {posts.map((post) => <article key={post.id}><b>{post.title}</b><p>{post.memo}</p><small>{post.route} / {post.date}</small></article>)}
          </div>
        </div>
      </section>

      <section className="seo-section">
        <h2>これから増やしていくもの</h2>
        <div className="seo-grid">
          <article><b>ルートごとのページ</b><p>「名古屋から静岡、夜行バスで着いた日の宿」のように、出発地と到着地の組み合わせでまとめます。</p></article>
          <article><b>条件ごとのページ</b><p>喫煙可、バストイレ付き、深夜チェックイン、朝風呂、荷物預かりなど、条件から探せるようにします。</p></article>
          <article><b>遠征の目的別</b><p>ライブ、スポーツ観戦、ダーツ、レトロゲーム、RCコースなど、目的地に合わせた回り方をまとめます。</p></article>
        </div>
      </section>

      <section className="faq-section">
        <h2>よくある質問</h2>
        <div className="faq-grid">
          {faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}
        </div>
      </section>
    </main>
  )
}

export default App
