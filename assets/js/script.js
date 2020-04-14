/* Author: Aniket	*/

// Required Dom Selection
const updateButton = document.querySelector('.update');
const outputDivison = Array.from(document.querySelectorAll('.days ul'));
const outputLi = Array.from(document.querySelectorAll('.days ul li'));
const textareaElement = document.querySelector('textarea');
const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
let UsersData;
// Fetching data 
const url = 'https://raw.githubusercontent.com/saniketprdxn/JsonData/master/Users.json';
fetch(url)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    UsersData = data;
    calculateDay(data);
  })
  .catch(function (error) {
    console.log("Something went wrong!", error);
  });

//  Function to generate Random Colors for Every background of users Li element
function randomColorsGenerator() {
  let background = ["green", "blue", "gray", "red", "orange", "purple", "pink"];
  let randomColor = background[Math.floor(Math.random() * background.length)];
  return randomColor;
}

// Calculating the birthdate's Day according to inputted year by user
function calculateDay(data, yearInput) {
  // to Display 40 users data in the given textarea
  if (yearInput === undefined) {
    textareaElement.readOnly = true;
    textareaElement.innerHTML = JSON.stringify(data, null, 1);
  } else {
    // to Display below the given week days
    for (const { fullName, Birthdate } of data) {
      // Calculating the birthdate of users from the given data
      let currentDate = yearInput + Birthdate.slice(4);
      // Calculating the initials of user from the given data
      let nameArray = fullName.split(' ');
      let initial = nameArray[0].charAt(0) + nameArray[1].charAt(0);
      // Calculating the current day on the basis of inputted year
      let currentDay = new Date(currentDate).getDay();
      // Calculating age of the user on the basis of inputted year
      let birthYear = parseInt(Birthdate.slice(0, 4));
      let currentYear = parseInt(yearInput);
      let age = currentYear - birthYear;
      if (age < 0 || age > 120) {
        break;
      } else {
        outputDivison.forEach((element) => {
          if (element.className === weekdays[currentDay]) {
            let weekLi = document.createElement('li');
            weekLi.style.background = randomColorsGenerator();
            weekLi.innerText = initial;
            weekLi.setAttribute('data-Age', age);
            // checking if there are no users born yet
            if (element.childElementCount > 0) {
              let elementChilds = Array.from(element.children);
              for (let index = 0; index < elementChilds.length; index++) {
                // Sorting users according to their age in a specific day
                if (elementChilds[index].dataset.age >= weekLi.dataset.age) {
                  element.insertBefore(weekLi, elementChilds[index]);
                  break;
                } else {
                  element.appendChild(weekLi);
                }
              }
            } else {
              element.appendChild(weekLi);
            }
          }
        });
      }
    }
  }
}

// Event : On click of Update Button
updateButton.addEventListener('click', onUpdate);

// onUpdate Function to get required birthdays
function onUpdate(e) {
  e.preventDefault();
  // if days division already has any users present in it then clear it.
  outputDivison.forEach((divison) => {
    if (divison.childElementCount > 0) {
      divison.innerText = "";
    }
  });
  const yearInput = document.querySelector('.year').value;
  let error = document.querySelector('.error');
  let success = document.querySelector('.success');
  const validYear = /^[0-9]{4}$/;
  // Validation of year
  if (!validYear.test(yearInput) || yearInput < 1945) {
    showAlert(error);
  } else {
    showAlert(success);
    calculateDay(UsersData, yearInput);
  }
};

// Alert Function
function showAlert(span) {
  if (span.classList.contains('visible')) {
    span.classList.remove('visible');
  } else {
    span.classList.add('visible');
  }
  // alert Vanishes in 3 seconds
  setTimeout(() => {
    document.querySelectorAll('.visible').forEach((element) => {
      element.classList.remove('visible');
    })
  }, 3000);
}
