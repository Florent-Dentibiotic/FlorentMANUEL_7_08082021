const myRequest = new Request('recipes.json')
const recipesSection = document.querySelector('.recipes')
const ingredientsMenu = document.querySelector('.ingredients__menu')
const applianceMenu = document.querySelector('.appliance__menu')
const ustensilsMenu = document.querySelector('.ustensils__menu')
const btnSearchNodes = document.querySelectorAll('.btn__group__search')
const btnSearch = Array.from(btnSearchNodes)
const firstInputSearch = document.querySelector('.first__form__input')
const inputsSearchNodes = document.querySelectorAll('.input__search')
const inputsSearch = Array.from(inputsSearchNodes)
let allRecipes = {}
let allRecipeData = []
let newAllRecipeData = []
const chevronUp = document.querySelectorAll('.fa-chevron-up')
const selectedItems = document.querySelector('.selected__items')
let everyIngredients = {}
let everyAppliances = {}
let everyUstensils = {}

// EventListener for displaying search inputs
btnSearch.forEach(element => element.addEventListener('focusin', openSearchInput))
chevronUp.forEach(element => element.addEventListener('click', closeSearchInput))
inputsSearch.forEach(element => element.addEventListener('keyup', searchItem))
firstInputSearch.addEventListener('keyup', searchItem)

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
    this.parentElement.firstElementChild.value = ""
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
    deployInputsElements(data.recipes)
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

        allRecipeData = Array.from(document.querySelectorAll('.recipe'))
    } 
}

function deployInputsElements(data){
    if(everyIngredients != {} && data.length < 50 ){
        Array.from(newIngredientUl.children).forEach(element => element.remove())
        Array.from(newApplianceUl.children).forEach(element => element.remove())
        Array.from(newUstensilsUl.children).forEach(element => element.remove())
        newIngredientsArray = []
        newApplianceArray = []
        newUstensilsArray = []
    }
    for (const recipe of data){
        let allIngredients = recipe.ingredients
        let allUstensils = recipe.ustensils
        for(const ingredient of allIngredients){
            if(! newIngredientsArray.includes(ingredient.ingredient)){
                newIngredientsArray.push(ingredient.ingredient)
                let newLi = document.createElement('li')
                newLi.classList.add('ingredient')
                newIngredientUl.appendChild(newLi)
                newLi.textContent = ingredient.ingredient
            } 
        }
        if(! newApplianceArray.includes(recipe.appliance)){
            newApplianceArray.push(recipe.appliance)
            let newLi = document.createElement('li')
            newLi.classList.add('appliance')
            newApplianceUl.appendChild(newLi)
            newLi.textContent = recipe.appliance
        }
        for(const ustensil of allUstensils){
            if(! newUstensilsArray.includes(ustensil)){
                newUstensilsArray.push(ustensil)
                let newLi = document.createElement('li')
                newLi.classList.add('ustensil')
                newUstensilsUl.appendChild(newLi)
                newLi.textContent = ustensil
            }
        }
    }
    everyIngredients = document.querySelectorAll('.ingredient')
    everyAppliances = document.querySelectorAll('.appliance')
    everyUstensils = document.querySelectorAll('.ustensil')
    everyIngredients.forEach(element => element.addEventListener('click', selectElement))
    everyAppliances.forEach(element => element.addEventListener('click', selectElement))
    everyUstensils.forEach(element => element.addEventListener('click', selectElement))
}


