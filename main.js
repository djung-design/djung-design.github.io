let numOwners = 0;
let itemsArray = [];
let ownersArray = [];
let runningTotal = 0.00;
let inputMode = false;
let firstRun = true;

function onStart() {
    setEventsListener();
}

//Sets the initial event listeners
function setEventsListener() {
    //Event Listener: Will update number of owners when button is clicked.
    const OKbutton = document.getElementById("OKbutton");
    OKbutton.addEventListener("click", onOKButtonClick);
    /*Event Listener: When user clicks into item price input box, price of the item
    should change with user input*/
    const priceInput = document.querySelector(".item-price-input");
    document.addEventListener("change", (eventTarget) => {
        const className = eventTarget.srcElement.className;
        if (className && className.includes('item-price-input')) {
            getItemPrice(eventTarget.srcElement.id,
                eventTarget.srcElement.parentElement.childNodes[4]);
        }
    });
    //TO DO: add functionality for user to enter a formula to  get a price 

    /*EventListener: When user clicks into tip input box, tip amt should change 
    with user input*/
    const tipInputElement = document.querySelector("#tip-input");
    document.addEventListener("change", getTipAmt);
    //Event Listener: When user clicks on a checkbox, update the Item object's claims
    document.addEventListener("click", (eventTarget) => {
        const className = eventTarget.srcElement.className;
        if (className && className.includes('owner-option')) {
            const inputElement = eventTarget.srcElement;
            const ancestorWrap = eventTarget.srcElement.closest(".item-wrap");
            updateClaims(eventTarget.srcElement, ancestorWrap);
        }
    });

    //Event Listener: When user clicks on 'Select All' button, all checkboxes are checked
    document.addEventListener("click", (eventTarget) =>{
        const className = eventTarget.srcElement.className;
        if (className && className.includes('selectAllButton')){
            const ancestorWrap = eventTarget.srcElement.closest(".item-wrap");
            updateClaimsAll(ancestorWrap);   
        }
    })

    //Event Listener: When user clicks on 'Label' button, input field to change item name
    //appears and allows user to enter a new name for item
    setLabelEventListeners();

    //Event listeners to add functionality to add item, tip, tax and calculate
    const addItemButton = document.getElementById("add-item-button");
    addItemButton.addEventListener("click", addItem);
    const calculateButton = document.getElementById("calculate-button");
    calculateButton.addEventListener("click", onCalculateButtonClick);
    const addTipButton = document.getElementById("add-tip-button");
    addTipButton.addEventListener("click", createTipDiv);
    //TO DO: set event listener for + Tax button
}



function onOKButtonClick() {
    resetMessages();
    if(!firstRun){
        return;
    }
    if(numOwnersIsValid()){
        getNumOwners();
        updateOwnersArray();
        createOwnerNames();
        setNameEventListeners();
        unhideButtons();
        hideNumOwnersForm();
        firstRun = false;
    }
    

    //if pressing the OKbutton again to update number of owners
}

function hideNumOwnersForm(){
    document.getElementById("num-owners-form").style.display= "none";
}

function unhideButtons(){
    //unhide the +item and calculate button
    document.getElementById("buttons-div").style.visibility = "visible";
    //unhide the rename button (when finish cosolidating rename buttons)
    // document.getElementById("rename-ownerName-button").style.visibility = "visible";
}

