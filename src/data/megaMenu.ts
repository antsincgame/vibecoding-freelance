export interface MegaMenuSection {
  title: string;
  items: { label: string; slug: string; isNew?: boolean; isHot?: boolean }[];
}

export interface MegaMenuCategory {
  label: string;
  slug: string;
  sections: MegaMenuSection[];
}

export const megaMenuCategories: MegaMenuCategory[] = [
  {
    label: 'AI и Вайб-кодинг',
    slug: 'ai-vibecoding',
    sections: [
      {
        title: 'Вайб-кодинг',
        items: [
          { label: 'MVP за 3 дня', slug: 'mvp', isHot: true },
          { label: 'Сайты на Cursor/Bolt', slug: 'cursor-bolt', isNew: true },
          { label: 'Доработка AI-кода', slug: 'ai-code-fix', isNew: true },
          { label: 'Деплой и DevOps', slug: 'deployments' },
        ],
      },
      {
        title: 'AI Разработка',
        items: [
          { label: 'AI Чат-боты', slug: 'ai-chatbots', isHot: true },
          { label: 'RAG системы', slug: 'rag-systems', isNew: true },
          { label: 'AI Агенты', slug: 'ai-agents', isNew: true },
          { label: 'Fine-tuning моделей', slug: 'ai-fine-tuning' },
        ],
      },
      {
        title: 'AI Интеграции',
        items: [
          { label: 'OpenAI / Claude API', slug: 'ai-integrations', isHot: true },
          { label: 'AI для бизнеса', slug: 'ai-business' },
          { label: 'Автоматизация с AI', slug: 'ai-automation', isNew: true },
          { label: 'AI Консалтинг', slug: 'ai-consulting' },
        ],
      },
      {
        title: 'AI Контент',
        items: [
          { label: 'AI Генерация изображений', slug: 'ai-images', isNew: true },
          { label: 'AI Видео', slug: 'ai-video', isNew: true },
          { label: 'AI Тексты и копирайтинг', slug: 'ai-copywriting' },
          { label: 'AI Голос и озвучка', slug: 'ai-voice', isNew: true },
        ],
      },
    ],
  },
  {
    label: 'Разработка и IT',
    slug: 'development',
    sections: [
      {
        title: 'Разработка сайтов',
        items: [
          { label: 'Бизнес-сайты', slug: 'business-websites' },
          { label: 'E-Commerce', slug: 'ecommerce' },
          { label: 'Кастомные сайты', slug: 'custom-websites' },
          { label: 'Лендинги', slug: 'landing-pages' },
        ],
      },
      {
        title: 'Платформы',
        items: [
          { label: 'WordPress', slug: 'wordpress' },
          { label: 'Shopify', slug: 'shopify' },
          { label: 'Webflow', slug: 'webflow' },
          { label: 'Bubble', slug: 'bubble' },
        ],
      },
      {
        title: 'Языки и фреймворки',
        items: [
          { label: 'Python', slug: 'python' },
          { label: 'React', slug: 'react' },
          { label: 'Java', slug: 'java' },
          { label: 'React Native', slug: 'react-native' },
          { label: 'Flutter', slug: 'flutter' },
        ],
      },
      {
        title: 'AI Разработка',
        items: [
          { label: 'AI Сайты и софт', slug: 'ai-websites', isNew: true },
          { label: 'AI Мобильные приложения', slug: 'ai-mobile', isNew: true },
          { label: 'AI Интеграции', slug: 'ai-integrations' },
          { label: 'AI Агенты', slug: 'ai-agents' },
          { label: 'AI Fine-Tuning', slug: 'ai-fine-tuning' },
          { label: 'AI Консалтинг', slug: 'ai-consulting', isNew: true },
        ],
      },
      {
        title: 'Вайб-кодинг',
        items: [
          { label: 'Разработка и MVP', slug: 'mvp', isNew: true },
          { label: 'Доработка и улучшения', slug: 'troubleshooting', isNew: true },
          { label: 'Деплой и DevOps', slug: 'deployments', isNew: true },
        ],
      },
      {
        title: 'Мобильные приложения',
        items: [
          { label: 'Кроссплатформенные', slug: 'cross-platform' },
          { label: 'Android', slug: 'android' },
          { label: 'iOS', slug: 'ios' },
        ],
      },
      {
        title: 'Чат-боты',
        items: [
          { label: 'AI Чат-боты', slug: 'ai-chatbots' },
          { label: 'Telegram боты', slug: 'telegram-bots', isHot: true },
          { label: 'Боты по правилам', slug: 'rules-chatbot' },
        ],
      },
      {
        title: 'Разработка игр',
        items: [
          { label: 'Unreal Engine', slug: 'unreal' },
          { label: 'Unity', slug: 'unity' },
          { label: 'Roblox', slug: 'roblox' },
        ],
      },
      {
        title: 'Облако и безопасность',
        items: [
          { label: 'Cloud Computing', slug: 'cloud' },
          { label: 'DevOps Engineering', slug: 'devops' },
          { label: 'Кибербезопасность', slug: 'cybersecurity' },
        ],
      },
      {
        title: 'Разработка ПО',
        items: [
          { label: 'Full Stack приложения', slug: 'fullstack' },
          { label: 'Автоматизация и агенты', slug: 'automations' },
          { label: 'API и интеграции', slug: 'api-integrations' },
          { label: 'Базы данных', slug: 'databases' },
        ],
      },
      {
        title: 'Тестирование',
        items: [
          { label: 'QA и ревью', slug: 'qa-review' },
          { label: 'Пользовательское тестирование', slug: 'user-testing' },
        ],
      },
      {
        title: 'Блокчейн',
        items: [
          { label: 'DApps', slug: 'dapps' },
          { label: 'Криптовалюты и токены', slug: 'crypto-tokens' },
        ],
      },
    ],
  },
  {
    label: 'Дизайн',
    slug: 'design',
    sections: [
      {
        title: 'Веб и моб. дизайн',
        items: [
          { label: 'UI/UX Дизайн', slug: 'ui-ux' },
          { label: 'Дизайн лендингов', slug: 'landing-design' },
          { label: 'Дизайн приложений', slug: 'app-design' },
        ],
      },
      {
        title: 'Графический дизайн',
        items: [
          { label: 'Логотипы', slug: 'logos' },
          { label: 'Фирменный стиль', slug: 'brand-identity' },
          { label: 'Иллюстрации', slug: 'illustrations' },
          { label: 'Баннеры', slug: 'banners' },
        ],
      },
    ],
  },
];

export const topNavCategories = megaMenuCategories.map((c) => ({
  label: c.label,
  slug: c.slug,
}));
