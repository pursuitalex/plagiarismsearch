# ТЗ для Claude — нова сторінка `/about-us`
## PlagiarismSearch — Company / Trust page

**Статус:** готове ТЗ для реалізації після завершення поточного refactor Section Library  
**Дата:** 30.09.2026  
**Мова master-сторінки:** English  
**URL:** `/about-us`  
**Тип сторінки:** Company / Trust / Transparency  
**Пріоритет:** P1  
**Не замінює:** `/why-us` та `/plagiarismsearch-mission-and-core-values`

---

## 0. Важлива залежність перед стартом

Не починай реалізацію `/about-us` на старій версії section markup.

Спочатку завершити та зафіксувати поточну роботу над editor-friendly Section Library / semantic reusable components. Нова `/about-us` повинна використовувати фінальну approved-модель бібліотеки:

- shared CSS / JS;
- editor-friendly semantic markup для reusable sections;
- `data-component` / `data-*` hooks там, де це потрібно;
- centralized templates;
- no duplicated page-level CSS/JS;
- no Tailwind utility soup у тих частинах, які власник буде копіювати/редагувати в CMS;
- no-JS / a11y / reuse / parity rules із поточної архітектури.

Не створювати для `/about-us` окрему альтернативну систему компонентів.

---

# 1. Навіщо створюємо цю сторінку

У нового сайту вже є:

- `/why-us` — сторінка про те, **чому користувачу варто обрати PlagiarismSearch як продукт**;
- `/plagiarismsearch-mission-and-core-values` — сторінка про **місію та принципи**.

Нова `/about-us` повинна виконувати іншу функцію:

> **показати, хто реально стоїть за PlagiarismSearch, як продукт розвивався з 2009 року і які люди сьогодні відповідають за його ключові напрями.**

Це не SEO landing page і не ще одна commercial/product page.

Основні цілі:

1. Реальна company transparency.
2. Trust для individual, institutional та business visitors.
3. Показати реальних людей, а не anonymous software brand.
4. Показати довгу історію продукту через перевірені milestones.
5. Створити сильний company/entity context без маркетингового перебільшення.
6. Дати природні переходи до Mission & Values та Contact.

---

# 2. Чого сторінка НЕ повинна робити

Не перетворювати `/about-us` на:

- копію `/why-us`;
- сторінку переваг plagiarism checker;
- SEO-текст під “plagiarism checker company” чи подібні keywords;
- sales landing з агресивним CTA;
- сторінку з generic corporate phrases;
- “global team” marketing page;
- Careers page;
- сторінку зі stock / fake / AI-generated portraits.

Не використовувати формулювання на кшталт:

- “Meet our passionate team of experts”
- “We are a family”
- “Driven by innovation”
- “World-class team”
- “Global team across X countries”
- “Industry-leading experts”
- “Best-in-class”
- будь-які неперевірені superlatives.

Тон: **людський, спокійний, професійний, фактологічний, product-oriented.**

---

# 3. Фактова база сторінки

Використовувати тільки ці підтверджені факти. Не додавати нові історичні або company claims без окремого підтвердження.

### Основні факти

- PlagiarismSearch запущений у **2009 році**.
- Початково продукт був орієнтований на **студентів**.
- Засновник та власник: **Pavlo Kucheruk**.
- Pavlo активно бере участь у продукті й сьогодні.
- **Oleksandr Kozuliov** працює над технічною частиною продукту з самого початку та відповідає за всю technical side.
- **НЕ називати Oleksandr Kozuliov co-founder.**
- Не створювати юридичних/корпоративних тверджень, яких у цьому ТЗ немає.

### Milestones

- **2009** — PlagiarismSearch launched; initial focus on students.
- **2013** — Plagiarism API.
- **2017** — Moodle integration.
- **2018** — Google Docs integration.
- **2023** — AI text detection.
- **2026** — Canvas integration.

Apple / Google mobile apps у timeline зараз не додавати автоматично. Перед production це може бути окремо переглянуто.

---

# 4. Роль `/about-us` у site architecture

Має бути чітке розведення:

### `/why-us`
**Why choose the product**
- capabilities;
- product advantages;
- user reasons to choose PlagiarismSearch.

### `/about-us`
**Who is behind the product**
- history;
- people;
- responsibilities;
- evolution of the product.

