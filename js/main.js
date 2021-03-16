'use strict'

let btnStart = document.getElementById('start'),
    btnIncomesPlus = document.getElementsByTagName('button')[0],
    btnExpensesPlus = document.getElementsByTagName('button')[1],
    flagDeposit  = document.querySelector('#deposit-check'),
    additionalIncomeItems = document.querySelectorAll('.additional_income-item'),
    //extraIncome2 = document.querySelectorAll('.additional_income-item')[1],
    budgetDayOutput = document.getElementsByClassName('result-total budget_day-value')[0],
    budgetMonthOutput = document.getElementsByClassName('result-total budget_month-value')[0],
	expensesMonthOutput = document.getElementsByClassName('result-total expenses_month-value')[0],
    addIncomeValue = document.getElementsByClassName('result-total additional_income-value')[0],
    addExpensesValue = document.getElementsByClassName('result-total additional_expenses-value')[0],
    incomePeriodValue = document.getElementsByClassName('result-total income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('result-total target_month-value')[0],
    salaryInput = document.querySelector('.salary-amount'),  // salaryAmount
	incomeTitle = document.querySelector('.income-title'), // добавлены из видео Практика 11 урока
	expensesTitle = document.querySelector('.expenses-title'), // добавлены из видео Практика 11 урока
	expensesItems = document.querySelectorAll('.expenses-items'), // delete
	additionalExpenses = document.querySelector('.additional_expenses'), // добавлены из видео Практика 11 урока
    periodSelect = document.querySelector('.period-select'),
	additionalExpensesItem = document.querySelector('.additional_expenses-item'), // periodSelect
	targetAmount = document.querySelector('.target-amount'),
	incomeItems = document.querySelectorAll('.income-items');

 //Функция, проверяет является ли введенное значение числом
let	isNumber = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
    },
	//Функция, проверяет является ли число больше нуля
	isNumberValid = function(x){
		  if (isNumber(x)) {
			return (parseFloat(x) > 0);
		  }
	},
	
	isValidString = function(s){
		//console.log("проверка валидности строкового значения.", s);
		if (s){
			//console.log("это не пустая строка");
			if (isNumber(s)) {
				//console.log("но это число");
				return false;
			} else {
				//console.log("а вот это нормальная строка",s);
				s = s.trim();
				return s ; 
			}
		} else {
			//console.log("Пустая строка");
			return false;
		}
	},

	appData = {
		budget: 0,
		budgetDay: 0,
		budgetMonth: 0,
		expensesMonth: 0,
		income: {},
		incomeMonth: 0,
		addIncome: [],
		expenses: {},
		addExpenses: [],
		deposit: false,
		procentDeposit: 0,
		moneyDeposit: 0,
		period: 0,

		start: function(){
			appData.renewData();
			appData.budget = salaryInput.value;
			appData.getExpenses();
			appData.getExpensesMonth();	
			appData.getAddExpenses();
			appData.getAddIncome();		
			appData.getIncome();
			appData.getBudget();
			appData.showResult();
		},

		renewData: function(){
			btnStart.disabled = false;
			appData.budget =  0;
			appData.budgetDay =  0;
			appData.budgetMonth =  0;
			appData.expensesMonth =  0;
			appData.income = {};
			appData.incomeMonth =  0;
			appData.addIncome = [];
			appData.expenses = {};
			appData.addExpenses = [];
			appData.deposit = false;
			appData.procentDeposit =  0;
			appData.moneyDeposit =  0;
		},

		checkSalaryInput: function(){
			if (salaryInput.value !== ''){
				appData.start();
			} else {
				btnStart.disabled = true;
				//console.log(btnStart.disabled);
				return;
			}
		},

		showResult: function(){
			budgetDayOutput.value = appData.budgetDay;
			budgetMonthOutput.value = appData.budgetMonth;
			expensesMonthOutput.value = appData.expensesMonth;
			addExpensesValue.value = appData.addExpenses.join(', ');
			addIncomeValue.value = appData.addIncome.join(', ');
			targetMonthValue.value = appData.getTargetMonth();
			
			let findIncPerValue = function(){
				incomePeriodValue.value = appData.calcPeriod();
			};
			findIncPerValue(); // расчет поля incomePeriodValue.value на 1 раз
			periodSelect.removeEventListener('input', findIncPerValue, false); // удаление предыдущего обработчика события
			periodSelect.addEventListener('input', findIncPerValue); // расчет поля incomePeriodValue.value на последующие разы (добавляется обрабочик)
		},

		//methdd: add extra input by pushing button 'plus' -- lesson11
		addExpensesBlock: function(){
				
				let cloneExpensesItem = expensesItems[0].cloneNode(true);
				[...cloneExpensesItem.children].forEach(elem => {
					elem.value = '';
				});
				expensesItems[0].parentNode.insertBefore(cloneExpensesItem, btnExpensesPlus);
				expensesItems = document.querySelectorAll('.expenses-items');
				if (expensesItems.length === 3) {
					btnExpensesPlus.style.display = 'none';
				}
		},

		getExpenses: function(){
			expensesItems.forEach(function(item){
				let itemExpenses = item.querySelector('.expenses-title').value;
				let cashExpenses = item.querySelector('.expenses-amount').value;
				if (itemExpenses !== '' && cashExpenses !== '') {
					appData.expenses[itemExpenses] = cashExpenses;
				}
			});
		},

		addIncomeBlock: function(){

			let cloneIncomeItem = incomeItems[0].cloneNode(true);
			[...cloneIncomeItem.children].forEach(elem => {
				elem.value = '';
			});
			incomeItems[0].parentNode.insertBefore(cloneIncomeItem, btnIncomesPlus);
			incomeItems = document.querySelectorAll('.income-items');
			if (incomeItems.length === 3) {
				btnIncomesPlus.style.display = 'none';
			}
		},

		getIncome: function(){
			incomeItems.forEach(function(item){
				let itemIncome, cashIncome;
				itemIncome = item.querySelector('.income-title').value;
				cashIncome = item.querySelector('.income-amount').value;
				if (itemIncome !== '' && cashIncome !== '') {
					appData.incomeMonth += +cashIncome;
				}
			});
			//console.log(appData.incomeMonth);
		},

		getAddExpenses: function(){
			let addExpenses = additionalExpensesItem.value.split();
			addExpenses.forEach(function(item) {
				if (item !== '') {
					item = item.trim();
					appData.addExpenses.push(item);
				}
			});
		},

		getAddIncome: function(){
			additionalIncomeItems.forEach(function(item){
				let itemValue = item.value.trim();
				if (itemValue !== ''){
					appData.addIncome.push(itemValue);
				}
			});
		},

		getExpensesMonth: function(){			 	//высчитает свойство: сумма обяз.расходов за месяц
			for (let key in appData.expenses) {
				appData.expensesMonth += +appData.expenses[key];
				}
		},

		getBudget: function(){ 						//высчитывает свойства: бюджет на месяц и на день
			//console.log(appData.incomeMonth);	
			appData.budgetMonth = appData.budget - appData.expensesMonth + appData.incomeMonth;
			appData.budgetDay = Math.floor(appData.budgetMonth / 30);
		},

		getTargetMonth: function() {				//возвращает количество месяцев, нужное для достигнужения цели
			return Math.ceil( targetAmount.value / appData.budgetMonth);
		},

		getStatusIncome: function(){				//вывод информации для пользователя
			if (appData.budgetDay >= 1200) {
				return("У вас высокий уровень дохода");
			} else if ((appData.budgetDay >= 600) && (appData.budgetDay < 1200)) {
				return("У вас средний уровень дохода");
			} else if ((appData.budgetDay > 0) && (appData.budgetDay < 600)) {
				return("К сожалению, у вас уровень дохода ниже среднего");
			} else {appData
				return("Что-то пошло не так"); 
			}  
			
		},
		getInfoDeposit: function(){
			if (appData.deposit){
				do {
					appData.procentDeposit = parseFloat(prompt("Какой годовой процент", 10));
					//console.log("!isNumberValid(appData.procentDeposit - ", !isNumberValid(appData.procentDeposit));
				} while (!isNumberValid(appData.procentDeposit));
				do {
					appData.moneyDeposit = prompt("Какая сумма заложена?", 10000);
					//console.log("!isNumberValid(appData.moneyDeposit - ", !isNumberValid(appData.moneyDeposit));
				} while (!isNumberValid(appData.moneyDeposit));	
			}
		},

		calcPeriod: function(){
			return appData.budgetMonth * periodSelect.value;
		},

		changeRange: function(){
			let period = document.querySelector('.period');
			period.children[2].innerHTML = periodSelect.value;
			//appData.showResult();
			//return periodSelect.value;
		},

}

btnStart.addEventListener('click', appData.checkSalaryInput); 

btnExpensesPlus.addEventListener('click', appData.addExpensesBlock);

btnIncomesPlus.addEventListener('click', appData.addIncomeBlock);

periodSelect.addEventListener('input', appData.changeRange);




/*if (appData.getTargetMonth() > 0) {
	console.log("Цель будет достигнута за ", appData.getTargetMonth(), "месяцев(-а)");
} else {
	console.log(appData.getStatusIncome());
}*/
