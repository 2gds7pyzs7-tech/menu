// Один расчёт для карточки рецепта, КБЖУ и списка покупок.
// Значения усреднены на 100 г/мл; яйца — на штуку.
const values={
 'Куриное филе':[110,23,1.5,0],'Филе лосося':[208,20,13,0],'Яйца':[72,6.3,5,.4],
 'Сыр твёрдый':[350,25,27,2],'Моцарелла':[250,18,19,2],'Творог 5%':[121,17,5,3],'Кефир 2,5%':[53,3,2.5,4],'Молоко 2,5%':[52,3,2.5,5],'Йогурт греческий 2%':[73,9,2,4],'Сливки 10%':[120,3,10,4],'Масло сливочное':[748,.5,82,.8],
 'Рис длиннозёрный':[350,7,.7,78],'Спагетти':[350,12,1.5,70],'Макароны короткие':[350,12,1.5,70],'Овсяные хлопья':[370,13,7,62],'Хлеб цельнозерновой':[240,9,3.5,43],'Тортильи пшеничные':[310,8,7,52],'Чиабатта':[260,8,3,52],'Лаваш тонкий':[270,8,2,55],'Панировочные сухари':[350,12,5,68],'Мука пшеничная':[334,10,1,72],
 'Картофель':[77,2,.1,17],'Баклажаны':[25,1,.2,6],'Шампиньоны':[27,4,1,.5],'Перец сладкий':[27,1,.2,6],'Томаты':[18,.9,.2,3.9],'Томаты протёртые':[30,1.3,.2,5.5],'Огурцы':[15,.7,.1,3],'Лук репчатый':[40,1,.1,9],'Чеснок':[149,6,.5,33],'Авокадо':[160,2,15,9],'Яблоки':[52,.3,.2,14],'Банан':[89,1.1,.3,23],'Ягоды':[45,1,.4,9],'Ягоды замороженные':[45,1,.4,9],'Кукуруза консервированная':[96,3,1.5,17],'Маслины без косточки':[145,1,15,4],'Лимон':[29,1,.3,9],
 'Масло растительное':[900,0,100,0],'Грецкие орехи':[654,15,65,14],'Мёд':[304,0,0,82],'Горчица зернистая':[110,5,7,5],'Джем без сахара':[70,.5,.1,16],'Шоколад тёмный':[550,7,38,45],'Какао-порошок':[228,20,14,58],
 'Базилик':[23,3,.6,3],'Зелень':[30,3,.5,5]
};
const zero=['Соль','Перец чёрный','Паприка сладкая','Копчёная паприка','Зира','Орегано','Корица','Ваниль','Разрыхлитель'];
const number=(n,unit)=>unit==='шт.'?Math.max(1,Math.round(n)):Math.max(1,Math.round(n/5)*5);
const nutrients=ingredients=>ingredients.reduce((sum,i)=>{const n=values[i.name]||[0,0,0,0],q=i.unit==='шт.'?i.amount:i.amount/100;return sum.map((v,index)=>v+n[index]*q)},[0,0,0,0]);
const serving=(total,share,batch,weight)=>({kcal:Math.round(total[0]*share/batch),protein:Math.round(total[1]*share/batch),fat:Math.round(total[2]*share/batch),carbs:Math.round(total[3]*share/batch),weight});

export function alignRecipe(recipe,targetDailyKcal){
 const raw=nutrients(recipe.ingredients)[0];
 if(!raw)return recipe;
 const scale=targetDailyKcal*recipe.batch/raw;
 const ingredients=recipe.ingredients.map(i=>({...i,amount:number(i.amount*scale,i.unit)}));
 const total=nutrients(ingredients);
 return {...recipe,ingredients,polina:serving(total,.47,recipe.batch,recipe.polina.weight),nikita:serving(total,.53,recipe.batch,recipe.nikita.weight)};
}

export function unknownNutritionIngredients(ingredients){return ingredients.filter(i=>!values[i.name]&&!zero.includes(i.name)).map(i=>i.name);}
