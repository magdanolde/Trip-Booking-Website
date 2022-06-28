const ulExcursions = document.querySelector('.panel__excursions');
const liPrototypeExcursion = document.querySelector('.excursions__item--prototype');
const liPrototypeBasket = document.querySelector('.summary__item--prototype');
const ulBasket = document.querySelector(".panel__summary");
const totalSumSpan = document.querySelector(".order__total-price-value");
totalSumSpan.textContent = " ";
const nameField = document.querySelector("input[name=name]");
const surnameField = document.querySelector("input[name=surname]");
const emailField = document.querySelector("input[name=email]");
const submitBtn = document.querySelector(".order__field-submit");
const ulCart = document.querySelector(".panel__summary");
cart = [];

// LOADING EXCURSIONS

function handleFiles(files) {
  if (window.FileReader) {
    getAsText(files[0]);
  } else {
    alert("ta przegladarka jest niewspierana");
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
  createExcursionsList(lines);
}

// CREATING A LIST OF EXCURSIONS

function createExcursionsList(lines) {
  for (let i = 0; i < lines.length; i++) {
    let newExcursion = liPrototypeExcursion.cloneNode(true);
    newExcursion.style.display = "block";
    ulExcursions.appendChild(newExcursion);
    for (let j = 0; j < lines[i].length; j++) {
      newExcursion.querySelector(".excursions__title").textContent =
        lines[i][3];
      newExcursion.querySelector(".excursions__description").textContent =
        lines[i][5];
      let adultInput = newExcursion.querySelector("input[name=adults]");
      adultInput.previousElementSibling.textContent = lines[i][7];
      adultInput.previousElementSibling.setAttribute("title", "adultsPrice");
      let childInput = newExcursion.querySelector("input[name=children]");
      childInput.previousElementSibling.textContent = lines[i][9];
      childInput.previousElementSibling.setAttribute("title", "childrenPrice");
    }
  }
}

// CHOOSING EXCURSIONS

ulExcursions.addEventListener("click", getValues);

function addItem(titleInput, adultNumber, adultPrice, childNumber, childPrice) {
  let duplicateExists = false;
  for (i = 0; i < cart.length; i++) {
    if (cart[i].title === titleInput) {
      duplicateExists = true;
      break;
    }
  }
  if (!duplicateExists)
    cart.push({
      title: titleInput,
      adultNumber: adultNumber,
      adultPrice: adultPrice,
      childNumber: childNumber,
      childPrice: childPrice,
    });
  createBasketItems();
}

function getValues(e) {
  e.preventDefault();
  if (e.target.classList.contains("excursions__field-input--submit")) {
    const parentElement = e.target.parentElement.parentElement.parentElement;
    const adultNumber = parentElement.querySelector("input[name=adults]").value;
    const childNumber = parentElement.querySelector(
      "input[name=children]"
    ).value;
    const titleInput =
      parentElement.querySelector(".excursions__title").textContent;
    const childPrice = parentElement.querySelector(
      "[title=childrenPrice]"
    ).textContent;
    const adultPrice = parentElement.querySelector(
      "[title=adultsPrice]"
    ).textContent;
    addItem(titleInput, adultNumber, adultPrice, childNumber, childPrice);
    parentElement.querySelector("form").reset();
  }
}

function createBasketItems() {
  ulBasket.innerHTML = "";
  cart.forEach(function (item) {
    let newBasketItem = liPrototypeBasket.cloneNode(true);
    ulBasket.appendChild(newBasketItem);
    newBasketItem.style.display = "block";
    const newTitle = newBasketItem.querySelector(".summary__name");
    const pricesSummary = newBasketItem.querySelector(".summary__prices");
    newTitle.textContent = item.title;
    const validedChildNumber = validateExcursionFields(item.childNumber);
    const validedAdultdNumber = validateExcursionFields(item.adultNumber);
    pricesSummary.textContent =
      "Adults:" +
      " " +
      `${validedAdultdNumber}` +
      "x" +
      " " +
      `${item.adultPrice}` +
      "PLN" +
      "," +
      " " +
      "Children:" +
      " " +
      `${validedChildNumber}` +
      "x" +
      `${item.childPrice}` +
      "PLN";
    newBasketItem.querySelector(".summary__total-price").textContent =
      getItemTotal(
        item.childNumber,
        item.childPrice,
        item.adultNumber,
        item.adultPrice
      ) +
      " " +
      "PLN";
    newBasketItem.classList.add("summary__item--new");
    newBasketItem.querySelector("img").setAttribute("title", `${item.title}`);
  });

  totalSumSpan.textContent = getfinalTotal() + " " + "PLN";
}

function convertNumber(num) {
  const convertedNum = parseFloat(num);
  return convertedNum;
}

function isCorrectNumber(num) {
  if (Number.isNaN(Number(num))) {
    return false;
  }
  return true;
}

function validateExcursionFields(num) {
  if (num === "") {
    num = 0;
  }
  const convertednum = convertNumber(num);
  if (!isCorrectNumber(convertednum)) {
    alert("Please enter a number");
  }
  return convertednum;
}

function getItemTotal(num1, num2, num3, num4) {
  let result = num1 * num2 + num3 * num4;
  return result;
}

function getfinalTotal() {
  let total = 0;
  for (let i = 0; i < cart.length; i += 1) {
    total += getItemTotal(
      cart[i].adultNumber,
      cart[i].adultPrice,
      cart[i].childNumber,
      cart[i].childPrice
    );
  }
  return total;
}

// REMOVING EXCURSIONS

ulCart.addEventListener("click", removeBasketItem);

function removeBasketItem(e) {
  if (e.target.classList.contains("summary__btn-remove")) {
    for (let i = 0; i < cart.length; i += 1)
      if (cart[i].title === e.target.title) {
        cart.splice(i, 1);
        e.target.parentElement.parentElement.remove();
      }
    createBasketItems();
  }
}

// FORM VALIDATION

submitBtn.addEventListener("click", validateOrderForm);

function validateOrderForm(e) {
  const errors = [];

  if (!emailField.value.includes("@")) {
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

  if (errors.length > 0) {
    e.preventDefault();
    errors.forEach(function (element) {
      element.style.border = "2px solid red";
    });
  }

  if (errors.length === 0) {
    e.preventDefault();
    if (cart.length > 0) {
      alert(
        "Thank you for completing your order. The total price is" +
          " " +
          `${totalSumSpan.textContent}` +
          " " +
          `A confirmation email will be sent to your email address: ${emailField.value}`
      );
      document.querySelector(".panel__order").reset();
      deleteBasket();
      totalSumSpan.textContent = " ";
      cart = [];
      console.log(cart);
    } else {
      alert("You haven't chosen any item yet. Please load our catalogue.");
    }
  }
}

function changeBackSettings(el) {
  el.style.border = "2px inset grey";
}

function deleteBasket() {
  const liList = ulBasket.querySelectorAll(".summary__item--new");
  liList.forEach(function (li) {
    li.remove();
  });
}



















































