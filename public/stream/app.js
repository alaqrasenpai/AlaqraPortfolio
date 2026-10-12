/**
 * Streamer Spin The Wheel
 * High-performance, lightweight giveaway wheel with real-time Twitch IRC Chat integration
 */

// ==========================================
// 1. Application State
// ==========================================
const state = {
  channel: localStorage.getItem('spin_channel') || '',
  command: localStorage.getItem('spin_command') || '!join',
  isJoinOpen: JSON.parse(localStorage.getItem('spin_is_join_open') ?? 'true'),
  isMuted: JSON.parse(localStorage.getItem('spin_is_muted') ?? 'false'),
  participants: JSON.parse(localStorage.getItem('spin_participants') || '[]'),

  // Wheel Physics & Animation
  isSpinning: false,
  currentAngle: 0,
  targetAngle: 0,
  spinStartTime: 0,
  spinDuration: 0,
  lastTickAngle: 0,
  currentWinner: null,

  // Twitch Connection
  ws: null,
  reconnectInterval: null,
  isConnected: false,
  totalMessagesCount: 0
};

// Alaqra Signature Crimson & Dark Palette (High Contrast)
const SLICE_COLORS = [
  '#FF3B3B', // Alaqra Signature Crimson
  '#22222A', // Sleek Matte Charcoal
  '#DC2626', // Deep Crimson
  '#18181F', // Deep Obsidian
  '#B91C1C', // Dark Ruby
  '#2C2C36', // Carbon Steel
  '#E11D48', // Rose Red
  '#15151B', // Jet Black
  '#F43F5E', // Coral Crimson
  '#363642'  // Dark Zinc
];

// ==========================================
// 2. Synthesized Audio Engine (Web Audio API)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Pointer click sound (mechanical peg click)
  playTick() {
    if (state.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  // Victory fanfare
  playWin() {
    if (state.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + (idx * 0.1);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.22, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.6);
      });
    } catch (e) {}
  }
}

const sounds = new SoundFX();

// ==========================================
// 3. Canvas Confetti Particle System
// ==========================================
class ConfettiEffect {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animating = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  explode() {
    this.resize();
    this.particles = [];
    const count = 150;
    const colors = ['#FFBE0B', '#FE0979', '#00F2FE', '#9146FF', '#00E676', '#FFFFFF'];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() * 200 - 100),
        y: this.canvas.height / 2 + (Math.random() * 100 - 50),
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 1.25) * 22,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.loop();
    }
  }

  loop() {
    if (!this.animating) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let activeCount = 0;
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.55;
      p.vx *= 0.985;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.007;

      if (p.opacity > 0) {
        activeCount++;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3);
        this.ctx.restore();
      }
    }

    if (activeCount > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// ==========================================
// 4. DOM Elements
// ==========================================
const dom = {
  wheelCanvas: document.getElementById('wheelCanvas'),
  confettiCanvas: document.getElementById('confettiCanvas'),
  spinBtn: document.getElementById('spinBtn'),
  centerSpinBtn: document.getElementById('centerSpinBtn'),
  quickTestJoinBtn: document.getElementById('quickTestJoinBtn'),
  wheelWrapper: document.querySelector('.wheel-wrapper'),
  wheelPointer: document.querySelector('.wheel-pointer'),

  channelInput: document.getElementById('channelInput'),
  connectBtn: document.getElementById('connectBtn'),
  commandInput: document.getElementById('commandInput'),
  joinToggleCheckbox: document.getElementById('joinToggleCheckbox'),
  toggleJoinStateBtn: document.getElementById('toggleJoinStateBtn'),
  joinStateIcon: document.getElementById('joinStateIcon'),
  joinStateText: document.getElementById('joinStateText'),
  subToggleStatusDesc: document.getElementById('subToggleStatusDesc'),
  statusDot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),
  soundToggleBtn: document.getElementById('soundToggleBtn'),
  obsModeBtn: document.getElementById('obsModeBtn'),

  manualNameInput: document.getElementById('manualNameInput'),
  manualAddBtn: document.getElementById('manualAddBtn'),
  clearAllBtn: document.getElementById('clearAllBtn'),
  participantsCount: document.getElementById('participantsCount'),
  participantsList: document.getElementById('participantsList'),
  emptyState: document.getElementById('emptyState'),
  searchInput: document.getElementById('searchInput'),
  searchBarWrapper: document.getElementById('searchBarWrapper'),

  chatFeedContainer: document.getElementById('chatFeedContainer'),
  chatFeedPlaceholder: document.getElementById('chatFeedPlaceholder'),
  chatMsgCountBadge: document.getElementById('chatMsgCountBadge'),
  clearChatLogBtn: document.getElementById('clearChatLogBtn'),

  winnerModal: document.getElementById('winnerModal'),
  winnerNameDisplay: document.getElementById('winnerNameDisplay'),
  removeWinnerBtn: document.getElementById('removeWinnerBtn'),
  keepAndRespinBtn: document.getElementById('keepAndRespinBtn'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  toastContainer: document.getElementById('toastContainer')
};

const confetti = new ConfettiEffect(dom.confettiCanvas);
const wheelCtx = dom.wheelCanvas.getContext('2d');

// ==========================================
// 5. Canvas Wheel Rendering & Physics
// ==========================================
function initCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const size = 600;
  dom.wheelCanvas.width = size * dpr;
  dom.wheelCanvas.height = size * dpr;
  wheelCtx.scale(dpr, dpr);
  drawWheel();
}