function setNameEventListeners(){
    /*Event Listener: When user clicks on change name button, input element will become visible.
    Will allow user to type in a custom name*/

    /*Event Listener (part 1): Show the input field to rename owners*/
    const renameOwnerButtonArray = document.querySelectorAll(".renameOwnerButton");

    //TO DO: Future development: consolidate all rename buttons into one button
    // const renameOwnerButton = document.getElementById("rename-ownerName-button");
    // renameOwnerButton.addEventListener("click", (eventTarget)=>{
    // showInputField(1,0) //rename every element, from element 1 to length
    // const firstOwnerInput = document.getElementById("name-input-1");
    // firstOwnerInput.focus();
    // });


    for(let i=0; i<renameOwnerButtonArray.length; i++){
        renameOwnerButtonArray[i].addEventListener("click", (eventTarget)=>{
            const renameOwnerButtonId = eventTarget.srcElement.id;
            const idEnding = renameOwnerButtonId.replace("rename-ownerName-button-","");
            showInputField(idEnding, 0);
            const targetInputElem = document.getElementById("name-input-" + idEnding); 
            targetInputElem.focus();//focuses the input field (so blur can work in part 2)

        });
    }

    /*Event Listener (part 2): update the owner name when input field changes*/
    const nameInputArray = document.querySelectorAll(".name-input");
    for(let i=0; i<nameInputArray.length; i++){
        nameInputArray[i].addEventListener("focusout", (eventTarget)=>{
            const nameInputId = eventTarget.srcElement.id;
            const idEnding = nameInputId.replace("name-input-","");
            updateOwnerName(idEnding);
        });
    }
}

function setLabelEventListeners(){
    /*Event Listener: When user clicks on 'label' button, will allow the user
    to change the item name*/
    document.addEventListener("click",(eventTarget)=>{
        /*Event Listener (part 1): change the item header*/
        const eventSrc= eventTarget.srcElement;
        if (eventSrc.className && eventSrc.className === "labelButton"){
            //Upon clicking, shows the input field to allow user to enter new item name
            const labelButtonId = eventTarget.srcElement.id;
            const idEnding = labelButtonId.replace("label-button-", "");
            showInputField(idEnding, 1);
            //to make blur work
            const targetInputElem = document.getElementById("item-name-input-" + idEnding); 
            targetInputElem.focus();

            /*Event Listener (part 2): update the item name in the item object*/
            const itemInputArray = document.querySelectorAll(".itemNameInput");
            for(let i=0; i<itemInputArray.length; i++){
                itemInputArray[i].addEventListener("blur", (eventTarget)=>{
                    const itemInputId = eventTarget.srcElement.id;
                    const idEnding = itemInputId.replace("item-name-input-", "");
                    updateItemName(idEnding);
                });
            }
        }
    });
    
}


//0 = show input field to change owner name
//1 = show input field to change item name
function showInputField(idEnding, type) {
    //inputMode = true;
    if(type == 0){
        const targetInputElem = document.getElementById("name-input-" + idEnding); 
        //changes input type from hidden to text 
        targetInputElem.type = "text";
        // show every owner input field

        //To do: future dev: part of consolidating all rename owner buttons into one button
        // for(let i=idEnding; i<=ownersArray.length; i++){
        //     const targetInputElem = document.getElementById("name-input-"+i);
        //     targetInputElem.type = "text";
        // }
    }else if(type == 1){
        targetInputElem = document.getElementById("item-name-input-" + idEnding);
        //changes input type from hidden to text 
        targetInputElem.type = "text";
    }

}
    
function updateOwnerName(idEnding){
    //Update owner name being displayed
    //In owner summary at top
    const targetNameSpan = document.getElementById("owner-name-" + idEnding); 
    const inputtedName = document.getElementById("name-input-" + idEnding);
    //Only update the owner name if the input was not blank
    if(inputtedName.value != ""){
        //updates the owner name on top
        targetNameSpan.textContent = inputtedName.value;
        //updates the name choice in the item box
        if(itemsArray.length > 0){
            const increment = parseInt(numOwners);
            let ownerLIArray = document.querySelectorAll(".owners-list li span");
            for(let i=parseInt(idEnding)-1; i<ownerLIArray.length; i += increment){
                ownerLIArray[i].textContent = inputtedName.value;
            }
        }
        //Update owner's nickname in Owner object
        ownersArray[idEnding-1].nickname = inputtedName.value;
    }
    hideInputField(idEnding, 0);
    //Update owner name under each Item section
    //query selector sequence (all list items in class owners-list)
    /*TO DO: make this more space efficient later
    Currently takes all LI items even though we are ony updating a few 
    (array gets longer with every item added)
    Additionally, we remake the array from scratch */

}

