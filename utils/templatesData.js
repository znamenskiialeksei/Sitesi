/**
 * ЕДИНЫЙ СБОРНИК ШАБЛОНОВ СООБЩЕНИЙ VILLA TURAMAN
 * Файл: utils/templatesData.js
 * Назначение: Эталонный структурированный реестр из 14 шаблонов на 3 языках (RU, EN, TR)
 * по 5 хронологическим этапам общения с гостем.
 */

const TEMPLATE_STAGES = [
  {
    id: 'stage_1',
    title: {
      ru: 'Этап 1: До бронирования',
      en: 'Stage 1: Pre-Booking & Sales',
      tr: 'Aşama 1: Rezervasyon Öncesi'
    },
    icon: 'Tag'
  },
  {
    id: 'stage_2',
    title: {
      ru: 'Этап 2: Подтверждение бронирования',
      en: 'Stage 2: Post-Booking & Inquiries',
      tr: 'Aşama 2: Rezervasyon Onayı'
    },
    icon: 'CheckCircle'
  },
  {
    id: 'stage_3',
    title: {
      ru: 'Этап 3: Подготовка к заезду',
      en: 'Stage 3: Pre-Arrival Logistics',
      tr: 'Aşama 3: Giriş Hazırlığı'
    },
    icon: 'MapPin'
  },
  {
    id: 'stage_4',
    title: {
      ru: 'Этап 4: Во время проживания',
      en: 'Stage 4: During Stay Care',
      tr: 'Aşama 4: Konaklama Süreci'
    },
    icon: 'Sparkles'
  },
  {
    id: 'stage_5',
    title: {
      ru: 'Этап 5: Выезд и завершение',
      en: 'Stage 5: Check-Out & Departure',
      tr: 'Aşama 5: Çıkış ve Veda'
    },
    icon: 'RotateCcw'
  }
];