### `/plagiarismsearch-mission-and-core-values`
**Why we work this way**
- mission;
- principles;
- values.

Не дублювати між цими сторінками великі блоки тексту.

---

# 5. Загальний visual direction

Сторінка має залишатися частиною затвердженої PlagiarismSearch design system, але відчуватися **більш editorial / human** за product pages.

### Зберігаємо
- existing typography;
- colors / tokens;
- spacing system;
- buttons;
- header;
- footer;
- shared interaction patterns;
- accessibility standards;
- responsive system.

### Робимо спокійніше
Менше:
- glow;
- product UI mockups;
- animated checker/report visuals;
- product cards;
- conversion-focused banners;
- decorative animation.

Більше:
- whitespace;
- typography;
- portrait photography;
- editorial grid;
- subtle timeline;
- real names / roles / bios.

**Design system — той самий. Character — інший.**

---

# 6. Рекомендована структура сторінки

Оптимально: **6 основних секцій**.

---

## Section 1 — Hero
### Purpose
Одразу пояснити, що це сторінка про компанію та людей, а не product landing.

### Suggested H1 direction
**About PlagiarismSearch**

Subtitle / intro має коротко передати:
- product launched in 2009;
- people have been building and developing it over time;
- сьогодні це значно ширший продукт, ніж початковий student plagiarism checker.

### Design direction
- editorial, confident, minimal;
- без product checker UI;
- без aggressive CTA;
- можна використати композицію з portrait placeholders / team motif, але не fake faces.

### CTA
Hero може взагалі не мати primary sales CTA.

Якщо CTA потрібен — лише neutral:
- `Meet the team`
- або anchor до team section.

---

## Section 2 — The story behind PlagiarismSearch
### Purpose
Коротко дати історію продукту фактами.

### Content logic
Текст повинен передати:

- PlagiarismSearch launched in 2009.
- Initial focus: plagiarism checking for students.
- Product founded by Pavlo Kucheruk.
- Pavlo remains actively involved in product direction.
- Oleksandr Kozuliov has led technical development from the beginning.
- Product later expanded through API, LMS/document integrations and AI detection.

### Important
Не писати “Pavlo and Oleksandr co-founded...”.

Можливий factual direction:

> PlagiarismSearch launched in 2009 as a plagiarism-checking product for students. Founder Pavlo Kucheruk remains actively involved in the product, while Technical Lead Oleksandr Kozuliov has guided its technical development from the beginning.

Це не обов’язково фінальний copy, але зміст має залишитися саме таким.

### Length
2–3 compact paragraphs максимум.

---

## Section 3 — Product timeline
### Working heading direction
**Built and evolving since 2009**

або інший стриманий heading без marketing cliché.

### Milestones
1. **2009** — Launch  
   PlagiarismSearch launches with an initial focus on student plagiarism checking.

2. **2013** — API  
   Plagiarism API becomes available for integrations and external workflows.

3. **2017** — Moodle  
   Moodle integration extends PlagiarismSearch into learning-management workflows.

4. **2018** — Google Docs  
   Google Docs integration brings plagiarism checking closer to document workflows.

5. **2023** — AI Detection  
   AI text detection is added as a separate capability from plagiarism detection.

6. **2026** — Canvas  
   Canvas integration expands LMS support.

### Critical product-truth note
Do not conflate AI-generated text with plagiarism.

AI detection і plagiarism detection — окремі capabilities.

### Design
- clear chronological flow;
- restrained;
- desktop may be horizontal;
- mobile should become vertical naturally;
- no huge decorative timeline that dominates the page;
- no fake numbers or extra milestones.

---

# 7. Team section — головна секція сторінки

## Working heading
**Meet the team**

Можна запропонувати кращий editorial heading, але не використовувати generic “passionate experts” language.

## Team size shown
**9 profiles**

Не писати:
- “team of 9”;
- exact company headcount;
- “small team”;
- “global team of X people”.

Сторінка просто показує core people, яких компанія хоче представити.

---

# 8. Правила team cards

Усі 9 карток мають мати **однакову візуальну вагу**.

Не робити:
- founder card у 2× розмірі;
- leadership row + staff grid;
- різні рівні prominence.

### Кожна card
- portrait placeholder;
- full name;
- role;
- 2–3 sentence short bio;
- LinkedIn icon/link only.