function updateItemName(idEnding){
    const targetNameSpan = document.getElementById("item-header-" + idEnding); 
    const oldName = targetNameSpan.value;
    const inputtedName = document.getElementById("item-name-input-" + idEnding);

    //error handling for if user does not actually enter a new item name
    if(inputtedName.value !== oldName && inputtedName.value !== ""){
        targetNameSpan.textContent = inputtedName.value; 
        //update item object nickname
        itemsArray[idEnding-1].itemName = inputtedName.value;
    }
    hideInputField(idEnding, 1);


}



function hideInputField(idEnding, type){
    //type 0 = owner name input
    //type 1 = item name input
    if(type == 0){
        const targetInputSpan = document.getElementById("name-input-" + idEnding);
        targetInputSpan.type = "hidden";
    }else if (type == 1){
        const targetInputSpan = document.getElementById("item-name-input-" + idEnding);
        targetInputSpan.type = "hidden";
    }
}

function onCalculateButtonClick() {
    resetOwnerTotals();
    resetMessages();
    calculate();
    checkTotal();
    displaySummary();
}

function resetMessages(){
    document.getElementById("error-div").textContent = "";
}

function getNumOwners() {
    numOwners = document.getElementById("num-owners").value;
    document.getElementById("owners-result").textContent = numOwners; 
}

function numOwnersIsValid(){
    const numOwners = document.getElementById("num-owners").value;
    if(isNaN(numOwners) || numOwners <=0){
        let errorDiv = document.getElementById("error-div");
        errorDiv.textContent = "Please enter a number greater than zero.";
        return false;
    }
    return true;
}

function updateOwnersArray() {
    for (let i = 0; i < numOwners; i++) {
        ownersArray.push(new Owner(i + 1));
    }

}

function createOwnerNames() {
    const targetElement = document.getElementById("owner-names-list");
    for (let i = 0; i < numOwners; i++) {
        //display default names (Person 1, Person 2)
        const newLI = document.createElement("li");
        const newSpan = document.createElement("span");
        newSpan.className = "owner-name";
        newSpan.id = "owner-name-" + (i + 1);
        newSpan.textContent = ownersArray[i].nickname;

        //create input element for user to type in a new owner name
        const newNameInput = document.createElement("input");
        newNameInput.type = "hidden";
        newNameInput.className = "name-input";
        newNameInput.id = "name-input-" + (i + 1);
        newNameInput.placeholder = "Person " + (i + 1);

        //create "change name" button to rename owners
        const renameOwnerButton = document.createElement("button");
        renameOwnerButton.className = "renameOwnerButton";
        renameOwnerButton.id = "rename-ownerName-button-" + (i+1);
        renameOwnerButton.textContent = "Rename";

        newLI.appendChild(newNameInput);
        newLI.appendChild(newSpan);
        newLI.appendChild(renameOwnerButton);
        targetElement.appendChild(newLI);
    }
}


//User entered an expression for price input (denoted by "="). Solve expression to get the price
function solveExpression(priceInputValue){
    let expressionArray = priceInputValue.split("=");
    let price = eval(expressionArray[1]);
    console.log(expressionArray[1]);
    console.log(price);
    //check if this function should round to 2 decimal places
    return price.toFixed(2)
}

function isAnExpression(priceInputValue){
    if(priceInputValue[0] === '='){
        return true;
    }
    return false;
}