function drawWheel() {
  const size = 600;
  const center = size / 2;
  const radius = center - 16;
  const list = state.participants;
  const numSlices = list.length;

  wheelCtx.clearRect(0, 0, size, size);

  if (numSlices === 0) {
    // Empty initial state
    wheelCtx.save();
    wheelCtx.beginPath();
    wheelCtx.arc(center, center, radius, 0, 2 * Math.PI);
    wheelCtx.fillStyle = '#0f1220';
    wheelCtx.fill();
    wheelCtx.lineWidth = 4;
    wheelCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    wheelCtx.stroke();

    wheelCtx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    wheelCtx.fillStyle = '#64748b';
    wheelCtx.textAlign = 'center';
    wheelCtx.textBaseline = 'middle';
    wheelCtx.fillText('Add participants or connect chat to start', center, center);
    wheelCtx.restore();
    return;
  }

  const arc = (2 * Math.PI) / numSlices;

  wheelCtx.save();
  wheelCtx.translate(center, center);
  wheelCtx.rotate(state.currentAngle);

  // 1. Draw Slices
  for (let i = 0; i < numSlices; i++) {
    const angle = i * arc;
    const color = SLICE_COLORS[i % SLICE_COLORS.length];

    wheelCtx.beginPath();
    wheelCtx.moveTo(0, 0);
    wheelCtx.arc(0, 0, radius, angle, angle + arc);
    wheelCtx.closePath();

    wheelCtx.fillStyle = color;
    wheelCtx.fill();

    wheelCtx.lineWidth = 1.5;
    wheelCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    wheelCtx.stroke();

    // 2. Draw text label
    wheelCtx.save();
    wheelCtx.rotate(angle + arc / 2);

    wheelCtx.textAlign = 'right';
    wheelCtx.textBaseline = 'middle';
    wheelCtx.fillStyle = '#ffffff';

    let fontSize = 20;
    if (numSlices > 30) fontSize = 12;
    else if (numSlices > 18) fontSize = 14;
    else if (numSlices > 10) fontSize = 16;

    wheelCtx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;
    wheelCtx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    wheelCtx.shadowBlur = 5;

    let name = list[i];
    if (name.length > 15) {
      name = name.substring(0, 13) + '..';
    }

    wheelCtx.fillText(name, radius - 28, 0);
    wheelCtx.restore();
  }

  // 3. Draw Outer Rim & Pegs
  wheelCtx.beginPath();
  wheelCtx.arc(0, 0, radius, 0, 2 * Math.PI);
  wheelCtx.lineWidth = 12;
  wheelCtx.strokeStyle = '#121217';
  wheelCtx.stroke();

  // Subtle crimson accent line on the rim
  wheelCtx.beginPath();
  wheelCtx.arc(0, 0, radius - 6, 0, 2 * Math.PI);
  wheelCtx.lineWidth = 2;
  wheelCtx.strokeStyle = 'rgba(255, 59, 59, 0.45)';
  wheelCtx.stroke();

  const pegCount = Math.max(numSlices, 14);
  const pegArc = (2 * Math.PI) / pegCount;
  for (let i = 0; i < pegCount; i++) {
    const pegAngle = i * pegArc;
    const px = Math.cos(pegAngle) * (radius - 2);
    const py = Math.sin(pegAngle) * (radius - 2);

    wheelCtx.beginPath();
    wheelCtx.arc(px, py, 4, 0, 2 * Math.PI);
    wheelCtx.fillStyle = '#ff3b3b';
    wheelCtx.fill();
    wheelCtx.lineWidth = 1.5;
    wheelCtx.strokeStyle = '#ffffff';
    wheelCtx.stroke();
  }

  wheelCtx.restore();
}