### Photo
На prototype:
- **не генерувати AI/fake portraits**;
- використати neutral portrait placeholders / initials / clear replaceable assets;
- бажаний portrait ratio: приблизно **4:5**;
- structure має бути готова до простої заміни на real photos перед production.

### LinkedIn
Поки:
- placeholder / inactive URL;
- не вигадувати LinkedIn addresses.

Перед production:
- real LinkedIn URL для кожної людини.

Інші social icons не потрібні.

---

# 9. Team — ролі та content direction

## 1. Pavlo Kucheruk
### Role
**Founder & Product Lead**

### Bio direction
- founded PlagiarismSearch;
- remains actively involved;
- product direction;
- priorities;
- major product decisions;
- long-term development.

Не робити його passive owner.

Не вигадувати CEO title, якщо він окремо не підтверджений.

---

## 2. Oleksandr Kozuliov
### Role
**Technical Lead**

### Bio direction
- has worked on the product since the beginning;
- responsible for the full technical side;
- architecture;
- development;
- integrations;
- reliability / technical evolution.

### Critical
**Never call him Co-Founder.**

Можна підкреслювати “from the beginning” / “since the early product”, але не founder status.

---

## 3. Denys Olshtynskyi
### Role
**Senior Software Engineer**

### Bio direction
Показати його як дуже сильного technical contributor через конкретну мову, не через fake seniority claims.

Possible responsibility areas:
- complex engineering challenges;
- backend systems;
- architecture;
- infrastructure;
- technically demanding product work.

Він зараз частково залучений у PlagiarismSearch, тому не створювати враження, що він single owner всієї architecture або головний технічний керівник.

Не використовувати непідтверджені titles:
- Principal Engineer;
- CTO;
- Chief Architect.

---

## 4. Viacheslav Hladun
### Role
**SEO & Growth Lead**

### Bio direction
Роль значно ширша за technical SEO.

Включає:
- organic search strategy;
- analytics;
- site / information architecture;
- content strategy;
- localization strategy;
- product positioning;
- landing page / conversion strategy;
- competitor research;
- coordination of growth-related website work.

Не називати просто “SEO Specialist”.

---

## 5. Viktoriia Bas
### Role
**Customer Success Lead**

### Bio direction
Основна відповідальність за:
- client communication;
- customer support;
- onboarding;
- institutional / business inquiries;
- follow-up;
- helping users navigate product questions.

Вікторія — головна в customer success напрямку.

---

## 6. Melissa Anderson
### Role
**Customer Success Specialist**

### Bio direction
Працює разом із Вікторією й виконує той самий тип customer-facing роботи:
- support;
- user questions;
- onboarding assistance;
- client communication;
- helping users use the product successfully.

Не робити її роль вищою за Customer Success Lead.

---

## 7. Viola Romanovych
### Role
**Business Development & Outreach Specialist**

### Bio direction
Професійно описати:
- lead generation;
- outreach;
- commercial communication;
- partnerships / prospect communication;
- development of new business contacts.

Не використовувати “cold email” / “cold outreach” у public bio.

---

## 8. Tetiana Zoziuk
### Role
**Digital Marketing & Communications Specialist**

### Bio direction
Мультифункціональна marketing role:
- social media;
- outreach;
- link acquisition;
- localization / translations;
- email campaigns;
- communication support.

Не звужувати роль лише до link building або SMM.

Не називати Growth Lead, щоб не створювати конфлікт із SEO & Growth Lead.

---

## 9. Oleksandr Bondarenko
### Role
**Product Designer**

### Bio direction
- UX;
- UI;
- user flows;
- prototyping;
- component / design system;
- turning product requirements into clear interfaces.

Не звужувати його до graphic design.

---

# 10. Team bio length

Усі bios повинні бути приблизно однакової довжини.

Орієнтир:
- 30–55 words;
- 2–3 sentences;
- factual;
- no self-praise;
- no fake credentials;
- no unsupported academic titles.

Всі картки повинні виглядати збалансовано.

---

# 11. Section after Team — how the work connects

Не робити “Departments”.

Не показувати штучну оргструктуру.

Натомість можна зробити compact editorial bridge, який пояснює, що люди вище покривають різні частини життєвого циклу продукту:

