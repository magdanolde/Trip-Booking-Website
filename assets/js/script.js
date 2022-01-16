const ulExcursions = document.querySelector('.panel__excursions');
const liPrototypeExcursion = document.querySelector('.excursions__item--prototype');
const liPrototypeBasket = document.querySelector('.summary__item--prototype');
const ulBasket = document.querySelector('.panel__summary');
const titles = [];
const totalSumSpan = document.querySelector(".order__total-price-value");
totalSumSpan.textContent = " ";
const nameField = document.querySelector("input[name=name]");
const surnameField = document.querySelector("input[name=surname]");
const emailField = document.querySelector("input[name=email]");
const submitBtn = document.querySelector(".order__field-submit");
const ulCart = document.querySelector(".panel__summary");
cart = [];


// LADOWANIE WYCIECZEK

function handleFiles(files) {
	if (window.FileReader) {
		getAsText(files[0]);
	} else {
		alert('ta przegladarka jest niewspierana');
	}
}

function getAsText(fileToRead) {
	const reader = new FileReader();
	reader.onload = loadHandler;
	reader.readAsText(fileToRead);
}

function loadHandler(event) {
	const csv = event.target.result;
	processData(csv);          
}

function processData(csv) {
    const allTextLines = csv.split(/\r\n|\n/);
    const lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split('"'));
    }
    createExcursion(lines);
}

// TWORZENIE WYCIECZEK

function createExcursion(lines){
	for (let i = 0; i < lines.length; i++) {
		let newExcursion = liPrototypeExcursion.cloneNode(true);
        newExcursion.style.display = "block";
        ulExcursions.appendChild(newExcursion);
		for (let j = 0; j < lines[i].length; j++) {
            newExcursion.querySelector(".excursions__title").textContent = lines[i][3];
            newExcursion.querySelector(".excursions__description").textContent = lines[i][5];
            let adultInput = newExcursion.querySelector("input[name=adults]");
            adultInput.previousElementSibling.textContent = lines[i][7];
            adultInput.previousElementSibling.setAttribute('title', "adultsPrice");
            let childInput = newExcursion.querySelector("input[name=children]");
            childInput.previousElementSibling.textContent = lines[i][9];
            childInput.previousElementSibling.setAttribute('title', "childrenPrice");
		}

    }
}


// WYBIERANIE WYCIECZEK

ulExcursions.addEventListener("click", getValues);

function addItem(titleInput, adultNumber, adultPrice, childNumber, childPrice) {
    let duplicateExists = false
    for(i = 0; i < cart.length; i++) {
       if(cart[i].title === titleInput) {
            duplicateExists = true
            break
        }
    }
        if(!duplicateExists) cart.push({title: titleInput, adultNumber: adultNumber, adultPrice: adultPrice, childNumber: childNumber, childPrice: childPrice});
        createBasketItem();
}


function getValues(e) {
    e.preventDefault();
    if(e.target.classList.contains('excursions__field-input--submit')) {
        const parentElement = e.target.parentElement.parentElement.parentElement;
        const adultNumber = parentElement.querySelector("input[name=adults]").value;
        const childNumber = parentElement.querySelector("input[name=children]").value;
        const titleInput = parentElement.querySelector(".excursions__title").textContent;
        const childPrice = parentElement.querySelector("[title=childrenPrice]").textContent;
        const adultPrice = parentElement.querySelector("[title=adultsPrice]").textContent;
        addItem(titleInput, adultNumber, adultPrice, childNumber, childPrice)
        parentElement.querySelector("form").reset();
    }      
} 

