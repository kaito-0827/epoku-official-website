/**
 * epoku Official Website - Dynamic Interactive Engine
 * Core logic including: Interactive Neural Canvas, AI Chatbot Simulator, microCMS News, Scroll Reveals
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. PROJECT INITIALIZATION & MOBILE MENU
  initMobileMenu();
  initHeaderScroll();
  
  // 2. NEURAL NETWORK CANVAS BACKGROUND
  initNeuralCanvas();
  
  // 3. AI CHATBOT PLAYGROUND SIMULATOR
  initAIChatbot();
  
  // 4. microCMS LIVE NEWS FETCHING & MODAL
  initLiveNews();
  
  // 5. SCROLL ENTRY REVEALS FALLBACK
  initScrollReveals();
});

/* ==========================================================================
   1. Header & Navigation Logic
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuBtn || !mobileMenu) return;

  const menuIcon = menuBtn.querySelector('i');
  const menuLinks = document.querySelectorAll('.menu-link');

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    if (mobileMenu.classList.contains('hidden')) {
      menuIcon.className = 'fa-solid fa-bars text-xl';
    } else {
      menuIcon.className = 'fa-solid fa-xmark text-xl';
    }
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuIcon.className = 'fa-solid fa-bars text-xl';
    });
  });
}

function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('bg-slate-950/80', 'shadow-lg', 'border-b', 'border-white/5');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('bg-slate-950/80', 'shadow-lg', 'border-b', 'border-white/5');
      header.classList.add('bg-transparent');
    }
  });
}

/* ==========================================================================
   2. Interactive Neural Canvas Background
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  const container = document.getElementById('hero-section');
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Handles high-DPI retina displays
  let dpr = window.devicePixelRatio || 1;
  let width = container.offsetWidth;
  let height = container.offsetHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  let particles = [];
  const maxParticles = Math.min(100, Math.floor((width * height) / 9000)); // Responsive count
  const maxDistance = 110;
  
  // Mouse state
  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  container.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 161, 233, 0.4)' : 'rgba(124, 58, 237, 0.4)';
    }

    update() {
      // Bounce boundaries
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interactive displacement (gently push away)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }

      this.x += this.vx;
      this.y += this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Populate particles
  function setup() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          // Gradient between particles
          const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
          grad.addColorStop(0, particles[i].color.replace('0.4', opacity.toString()));
          grad.addColorStop(1, particles[j].color.replace('0.4', opacity.toString()));
          
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animationFrameId = requestAnimationFrame(animate);
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationFrameId);
    width = container.offsetWidth;
    height = container.offsetHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    setup();
    animate();
  });

  setup();
  animate();
}

/* ==========================================================================
   3. AI Chatbot Sandbox Simulator
   ========================================================================== */