- Product direction
- Engineering
- Design & experience
- Customer success
- Growth & communication

### Purpose
Пояснити, як команда працює над продуктом як єдиним system lifecycle, але:
- не показувати exact headcount;
- не створювати fictional departments;
- не робити окремий corporate org chart.

Ця секція може бути невеликою.

Якщо після дизайну вона виглядає зайвою — можна інтегрувати її як короткий bridge text після Team, а не повну секцію.

---

# 12. Final section — Mission / Contact

Фінал сторінки має бути company-oriented, а не sales-oriented.

Recommended destinations:

### Primary / first direction
**Our Mission & Values**
→ `/plagiarismsearch-mission-and-core-values`

### Second direction
**Contact our team**
→ existing Contact page

Допускається secondary link до Business & Teams, якщо він природно вписується, але не робити checker CTA основним завершенням сторінки.

Не використовувати:
- “Start checking now”
- “Check your paper for free”
- pricing CTA як primary final action.

---

# 13. Що навмисно НЕ додаємо

Не створювати окремі sections:

- Trustpilot / G2 ratings;
- `500k+ users`;
- languages count;
- indexed database stats;
- pricing;
- free word limits;
- checker demo;
- “Why choose us” features;
- security claims;
- Careers;
- open positions;
- office locations;
- country map;
- flags;
- “global team” infographic.

Причина: ці теми або вже закриті іншими pages / footer, або відволікають від унікальної ролі About page.

---

# 14. Geographic information

Команда працює з різних країн, включно з Україною, Данією, Іспанією та США.

Але:
- не робити це окремим marketing message;
- не створювати map / flags / “4 countries” counters;
- не вказувати міста;
- не акцентувати exact distribution.

Якщо це природно потрібно в одному реченні — можна використати нейтрально. Якщо ні — краще не згадувати.

---

# 15. SEO / metadata direction

Це **не traffic-first SEO page**.

### SEO role
- Company entity;
- trust;
- transparency;
- people behind product;
- historical context;
- internal company architecture.

### Suggested title direction
`About PlagiarismSearch | Our Team & Story`

Можна запропонувати кращий варіант, якщо він природніший.

### Suggested meta description direction
Коротко:
- founded/launched in 2009;
- people behind PlagiarismSearch;
- product evolution.

Без keyword stuffing і superlatives.

### H1
Один H1:
`About PlagiarismSearch`

### Canonical
Self-canonical `/about-us`.

### Structured data
Не потрібно робити design-content залежним від schema.

Для production можна підготувати:
- `Organization`;
- `foundingDate: 2009`;
- founder: Pavlo Kucheruk;
- `sameAs` для офіційних profiles;
- optional `Person` entities для team members після отримання реальних LinkedIn URLs.

Не вигадувати schema facts, яких немає.

---

# 16. Internal linking

Page повинна природно лінкуватися на:

- `/why-us` — якщо є логічний contextual mention;
- `/plagiarismsearch-mission-and-core-values`;
- Contact;
- можливо Business & Teams, якщо контекст доречний.

Не ставити десятки internal links лише для SEO.

---

# 17. Reusable vs bespoke components

## Bespoke / About-specific
Можуть бути:
- About hero;
- Product timeline;
- Team grid / Team profile card.

## Reuse from final Section Library
Де доречно:
- section header;
- editorial text block;
- CTA / contact section;
- buttons;
- eyebrow / labels;
- generic container primitives.

### Important
Не намагатися насильно скласти всю сторінку з product cards.

People ≠ features.

---

# 18. Team component як reusable pattern

Team / profile card може бути зроблений як reusable component, якщо це не створює зайвої складності.

Potential future reuse:
- authors;
- reviewers;
- expert profiles;
- team pages.

Але `/about-us` не повинна чекати на велику author system.

### Content contract для profile card
Editable:
- image;
- name;
- role;
- bio;
- LinkedIn URL.

Non-editable / design-controlled:
- layout;
- spacing;
- typography;
- responsive behavior;
- icon placement;
- image ratio;
- hover/focus behavior.

---

# 19. CMS/editor-friendly requirement

Це важливо.

Власник буде працювати через raw HTML / WYSIWYG.

