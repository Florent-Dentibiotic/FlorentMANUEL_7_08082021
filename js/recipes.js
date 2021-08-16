const myRequest = new Request('recipes.json')
const recipesSection = document.querySelector('.recipes')
const ingredientsMenu = document.querySelector('ul.ingredients__menu')
const applianceMenu = document.querySelector('ul.appliance__menu')
const ustensilsMenu = document.querySelector('ul.ustensils__menu')
const btnSearchNodes = document.querySelectorAll('.btn__group__search')
const btnSearch = Array.from(btnSearchNodes)
const firstInputSearch = document.querySelector('.first__form__input')
const inputsSearchNodes = document.querySelectorAll('.input__search')
const chevronUp = document.querySelectorAll('.fa-chevron-up')
const selectedItems = document.querySelector('.selected__items')
let allRecipes = {}
let newIngredientsArray = []
let newApplianceArray = []
let newUstensilsArray = []

// JSON extraction
fetch(myRequest)
.then(response => response.json())
.then(function extractRecipes(data){
    allRecipes = data.recipes
    deployJSON(data.recipes)
    }
    );

// Event listener
    // to open and close search inputs 
btnSearchNodes.forEach(element => element.addEventListener('focusin', openSearchInput))
chevronUp.forEach(element => element.addEventListener('click', closeSearchInput))
inputsSearchNodes.forEach(element => element.addEventListener('keyup', searchRecipe))
firstInputSearch.addEventListener('keyup', searchRecipe)

function deployJSON(data){
    data.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    for (const recipe of data){
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
        newH2.textContent = recipe.name
        let newH3 = document.createElement('h3')
        newRecipeDetails.appendChild(newH3)
        newH3.innerHTML = `<i class="far fa-clock"></i> ${recipe.time} min`

            // list of ingredients + recipe
        let newUl = document.createElement('ul')
        newRecipeDetails.appendChild(newUl)
        newUl.classList.add('recipe__ingredient')
        let allIngredients = recipe.ingredients
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
        newP.textContent = recipe.description
        newP.classList.add('recipe__howto')
            // adding data attributes for appliance & ustensils
        let allUstensils = recipe.ustensils
        newRecipe.setAttribute('data-appliance', recipe.appliance)
        newRecipe.setAttribute('data-ustensils', allUstensils)

        for(const ingredient of allIngredients){
            if(! newIngredientsArray.includes(ingredient.ingredient)){
                newIngredientsArray.push(ingredient.ingredient)
            }
        }
        if(! newApplianceArray.includes(recipe.appliance)){
            newApplianceArray.push(recipe.appliance)
        }
        for(const ustensil of allUstensils){
            if(! newUstensilsArray.includes(ustensil)){
                newUstensilsArray.push(ustensil)
            }
        }
    } 
    newIngredientsArray.sort()
    newApplianceArray.sort()
    newUstensilsArray.sort()
    for (const ingredient of newIngredientsArray){
        let newLi = document.createElement('li')
        newLi.classList.add('ingredient')
        newLi.classList.add('d-block')
        ingredientsMenu.appendChild(newLi)
        newLi.textContent = ingredient 
    }
    for (const appliance of newApplianceArray){
        let newLi = document.createElement('li')
        newLi.classList.add('appliance')
        newLi.classList.add('d-block')
        applianceMenu.appendChild(newLi)
        newLi.textContent = appliance
    }
    for (const ustensil of newUstensilsArray){
        let newLi = document.createElement('li')
        newLi.classList.add(`ustensil`)
        newLi.classList.add('d-block')
        ustensilsMenu.appendChild(newLi)
        newLi.textContent = ustensil
    }

    //Event listener for selecting items
    ingredientsMenu.childNodes.forEach(element => element.addEventListener('click', function(){
        selectingItems (element);
    }))
    applianceMenu.childNodes.forEach(element => element.addEventListener('click', function(){
        selectingItems (element);
    }))
    ustensilsMenu.childNodes.forEach(element => element.addEventListener('click', function(){
        selectingItems (element);
    }))

    /*const ingredientsDisponible = document.querySelectorAll('.ingredient')
    const applianceDisponible = document.querySelectorAll('.appliance')
    const ustensilDisponible = document.querySelectorAll('.ustensil')
    ingredientsDisponible.forEach(element => element.addEventListener('click', selectingItems))
    applianceDisponible.forEach(element => element.addEventListener('click', selectingItems))
    ustensilDisponible.forEach(element => element.addEventListener('click', selectingItems))*/
}

