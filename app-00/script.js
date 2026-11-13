"use strict";

const HISTORY_KEY = "coffee_concierge_history";
const HISTORY_LIMIT = 8;

const moods = {
  relax: { label: "リラックス", icon: "🌿" },
  sweet: { label: "甘いもの", icon: "🍰" },
  focus: { label: "集中", icon: "💡" }
};

// ここに各気分のおすすめを追加すると、診断のバリエーションが増やせます。
const recommendations = {
  relax: [
    { coffee: "はちみつカフェオレ（ミルクたっぷり）", snack: "ひとくちサイズの生チョコ", cat: "茶トラのちゃい", catEmoji: "🐈", message: "今日はゆっくりで大丈夫。深呼吸するにゃ〜", advice: "お気に入りのマグカップを両手で包んでみて。" },
    { coffee: "やさしい中煎りのドリップコーヒー", snack: "バター香るフィナンシェ", cat: "白猫のしろみ", catEmoji: "🐱", message: "いい香りをひとつ吸い込んで、肩の力をぬくにゃ。", advice: "窓の外を眺めながら、ひと口ずつ味わうと吉。" },
    { coffee: "ふんわり泡のカフェラテ", snack: "塩バタークッキー", cat: "三毛猫のみつ", catEmoji: "😺", message: "休むのも大切なおしごと。えらいえらいにゃ！", advice: "好きな音楽を一曲だけ流してみて。" },
    { coffee: "シナモンをひとふりしたカフェオレ", snack: "小さなミルクまんじゅう", cat: "キジトラのこむぎ", catEmoji: "🐈‍⬛", message: "あったかいものを飲んで、心までぽかぽかにゃ。", advice: "飲みものが冷める前に、スマホを少しおやすみ。" }
  ],
  sweet: [
    { coffee: "すっきり浅煎りのブラックコーヒー", snack: "ごほうびチョコレートケーキ", cat: "白黒猫のごま", catEmoji: "🐼", message: "甘いものは心の栄養。今日は楽しんでいいにゃ！", advice: "コーヒーをひと口飲んでからおやつを味わうと、幸せ倍増。" },
    { coffee: "まろやかなキャラメルラテ", snack: "いちごジャムのスコーン", cat: "茶トラのぽてと", catEmoji: "🐱", message: "がんばった自分に、ちゃんとご褒美あげるにゃ。", advice: "おやつをお皿にのせて、カフェ気分を楽しもう。" },
    { coffee: "ミルクに合う深煎りコーヒー", snack: "ふわふわのミニどら焼き", cat: "三毛猫のあんず", catEmoji: "😸", message: "甘いひと口で、気分もふわっと上向きにゃ。", advice: "ひと口目はゆっくり。香りと食感を見つけてみて。" },
    { coffee: "ほんのり甘いメープルカフェラテ", snack: "こんがり焼いたバナナブレッド", cat: "はちわれのまめ", catEmoji: "🐈", message: "おいしいって思える時間、たいせつにするにゃ〜。", advice: "あたためたおやつに、少しだけバターを添えると吉。" }
  ],
  focus: [
    { coffee: "キレのある深煎りドリップコーヒー", snack: "カカオ多めのチョコをひとかけ", cat: "黒猫のくろすけ", catEmoji: "🐈‍⬛", message: "まずはひとつずつ。ぼくが見守ってるにゃ。", advice: "飲み終わったら、次の25分でやることをひとつ決めよう。" },
    { coffee: "香りすっきりアイスアメリカーノ", snack: "香ばしい素焼きアーモンド", cat: "キジトラのすず", catEmoji: "🐈", message: "背すじをすっと伸ばして、いいスタートにゃ！", advice: "机の上をひと区画だけ片づけると集中力アップ。" },
    { coffee: "集中したい時のシンプルなブラック", snack: "ドライフルーツを少しだけ", cat: "白猫のゆきち", catEmoji: "😼", message: "完璧じゃなくていいにゃ。まず一歩、いってみよう。", advice: "作業前に水をひと口。小さく始めるのがラッキー。" },
    { coffee: "すっきり飲める水出しコーヒー", snack: "全粒粉クラッカーとひとくちチーズ", cat: "茶白猫のだいず", catEmoji: "🐱", message: "集中タイムのあとには、ぼくと休憩するにゃ。", advice: "通知を少しだけおやすみにして、ひとつ片づけよう。" }
  ]
};