Тому reusable markup для Team / final CTA / інших library-compatible sections повинен бути:
- зрозумілим;
- semantic;
- без необхідності знати Tailwind;
- safe для заміни text/image/link;
- documented.

Не вимагати редагувати utility classes для звичайної content update.

---

# 20. Accessibility

Обов’язково:

- semantic headings;
- logical heading hierarchy;
- alt text strategy для real photos;
- visible keyboard focus;
- LinkedIn links accessible by keyboard;
- descriptive accessible label для social link, наприклад:
  `LinkedIn profile of Pavlo Kucheruk`;
- decorative elements `aria-hidden` where appropriate;
- no meaningful content only in animation;
- no hover-only information;
- responsive text remains readable;
- reduced-motion support.

---

# 21. Responsive behavior

Перевірити щонайменше:
- 375 px;
- 768 px;
- 1440 px.

### Team grid
Desktop:
- бажано 3 × 3, якщо це візуально працює.

Tablet/mobile:
- responsive without awkward orphan cards;
- не зменшувати portrait до неприродно малого розміру;
- bios повинні залишатися readable.

### Timeline
Desktop:
- horizontal possible.

Mobile:
- natural vertical flow.

Не використовувати горизонтальний scroll як єдиний спосіб прочитати milestones.

---

# 22. Placeholder rules

До production у нас ще не буде:
- real team photos;
- real LinkedIn URLs.

Тому:

### Photos
Використати obvious placeholders, які легко замінити.

**Не генерувати fake people / fake headshots.**

### LinkedIn
Не вигадувати профілі.

Можна:
- inactive placeholder;
- `href="#"` тільки якщо це безпечно для prototype;
- або temporary non-clickable icon.

Prototype не повинен створювати враження, що placeholder link — справжній.

---

# 23. GLOBAL HEADER CHANGE

При реалізації `/about-us` потрібно внести **глобальну зміну в shared header/navigation**, а не вручну тільки на цій сторінці.

Додати navigation link:

**About us** → `/about-us`

### Requirements
- посилання має бути в логічному Company/About location у поточній global navigation;
- не дублювати його двічі в одному menu;
- desktop + mobile navigation;
- preserve current approved hierarchy and styles;
- update через shared header source/template, щоб зміна застосувалась глобально;
- не копіювати вручну header по pages.

Якщо для додавання About us доводиться змінити поточну структуру menu, спочатку покажи запропоновану зміну, якщо вона більша за просте додавання link.

---

# 24. GLOBAL FOOTER CHANGE

При реалізації `/about-us` потрібно внести **глобальну зміну в shared footer**.

У Company section додати:

**About us** → `/about-us`

Не створювати цей link локально лише на About page.

### Critical: preserve current latest footer

Поточна approved footer version уже має важливі оновлення:

1. **Apple App Store link уже live**  
   `https://apps.apple.com/us/app/plagiarismsearch/id6789566745`

2. **Google Play slot уже зарезервований**  
   Google Play app має бути готовий до production launch. Не прибирати зарезервоване місце.

3. **Ratings перенесені в нижню частину footer.**

Ці footer changes є поточним baseline.

При додаванні `/about-us`:
- не відкотити footer до старої версії;
- не повертати ratings у старе місце;
- не прибирати App Store;
- не прибирати Google Play placeholder;
- не змінювати інші approved footer links без потреби.

Footer update має йти через shared footer source/template і застосуватися глобально.

---

# 25. Content writing rules

Claude може підготувати draft English copy, але:

### Must
- factual;
- concise;
- human;
- clear;
- low-hype;
- easy to verify.

### Must not
- invent credentials;
- invent years;
- invent customer counts specifically for About;
- invent offices;
- invent departments;
- invent founder titles;
- invent social profiles;
- invent academic expertise;
- imply AI text = plagiarism;
- call Oleksandr Kozuliov co-founder.

### Style
Prefer:
> PlagiarismSearch launched in 2009...

over:
> For more than a decade, our passionate global team has been revolutionizing academic integrity...

---

# 26. Production replacements checklist

Перед production окремо замінити/підтвердити:

