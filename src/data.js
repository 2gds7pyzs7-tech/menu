import {C,recipes} from './data/recipes.js';
import {days} from './data/weeks/current.js';

export {recipes};
export {week,days,sessions} from './data/weeks/current.js';

export function totals(day,person){
  return day.meals.reduce((sum,meal)=>{
    const portion=recipes[meal.recipe][person];
    return {kcal:sum.kcal+portion.kcal,protein:sum.protein+portion.protein,fat:sum.fat+portion.fat,carbs:sum.carbs+portion.carbs};
  },{kcal:0,protein:0,fat:0,carbs:0});
}

const batches=[...new Map(days.flatMap(day=>day.meals.map(meal=>[meal.batch,{id:meal.batch,recipe:meal.recipe}]))).values()];
export function shoppingFor(scope){
  const items=new Map();
  for(const batch of batches){
    const firstDay=days.find(day=>day.meals.some(meal=>meal.batch===batch.id));
    if(scope!=='all'&&scope!==firstDay.date)continue;
    for(const ingredient of recipes[batch.recipe].ingredients){
      if(ingredient.category===C.w)continue;
      const key=ingredient.name+'|'+ingredient.unit;
      const old=items.get(key);
      if(old)old.amount+=ingredient.amount;else items.set(key,{...ingredient});
    }
  }
  return [...items.values()].map(item=>({...item,amount:item.unit==='шт.'?Math.ceil(item.amount):Math.round(item.amount)})).sort((a,b)=>a.category.localeCompare(b.category,'ru')||a.name.localeCompare(b.name,'ru'));
}
