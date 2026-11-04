const breath = require('../../utils/breath.js');

// 秒数显示：整数不带小数点，小数保留 1 位
function fmt(sec) {
  return sec % 1 === 0 ? String(sec) : sec.toFixed(1);
}

Page({
  data: {
    methods: breath.METHODS,
    methodIndex: 0,
    method: {},
    phases: [],
    totalCycles: 4,
    status: 'ready',          // ready | running | paused | done
    phase: 0,
    phaseText: '准备',
    tip: '选择方法，点击开始',
    remaining: 0,
    scale: 0.38,
    cycle: 0,
    cycleArray: [],
    vibrate: true,
    showInfo: false,
    showCustom: false,
    customPhases: [],
    customCycles: 4
  },

  _timer: null,
  _phaseStart: 0,
  _elapsedPaused: 0,
  _targetScale: null,

  onLoad(options) {
    // 开启右上角胶囊菜单：转发给好友 + 分享到朋友圈
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    });
    // 支持从分享卡片进入时直达对应呼吸法
    let idx = 0;
    if (options && options.method) {
      const found = breath.METHODS.findIndex(m => m.id === options.method);
      if (found >= 0) idx = found;
    }
    this._loadMethod(idx);
  },

  onUnload() {
    this._clearTimer();
  },

  // —— 分享：转发给好友 ——
  onShareAppMessage() {
    const m = this.data.method;
    return {
      title: m.name + '：' + m.tagline,
      path: '/pages/index/index?method=' + m.id
    };
  },

  // —— 分享：朋友圈 ——
  onShareTimeline() {
    const m = this.data.method;
    return {
      title: m.name + '｜跟着呼吸，放松身心',
      query: 'method=' + m.id
    };
  },

  // —— 方法装载 ——
  _loadMethod(idx) {
    const method = breath.METHODS[idx];
    const phases = breath.buildPhases(method).map(p => Object.assign({}, p, { durText: fmt(p.dur) }));
    const cycles = breath.buildCycles(method);
    this._clearTimer();
    this._targetScale = null;
    this.setData({
      methodIndex: idx,
      method: method,
      phases: phases,
      totalCycles: cycles,
      status: 'ready',
      phase: 0,
      phaseText: '准备',
      tip: '点击开始，跟随呼吸节奏',
      remaining: 0,
      scale: 0.38,
      cycle: 0,
      cycleArray: Array.from({ length: cycles }, () => 0)
    });
  },

  onMethodTap(e) {
    const idx = Number(e.currentTarget.dataset.index);
    if (idx === this.data.methodIndex) return;
    this._loadMethod(idx);
  },

  toggleInfo() {
    this.setData({ showInfo: !this.data.showInfo });
  },

  onVibrateChange(e) {
    this.setData({ vibrate: e.detail.value });
  },

  // —— 自定义面板 ——
  openCustom() {
    const method = this.data.method;
    const phases = breath.buildPhases(method);
    const customPhases = phases.map((p, i) => ({
      index: i,
      text: p.text,
      dur: p.dur,
      durText: fmt(p.dur)
    }));
    this.setData({
      showCustom: true,
      customPhases: customPhases,
      customCycles: this.data.totalCycles
    });
  },

  closeCustom() {
    this.setData({ showCustom: false });
  },

  adjustPhase(e) {
    const i = Number(e.currentTarget.dataset.index);
    const delta = Number(e.currentTarget.dataset.delta);
    const list = this.data.customPhases.slice();
    const next = Math.round((list[i].dur + delta) * 2) / 2;
    list[i].dur = Math.min(30, Math.max(0.5, next));
    list[i].durText = fmt(list[i].dur);
    this.setData({ customPhases: list });
  },

  adjustCycles(e) {
    const delta = Number(e.currentTarget.dataset.delta);
    const next = this.data.customCycles + delta;
    this.setData({ customCycles: Math.min(20, Math.max(1, next)) });
  },

  resetCustom() {
    const method = this.data.method;
    const defaultPhases = method.phases.map((p, i) => ({
      index: i,
      text: p.text,
      dur: p.dur,
      durText: fmt(p.dur)
    }));
    this.setData({ customPhases: defaultPhases, customCycles: method.cycles });
  },

  saveCustom() {
    const durations = this.data.customPhases.map(p => p.dur);
    breath.saveCustom(this.data.method.id, durations, this.data.customCycles);
    this._loadMethod(this.data.methodIndex);
    this.setData({ showCustom: false });
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  // —— 练习状态机 ——
  start() {
    // 暂停后继续
    if (this.data.status === 'paused') {
      this.setData({ status: 'running' });
      this._phaseStart = Date.now() - this._elapsedPaused;
      this._tick();
      this._timer = setInterval(() => this._tick(), 100);
      return;
    }
    // 全新开始
    const cycles = this.data.totalCycles;
    this.setData({
      status: 'running',
      cycle: 0,
      cycleArray: Array.from({ length: cycles }, () => 0)
    });
    this._enterPhase(0, true);
    this._timer = setInterval(() => this._tick(), 100);
  },

  pause() {
    if (this.data.status !== 'running') return;
    this._elapsedPaused = Date.now() - this._phaseStart;
    this._clearTimer();
    this.setData({ status: 'paused' });
  },

  reset() {
    this._clearTimer();
    this._targetScale = null;
    this.setData({
      status: 'ready',
      phase: 0,
      phaseText: '准备',
      tip: '点击开始，跟随呼吸节奏',
      remaining: 0,
      scale: 0.38,
      cycle: 0,
      cycleArray: Array.from({ length: this.data.totalCycles }, () => 0)
    });
  },

  _clearTimer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  _vibrate(type) {
    if (!this.data.vibrate) return;
    try {
      wx.vibrateShort({ type: type || 'light' });
    } catch (e) {
      wx.vibrateShort();
    }
  },

  _enterPhase(idx, isFirst) {
    const p = this.data.phases[idx];
    this._phaseStart = Date.now();
    this._elapsedPaused = 0;
    this._targetScale = p.to;
    this.setData({
      phase: idx,
      phaseText: p.text,
      tip: p.tip,
      remaining: fmt(Math.ceil(p.dur)),
      scale: p.from
    });
    if (!isFirst) this._vibrate('light');
  },

  _tick() {
    if (this.data.status !== 'running') return;

    const now = Date.now();
    const elapsed = now - this._phaseStart;
    const p = this.data.phases[this.data.phase];
    const durMs = p.dur * 1000;

    // 剩余秒数
    const rem = Math.ceil((durMs - elapsed) / 1000);
    if (rem !== this.data.remaining) this.setData({ remaining: fmt(rem) });

    // 平滑动画
    if (this._targetScale != null) {
      const cur = this.data.scale;
      const next = cur + (this._targetScale - cur) * 0.18;
      if (Math.abs(this._targetScale - next) < 0.004) {
        this.setData({ scale: this._targetScale });
        this._targetScale = null;
      } else {
        this.setData({ scale: next });
      }
    }

    // 阶段切换
    if (elapsed >= durMs) {
      const next = this.data.phase + 1;
      if (next < this.data.phases.length) {
        this._enterPhase(next, false);
      } else {
        // 完成一组
        const cycle = this.data.cycle + 1;
        const cycleArray = this.data.cycleArray.slice();
        cycleArray[cycle - 1] = 1;
        if (cycle >= this.data.totalCycles) {
          this._clearTimer();
          this._targetScale = null;
          this._vibrate('medium');
          this.setData({
            status: 'done',
            cycle: cycle,
            cycleArray: cycleArray,
            phaseText: '完成',
            tip: '已全部完成，放松身心',
            remaining: 0,
            scale: 0.38
          });
        } else {
          this.setData({ cycle: cycle, cycleArray: cycleArray });
          this._enterPhase(0, false);
        }
      }
    }
  }
});
