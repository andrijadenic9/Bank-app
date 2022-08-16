let currentAccountID = "";
let currentDeposit = "";
let currentEditedDeposit = "";

// * NAVS BUTTONS
let accountNav = document.querySelector('[data-id="account-nav"]');
let addAccountNav = document.querySelector('[data-id="add-account-nav"]');
let editDeleteNav = document.querySelector('[data-id="edit-delete-nav"]');
let bankDepositNav = document.querySelector('[data-id="bank-deposit-nav"]');

// * VIEWS
let mainView = document.querySelector('[data-id="main-view"]');
let addAccountView = document.querySelector('[data-id="add-account-view"]');
let editDeleteView = document.querySelector('[data-id="edit-delete-view"]');
let editView = document.querySelector('[data-id="edit-view"]');
let bankDepositView = document.querySelector('[data-id="bank-deposit-view"]');

// * TABLES
let mainTable = document.querySelector('[data-id="main-table"]');
let addAccountTable = document.querySelector('[data-id="add-account-table"]');
let editDeleteTable = document.querySelector('[data-id="edit-delete-table"]');

// * INPUTS
let inputID = document.querySelector('[data-id="input-id"]');
let inputName = document.querySelector('[data-id="input-name"]');
let inputDeposit = document.querySelector('[data-id="input-deposit"]');
let inputCreditCard = document.querySelector('[data-id="input-credit-card"]');
let saveAccount = document.querySelector('[data-id="input-btn-save"]');
let search = document.querySelector('.search');

// * EDITED INPUTS
let inputIDEdit = document.querySelector('[data-id="input-id-edit"]');
let inputNameEdit = document.querySelector('[data-id="input-name-edit"]');
let inputDepositEdit = document.querySelector('[data-id="input-deposit-edit"]');
let inputCreditCardEdit = document.querySelector('[data-id="input-credit-card-edit"]');
let editAccount = document.querySelector('[data-id="input-btn-edit"]');

let bankDeposit = document.querySelector('[data-id="bank-deposit"]');

// * ALL BANK CARDS TO USE
let bankCards = ['Visa', 'MasterCard', 'American Express'];

// * EVENTS
accountNav.addEventListener("click", displayMainView);
addAccountNav.addEventListener("click", displayAddAccountView);
editDeleteNav.addEventListener("click", displayEditDeleteView);
bankDepositNav.addEventListener("click", displayBankDepositView);
saveAccount.addEventListener("click", saveNewAccount);
editAccount.addEventListener("click", saveEditedAccount);
search.addEventListener('input', checkSearchTerm);

let dbCopy = [];

if (localStorage.data) {
	var db = JSON.parse(localStorage.data);
} else {
	var db = [];
}

if (localStorage.uniqueIdNumber) {
	var uniqueIdNumber = localStorage.uniqueIdNumber;
} else {
	var uniqueIdNumber = 1;
}

if (localStorage.bankDeposit) {
	bankDeposit.innerHTML = localStorage.bankDeposit;
} else {
	bankDeposit.innerHTML = 0 + " EURO";
}

createMainTable(db);

// * CREATING MAIN TABLE VIEW
function createMainTable(db) {
	let text = "";

	for (let i = 0; i < db.length; i++) {
		text += `<tr><td>${db[i].id}</td><td>${db[i].name}</td><td>${db[i].deposit}</td><td>${db[i].card}</td></tr>`;
	}
	mainTable.innerHTML = text;
	displayMainView();
}

// * CREATING EDIT/DELETE TABLE VIEW
function createEditDeleteTable() {
	let text = "";

	for (let i = 0; i < db.length; i++) {
		text += `<tr><td>${db[i].id}</td><td>${db[i].name}</td><td>${db[i].deposit}</td><td>${db[i].card}</td><td><button type="button" class="btn btn-warning edit" data-id="${i}">Edit</button></td><td><button type="button" class="btn btn-danger delete" data-id="${i}">Delete</button></td></tr>`;
	}
	editDeleteTable.innerHTML = text;

	// ? // EDIT / DELETE BUTTONS
	let deleteBtn = document.querySelectorAll(".delete");
	let editBtn = document.querySelectorAll(".edit");
	for (let i = 0; i < deleteBtn.length; i++) {
		deleteBtn[i].addEventListener("click", deleteAccount);
		editBtn[i].addEventListener("click", displayEditingAccount);
	}
}

