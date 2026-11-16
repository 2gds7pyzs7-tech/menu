import {days,sessions,week} from '../src/data/weeks/current.js';
import {recipes} from '../src/data.js';

const errors=[];
if(days.length!==7)errors.push('Неделя должна содержать ровно 7 дней.');
if(!week.id||!week.label||!week.calendarFile||!week.storageKey)errors.push('Заполните id, label, calendarFile и storageKey недели.');
for(const day of days){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day.date))errors.push(`Некорректная дата: ${day.date}`);
  if(!Array.isArray(day.meals)||day.meals.length!==2)errors.push(`${day.date}: нужны обед и ужин.`);
  for(const meal of day.meals||[])if(!recipes[meal.recipe])errors.push(`${day.date}: рецепт «${meal.recipe}» не найден.`);
}
for(const session of sessions)if(!days.some(day=>day.date===session.date))errors.push(`Готовка «${session.id}» ссылается на день вне недели.`);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log(`Проверка пройдена: ${week.label}.`);
