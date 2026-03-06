#!/usr/bin/env node
/**
 * Seed Appwrite with VibeCoder Freelance data
 * Run AFTER setup-collections.js
 * Usage: node scripts/seed-data.js
 */
const sdk = require('node-appwrite');

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://appwrite.vibecoding.by/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '69ab4e9d00342b2b9f9f';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_ac07ab782ca017c0c46c029aa448ff921576b4b5decf8fd166ebdbb1c111351c635a03055648c2b69c234ec4e778f7ebff9d2495b1d230e2fb4c1b5e16b515669efef6b820b1382b746cacf6e2984a7650095d22e6fa3b3730b5153257650b0cd5ed192466b7ec79686e4ed0cac9ebff1136ff038c9db9489d32f7a3136182ed';
const DB_ID = 'freelance';

const client = new sdk.Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new sdk.Databases(client);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ============================================
// Seed Data
// ============================================

const categories = [
  { slug: 'web-development', name: 'Разработка сайтов', icon: 'Globe', gig_count: 156, description: 'Лендинги, корпоративные сайты, интернет-магазины', sort_order: 1 },
  { slug: 'mobile-apps', name: 'Мобильные приложения', icon: 'Smartphone', gig_count: 89, description: 'iOS, Android, кроссплатформенные приложения', sort_order: 2 },
  { slug: 'bots-automation', name: 'Боты и автоматизация', icon: 'Bot', gig_count: 124, description: 'Telegram, Discord боты, автоматизация процессов', sort_order: 3 },
  { slug: 'ai-integrations', name: 'AI Интеграции', icon: 'Brain', gig_count: 67, description: 'ChatGPT, RAG-системы, AI-ассистенты', sort_order: 4 },
  { slug: 'frontend', name: 'Frontend', icon: 'Layout', gig_count: 203, description: 'React, Vue, Angular, вёрстка, UI/UX', sort_order: 5 },
  { slug: 'backend', name: 'Backend', icon: 'Server', gig_count: 145, description: 'API, микросервисы, серверная логика', sort_order: 6 },
  { slug: 'databases', name: 'Базы данных', icon: 'Database', gig_count: 78, description: 'PostgreSQL, MongoDB, Redis, оптимизация', sort_order: 7 },
  { slug: 'mvp', name: 'Вайб-кодинг MVP', icon: 'Rocket', gig_count: 45, description: 'Быстрый запуск продукта от идеи до прототипа', sort_order: 8 },
];