function openSearchInput(){
    let btnActive = btnSearch.filter(element => element.firstElementChild.classList[2] == 'd-none')
    if (btnActive.length > 0){
        btnActive[0].firstElementChild.classList.replace('d-none', 'd-block')
        btnActive[0].lastElementChild.classList.replace('d-block', 'd-none')
    }
    this.firstElementChild.classList.replace('d-block', 'd-none')
    this.lastElementChild.classList.replace('d-none', 'd-block')
    this.lastElementChild.firstElementChild.focus()
}

function closeSearchInput(){
    this.parentElement.previousElementSibling.classList.replace('d-none', 'd-block')
    this.parentElement.classList.replace('d-block', 'd-none')
    this.previousElementSibling.value = ""
}

function selectingItems(infos){
    let newDiv = document.createElement('div')
    selectedItems.appendChild(newDiv)
    newDiv.classList.add("item")
    newDiv.classList.add(`selected__items__${infos.classList[0]}`)
    newDiv.innerHTML = `${infos.innerHTML}<i class="far fa-times-circle"></i>`

    const allItems = document.querySelectorAll('.btn__group li')
    const thisItem = Array.from(allItems).find(element => element.innerText == infos.innerText)
    thisItem.classList.replace('d-block','d-none')

    let cross = document.querySelectorAll('.fa-times-circle')
    cross.forEach(element => element.addEventListener('click', removeElement))
}

function removeElement(){
    this.parentElement.remove()

    const allItems = document.querySelectorAll('.btn__group li')
    const thisItem = Array.from(allItems).find(element => element.innerText == this.parentElement.innerText)
    thisItem.classList.replace('d-none','d-block')
    /*if(selectedItems.children.length > 0){
        for (const child of recipesSection.children){
            child.classList.replace('d-none', 'd-block')
        }
        for(const child of selectedItems.children){
            selectElement(child)
        }
    } else {
        for (const child of recipesSection.children){
            child.classList.replace('d-none', 'd-block')
        }
    }*/
}

function filterItems(inputOrigin){
    if(inputOrigin.type != "search"){
        const everyItems = inputOrigin.nextElementSibling.nextElementSibling.childNodes
        if(inputOrigin.value.length > 3){
            for(const item of everyItems){
                if(!item.innerText.includes(inputOrigin.value)){
                    item.classList.replace('d-block','d-none')
                }else if(item.innerText.includes(inputOrigin.value)){
                    item.classList.replace('d-none','d-block')
                }
            }
        } else if (selectedItems.childElementCount > 0) {
            everyItems.forEach(element => element.classList.replace('d-none','d-block'))
            for(const item of selectedItems.children){
                const allItems = document.querySelectorAll('.btn__group li')
                const thisItem = Array.from(allItems).find(element => element.innerText == item.innerText)
                thisItem.classList.replace('d-block','d-none')
            }
        } else {
            everyItems.forEach(element => element.classList.replace('d-none','d-block'))
        }
    }
}