function saveEditedAccount() {
	let currentAccount = db[currentAccountID];
	currentAccount.id = inputIDEdit.value;
	currentAccount.name = inputNameEdit.value;
	currentAccount.deposit = inputDepositEdit.value;
	currentAccount.card = inputCreditCardEdit.value;
	localStorage.data = JSON.stringify(db);

	currentEditedDeposit = parseInt(currentAccount.deposit);

	// ? calculate 1% from withdrawl that goes to the bank deposit
	if (currentEditedDeposit < currentDeposit) {
		let remainder = currentDeposit - currentEditedDeposit;
		let onePercent = remainder / 100;
		bankDeposit.innerHTML = parseInt(bankDeposit.innerHTML) + onePercent + " EURO";
		localStorage.bankDeposit = bankDeposit.innerHTML;
	}

	createMainTable(db);
}

function displayBankDepositView() {
	mainView.style.display = "none";
	addAccountView.style.display = "none";
	editDeleteView.style.display = "none";
	editView.style.display = "none";
	bankDepositView.style.display = "block";
}

function displayEditingAccount() {
	currentAccountID = this.getAttribute("data-id");
	let currentAccount = db[currentAccountID];
	inputIDEdit.value = currentAccount.id;
	inputNameEdit.value = currentAccount.name;
	inputDepositEdit.value = currentAccount.deposit;
	createCreditCards(inputCreditCardEdit);

	currentDeposit = parseInt(currentAccount.deposit);

	mainView.style.display = "none";
	addAccountView.style.display = "none";
	editDeleteView.style.display = "none";
	bankDepositView.style.display = "none";
	editView.style.display = "block";
	inputIDEdit.focus();
}

function deleteAccount() {
	currentAccountID = this.getAttribute("data-id");
	db.splice(currentAccountID, 1);
	localStorage.data = JSON.stringify(db);
	createMainTable(db);
}

function saveNewAccount() {
	let newID = inputID.value;
	let newName = inputName.value;
	let newDeposit = inputDeposit.value;
	let newCreditCard = inputCreditCard.value;
	let newAccount = {
		id: newID,
		name: newName,
		deposit: newDeposit,
		card: newCreditCard,
	};
	deposit = parseInt(newAccount.deposit);
	db.push(newAccount);
	uniqueIdNumber++;
	localStorage.uniqueIdNumber = uniqueIdNumber;
	localStorage.data = JSON.stringify(db);
	createMainTable(db);
}

function displayAddAccountView() {
	inputID.value = uniqueIdNumber;
	inputName.value = "";
	inputDeposit.value = "";
	inputCreditCard.value = "";

	mainView.style.display = "none";
	editDeleteView.style.display = "none";
	editView.style.display = "none";
	bankDepositView.style.display = "none";
	addAccountView.style.display = "block";

	createCreditCards(inputCreditCard);
	inputName.focus();
}

function displayEditDeleteView() {
	mainView.style.display = "none";
	addAccountView.style.display = "none";
	editView.style.display = "none";
	bankDepositView.style.display = "none";
	editDeleteView.style.display = "block";
	createEditDeleteTable();
}

function displayMainView() {
	addAccountView.style.display = "none";
	editDeleteView.style.display = "none";
	editView.style.display = "none";
	bankDepositView.style.display = "none";
	mainView.style.display = "block";
}

// * SELECT CARD WITCH EDITED USER OWN
function createCreditCards(inputCreditCard) {
	let string = '';
	bankCards.forEach(card => {
		return string += `
		<option value="${card}" ${db[currentAccountID] !== undefined ? `${card === db[currentAccountID].card ? 'selected' : ''}` : ''}>${card}</option>
		`;
	});
	inputCreditCard.innerHTML = string;
}

// * LOGICT FOR SEARCH
function checkSearchTerm() {
	for (let i = 0; i < db.length; i++) {
		if (db[i].name.toLowerCase().indexOf(search.value.toLowerCase()) !== -1 || db[i].card.toLowerCase().indexOf(search.value.toLowerCase()) !== -1) {
			dbCopy.push(db[i]);
		}
	}
	createMainTable(dbCopy);
	dbCopy.length = 0;
}