function getItemPrice(inputID, textElement) {
    const inputElement = document.getElementById(inputID);
    let price = inputElement.value;

    //check if user entered a math expression for the price
    if(isAnExpression(price)){
        price = solveExpression(price);
    }

    //check if user entered NaN input
    if(isNaN(parseFloat(price))){
        price = 0;
    }
    //Display inputted item price
    textElement.textContent = `$${price}`;

    //Update the price in the Item Object
    const inputIDStr = inputID.replace("priceinput", "");
    const itemIndex = parseInt(inputIDStr, 10) - 1;
    const oldPrice = itemsArray[itemIndex].price;
    itemsArray[itemIndex].price = price;

    //update the running total)
    updateRunningTotal(oldPrice, price);
}


//displays the new tip amount and updates running total
function getTipAmt(){
   //input is not a number, so default the value to zero
    const tipInputElement = document.getElementById("tip-input");
    let newTipAmt;
    if (isAnExpression(tipInputElement.value)){
        newTipAmt = parseFloat(solveExpression(tipInputElement.value), 2);
    }
    else if(isNaN(parseFloat(tipInputElement.value))){
        newTipAmt = 0.00;
    }else{
        newTipAmt = parseFloat(tipInputElement.value, 2);
    }

    //keep track of old tip amt to update runningTotal
    const tipSpanElement = document.getElementById("tip-amt-span");
    let oldTipAmt;
    //this is the first time tip is being entered, so old tip - $0
    if(tipSpanElement.textContent == ""){
        oldTipAmt = 0.00;
    }else{
    //else, grab the old tip amount and convert it into a float    
        const oldTipAmtStr = tipSpanElement.textContent.replace("$", "");
        oldTipAmt = parseFloat(oldTipAmtStr);
    }

    //update the span with the newest tip amount
    tipSpanElement.textContent = "$"+newTipAmt;

    updateRunningTotal(oldTipAmt, newTipAmt);
}

function addItem() {
    console.log("item object added");
    //add Item object to the Items Array
    const itemID = (itemsArray.length +1);
    console.log("itemID" + " = " + itemID);
    itemsArray.push(new Item(itemID, numOwners));
    //create the wapper div
    let newDiv = document.createElement("div");
    newDiv.id = "item" + itemID;
    newDiv.className = "item-wrap";
    //create the h4 header (item name)
    const newH4 = document.createElement("h4");
    newH4.className = "item-header";
    newH4.id = "item-header-" + itemID;
    newH4.textContent = "Item " + (itemsArray.length);
    //create the 'label' button to rename the item
    const newLabelButton  = makeLabelButton(itemID);
    //create the user input element to rename the item name
    const newItemNameInput = makeItemNameInput(itemID);
    //create the user input element (for price)
    const newInput = document.createElement("input");
    newInput.className = "item-price-input";
    newInput.id = "priceinput" + itemsArray.length;
    newInput.setAttribute("type", "text");
    newInput.setAttribute("placeholder", "Enter item price");
    //create the span element (to display inputted price)
    const newSpan = document.createElement("span");
    newSpan.className = "item-price";
    //create the owner options section
    const newOwnersDiv = makeOwnerSection();
    //creates the 'select all' button
    const newSelectAllButton = makeSelectAllButton(itemID);
    //add all new elements to to the webpage
    newDiv.appendChild(newH4);
    newDiv.appendChild(newItemNameInput);
    newDiv.appendChild(document.createElement("br"));
    newDiv.appendChild(newInput);
    newDiv.appendChild(newSpan);
    newDiv.appendChild(newOwnersDiv);
    newDiv.appendChild(newSelectAllButton);
    newDiv.appendChild(newLabelButton);
    const buttonsDiv = document.getElementById("buttons-div");
    document.body.insertBefore(newDiv, buttonsDiv);
    console.log("itemID" + " = " + itemID);
}
function makeSelectAllButton(itemID){
    const newButton = document.createElement("button");
    newButton.className = "selectAllButton";
    newButton.id = "select-all-button-" + itemID;
    newButton.value = "Select All";
    newButton.textContent = "Select All";
    return newButton;
}

function makeLabelButton(itemID){
    const newButton = document.createElement("button");
    newButton.className = "labelButton";
    newButton.id = "label-button-" + itemID;
    newButton.textContent = "Label Item";//Label
    return newButton;
}

