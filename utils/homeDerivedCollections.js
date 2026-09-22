// ==============================================================================
// МОДУЛЬ ПОСТРОЕНИЯ ПРОИЗВОДНЫХ КОЛЛЕКЦИЙ ВИТРИНЫ
// Файл: utils/homeDerivedCollections.js
// Назначение: Автоматическая генерация структурированных коллекций для рендеринга
// витрины: спальни, удобства, отзывы, 14 ориентиров, спа-комплекс и безопасность.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

function buildHomeDerivedCollections(home) {
  if (!home) return;

  // 1. Спальни
  if (!home.bedrooms || home.bedrooms.length === 0) {
    const bedroomsList = [];
    [1, 2, 3, 4].forEach((i) => {
      const item = home[`bedroom_${i}`];
      if (item && item.enabled !== false) {
        const descItem = home[`bedroom_${i}_desc`];
        const badgeItem = home[`bedroom_${i}_badge`];
        bedroomsList.push({
          id: i,
          title: { ru: item.ru, en: item.en, tr: item.tr },
          desc: {
            ru: descItem?.ru || item.ru,
            en: descItem?.en || item.en,
            tr: descItem?.tr || item.tr
          },
          badge: {
            ru: badgeItem?.ru || `Спальня ${i}`,
            en: badgeItem?.en || `Bedroom ${i}`,
            tr: badgeItem?.tr || `Yatak Odası ${i}`
          },
          image: item.media || '',
          iconName: descItem?.media || 'BedDouble'
        });
      }
    });
    home.bedrooms = bedroomsList;
  }

  // 2. Удобства основные [Main Amenities]
  if (!home.mainAmenities || home.mainAmenities.length === 0) {
    const mainAmenitiesList = [];
    for (let i = 1; i <= 20; i++) {
      const item = home[`amenity_main_${i}`];
      if (item && item.enabled !== false) {
        mainAmenitiesList.push({
          key: `amenity_main_${i}`,
          label: { ru: item.ru, en: item.en, tr: item.tr },
          icon: item.media || 'Check'
        });
      }
    }
    home.mainAmenities = mainAmenitiesList;
  }

  // 3. Удобства сгруппированные для модального окна [Grouped Amenities]
  if (!home.amenitiesGrouped || home.amenitiesGrouped.length === 0) {
    const groupedAmenitiesList = [];
    for (let c = 1; c <= 10; c++) {
      const catTitleItem = home[`amenity_cat${c}_title`];
      if (catTitleItem && catTitleItem.enabled !== false) {
        const items = [];
        for (let it = 1; it <= 20; it++) {
          const item = home[`amenity_cat${c}_item${it}`];
          if (item && item.enabled !== false) {
            items.push({
              ru: item.ru,
              en: item.en,
              tr: item.tr
            });
          }
        }
        groupedAmenitiesList.push({
          category: {
            ru: catTitleItem.ru,
            en: catTitleItem.en,
            tr: catTitleItem.tr
          },
          icon: catTitleItem.media || 'Check',
          items
        });
      }
    }
    home.amenitiesGrouped = groupedAmenitiesList;
  }

  // 4. Отзывы и критерии оценок [Reviews]
  if (!home.reviewsData || !home.reviewsData.reviews || home.reviewsData.reviews.length === 0) {
    const reviewCatsList = [];
    for (let c = 1; c <= 10; c++) {
      const item = home[`review_cat_${c}`];
      if (item && item.enabled !== false) {
        const parts = (item.media || '5.0|100').split('|');
        const score = parts[0] || '5.0';
        const percent = parseInt(parts[1], 10) || 100;
        reviewCatsList.push({
          label: { ru: item.ru, en: item.en, tr: item.tr },
          score,
          percent
        });
      }
    }
    const reviewCardsList = [];
    for (let r = 1; r <= 10; r++) {
      const authItem = home[`review_${r}_author`];
      const textItem = home[`review_${r}_text`];
      if (authItem && authItem.enabled !== false) {
        reviewCardsList.push({
          author: { ru: authItem.ru, en: authItem.en, tr: authItem.tr },
          avatar: authItem.media || '',
          comment: { ru: textItem?.ru || '', en: textItem?.en || '', tr: textItem?.tr || '' }
        });
      }
    }
    home.reviewsData = {
      header: home.reviews_score_header || null,
      categories: reviewCatsList,
      reviews: reviewCardsList
    };
  }

  // 5. Описание виллы и правила [About & Rules]
  if (!home.aboutSections || home.aboutSections.length === 0) {
    const aboutSectionsList = [];
    for (let s = 1; s <= 10; s++) {
      const titleItem = home[`about_sec_${s}_title`];
      const textItem = home[`about_sec_${s}_text`];
      if (titleItem && titleItem.enabled !== false) {
        aboutSectionsList.push({
          id: String(s),
          title: { ru: titleItem.ru, en: titleItem.en, tr: titleItem.tr },
          text: { ru: textItem?.ru || '', en: textItem?.en || '', tr: textItem?.tr || '' }
        });
      }
    }
    home.aboutSections = aboutSectionsList;
  }

  // 6. Географические ориентиры Дальяна [Landmarks] [14 локаций]
  if (!home.landmarksList || home.landmarksList.length === 0) {
    const landmarksList = [];
    const landmarkCategoryMap = {
      1: 'walk', 2: 'walk', 3: 'food', 4: 'food', 5: 'walk',
      6: 'nature', 7: 'nature', 8: 'nature', 9: 'beach',
      10: 'nature', 11: 'nature', 12: 'nature', 13: 'transport', 14: 'city'
    };
    const landmarkDefaultTitles = {
      1: { ru: 'Пешеходный центр Дальяна', en: 'Dalyan Pedestrian Center', tr: 'Dalyan Yaya Merkezi' },
      2: { ru: 'Речная набережная и причал', en: 'River Promenade & Pier', tr: 'Nehir Kordonu ve İskele' },
      3: { ru: 'Ресторан La Boheme Dalyan Bistro', en: 'La Boheme Dalyan Bistro Restaurant', tr: 'La Boheme Dalyan Bistro Restoranı' },
      4: { ru: 'Ресторан Çiçek Restoran', en: 'Çiçek Restoran Restaurant', tr: 'Çiçek Restoran' },
      5: { ru: 'Субботний фермерский рынок', en: 'Saturday Farmers Market', tr: 'Cumartesi Köy Pazarı' },
      6: { ru: 'Ликийские скальные гробницы', en: 'Lycian Rock Tombs', tr: 'Likya Kaya Mezarları' },
      7: { ru: 'Античный город Каунос', en: 'Ancient City of Kaunos', tr: 'Antik Kaunos Kenti' },
      8: { ru: 'Источники и грязи Султание', en: 'Sultaniye Thermal Springs & Mud Baths', tr: 'Sultaniye Kaplıcaları ve Çamur Banyoları' },
      9: { ru: 'Песчаный черепаший пляж Изтузу', en: 'Protected Iztuzu Turtle Beach', tr: 'İztuzu Kaplumbağa Plajı' },
      10: { ru: 'Пресноводное озеро Кёйджегиз', en: 'Freshwater Lake Koycegiz', tr: 'Tatlı su Köyceğiz Gölü' },
      11: { ru: 'Смотровая площадка на горе Радар', en: 'Radar Mountain Viewpoint', tr: 'Radar Tepesi Seyir Noktası' },
      12: { ru: 'Центр реабилитации черепах DEKAMER', en: 'DEKAMER Sea Turtle Rescue Center', tr: 'DEKAMER Kaplumbağa Kurtarma Merkezi' },
      13: { ru: 'Международный аэропорт Даламан [DLM]', en: 'Dalaman International Airport [DLM]', tr: 'Dalaman Uluslararası Havalimanı [DLM]' },
      14: { ru: 'Морской курортный город Мармарис', en: 'Resort City of Marmaris', tr: 'Liman Şehri Marmaris' }
    };

    for (let i = 1; i <= 14; i++) {
      const item = home[`landmark_${i}`];
      if (item && item.enabled !== false) {
        const mediaParts = (item.media || '').split('|');
        const distance = mediaParts[0] || '';
        const time = mediaParts[1] || '';
        const category = mediaParts[2] || landmarkCategoryMap[i] || 'nature';
        const badge = mediaParts[3] || '';
        const icon = mediaParts[4] || 'MapPin';
        const titleObj = landmarkDefaultTitles[i] || { ru: `Ориентир ${i}`, en: `Landmark ${i}`, tr: `Nokta ${i}` };

        landmarksList.push({
          id: `landmark_${i}`,
          index: i,
          category,
          icon,
          distance,
          time,
          badge,
          title: titleObj,
          desc: { ru: item.ru, en: item.en, tr: item.tr }
        });
      }
    }
    home.landmarksList = landmarksList;
  }

  // 7. Спа-комплекс, бассейн и сад [Spa & Pool Data]
  if (!home.spaData) {
    home.spaData = {
      title: home.spa_title || { ru: 'Спа-комплекс и бассейн с соленой водой', en: 'Spa Complex & Saltwater Pool', tr: 'Spa Kompleksi ve Tuzlu Su Havuzu' },
      subtitle: home.spa_subtitle || { ru: 'Приватная закрытая территория, солевой бассейн 36 м², гидромассажное джакузи и лаунж-зона отдыха', en: 'Gated private territory, 36 sqm saltwater pool, hydro-massage jacuzzi and outdoor relaxation lounge', tr: 'Özel korunaklı alan, 36 m² tuzlu su havuzu, hidromasajlı jakuzi ve açık dinlenme alanı' },
      poolTitle: home.spa_pool_title || { ru: 'Приватный бассейн с соленой водой', en: 'Private Saltwater Pool', tr: 'Özel Tuzlu Su Havuzu' },
      poolDesc: home.spa_pool_desc || { ru: 'Чаша 4 × 9 метров [площадь 36 кв. м], постоянная комфортная глубина 150 см по всей площади чаши. Мягкая природная минерализация исключает раздражение кожи и едкий запах хлора.', en: 'Pool bowl 4x9 meters [area 36 sqm], constant comfortable depth of 150 cm throughout. Gentle natural mineralization prevents skin irritation and chlorine smell.', tr: '4x9 metre havuz ölçüsü [36 m² alan], tüm havuz boyunca sabit ve konforlu 150 cm derinlik. Yumuşak doğal mineralizasyon cilt tahrişini ve klor kokusunu önler.' },
      poolBadge: home.spa_pool_badge || { ru: 'Соленая вода без хлора', en: 'Saltwater without chlorine', tr: 'Klorsuz tuzlu su' },
      poolSeason: home.spa_pool_season || { ru: 'Сезон работы: с 1 мая по 1 ноября', en: 'Operating season: May 1 to November 1', tr: 'Çalışma sezonu: 1 Mayıs - 1 Kasım' },
      poolLighting: home.spa_pool_lighting || { ru: 'Подводная ночная подсветка: 20:00 - 01:00', en: 'Underwater night lighting: 20:00 - 01:00', tr: 'Gece sualtı aydınlatması: 20:00 - 01:00' },
      poolMaintenance: home.spa_pool_maintenance || { ru: 'График чистки: в день заселения и далее каждые 7 дней', en: 'Maintenance schedule: on check-in day and every 7 days', tr: 'Temizlik takvimi: giriş gününde ve her 7 günde bir' },
      jacuzziTitle: home.spa_jacuzzi_title || { ru: 'Открытое уличное джакузи', en: 'Outdoor Open-Air Jacuzzi', tr: 'Açık Hava Jakuzisi' },
      jacuzziDesc: home.spa_jacuzzi_desc || { ru: 'Гидромассажная спа-ванна в зоне бассейна с подогревом и регулируемыми форсунками для глубокого расслабления на свежем воздухе.', en: 'Heated hydromassage spa tub in pool zone with adjustable jets for deep outdoor muscle relaxation.', tr: 'Havuz alanında açık havada derin kas gevşemesi sağlayan ısıtmalı ve ayarlanabilir jetlere sahip hidromasajlı jakuzi.' },
      jacuzziBadge: home.spa_jacuzzi_badge || { ru: 'Вместимость: 4 персоны', en: 'Capacity: 4 guests', tr: 'Kapasite: 4 kişi' },
      jacuzziSchedule: home.spa_jacuzzi_schedule || { ru: 'Режим работы: 10:00 - 17:00 [15 мин каждые 45 мин]', en: 'Operating hours: 10:00 - 17:00 [15 min every 45 min]', tr: 'Çalışma saatleri: 10:00 - 17:00 [45 dakikada bir 15 dk]' },
      jacuzziLighting: home.spa_jacuzzi_lighting || { ru: 'Подсветка джакузи: 20:00 - 01:00', en: 'Jacuzzi lighting: 20:00 - 01:00', tr: 'Jakuzi aydınlatması: 20:00 - 01:00' },
      jacuzziSeason: home.spa_jacuzzi_season || { ru: 'Период активности: с 1 мая по 1 ноября', en: 'Activity period: May 1 to November 1', tr: 'Aktif dönem: 1 Mayıs - 1 Kasım' },
      streetLightingTitle: home.spa_street_lighting_title || { ru: 'Освещение территории', en: 'Territory Lighting', tr: 'Bahçe Aydınlatması' },
      streetLightingDesc: home.spa_street_lighting_desc || { ru: 'Автоматическое включение сада: 20:00 - 01:00 и 04:00 - 06:00', en: 'Automated garden lights: 20:00 - 01:00 and 04:00 - 06:00', tr: 'Otomatik bahçe aydınlatması: 20:00 - 01:00 ve 04:00 - 06:00' },
      parkingTitle: home.spa_parking_title || { ru: 'Приватная парковка', en: 'Private On-Site Parking', tr: 'Özel Otopark' },
      parkingDesc: home.spa_parking_desc || { ru: 'Закрытая бесплатная парковка на территории виллы на 2 автомобиля', en: 'Gated free parking on villa grounds for 2 vehicles', tr: 'Villa mülkü içinde 2 araçlık ücretsiz kapalı otopark' },
      bbqTitle: home.spa_bbq_title || { ru: 'BBQ и обеденная зона', en: 'BBQ & Dining Area', tr: 'Barbekü ve Yemek Alanı' },
      bbqDesc: home.spa_bbq_desc || { ru: 'Обеденный стол на 8 мест, гриль на углях, шезлонги и уличный душ', en: 'Outdoor dining table for 8, charcoal grill, sun loungers, poolside shower', tr: '8 kişilik açık yemek masası, kömürlü ızgara, şezlonglar ve havuz duşu' }
    };
  }

  // 8. Безопасность, Закон № 7464 и доступная среда [Safety, Law 7464 & Accessibility]
  if (!home.safetyData) {
    home.safetyData = {
      title: home.legal_safety_title || { ru: 'Безопасность, Закон № 7464 и Доступная среда', en: 'Safety, Law No. 7464 & Accessible Environment', tr: 'Güvenlik, 7464 Sayılı Kanun ve Engelsiz Erişim' },
      subtitle: home.legal_safety_subtitle || { ru: 'Полное соответствие законодательству Турции о краткосрочной аренде, защита гостей и безбарьерный доступ', en: 'Full compliance with Turkish short-term rental laws, guest protection and barrier-free access', tr: 'Türkiye kısa dönem kiralama mevzuatına tam uyum, misafir güvenliği ve engelsiz erişim' },
      law7464Title: home.legal_law7464_title || { ru: 'Официальный договор и учет KBS', en: 'Official Contract & KBS Police Registration', tr: 'Resmi Sözleşme ve KBS Polis Kaydı' },
      law7464Desc: home.legal_law7464_desc || { ru: 'Вилла осуществляет деятельность в строгом соответствии с Законом № 7464 о краткосрочной туристической аренде в Турции.', en: 'Villa operates in strict accordance with Turkish Law No. 7464 on Short-Term Tourist Rentals.', tr: 'Villa, Türkiye\'deki 7464 Sayılı Konutların Turizm Amaçlı Kiralanması Kanunu\'na tam uygun olarak işletilmektedir.' },
      law7464Badge: home.legal_law7464_badge || { ru: 'Закон Турции № 7464', en: 'Turkish Law No. 7464', tr: 'Türkiye Kanunu No. 7464' },
      law7464Item1: home.legal_law7464_item1 || { ru: 'Обязательный договор краткосрочного найма с описью имущества при заезде', en: 'Mandatory short-term rental agreement with property inventory upon check-in', tr: 'Girişte demirbaş listesi içeren zorunlu kısa dönem kira sözleşmesi' },
      law7464Item2: home.legal_law7464_item2 || { ru: 'Регистрация паспортов всех проживающих гостей в полицейской системе KBS [Kimlik Bildirme Sistemi]', en: 'Registration of all residing guests in the Turkish Gendarmerie KBS police system', tr: 'Tüm konaklayan misafirlerin jandarma KBS [Kimlik Bildirme Sistemi] sistemine kaydedilmesi' },
      law7464Item3: home.legal_law7464_item3 || { ru: 'Размещение лиц, не внесенных в государственную систему KBS, строго запрещено', en: 'Accommodation of third parties not registered in the official KBS system is strictly prohibited', tr: 'Resmi KBS sistemine kaydedilmemiş kişilerin konaklaması kesinlikle yasaktır' },
      securityTitle: home.legal_security_title || { ru: 'Безопасность дома и территории', en: 'Home & Territory Safety Standards', tr: 'Ev ve Mülk Güvenlik Standartları' },
      securityDesc: home.legal_security_desc || { ru: 'Оснащение дома сертифицированными системами предупреждения и постоянного мониторинга.', en: 'Equipping the villa with certified emergency warning systems and 24/7 perimeter monitoring.', tr: 'Villanın sertifikalı uyarı sistemleri ve 24/7 çevre izleme ile donatılması.' },
      securityBadge: home.legal_security_badge || { ru: 'Стандарты безопасности', en: 'Safety Standards', tr: 'Güvenlik Standartları' },
      securityItem1: home.legal_security_item1 || { ru: 'Наружные камеры видеонаблюдения установлены строго по периметру забора и у калитки [без съемки бассейна и террасы]', en: 'External perimeter CCTV security cameras strictly at fence and gate [no cameras in pool or patio]', tr: 'Dış çevre güvenlik kameraları sadece çit ve bahçe kapısında [havuz ve verandada kamera yoktur]' },
      securityItem2: home.legal_security_item2 || { ru: 'Сертифицированные автономные датчики дыма и угарного газа на обоих этажах виллы', en: 'Certified autonomous smoke and carbon monoxide detectors on both villa floors', tr: 'Villanın her iki katında sertifikalı duman ve karbonmonoksit dedektörleri' },
      securityItem3: home.legal_security_item3 || { ru: 'Огнетушители на 1 и 2 этажах, укомплектованная медицинская аптечка первой помощи', en: 'Fire extinguishers on 1st and 2nd floors, fully equipped emergency first aid kit', tr: '1. ve 2. katlarda yangın söndürücüler, tam donanımlı ilk yardım tıbbi çantası' },
      accessibleTitle: home.legal_accessible_title || { ru: 'Инклюзивность и доступная среда', en: 'Inclusivity & Accessible Environment', tr: 'Kapsayıcılık ve Engelsiz Erişim' },
      accessibleDesc: home.legal_accessible_desc || { ru: 'Создание безбарьерных условий для комфортного отдыха гостей с ограниченной мобильностью.', en: 'Creating barrier-free environment for guests with reduced mobility and senior family members.', tr: 'Hareket kısıtlılığı olan misafirler ve yaşlılar için engelsiz yaşam koşulları oluşturma.' },
      accessibleBadge: home.legal_accessible_badge || { ru: 'Безбарьерная среда', en: 'Barrier-free Access', tr: 'Engelsiz Yaşam' },
      accessibleItem1: home.legal_accessible_item1 || { ru: 'Безбарьерный доступ: спальня №1 на 1 этаже оборудована широкими дверными проемами без порогов', en: 'Barrier-free access: Bedroom 1 on ground floor has wide doorways and zero-threshold transitions', tr: 'Engelsiz erişim: Giriş katındaki 1. yatak odası eşiksiz geçişler ve geniş kapılarla donatılmıştır' },
      accessibleItem2: home.legal_accessible_item2 || { ru: 'Санузел первого этажа спроектирован с возможностью комфортного использования гостями с ограниченной мобильностью', en: 'Ground floor bathroom designed for comfortable independent access by guests with limited mobility', tr: 'Giriş katındaki banyo, hareket kısıtlılığı olan misafirlerin konforlu kullanımı için tasarlanmıştır' },
      accessibleItem3: home.legal_accessible_item3 || { ru: 'Возможность установки мобильного подъемника для спуска в бассейн по предварительному запросу', en: 'Option to install a specialized mobile pool lift for water descent upon advance request', tr: 'Önceden talep edilmesi durumunda havuza iniş için özel mobil asansör kurulum imkanı' },
      cancellationTitle: home.legal_cancellation_title || { ru: 'Политика отмены и возврата', en: 'Cancellation & Refund Policy', tr: 'İptal ve İade Politikası' },
      cancellationDesc: home.legal_cancellation_desc || { ru: 'Прозрачные финансовые условия бронирования без скрытых штрафов.', en: 'Transparent booking financial conditions without hidden cancellation fees.', tr: 'Gizli ceza olmaksızın şeffaf rezervasyon ve mali koşullar.' },
      cancellationBadge: home.legal_cancellation_badge || { ru: 'Возврат 100%', en: '100% Refund', tr: '%100 İade' },
      cancellationItem1: home.legal_cancellation_item1 || { ru: 'Полный 100% возврат предоплаты при отмене более чем за 14 суток до даты заезда', en: 'Full 100% refund of advance payment if canceled more than 14 days prior to check-in date', tr: 'Giriş tarihinden 14 gün öncesine kadar yapılan iptallerde %100 kesintisiz ön ödeme iadesi' },
      cancellationItem2: home.legal_cancellation_item2 || { ru: 'При отмене менее чем за 14 суток до заезда удерживается стоимость проживания за первые сутки', en: 'For cancellations less than 14 days before arrival, the cost of the first night is retained', tr: 'Girişe 14 günden daha az süre kala yapılan iptallerde ilk gecelik konaklama ücreti tahsil edilir' },
      cancellationItem3: home.legal_cancellation_item3 || { ru: 'Официальное оформление e-Arşiv Fatura на имя гостя согласно VUK 213 Madde 230', en: 'Official issuance of e-Arşiv Fatura tax invoice in guest\'s name under VUK 213 Article 230', tr: 'VUK 213 Madde 230 uyarınca misafir adına resmi e-Arşiv Fatura düzenlenmesi' }
    };
  }
}

module.exports = {
  buildHomeDerivedCollections
};