function initAIChatbot() {
  const terminalBody = document.getElementById('chat-body');
  const promptButtons = document.querySelectorAll('.chat-prompt-btn');
  const typingIndicator = document.getElementById('chat-typing-indicator');
  
  if (!terminalBody || !promptButtons) return;

  const BOT_RESPONSES = {
    about: `🤖 **epoku（エポック）について**\n\n「epoku（エポック）」は、神奈川大学公認予定の学生AIサークルです！\n機械学習の学習の節目を表す**「1エポック（Epoch）」**と、サークルを機に神大にイノベーションを起こす**「Epoch-making（新時代を開く）」**という二つの意味を込めて名付けられました。\n生成AIの活用法、画像認識技術、機械学習、データ分析、さらにWebやアプリケーションの開発など、先端技術を幅広く楽しく探求しています。`,
    beginners: `🤖 **初心者へのサポートについて**\n\n**「プログラミングもAIも完全に初めて！」という方、大歓迎です！**\n実は、サークルの初期メンバーも多くは未経験から学習をスタートしました。\n毎週の勉強会ではツールの使い方から丁寧にレクチャーします。開発プロジェクトも先輩や経験豊富なメンバーがチーム開発でフォローしますので、安心してAIの楽しさに触れていただけます！`,
    activities: `🤖 **具体的な活動内容**\n\n私たちは主に以下の4本の柱を中心に活動しています：\n\n1. 💻 **週例勉強会**: 最新AIツールの共有やPython、Web開発のセッション\n2. 🏆 **ハッカソン**: メンバーでチームを組み、短期間でWebアプリやAIプロダクトを創出\n3. 🎪 **学園祭展示**: 来場者が直感的に楽しめる「体験型AIプロダクト」の開発と出展\n4. 🌐 **学外連携**: 他大学のAI団体との意見交換会や協同イベントの企画`,
    join: `🤖 **参加方法・手続き**\n\n参加ステップはとってもシンプルです！\n\n1. 🚀 サイト最下部にある**「Discordに参加する」**ボタンをクリック！\n2. 💬 オンラインコミュニティ「Discord」の「#自己紹介」チャンネルで挨拶をしましょう！\n3. 📅 毎週の定例ミーティングや勉強会に参加し、気になる分野から学習をスタートしましょう。\n\n学部・学科・学年を問わずいつでも歓迎しています！疑問点があればDiscord内で気軽に聞いてくださいね。`
  };

  let isTyping = false;

  // Scroll to bottom of chat
  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Typewriter response effect
  async function streamMessage(markdownText) {
    // Show typing indicator
    typingIndicator.classList.remove('hidden');
    scrollToBottom();
    
    // Simulate thinking delay
    await new Promise(res => setTimeout(res, 800));
    
    // Hide typing indicator
    typingIndicator.classList.add('hidden');

    // Create Message element
    const messageContainer = document.createElement('div');
    messageContainer.className = 'flex items-start gap-3 mb-4';
    
    const avatar = document.createElement('div');
    avatar.className = 'w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md text-sm';
    avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';
    
    const bubble = document.createElement('div');
    bubble.className = 'flex-1 bg-slate-900/90 border border-white/5 rounded-xl px-4 py-3 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap';
    
    messageContainer.appendChild(avatar);
    messageContainer.appendChild(bubble);
    
    // Add inside chat before the typing indicator
    terminalBody.insertBefore(messageContainer, typingIndicator);
    scrollToBottom();

    // Stream text typing effect
    const speed = 20; // Type speed in ms
    let index = 0;
    
    return new Promise((resolve) => {
      function type() {
        if (index < markdownText.length) {
          // Quick conversion for markdown symbols for visual aesthetics
          let segment = markdownText.substring(0, index + 1);
          segment = segment
            .replace(/\*\*(.*?)\*\*/g, '<b class="text-cyan-400 font-bold">$1</b>')
            .replace(/## (.*?)\n/g, '<h4 class="text-white font-bold text-base mt-2">$1</h4>')
            .replace(/🤖 (.*?)\n/g, '<span class="text-white font-black">$1</span>\n');
            
          bubble.innerHTML = segment + '<span class="typewriter-cursor"></span>';
          index++;
          scrollToBottom();
          setTimeout(type, speed);
        } else {
          // Remove cursor
          const cursor = bubble.querySelector('.typewriter-cursor');
          if (cursor) cursor.remove();
          resolve();
        }
      }
      type();
    });
  }

  // Handle user button clicks
  promptButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      if (isTyping) return;
      isTyping = true;

      // Disable all buttons during streaming
      promptButtons.forEach(b => b.setAttribute('disabled', 'true'));

      const typeKey = btn.dataset.prompt;
      const userText = btn.textContent.trim();

      // Render User Message
      const userMsgContainer = document.createElement('div');
      userMsgContainer.className = 'flex items-start gap-3 justify-end mb-4';
      
      const userBubble = document.createElement('div');
      userBubble.className = 'bg-cyan-500 text-slate-950 font-medium rounded-xl px-4 py-3 text-sm max-w-[80%] shadow-md';
      userBubble.textContent = userText;
      
      userMsgContainer.appendChild(userBubble);
      terminalBody.insertBefore(userMsgContainer, typingIndicator);
      scrollToBottom();

      // Trigger bot streaming response
      await streamMessage(BOT_RESPONSES[typeKey] || 'お答えが見つかりませんでした。');

      isTyping = false;
      promptButtons.forEach(b => b.removeAttribute('disabled'));
    });
  });
}

/* ==========================================================================
   4. microCMS News Live Fetching & Dialog Modal
   ========================================================================== */
const MICROCMS_CONFIG = {
  serviceId: 'zoy5xt93i2',
  apiKey: 'cTaYLQFR1eUGHYYiCwyvwQWErDaaYeLuIKGU',
  endpoint: 'ai_news'
};

let fetchedNewsData = [];