function makeItemNameInput(itemID){
    const newInput = document.createElement("input");
    newInput.className = "itemNameInput";
    newInput.id = "item-name-input-" + itemID;
    newInput.type = "hidden";
    newInput.placeholder= "Enter item name";
    return newInput;
}

function makeOwnerSection() {
    //create the owner options (Goes under each item)
    const newOwnersDiv = document.createElement("div");
    newOwnersDiv.className = "owners-wrap";
    const newUL = document.createElement("ul");
    newUL.className = "owners-list";
    for (let i = 0; i < numOwners; i++) {
        const newListItem = document.createElement("li");
        const newSpan = document.createElement("span");
        const newCheckbox = document.createElement("input");
        newCheckbox.type = "checkbox";
        newCheckbox.className = "owner-option"
        newCheckbox.value = "owner" + (i + 1);
        newSpan.textContent = ownersArray[i].nickname;
        newListItem.appendChild(newCheckbox);
        newListItem.appendChild(newSpan);
        newUL.appendChild(newListItem);
    }
    newOwnersDiv.appendChild(newUL);

    return newOwnersDiv;
}

/*TO DO: make this more efficient for select all. 
It currently updates the claims array and button more than needed (for every element in loop)*/
function updateClaims(inputElement, ancestorWrap) {
    //ancestorWrap will be the outter-most item-wrap 
    const itemIndexStr = ancestorWrap.id.replace("item", "");
    const itemIndex = parseInt(itemIndexStr) - 1;

    //inputElement = checkbox that was clicked
    //inputValueStr = name of the owner option that was checked/unchecked
    const inputValueStr = inputElement.value.replace("owner", "");
    const claimsIndex = parseInt(inputValueStr) - 1;

    const targetItem = itemsArray[itemIndex];

    if (inputElement.checked) {
        targetItem.claimed[claimsIndex] = 1;
        targetItem.numClaimers += 1;
    } else {
        targetItem.claimed[claimsIndex] = 0;
        targetItem.numClaimers -= 1;
    }
}

//Select All button was clicked. Update claims and toggle button.
function updateClaimsAll(ancestorWrap){
        //ancestorWrap will be the outter-most item-wrap 
        const itemIndexStr = ancestorWrap.id.replace("item", "");
        const itemIndex = parseInt(itemIndexStr) - 1;
        const targetItem = itemsArray[itemIndex];

        //get all owner options for the item
        const ownerOptionsArray = ancestorWrap.querySelectorAll(".owner-option");
        //get the Select All button for that item section
        const button = ancestorWrap.querySelector(".selectAllButton");

        if(button.value.includes("Select All")){
            console.log("select all button was just clicked");
            //button is in select all mode, so update number of claimers and select all owner options
            targetItem.numClaimers = numOwners;
            for (let i=0; i<targetItem.claimed.length; i++){
                //update the item object: change claimed status of all owners to 'claimed'
                targetItem.claimed[i] = 1;
            }
            for(let i=0; i<ownerOptionsArray.length; i++){
                //put a checkmark for each owner option
                ownerOptionsArray[i].checked = true;
            }
            //update the button value and display
            button.value = "Deselect All";
            button.textContent = "Deselect All";
        }else{
            console.log("deselect button was just clicked");
            //button is in deselect all mode, so deselect all owner options
            targetItem.numClaimers = 0;
            for (let i=0; i<targetItem.claimed.length; i++){
                //update the item object: change claimed status of all owners to 'not claimed'
                targetItem.claimed[i] = 0;
            }
            for(let i=0; i<ownerOptionsArray.length; i++){
                //check the owner options
                ownerOptionsArray[i].checked = false;
            }
            //update the button value and display
            button.value = "Select All";
            button.textContent = "Select All";
        }

}

