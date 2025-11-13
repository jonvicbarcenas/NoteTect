import React, { useState } from 'react';

function Dashboard(): JSX.Element {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const onGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Generate clicked');
  };

  return (
    <div className="dashboard-page">
      <style>{`
        .dashboard-page { font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji; color: #000; }
        .nav { position: sticky; top: 0; z-index: 10; background: #e6e6e6; border-bottom: 1px solid #d1d1d1; }
        .nav-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 16px; }
        .brand { font-weight: 700; font-size: 22px; letter-spacing: -0.02em; }
        .nav-actions { display: flex; gap: 12px; }
        .btn { appearance: none; border: 0; background: #bdbdbd; padding: 10px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: filter .15s ease, transform .02s ease; }
        .btn:active { transform: translateY(1px); }
        .btn.dark { background: #9f9f9f; color: #000; }
        .main { max-width: 900px; margin: 64px auto; padding: 0 16px; }
        .hero { text-align: center; margin-bottom: 32px; }
        .title { font-size: 44px; line-height: 1.05; font-weight: 800; letter-spacing: -0.03em; }
        .cta { margin-top: 20px; display: flex; gap: 16px; justify-content: center; }
        .card { margin: 36px auto 0; max-width: 720px; border: 1px solid #6b6b6b; border-radius: 10px; padding: 24px; }
        .card h3 { margin: 0 0 12px 0; font-size: 14px; }
        .input { width: 100%; background: #dedede; border: 0; border-radius: 6px; height: 36px; padding: 8px 12px; outline: none; }
        .textarea { width: 100%; background: #dedede; border: 0; border-radius: 6px; padding: 12px; height: 140px; resize: vertical; outline: none; }
        .gen-btn { width: 100%; background: #000; color: #fff; border: 0; border-radius: 6px; height: 34px; font-weight: 600; cursor: pointer; margin-top: 14px; }
        @media (max-width: 480px) { .title { font-size: 32px; } .nav-inner { padding: 12px 16px; } }
      `}</style>

      <header className="nav">
        <div className="nav-inner">
          <div className="brand">NoteTect</div>
          <div className="nav-actions">
            <button className="btn">Log In</button>
            <button className="btn dark">Sign Up</button>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <h1 className="title">Generate Perfect
            <br />Notes Instantly
          </h1>
          <div className="cta">
            <button className="btn" aria-label="Get Started">Get Started</button>
            <button className="btn dark" aria-label="Learn More">Learn More</button>
          </div>
        </section>

        <section className="card" aria-labelledby="try-generator-title">
          <h3 id="try-generator-title">Try Notes Generator</h3>
          <form onSubmit={onGenerate}>
            <input
              className="input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div style={{ height: 12 }} />
            <textarea
              className="textarea"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit" className="gen-btn">Generate</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

