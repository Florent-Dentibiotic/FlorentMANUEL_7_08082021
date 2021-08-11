const myRequest = new Request('recipes.json')
const recipesSection = document.querySelector('.recipes')
const ingredientsMenu = document.querySelector('.ingredients__menu')
const applianceMenu = document.querySelector('.appliance__menu')
const ustensilsMenu = document.querySelector('.ustensils__menu')
const btnSearchNodes = document.querySelectorAll('.btn__group__search')
const btnSearch = Array.from(btnSearchNodes)
const inputsSearchNodes = document.querySelectorAll('.input__search')
const inputsSearch = Array.from(inputsSearchNodes)
let allRecipes = {}
const chevronUp = document.querySelectorAll('.fa-chevron-up')
const selectedItems = document.querySelector('.selected__items')
let everyIngredients = {}
let everyAppliances = {}
let everyUstensils = {}

// EventListener for displaying search inputs
btnSearch.forEach(element => element.addEventListener('focusin', openSearchInput))
chevronUp.forEach(element => element.addEventListener('click', closeSearchInput))
inputsSearch.forEach(element => element.addEventListener('keyup', searchItem))

function openSearchInput(){
    let btnActive = btnSearch.filter(element => element.firstElementChild.classList[2] == 'd-none')
    if (btnActive.length > 0){
        btnActive[0].firstElementChild.nextElementSibling.classList.replace('d-block', 'd-none')
        btnActive[0].firstElementChild.classList.replace('d-none', 'd-block')
        btnActive[0].lastElementChild.classList.replace('d-block', 'd-none')
    }
    this.firstElementChild.nextElementSibling.classList.replace('d-none', 'd-block')
    this.firstElementChild.classList.replace('d-block', 'd-none')
    this.lastElementChild.classList.replace('d-none', 'd-block')
    this.firstElementChild.nextElementSibling.firstElementChild.focus()
}

function closeSearchInput(){
    this.parentElement.classList.replace('d-block', 'd-none')
    this.parentElement.parentElement.firstElementChild.classList.replace('d-none', 'd-block')
    this.parentElement.parentElement.lastElementChild.classList.replace('d-block', 'd-none')
}

// Ul creation for Ingredients/Appliance/Ustensils
let newIngredientUl = document.createElement('ul')
ingredientsMenu.appendChild(newIngredientUl)
let newIngredientsArray = []

let newApplianceUl = document.createElement('ul')
applianceMenu.appendChild(newApplianceUl)
let newApplianceArray = []

let newUstensilsUl = document.createElement('ul')
ustensilsMenu.appendChild(newUstensilsUl)
let newUstensilsArray = []

// JSON extraction
fetch(myRequest)
.then(response => response.json())
.then(function extractRecipes(data){
    allRecipes = data
    deployJSON(data)
    deployInputsElements(data)
    }
    );

function deployJSON(data){
    for (let i = 0; i < data.recipes.length; i++){
        // Adding all recipies to recipes section
            // first line of the recipe
        let newRecipe = document.createElement('div')
        recipesSection.appendChild(newRecipe)
        newRecipe.classList.add('recipe')
        newRecipe.classList.add('d-block')
        let newRecipeImg = document.createElement('div')
        newRecipe.appendChild(newRecipeImg)
        newRecipeImg.classList.add('recipe__img')
        let newRecipeDetails = document.createElement('div')
        newRecipe.appendChild(newRecipeDetails)
        newRecipeDetails.classList.add('recipe__details')
        let newH2 = document.createElement('h2')
        newRecipeDetails.appendChild(newH2)
        newH2.textContent = data.recipes[i].name
        let newH3 = document.createElement('h3')
        newRecipeDetails.appendChild(newH3)
        newH3.innerHTML = `<i class="far fa-clock"></i> ${data.recipes[i].time} min`

            // list of ingredients + recipe
        let newUl = document.createElement('ul')
        newRecipeDetails.appendChild(newUl)
        newUl.classList.add('recipe__ingredient')
        let allIngredients = data.recipes[i].ingredients
        allIngredients.forEach(element => {
            let newLi = document.createElement('li')
            newUl.appendChild(newLi)
            if(element.unit != undefined && element.quantity != undefined){
                newLi.innerHTML = `<strong>${element.ingredient} : </strong> ${element.quantity} ${element.unit}`
            } else if (element.quantity != undefined){
                newLi.innerHTML = `<strong>${element.ingredient} : </strong> ${element.quantity}`
            } else {
                newLi.innerHTML = `<strong>${element.ingredient}</strong>`
            }
        });
        let newP = document.createElement('p')
        newRecipeDetails.appendChild(newP)
        newP.textContent = data.recipes[i].description
        newP.classList.add('recipe__howto')
            // adding data attributes for appliance & ustensils
        let allUstensils = data.recipes[i].ustensils
        newRecipe.setAttribute('data-appliance', data.recipes[i].appliance)
        newRecipe.setAttribute('data-ustensils', allUstensils)
    } 
}

