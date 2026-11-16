# Формат автоматической недели

Основной видимый план хранится в `src/data/weeks/YYYY-MM-DD.js`, где дата — понедельник недели. Файл экспортирует `week`, `days` и `sessions`; `current.js` реэкспортирует ровно один активный файл.

Для автоматической недели добавляются также `dailyPlan` и `qa`:

```js
export const dailyPlan = [
  {
    date: 'YYYY-MM-DD',
    meals: [
      {slot: 'breakfast', title: '...', polina: {kcal: 0, protein: 0, fat: 0, carbs: 0}, nikita: {kcal: 0, protein: 0, fat: 0, carbs: 0}},
      {slot: 'lunch', recipe: 'existing-recipe-id'},
      {slot: 'snack', title: '...', polina: {kcal: 0, protein: 0, fat: 0, carbs: 0}, nikita: {kcal: 0, protein: 0, fat: 0, carbs: 0}},
      {slot: 'dinner', recipe: 'existing-recipe-id'}
    ]
  }
];
export const qa = {status: 'pass', checkedAt: 'YYYY-MM-DD', notes: []};
```

`days.meals` остаётся планом обеда и ужина, который показывает существующий экран. `dailyPlan` — полный суточный план для проверки без изменения интерфейса. Если для завтрака или перекуса требуются продукты, они должны иметь точные количества и быть учтены в недельных покупках; рецепт или подробная карточка хранится в файле недели либо в каталоге рецептов. Вся новая неделя обязана использовать формат из этого документа и правила из `docs/menu-policy.md`.