const moodButtons = Array.from(document.querySelectorAll("[data-mood]"));
const placeholder = document.getElementById("result-placeholder");
const resultCard = document.getElementById("result-card");
const statusMessage = document.getElementById("storage-status");
const historyList = document.getElementById("history-list");
const emptyHistory = document.getElementById("history-empty");

let selectedMood = null;
let lastRecommendationIndex = {};
let history = loadHistory();

function isHistoryEntry(entry) {
  return entry && typeof entry === "object" &&
    typeof entry.date === "string" &&
    typeof entry.mood === "string" &&
    typeof entry.coffee === "string" &&
    typeof entry.snack === "string" &&
    typeof entry.cat === "string";
}

function loadHistory() {
  try {
    const saved = window.localStorage.getItem(HISTORY_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      statusMessage.textContent = "保存されている履歴を読み取れませんでした。新しい診断から記録できます。";
      return [];
    }
    return parsed.filter(isHistoryEntry).slice(0, HISTORY_LIMIT);
  } catch (error) {
    statusMessage.textContent = "履歴を読み込めませんでした。このブラウザーでの保存設定をご確認ください。";
    return [];
  }
}

function saveHistory() {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    statusMessage.textContent = "";
    return true;
  } catch (error) {
    statusMessage.textContent = "診断結果は表示しましたが、履歴を保存できませんでした。ブラウザーの保存設定をご確認ください。";
    return false;
  }
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function chooseRecommendation(mood) {
  const options = recommendations[mood];
  let index = Math.floor(Math.random() * options.length);
  if (options.length > 1 && index === lastRecommendationIndex[mood]) {
    index = (index + 1 + Math.floor(Math.random() * (options.length - 1))) % options.length;
  }
  lastRecommendationIndex[mood] = index;
  return options[index];
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function showResult(mood) {
  const recommendation = chooseRecommendation(mood);
  const moodInfo = moods[mood];

  placeholder.classList.add("hidden");
  resultCard.classList.remove("hidden");
  resultCard.classList.remove("is-entering");
  void resultCard.offsetWidth;
  resultCard.classList.add("is-entering");

  setText("result-mood", `${moodInfo.icon} ${moodInfo.label}`);
  setText("result-coffee", recommendation.coffee);
  setText("result-snack", recommendation.snack);
  setText("result-cat-emoji", recommendation.catEmoji);
  setText("result-cat-name", recommendation.cat);
  setText("result-cat-message", `「${recommendation.message}」`);
  setText("result-advice", recommendation.advice);

  history.unshift({
    date: formatDate(new Date()),
    mood: moodInfo.label,
    coffee: recommendation.coffee,
    snack: recommendation.snack,
    cat: `${recommendation.catEmoji} ${recommendation.cat}`
  });
  history = history.slice(0, HISTORY_LIMIT);
  saveHistory();
  renderHistory();
}

function renderHistory() {
  historyList.replaceChildren();
  emptyHistory.classList.toggle("hidden", history.length > 0);

  history.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "history-item";

    const mood = document.createElement("span");
    mood.className = "history-mood";
    mood.textContent = entry.mood;

    const details = document.createElement("p");
    details.className = "history-details";
    details.textContent = `${entry.coffee} ＋ ${entry.snack} ／ ${entry.cat}`;

    const date = document.createElement("time");
    date.className = "history-time";
    date.textContent = entry.date;

    item.append(mood, details, date);
    historyList.append(item);
  });
}

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedMood = button.dataset.mood;
    moodButtons.forEach((moodButton) => {
      moodButton.setAttribute("aria-pressed", String(moodButton === button));
    });
    showResult(selectedMood);
  });
});

document.getElementById("reroll-button").addEventListener("click", () => {
  if (selectedMood) showResult(selectedMood);
});

document.getElementById("clear-history").addEventListener("click", () => {
  history = [];
  renderHistory();
  try {
    window.localStorage.removeItem(HISTORY_KEY);
    statusMessage.textContent = "履歴をクリアしました。";
  } catch (error) {
    statusMessage.textContent = "このブラウザーでは履歴を削除できませんでした。";
  }
});

renderHistory();
