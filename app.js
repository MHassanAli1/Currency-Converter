const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const form = document.querySelector(`form`);
const fromCurr = document.querySelector(`.from select`);
const toCurr = document.querySelector(`.to select`);
const msg = document.querySelector(".msg");

for (const select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD"){
            newOption.selected = "selected";
        }
        if(select.name === "to" && currCode === "PKR"){
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt)=>{
        updateFlag(evt.target);
    });
}
function updateFlag(element){
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newsrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newsrc;
}
async function updateExchangeRate(){
    let amount = document.querySelector(`.amount input`);// it will return input tag
    let amtVal = amount.value; // to get the value entered by user in input tag
    if (amtVal=="" || amtVal < 0 ||isNaN(amtVal)) {
        amtVal = 1;
        amount.value = "1";
    }
    let lowerCaseToCurr = toCurr.value.toLowerCase();
    let lowerCaseFromCurr = fromCurr.value.toLowerCase();
    const URL = `${BASE_URL}/${lowerCaseFromCurr}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    let currRate = data[lowerCaseFromCurr][lowerCaseToCurr];
    let finalAmount = amtVal*currRate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
}
window.addEventListener("load", ()=>{
    updateExchangeRate();
})
btn.addEventListener("click", async (evt)=>{
    
    evt.preventDefault();
    updateExchangeRate();
})



// this is done to ensure the amount is entered and the active state of button is used when we press enter

form.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        // Apply :active styles manually
        btn.classList.add('active');
        // Remove :active styles after a short delay
        setTimeout(() => {
            btn.classList.remove('active');; // Reset to default background color
            btn.click(); // Programmatically click the button
        }, 200); // 200ms delay to simulate :active effect
    }
});