function searchRecipe(){
    if(this.value.length > 3){
        recipeSelected = []
        for(const recipe of allRecipes){
            let inName = recipe.name.toLowerCase().includes(this.value.toLowerCase())
            let inDescription = recipe.description.toLowerCase().includes(this.value.toLowerCase())
            let inAppliance = recipe.appliance.toLowerCase().includes(this.value.toLowerCase())
            let inUstensils = recipe.ustensils.some(element => element.toLowerCase() == this.value.toLowerCase())
            let inIngredients = recipe.ingredients.some(element => element.ingredient.toLowerCase() == this.value.toLowerCase())
            if(inName != false || inDescription != false || inAppliance != false || inUstensils != false || inIngredients != false){
                recipeSelected.push(recipe)
            }
        }
        const recipes = document.querySelectorAll('.recipe')
        recipes.forEach(element => element.remove())
        deployJSON(recipeSelected)
    } else {
        deployJSON(allRecipes)
    }
    filterItems(this)
}
/*function deployInputsElements(data){
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

    if(selectedItems.children.length > 0){
        for(const child of selectedItems.children){
            if(child.classList[1] == 'selected__items__ingredient'){
                for(const ingredient of everyIngredients){
                    if(ingredient.innerText == child.innerText.trim()){
                        ingredient.remove()
                    }
                }
            } else if(child.classList[1] == 'selected__items__appliance'){
                for(const appliance of everyAppliances){
                    if(appliance.innerText == child.innerText.trim()){
                        appliance.remove()
                    }
                }
            } else if(child.classList[1] == 'selected__items__ustensil'){
                for(const ustensil of everyUstensils){
                    if(ustensil.innerText == child.innerText.trim()){
                        ustensil.remove()
                    }
                }
            } 
        }
    }
}


// Add and Remove Selected items from inputs lists
function selectElement(source){
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
        console.log(source)
        if(source.classList[1] == 'selected__items__ingredient'){
            for(const recipe of allRecipeData){
                let isInclude = Array.from(recipe.lastElementChild.children[2].children).some(element => element.innerHTML.toLowerCase().includes(source.innerText.trim().toLowerCase()))
                if(isInclude == false){
                    recipe.classList.replace('d-block', 'd-none')
                } 
            }
        } else if(source.classList[1] == 'selected__items__appliance'){
            for(const recipe of allRecipeData){
                let isInclude = recipe.attributes[1].value.toLowerCase().includes(source.innerText.trim().toLowerCase())
                if(isInclude == false){
                    recipe.classList.replace('d-block', 'd-none')
                } 
            }
        } else if(source.classList[1] == 'selected__items__ustensil'){
            for(const recipe of allRecipeData){
                let isInclude = recipe.attributes[2].value.toLowerCase().includes(source.innerText.trim().toLowerCase())
                if(isInclude == false){
                    recipe.classList.replace('d-block', 'd-none')
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
    adjustInputLenght()
}

function removeElement(){
    this.parentElement.remove()
    if(selectedItems.children.length > 0){
        for (const child of recipesSection.children){
            child.classList.replace('d-none', 'd-block')
        }
        for(const child of selectedItems.children){
            selectElement(child)
        }
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
    }
    adjustInputLenght()
}

// search recipe from first input in ingredients/appliance/ustensils/method
function searchRecipe(){
    if(this.value.length >= 3){
        for(const recipe of allRecipeData){
            let ingredientsIncluded = Array.from(recipe.lastElementChild.children[2].children).some(element => element.innerHTML.toLowerCase().includes(this.value.toLowerCase()))
            let appliancesIncluded = recipe.attributes[1].value.toLowerCase().includes(this.value.toLowerCase())
            let ustensilsIncluded = recipe.attributes[2].value.toLowerCase().includes(this.value.toLowerCase())
            let methodIncluded = recipe.children[1].lastElementChild.innerHTML.toLowerCase().includes(this.value.toLowerCase())
            if(ingredientsIncluded == false && appliancesIncluded == false && ustensilsIncluded == false && methodIncluded == false){
                recipe.classList.replace('d-block', 'd-none')
                filterItems()
            } else{
                recipe.classList.replace('d-none', 'd-block')
            }
        }
    } else {
        if(selectedItems.children.length > 0){
            for (const child of recipesSection.children){
                child.classList.replace('d-none', 'd-block')
            }
            for(const child of selectedItems.children){
                selectElement(child)
            }
        } else {
            for (const child of recipesSection.children){
                child.classList.replace('d-none', 'd-block')
            }
            filterItems()
        }
    }
}*/