const SMART_TEMPLATES = [
  // --- ЭТАП 1: ДО БРОНИРОВАНИЯ ---
  {
    id: '1.1_discount_10',
    stageId: 'stage_1',
    title: {
      ru: '1.1. Скидка 10% за невозвратный тариф',
      en: '1.1. 10% Non-refundable rate discount',
      tr: '1.1. %10 İade Edilemez Tarife İndirimi'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Рад вашему интересу к Villa Turaman! 🏡

Хочу поделиться с вами полезным советом, как сделать ваше бронирование более выгодным. Для поездок на ближайшие даты у нас активирована специальная опция : «Бронирование без возврата со скидкой 10%».

💡 Как это работает и важное правило платформы:
Эта скидка автоматически отображается системой только в том случае, если дата вашего выезда выпадает на ближайшие 60 дней от сегодняшнего дня.

При самостоятельном оформлении бронирования через поиск на сайте система предложит вам два варианта на выбор:

🔹 Стандартный тариф: действуют обычные правила отмены, указанные в объявлении (вы сохраняете гибкость, если планы изменятся).

🔹 Тариф со скидкой 10%: вы получаете гарантированную скидку от базовой стоимости, но при этом оплата становится невозвратной.

🎯 Что выбрать?

Если ваши даты точно определены и вы заезжаете в ближайшие два месяца : смело выбирайте тариф со скидкой, чтобы приятно сэкономить!

Если вам важна возможность скорректировать даты или выезд планируется более чем через 60 дней : рекомендуем выбрать стандартный тариф.

С удовольствием отвечу на любые возникшие вопросы и желаю вам прекрасной поездки! ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

Thank you for your interest in Villa Turaman! 🏡

I would like to share a helpful tip on how you can make your booking more cost-effective. For upcoming trips, we have enabled a special option: "Non-refundable booking with a 10% discount".

💡 How it works & Platform rule:
This discount is automatically displayed by the system only if your check-out date is within the next 60 days from today.

When booking through the standard search on the platform, you will be presented with two options:

🔹 Standard Rate: regular cancellation policies apply (giving you flexibility if your plans change).

🔹 10% Discount Rate: you receive a guaranteed discount off the base price, but the booking becomes non-refundable.

🎯 Which option to choose?

If your plans are firm and your stay is within the next two months, feel free to choose the discounted rate to save on your booking!

If you need flexibility or your check-out date is more than 60 days away, we recommend selecting the standard rate.

I will be happy to answer any questions and wish you a wonderful trip! ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Villa Turaman'a gösterdiğiniz ilgi için teşekkür ederiz! 🏡

Rezervasyonunuzu nasıl daha avantajlı hale getirebileceğiniz konusunda sizinle faydalı bir ipucu paylaşmak isterim. Yakın tarihlerdeki konaklamalar için özel olarak "%10 İndirimli İade Edilemez Rezervasyon" seçeneğini aktif hale getirdik.

💡 Nasıl Çalışır ve Platform Kuralı:
Bu indirim, sistem tarafından yalnızca çıkış tarihiniz bugünden itibaren önümüzdeki 60 gün içinde yer alıyorsa otomatik olarak gösterilir.

Platform üzerinden arama yapıp rezervasyon adımına geçtiğinizde sistem size iki seçenek sunacaktır:

🔹 Standart Tarife: Normal iptal koşulları geçerlidir (planlarınız değişirse esneklik sağlar).

🔹 %10 İndirimli Tarife: Taban fiyattan garantili %10 indirim alırsınız, ancak ödeme iade edilemez hale gelir.

🎯 Hangisini Seçmelisiniz?

Planlarınız kesinse ve konaklamanız önümüzdeki 2 ay içindeyse, bütçenize katkı sağlamak için indirimli tarife seçeneğini tercih edebilirsiniz!

Esnekliğe ihtiyacınız varsa veya çıkış tarihiniz 60 günden daha ilerideyse, standart tarifeyi kullanmanızı öneririz.

Her türlü sorunuzu yanıtlamaktan memnuniyet duyar, harika bir seyahat dilerim! ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },
  {
    id: '1.2_budget_price',
    stageId: 'stage_1',
    title: {
      ru: '1.2. Работа с ценой и вопросы по бюджету',
      en: '1.2. Price & budget evaluation',
      tr: '1.2. Fiyat ve Bütçe Değerlendirmesi'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Благодарю за интерес к Villa Turaman! Надеюсь, у вас всё отлично. ☀️

Мы всегда стараемся сделать отдых наших гостей максимально приятным и комфортным. Если вас смущает текущая стоимость или у вас есть определенный бюджет на эту поездку, подскажите, пожалуйста, какой ориентир по цене был бы для вас комфортным? 💡

С удовольствием попробую подобрать индивидуальное решение или обсудить возможные условия! ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

Thank you for your interest in Villa Turaman! I hope you are doing great. ☀️

We always strive to make our guests' stay as enjoyable and comfortable as possible. If you have a specific budget in mind for these dates or are evaluating the price, please feel free to share what target rate would work best for you. 💡

I would be happy to see if we can offer a customized option or discuss flexible terms! ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Villa Turaman'a gösterdiğiniz ilgi için teşekkür ederiz! Umarım her şey yolundadır. ☀️

Misafirlerimize her zaman en konforlu ve keyifli tatil deneyimini sunmaya çalışıyoruz. Bu tarihler için aklınızda belirli bir bütçe varsa veya fiyata dair bir değerlendirme yapıyorsanız, sizin için nasıl bir rakamın uygun olacağını paylaşabilir misiniz? 💡

Size özel bir teklif oluşturup oluşturamayacağımızı memnuniyetle değerlendirmek isterim! ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },
  {
    id: '1.3_early_booking_expiry',
    stageId: 'stage_1',
    title: {
      ru: '1.3. Напоминание об истечении Раннего бронирования',
      en: '1.3. Early bird discount expiration reminder',
      tr: '1.3. Erken Rezervasyon İndirimi Hatırlatması'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Надеюсь, у вас всё отлично! ☀️

Хочу мягко напомнить о вашем запросе на бронирование Villa Turaman. Ранее вы оформили заявку с выгодой по акции «Раннее бронирование».

⏳ Обратите внимание:
Скидка за раннее бронирование действует строго до даты за 2 месяца до заезда. Начиная с завтрашнего дня специальное предложение начнет последовательно истекать для выбранных вами дат.

Если вы планируете отдых на нашей вилле, рекомендуем подтвердить бронирование сегодня, чтобы зафиксировать самую выгодную стоимость! 💡

Буду рад ответить на любые вопросы и помочь с оформлением. Отличного вам дня! ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

I hope you are doing great! ☀️

I just wanted to gently follow up regarding your booking request for Villa Turaman. You previously submitted a request with our Early Bird discount applied.

⏳ Please note:
Our early booking discount is valid up to 2 months prior to the check-in date. Starting tomorrow, the discount will begin to expire incrementally for your selected dates.

If you are still planning your stay with us, I recommend finalizing your reservation today to lock in the best available rate! 💡

I will be happy to answer any questions and help confirm your stay. Have a wonderful day! ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Umarım iyisinizdir! ☀️

Villa Turaman için yaptığınız rezervasyon talebi hakkında nazikçe bir hatırlatma yapmak istedim. Daha önce "Erken Rezervasyon" indirimi ile bir talep oluşturmuştunuz.

⏳ Lütfen dikkat:
Erken rezervasyon indirimimiz, giriş tarihine 2 ay kalana kadar geçerlidir. Yarından itibaren indirim, seçtiğiniz tarihler için kademeli olarak sona ermeye başlayacaktır.

Villamızda konaklamayı planlıyorsanız, en uygun fiyatı garantilemek adına rezervasyonunuzu bugün tamamlamanızı tavsiye ederim! 💡

Sorularınızı yanıtlamaktan ve rezervasyonunuzu onaylamanıza yardımcı olmaktan memnuniyet duyarım. Harika bir gün dilerim! ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },

  // --- ЭТАП 2: ПОДТВЕРЖДЕНИЕ И ВОПРОСЫ ПО ЖИЛЬЮ ---
  {
    id: '2.1_booking_confirmed',
    stageId: 'stage_2',
    title: {
      ru: '2.1. Подтверждение бронирования',
      en: '2.1. Booking confirmation',
      tr: '2.1. Rezervasyon Onayı'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Поздравляем, ваше бронирование Villa Turaman успешно подтверждено! 🥳 Спасибо, что выбрали именно нас для своего отдыха.

🔑 Код подтверждения: [CONFIRMATION_CODE]
📅 Период проживания: [CHECKIN_DATE], [CHECKIN_TIME] - [CHECKOUT_DATE], [CHECKOUT_TIME]

Если у вас возникнут вопросы по поездке или понадобятся рекомендации по местным ресторанам, пляжам и достопримечательностям : я всегда на связи и с радостью помогу. 📍✨

С нетерпением ждём вас в гости!

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

Congratulations, your booking for Villa Turaman has been successfully confirmed! 🥳 Thank you for choosing our villa for your vacation.

🔑 Confirmation Code: [CONFIRMATION_CODE]
📅 Dates of Stay: [CHECKIN_DATE], [CHECKIN_TIME] - [CHECKOUT_DATE], [CHECKOUT_TIME]

If you have any questions about your trip or need recommendations for local restaurants, beaches, and attractions, please feel free to reach out anytime. I am always happy to help! 📍✨

We look forward to welcoming you!

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Tebrikler, Villa Turaman rezervasyonunuz başarıyla onaylandı! 🥳 Tatiliniz için villamızı tercih ettiğiniz için çok teşekkür ederiz.

🔑 Onay Kodunuz: [CONFIRMATION_CODE]
📅 Konaklama Tarihleri: [CHECKIN_DATE], [CHECKIN_TIME] - [CHECKOUT_DATE], [CHECKOUT_TIME]

Seyahatinizle ilgili sorularınız olursa veya yerel restoranlar, plajlar ve gezilecek yerler hakkında tavsiyeye ihtiyaç duyarsanız her zaman iletişimdeyiz. Size yardımcı olmaktan memnuniyet duyarım. 📍✨

Sizi ağırlamayı sabırsızlıkla bekliyoruz!

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },
  {
    id: '2.2_top_floor_clarification',
    stageId: 'stage_2',
    title: {
      ru: '2.2. Разъяснение по закрытому верхнему этажу',
      en: '2.2. Clarification on closed top floor',
      tr: '2.2. Kapalı Üst Kat Açıklaması'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Спасибо за понимание и за то, что открыто поделились своими мыслями. Нам жаль, что возникла ситуация, не совпавшая с вашими ожиданиями.

Самый верхний (3-й) этаж используется как закрытое служебное/складское помещение для личных вещей владельцев. По этой причине он закрыт на ключ и ни при каких бронированиях не входит в арендуемую жилую площадь. В нашем объявлении на [BOOKING_PLATFORM_NAME] количество доступных комнат, ванных и вместимость виллы указаны строго с учетом доступных для проживания этажей.

При этом просторный балкон на 2-м этаже, терраса у бассейна и сад являются очень комфортными, приватными и отличными местами как для утреннего загара, так и для отдыха в течение всего дня.

Мы с нетерпением ждем возможности принять вас и вашу семью на высшем уровне. Если у вас возникнут другие вопросы или пожелания, пожалуйста, пишите нам! ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

Thank you for your understanding and for openly sharing your thoughts with us. We are sorry that this situation did not fully align with your expectations.

The top (3rd) floor is used as a private storage and service area for the owners' personal belongings. For this reason, it remains locked and is never included in the rentable living area for any reservation. Our listing on [BOOKING_PLATFORM_NAME] accurately states the number of accessible bedrooms, bathrooms, and maximum guest capacity based strictly on the living areas available to guests.

At the same time, the spacious balcony on the 2nd floor, the pool terrace, and the garden provide very comfortable, private, and wonderful spaces for both morning sunbathing and relaxing throughout the day.

We look forward to hosting you and your family at the highest level. If you have any further questions or requests, please feel free to message us anytime! ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Anlayışınız ve düşüncelerinizi bizimle açıkça paylaştığınız için teşekkür ederiz. Beklentilerinizle tam olarak örtüşmeyen bir durum oluştuğu için üzgünüz.

En üst (3.) kat, mülk sahiplerinin kişisel eşyalarının bulunduğu kapalı bir depo/servis alanı olarak kullanılmaktadır. Bu nedenle kilitlidir ve hiçbir rezervasyonda kiralanabilir yaşam alanına dahil edilmez. [BOOKING_PLATFORM_NAME] üzerindeki ilanımızda yer alan oda, banyo sayısı ve konaklama kapasitesi, yalnızca misafirlerin kullanımına açık olan katlar dikkate alınarak eksiksiz şekilde belirtilmiştir.

Bununla birlikte, 2. kattaki geniş balkon, havuz terası ve bahçe; hem sabah güneşlenmek hem de gün boyu dinlenmek için son derece konforlu, özel ve keyifli alanlardır.

Sizi ve ailenizi en iyi şekilde ağırlamayı sabırsızlıkla bekliyoruz. Başka bir sorunuz veya talebiniz olursa lütfen bize yazmaktan çekinmeyin! ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },
  {
    id: '2.3_transfer_assistance',
    stageId: 'stage_2',
    title: {
      ru: '2.3. Помощь по организации трансфера',
      en: '2.3. Airport transfer assistance',
      tr: '2.3. Transfer Hizmeti Bilgilendirmesi'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Благодарю за обращение! Уточняю информацию по поводу трансфера из аэропорта. 🚗✈️

Мы не осуществляем трансфер своими силами, но всегда рады помочь нашим гостям с его организацией. Я могу предоставить вам прямые контакты надежной и проверенной транспортной компании, чтобы вы могли заранее договориться о комфортной поездке.

Пожалуйста, сообщите, если вам нужны их контакты : с удовольствием ими поделюсь! ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

Thank you for reaching out! Regarding your inquiry about the airport transfer: 🚗✈️

While we do not provide transfer services directly, we are always happy to assist our guests with organizing transportation. I can share the direct contact details of a reliable and trusted transfer company so you can arrange a comfortable ride in advance.

Please let me know if you would like their contact information, and I will be glad to share it with you! ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Havalimanı transferi ile ilgili sorunuz için teşekkür ederim. 🚗✈️

Villamıza transfer hizmetini doğrudan biz sunmuyoruz, ancak misafirlerimize organizasyon konusunda yardımcı olmaktan her zaman mutluluk duyarız. Konforlu bir yolculuk için önceden iletişime geçebileceğiniz güvenilir bir transfer şirketinin doğrudan iletişim bilgilerini sizinle paylaşabilirim.

İletişim bilgilerini isterseniz lütfen bana bildirin, memnuniyetle iletirim! ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },
  {
    id: '2.4_email_receipt_confirmation',
    stageId: 'stage_2',
    title: {
      ru: '2.4. Подтверждение получения письма',
      en: '2.4. Email receipt confirmation',
      tr: '2.4. E-posta Alındı Onayı'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Прошу прощения за повторное уведомление : это автоматическое сообщение системы. 🤖

Хочу подтвердить, что я успешно получил ваше письмо на электронную почту. Большое спасибо за предоставленную информацию! 📧✨

С нетерпением жду встречи с вами на вилле!

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

Apologies for the duplicate notification: this is an automated system message. 🤖

I am writing to confirm that I have safely received your email. Thank you very much for providing the information! 📧✨

I look forward to welcoming you to the villa!

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Tekrar mesaj gönderdiğim için özür dilerim, bu otomatik bir sistem bildirimidir. 🤖

E-postanızı aldığımı onaylamak istedim. Paylaştığınız bilgiler için çok teşekkür ederim! 📧✨

Sizi villamızda ağırlamayı sabırsızlıkla bekliyorum!

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },

  // --- ЭТАП 3: ПОДГОТОВКА К ЗАЕЗДУ ---
  {
    id: '3.1_kbs_registration',
    stageId: 'stage_3',
    title: {
      ru: '3.1. Запрос данных для системы регистрации KBS (Обновленный)',
      en: '3.1. Turkish KBS identity reporting request',
      tr: '3.1. KBS Kimlik Bildirim Sistemi Veri Talebi'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Надеюсь, у вас всё отлично! Ваша поездка на Villa Turaman уже совсем близко. 🌴

🔑 Код подтверждения: [CONFIRMATION_CODE]
📅 Период проживания: [CHECKIN_DATE], [CHECKIN_TIME] - [CHECKOUT_DATE], [CHECKOUT_TIME]

В соответствии с законодательством Турции нам необходимо зарегистрировать всех гостей в официальной системе учёта населения. Пожалуйста, отправьте данные всех проживающих в текстовом виде (без фото и скриншотов документов) на нашу электронную почту 📧 villaturaman@gmail.com или прямо в этом чате.

🇹🇷 Для граждан Турции (T.C. Vatandaşları için):
❗ Обязательно для гостя, оформившего бронирование на платформе: Номер телефона, адрес электронной почты и домашний почтовый адрес.

* Имя и фамилия (Adı Soyadı)
* Номер T.C. Kimlik
* Дата рождения
* 🚗 Если вы приедете на автомобиле: Государственный номер автомобиля и имя владельца

🌍 Для иностранных гостей:
❗ Обязательно для гостя, оформившего бронирование на платформе: Номер телефона, адрес электронной почты и домашний почтовый адрес.

* Имя и фамилия (точно как в загранпаспорте)
* Номер загранпаспорта
* Дата рождения
* Гражданство
* Пол
* Ожидаемое время заезда и выезда
* 🚗 Если вы приедете на автомобиле: Государственный номер автомобиля и имя владельца

Огромное спасибо за понимание и содействие! Если возникнут вопросы, я всегда на связи. ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

I hope you are doing great! Your trip to Villa Turaman is just around the corner. 🌴

🔑 Confirmation Code: [CONFIRMATION_CODE]
📅 Dates of Stay: [CHECKIN_DATE], [CHECKIN_TIME] - [CHECKOUT_DATE], [CHECKOUT_TIME]

In accordance with Turkish regulations, we are required to register all guests in the official identity reporting system. Please send the details for all staying guests in text format (without photos or document screenshots) to our email 📧 villaturaman@gmail.com or directly in this chat.

🇹🇷 For Turkish Citizens (T.C. Vatandaşları için):
❗ Mandatory for the guest who made the booking on the platform: Phone number, email address, and home postal address.

* Full name (Adı Soyadı)
* T.C. Kimlik Number
* Date of birth
* 🚗 If arriving by car: Vehicle license plate number and owner's name

🌍 For Foreign Guests:
❗ Mandatory for the guest who made the booking on the platform: Phone number, email address, and home postal address.

* Full name (exactly as shown in passport)
* Passport number
* Date of birth
* Citizenship
* Gender
* Expected check-in and check-out time
* 🚗 If arriving by car: Vehicle license plate number and owner's name

Thank you very much for your understanding and cooperation! If you have any questions, I am always here to help. ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Umarım iyisinizdir! Villa Turaman tatiliniz çok yaklaştı. 🌴

🔑 Onay Kodunuz: [CONFIRMATION_CODE]
📅 Konaklama Tarihleri: [CHECKIN_DATE], [CHECKIN_TIME] - [CHECKOUT_DATE], [CHECKOUT_TIME]

Türkiye Cumhuriyeti mevzuatı gereğince, tüm misafirlerimizi resmi Kimlik Bildirim Sistemi'ne kaydetmemiz gerekmektedir. Lütfen konaklayacak tüm kişilerin bilgilerini metin olarak (belge fotoğrafı veya ekran görüntüsü olmadan) 📧 villaturaman@gmail.com e-posta adresimize veya bu sohbet üzerinden iletiniz.

🇹🇷 T.C. Vatandaşları için:
❗ Platform üzerinden rezervasyonu yapan misafir için zorunludur: Telefon numarası, e-posta adresi ve ev posta adresi.

* Adı ve Soyadı
* T.C. Kimlik Numarası
* Doğum Tarihi
* 🚗 Araç ile gelecekseniz: Araç plakası ve araç sahibinin adı soyadı

🌍 Yabancı Misafirler için:
❗ Platform üzerinden rezervasyonu yapan misafir için zorunludur: Telefon numarası, e-posta adresi ve ev posta adresi.

* Adı ve Soyadı (pasaportta yazdığı şekliyle)
* Pasaport Numarası
* Doğum Tarihi
* Uyruk
* Cinsiyet
* Tahmini giriş ve çıkış saati
* 🚗 Araç ile gelecekseniz: Araç plakası ve araç sahibinin adı soyadı

Anlayışınız ve iş birliğiniz için çok teşekkür ederiz! Sorularınız olursa her zaman iletişimdeyiz. ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },
  {
    id: '3.2_address_geolocation',
    stageId: 'stage_3',
    title: {
      ru: '3.2. Адрес и ссылка на геолокацию Google Maps',
      en: '3.2. Address & Google Maps link',
      tr: '3.2. Adres ve Google Maps Konum Bağlantısı'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Ниже направляю адрес и ссылку на Google Maps с локацией нашей виллы:

📍 Адрес: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla
📍 Ссылка на геолокацию: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9

Когда вы выедете в дорогу, пожалуйста, дайте знать, и мы будем готовы встретить вас к вашему приезду. Заранее желаем хорошего пути! ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

Below you will find the address and Google Maps link with the location of our villa:

📍 Address: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla
📍 Geolocation Link: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9

When you hit the road, please let us know, and we will be ready to welcome you upon your arrival. Wishing you a safe journey ahead! ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Aşağıda villamızın adresini ve Google Maps konum bağlantısını bulabilirsiniz:

📍 Adres: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla
📍 Konum Bağlantısı: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9

Yola çıktığınızda lütfen bize haber verin; varışınızda sizi karşılamak için hazır olacağız. Şimdiden iyi yolculuklar dileriz! ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },
  {
    id: '3.3_checkin_time_coordination',
    stageId: 'stage_3',
    title: {
      ru: '3.3. Согласование времени заезда: ранний / поздний заезд',
      en: '3.3. Early & late check-in coordination',
      tr: '3.3. Erken ve Geç Giriş Saati Planlaması'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Заранее желаем хорошей дороги нашим гостям! 🚗💨

Что касается времени заезда:

🌙 Заезд после [CHECKIN_TIME]: Для нас это не создаст абсолютно никаких проблем. В зависимости от ситуации на дороге вы можете приехать в любое удобное время, мы будем готовы вас встретить.

☀️ Ранний заезд до [CHECKIN_TIME]: Из-за выезда предыдущих гостей и проведения тщательной уборки и подготовки стандартное время заезда : [CHECKIN_TIME]. Однако если в день вашего приезда вилла освободится и будет готова раньше, мы с радостью заселим вас раньше.

Когда вы выедете в дорогу, пожалуйста, сообщите нам примерное время прибытия, и мы сделаем все возможное, чтобы помочь вам в зависимости от готовности виллы! ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

We wish our guests a smooth and safe trip in advance! 🚗💨

Regarding the check-in time:

🌙 Check-in after [CHECKIN_TIME]: This is absolutely no problem for us. Depending on road and traffic conditions, you can arrive at any time convenient for you, and we will be ready to welcome you.

☀️ Early check-in before [CHECKIN_TIME]: Due to previous guest check-outs and the thorough cleaning and preparation process, our standard check-in time is [CHECKIN_TIME]. However, if the villa becomes available and ready earlier on your arrival day, we will be delighted to check you in earlier.

Once you hit the road, please let us know your estimated arrival time, and we will do everything possible to accommodate you depending on the villa's readiness! ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Misafirlerimize şimdiden iyi ve konforlu yolculuklar dileriz! 🚗💨

Giriş saati ile ilgili olarak:

🌙 [CHECKIN_TIME] Sonrası Giriş: Bu durum bizim için kesinlikle hiçbir sorun teşkil etmez. Yol durumuna bağlı olarak dilediğiniz saatte gelebilirsiniz, sizi karşılamak için hazır olacağız.

☀️ [CHECKIN_TIME] Öncesi Erken Giriş: Önceki misafirlerin çıkışı ve evin detaylı temizlik ile hazırlık süreçleri nedeniyle standart giriş saatimiz [CHECKIN_TIME]'dir. Ancak varış gününüzde villa daha erken boşalır ve hazır hale gelirse, sizi daha erken ağırlamaktan mutluluk duyarız.

Yola çıktığınızda lütfen tahmini varış saatinizi bize bildirin; villanın hazırlık durumuna göre size yardımcı olmak için elimizden gelen her şeyi yapacağız! ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },
  {
    id: '3.4_checkin_instructions',
    stageId: 'stage_3',
    title: {
      ru: '3.4. Стандартная инструкция по заселению и Wi-Fi',
      en: '3.4. Check-in instructions & Wi-Fi',
      tr: '3.4. Giriş Talimatları ve Wi-Fi Bilgileri'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Надеюсь, у вас всё отлично! Ваша поездка на Villa Turaman уже совсем близко. 🌴

🔑 Код подтверждения: [CONFIRMATION_CODE]
📅 Период проживания: [CHECKIN_DATE], [CHECKIN_TIME] - [CHECKOUT_DATE], [CHECKOUT_TIME]

Вы можете заселиться в жилье в любое время после [CHECKIN_TIME], [CHECKIN_DATE].

📍 Адрес: Dalyan, [ADDRESS]
🚪 Способ заселения: [CHECKIN_METHOD]

📶 Данные Wi-Fi:

Сеть: [WIFI_NAME]

Пароль: [WIFI_PASSWORD]

Если в процессе заезда у вас возникнут любые вопросы, пожалуйста, сразу свяжитесь со мной. Легкой дороги и прекрасного отдыха! ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

I hope you are doing great! Your trip to Villa Turaman is just around the corner. 🌴

🔑 Confirmation Code: [CONFIRMATION_CODE]
📅 Dates of Stay: [CHECKIN_DATE], [CHECKIN_TIME] - [CHECKOUT_DATE], [CHECKOUT_TIME]

You can check in anytime after [CHECKIN_TIME], [CHECKIN_DATE].

📍 Address: Dalyan, [ADDRESS]
🚪 Check-in Method: [CHECKIN_METHOD]

📶 Wi-Fi Details:

Network Name: [WIFI_NAME]

Password: [WIFI_PASSWORD]

If you have any questions during check-in, please feel free to contact me directly. Safe travels and have a wonderful stay! ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Umarım iyisinizdir! Villa Turaman tatiliniz çok yaklaştı. 🌴

🔑 Onay Kodunuz: [CONFIRMATION_CODE]
📅 Konaklama Tarihleri: [CHECKIN_DATE], [CHECKIN_TIME] - [CHECKOUT_DATE], [CHECKOUT_TIME]

[CHECKIN_DATE], [CHECKIN_TIME] itibarıyla dilediğiniz saatte giriş yapabilirsiniz.

📍 Adres: Dalyan, [ADDRESS]
🚪 Giriş Yöntemi: [CHECKIN_METHOD]

📶 Wi-Fi Bilgileri:

Ağ Adı: [WIFI_NAME]

Şifre: [WIFI_PASSWORD]

Giriş esnasında herhangi bir sorunuz olursa lütfen benimle iletişime geçmekten çekinmeyin. İyi yolculuklar ve harika bir tatil dilerim! ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },
  {
    id: '3.5_welcome_guide_dalyan',
    stageId: 'stage_3',
    title: {
      ru: '3.5. Приветственный гид и путеводитель по Дальяну',
      en: '3.5. Welcome guide to Dalyan',
      tr: '3.5. Dalyan Hoş Geldiniz Rehberi'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋 🌴✨ Делюсь персональным гидом по Дальяну:

🏡 1. Адрес виллы:
Адрес: Villa Turaman, Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla
Google Maps: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9

🚗 2. Трансфер:
Taxi Transfer: +90 543 335 80 70 - Ahmet [SAYILAN TURİZM].

🚤 3. Прогулка на лодке по реке:
Капитан Адам: +90 544 588 58 09 [персональные речные экскурсии].

🍽️ Гастрономия Дальяна:
🌸 Çiçek Restaurant: Любимый семейный ресторан. Рекомендую: бараньи ребрышки [Kuzu Pirzola], сибас на гриле, салат Rokka и айран.
Адрес: Dalyan, Rodoslu Yaşar Sünger Sk, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=14955012417485225116

🎱 Mavi Bar and Restaurant: Прямо через дорогу! Бильярд, бассейн, напитки и кухня.
Адрес: Dalyan, Özalp Sk. No: 14, 48840 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=12893448618633420855

🍺 Yanık Gastro Pub: Крафтовое пиво, коктейли и бургеры на пешеходной улице.
Адрес: Dalyan, Maraş Cd. No:42, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=9741858985725169689

🌅 The Pier Dalyan: Ресторан у воды с видом на подсвеченные гробницы. Совет: бронируйте столик у реки на вечер!
Адрес: Dalyan, Maraş Cd. No: 60, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=8665819764601302226

🏛️ История и Античность:
🗿 Гробницы Кауноса [Kral Kaya Mezarları]: Наскальные ликийские гробницы IV в. до н.э. [лучший вид с лодки или противоположного берега].
Адрес: Çandır, 48840 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=14386902661457998742

🏛️ Древний Каунос [Kaunos Antik Kenti]: Античный город с амфитеатром [переправа через реку на лодочке].
Адрес: Dalyan, 48800 Ortaca/Köyceğiz/Muğla
Google Maps: https://maps.google.com/?cid=10349596986479033074

🐢 Природа и Пляжи:
🏖️ Пляж Изтузу [İztuzu Plajı]: 4.5 км песчаной косы, заповедник черепах Каретта-Каретта. Доезд на машине или лодке-долмуше.
Адрес: Gökbel, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=658248733736535804

🏥 DEKAMER: Центр спасения черепах на пляже Изтузу [вход бесплатный].
Адрес: Gökbel, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=14102698259453109145

⛵ Озеро Кёйджегиз: Идеальное место для вечернего круиза на закате.
Адрес: Köyceğiz, Muğla
Google Maps: https://maps.google.com/?cid=8614170710005189793

♨️ Спа и Смотровые площадки:
🌋 Султание [Sultaniye Kaplıcaları]: Целебные грязи и горячие источники [+39°C] у озера.
Адрес: Sultaniye, 48800 Köyceğiz/Muğla
Google Maps: https://maps.google.com/?cid=8749883205667501071

⛰️ Гора Радар [Radar Tepesi]: Лучшая панорамная площадка с видом на косу Изтузу [приезжайте к закату!].
Адрес: Gökbel, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=15421430292199163844

Всегда на связи! Легкой дороги и отличного отдыха! ✨
С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello, [FIRST_NAME]! 👋 🌴✨ Sharing a personal guide to Dalyan:

🏡 1. Villa Address:
Address: Villa Turaman, Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla
Google Maps: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9

🚗 2. Transfer:
Taxi Transfer: +90 543 335 80 70 - Ahmet [SAYILAN TURİZM].

🚤 3. River Boat Trip:
Captain Adam: +90 544 588 58 09 [private river excursions].

🍽️ Dalyan Gastronomy:
🌸 Çiçek Restaurant: A favorite family restaurant. I recommend: lamb chops [Kuzu Pirzola], grilled sea bass, Rokka salad, and ayran.
Address: Dalyan, Rodoslu Yaşar Sünger Sk, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=14955012417485225116

🎱 Mavi Bar and Restaurant: Right across the street! Billiards, pool, drinks, and food.
Address: Dalyan, Özalp Sk. No: 14, 48840 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=12893448618633420855

🍺 Yanık Gastro Pub: Craft beer, cocktails, and burgers on the pedestrian street.
Address: Dalyan, Maraş Cd. No:42, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=9741858985725169689

🌅 The Pier Dalyan: Waterfront restaurant with a view of the illuminated tombs. Tip: book a table by the river for the evening!
Address: Dalyan, Maraş Cd. No: 60, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=8665819764601302226

🏛️ History and Antiquity:
🗿 Kaunos Tombs [Kral Kaya Mezarları]: Rock-cut Lycian tombs from the 4th century BC [best view from a boat or the opposite bank].
Address: Çandır, 48840 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=14386902661457998742

🏛️ Ancient Kaunos [Kaunos Antik Kenti]: Ancient city with an amphitheater [cross the river by a small boat].
Address: Dalyan, 48800 Ortaca/Köyceğiz/Muğla
Google Maps: https://maps.google.com/?cid=10349596986479033074

🐢 Nature and Beaches:
🏖️ Iztuzu Beach [İztuzu Plajı]: 4.5 km of sand spit, a sanctuary for Caretta-Caretta turtles. Reachable by car or dolmuş boat.
Address: Gökbel, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=658248733736535804

🏥 DEKAMER: Turtle rescue center on Iztuzu Beach [free entry].
Address: Gökbel, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=14102698259453109145

⛵ Köyceğiz Lake: Perfect spot for an evening sunset cruise.
Address: Köyceğiz, Muğla
Google Maps: https://maps.google.com/?cid=8614170710005189793

♨️ Spa and Viewpoints:
🌋 Sultaniye [Sultaniye Kaplıcaları]: Healing muds and hot thermal springs [+39°C] by the lake.
Address: Sultaniye, 48800 Köyceğiz/Muğla
Google Maps: https://maps.google.com/?cid=8749883205667501071

⛰️ Radar Hill [Radar Tepesi]: The best panoramic viewpoint overlooking the Iztuzu sand spit [come by sunset!].
Address: Gökbel, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=15421430292199163844

Always in touch! Have an easy journey and a great holiday! ✨
Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba, [FIRST_NAME]! 👋 🌴✨ Dalyan özel rehberimizi paylaşıyorum:

🏡 1. Villa Adresi:
Adres: Villa Turaman, Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla
Google Maps: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9

🚗 2. Transfer:
Taksi Transfer: +90 543 335 80 70 - Ahmet [SAYILAN TURİZM].

🚤 3. Nehir Tekne Turu:
Kaptan Adam: +90 544 588 58 09 [özel nehir turları].

🍽️ Dalyan Gastronomisi:
🌸 Çiçek Restaurant: En sevdiğimiz aile işletmesi. Tavsiye: Kuzu Pirzola, ızgara levrek, Roka Salatası ve ayran.
Adres: Dalyan, Rodoslu Yaşar Sünger Sk, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=14955012417485225116

🎱 Mavi Bar and Restaurant: Evin hemen karşısında! Bilardo, havuz, içecekler ve yemekler.
Adres: Dalyan, Özalp Sk. No: 14, 48840 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=12893448618633420855

🍺 Yanık Gastro Pub: Yürüyüş caddesinde craft biralar, kokteyller ve burgerler.
Adres: Dalyan, Maraş Cd. No:42, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=9741858985725169689

🌅 The Pier Dalyan: Işıklandırılmış Kaya Mezarları karşısında nehir kenarı restoranı. İpucu: Akşam için nehir kenarı masa rezerve edin!
Adres: Dalyan, Maraş Cd. No: 60, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=8665819764601302226

🏛️ Tarih ve Antik Çağ:
🗿 Kral Kaya Mezarları: M.Ö. 4. yüzyıldan kalma kaya mezarları [tekneden veya karşı kıyıdan en iyi manzara].
Adres: Çandır, 48840 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=14386902661457998742

🏛️ Kaunos Antik Kenti: Amfitiyatrosu olan antik kent [nehrin karşısına sandal ile geçilir].
Adres: Dalyan, 48800 Ortaca/Köyceğiz/Muğla
Google Maps: https://maps.google.com/?cid=10349596986479033074

🐢 Doğa ve Plajlar:
🏖️ İztuzu Plajı: Caretta Caretta kaplumbağalarının koruma alanı 4.5 km kumsal. Araçla veya dolmuş tekneyle ulaşım.
Adres: Gökbel, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=658248733736535804

🏥 DEKAMER: İztuzu Plajı Deniz Kaplumbağaları Kurtarma Merkezi [giriş ücretsiz].
Adres: Gökbel, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=14102698259453109145

⛵ Köyceğiz Gölü: Gün batımı tekne turları için harika bir rota.
Adres: Köyceğiz, Muğla
Google Maps: https://maps.google.com/?cid=8614170710005189793

♨️ Kaplıcalar ve Seyir Tepeleri:
🌋 Sultaniye Kaplıcaları: Göl kenarında şifalı çamurlar ve sıcak termal sular [+39°C].
Adres: Sultaniye, 48800 Köyceğiz/Muğla
Google Maps: https://maps.google.com/?cid=8749883205667501071

⛰️ Radar Tepesi: İztuzu kumsalını kuşbakışı gören en iyi seyir noktası [gün batımına doğru gelin!].
Adres: Gökbel, 48600 Ortaca/Muğla
Google Maps: https://maps.google.com/?cid=15421430292199163844

Her zaman iletişimdeyiz! İyi yolculuklar ve harika bir tatil dilerim! ✨
Saygılarımla, Aleksei Znamenskii. Villa Turaman.`
    }
  },

  // --- ЭТАП 4: ВО ВРЕМЯ ПРОЖИВАНИЯ ---
  {
    id: '4.1_stay_care_checkin',
    stageId: 'stage_4',
    title: {
      ru: '4.1. Забота о госте во время проживания',
      en: '4.1. Guest care check-in during stay',
      tr: '4.1. Konaklama Sırasında Misafir Memnuniyeti'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Надеюсь, ваш отдых проходит замечательно и вы отлично проводите время! ☀️

Решил просто уточнить, всё ли у вас хорошо и комфортно ли на вилле? Если возникли любые вопросы по технике, бассейну или вам нужны новые рекомендации по ресторанам и интересным местам : смело пишите прямо в этот чат. С удовольствием на всё отвечу и помогу!

Приятного вам дня и хорошего отдыха! ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

I hope you are having a wonderful time and enjoying your stay! ☀️

Just checking in to see if everything is going smoothly and if you have everything you need at the villa. If you have any questions about the amenities, pool, or if you need recommendations for restaurants and local spots, please feel free to ask anytime right here in this chat. Always happy to help!

Wishing you a fantastic day ahead! ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Umarım tatiliniz harika geçiyordur ve keyfiniz yerindedir! ☀️

Her şeyin yolunda olup olmadığını ve villada rahat edip etmediğinizi sormak istedim. Evdeki donanımlar, havuz kullanımı veya çevredeki restoran ve gezilecek yer tavsiyeleri ile ilgili bir ihtiyacınız olursa lütfen bu sohbet üzerinden yazmaktan çekinmeyin. Size yardımcı olmaktan memnuniyet duyarım!

Harika bir gün ve keyifli bir tatil dilerim! ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },
  {
    id: '4.2_pool_maintenance_notice',
    stageId: 'stage_4',
    title: {
      ru: '4.2. Уведомление о чистке и обслуживании бассейна',
      en: '4.2. Pool cleaning & maintenance notice',
      tr: '4.2. Havuz Bakımı ve Temizlik Bildirimi'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Надеюсь, вы отлично проводите время и наслаждаетесь отдыхом! ☀️

Завтра в 9:00 я планирую приехать на виллу, чтобы провести плановую чистку бассейна и уборку прилегающей территории. Это необходимо, чтобы вода всегда оставалась идеально чистой и прозрачной для вашего комфорта. 🏊‍♂️✨

Буду очень благодарен, если вы по возможности уберете личные вещи и одежду с шезлонгов и площадки вокруг бассейна до этого времени.

Подскажите, пожалуйста, подходит ли вам это время?

Заранее спасибо за понимание! Желаю вам хорошего дня! ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

I hope you are enjoying your stay! ☀️

Tomorrow at 9:00 AM, I plan to visit the villa to perform scheduled pool maintenance and clean the pool deck area. This ensures the water stays crystal clear and perfectly fresh for your comfort. 🏊‍♂️✨

Could you please kindly collect any personal items and clothing from the sunbeds and pool area beforehand?

Please let me know if this time is convenient for you.

Thank you in advance for your understanding, and have a wonderful day! ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Umarım tatiliniz harika geçiyordur! ☀️

Yarın saat 09:00'da havuz bakımını yapmak ve havuz çevresini temizlemek üzere villaya gelmeyi planlıyorum. Bu işlem, havuz suyunun konaklamanız boyunca pırıl pırıl ve hijyenik kalmasını sağlamak içindir. 🏊‍♂️✨

Rica etsem bu saatten önce havuz çevresindeki ve şezlonglardaki kişisel eşyalarınızı toplamanıza yardımcı olabilir misiniz?

Bu saatin sizin için uygun olup olmadığını bildirirseniz çok sevinirim.

Anlayışınız için şimdiden teşekkür eder, harika bir gün dilerim! ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },

  // --- ЭТАП 5: ВЫЕЗД И ЗАВЕРШЕНИЕ ---
  {
    id: '5.1_checkout_reminder_short',
    stageId: 'stage_5',
    title: {
      ru: '5.1. Напоминание о выезде: Короткое',
      en: '5.1. Check-out reminder (Short)',
      tr: '5.1. Çıkış Hatırlatması (Kısa)'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Надеюсь, вы отлично провели время и получили много ярких впечатлений от отдыха! ☀️

Искренне благодарю вас за то, что остановились в Villa Turaman. Хочу мягко напомнить вам детали выезда:

📅 Дата выезда: [CHECKOUT_DATE]
⏰ Время выезда: [CHECKOUT_TIME]

Ниже приведена краткая инструкция по сдаче виллы и передаче ключей.

Если у вас возникнут вопросы или потребуется помощь с вызовом такси/трансфера, пожалуйста, дайте знать. Желаю вам легкой обратной дороги и всего самого доброго! ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

I hope you had a wonderful stay and enjoyed your time with us! ☀️

Thank you so much for choosing Villa Turaman for your holiday. I would like to kindly remind you of your check-out details:

📅 Check-out Date: [CHECKOUT_DATE]
⏰ Check-out Time: [CHECKOUT_TIME]

Below you will find the check-out instructions and details regarding key handover.

If you have any questions or need assistance with ordering a taxi or transfer, please let me know. Wishing you a safe and pleasant journey home! ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Umarım harika bir tatil geçirmiş ve çok güzel anılar biriktirmişsinizdir! ☀️

Konaklamanız için Villa Turaman'ı tercih ettiğiniz için çok teşekkür ederiz. Çıkış detaylarınızı nazikçe hatırlatmak isterim:

📅 Çıkış Tarihi: [CHECKOUT_DATE]
⏰ Çıkış Saati: [CHECKOUT_TIME]

Evi teslim etme ve anahtar teslimi ile ilgili talimatları aşağıda bulabilirsiniz.

Herhangi bir sorunuz olursa veya taksi/transfer konusunda yardıma ihtiyaç duyarsanız lütfen bana bildirin. Güvenli ve konforlu bir dönüş yolculuğu dilerim! ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  },
  {
    id: '5.2_checkout_checklist',
    stageId: 'stage_5',
    title: {
      ru: '5.2. Напоминание о выезде с чек-листом сдачи виллы',
      en: '5.2. Check-out reminder with full checklist',
      tr: '5.2. Kontrol Listeli Ev Teslim ve Çıkış Bildirimi'
    },
    content: {
      ru: `Здравствуйте, [FIRST_NAME]! 👋

Надеюсь, вы отлично провели время и получили много ярких впечатлений от отдыха! ☀️

Искренне благодарю вас за то, что остановились в Villa Turaman. Хочу мягко напомнить вам детали выезда:

📅 Дата выезда: [CHECKOUT_DATE]
⏰ Время выезда: [CHECKOUT_TIME]

📋 Инструкция по сдаче виллы (Check-out Checklist):

💡 Электричество и кондиционеры: Пожалуйста, выключите все кондиционеры, свет и бытовые приборы.

🪟 Окна и двери: Проверьте, чтобы все окна и балконные двери были плотно закрыты.

🗑️ Мусор: Просим выбросить накопившийся бытовой мусор в уличные контейнеры.

🍽️ Посуда: Загрузите грязную посуду в посудомоечную машину и запустите цикл мойки.

🔑 Передача ключей: [KEY_HANDOVER_INSTRUCTIONS] (например: оставьте ключи в сейфе для ключей / передайте мне лично при встрече).

Если вам потребуется помощь с вызовом такси или трансфера в аэропорт, пожалуйста, дайте знать. Желаю вам легкой обратной дороги и всего самого доброго! ✨

С уважением, Алексей Знаменский. Villa Turaman.`,
      en: `Hello [FIRST_NAME]! 👋

I hope you had a wonderful stay and enjoyed your time with us! ☀️

Thank you so much for choosing Villa Turaman for your holiday. I would like to kindly remind you of your check-out details:

📅 Check-out Date: [CHECKOUT_DATE]
⏰ Check-out Time: [CHECKOUT_TIME]

📋 Check-out Instructions:

💡 Utilities: Please turn off all air conditioners, lights, and electrical appliances.

🪟 Windows & Doors: Ensure all windows and balcony doors are securely closed and locked.

🗑️ Trash: Kindly collect your household trash and dispose of it in the outdoor bins.

🍽️ Dishes: Place any used dishes into the dishwasher and start a cycle.

🔑 Key Handover: [KEY_HANDOVER_INSTRUCTIONS] (e.g., Leave the keys inside the lockbox / Hand them over to me in person).

If you have any questions or need assistance with ordering a taxi or airport transfer, please let me know. Wishing you a safe and pleasant journey home! ✨

Best regards, Aleksei Znamenskii. Villa Turaman.`,
      tr: `Merhaba [FIRST_NAME]! 👋

Umarım harika bir tatil geçirmiş ve çok güzel anılar biriktirmişsinizdir! ☀️

Konaklamanız için Villa Turaman'ı tercih ettiğiniz için çok teşekkür ederiz. Çıkış detaylarınızı nazikçe hatırlatmak isterim:

📅 Çıkış Tarihi: [CHECKOUT_DATE]
⏰ Çıkış Saati: [CHECKOUT_TIME]

📋 Çıkış ve Ev Delivery Talimatları:

💡 Elektrik ve Klimalar: Lütfen tüm klimaları, ışıkları ve elektronik cihazları kapatın.

🪟 Kapı ve Pencereler: Tüm pencere ve balkon kapılarının tam olarak kapatıldığından emin olun.

🗑️ Çöp: Biriken evsel çöplerinizi dışarıdaki çöp konteynerlerine atmanızı rica ederiz.

🍽️ Bulaşıklar: Kirli bulaşıkları bulaşık makinesine yerleştirip yıkama programını başlatın.

🔑 Anahtar Teslimi: [KEY_HANDOVER_INSTRUCTIONS] (Örn: Anahtarları şifreli kutuda bırakın / Bizzat bana teslim edin).

Taksi veya havalimanı transferi konusunda yardıma ihtiyacınız olursa lütfen bana bildirin. Güvenli ve konforlu bir dönüş yolculuğu dilerim! ✨

Saygılarımla, Aleksey Znamenskiy. Villa Turaman.`
    }
  }
];

module.exports = {
  TEMPLATE_STAGES,
  SMART_TEMPLATES
};