const profiles = [
  { id: 'fl_user_1', user_id: 'fl_user_1', username: 'alexdev', name: 'Александр Петров', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150', title: 'Full-Stack Вайб-Кодер', rating: 4.9, review_count: 127, orders_completed: 253, response_time: '~30 мин', is_online: true, location: 'Москва', member_since: 'Март 2024', bio: 'Создаю веб-приложения с помощью AI-инструментов. Специализируюсь на React, Next.js и Node.js. Более 250 успешных проектов за 2 года.', skills: JSON.stringify(['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Supabase']), success_rate: 98, level: 'pro', role: 'freelancer', balance: 0 },
  { id: 'fl_user_2', user_id: 'fl_user_2', username: 'marinaui', name: 'Марина Козлова', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150', title: 'UI/UX Дизайнер + Фронтенд', rating: 4.8, review_count: 89, orders_completed: 156, response_time: '~1 час', is_online: true, location: 'Санкт-Петербург', member_since: 'Январь 2024', bio: 'Дизайню и верстаю интерфейсы, которые любят пользователи. Figma + React + AI — моя суперсила.', skills: JSON.stringify(['Figma', 'React', 'CSS', 'Tailwind', 'Framer Motion', 'UI/UX']), success_rate: 97, level: 'verified', role: 'freelancer', balance: 0 },
  { id: 'fl_user_3', user_id: 'fl_user_3', username: 'botmaster', name: 'Дмитрий Волков', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150', title: 'Telegram & Discord Боты', rating: 4.7, review_count: 64, orders_completed: 98, response_time: '~2 часа', is_online: false, location: 'Казань', member_since: 'Июнь 2024', bio: 'Разрабатываю ботов для Telegram, Discord и WhatsApp. Автоматизирую бизнес-процессы с помощью AI.', skills: JSON.stringify(['Python', 'Node.js', 'Telegram API', 'Discord.js', 'OpenAI', 'PostgreSQL']), success_rate: 95, level: 'verified', role: 'freelancer', balance: 0 },
  { id: 'fl_user_4', user_id: 'fl_user_4', username: 'aianna', name: 'Анна Сергеева', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', title: 'AI-Интеграции и Автоматизация', rating: 5.0, review_count: 42, orders_completed: 67, response_time: '~45 мин', is_online: true, location: 'Новосибирск', member_since: 'Сентябрь 2024', bio: 'Интегрирую AI в бизнес-процессы: чат-боты с GPT, автоматизация контента, RAG-системы.', skills: JSON.stringify(['Python', 'OpenAI API', 'LangChain', 'FastAPI', 'React', 'Vector DB']), success_rate: 100, level: 'pro', role: 'freelancer', balance: 0 },
  { id: 'fl_user_5', user_id: 'fl_user_5', username: 'mobilenik', name: 'Николай Ростов', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150', title: 'Мобильная разработка', rating: 4.6, review_count: 38, orders_completed: 51, response_time: '~3 часа', is_online: false, location: 'Екатеринбург', member_since: 'Ноябрь 2024', bio: 'React Native и Flutter — создаю кроссплатформенные приложения быстро и качественно.', skills: JSON.stringify(['React Native', 'Flutter', 'TypeScript', 'Firebase', 'Expo', 'Dart']), success_rate: 94, level: 'verified', role: 'freelancer', balance: 0 },
  { id: 'fl_user_6', user_id: 'fl_user_6', username: 'backendpro', name: 'Игорь Кузнецов', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150', title: 'Backend & DevOps', rating: 4.8, review_count: 71, orders_completed: 112, response_time: '~1 час', is_online: true, location: 'Москва', member_since: 'Февраль 2024', bio: 'Backend-архитектура, API, базы данных, DevOps. Строю надёжные серверные решения.', skills: JSON.stringify(['Node.js', 'Go', 'PostgreSQL', 'Docker', 'AWS', 'Redis']), success_rate: 96, level: 'pro', role: 'freelancer', balance: 0 },
  { id: 'fl_user_7', user_id: 'fl_user_7', username: 'webdesigner', name: 'Елена Морозова', avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150', title: 'Веб-дизайн и Вёрстка', rating: 4.9, review_count: 95, orders_completed: 189, response_time: '~40 мин', is_online: true, location: 'Краснодар', member_since: 'Декабрь 2023', bio: 'Создаю стильные и конверсионные сайты. От дизайна до готового кода за считанные дни.', skills: JSON.stringify(['HTML', 'CSS', 'JavaScript', 'WordPress', 'Figma', 'Webflow']), success_rate: 99, level: 'pro', role: 'freelancer', balance: 0 },
  { id: 'fl_user_8', user_id: 'fl_user_8', username: 'datamagic', name: 'Павел Новиков', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150', title: 'Базы данных и Аналитика', rating: 4.7, review_count: 33, orders_completed: 45, response_time: '~2 часа', is_online: false, location: 'Самара', member_since: 'Май 2024', bio: 'Проектирую БД, пишу оптимизированные запросы, настраиваю аналитику и дашборды.', skills: JSON.stringify(['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Grafana', 'SQL']), success_rate: 93, level: 'verified', role: 'freelancer', balance: 0 },
];

// Helper: profile map for gigs
const pMap = {};
profiles.forEach(p => pMap[p.username] = p);

const pkg = (name, price, days, desc, features) => JSON.stringify({ name, price, deliveryDays: days, description: desc, features });

const gigs = [
  { id: 'gig_1', title: 'Создам современный лендинг на Next.js за 2 дня', short_description: 'Быстрый и адаптивный лендинг с анимациями на Next.js + Tailwind CSS', description: 'Создам современный, быстрый и полностью адаптивный лендинг на Next.js 14 с использованием Tailwind CSS и Framer Motion.\n\n**Что вы получите:**\n- Полностью адаптивный дизайн (мобильный, планшет, десктоп)\n- Быстрая загрузка (Lighthouse 90+)\n- SEO-оптимизация\n- Анимации и микро-взаимодействия\n- Интеграция с формами обратной связи\n- Деплой на Vercel\n\n**Стек:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion', image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600', images: JSON.stringify(['https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600','https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600','https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600']), freelancer_id: 'fl_user_1', freelancer_name: 'Александр Петров', freelancer_avatar: pMap.alexdev.avatar, freelancer_username: 'alexdev', rating: 4.9, review_count: 127, orders_count: 253, tags: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Tailwind']), category: 'Разработка сайтов', category_slug: 'web-development', is_featured: true, status: 'active', package_economy: pkg('Эконом', 2000, 3, 'Одностраничный лендинг', ['1 страница', 'Адаптивность', 'Базовые анимации']), package_standard: pkg('Стандарт', 5000, 5, 'Лендинг + доп. секции', ['До 5 секций', 'Адаптивность', 'Анимации', 'Формы', 'SEO']), package_premium: pkg('Премиум', 12000, 7, 'Полный лендинг + CMS', ['Безлимит секций', 'Адаптивность', 'Анимации', 'CMS', 'SEO', 'Аналитика', 'Деплой']) },
  
  { id: 'gig_2', title: 'Telegram бот для бизнеса с AI-ассистентом', short_description: 'Умный Telegram-бот с интеграцией ChatGPT для автоматизации', description: 'Разработаю Telegram-бота с интегрированным AI-ассистентом на базе GPT для вашего бизнеса.\n\n**Возможности бота:**\n- Ответы на вопросы клиентов 24/7\n- Приём заказов и бронирований\n- Рассылки и уведомления\n- Интеграция с CRM\n- Аналитика использования', image: 'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=600', images: JSON.stringify(['https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=600','https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600']), freelancer_id: 'fl_user_3', freelancer_name: 'Дмитрий Волков', freelancer_avatar: pMap.botmaster.avatar, freelancer_username: 'botmaster', rating: 4.7, review_count: 64, orders_count: 98, tags: JSON.stringify(['Python', 'Telegram', 'ChatGPT', 'API']), category: 'Боты и автоматизация', category_slug: 'bots-automation', is_featured: true, status: 'active', package_economy: pkg('Эконом', 3000, 3, 'Простой бот', ['До 10 команд', 'Меню кнопок', 'Базовые ответы']), package_standard: pkg('Стандарт', 8000, 5, 'Бот с AI', ['AI-ответы', 'До 20 команд', 'Админ-панель', 'Аналитика']), package_premium: pkg('Премиум', 20000, 10, 'Полный AI-бот', ['Полный AI', 'CRM интеграция', 'Рассылки', 'Оплата', 'Поддержка 30 дней']) },
  
  { id: 'gig_3', title: 'React дашборд с графиками и аналитикой', short_description: 'Интерактивный дашборд на React с визуализацией данных', description: 'Создам профессиональный дашборд с интерактивными графиками, таблицами и фильтрами.\n\n**Включает:**\n- Интерактивные графики\n- Таблицы с сортировкой и фильтрацией\n- Экспорт данных\n- Тёмная/светлая тема\n- Адаптивный дизайн', image: 'https://images.pexels.com/photos/7947541/pexels-photo-7947541.jpeg?auto=compress&cs=tinysrgb&w=600', images: JSON.stringify(['https://images.pexels.com/photos/7947541/pexels-photo-7947541.jpeg?auto=compress&cs=tinysrgb&w=600','https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600']), freelancer_id: 'fl_user_1', freelancer_name: 'Александр Петров', freelancer_avatar: pMap.alexdev.avatar, freelancer_username: 'alexdev', rating: 4.9, review_count: 52, orders_count: 87, tags: JSON.stringify(['React', 'TypeScript', 'Charts', 'Dashboard']), category: 'Frontend', category_slug: 'frontend', is_featured: true, status: 'active', package_economy: pkg('Эконом', 5000, 5, 'Базовый дашборд', ['3 виджета', 'Базовые графики', 'Адаптивность']), package_standard: pkg('Стандарт', 15000, 7, 'Полный дашборд', ['10 виджетов', 'Интерактивные графики', 'Фильтры', 'Экспорт']), package_premium: pkg('Премиум', 30000, 14, 'Enterprise дашборд', ['Безлимит виджетов', 'Real-time', 'API', 'Роли', 'Кастомизация']) },
  
  { id: 'gig_4', title: 'Интеграция ChatGPT в ваш сайт или приложение', short_description: 'Подключу AI-чат на базе GPT-4 к вашему проекту', description: 'Интегрирую ChatGPT (GPT-4) в ваш существующий сайт или приложение. Создам умного чат-бота, который понимает контекст вашего бизнеса.', image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600', images: JSON.stringify(['https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600']), freelancer_id: 'fl_user_4', freelancer_name: 'Анна Сергеева', freelancer_avatar: pMap.aianna.avatar, freelancer_username: 'aianna', rating: 5.0, review_count: 42, orders_count: 67, tags: JSON.stringify(['OpenAI', 'Python', 'React', 'API']), category: 'AI Интеграции', category_slug: 'ai-integrations', is_featured: true, status: 'active', package_economy: pkg('Эконом', 4000, 2, 'Базовая интеграция', ['Чат-виджет', 'GPT-3.5', 'До 1000 запросов/мес']), package_standard: pkg('Стандарт', 10000, 5, 'Продвинутая интеграция', ['GPT-4', 'Контекст бизнеса', 'Кастом промпты', 'Аналитика']), package_premium: pkg('Премиум', 25000, 10, 'RAG-система', ['RAG', 'База знаний', 'GPT-4', 'API', 'Тренировка', 'Поддержка']) },
  
  { id: 'gig_5', title: 'Мобильное приложение на React Native', short_description: 'Кроссплатформенное мобильное приложение iOS + Android', description: 'Создам мобильное приложение для iOS и Android на React Native. Один код — две платформы.', image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600', images: JSON.stringify(['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600']), freelancer_id: 'fl_user_5', freelancer_name: 'Николай Ростов', freelancer_avatar: pMap.mobilenik.avatar, freelancer_username: 'mobilenik', rating: 4.6, review_count: 38, orders_count: 51, tags: JSON.stringify(['React Native', 'TypeScript', 'iOS', 'Android']), category: 'Мобильные приложения', category_slug: 'mobile-apps', is_featured: false, status: 'active', package_economy: pkg('Эконом', 15000, 7, '3 экрана', ['3 экрана', 'Базовая навигация', 'iOS + Android']), package_standard: pkg('Стандарт', 40000, 14, '8 экранов', ['8 экранов', 'API', 'Push-уведомления', 'Auth']), package_premium: pkg('Премиум', 80000, 30, 'Полное приложение', ['Безлимит экранов', 'Полный backend', 'Публикация', 'Поддержка']) },
  
  { id: 'gig_6', title: 'Сверстаю макет из Figma в идеальный код', short_description: 'Pixel-perfect вёрстка по макету из Figma', description: 'Превращу ваш Figma-макет в чистый, семантичный и адаптивный код. Pixel-perfect результат гарантирован.', image: 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=600', images: JSON.stringify(['https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=600']), freelancer_id: 'fl_user_2', freelancer_name: 'Марина Козлова', freelancer_avatar: pMap.marinaui.avatar, freelancer_username: 'marinaui', rating: 4.8, review_count: 89, orders_count: 156, tags: JSON.stringify(['HTML', 'CSS', 'React', 'Figma']), category: 'Frontend', category_slug: 'frontend', is_featured: false, status: 'active', package_economy: pkg('Эконом', 1500, 2, '1 страница', ['1 страница', 'Адаптивность', 'HTML/CSS']), package_standard: pkg('Стандарт', 4000, 4, 'До 5 страниц', ['5 страниц', 'React', 'Анимации', 'Адаптивность']), package_premium: pkg('Премиум', 10000, 7, 'Полный сайт', ['Безлимит страниц', 'React', 'CMS', 'SEO', 'Анимации']) },
  
  { id: 'gig_7', title: 'REST API + база данных на Node.js', short_description: 'Разработка серверной части с API и PostgreSQL', description: 'Спроектирую и разработаю REST API с чистой архитектурой, авторизацией и документацией.', image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=600', images: JSON.stringify(['https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=600']), freelancer_id: 'fl_user_6', freelancer_name: 'Игорь Кузнецов', freelancer_avatar: pMap.backendpro.avatar, freelancer_username: 'backendpro', rating: 4.8, review_count: 71, orders_count: 112, tags: JSON.stringify(['Node.js', 'PostgreSQL', 'Express', 'Docker']), category: 'Backend', category_slug: 'backend', is_featured: false, status: 'active', package_economy: pkg('Эконом', 5000, 3, 'Простой API', ['5 эндпоинтов', 'Auth', 'PostgreSQL']), package_standard: pkg('Стандарт', 15000, 7, 'Полный API', ['15 эндпоинтов', 'Auth', 'Документация', 'Тесты']), package_premium: pkg('Премиум', 35000, 14, 'Микросервисы', ['Микросервисы', 'Docker', 'CI/CD', 'Мониторинг', 'Масштабирование']) },
  
  { id: 'gig_8', title: 'MVP за 3 дня — от идеи до рабочего прототипа', short_description: 'Быстрый запуск вашего продукта с помощью вайб-кодинга', description: 'Помогу превратить вашу идею в рабочий MVP за 3 дня. Использую AI-инструменты для максимальной скорости разработки.', image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600', images: JSON.stringify(['https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600']), freelancer_id: 'fl_user_1', freelancer_name: 'Александр Петров', freelancer_avatar: pMap.alexdev.avatar, freelancer_username: 'alexdev', rating: 4.9, review_count: 34, orders_count: 45, tags: JSON.stringify(['React', 'Next.js', 'Supabase', 'AI']), category: 'Вайб-кодинг MVP', category_slug: 'mvp', is_featured: true, status: 'active', package_economy: pkg('Эконом', 10000, 3, 'Базовый MVP', ['3 страницы', 'Auth', 'База данных']), package_standard: pkg('Стандарт', 30000, 5, 'Продвинутый MVP', ['7 страниц', 'Auth', 'API', 'Деплой', 'Дашборд']), package_premium: pkg('Премиум', 60000, 10, 'Production MVP', ['Полный продукт', 'Масштабирование', 'CI/CD', 'Документация', 'Поддержка']) },
  
  { id: 'gig_9', title: 'Настрою базу данных PostgreSQL + Supabase', short_description: 'Проектирование БД, миграции, RLS и оптимизация запросов', description: 'Спроектирую оптимальную структуру базы данных, настрою безопасность и оптимизирую запросы.', image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600', images: JSON.stringify(['https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600']), freelancer_id: 'fl_user_8', freelancer_name: 'Павел Новиков', freelancer_avatar: pMap.datamagic.avatar, freelancer_username: 'datamagic', rating: 4.7, review_count: 33, orders_count: 45, tags: JSON.stringify(['PostgreSQL', 'Supabase', 'SQL', 'Redis']), category: 'Базы данных', category_slug: 'databases', is_featured: false, status: 'active', package_economy: pkg('Эконом', 3000, 2, 'Базовая настройка', ['Схема БД', '5 таблиц', 'RLS', 'Миграции']), package_standard: pkg('Стандарт', 8000, 4, 'Полная настройка', ['15 таблиц', 'RLS', 'Индексы', 'Функции', 'Триггеры']), package_premium: pkg('Премиум', 18000, 7, 'Enterprise', ['Безлимит таблиц', 'Оптимизация', 'Репликация', 'Бэкапы', 'Мониторинг']) },
  
  { id: 'gig_10', title: 'UI/UX дизайн в Figma для вашего приложения', short_description: 'Современный дизайн интерфейса с прототипированием', description: 'Создам современный и удобный дизайн для вашего веб-приложения или мобильного приложения в Figma.', image: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=600', images: JSON.stringify(['https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=600']), freelancer_id: 'fl_user_2', freelancer_name: 'Марина Козлова', freelancer_avatar: pMap.marinaui.avatar, freelancer_username: 'marinaui', rating: 4.8, review_count: 56, orders_count: 92, tags: JSON.stringify(['Figma', 'UI/UX', 'Прототип', 'Дизайн']), category: 'Frontend', category_slug: 'frontend', is_featured: false, status: 'active', package_economy: pkg('Эконом', 3000, 3, '3 экрана', ['3 экрана', 'Мобильная версия', 'UI Kit']), package_standard: pkg('Стандарт', 8000, 5, '8 экранов', ['8 экранов', 'Адаптив', 'Прототип', 'UI Kit']), package_premium: pkg('Премиум', 20000, 10, 'Полный дизайн', ['Безлимит экранов', 'Дизайн-система', 'Прототип', 'Handoff']) },
  
  { id: 'gig_11', title: 'Discord бот с модерацией и мини-играми', short_description: 'Кастомный Discord-бот для вашего сервера', description: 'Разработаю Discord-бота с функциями модерации, мини-играми, системой уровней и музыкой.', image: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=600', images: JSON.stringify(['https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=600']), freelancer_id: 'fl_user_3', freelancer_name: 'Дмитрий Волков', freelancer_avatar: pMap.botmaster.avatar, freelancer_username: 'botmaster', rating: 4.7, review_count: 28, orders_count: 43, tags: JSON.stringify(['Discord.js', 'Node.js', 'MongoDB', 'API']), category: 'Боты и автоматизация', category_slug: 'bots-automation', is_featured: false, status: 'active', package_economy: pkg('Эконом', 2500, 3, 'Базовый бот', ['Модерация', '5 команд', 'Логирование']), package_standard: pkg('Стандарт', 7000, 5, 'Продвинутый бот', ['15 команд', 'Уровни', 'Мини-игры', 'Музыка']), package_premium: pkg('Премиум', 15000, 10, 'Кастом-бот', ['Безлимит команд', 'AI', 'Dashboard', 'API', 'Хостинг']) },
  
  { id: 'gig_12', title: 'Автоматизация рабочих процессов с n8n + AI', short_description: 'Настрою автоматизацию бизнеса с помощью n8n и AI', description: 'Настрою автоматизацию ваших бизнес-процессов: от обработки заявок до генерации контента с AI.', image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600', images: JSON.stringify(['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600']), freelancer_id: 'fl_user_4', freelancer_name: 'Анна Сергеева', freelancer_avatar: pMap.aianna.avatar, freelancer_username: 'aianna', rating: 5.0, review_count: 19, orders_count: 28, tags: JSON.stringify(['n8n', 'Zapier', 'OpenAI', 'Автоматизация']), category: 'AI Интеграции', category_slug: 'ai-integrations', is_featured: false, status: 'active', package_economy: pkg('Эконом', 3000, 2, '1 автоматизация', ['1 сценарий', 'До 5 шагов', 'Настройка']), package_standard: pkg('Стандарт', 8000, 4, '3 автоматизации', ['3 сценария', 'AI-обработка', 'Интеграции', 'Документация']), package_premium: pkg('Премиум', 20000, 7, 'Полная автоматизация', ['Безлимит', 'AI', 'Мониторинг', 'Обучение', 'Поддержка']) },
];

const reviews = [
  { id: 'rev_1', gig_id: 'gig_1', order_id: '', author_id: 'fl_user_99', author_name: 'Олег Тимофеев', author_avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=80', rating: 5, text: 'Лендинг получился невероятный! Скорость загрузки — огонь, дизайн точно по макету. Рекомендую!', reply: 'Спасибо за отзыв, Олег! Было приятно работать над вашим проектом.' },
  { id: 'rev_2', gig_id: 'gig_2', order_id: '', author_id: 'fl_user_98', author_name: 'Виктория Белова', author_avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=80', rating: 5, text: 'Бот для нашего магазина работает идеально. Клиенты довольны, автоматизация экономит кучу времени.', reply: '' },
  { id: 'rev_3', gig_id: 'gig_3', order_id: '', author_id: 'fl_user_97', author_name: 'Максим Горбунов', author_avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=80', rating: 4, text: 'Хороший дашборд, всё работает. Единственное — хотелось бы больше вариантов графиков. В целом доволен.', reply: 'Максим, спасибо! Дополнительные типы графиков можно добавить в рамках доработки. Напишите, обсудим!' },
  { id: 'rev_4', gig_id: 'gig_4', order_id: '', author_id: 'fl_user_96', author_name: 'Анастасия Юрьева', author_avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=80', rating: 5, text: 'AI-чат на сайте — это просто магия! Отвечает на вопросы клиентов лучше, чем наши менеджеры.', reply: '' },
  { id: 'rev_5', gig_id: 'gig_8', order_id: '', author_id: 'fl_user_95', author_name: 'Сергей Павлов', author_avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=80', rating: 5, text: 'MVP готов за 3 дня, как и обещали. Уже привлекли первых пользователей. Вайб-кодинг — будущее!', reply: '' },
  { id: 'rev_6', gig_id: 'gig_6', order_id: '', author_id: 'fl_user_94', author_name: 'Наталья Ким', author_avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=80', rating: 4, text: 'Вёрстка pixel-perfect, всё по макету. Были мелкие правки, но исправили быстро. Буду обращаться ещё.', reply: '' },
];

// ============================================
// Seed Logic
// ============================================

async function clearCollection(collId) {
  try {
    const docs = await databases.listDocuments(DB_ID, collId, [sdk.Query.limit(100)]);
    for (const doc of docs.documents) {
      await databases.deleteDocument(DB_ID, collId, doc.$id);
    }
    console.log(`  🗑️  Cleared ${docs.documents.length} docs`);
  } catch (e) {
    console.log(`  ⚠️  Clear: ${e.message}`);
  }
}

async function seedCollection(collId, items) {
  console.log(`\n📦 Seeding ${collId} (${items.length} items)`);
  await clearCollection(collId);
  
  let ok = 0, fail = 0;
  for (const item of items) {
    const docId = item.id || sdk.ID.unique();
    const data = { ...item };
    delete data.id;
    
    try {
      await databases.createDocument(DB_ID, collId, docId, data);
      ok++;
    } catch (e) {
      console.log(`  ❌ ${docId}: ${e.message}`);
      fail++;
    }
    await sleep(200);
  }
  console.log(`  ✅ ${ok} created, ${fail} failed`);
}

async function main() {
  console.log('🌱 Seeding VibeCoder Freelance data...\n');
  
  await seedCollection('fl_categories', categories);
  await seedCollection('fl_profiles', profiles);
  await seedCollection('fl_gigs', gigs);
  await seedCollection('fl_reviews', reviews);

  console.log('\n✅ Seed complete!');
}

main().catch(console.error);