//calculates the alloated prices for the items and pushes to the owner objects
function calculate() {
    let itemsSubtotal = 0;
    for (let i = 0; i < itemsArray.length; i++) {
        const targetItem = itemsArray[i];
        const allocPrice = targetItem.price / targetItem.numClaimers;
        itemsSubtotal += parseFloat(targetItem.price); //to get the subtotal for all items and all owners
    
        for (let j = 0; j < targetItem.claimed.length; j++) {
            if (targetItem.claimed[j] > 0) {
                ownersArray[j].subtotal += allocPrice;
                ownersArray[j].claimedItems.push([targetItem, allocPrice]);
            }
        }

    }

    //TO DO: call allocateTax and allocateTip
    allocateTip(itemsSubtotal);
}

//Checks that sum of allocated totals equals runningTotal
//If not, prints error message or allocates the difference if due to rounding
function checkTotal(){
    let allocatedTotalAll = 0;
    let highestOwner = 0; //figure out who has highest subtotal to allocate rounding diff to

    for(let i=0; i<ownersArray.length; i++){
        allocatedTotalAll += parseFloat(ownersArray[i].subtotal) + parseFloat(ownersArray[i].allocTip);
        console.log("i: " + i + " allocated total = " + allocatedTotalAll);
        if(ownersArray[i].subtotal > ownersArray[highestOwner]){
            highestOwner = i;
        }
    }
    const difference = (allocatedTotalAll - runningTotal).toFixed(2);
    console.log("difference: " + difference);
    if(difference < .01 && difference > -.01){
        console.log("no difference between allocated and running total");
        return;
    }else if (difference == .01 || difference == -.01){
        console.log("difference is due to rounding");
        if(difference < .01 && difference > -.01){
            //plug the difference to tax and tip
            if(document.getElementById("tip-div" == null)){
                ownersArray[highestOwner].allocTip += difference;
                displaySummary();
            }else{
            //if tax and tip div has not yet been created, allocate to owner's first item
                const ownersFirstItem = ownersArray[highestOwner].claimedItems[0];
                ownersFirstItem[1] += difference;
                displaySummary();
            }
        }
    }else{//difference is due to an unallocated item
        const errorDiv = document.getElementById("error-div");
        errorDiv.textContent = "Allocated Total = $" + parseFloat(allocatedTotalAll).toFixed(2) +
            ". One or more items may not have been allocated...";
    }
}

function createTipDiv(){
    //if tip has not been created yet, make the tip div
    if(document.getElementById("tip-wrapper") == null){
        const tipDiv = document.createElement("div");
        tipDiv.id = "tip-wrapper";
        const tipHeader = document.createElement("h4");
        tipHeader.textContent = "Tax & Tip";
        tipHeader.id = "tip-header";
        const tipInput = document.createElement("input");
        tipInput.id = "tip-input";
        tipInput.setAttribute("type", "text");
        tipInput.setAttribute("placeholder", "Enter tip amount");
        const tipAmtSpan = document.createElement("span");
        tipAmtSpan.id = "tip-amt-span";
    
        tipDiv.appendChild(tipHeader);
        tipDiv.appendChild(tipInput);
        tipDiv.appendChild(document.createElement("br"));
        tipDiv.appendChild(tipInput);
        tipDiv.appendChild(tipAmtSpan);
    
        //place tips above the buttons div (always the last item)
        const buttonsDiv = document.getElementById("buttons-div");
        buttonsDiv.prepend(tipDiv);
    }else{
        //else tip has already been created, so do nothing
        return;
    }
}


