import {recipes,days,sessions,totals,shoppingFor,week} from './data.js';

const app=document.querySelector('#app');
document.title='Вместе — '+week.label;
document.querySelector('meta[name="description"]')?.setAttribute('content',week.description);
const themeKey='family-menu-theme';
const savedTheme=localStorage.getItem(themeKey)==='dark'?'dark':'light';
document.documentElement.dataset.theme=savedTheme;
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const stored=(()=>{try{return JSON.parse(localStorage.getItem(week.storageKey)||'{}')}catch{return {}}})();
const state={view:'menu',day:Math.max(0,days.findIndex(d=>d.date===today)),recipe:null,meal:0,person:'polina',shop:days.find(d=>d.date===today)?.date||days[0].date,checked:stored};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const amount=i=>i.amount+' '+i.unit;
const dateText=date=>new Date(date+'T12:00:00+03:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Moscow'});
const timeFor=type=>({Завтрак:'08:00',Обед:'13:00',Перекус:'16:30',Ужин:'20:00'})[type]||'12:00';
const mealIcon=type=>({Завтрак:'☀',Обед:'◐',Перекус:'✦',Ужин:'◒'})[type]||'•';
const themeButton=()=>'<button class="themeToggle" data-theme-toggle aria-label="Сменить тему" title="Сменить тему">'+(document.documentElement.dataset.theme==='dark'?'☀':'◐')+'</button>';
const navigation=()=>'<nav class="bottom" aria-label="Разделы"><button data-view="menu" class="'+(state.view==='menu'?'active':'')+'"><span>⌂</span><strong>План</strong></button><button data-view="prep" class="'+(state.view==='prep'?'active':'')+'"><span>◷</span><strong>Готовка</strong></button><button data-view="shopping" class="'+(state.view==='shopping'?'active':'')+'"><span>□</span><strong>Список</strong></button></nav>';

