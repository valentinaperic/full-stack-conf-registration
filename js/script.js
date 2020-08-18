const form = document.querySelector("form");

//set focus on name input
const nameInput = document.getElementById("name");
nameInput.focus();

const jobRole = document.getElementById("title")

//hide other job role input on page load
const otherJobRole = document.getElementById("other-title");
otherJobRole.hidden = true;

//t-shirt themes html
const tshirtThemes = document.getElementById("colors-js-puns");
tshirtThemes.firstChild.nextElementSibling.innerText = "Please select a T-shirt theme";

//t-shirt themes dropdown
const tshirtThemesDropdown = document.getElementById("color");
tshirtThemesDropdown.hidden = true;

//tshirt theme selections
const themeSelections = document.getElementById("design");

//activities
const activities = document.querySelector('.activities');

//total cost 
let runningTotalCost = document.createElement('p'); 
runningTotalCost.id = "activities-total-text";
activities.after(runningTotalCost);
runningTotalCost.hidden = true;

//credit is selected by default
const paymentOptions = document.getElementById("payment");
paymentOptions.selectedIndex = "1"; 

//disable select method value 
paymentOptions.options[0].disabled = true;

//hide paypal
const paypal = document.getElementById("paypal");
paypal.hidden = true;

//hide bitcoin
const bitcoin = document.getElementById("bitcoin");
bitcoin.hidden = true;

//inputs for error handling
const name = document.getElementById("name");
const mail = document.getElementById("mail");
const creditCard = document.getElementById("cc-num");
const zip = document.getElementById("zip");
const cvv = document.getElementById("cvv");

let errorMessages = [
    {
      id: "name-error",
      html: name,
      message: "Name is Required."
    },  
    {
      id: "mail-error",
      html: mail,
      message: "Email must be in proper format."
    },  
    {
      id: "activity-error",
      html: activities,
      message: "Atleast one checkbox must be checked."
    },  
    {
      id: "credit-card-number-error",
      html: creditCard,
      message: "Credit Card number must be a number between 13 and 16 digits."
    }, 
    {
      id: "zipcode-error",
      html: zip,
      message: "Zipcode must be exactly 5 digits."
    }, 
    {
      id: "cvv-error",
      html: cvv,
      message: "CVV must be exactly 3 digits."
    }, 
];

/**
 * creates the error messages
 * @param errorMessages - array of objects
 */

const createErrorMessages = (errorMessages) => {

    //traverse the errorMessages array
    errorMessages.forEach(error => {
        let errorMessage = document.createElement('p'); 
        errorMessage.classList = "error-message";
        errorMessage.id = error.id;
        errorMessage.innerText = error.message;
        error.html.after(errorMessage);
        errorMessage.hidden = true;
    });
}

createErrorMessages(errorMessages);

/**
 * event listener for job role input
 */

jobRole.addEventListener("change", function() {
    const jobRoleSelected = this.value;

    //if "other" job role is selected, display the text input
    otherJobRole.hidden = (jobRoleSelected === "other") ? false : true;

});

/**
 * event listener for the themes selection in tshirt info
 */

themeSelections.addEventListener("change", function() {
    const themeSelected = this.value;
    tshirtThemesDropdown.hidden = true;


    //update color options based on theme selected
    switch(themeSelected) {
        case "js puns":
          tshirtThemes.firstChild.nextElementSibling.innerText = "Color:";
          tshirtThemesDropdown.hidden = false;
          tshirtThemeDropdownHandler([0, 1, 2], tshirtThemesDropdown);
          break;
        case "heart js":
            tshirtThemes.firstChild.nextElementSibling.innerText = "Color:";
            tshirtThemesDropdown.hidden = false;
            tshirtThemeDropdownHandler([3, 4, 5], tshirtThemesDropdown);
          break;
        default:
            tshirtThemes.firstChild.nextElementSibling.innerText = "Please select a T-shirt theme";
            tshirtThemeDropdownHandler([0, 1, 2, 3, 4, 5], tshirtThemesDropdown);
      }
});

/**
 * displays/hides option for t-shirt theme depending on design selection
 * @param activeTshirtIndexes - array of active tshirt theme indexes
 * @param tshirtDropdown - html collection of tshirt theme dropdown
 */

const tshirtThemeDropdownHandler = (activeTshirtIndexes, tshirtDropdown) => {
    for (let i = 0; i <= tshirtDropdown.length - 1; i++) {
        tshirtDropdown[i].hidden = activeTshirtIndexes.includes(i) ? false : true;
    };
 };

/**
 * event listener for everytime the "Register for Activities" section gets interaction
 */

activities.addEventListener("change", function(e) {
    //checkbox selected
    const checkboxSelected = e.target;

    //get data-cost attribute and convert to whole number
    const cost = parseInt(checkboxSelected.getAttribute('data-cost'));

    //get data-day-and-time attribute
    const conferenceTime = checkboxSelected.getAttribute('data-day-and-time'); 

    //activities labels
    const activityOptions = document.querySelectorAll('.activities label');

    //check if checkbox was checked or unchecked
    if (checkboxSelected.checked) {
        activityOptionsHandler(activityOptions, conferenceTime, true);
    }
    else {
        activityOptionsHandler(activityOptions, conferenceTime, false);
    }

    //calculate the total cost based on checkbox selected
    totalCostsHandler(checkboxSelected, cost);

    //error handling
    activityValidation();
});

 /**
 * enables/disables activites based on overlap 
 * @param activityOptionsArray - NodeList of activity options 
 * @param conferenceTimeSelected - data-day-and-time attribute of the activity
 * @param disable - boolean value if input should be disabled/enabled
 */