- [ ] real photo — Pavlo Kucheruk
- [ ] real LinkedIn — Pavlo Kucheruk
- [ ] real photo — Oleksandr Kozuliov
- [ ] real LinkedIn — Oleksandr Kozuliov
- [ ] real photo — Denys Olshtynskyi
- [ ] real LinkedIn — Denys Olshtynskyi
- [ ] real photo — Viacheslav Hladun
- [ ] real LinkedIn — Viacheslav Hladun
- [ ] real photo — Viktoriia Bas
- [ ] real LinkedIn — Viktoriia Bas
- [ ] real photo — Melissa Anderson
- [ ] real LinkedIn — Melissa Anderson
- [ ] real photo — Viola Romanovych
- [ ] real LinkedIn — Viola Romanovych
- [ ] real photo — Tetiana Zoziuk
- [ ] real LinkedIn — Tetiana Zoziuk
- [ ] real photo — Oleksandr Bondarenko
- [ ] real LinkedIn — Oleksandr Bondarenko
- [ ] final role spelling / transliteration
- [ ] final bios approved
- [ ] milestone facts rechecked
- [ ] Google Play real URL inserted when app is live
- [ ] App Store link works
- [ ] metadata/schema final QA

---

# 27. Implementation / technical constraints

Follow current approved Level A + final Section Library architecture.

Do not:
- reintroduce Tailwind Play CDN;
- add page CSS into body;
- add page JS into body;
- duplicate global styles;
- hook behavior to arbitrary IDs if current rules prohibit it;
- create a page-only header/footer fork.

Keep:
- shared static CSS/JS;
- source HTML content;
- progressive enhancement;
- no-JS readable content;
- accessibility;
- current asset/versioning strategy;
- root-relative assets;
- reusable component architecture.

---

# 28. Verification / QA

Before declaring page complete, report:

### Visual
- 375 / 768 / 1440;
- no layout overflow;
- team cards consistent;
- timeline readable;
- placeholders visually intentional.

### Functional
- all internal links;
- header About us link desktop;
- header About us link mobile;
- footer About us link;
- Mission & Values link;
- Contact link;
- LinkedIn placeholders do not lead to invented URLs.

### Technical
- no new page-local CSS/JS;
- no Play CDN;
- no duplicate IDs;
- no broken asset paths;
- no console errors;
- no-JS content readable;
- reduced motion respected.

### SEO
- one H1;
- title;
- meta description;
- canonical;
- indexable;
- no accidental noindex;
- no keyword-stuffed copy.

### Global regression
Because header/footer are shared:
- verify representative existing pages after global nav change;
- desktop nav;
- mobile nav;
- footer;
- App Store block;
- Google Play placeholder;
- ratings at footer bottom.

---

# 29. Expected deliverables from Claude

Після реалізації надати:

1. URL / file route для `/about-us`.
2. Коротку карту sections.
3. Final English copy.
4. Team cards із усіма 9 placeholder profiles.
5. Timeline із 6 approved milestones.
6. Перелік нових reusable components, якщо створені.
7. Що reused із Section Library.
8. Що bespoke.
9. Де замінюються team photos.
10. Де замінюються LinkedIn URLs.
11. Підтвердження global header update.
12. Підтвердження global footer update.
13. Підтвердження, що latest App Store / Google Play / ratings footer state збережено.
14. Responsive QA.
15. Accessibility QA.
16. Technical QA.
17. Список будь-яких deviations від цього ТЗ.

---

# 30. Stop conditions

Зупинись і запитай до внесення рішення, якщо:

- потрібно змінити approved `/why-us`;
- потрібно об’єднати `/about-us` з Mission page;
- потрібно редиректити існуючий URL;
- потрібно змінити глобальну IA більше, ніж просто додати About link;
- будь-який факт про team/history суперечить source data;
- для дизайну потрібні fake team photos;
- виникає необхідність вигадати credentials або titles;
- reusable Section Library architecture після поточного pilot змінилася так, що це ТЗ потрібно адаптувати.

---

# 31. Критерій успіху

Сторінка повинна давати відвідувачу дуже просту відповідь:

> **Who is behind PlagiarismSearch, how long has the product existed, and who is responsible for building and supporting it today?**

Після перегляду `/about-us` користувач повинен бачити:
- реальну історію з 2009 року;
- реальні product milestones;
- конкретних людей;
- конкретні ролі;
- зрозумілий зв’язок із Mission та Contact.

При цьому сторінка не повинна виглядати ні як SEO landing, ні як ще одна sales page, ні як generic corporate template.
