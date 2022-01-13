const ulExcursions = document.querySelector('.panel__excursions');
const liPrototypeExcursion = document.querySelector('.excursions__item--prototype');
const liPrototypeBasket = document.querySelector('.summary__item--prototype');
const ulBasket = document.querySelector('.panel__summary');
// const uploader = document.querySelector('.uploader__input');
const titles = [];
const totalPriceArray = [];
const cart = []
const totalSumSpan = document.querySelector(".order__total-price-value");
totalSumSpan.textContent = " ";
const nameField = document.querySelector("input[name=name]");
const surnameField = document.querySelector("input[name=surname]");
const emailField = document.querySelector("input[name=email]");
const submitBtn = document.querySelector(".order__field-submit");
const ulCart = document.querySelector(".panel__summary");
console.log(ulCart);

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
            newExcursion.classList.remove("excursions__item--prototype");
            newExcursion.classList.add("excursions__item--new");
            adultInput.previousElementSibling.setAttribute('title', "adultsPrice");
            let childInput = newExcursion.querySelector("input[name=children]");
            childInput.previousElementSibling.textContent = lines[i][9];
            childInput.previousElementSibling.setAttribute('title', "childrenPrice");
		}

    }
}


// WYBIERANIE WYCIECZEK

ulExcursions.addEventListener("click", addToCart);

function addToCart (e){
    if(e.target.type === "submit") {
        const newExcursions = document.querySelectorAll(".excursions__item--new");
        e.preventDefault();
        newExcursions.forEach(function(excursion) {
            const adultField = excursion.querySelector("input[name=adults]");
            const childField = excursion.querySelector("input[name=children]");
            const title = excursion.querySelector(".excursions__title");
            if(adultField.value > 0 || childField.value > 0) {
                let newBasketItem = liPrototypeBasket.cloneNode(true);
                ulBasket.appendChild(newBasketItem);
                newBasketItem.style.display = "block";
                const newTitle = newBasketItem.querySelector(".summary__name");
                newTitle.textContent = title.textContent;
                    if(!titles.includes(newTitle.textContent)) {
                        titles.push(newTitle.textContent);
                        cart.push(newBasketItem);
                        validateExcursionFields(adultField, childField);
                        const pricesSummary = newBasketItem.querySelector(".summary__prices");
                        const childPrice = excursion.querySelector("[title=childrenPrice]").textContent;
                        const adultPrice = excursion.querySelector("[title=adultsPrice]").textContent;
                        const finalPrice = calculatePriceExcurion(adultField.value, adultPrice, childField.value, childPrice);
                        totalPriceArray.push(finalPrice);
                        const totalPrice = calculateSum(totalPriceArray);
                        totalSumSpan.textContent = totalPrice + "PLN";
                        pricesSummary.textContent = "Dorośli:" + " " + `${adultField.value}` + "x" + " " + adultPrice + "PLN" + "," + " " + "Dzieci:" + " " + `${childField.value}` + "x" + childPrice + "PLN";
                        newBasketItem.querySelector(".summary__total-price").textContent = finalPrice + " " + "PLN"
                        newBasketItem.classList.remove("summary.item--prototype");
                        newBasketItem.setAttribute('title', `${name}`);
                        
                    } else {
                        newBasketItem.remove();
                    } 
                    excursion.querySelector("form").reset();
            }
        })   
    }
}

function calculatePriceExcurion(num1, num2, num3, num4) {
    let result = (num1 * num2) + (num3 * num4)
    return result;
}

function validateExcursionFields (field1, field2) {
    if (field1.value === "") {
        field1.value = 0;
        }
    if (field2.value === "") {
        field2.value = 0;
        }
    if((Number.isNaN(Number(field1.value))) || (Number.isNaN(Number(field2.value)))) {
            alert("musisz podac liczbe");
        }
}

function calculateSum (arr) {
    if(!Array.isArray(arr)) return;
    return arr.reduce((a, v)=>a + v);
}


// USUWANIE WYCIECZEK

ulCart.addEventListener("click", removeExcursion);

function removeExcursion (e) {
    if (e.target.tagName === 'IMG') {
            cart.forEach(function(element){ 
            const name = element.querySelector(".summary__name").textContent;
            console.log(name);
            if(element.name === element.title.name) {
                element.remove();}
            })
    } 
}

// ZAMAWIANIE WYCIECZEK

submitBtn.addEventListener("click", validateOrderForm);

function validateOrderForm (e, form) {
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
        e.stoppropagation;
        if(cart.length > 0) {
            alert("Dziękujemy za złożenie zamówienia o wartości" + " " + `${totalSumSpan.textContent}` + " " + "Szczegóły zamówienia zostały wysłane na adres e-mail: adres@wpisanywformularzu.pl");
        } else {
            alert("Jeszcze nie wybrales zadnej wycieczki. Zapoznaj sie z naszym katalogiem przez wgranie pliku");
        }
    }

}

function changeBackSettings(el) {
    el.style.border = "2px inset grey"
}