function createBasketItem() {
    cart.forEach(function(item) {
        let newBasketItem = liPrototypeBasket.cloneNode(true);
        ulBasket.appendChild(newBasketItem);
        newBasketItem.style.display = "block";
        const newTitle = newBasketItem.querySelector(".summary__name");
        const pricesSummary = newBasketItem.querySelector(".summary__prices");
        newTitle.textContent = item.title;
            if(!titles.includes(newTitle.textContent)) {
                titles.push(newTitle.textContent);
                const validedChildNumber = validateExcursionFields(item.childNumber);
                const validedAdultdNumber = validateExcursionFields(item.adultNumber);
                pricesSummary.textContent = "Dorośli:" + " " + `${validedAdultdNumber}` + "x" + " " + `${item.adultPrice}` + "PLN" + "," + " " + "Dzieci:" + " " + `${validedChildNumber}` + "x" + `${item.childPrice}` + "PLN";
                newBasketItem.querySelector(".summary__total-price").textContent = getItemTotal(item.childNumber,item.childPrice, item.adultNumber,item.adultPrice) + " " + "PLN";
                newBasketItem.classList.add('summary__item--new');
                newBasketItem.querySelector("img").setAttribute('title', `${item.title}`);
            }
            else {newBasketItem.remove();
            }
    })
    totalSumSpan.textContent = getfinalTotal() + " " + "PLN";
    console.log(titles);
} 

function convertNumber (num) {
    const convertedNum = parseFloat(num);
    return convertedNum;
}

function isCorrectNumber (num) {
    if(Number.isNaN(Number(num))) {
        return false;
    }
    return true;
}
        

function validateExcursionFields (num) {
    if (num === "") {
        num = 0;
        }
    const convertednum = convertNumber(num);
    if(!isCorrectNumber(convertednum)) {
        alert ("Mozesz podac tylko liczbe. Jedna z wartosci nie jest liczba");
    }
    return convertednum;
}

function getItemTotal (num1, num2, num3, num4) {
    let result = (num1 * num2) + (num3 * num4)
    return result;
}

function getfinalTotal() {
    let total = 0
    for (let i = 0; i < cart.length; i += 1) {
      total += getItemTotal(cart[i].adultNumber, cart[i].adultPrice, cart[i].childNumber, cart[i].childPrice);
    }
    return total
}

// USUWANIE WYCIECZEK

ulCart.addEventListener("click", removeExcursion);

function removeExcursion (e) {
    if (e.target.classList.contains('summary__btn-remove')) {
        for (let i = 0; i < cart.length; i += 1) 
            if (cart[i].title === e.target.title) {
            cart.splice(cart[i], 1);
            e.target.parentElement.parentElement.remove();
        }
        //  for (let i = 0; i < titles.length; i += 1)
            // if(titles[i] === e.target.title) {
            // titles.splice(titles[i], 1);
    createBasketItem();
    }
}


// WYPELNIENIE FORMULARZA

submitBtn.addEventListener("click", validateOrderForm);

function validateOrderForm (e) {
    const errors = []
  
    if (!emailField.value.includes('@')) {
        errors.push(emailField);
    } else {
        changeBackSettings(emailField);
    }

    if (nameField.value.length === 0) {
        errors.push(nameField);
    } else {
        changeBackSettings(nameField);
    }

    if (surnameField.value.length === 0) {
        errors.push(surnameField);
    
    } else {
        changeBackSettings(surnameField);
    }
                  
    if(errors.length > 0) {
        e.preventDefault();
        errors.forEach(function(element) {
        element.style.border = "2px solid red";
        })
    }
     
    if(errors.length === 0) {
        e.preventDefault();
        if(cart.length > 0) {
            deleteBasket();
            document.querySelector(".panel__order").reset();
            alert("Dziękujemy za złożenie zamówienia o wartości" + " " + `${totalSumSpan.textContent}` + " " + "Szczegóły zamówienia zostały wysłane na adres e-mail: adres@wpisanywformularzu.pl");
            totalSumSpan.textContent = " ";
        } else {
            alert("Jeszcze nie wybrales zadnej wycieczki. Zapoznaj sie z naszym katalogiem przez wgranie pliku");
        }
    }

}

function changeBackSettings(el) {
    el.style.border = "2px inset grey"
}

function deleteBasket () {
    const liList = ulBasket.querySelectorAll(".summary__item--new");
    liList.forEach(function(li) {
        li.remove();
    });
 }
// 

// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 




















