// High-fidelity fallback news data
const FALLBACK_NEWS = [
  {
    id: '1',
    publishedAt: '2026-05-20T10:00:00Z',
    title: '【新メンバー募集】2026年度の体験会＆第1回勉強会の日程決定！',
    categories: ['お知らせ'],
    content: `<h2>新入生の皆さん、こんにちは！AIサークル epoku です！</h2>
              <p>2026年度第1期となる体験説明会およびハンズオン勉強会の日程が確定いたしました。AIや技術コミュニティに興味がある方はぜひ気軽に参加してください。</p>
              <h3>開催日程・詳細</h3>
              <ul>
                <li><strong>第1回説明会：</strong> 6月2日（火） 18:15〜19:30 (みなとみらいキャンパス 3Fカフェスペース)</li>
                <li><strong>第2回説明会＆体験会：</strong> 6月5日（金） 18:15〜20:00 (オンラインDiscord & MMキャンパスハイブリッド)</li>
              </ul>
              <p>当日は、最新の生成AIツール（ChatGPT、Gemini、Claudeなど）を使った簡単な画像生成や対話の実験ミニワークショップを行います。PCをお持ちの方はぜひご持参ください！学部・学年は一切不問です。</p>`
  },
  {
    id: '2',
    publishedAt: '2026-04-18T15:30:00Z',
    title: '春季AI製品開発ハッカソンで「学食混雑リアルタイム予測システム」を発表、優秀賞を受賞しました！',
    categories: ['活動報告'],
    content: `<h2>学内ハッカソンにて最優秀技術賞を獲得！</h2>
              <p>先日行われた2026年春季学内ハッカソンにおいて、当サークルの混雑緩和研究プロジェクトチームが開発した<strong>「学食カメラ混雑可視化AI」</strong>が優秀賞に選ばれました！</p>
              <h3>技術スタックと構成</h3>
              <p>エッジカメラとYOLOv8（画像物体検出）モデルを活用し、食堂入り口付近の人数カウントを数秒間隔でリアルタイム処理。ReactのWeb画面で学食全体の「混雑度グラフ」を直感的に表示するシステムを2日間で実装しました。</p>
              <blockquote>
                「実用性と開発スピードの両立が素晴らしく、今すぐにでも大学の公式システムに実装してほしいクオリティである」と高い評価をいただきました！
              </blockquote>`
  },
  {
    id: '3',
    publishedAt: '2026-03-10T09:00:00Z',
    title: 'サークル公式サイトのフルリニューアルと「epoku AIチャットモック」の公開について',
    categories: ['お知らせ'],
    content: `<h2>公式サイトが「epoku」ブランドとして大幅リニューアル！</h2>
              <p>サークルの活動をよりダイナミックに伝え、AIの面白さに直接触れていただくため、公式ホームペーシを新ブランド名「epoku」として完全リニューアルいたしました。</p>
              <h3>今回のアップデート内容</h3>
              <ul>
                <li><strong>インタラクティブ背景：</strong> 機械学習の学習工程である「エポック」をモチーフとしたニューラルネットワーク・キャンバスの実装。</li>
                <li><strong>AIチャット Sandbox：</strong> ページ上でサークルについてのよくある疑問にストリーミング形式で自動回答する体験型ウィジェット。</li>
                <li><strong>ネイティブダイアログ：</strong> ニュース記事の表示に最先端のHTML5 <code>&lt;dialog&gt;</code> 要素を採用し、読みやすさとアクセシビリティを劇的に向上。</li>
              </ul>`
  }
];