const activityOptionsHandler = (activityOptionsArray, conferenceTimeSelected, disable) => {
    activityOptionsArray.forEach(activity => {
        const activityInput = activity.childNodes[1];
        if (conferenceTimeSelected == activityInput.getAttribute('data-day-and-time')) {
            if (!activityInput.checked) {

                if (disable) {
                    activityInput.disabled = true;
                    activity.classList.add("lighten-opacity");
                }
                else {
                    activityInput.disabled = false;
                    activity.classList.remove("lighten-opacity");
                }
            }
        }
    });
};


/**
 * returns the total cost of the conference activites selected 
 * @param selectedCheckbox - input of the selected checkbox
 */

let totalCost = 0;

const totalCostsHandler = (selectedCheckbox, costOfActivity) => {
   (selectedCheckbox.checked) ? totalCost += costOfActivity : totalCost -= costOfActivity;

   if (totalCost > 0) {
       runningTotalCost.hidden = false;
       runningTotalCost.innerText = `Total: $${totalCost}`;
   }
   else {
       runningTotalCost.hidden = true;
   }
};

/**
 * check if atleast one checkbox is checked for activities 
 */

const activityValidation = () => {
    let atleastOneChecked = false;
    const activityErrorMessage = document.getElementById("activity-error");

    //activity inputs
    const activityOptionsInputs = document.querySelectorAll('.activities label input');

    
    activityOptionsInputs.forEach(checkbox => {
        if (checkbox.checked) {
            return atleastOneChecked = true;
        }
    });

    activityErrorMessage.hidden = atleastOneChecked ? true : false;
    return atleastOneChecked;
};

/**
 * event listener for the payment options
 */

paymentOptions.addEventListener("change", function() {
    const optionSelected = this.value;
    const creditCard = document.getElementById("credit-card");

    //update the payment options based on payment that was selected
    switch(optionSelected) {
        case "paypal":
            paypal.hidden = false;
            creditCard.hidden = true;
            bitcoin.hidden = true;
          break;
        case "bitcoin":
            bitcoin.hidden = false;
            creditCard.hidden = true;
            paypal.hidden = true;
          break;
        default:
            //credit card is the default option
            creditCard.hidden = false;
            bitcoin.hidden = true;
            paypal.hidden = true;
      }
});

/**
 * name validation and error handling
 */

const nameValidation = () => {

    const nameErrorMessage = document.getElementById("name-error");

    //checks if input is empty
    if (name.value !== "") {
        nameErrorMessage.hidden = true;
        return true;
    }
    else {
        nameErrorMessage.hidden = false;
        return false;
    }
};

name.addEventListener('keyup', nameValidation);

/**
 * email validation and error handling
 */

const mailValidation = () => {
    

    const emailRegEx = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const mailErrorMessage = document.getElementById("mail-error");

    //checks of the email is in proper email format
    if (!emailRegEx.test(mail.value)) {
        mailErrorMessage.hidden = false;
        return false;
    }
    else {
        mailErrorMessage.hidden = true;
        return true;
    }
};

mail.addEventListener('keyup', mailValidation);

/**
 * credit card validation
 */

const creditCardValidation = () => {
    let creditCardValid = true;

    if (paymentOptions.value === "credit card") {
        //only valididate credit card if credit card is the payment option is selected
        creditCardValid = creditCardNumberValidation() && zipcodeValidation() && cvvValidation();
    }
    else {
        return creditCardValid;
    }

    return creditCardValid;
};

/**
 * credit card number validation and error handling
 */

const creditCardNumberValidation = () => {

    //the credit card number must be between 13 and 16 digits
    const creditCardRegex = /^[0-9]{13,16}$/;
    const creditCardNumberErrorMessage = document.getElementById("credit-card-number-error");
    let creditCardNumberValid = (!creditCardRegex.test(creditCard.value)) ? false : true;

    //hide credit card error message based on if credit card is valid or not
    creditCardNumberErrorMessage.hidden = creditCardNumberValid ? true : false;

    return creditCardNumberValid;
};

creditCard.addEventListener('keyup', creditCardNumberValidation);


/**
 * zipcode validation and error handling
 */

const zipcodeValidation = () => {
    const zipcodeErrorMessage = document.getElementById("zipcode-error");

    //checks if the zipcode length equals 5
    let zipcodeValid = (zip.value.length !== 5) ? false : true;

     //hide zipcode error message based on if credit card is valid or not
    zipcodeErrorMessage.hidden = zipcodeValid ? true : false;

    return zipcodeValid;
};

zip.addEventListener('keyup', zipcodeValidation);


/**
 * cvv validation and error handling
 */

const cvvValidation = () => {
    const cvvErrorMessage = document.getElementById("cvv-error");

    //checks if the length of the cvv is 3
    let cvvValid = (cvv.value.length !== 3) ? false : true;

    //hide cvv error message based on if credit card is valid or not
    cvvErrorMessage.hidden = cvvValid ? true : false;

    return cvvValid;
};

cvv.addEventListener('keyup', cvvValidation);

/**
 * form submission
 * goes through all of the valididations and see if they pass
 */

form.addEventListener('submit', function(e) {

    if (!nameValidation()) {
        e.preventDefault();
    }
    else if (!mailValidation()) {
        e.preventDefault();
    }
    else if (!activityValidation()) {
        e.preventDefault();
    }
    else if (!creditCardValidation()) {
        e.preventDefault();
    }
    else {
        //form successfully submitted
    }
});