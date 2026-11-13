const menuItems = [
  {
    name: '黒さつま鶏もも',
    price: '¥680',
    description: '炭火で丁寧に焼き上げた、皮は香ばしく中はジューシーな定番の一串です。',
    tag: '人気'
  },
  {
    name: '奄美黒糖焼酎',
    price: '¥780',
    description: '黒糖の甘みと香りがほどよく残る、夜に合う一杯。しっかりとした余韻で締まります。',
    tag: '酒の肴'
  },
  {
    name: '奄美の卵料理',
    price: '¥560',
    description: '季節の野菜と合わせたやさしい味わいで、炭火の香りとよく馴染みます。',
    tag: 'おすすめ'
  }
];

const faqItems = [
  {
    question: '営業時間はいつですか？',
    answer: '毎日18:00〜24:00で営業しております。季節や混雑状況により、営業時間が前後する場合がございます。'
  },
  {
    question: '予約はできますか？',
    answer: 'はい。ご予約は電話または店頭で承っております。特に週末は混み合うため、事前のご予約をおすすめしています。'
  },
  {
    question: '予算はどのくらいですか？',
    answer: '1〜2人で5000〜8000円程度を目安にお楽しみいただけます。串物や酒の組み合わせで、ゆったりとした時間をお過ごしください。'
  }
];

const menuGrid = document.getElementById('menu-grid');
const faqList = document.getElementById('faq-list');

menuItems.forEach((item) => {
  const card = document.createElement('article');
  card.className = 'menu-card';

  card.innerHTML = `
    <div class="dish-top">
      <h3>${item.name}</h3>
      <span class="price">${item.price}</span>
    </div>
    <p class="dish-copy">${item.description}</p>
    <span class="tag">${item.tag}</span>
  `;

  menuGrid.appendChild(card);
});

faqItems.forEach((item, index) => {
  const faqItem = document.createElement('div');
  faqItem.className = `faq-item ${index === 0 ? 'open' : ''}`;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'faq-question';
  button.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
  button.innerHTML = `<span>${item.question}</span><span class="icon">＋</span>`;

  const answer = document.createElement('div');
  answer.className = 'faq-answer';
  answer.innerHTML = `<p>${item.answer}</p>`;

  if (index === 0) {
    answer.style.maxHeight = `${answer.scrollHeight}px`;
  }

  button.addEventListener('click', () => {
    const isOpen = faqItem.classList.contains('open');
    faqItem.classList.toggle('open', !isOpen);
    button.setAttribute('aria-expanded', String(!isOpen));

    if (!isOpen) {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    } else {
      answer.style.maxHeight = '0px';
    }
  });

  faqItem.appendChild(button);
  faqItem.appendChild(answer);
  faqList.appendChild(faqItem);
});
