import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24">
      <SEO title="Политика конфиденциальности" />
      <h1 className="font-display text-3xl font-bold text-gold-gradient tracking-[0.08em] uppercase mb-8">Политика конфиденциальности</h1>

      <div className="space-y-8 text-sm text-body leading-relaxed">
        <section>
          <h2 className="text-lg font-heading font-semibold text-heading mb-3">1. Сбор информации</h2>
          <p>При регистрации и использовании VibeCoder мы собираем следующие данные: имя и фамилия, адрес электронной почты, аватар (при загрузке), информация о навыках и специализации, данные о заказах и транзакциях, сообщения в чате, IP-адрес и данные об устройстве.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-heading mb-3">2. Использование информации</h2>
          <p>Собранные данные используются для: обеспечения работы Платформы, идентификации пользователей, обработки заказов, отправки уведомлений о статусе заказов и сообщениях, улучшения качества сервиса, обеспечения безопасности, предотвращения мошенничества.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-heading mb-3">3. Хранение данных</h2>
          <p>Данные хранятся на защищённых серверах. Мы используем Appwrite для управления данными и аутентификацией. Данные хранятся на территории, обеспечивающей надлежащий уровень защиты. Мы применяем шифрование при передаче данных (HTTPS/TLS).</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-heading mb-3">4. Передача данных третьим лицам</h2>
          <p>Мы не продаём и не передаём персональные данные третьим лицам, за исключением случаев: выполнения требований законодательства, защиты прав Платформы, необходимости для обработки заказа (имя и контакты передаются контрагенту по сделке).</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-heading mb-3">5. Cookie и аналитика</h2>
          <p>Мы используем cookies для обеспечения работы авторизации и сохранения настроек. Аналитические данные собираются в обезличенном виде для улучшения сервиса.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-heading mb-3">6. Права пользователя</h2>
          <p>Вы имеете право: запросить доступ к своим персональным данным, потребовать исправления неточных данных, потребовать удаления аккаунта и связанных данных, отозвать согласие на обработку данных. Для реализации этих прав обратитесь в техподдержку.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-heading mb-3">7. Безопасность</h2>
          <p>Мы принимаем организационные и технические меры для защиты данных: шифрование паролей, HTTPS, защита от CSRF и XSS, регулярное обновление ПО, ограниченный доступ к данным.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-heading mb-3">8. Изменения политики</h2>
          <p>Мы можем обновлять настоящую Политику. Актуальная версия всегда доступна на этой странице. При существенных изменениях мы уведомим пользователей по электронной почте.</p>
        </section>

        <div className="border-t border-gold/20 pt-6 text-xs text-muted">
          <p>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
          <p>Контакт: support@vibecoding.by</p>
        </div>
      </div>
    </div>
  );
}
