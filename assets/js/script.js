const ulExcursions = document.querySelector('.panel__excursions');
const liPrototypeExcursion = document.querySelector('.excursions__item--prototype');
const liPrototypeBasket = document.querySelector('.summary__item--prototype');
const ulBasket = document.querySelector('.panel__summary');
const Uploader = document.querySelector('.uploader__input');
const titles = [];
// const newExcursions = document.querySelectorAll(".excursions__item--new");
// LADOWANIE WYCIECZEK

function handleFiles(files) {
	if (window.FileReader) {
		getAsText(files[0]);
	} else {
		alert('ta przegladarska jest niewspierana');
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


function createExcursion(lines){
	for (let i = 0; i < lines.length; i++) {
		let newExcursion = liPrototypeExcursion.cloneNode(true);
        newExcursion.style.display = "block";
        ulExcursions.appendChild(newExcursion);
		for (let j = 0; j < lines[i].length; j++) {
            newExcursion.querySelector(".excursions__title").textContent = lines[i][3];
            newExcursion.querySelector(".excursions__title").setAttribute('title', "header");
            newExcursion.querySelector(".excursions__description").textContent = lines[i][5];
            newExcursion.querySelector(".excursions__description").setAttribute('title', "desciption");
            let adultInput = newExcursion.querySelector("input[name=adults]");
            adultInput.previousElementSibling.textContent = lines[i][7];
            newExcursion.classList.remove("excursions__item--prototype");
            newExcursion.classList.add("excursions__item--new");
            // adultInput.previousElementSibling.setAttribute('title', "adultsPrice");
            let childInput = newExcursion.querySelector("input[name=children]");
            childInput.previousElementSibling.textContent = lines[i][9];
            // childInput.previousElementSibling.setAttribute('title', "childrenPrice");
		}

    }
}

function createSummary(e){
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
                const newTitle = newBasketItem.querySelector(".summary__title");
                newTitle.textContent = title.textContent;
                console.log(titles);
                if(!titles.includes(newTitle.textContent)) {
                    titles.push(newTitle.textContent);
                } else {
                    newBasketItem.remove();
                } 
                const pricesSummary = newBasketItem.querySelector(".summary__prices");
                pricesSummary.textContent = "dorośli" + `${adultField.value}` + "x 99PLN, dzieci:" + `${childField.value}`;
            }
        })    
         }
        }

ulExcursions.addEventListener("click", createSummary);