function deployInputsElements(data){
    for (let i = 0; i < data.recipes.length; i++){
        let allIngredients = data.recipes[i].ingredients
        let allUstensils = data.recipes[i].ustensils
        for(let i = 0; i < allIngredients.length; i++){
            if(! newIngredientsArray.includes(allIngredients[i].ingredient)){
                newIngredientsArray.push(allIngredients[i].ingredient)
                let newLi = document.createElement('li')
                newLi.classList.add('ingredient')
                newIngredientUl.appendChild(newLi)
                newLi.textContent = allIngredients[i].ingredient
            } 
        }
        if(! newApplianceArray.includes(data.recipes[i].appliance)){
            newApplianceArray.push(data.recipes[i].appliance)
            let newLi = document.createElement('li')
            newLi.classList.add('appliance')
            newApplianceUl.appendChild(newLi)
            newLi.textContent = data.recipes[i].appliance
        }
        for(let i = 0; i < allUstensils.length; i++){
            if(! newUstensilsArray.includes(allUstensils[i])){
                newUstensilsArray.push(allUstensils[i])
                let newLi = document.createElement('li')
                newLi.classList.add('ustensil')
                newUstensilsUl.appendChild(newLi)
                newLi.textContent = allUstensils[i]
            }
        }
    }
    let ingredients = document.querySelectorAll('.ingredient')
    let appliances = document.querySelectorAll('.appliance')
    let ustensils = document.querySelectorAll('.ustensil')
    everyIngredients = ingredients
    everyAppliances = appliances
    everyUstensils = ustensils
    ingredients.forEach(element => element.addEventListener('click', selectElement))
    appliances.forEach(element => element.addEventListener('click', selectElement))
    ustensils.forEach(element => element.addEventListener('click', selectElement))
}


// Add and Remove Selected items from inputs lists
function selectElement(){
    this.parentElement.parentElement.previousElementSibling.firstElementChild.value = this.innerText
    let newDiv = document.createElement('div')
    selectedItems.appendChild(newDiv)
    newDiv.classList.add("item")
    newDiv.classList.add(`selected__items__${this.classList[0]}`)
    newDiv.innerHTML = `${this.innerHTML} <i class="far fa-times-circle"></i>`

    let cross = document.querySelectorAll('.fa-times-circle')
    cross.forEach(element => element.addEventListener('click', removeElement))
}

function removeElement(){
    this.parentElement.remove()
}

// search item in inputs lists
function searchItem(){
    if(this.classList[1] == 'input__search__primary'){
        let thisArray = Array.from(everyIngredients).filter(element => element.innerHTML.toLowerCase().includes(this.value.toLowerCase()))
        Array.from(newIngredientUl.children).forEach(element => element.remove())
        thisArray.forEach(element => newIngredientUl.appendChild(element))
        searchRecipe(this)
    } else if (this.classList[1] == 'input__search__secondary'){
        let thisArray = Array.from(everyAppliances).filter(element => element.innerHTML.toLowerCase().includes(this.value.toLowerCase()))
        Array.from(newApplianceUl.children).forEach(element => element.remove())
        thisArray.forEach(element => newApplianceUl.appendChild(element))
        searchRecipe(this)
    } else if (this.classList[1] == 'input__search__tertiary'){
        let thisArray = Array.from(everyUstensils).filter(element => element.innerHTML.toLowerCase().includes(this.value.toLowerCase()))
        Array.from(newUstensilsUl.children).forEach(element => element.remove())
        thisArray.forEach(element => newUstensilsUl.appendChild(element))
        searchRecipe(this)
    }
}

// search recipe from ingredients/appliance/ustensils
function searchRecipe(data){
    let allRecipesIngredients = document.querySelectorAll('.recipe__ingredient')
    let allRecipeData = document.querySelectorAll('.recipe')
    if(data.value.length >= 3){
        if(data.classList[1] == 'input__search__primary'){
            for (let i = 0; i < allRecipesIngredients.length; i++){
                let isInclude = Array.from(allRecipesIngredients[i].children).some(element => element.innerHTML.toLowerCase().includes(data.value.toLowerCase()))
                if(isInclude == false){
                    allRecipesIngredients[i].parentElement.parentElement.classList.replace('d-block', 'd-none')
                } else {
                    allRecipeData[i].classList.replace('d-none', 'd-block')
                }
            }
        } else if (data.classList[1] == 'input__search__secondary'){
            for (let i = 0; i < allRecipeData.length; i++){
                let isInclude = allRecipeData[i].attributes[1].value.toLowerCase().includes(data.value.toLowerCase())
                if(isInclude == false){
                    allRecipeData[i].classList.replace('d-block', 'd-none')
                } else {
                    allRecipeData[i].classList.replace('d-none', 'd-block')
                }
            }  
        } else if (data.classList[1] == 'input__search__tertiary'){
            for (let i = 0; i < allRecipeData.length; i++){
                let isInclude = allRecipeData[i].attributes[2].value.toLowerCase().includes(data.value.toLowerCase())
                if(isInclude == false){
                    allRecipeData[i].classList.replace('d-block', 'd-none')
                } else {
                    allRecipeData[i].classList.replace('d-none', 'd-block')
                }
            }  
        }
    } else {
        for (let i = 0; i < recipesSection.children.length; i++){
            recipesSection.children[i].classList.replace('d-none', 'd-block')
        }
    }
}