// Add and Remove Selected items from inputs lists
function selectElement(data){
    if(this.classList != undefined){
        let newDiv = document.createElement('div')
        selectedItems.appendChild(newDiv)
        newDiv.classList.add("item")
        newDiv.classList.add(`selected__items__${this.classList[0]}`)
        newDiv.innerHTML = `${this.innerHTML} <i class="far fa-times-circle"></i>`

        let cross = document.querySelectorAll('.fa-times-circle')
        cross.forEach(element => element.addEventListener('click', removeElement))
    }

    if(this.classList == undefined) {
        console.log(data)
        if(data.classList[1] == 'selected__items__ingredient'){
            //console.log(data.innerText)
            for(const recipe of allRecipeData){
                let isInclude = Array.from(recipe.lastElementChild.children[2].children).some(element => element.innerHTML.toLowerCase().includes(data.innerText.toLowerCase()))
                if(isInclude == false){
                    recipe.classList.replace('d-block', 'd-none')
                } else {
                    recipe.classList.replace('d-none', 'd-block')
                }
            }
        } else if(data.classList[1] == 'selected__items__appliance'){
            for(const recipe of allRecipeData){
                let isInclude = recipe.attributes[1].value.toLowerCase().includes(data.innerText.toLowerCase())
                if(isInclude == false){
                    recipe.classList.replace('d-block', 'd-none')
                } else {
                    recipe.classList.replace('d-none', 'd-block')
                }
            }
        } else if(data.classList[1] == 'selected__items__ustensil'){
            for(const recipe of allRecipeData){
                let isInclude = recipe.attributes[2].value.toLowerCase().includes(data.innerText.toLowerCase())
                if(isInclude == false){
                    recipe.classList.replace('d-block', 'd-none')
                } else {
                    recipe.classList.replace('d-none', 'd-block')
                }
            }
        } 
    } else if(this.classList[0] == 'ingredient'){
        for(const recipe of allRecipeData){
            let isInclude = Array.from(recipe.lastElementChild.children[2].children).some(element => element.innerHTML.toLowerCase().includes(this.innerHTML.toLowerCase()))
            if(isInclude == false){
                recipe.classList.replace('d-block', 'd-none')
            }
        }
    } else if(this.classList[0] == 'appliance'){
        for(const recipe of allRecipeData){
            let isInclude = recipe.attributes[1].value.toLowerCase().includes(this.innerHTML.toLowerCase())
            if(isInclude == false){
                recipe.classList.replace('d-block', 'd-none')
            }
        }
    } else if(this.classList[0] == 'ustensil'){
        for(const recipe of allRecipeData){
            let isInclude = recipe.attributes[2].value.toLowerCase().includes(this.innerHTML.toLowerCase())
            if(isInclude == false){
                recipe.classList.replace('d-block', 'd-none')
            }
        }
    } 
    filterItems()
}

// filter ingredients/appliances/ustensils from selected recipes
function filterItems(){
    let allVisibleRecipes = allRecipeData.filter(element => element.classList[1] == "d-block")
    let newRecipeData = []
    for(const visibleRecipe of allVisibleRecipes){
        let visibleIndex = allRecipeData.findIndex(element => element == visibleRecipe)
        newRecipeData.push(allRecipes.recipes[visibleIndex])
    }
    deployInputsElements(newRecipeData)
}

function removeElement(){
    this.parentElement.remove()
    if(selectedItems.children.length == 1){
        selectElement(selectedItems.children[0])
    } else if(selectedItems.children.length == 2){
        selectElement(selectedItems.children[0])
        selectElement(selectedItems.children[1])
    } else {
        for (const child of recipesSection.children){
            child.classList.replace('d-none', 'd-block')
        }
        filterItems()
    }
}