function spinWheel() {
  if (state.isSpinning) return;
  if (state.participants.length === 0) {
    showToast('Add participants before spinning!', 'warn');
    return;
  }

  sounds.init();
  state.isSpinning = true;
  dom.wheelWrapper.classList.add('spinning');
  dom.spinBtn.disabled = true;
  dom.centerSpinBtn.disabled = true;

  const fullRotations = Math.floor(Math.random() * 4) + 6; // 6 to 9 full turns
  const extraAngle = Math.random() * Math.PI * 2;
  const totalRotation = fullRotations * Math.PI * 2 + extraAngle;

  state.spinStartTime = performance.now();
  state.spinDuration = Math.random() * 1500 + 4600; // 4.6 to 6.1s
  const startAngle = state.currentAngle;
  const targetAngle = startAngle + totalRotation;

  state.lastTickAngle = startAngle;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function frame(now) {
    const elapsed = now - state.spinStartTime;
    const progress = Math.min(1, elapsed / state.spinDuration);
    const eased = easeOutCubic(progress);

    state.currentAngle = startAngle + (targetAngle - startAngle) * eased;

    // Detect peg hit on pointer
    const arc = (2 * Math.PI) / state.participants.length;
    if (Math.abs(state.currentAngle - state.lastTickAngle) >= arc) {
      state.lastTickAngle = state.currentAngle;
      sounds.playTick();

      dom.wheelPointer.classList.add('hit');
      setTimeout(() => dom.wheelPointer.classList.remove('hit'), 45);
    }

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      finishSpin();
    }
  }

  requestAnimationFrame(frame);
}

function finishSpin() {
  state.isSpinning = false;
  dom.wheelWrapper.classList.remove('spinning');
  dom.spinBtn.disabled = false;
  dom.centerSpinBtn.disabled = false;

  // Calculate winner under pointer at top (270 degrees)
  const numSlices = state.participants.length;
  const arc = (2 * Math.PI) / numSlices;

  let normalizedAngle = state.currentAngle % (2 * Math.PI);
  if (normalizedAngle < 0) normalizedAngle += (2 * Math.PI);

  const pointerAngle = (3 * Math.PI) / 2;
  let relativeAngle = (pointerAngle - normalizedAngle) % (2 * Math.PI);
  if (relativeAngle < 0) relativeAngle += (2 * Math.PI);

  const winningIndex = Math.floor(relativeAngle / arc) % numSlices;
  const winner = state.participants[winningIndex];
  state.currentWinner = winner;

  sounds.playWin();
  confetti.explode();
  showWinnerModal(winner);
}

function showWinnerModal(winnerName) {
  dom.winnerNameDisplay.textContent = winnerName;
  dom.winnerModal.classList.add('show');
}

function hideWinnerModal() {
  dom.winnerModal.classList.remove('show');
}

// ==========================================
// 6. Participants Management
// ==========================================
function addParticipant(name, source = 'manual') {
  if (!name) return { success: false, reason: 'empty' };
  const cleanName = name.trim();
  if (cleanName.length === 0) return { success: false, reason: 'empty' };

  // Case-insensitive duplicate check
  const exists = state.participants.some(p => p.toLowerCase() === cleanName.toLowerCase());
  if (exists) {
    return { success: false, reason: 'duplicate' };
  }

  state.participants.push(cleanName);
  saveState();
  renderParticipantsList();
  drawWheel();
  showToast(`🎉 Joined: ${cleanName}`, 'success');
  return { success: true };
}

function removeParticipant(name) {
  state.participants = state.participants.filter(p => p !== name);
  saveState();
  renderParticipantsList();
  drawWheel();
  showToast(`🗑️ Removed: ${name}`, 'info');
}

