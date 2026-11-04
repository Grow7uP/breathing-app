// 呼吸训练方法库
// 每种方法由若干"相位"组成，相位类型由 key 决定动画方向：
//   inhale    吸气类 → 圆放大
//   sip       补吸     → 圆保持接近最大
//   hold      满肺屏息 → 圆保持最大
//   holdEmpty 空肺屏息 → 圆保持最小
//   exhale    呼气类   → 圆缩小
// 时长单位为"秒"，支持 0.5 步进的小数；实际计时统一换算为毫秒。

const PHASE_STYLE = {
  inhale:    { from: 0.38, to: 1.0 },
  sip:       { from: 1.0,  to: 1.0 },
  hold:      { from: 1.0,  to: 1.0 },
  holdEmpty: { from: 0.38, to: 0.38 },
  exhale:    { from: 1.0,  to: 0.38 }
};

const METHODS = [
  {
    id: '478',
    name: '4-7-8 呼吸法',
    en: 'Relaxing Breath',
    tag: '助眠 · 放松',
    tagline: '吸4-屏7-呼8，哈佛 Weil 博士经典放松呼吸',
    cycles: 4,
    evidence: '循证 · 机制',
    desc: '由哈佛大学医学博士 Andrew Weil 提出，吸气4秒、屏息7秒、呼气8秒，常用于缓解焦虑、平复情绪、辅助入睡。',
    phases: [
      { key: 'inhale', text: '吸气', tip: '用鼻子缓缓吸气',     dur: 4 },
      { key: 'hold',   text: '屏息', tip: '轻轻屏住，不必勉强',  dur: 7 },
      { key: 'exhale', text: '呼气', tip: '用嘴缓缓呼出，更长',  dur: 8 }
    ]
  },
  {
    id: 'box',
    name: '盒式呼吸',
    en: 'Box Breathing',
    tag: '减压 · 专注',
    tagline: '吸4-屏4-呼4-空肺屏4，特种部队同款，稳住心率与情绪',
    cycles: 4,
    evidence: '循证 · 机构背书',
    desc: '四等分的方形呼吸，节奏规整、极易跟随，被美国海军特种部队用于高压场景下的冷静专注。一次循环 16 秒。',
    phases: [
      { key: 'inhale',   text: '吸气',     tip: '用鼻子缓缓吸气',     dur: 4 },
      { key: 'hold',     text: '屏息',     tip: '轻轻屏住，保持饱满',   dur: 4 },
      { key: 'exhale',   text: '呼气',     tip: '用嘴缓缓呼出',         dur: 4 },
      { key: 'holdEmpty', text: '空肺屏息', tip: '呼尽后自然停顿',       dur: 4 }
    ]
  },
  {
    id: 'sigh',
    name: '生理性叹息',
    en: 'Physiological Sigh',
    tag: '快速减压 · 助眠',
    tagline: '深吸-补吸-长呼，两口气最快降焦虑（斯坦福研究）',
    cycles: 4,
    evidence: '循证 · 最强',
    desc: '源自斯坦福大学研究（2023 RCT），连续两次吸气后一次长呼气，可快速降低压力与焦虑，尤其适合临睡前或情绪波动时。',
    phases: [
      { key: 'inhale', text: '深吸', tip: '用鼻子深深吸气',       dur: 2.5 },
      { key: 'sip',    text: '补吸', tip: '再补吸一小口',         dur: 0.5 },
      { key: 'exhale', text: '长呼', tip: '用嘴缓缓呼尽，更长',   dur: 6 }
    ]
  }
];

// 存储 key
function storageKey(id) {
  return 'breath_custom_' + id;
}

// 读取某方法的自定义配置（未自定义则返回 null）
function getCustom(id) {
  try {
    return wx.getStorageSync(storageKey(id)) || null;
  } catch (e) {
    return null;
  }
}

// 组装某方法当前生效的相位（合并默认 + 自定义）
function buildPhases(method) {
  const custom = getCustom(method.id);
  return method.phases.map((p, i) => {
    const dur = custom && custom.durations && custom.durations[i] != null
      ? custom.durations[i]
      : p.dur;
    const style = PHASE_STYLE[p.key] || { from: 0.6, to: 0.6 };
    return {
      key: p.key,
      text: p.text,
      tip: p.tip,
      dur: dur,
      from: style.from,
      to: style.to
    };
  });
}

// 组装某方法当前生效的循环数
function buildCycles(method) {
  const custom = getCustom(method.id);
  return custom && custom.cycles ? custom.cycles : method.cycles;
}

// 保存某方法自定义配置
function saveCustom(id, durations, cycles) {
  wx.setStorageSync(storageKey(id), { durations: durations, cycles: cycles });
}

// 清除某方法自定义配置
function clearCustom(id) {
  try {
    wx.removeStorageSync(storageKey(id));
  } catch (e) {}
}

module.exports = {
  METHODS: METHODS,
  PHASE_STYLE: PHASE_STYLE,
  getCustom: getCustom,
  buildPhases: buildPhases,
  buildCycles: buildCycles,
  saveCustom: saveCustom,
  clearCustom: clearCustom
};