function menu(){
 const d=days[state.day];
 const cards=d.meals.map((m,i)=>{const r=recipes[m.recipe],visual=r.image?'<img src="'+r.image+'" alt="'+esc(r.name)+'" loading="lazy">':'<span class="mealVisual '+m.type.toLowerCase()+'">'+mealIcon(m.type)+'</span>';return '<button class="meal meal-'+m.type.toLowerCase()+' '+(i===0?'featured':'')+'" data-recipe="'+r.id+'" data-meal="'+i+'" aria-label="Открыть рецепт: '+esc(r.name)+'">'+visual+'<span class="mealCopy"><small>'+m.type+' · '+timeFor(m.type)+'</small><strong>'+esc(r.name)+'</strong><span>'+r.polina.kcal+' / '+r.nikita.kcal+' ккал</span></span><i>›</i></button>'}).join('');
 return '<section class="page planPage"><div class="mobileIntro"><div><div class="eyebrow">'+dateText(d.date)+'</div><h1>'+d.weekday+'</h1><p>Собрано для вас · 4 приёма пищи</p></div></div><div class="days" aria-label="Выбор дня">'+days.map((x,i)=>'<button data-day="'+i+'" class="'+(i===state.day?'active':'')+'" aria-pressed="'+(i===state.day)+'"><small>'+x.short+'</small><strong>'+x.date.slice(-2)+'</strong></button>').join('')+'</div><div class="mealGrid">'+cards+'</div></section>';
}
function prep(){
 return '<section class="page"><div class="eyebrow">ТРИ БОЛЬШИЕ ГОТОВКИ ЗА НЕДЕЛЮ</div><h1>Готовки</h1><p class="muted">'+esc(week.prepIntro)+'</p><a class="calendar" href="'+week.calendarFile+'" download>＋ Добавить готовки в календарь</a><div class="prepList">'+sessions.map((s,i)=>'<article class="prepCard"><span class="prepNum">'+(i+1)+'</span><div><small>'+dateText(s.date)+' · '+s.duration+'</small><h2>'+esc(s.title)+'</h2><p>'+esc(s.text)+'</p></div></article>').join('')+'</div><div class="notice"><strong>Хранение.</strong> Горячую еду разложите в неглубокие контейнеры и быстро охладите. Держите при 2–4 °C; курицу доводите до 74 °C, рыбу — до 63 °C. Рис особенно важно быстро охладить и на следующий день разогреть только один раз. Холодные соусы и салаты храните отдельно.</div><p class="sources">Ориентиры 1950–2050 ккал для Полины и 2200–2300 ккал для Никиты относятся ко всему дню, не к двум указанным приёмам. При ГВ достаточность питания индивидуальна; при сильном голоде или снижении лактации стоит пересмотреть рацион с врачом.</p></section>';
}
function shopping(){
 const items=shoppingFor(state.shop),groups={};
 for(const i of items)(groups[i.category]??=[]).push(i);
 const scope=state.shop,count=items.filter(i=>state.checked[scope+'|'+i.name+'|'+i.unit]).length,progress=items.length?Math.round(count/items.length*100):0;
 const tabs=days.map(d=>'<button data-shop="'+d.date+'" class="'+(scope===d.date?'active':'')+'"><strong>'+d.short+' '+d.date.slice(-2)+'</strong><small>'+dateText(d.date)+'</small></button>').join('')+'<button data-shop="all" class="'+(scope==='all'?'active':'')+'"><strong>Итого</strong><small>Вся неделя</small></button>';
 const rows=Object.entries(groups).map(([category,arr])=>'<section class="shopGroup"><h2>'+esc(category)+'</h2>'+arr.map(i=>{const key=scope+'|'+i.name+'|'+i.unit;return '<label class="shopRow '+(state.checked[key]?'done':'')+'"><input type="checkbox" data-check="'+esc(key)+'" '+(state.checked[key]?'checked':'')+'><span>'+esc(i.name)+(i.note?'<small>'+esc(i.note)+'</small>':'')+'</span><strong>'+amount(i)+'</strong></label>'}).join('')+'</section>').join('');
 return '<section class="page"><div class="eyebrow">ПО РЕАЛЬНЫМ РЕЦЕПТАМ · БЕЗ ДУБЛЕЙ РАЗОГРЕВА</div><h1>Покупки</h1><p class="muted">'+esc(week.shoppingIntro)+'</p><p class="sources">Листайте даты вправо →</p><div class="shopTabs">'+tabs+'</div><div class="shoppingProgress"><p class="count">Отмечено '+count+' из '+items.length+'</p><div aria-label="Куплено '+progress+' процентов"><span style="width:'+progress+'%"></span></div></div>'+(items.length?rows:'<div class="notice">Сегодня только разогрев: продукты уже учтены в дне первой готовки.</div>')+'<p class="sources">Яйца округлены до целых штук, воду не покупаем. Все количества — на всю партию.</p></section>';
}
function recipe(){
 const r=recipes[state.recipe],p=r[state.person],person=state.person==='polina'?'Полина':'Никита';
 const currentMeal=days[state.day].meals[state.meal]; const heroVisual=r.image?'<img src="'+r.image+'" alt="'+esc(r.name)+'">':'<span class="heroVisual">'+mealIcon(currentMeal.type)+'</span>';
 return '<div class="recipeTop"><button class="back" data-back aria-label="Назад к меню">‹</button><strong>'+currentMeal.type+'</strong>'+themeButton()+'</div><div class="hero">'+heroVisual+'<span class="shade"></span></div><div class="recipeBody"><div class="recipeTitle"><div><div class="eyebrow">'+timeFor(currentMeal.type)+'</div><h1>'+esc(r.name)+'</h1></div><span>'+r.batch*2+' порции</span></div><div class="personTabs" aria-label="Выбор порции"><button data-person="polina" class="'+(state.person==='polina'?'active':'')+'">Полина <strong>'+r.polina.kcal+' ккал</strong></button><button data-person="nikita" class="'+(state.person==='nikita'?'active':'')+'">Никита <strong>'+r.nikita.kcal+' ккал</strong></button></div><p class="recipeMacros">≈ '+p.weight+' г · Б '+p.protein+' · Ж '+p.fat+' · У '+p.carbs+'</p><section class="section"><h2>Ингредиенты <small>на всю партию</small></h2><div class="ingredients">'+r.ingredients.map(i=>'<div class="ingredient"><span>'+esc(i.name)+(i.note?'<small>'+esc(i.note)+'</small>':'')+'</span><strong>'+amount(i)+'</strong></div>').join('')+'</div></section><section class="section"><h2>Приготовление</h2>'+r.steps.map((s,i)=>'<div class="step"><b>'+(i+1)+'</b><div><h3>'+esc(s.title)+'</h3><p>'+esc(s.text)+'</p></div></div>').join('')+'</section></div>';
}
function render(){
 const content=state.recipe?recipe():state.view==='menu'?menu():state.view==='prep'?prep():shopping();
 app.innerHTML='<main class="shell">'+(state.recipe?'':'<header class="top"><button class="brand" data-view="menu"><span>в</span><b>вместе</b></button><div class="topActions">'+themeButton()+'</div></header>')+content+(state.recipe?'':navigation())+'</main>';
}
app.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;if(t.dataset.themeToggle!==undefined){const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem(themeKey,next);render()}else if(t.dataset.day!==undefined){state.day=Number(t.dataset.day);state.view='menu';state.recipe=null;render();window.scrollTo(0,0)}else if(t.dataset.recipe){state.recipe=t.dataset.recipe;state.meal=Number(t.dataset.meal);state.person='polina';render();window.scrollTo(0,0)}else if(t.dataset.back!==undefined){state.recipe=null;render();window.scrollTo(0,0)}else if(t.dataset.view){state.view=t.dataset.view;state.recipe=null;render();window.scrollTo(0,0)}else if(t.dataset.shop){state.shop=t.dataset.shop;render()}else if(t.dataset.person){state.person=t.dataset.person;render()}});
app.addEventListener('change',e=>{if(e.target.matches('[data-check]')){state.checked[e.target.dataset.check]=e.target.checked;localStorage.setItem(week.storageKey,JSON.stringify(state.checked));render()}});
render();