function clearAllParticipants() {
  if (state.participants.length === 0) return;
  if (confirm('Are you sure you want to clear all participants from the wheel?')) {
    state.participants = [];
    saveState();
    renderParticipantsList();
    drawWheel();
    showToast('🧹 Cleared all participants', 'info');
  }
}

function renderParticipantsList(filteredList = null) {
  const listToRender = filteredList || state.participants;
  dom.participantsCount.textContent = state.participants.length;

  if (state.participants.length === 0) {
    dom.emptyState.style.display = 'block';
    dom.searchBarWrapper.style.display = 'none';
    dom.participantsList.innerHTML = '';
    dom.participantsList.appendChild(dom.emptyState);
    return;
  }

  dom.emptyState.style.display = 'none';
  dom.searchBarWrapper.style.display = state.participants.length > 5 ? 'block' : 'none';
  dom.participantsList.innerHTML = '';

  listToRender.forEach((name, idx) => {
    const item = document.createElement('div');
    item.className = 'participant-item';

    const color = SLICE_COLORS[idx % SLICE_COLORS.length];

    item.innerHTML = `
      <div class="participant-info">
        <span class="participant-color-tag" style="background-color: ${color}"></span>
        <span class="participant-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
      </div>
      <button class="remove-participant-btn" title="Remove this name" data-name="${escapeHtml(name)}">✕</button>
    `;

    item.querySelector('.remove-participant-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      removeParticipant(name);
    });

    dom.participantsList.appendChild(item);
  });
}

function filterParticipants(query) {
  if (!query) {
    renderParticipantsList();
    return;
  }
  const q = query.toLowerCase().trim();
  const filtered = state.participants.filter(p => p.toLowerCase().includes(q));
  renderParticipantsList(filtered);
}

// ==========================================
// 7. Twitch IRC WebSocket Connection & Robust Parser
// ==========================================
function connectTwitchChat() {
  const channel = state.channel.trim().toLowerCase().replace(/^#/, '');
  if (!channel) {
    showToast('Please enter your Twitch channel name first', 'warn');
    return;
  }

  if (state.ws) {
    try {
      state.ws.close();
    } catch (e) {}
  }

  updateConnectionStatus('connecting', 'Connecting...');
  const nick = `justinfan${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    state.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

    state.ws.onopen = () => {
      // Request tags, commands, and membership capabilities
      state.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
      state.ws.send(`NICK ${nick}`);
      state.ws.send(`JOIN #${channel}`);
    };

    state.ws.onmessage = (event) => {
      handleIrcMessage(event.data);
    };

    state.ws.onerror = () => {
      updateConnectionStatus('disconnected', 'Connection Error');
    };

    state.ws.onclose = () => {
      state.isConnected = false;
      updateConnectionStatus('disconnected', 'Disconnected');
    };
  } catch (err) {
    updateConnectionStatus('disconnected', 'Connection Failed');
  }
}

function handleIrcMessage(rawMessage) {
  const lines = rawMessage.split('\r\n');

  for (const line of lines) {
    if (!line) continue;

    // Handle Twitch IRC PING/PONG keepalive
    if (line.startsWith('PING')) {
      if (state.ws && state.ws.readyState === WebSocket.OPEN) {
        state.ws.send('PONG :tmi.twitch.tv');
      }
      continue;
    }

    // Channel connection confirmed
    if (line.includes(`JOIN #${state.channel.toLowerCase()}`) || line.includes(` 366 `) || line.includes(` ROOMSTATE `)) {
      if (!state.isConnected) {
        state.isConnected = true;
        updateConnectionStatus('connected', `Connected: #${state.channel}`);
        showToast(`✅ Successfully connected to #${state.channel} chat!`, 'success');
      }
    }

    // Process Chat Messages (PRIVMSG)
    if (line.includes('PRIVMSG')) {
      parsePrivmsg(line);
    }
  }
}