function allocateTip(populationSubtotal){
    const tipInputElement = document.getElementById("tip-input");
    let tipAmt;
    if(tipInputElement == null){
        //tip hasn't been created yet, so do nothing
        return;
    }else{
        //get inputted tip amt
        if(isAnExpression(tipInputElement.value)){
            tipAmt = parseFloat(solveExpression(tipInputElement.value), 2);
        }else{
            tipAmt = parseFloat(tipInputElement.value, 2);
        }
        if(isNaN(tipAmt)){
            tipAmt = 0.00;
        }
    }
    //allocate the tip amount to each owner
    //pushes allocated tip amount to each owner object
    for (let i=0; i<ownersArray.length; i++){
        let proportion  = ownersArray[i].subtotal/populationSubtotal;
        console.log("populationSubtotal is " + populationSubtotal);
        console.log("porportion is: " + proportion);
        ownersArray[i].proportion = parseFloat(proportion).toFixed(2);
        let allocTip = (proportion * tipAmt);
        ownersArray[i].allocTip = allocTip;
        console.log(ownersArray[i].nickname + ": subtotal: " + ownersArray[i].subtotal +", "
            +"proportion: " + ownersArray[i].proportion +", " 
            + "allocTip: " + ownersArray[i].allocTip
        );
    }

}

function resetOwnerTotals() {
    for (let i = 0; i < ownersArray.length; i++) {
        const owner = ownersArray[i];
        owner.resetTotal();
        owner.resetClaimedItems();
    }
}


function updateRunningTotal(oldPrice, itemPrice) {
    runningTotal -= parseFloat(oldPrice); 
    runningTotal += parseFloat(itemPrice);
    const targetElement = document.getElementById("running-total");
    targetElement.textContent = "Total: $" + runningTotal.toFixed(2);
}

function displaySummary() {
    const newWrapperDiv = document.createElement("div");
    newWrapperDiv.id = "summary";
    for (let i = 0; i < ownersArray.length; i++) {
        const targetOwner = ownersArray[i];

        const newDiv_owner = document.createElement("div");
        newDiv_owner.className = "owner-div";

        const newSpan_name = document.createElement("span");
        newSpan_name.className = "nickname-span";
        newSpan_name.textContent = targetOwner.nickname + ": ";

        //TO DO: update proportion even if tip is not added in yet
        // const newSpan_proportion = document.createElement("span");
        // newSpan_proportion.className = "proportion-span";
        // newSpan_proportion.textContent = targetOwner.proportion * 100 + "%";

        const newUL_claimedItems = document.createElement("ul");
        let targetOwnerTotal = 0;
        for (let j = 0; j < targetOwner.claimedItems.length; j++) {
            const newLI_item = document.createElement("li");
            const targetClaimedItem = targetOwner.claimedItems[j];
            const claimedItemCost = targetClaimedItem[1];
            targetOwnerTotal += claimedItemCost;
            newLI_item.textContent = targetClaimedItem[0].itemName + " - $" + parseFloat(claimedItemCost).toFixed(2);
            newUL_claimedItems.appendChild(newLI_item);
        }

        //begin section for owner's tip and tax
        const newLI_tip = document.createElement("li");
        newLI_tip.className = "liTip";
        newLI_tip.textContent = "Tax & Tip - $" + parseFloat(ownersArray[i].allocTip).toFixed(2);
        newUL_claimedItems.appendChild(newLI_tip);
        targetOwnerTotal += parseFloat(ownersArray[i].allocTip);
        targetOwnerTotal = targetOwnerTotal;
        console.log("targetOwnerTotal: " + targetOwnerTotal);

        const newSpan_ownerTotal = document.createElement("span")
        newSpan_ownerTotal.className = "ownerTotal-span";
        newSpan_ownerTotal.textContent = "$"+ parseFloat(targetOwnerTotal).toFixed(2);

        newDiv_owner.appendChild(newSpan_name);
        // newDiv_owner.appendChild(newSpan_proportion);
        newDiv_owner.appendChild(newSpan_ownerTotal);
        newDiv_owner.appendChild(newUL_claimedItems);
        newWrapperDiv.appendChild(newDiv_owner);
    }
    document.getElementById("summary-wrapper").innerHTML = "";
    document.getElementById("summary-wrapper").appendChild(newWrapperDiv);
}


window.onload = onStart;