// search item in inputs lists
function searchItem(){
    if(this.classList[1] == 'input__search__primary'){
        let thisArray = Array.from(everyIngredients).filter(element => element.innerHTML.toLowerCase().includes(this.value.toLowerCase()))
        Array.from(newIngredientUl.children).forEach(element => element.remove())
        thisArray.forEach(element => newIngredientUl.appendChild(element))
    } else if (this.classList[1] == 'input__search__secondary'){
        let thisArray = Array.from(everyAppliances).filter(element => element.innerHTML.toLowerCase().includes(this.value.toLowerCase()))
        Array.from(newApplianceUl.children).forEach(element => element.remove())
        thisArray.forEach(element => newApplianceUl.appendChild(element))
    } else if (this.classList[1] == 'input__search__tertiary'){
        let thisArray = Array.from(everyUstensils).filter(element => element.innerHTML.toLowerCase().includes(this.value.toLowerCase()))
        Array.from(newUstensilsUl.children).forEach(element => element.remove())
        thisArray.forEach(element => newUstensilsUl.appendChild(element))
    } /*else if (this.classList[0] == 'first__form__input'){
        let thisIngredientArray = Array.from(everyIngredients).filter(element => element.innerHTML.toLowerCase().includes(this.value.toLowerCase()))
        Array.from(newIngredientUl.children).forEach(element => element.remove())
        thisIngredientArray.forEach(element => newIngredientUl.appendChild(element))
        let thisApplianceArray = Array.from(everyAppliances).filter(element => element.innerHTML.toLowerCase().includes(this.value.toLowerCase()))
        Array.from(newApplianceUl.children).forEach(element => element.remove())
        thisApplianceArray.forEach(element => newApplianceUl.appendChild(element))
        let thisUstensilsArray = Array.from(everyUstensils).filter(element => element.innerHTML.toLowerCase().includes(this.value.toLowerCase()))
        Array.from(newUstensilsUl.children).forEach(element => element.remove())
        thisUstensilsArray.forEach(element => newUstensilsUl.appendChild(element))
    }*/
}

// search recipe from ingredients/appliance/ustensils
/*function searchRecipe(data, source){
    let allRecipeMethod = document.querySelectorAll('.recipe__howto')
    if(data.value.length >= 3){
        if(data.classList[1] == 'input__search__primary'){
            for (let i = 0; i < allRecipeData.length; i++){
                let isInclude = Array.from(allRecipeData[i].lastElementChild.children[2].children).some(element => element.innerHTML.toLowerCase().includes(data.value.toLowerCase()))
                if(isInclude == false){
                    allRecipeData[i].classList.replace('d-block', 'd-none')
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
        // for first input to check in ingredients/appliance/ustensils/recipe
        else if (data.classList[0] == 'first__form__input'){
            for (let i = 0; i < allRecipeData.length; i++){
                let isIngredient = Array.from(allRecipeData[i].lastElementChild.children[2].children).some(element => element.innerHTML.toLowerCase().includes(data.value.toLowerCase()))
                let isAppliance = allRecipeData[i].attributes[1].value.toLowerCase().includes(data.value.toLowerCase()) 
                let isUstensil = allRecipeData[i].attributes[2].value.toLowerCase().includes(data.value.toLowerCase())
                let isMethod = allRecipeMethod[i].innerHTML.toLowerCase().includes(data.value.toLowerCase())
                if(isIngredient == false && isAppliance == false && isUstensil == false && isMethod == false){
                    recipesSection.children[i].classList.replace('d-block', 'd-none')
                } 
            }  
        } 
    } else if (data.classList[0] == 'ingredient' || data.classList[0] == 'appliance' || data.classList[0] == 'ustensil'){
        for (let i = 0; i < source.length; i++){
            let isIngredient = Array.from(source[i].lastElementChild.children[2].children).some(element => element.innerHTML.toLowerCase().includes(data.innerHTML.toLowerCase()))
            let isAppliance = source[i].attributes[1].value.toLowerCase().includes(data.innerHTML.toLowerCase()) 
            let isUstensil = source[i].attributes[2].value.toLowerCase().includes(data.innerHTML.toLowerCase())
            if(isIngredient == false && isAppliance == false && isUstensil == false){
                recipesSection.children[i].classList.replace('d-block', 'd-none')
            } else {
                recipesSection.children[i].classList.replace('d-none', 'd-block')
            }
        } 
    } else {
        for (let i = 0; i < recipesSection.children.length; i++){
            recipesSection.children[i].classList.replace('d-none', 'd-block')
        }
    }
}*/