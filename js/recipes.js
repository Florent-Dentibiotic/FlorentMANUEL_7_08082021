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

// EventListener for displaying search inputs
btnSearch.forEach(element => element.addEventListener('focusin', openSearchInput))
inputsSearch.forEach(element => element.addEventListener('focusout', closeSearchInput))

function openSearchInput(){
    this.firstElementChild.nextElementSibling.classList.replace('d-none', 'd-block')
    this.firstElementChild.classList.replace('d-block', 'd-none')
    this.lastElementChild.classList.replace('d-none', 'd-block')
    this.firstElementChild.nextElementSibling.focus()
}

function closeSearchInput(){
    this.parentElement.firstElementChild.nextElementSibling.classList.replace('d-block', 'd-none')
    this.parentElement.firstElementChild.classList.replace('d-none', 'd-block')
    this.parentElement.lastElementChild.classList.replace('d-block', 'd-none')
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
    /*for (let i = 0; i < data.recipes.length; i++){
        // Adding all recipies to recipes section
            // first line of the recipe
        let newRecipe = document.createElement('div')
        recipesSection.appendChild(newRecipe)
        newRecipe.classList.add('recipe')
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
            // adding data attributes for appliance & ustensils
        let allUstensils = data.recipes[i].ustensils
        newRecipe.setAttribute('data-appliance', data.recipes[i].appliance)
        newRecipe.setAttribute('data-ustensils', allUstensils)

            // adding all ingredients/appliance/ustensils to the ingredients inputs
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
    }*/ 
    }
    );

function deployJSON(data){
    for (let i = 0; i < data.recipes.length; i++){
        // Adding all recipies to recipes section
            // first line of the recipe
        let newRecipe = document.createElement('div')
        recipesSection.appendChild(newRecipe)
        newRecipe.classList.add('recipe')
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
            // adding data attributes for appliance & ustensils
        let allUstensils = data.recipes[i].ustensils
        newRecipe.setAttribute('data-appliance', data.recipes[i].appliance)
        newRecipe.setAttribute('data-ustensils', allUstensils)

            // adding all ingredients/appliance/ustensils to the ingredients inputs
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
}