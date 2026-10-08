// ============================================================
// PTIC – askExpert.js
// Q&A community — question list, detail, ask form
// ============================================================

const AskExpert = {
  state: { tab: 'all', searchQuery: '' },

  render() {
    Router.showPage('page-ask-expert');
    this.state = { tab: 'all', searchQuery: '' };

    document.getElementById('page-ask-expert').innerHTML = `
      <div class="ask-header-bar">
        <div class="page-header" style="margin-bottom:0;">
          <div class="page-title">Ask Expert</div>
          <div class="page-subtitle">Ask questions and learn from the community.</div>
        </div>
        <button class="btn btn-green" onclick="AskExpert.renderAskForm()">
          ${Icons.plus(16)} Ask a Question
        </button>
      </div>

      <div class="search-bar">
        <div class="search-bar-icon">${Icons.search(18)}</div>
        <input id="qa-search" type="text" placeholder="Search questions..." />
      </div>

      <div class="tabs" id="qa-tabs">
        <div class="tab-item active" data-tab="all">All</div>
        <div class="tab-item" data-tab="latest">Latest</div>
        <div class="tab-item" data-tab="popular">Popular</div>
        <div class="tab-item" data-tab="unanswered">Unanswered</div>
      </div>

      <div id="qa-list" class="question-list"></div>`;

    document.getElementById('qa-search').addEventListener('input', (e) => {
      this.state.searchQuery = e.target.value.toLowerCase();
      this.renderList();
    });
    document.querySelectorAll('#qa-tabs .tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#qa-tabs .tab-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.state.tab = tab.dataset.tab;
        this.renderList();
      });
    });

    this.renderList();
  },

  filterQuestions() {
    const { tab, searchQuery } = this.state;
    let qs = [...PTIC_DATA.questions];
    if (searchQuery) {
      qs = qs.filter(q =>
        q.title.toLowerCase().includes(searchQuery) ||
        q.body.toLowerCase().includes(searchQuery) ||
        q.topic.toLowerCase().includes(searchQuery)
      );
    }
    if (tab === 'latest')    qs.sort((a,b) => new Date(b.date) - new Date(a.date));
    if (tab === 'popular')   qs.sort((a,b) => b.likes - a.likes);
    if (tab === 'unanswered') qs = qs.filter(q => q.answers.length === 0);
    return qs;
  },

  renderList() {
    const container = document.getElementById('qa-list');
    const questions = this.filterQuestions();

    if (questions.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.messageCircle(28)}</div>
          <div class="empty-state-title">No questions found</div>
          <div class="empty-state-desc">Be the first to ask a question.</div>
          <button class="btn btn-green" onclick="AskExpert.renderAskForm()">${Icons.plus(14)} Ask a Question</button>
        </div>`;
      return;
    }

    container.innerHTML = questions.map(q => {
      const author = DataUtils.getPerson(q.author) || PTIC_DATA.currentUser;
      const authorName = author === PTIC_DATA.currentUser ? PTIC_DATA.currentUser.name : author.name;
      const authorType = author === PTIC_DATA.currentUser ? PTIC_DATA.currentUser.type : author.type;
      return `
        <div class="question-card" onclick="AskExpert.renderQuestionDetail('${q.id}')">
          <div class="question-title">${q.title}</div>
          <div class="question-meta">
            <div style="display:flex;align-items:center;gap:var(--space-2);">
              ${DataUtils.avatarHTML({name: authorName}, 'xs')}
              <span>${authorName}</span>
              <span class="pill pill-gray">${authorType}</span>
            </div>
            <span>${DataUtils.formatDate(q.date)}</span>
          </div>
          <div class="person-tags" style="margin-top:var(--space-2);">
            ${(q.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
          <div class="question-stats">
            <div class="q-stat">${Icons.messageCircle(13)} <span>${q.answers.length} answer${q.answers.length !== 1 ? 's' : ''}</span></div>
            <div class="q-stat">${Icons.thumbsUp(13)} <span>${q.likes}</span></div>
            <span class="pill pill-blue" style="margin-left:auto;">${q.topic}</span>
          </div>
        </div>`;
    }).join('');
  },

  renderQuestionDetail(questionId) {
    Router.showPage('page-question-detail');
    const q = DataUtils.getQuestion(questionId);
    if (!q) { AskExpert.render(); return; }
    const author = DataUtils.getPerson(q.author) || PTIC_DATA.currentUser;
    const authorName = author === PTIC_DATA.currentUser ? PTIC_DATA.currentUser.name : author.name;
    const authorType = author === PTIC_DATA.currentUser ? PTIC_DATA.currentUser.type : author.type;
    const answers = q.answers.map(aid => DataUtils.getAnswer(aid)).filter(Boolean);

    document.getElementById('page-question-detail').innerHTML = `
      <button class="btn btn-ghost" onclick="Router.navigate('ask-expert')" style="margin-bottom:var(--space-4);">
        ${Icons.arrowLeft(16)} Back to Questions
      </button>

      <div class="question-detail-card">
        <div class="question-detail-title">${q.title}</div>
        <div class="question-detail-body">${q.body}</div>
        <div class="person-tags" style="margin-bottom:var(--space-4);">
          ${(q.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
          <span class="pill pill-blue">${q.topic}</span>
        </div>
        <div class="question-detail-meta">
          ${DataUtils.avatarHTML({name: authorName}, 'sm')}
          <div>
            <div style="font-size:var(--text-sm); font-weight:600; color:var(--text);">${authorName}</div>
            <div style="font-size:var(--text-xs); color:var(--text-secondary);">${authorType} · ${DataUtils.formatDate(q.date)}</div>
          </div>
          <div style="margin-left:auto; display:flex; align-items:center; gap:var(--space-3);">
            <button class="answer-action-btn" id="q-like-btn">
              ${Icons.thumbsUp(14)} <span id="q-like-count">${q.likes}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="section-header">
        <div class="section-title">${answers.length} Answer${answers.length !== 1 ? 's' : ''}</div>
      </div>

      <div id="answer-list">
        ${answers.length === 0 ? `
          <div class="empty-state" style="padding:var(--space-8);">
            <div class="empty-state-icon">${Icons.messageCircle(24)}</div>
            <div class="empty-state-title">No answers yet</div>
            <div class="empty-state-desc">Be the first to answer this question!</div>
          </div>` :
          answers.map(a => this.answerCard(a)).join('')}
      </div>

      <div class="card" style="margin-top:var(--space-6);">
        <div class="section-title" style="margin-bottom:var(--space-4);">Write an Answer</div>
        <div class="form-group">
          <textarea id="answer-text" class="form-textarea" placeholder="Share your knowledge and experience to help others..." style="min-height:120px;"></textarea>
        </div>
        <button class="btn btn-green" onclick="AskExpert.postAnswer('${q.id}')">
          ${Icons.send(15)} Post Answer
        </button>
      </div>`;

    // Like button
    let liked = false;
    document.getElementById('q-like-btn').addEventListener('click', () => {
      liked = !liked;
      const btn = document.getElementById('q-like-btn');
      const cnt = document.getElementById('q-like-count');
      btn.classList.toggle('liked', liked);
      cnt.textContent = parseInt(cnt.textContent) + (liked ? 1 : -1);
    });
  },

  answerCard(answer) {
    const author = DataUtils.getPerson(answer.author) || PTIC_DATA.currentUser;
    const authorName = author === PTIC_DATA.currentUser ? PTIC_DATA.currentUser.name : author.name;
    const authorType = author === PTIC_DATA.currentUser ? PTIC_DATA.currentUser.type : author.type;

    return `
      <div class="answer-card">
        <div class="answer-header">
          ${DataUtils.avatarHTML({name: authorName}, 'sm')}
          <div>
            <div class="answer-author-name">${authorName}</div>
            <div class="answer-author-type">${authorType} · ${DataUtils.formatDate(answer.date)}</div>
          </div>
        </div>
        <div class="answer-text">${answer.text}</div>
        <div class="answer-actions">
          <button class="answer-action-btn" onclick="this.classList.toggle('liked'); this.querySelector('span').textContent = parseInt(this.querySelector('span').textContent) + (this.classList.contains('liked') ? 1 : -1);">
            ${Icons.thumbsUp(13)} <span>${answer.likes}</span> Helpful
          </button>
        </div>
      </div>`;
  },

  postAnswer(questionId) {
    const text = document.getElementById('answer-text').value.trim();
    if (!text) { Toast.error('Please write your answer before posting.'); return; }
    // Add to data
    const q = DataUtils.getQuestion(questionId);
    const newId = 'a_' + Date.now();
    PTIC_DATA.answers[newId] = {
      id: newId, questionId, author: 'u0', text, date: new Date().toISOString().split('T')[0], likes: 0, dislikes: 0,
    };
    q.answers.push(newId);
    Toast.success('✓ Answer posted successfully!');
    AskExpert.renderQuestionDetail(questionId);
  },

  renderAskForm() {
    Router.showPage('page-ask-form');
    document.getElementById('page-ask-form').innerHTML = `
      <button class="btn btn-ghost" onclick="Router.navigate('ask-expert')" style="margin-bottom:var(--space-4);">
        ${Icons.arrowLeft(16)} Back
      </button>
      <div class="page-header">
        <div class="page-title">Ask a Question</div>
        <div class="page-subtitle">Describe your problem and get answers from the community.</div>
      </div>
      <div class="card" style="max-width:640px;">
        <div class="form-group">
          <label class="form-label">Question <span class="required">*</span></label>
          <input id="ask-title" class="form-input" type="text" placeholder="What would you like to ask?" />
          <div class="form-hint">Be specific and clear. A good question gets better answers.</div>
        </div>
        <div class="form-group">
          <label class="form-label">Describe your problem</label>
          <textarea id="ask-body" class="form-textarea" style="min-height:140px;" placeholder="Explain your requirement, situation or problem in more detail..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Topic <span class="required">*</span></label>
          <select id="ask-topic" class="form-select">
            <option value="">Select a topic...</option>
            ${PTIC_DATA.topics.map(t => `<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Add Image <span style="font-weight:400; color:var(--text-secondary);">(optional)</span></label>
          <div style="border:1.5px dashed var(--border); border-radius:var(--radius-md); padding:var(--space-6); text-align:center; cursor:pointer; color:var(--text-secondary);">
            ${Icons.image(22)} <div style="margin-top:var(--space-2); font-size:var(--text-sm);">Click to add an image</div>
          </div>
        </div>
        <div style="display:flex; gap:var(--space-3);">
          <button class="btn btn-outline-gray" onclick="Router.navigate('ask-expert')">Cancel</button>
          <button class="btn btn-green" onclick="AskExpert.submitQuestion()">
            ${Icons.send(15)} Post Question
          </button>
        </div>
      </div>`;
  },

  submitQuestion() {
    const title = document.getElementById('ask-title').value.trim();
    const body  = document.getElementById('ask-body').value.trim();
    const topic = document.getElementById('ask-topic').value;
    if (!title || !topic) { Toast.error('Please fill in your question and select a topic.'); return; }
    const newQ = {
      id: 'q_' + Date.now(),
      title, body, author: 'u0', topic,
      date: new Date().toISOString().split('T')[0],
      answers: [], likes: 0, tags: [],
    };
    PTIC_DATA.questions.unshift(newQ);
    Toast.success('✓ Question posted successfully!');
    Router.navigate('ask-expert');
  },
};