function parsePrivmsg(line) {
  // 1. Extract Username / Display Name
  let username = '';
  const dnMatch = line.match(/display-name=([^; ]+)/);
  if (dnMatch && dnMatch[1].trim()) {
    username = dnMatch[1].trim();
  }

  if (!username) {
    const userPrefixMatch = line.match(/:([a-zA-Z0-9_]+)![a-zA-Z0-9_]+@/);
    if (userPrefixMatch) {
      username = userPrefixMatch[1];
    }
  }

  // 2. Extract Message Text
  const privmsgMatch = line.match(/PRIVMSG\s+#[^\s:]+\s*:(.*)$/);
  if (!username || !privmsgMatch) return;

  const messageText = privmsgMatch[1].trim();

  // Process command match
  const command = state.command.trim().toLowerCase();
  const userText = messageText.toLowerCase();

  let tagType = null;
  let tagLabel = '';

  const isCommand = (userText === command || userText.startsWith(command + ' ') || userText.startsWith(command + '\n'));

  if (isCommand) {
    if (!state.isJoinOpen) {
      tagType = 'paused';
      tagLabel = 'Entries Paused';
    } else {
      const res = addParticipant(username, 'chat');
      if (res.success) {
        tagType = 'added';
        tagLabel = 'Added to Wheel';
      } else if (res.reason === 'duplicate') {
        tagType = 'duplicate';
        tagLabel = 'Already Joined';
      }
    }
  }

  // Log to live chat activity feed
  logChatMessageToFeed(username, messageText, tagType, tagLabel);
}

function logChatMessageToFeed(username, text, tagType, tagLabel) {
  state.totalMessagesCount++;
  dom.chatMsgCountBadge.textContent = `${state.totalMessagesCount} msgs`;

  if (dom.chatFeedPlaceholder) {
    dom.chatFeedPlaceholder.style.display = 'none';
  }

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const row = document.createElement('div');
  row.className = 'chat-msg-row';

  let tagHtml = '';
  if (tagType && tagLabel) {
    tagHtml = `<span class="chat-msg-tag ${tagType}">${escapeHtml(tagLabel)}</span>`;
  }

  row.innerHTML = `
    <span class="chat-msg-time">${time}</span>
    <span class="chat-msg-user">${escapeHtml(username)}:</span>
    <span class="chat-msg-text">${escapeHtml(text)}</span>
    ${tagHtml}
  `;

  dom.chatFeedContainer.appendChild(row);

  // Auto-scroll to latest message
  dom.chatFeedContainer.scrollTop = dom.chatFeedContainer.scrollHeight;

  // Keep feed max 40 rows to stay ultra lightweight
  while (dom.chatFeedContainer.children.length > 40) {
    dom.chatFeedContainer.removeChild(dom.chatFeedContainer.children[0]);
  }
}

function updateConnectionStatus(type, text) {
  dom.statusDot.className = `status-dot ${type}`;
  dom.statusText.textContent = text;
}

// ==========================================
// 8. Join Command Toggle State
// ==========================================
function setJoinState(isOpen) {
  state.isJoinOpen = isOpen;
  dom.joinToggleCheckbox.checked = isOpen;

  if (isOpen) {
    dom.toggleJoinStateBtn.className = 'action-pill-btn active';
    dom.joinStateIcon.textContent = '🟢';
    dom.joinStateText.textContent = 'Entries Open';
    dom.subToggleStatusDesc.textContent = 'Command is currently active and listening for viewers';
    showToast('🟢 Join entries are now OPEN', 'success');
  } else {
    dom.toggleJoinStateBtn.className = 'action-pill-btn inactive';
    dom.joinStateIcon.textContent = '🔴';
    dom.joinStateText.textContent = 'Entries Paused';
    dom.subToggleStatusDesc.textContent = 'Command is PAUSED; new entries will be ignored';
    showToast('🔴 Join entries are now PAUSED', 'warn');
  }

  saveState();
}

// ==========================================
// 9. Notifications & Persistence
// ==========================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  dom.toastContainer.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function saveState() {
  localStorage.setItem('spin_channel', state.channel);
  localStorage.setItem('spin_command', state.command);
  localStorage.setItem('spin_is_join_open', JSON.stringify(state.isJoinOpen));
  localStorage.setItem('spin_is_muted', JSON.stringify(state.isMuted));
  localStorage.setItem('spin_participants', JSON.stringify(state.participants));
}