async function initLiveNews() {
  const newsContainer = document.getElementById('news-list');
  if (!newsContainer) return;

  // Show loading spinner
  newsContainer.innerHTML = `
    <div class="flex justify-center items-center h-40">
      <i class="fa-solid fa-circle-notch fa-spin text-4xl text-cyan-400"></i>
    </div>
  `;

  try {
    const url = `https://${MICROCMS_CONFIG.serviceId}.microcms.io/api/v1/${MICROCMS_CONFIG.endpoint}`;
    const response = await fetch(url, {
      headers: {
        'X-MICROCMS-API-KEY': MICROCMS_CONFIG.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`microCMS HTTP status: ${response.status}`);
    }

    const data = await response.json();
    fetchedNewsData = data.contents;
    
    // If empty response, fallback
    if (!fetchedNewsData || fetchedNewsData.length === 0) {
      fetchedNewsData = FALLBACK_NEWS;
    }
  } catch (error) {
    console.warn('microCMS fetch failed, rendering tech fallback: ', error);
    fetchedNewsData = FALLBACK_NEWS;
  }

  renderNews(fetchedNewsData, newsContainer);
}

function renderNews(articles, container) {
  container.innerHTML = '';

  articles.forEach((article, index) => {
    // Format publish date
    const rawDate = article.publishedAt || article.createdAt;
    const date = new Date(rawDate).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.');

    // Parse category supporting array categories or string fallback
    let categoryName = 'お知らせ';
    if (article.categories && article.categories.length > 0) {
      categoryName = article.categories[0];
    } else if (article.category) {
      categoryName = typeof article.category === 'string' ? article.category : (article.category.name || 'お知らせ');
    }

    // Assign categories tags colors
    let tagColors = 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
    let cardBorder = 'hover:border-cyan-500/30';
    
    if (categoryName.includes('活動報告') || categoryName.includes('イベント')) {
      tagColors = 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      cardBorder = 'hover:border-purple-500/30';
    }

    const itemHTML = `
      <div onclick="openNewsModal(${index})" class="glowing-card cursor-pointer flex flex-col md:flex-row items-start md:items-center gap-4 p-6 rounded-2xl transition duration-300 ${cardBorder}">
        <span class="text-sm font-bold text-slate-400 font-mono w-28 shrink-0">${date}</span>
        <div class="flex-1 flex items-center gap-3 flex-wrap">
          <span class="text-xs font-bold px-2.5 py-1 rounded-full ${tagColors}">${categoryName}</span>
          <h3 class="text-base font-bold text-slate-200 group-hover:text-cyan-400 transition">${article.title}</h3>
        </div>
        <i class="fa-solid fa-chevron-right text-slate-600 self-end md:self-auto ml-auto text-sm transition transform group-hover:translate-x-1"></i>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', itemHTML);
  });
}

// Modal handling via HTML5 <dialog>
const modalEl = document.getElementById('news-dialog');

window.openNewsModal = function(index) {
  const article = fetchedNewsData[index];
  if (!article || !modalEl) return;

  const rawDate = article.publishedAt || article.createdAt;
  const date = new Date(rawDate).toLocaleDateString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).replace(/\//g, '.');

  let categoryName = 'お知らせ';
  if (article.categories && article.categories.length > 0) {
    categoryName = article.categories[0];
  } else if (article.category) {
    categoryName = typeof article.category === 'string' ? article.category : (article.category.name || 'お知らせ');
  }

  // Populate HTML elements
  document.getElementById('modal-dialog-title').innerText = article.title;
  document.getElementById('modal-dialog-date').innerText = date;
  
  const catBadge = document.getElementById('modal-dialog-category');
  catBadge.innerText = categoryName;

  if (categoryName.includes('活動報告') || categoryName.includes('イベント')) {
    catBadge.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20';
  } else {
    catBadge.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
  }

  // Insert Rich Text Content
  const bodyEl = document.getElementById('modal-dialog-content');
  if (article.content) {
    bodyEl.innerHTML = article.content;
  } else if (article.url) {
    bodyEl.innerHTML = `<p>詳細は以下のURLをご確認ください。</p><p><a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.url}</a></p>`;
  } else {
    bodyEl.innerHTML = '<p>詳細情報はありません。</p>';
  }

  // Open native modal dialog
  modalEl.showModal();
  document.body.style.overflow = 'hidden'; // Stop background scrolling
};

window.closeNewsModal = function() {
  if (!modalEl) return;
  modalEl.close();
  document.body.style.overflow = 'auto'; // Enable scrolling
};

// Light dismiss: Close modal on backdrop click
if (modalEl) {
  modalEl.addEventListener('click', (e) => {
    const dialogRect = modalEl.getBoundingClientRect();
    const isInDialog = (
      e.clientX >= dialogRect.left &&
      e.clientX <= dialogRect.right &&
      e.clientY >= dialogRect.top &&
      e.clientY <= dialogRect.bottom
    );
    if (!isInDialog) {
      closeNewsModal();
    }
  });
}

/* ==========================================================================
   5. Progressive Enhancement Scroll Reveal Fallback
   ========================================================================== */
function initScrollReveals() {
  const supportsScrollTimeline = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  
  if (!supportsScrollTimeline) {
    const elementsToReveal = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-reveal-active');
        } else {
          entry.target.classList.remove('scroll-reveal-active');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully entering viewport
    });

    elementsToReveal.forEach(el => {
      el.classList.add('scroll-reveal-fallback');
      observer.observe(el);
    });
  }
}
