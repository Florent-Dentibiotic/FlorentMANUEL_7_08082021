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
let allRecipes = []
let filteredRecipes = []


// JSON extraction
fetch(myRequest)
.then(response => response.json())
.then(function extractRecipes(data){
    allRecipes = data.recipes
    filteredRecipes = allRecipes.map(element => element)
    deployJSON(data.recipes)
    }
    );

// Event listener
    // to open and close search inputs 
btnSearchNodes.forEach(element => element.addEventListener('focusin', openSearchInput))
chevronUp.forEach(element => element.addEventListener('click', closeSearchInput))
inputsSearchNodes.forEach(element => element.addEventListener('keyup', function(){searchRecipe(element.value)}))
firstInputSearch.addEventListener('keyup', function(){
    searchRecipe(this.value)
})

function deployJSON(data){
    let newIngredientsArray = []
    let newApplianceArray = []
    let newUstensilsArray = []
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
        selectingItems(element);
    }))
    applianceMenu.childNodes.forEach(element => element.addEventListener('click', function(){
        selectingItems(element);
    }))
    ustensilsMenu.childNodes.forEach(element => element.addEventListener('click', function(){
        selectingItems(element);
    }))
}

function openSearchInput(){
    let btnActive = btnSearch.filter(element => element.firstElementChild.classList[2] == 'd-none')
    if (btnActive.length > 0){
        btnActive[0].firstElementChild.classList.replace('d-none', 'd-block')
        btnActive[0].lastElementChild.classList.replace('d-block', 'd-none')
        btnActive[0].lastElementChild.firstElementChild.value = ""
        searchRecipe("")
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
    // search recipes and filter items from actuals recipes 
    searchRecipe(infos.innerText)

    // hide item in its list
    /*let allItems = document.querySelectorAll('.btn__group li')
    let thisItem = Array.from(allItems).find(element => element.innerText.toUpperCase() == infos.innerText.toUpperCase())
    thisItem.classList.replace('d-block','d-none')*/

    // creating item in selectedSection
    let newDiv = document.createElement('div')
    selectedItems.appendChild(newDiv)
    newDiv.classList.add("item")
    newDiv.classList.add(`selected__items__${infos.classList[0]}`)
    newDiv.innerHTML = `${infos.innerHTML}<i class="far fa-times-circle"></i>`
    // event listener to close this selected element
    let cross = document.querySelectorAll('.fa-times-circle')
    cross.forEach(element => element.addEventListener('click', removeElement))

    // inputs value = ""
    inputsSearchNodes.forEach(element => element.value = "")
    
    //filterItems(infos.parentElement.previousElementSibling.previousElementSibling)
    filterItems()
}

function removeElement(){
    this.parentElement.remove()
    searchRecipe("")

}

// corriger situation :: selectedItem.length > 0 !!!
function searchRecipe(typedStrings){
    let recipeSelected = []

    if(typedStrings.length <= 2 && selectedItems.children.length == 0){
        console.log('a')
        const recipes = document.querySelectorAll('.recipe')
        const ulIngredients = Array.from(ingredientsMenu.children)
        const ulAppliances = Array.from(applianceMenu.children)
        const ulUstensils = Array.from(ustensilsMenu.children)
        ulIngredients.forEach(element => element.remove())
        ulAppliances.forEach(element => element.remove())
        ulUstensils.forEach(element => element.remove())
        recipes.forEach(element => element.remove())
        deployJSON(allRecipes)
    } else if(typedStrings.length > 2 && selectedItems.children.length == 0){
        filteredRecipes = allRecipes.map(element => element)
        for(const recipe of allRecipes){
            let inName = recipe.name.toUpperCase().includes(typedStrings.toUpperCase())
            let inDescription = recipe.description.toUpperCase().includes(typedStrings.toUpperCase())
            let inAppliance = recipe.appliance.toUpperCase().includes(typedStrings.toUpperCase())
            let inUstensils = recipe.ustensils.some(element => element.toUpperCase().includes(typedStrings.toUpperCase()))
            let inIngredients = recipe.ingredients.some(element => element.ingredient.toUpperCase().includes(typedStrings.toUpperCase()))
            if(inName == true || inDescription == true || inAppliance == true || inUstensils == true || inIngredients == true){
                recipeSelected.push(recipe)
            } else {
                let index = filteredRecipes.findIndex(element => element == recipe)
                filteredRecipes.splice(index, 1)
            }
        }
        const recipes = document.querySelectorAll('.recipe')
        const ulIngredients = Array.from(ingredientsMenu.children)
        const ulAppliances = Array.from(applianceMenu.children)
        const ulUstensils = Array.from(ustensilsMenu.children)
        ulIngredients.forEach(element => element.remove())
        ulAppliances.forEach(element => element.remove())
        ulUstensils.forEach(element => element.remove())
        recipes.forEach(element => element.remove())
        deployJSON(recipeSelected)
        filterItems()
    } else if(typedStrings.length <= 2 && selectedItems.children.length > 0){
        console.log('c')
        filteredRecipes = allRecipes.map(element => element)
        //let filteredRecipesIterated = filteredRecipes.entries()
        let allSelectedItems = Array.from(selectedItems.children)
        let indexSelectedItem = []
        for(item of allSelectedItems){
            if(item.classList[1] == "selected__items__ingredient"){
                for(const recipe of allRecipes){
                    let inIngredients = recipe.ingredients.some(element => element.ingredient.toUpperCase().includes(item.innerText.toUpperCase()))
                    if(inIngredients == false){
                        let index = filteredRecipes.findIndex(element => element == recipe)
                        if(! indexSelectedItem.includes(index)){
                            indexSelectedItem.push(index)
                        }
                    }
                }
            } else if(item.classList[1] == "selected__items__appliance"){
                for(const recipe of allRecipes){
                    let inAppliance = recipe.appliance.toUpperCase().includes(item.innerText.toUpperCase())
                    if(inAppliance == false){
                        let index = filteredRecipes.findIndex(element => element == recipe)
                        if(! indexSelectedItem.includes(index)){
                            indexSelectedItem.push(index)
                        }
                    }
                   }
            } else if(item.classList[1] == "selected__items__ustensil") {
                for(const recipe of allRecipes){
                    let inUstensils = recipe.ustensils.some(element => element.toUpperCase().includes(typedStrings.toUpperCase()))
                    if(inUstensils == false){
                        let index = filteredRecipes.findIndex(element => element == recipe)
                        if(! indexSelectedItem.includes(index)){
                            indexSelectedItem.push(index)
                        }
                    }
                }
            }
        }
        indexSelectedItem.sort((a,b) => b - a)
        console.log(indexSelectedItem)
        indexSelectedItem.forEach(element => filteredRecipes.splice(element, 1))
        const recipes = document.querySelectorAll('.recipe')
        const ulIngredients = Array.from(ingredientsMenu.children)
        const ulAppliances = Array.from(applianceMenu.children)
        const ulUstensils = Array.from(ustensilsMenu.children)
        ulIngredients.forEach(element => element.remove())
        ulAppliances.forEach(element => element.remove())
        ulUstensils.forEach(element => element.remove())
        recipes.forEach(element => element.remove())
        deployJSON(filteredRecipes)
        filterItems()
    } else {
        console.log('d')
        filteredRecipes = allRecipes.map(element => element)
        let allSelectedItems = Array.from(selectedItems.children)
        let indexSelectedItem = []
        for(item of allSelectedItems){
            if(item.classList[1] == "selected__items__ingredient"){
                for(const recipe of allRecipes){
                    let inIngredients = recipe.ingredients.some(element => element.ingredient.toUpperCase().includes(item.innerText.toUpperCase()))
                    if(inIngredients == false){
                        let index = filteredRecipes.findIndex(element => element == recipe)
                        if(! indexSelectedItem.includes(index)){
                            indexSelectedItem.push(index)
                        }
                    }
                }
            } else if(item.classList[1] == "selected__items__appliance"){
                for(const recipe of allRecipes){
                    let inAppliance = recipe.appliance.toUpperCase().includes(item.innerText.toUpperCase())
                    if(inAppliance == false){
                        let index = filteredRecipes.findIndex(element => element == recipe)
                        if(! indexSelectedItem.includes(index)){
                            indexSelectedItem.push(index)
                        }
                    }
                   }
            } else if(item.classList[1] == "selected__items__ustensil"){
                for(const recipe of allRecipes){
                    let inUstensils = recipe.ustensils.some(element => element.toUpperCase().includes(item.innerText.toUpperCase()))
                    if(inUstensils == false){
                        let index = filteredRecipes.findIndex(element => element == recipe)
                        if(! indexSelectedItem.includes(index)){
                            indexSelectedItem.push(index)
                        }
                    }
                }
            }
        }
        let secondlyFilteredRecipes = filteredRecipes.map(element => element)
        for(const recipe of secondlyFilteredRecipes){
            let inName = recipe.name.toUpperCase().includes(typedStrings.toUpperCase())
            let inDescription = recipe.description.toUpperCase().includes(typedStrings.toUpperCase())
            let inAppliance = recipe.appliance.toUpperCase().includes(typedStrings.toUpperCase())
            let inUstensils = recipe.ustensils.some(element => element.toUpperCase().includes(typedStrings.toUpperCase()))
            let inIngredients = recipe.ingredients.some(element => element.ingredient.toUpperCase().includes(typedStrings.toUpperCase()))
            if(inName == false && inDescription == false && inAppliance == false && inUstensils == false && inIngredients == false){
                let index = filteredRecipes.findIndex(element => element == recipe)
                    if(! indexSelectedItem.includes(index)){
                        indexSelectedItem.push(index)
                    }
            } 
        }
        indexSelectedItem.sort((a,b) => b - a)
        console.log(indexSelectedItem)
        for(const index of indexSelectedItem){
            filteredRecipes.splice(index, 1)
        }
        const recipes = document.querySelectorAll('.recipe')
        const ulIngredients = Array.from(ingredientsMenu.children)
        const ulAppliances = Array.from(applianceMenu.children)
        const ulUstensils = Array.from(ustensilsMenu.children)
        ulIngredients.forEach(element => element.remove())
        ulAppliances.forEach(element => element.remove())
        ulUstensils.forEach(element => element.remove())
        recipes.forEach(element => element.remove())
        deployJSON(filteredRecipes)
        filterItems()
    }
}

function filterItems(){
    let everyIngredients = document.querySelectorAll('.ingredient')
    let everyAppliances = document.querySelectorAll('.appliance')
    let everyUstensils = document.querySelectorAll('.ustensil')
    
    for(const item of selectedItems.children){
        if(item.classList[1] == "selected__items__ingredient"){
            for(const ingredient of everyIngredients){
                if(ingredient.innerText.toUpperCase() == item.innerText.toUpperCase()){
                    ingredient.classList.replace('d-block','d-none')
                }
            }
        } else if(item.classList[1] == "selected__items__appliance"){
            for(const appliance of everyAppliances){
                if(appliance.innerText.toUpperCase() == item.innerText.toUpperCase()){
                    appliance.classList.replace('d-block','d-none')
                }
            }
        } else if(item.classList[1] == "selected__items__ustensil"){
            for(const ustensil of everyUstensils){
                if(ustensil.innerText.toUpperCase() == item.innerText.toUpperCase()){
                    ustensil.classList.replace('d-block','d-none')
                }
            }
        }
    }
}