// ==========================================
// 10. Event Listeners & Hotkeys
// ==========================================
function setupEventListeners() {
  // Spin buttons
  dom.spinBtn.addEventListener('click', spinWheel);
  dom.centerSpinBtn.addEventListener('click', spinWheel);

  // Settings
  dom.channelInput.value = state.channel;
  dom.commandInput.value = state.command;

  dom.connectBtn.addEventListener('click', () => {
    state.channel = dom.channelInput.value.trim();
    saveState();
    connectTwitchChat();
  });

  dom.channelInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      dom.connectBtn.click();
    }
  });

  dom.commandInput.addEventListener('input', (e) => {
    state.command = e.target.value.trim() || '!join';
    saveState();
  });

  // Toggle join states
  dom.joinToggleCheckbox.addEventListener('change', (e) => {
    setJoinState(e.target.checked);
  });

  dom.toggleJoinStateBtn.addEventListener('click', () => {
    setJoinState(!state.isJoinOpen);
  });

  // Sound toggle
  dom.soundToggleBtn.addEventListener('click', () => {
    state.isMuted = !state.isMuted;
    dom.soundToggleBtn.textContent = state.isMuted ? '🔇' : '🔊';
    saveState();
    showToast(state.isMuted ? '🔇 Sound muted' : '🔊 Sound enabled', 'info');
  });

  // Clean OBS Mode Toggle
  dom.obsModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('obs-mode');
    showToast('📺 Toggled OBS Mode (Press O to exit)', 'info');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'o' && e.target.tagName !== 'INPUT') {
      document.body.classList.toggle('obs-mode');
    }
  });

  // Keyboard shortcut: Spacebar to spin
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && !state.isSpinning) {
      e.preventDefault();
      spinWheel();
    }
  });

  // Manual participant add
  const handleManualAdd = () => {
    const raw = dom.manualNameInput.value.trim();
    if (!raw) return;

    const names = raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    let addedCount = 0;
    names.forEach(n => {
      const res = addParticipant(n, 'manual');
      if (res.success) addedCount++;
    });

    if (addedCount > 0) {
      dom.manualNameInput.value = '';
    } else {
      showToast('Name(s) already in wheel!', 'warn');
    }
  };

  dom.manualAddBtn.addEventListener('click', handleManualAdd);
  dom.manualNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleManualAdd();
  });

  // Test Chat Entry Simulator button
  const dummyNames = ['Alex_Gamer', 'ShadowSniper', 'Sarah_Live', 'Fahad_99', 'GhostRider', 'Noor_Stream', 'ProPlayer_X', 'Zein_FPS'];
  dom.quickTestJoinBtn.addEventListener('click', () => {
    const randomUser = dummyNames[Math.floor(Math.random() * dummyNames.length)] + '_' + Math.floor(Math.random() * 89 + 10);
    // Simulate incoming chat message with realistic Twitch tags
    parsePrivmsg(`@display-name=${randomUser} :${randomUser.toLowerCase()}!${randomUser.toLowerCase()}@tmi.twitch.tv PRIVMSG #${state.channel || 'channel'} :${state.command}`);
  });

  // Clear all
  dom.clearAllBtn.addEventListener('click', clearAllParticipants);

  // Search filter
  dom.searchInput.addEventListener('input', (e) => {
    filterParticipants(e.target.value);
  });

  // Clear chat log
  dom.clearChatLogBtn.addEventListener('click', () => {
    dom.chatFeedContainer.innerHTML = '';
    state.totalMessagesCount = 0;
    dom.chatMsgCountBadge.textContent = '0 msgs';
  });

  // Winner modal buttons
  dom.removeWinnerBtn.addEventListener('click', () => {
    if (state.currentWinner) {
      removeParticipant(state.currentWinner);
    }
    hideWinnerModal();
  });

  dom.keepAndRespinBtn.addEventListener('click', () => {
    hideWinnerModal();
    setTimeout(() => {
      spinWheel();
    }, 400);
  });

  dom.closeModalBtn.addEventListener('click', () => {
    hideWinnerModal();
  });

  dom.winnerModal.addEventListener('click', (e) => {
    if (e.target === dom.winnerModal) {
      hideWinnerModal();
    }
  });
}

// ==========================================
// 11. Initialization
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  renderParticipantsList();
  setJoinState(state.isJoinOpen);
  dom.soundToggleBtn.textContent = state.isMuted ? '🔇' : '🔊';
  setupEventListeners();

  // Auto-connect if channel was previously stored
  if (state.channel) {
    connectTwitchChat();
  }
});
