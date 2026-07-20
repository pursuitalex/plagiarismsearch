# Page Specs — PlagiarismSearch Redesign

> Тактичні специфікації сторінок. Бріф (`../redesign-brief-v1.md`) — стратегія; ці файли — конкретні структури секцій, контент, компоненти, motion, edge cases.

**Версія:** v1 draft · 2026-05-13
**Status:** перший прохід — потребує review + закриття open questions у кожному файлі

---

## Конвенція

Усі файли мають однакову структуру (12 полів):

1. **Goal** — навіщо ця сторінка існує
2. **Primary persona** — P1/P2/P3 з §3 бріфу
3. **Success metric** — G1–G6
4. **Design layer** — D3 / D1 / D2 (моодборд напрям)
5. **Hero** — меседж + CTA + візуал
6. **Page structure** — секції зверху вниз
7. **Trust / social proof slots**
8. **Components** — DS готове + що добудувати
9. **Animations / motion**
10. **States / edge cases**
11. **Open questions** — потребують рішення до старту макету
12. **Out of scope**

---

## Індекс сторінок

| # | Файл | Сторінка | Phase | Persona | Metric |
|---|---|---|---|---|---|
| 1 | [01-home.md](01-home.md) | Home (`/`) | P0 | P1 Student | G1 (hero→trial 40%) |
| 2 | [02-pricing.md](02-pricing.md) | `/prices` | P0 | P1 Student | G2 + G3 |
| 3 | [03-for-universities.md](03-for-universities.md) | `/for-universities` | P1 | P3 Admin | G4 (20+ demos/mo) |
| 4 | [04-for-teachers.md](04-for-teachers.md) | `/for-teachers` | P1 | P2 Teacher | G2 |
| 5 | [05-ai-detection.md](05-ai-detection.md) | `/ai-detection` | P2 | cross | G1, G2 |
| 6 | [06-gdocs-landing.md](06-gdocs-landing.md) | GDocs claim landing | P2 | existing add-on users (490K) | net-new accounts |
| 7 | [07-sample-report.md](07-sample-report.md) | `/sample-report` | P3 | all | G1, G2 |
| 8 | [08-compliance-hub.md](08-compliance-hub.md) | `/compliance` | P3 | P3 Admin | G4 |
| 9 | [09-header-global.md](09-header-global.md) | Header (global) | P0 | all | — |
| 10 | [10-footer-global.md](10-footer-global.md) | Footer (global) | P0 | all | — |

---

## Cross-references

- **Бріф (стратегія):** `../redesign-brief-v1.md`
- **Дизайн-система (Figma):** page `5233:2` — foundations + Button/Badge/Input/Card/Table
- **Service Blueprint (Figma):** page `5225:2` — persona journeys + F1–F10 friction table
- **Moodboard (Figma):** page `5205:2` — D3 Soft Productivity card `5205:11`

## Як використовувати

1. Перед макетом сторінки — пройти її spec, закрити open questions у розмові з PM
2. Коли spec затверджений — створювати макет у Figma з посиланням на ID цього файлу в назві фрейму
3. Якщо рішення під час макетування міняє spec — оновлюємо spec, не Figma-тільки (single source of truth)
4. Cross-page рішення (header, footer, шрифти, кольори) — НЕ дублюємо в кожному spec, тримаємо у відповідному global файлі
