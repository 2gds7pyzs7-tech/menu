import {days,sessions,week} from '../src/data/weeks/current.js';
import {recipes} from '../src/data.js';

const errors=[];
if(days.length!==7)errors.push('ÐÐµÐ´ÐµÐ»Ñ Ð´Ð¾Ð»Ð¶Ð½Ð° ÑÐ¾Ð´ÐµÑÐ¶Ð°ÑÑ ÑÐ¾Ð²Ð½Ð¾ 7 Ð´Ð½ÐµÐ¹.');
if(!week.id||!week.label||!week.calendarFile||!week.storageKey)errors.push('ÐÐ°Ð¿Ð¾Ð»Ð½Ð¸ÑÐµ id, label, calendarFile Ð¸ storageKey Ð½ÐµÐ´ÐµÐ»Ð¸.');
for(const day of days){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day.date))errors.push(`ÐÐµÐºÐ¾ÑÑÐµÐºÑÐ½Ð°Ñ Ð´Ð°ÑÐ°: ${day.date}`);
  if(!Array.isArray(day.meals)||day.meals.length!==2)errors.push(`${day.date}: Ð½ÑÐ¶Ð½Ñ Ð¾Ð±ÐµÐ´ Ð¸ ÑÐ¶Ð¸Ð½.`);
  for(const meal of day.meals||[])if(!recipes[meal.recipe])errors.push(`${day.date}: ÑÐµÑÐµÐ¿Ñ Â«${meal.recipe}Â» Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½.`);
}
for(const session of sessions)if(!days.some(day=>day.date===session.date))errors.push(`ÐÐ¾ÑÐ¾Ð²ÐºÐ° Â«${session.id}Â» ÑÑÑÐ»Ð°ÐµÑÑÑ Ð½Ð° Ð´ÐµÐ½Ñ Ð²Ð½Ðµ Ð½ÐµÐ´ÐµÐ»Ð¸.`);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log(`ÐÑÐ¾Ð²ÐµÑÐºÐ° Ð¿ÑÐ¾Ð¹Ð´ÐµÐ½Ð°: ${week.label}.`);
