const myRequest = new Request('recipes.json');
const recipesSection = document.querySelector('.recipes');
const ingredientsMenu = document.querySelector('ul.ingredients__menu');
const applianceMenu = document.querySelector('ul.appliance__menu');
const ustensilsMenu = document.querySelector('ul.ustensils__menu');
const btnSearchNodes = document.querySelectorAll('.btn__group__search');
const btnSearchEntry = document.querySelectorAll('.btn__group__search .btn');
const btnSearch = Array.from(btnSearchNodes);
const firstInputSearch = document.querySelector('.first__form__input');
const inputsSearchNodes = document.querySelectorAll('.input__search');
const chevronUp = document.querySelectorAll('.fa-chevron-up');
const selectedItems = document.querySelector('.selected__items');
let allRecipes = [];
let filteredRecipes = [];
let newIngredientsArray = [];
let newApplianceArray = [];
let newUstensilsArray = [];
let ingredientsVisible = [];
let appliancesVisible = [];
let ustensilsVisible = [];


// CLASSES
class DeployItemFactory {

    static deployEachItem (source, destination, newClass){
        for (const element of source){
            let newLi = document.createElement('li');
            newLi.classList.add(newClass);
            newLi.classList.add('d-block');
            destination.appendChild(newLi);
            newLi.textContent = element;
        }
    }
}

class FilterRecipes {

    static pushFromIndex(recipe, itemRef, arraySource, indexArray){
        if(itemRef == false){
            let index = arraySource.findIndex(element => element == recipe);
            if(! indexArray.includes(index)){
                indexArray.push(index);
            }
        } 
    }
}

class SizeFactory {

    static adjustSize(itemList, btnOrigin, placeholderValue){
        if(itemList.length <= 1){
            btnOrigin.lastElementChild.firstElementChild.style.width = "170px";
            btnOrigin.lastElementChild.lastElementChild.style.width = "166px";
            btnOrigin.lastElementChild.firstElementChild.placeholder = "...";
        } else if (itemList.length == 2){
            btnOrigin.lastElementChild.firstElementChild.style.width = "470px";
            btnOrigin.lastElementChild.lastElementChild.style.width = "466px";
            btnOrigin.lastElementChild.firstElementChild.placeholder = placeholderValue;
        } else if (itemList.length > 2){
            btnOrigin.lastElementChild.firstElementChild.style.width = "690px";
            btnOrigin.lastElementChild.lastElementChild.style.width = "686px";
            btnOrigin.lastElementChild.firstElementChild.placeholder = placeholderValue;
        }
    }
}

class ItemSearchFactory {

    static searchItems(source, value){
        for(const element of source){
            if(element.innerText.toUpperCase().includes(value.toUpperCase())){
                element.classList.replace('d-none', 'd-block');
            } else {
                element.classList.replace('d-block', 'd-none');
            }
        }
    }

}

class FilterItemsFactory {

    static arrayItemsFromVisibleRecipes(source, object){
        if(! source.includes(object.toUpperCase())){
            source.push(object.toUpperCase());
        }
    }

    static filterFromIndex(source, originalArray, reference){
        if(source.classList[1] == reference){
            let index = originalArray.findIndex(element => element.toUpperCase() == source.innerText.toUpperCase());
            originalArray.splice(index, 1);
        } 
    }

    static filterItems(source, reference){
        for(const element of source){
            if(! reference.includes(element.innerText.toUpperCase())){
                element.classList.replace('d-block', 'd-none');
            } else {
                element.classList.replace('d-none', 'd-block');
            }
        }
    }

}

// JSON extraction
fetch(myRequest)
.then(response => response.json())
.then(function extractRecipes(data){
    allRecipes = (data.recipes).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    filteredRecipes = allRecipes.map(element => element);
    deployJSON(data.recipes);
    deployItems();
    }
    );

// EVENT LISTENER
btnSearchEntry.forEach(element => element.addEventListener('click', openSearchInput));
chevronUp.forEach(element => element.addEventListener('click', closeSearchInput));
firstInputSearch.addEventListener('keyup', function(){
    let activeRecipe = document.querySelectorAll('.recipe[class="recipe d-block"]');
    if(activeRecipe.length == allRecipes){
        searchRecipe(this.value, allRecipes);
    } else {
        searchRecipe(this.value, allRecipes);
    }
    filterItems();
})
inputsSearchNodes.forEach(element => element.addEventListener('keyup', function(){searchItems(element)}));

// FUNCTIONS 
function deployJSON(recipes){
    for(const recipe of recipes){
        // Adding all recipies to recipes section
            // first line of the recipe
            let newRecipe = document.createElement('div');
            recipesSection.appendChild(newRecipe);
            newRecipe.classList.add('recipe');
            newRecipe.classList.add('d-block');
            let newRecipeImg = document.createElement('div');
            newRecipe.appendChild(newRecipeImg);
            newRecipeImg.classList.add('recipe__img');
            let newImg = document.createElement('img');
            newRecipeImg.appendChild(newImg)
            newImg.setAttribute('src', './img/sarah_kitchen_supplies_red_adjusted.jpg')
            newImg.setAttribute('alt', 'Recipe illustration')
            let newRecipeDetails = document.createElement('div');
            newRecipe.appendChild(newRecipeDetails);
            newRecipeDetails.classList.add('recipe__details');
            let newH2 = document.createElement('h2');
            newRecipeDetails.appendChild(newH2);
            newH2.textContent = recipe.name;
            let newH3 = document.createElement('h3');
            newRecipeDetails.appendChild(newH3);
            newH3.innerHTML = `<i class="far fa-clock"></i> ${recipe.time} min`;
    
                // list of ingredients + recipe
            let newUl = document.createElement('ul');
            newRecipeDetails.appendChild(newUl);
            newUl.classList.add('recipe__ingredient');
            let allIngredientsData = [];
            let allIngredients = recipe.ingredients;
            allIngredients.forEach(element => {
                let newLi = document.createElement('li');
                newUl.appendChild(newLi)
                if(element.unit != undefined && element.quantity != undefined){
                    newLi.innerHTML = `<strong>${element.ingredient} : </strong> ${element.quantity} ${element.unit}`;
                } else if (element.quantity != undefined){
                    newLi.innerHTML = `<strong>${element.ingredient} : </strong> ${element.quantity}`;
                } else {
                    newLi.innerHTML = `<strong>${element.ingredient}</strong>`;
                }
                allIngredientsData.push(element.ingredient);
            });
            let newP = document.createElement('p');
            newRecipeDetails.appendChild(newP);
            newP.textContent = recipe.description;
            newP.classList.add('recipe__howto');
            // adding data attributes for appliance & ustensils
        let allUstensils = recipe.ustensils;
        newRecipe.setAttribute('data-name', recipe.name);
        newRecipe.setAttribute('data-appliance', recipe.appliance);
        newRecipe.setAttribute('data-ustensils', allUstensils);
        newRecipe.setAttribute('data-ingredients', allIngredientsData);

        for(const ingredient of allIngredients){
            if(! newIngredientsArray.includes(ingredient.ingredient)){
                newIngredientsArray.push(ingredient.ingredient);
            }
        }
        if(! newApplianceArray.includes(recipe.appliance)){
            newApplianceArray.push(recipe.appliance);
        }
        for(const ustensil of allUstensils){
            if(! newUstensilsArray.includes(ustensil)){
                newUstensilsArray.push(ustensil);
            }
        }
    }
}

function deployItems(){
    newIngredientsArray.sort();
    newApplianceArray.sort();
    newUstensilsArray.sort();

    DeployItemFactory.deployEachItem(newIngredientsArray, ingredientsMenu, 'ingredient');
    DeployItemFactory.deployEachItem(newApplianceArray, applianceMenu, 'appliance');
    DeployItemFactory.deployEachItem(newUstensilsArray, ustensilsMenu, 'ustensil');

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
    ingredientsVisible = document.querySelectorAll('.ingredient');
    appliancesVisible = document.querySelectorAll('.appliance');
    ustensilsVisible = document.querySelectorAll('.ustensil');
}

function openSearchInput(){
    let btnActive = btnSearch.filter(element => element.firstElementChild.classList[2] == 'd-none');
    if (btnActive.length > 0){
        btnActive[0].firstElementChild.classList.replace('d-none', 'd-block');
        btnActive[0].lastElementChild.classList.replace('d-block', 'd-none');
        btnActive[0].lastElementChild.firstElementChild.value = "";
    }
    this.classList.replace('d-block', 'd-none');
    this.nextElementSibling.classList.replace('d-none', 'd-block');
    this.nextElementSibling.firstElementChild.focus();
}

function closeSearchInput(){
    this.parentElement.previousElementSibling.classList.replace('d-none', 'd-block');
    this.parentElement.classList.replace('d-block', 'd-none');
    this.previousElementSibling.value = "";
    searchItems(this.previousElementSibling);
}

function searchRecipe(){
    let allRecipesVisible = Array.from(recipesSection.children);
    allRecipesVisible.forEach(element => element.classList.replace('d-none', 'd-block'));
    let indexSelectedItem = [];
    if(selectedItems.children.length > 0 || firstInputSearch.value != ""){
        let allSelectedItems = Array.from(selectedItems.children);
        for(const item of allSelectedItems){
            if(item.classList[1] == "selected__items__ingredient"){
                for(const recipe of allRecipes){
                    let inIngredients = recipe.ingredients.some(element => element.ingredient.toUpperCase().includes(item.innerText.toUpperCase()));
                    FilterRecipes.pushFromIndex(recipe, inIngredients, filteredRecipes, indexSelectedItem);
                }
            } else if(item.classList[1] == "selected__items__appliance"){
                for(const recipe of allRecipes){
                    let inAppliance = recipe.appliance.toUpperCase().includes(item.innerText.toUpperCase());
                    FilterRecipes.pushFromIndex(recipe, inAppliance, filteredRecipes, indexSelectedItem);
                }
            } else if(item.classList[1] == "selected__items__ustensil"){
                for(const recipe of allRecipes){
                    let inUstensils = recipe.ustensils.some(element => element.toUpperCase().includes(item.innerText.toUpperCase()));
                    FilterRecipes.pushFromIndex(recipe, inUstensils, filteredRecipes, indexSelectedItem);
                }
            }
        }
        if(firstInputSearch.value != ""){
            let words = firstInputSearch.value.split(' ');
            for(const word of words){
                for(const recipe of allRecipes){
                    let inName = recipe.name.toUpperCase().includes(word.toUpperCase());
                    let inDescription = recipe.description.toUpperCase().includes(word.toUpperCase());
                    let inAppliance = recipe.appliance.toUpperCase().includes(word.toUpperCase());
                    let inUstensils = recipe.ustensils.some(element => element.toUpperCase().includes(word.toUpperCase()));
                    let inIngredients = recipe.ingredients.some(element => element.ingredient.toUpperCase().includes(word.toUpperCase()));
                    if(inName == false && inDescription == false && inAppliance == false && inUstensils == false && inIngredients == false){
                        let index = filteredRecipes.findIndex(element => element == recipe);
                        if(! indexSelectedItem.includes(index)){
                            indexSelectedItem.push(index);
                        } 
                    } 
                }
            } 
        }
        for(const index of indexSelectedItem){
            recipesSection.children[index].classList.replace('d-block', 'd-none');
        }
    }
}

function filterItems(){
    let ingredients = document.querySelectorAll('.ingredient');
    let appliances = document.querySelectorAll('.appliance');
    let ustensils = document.querySelectorAll('.ustensil');
    let visibleRecipes = [];
    let recipesVisible = Array.from(recipesSection.children).filter(element => element.classList[1] == "d-block");
    for(const recipe of recipesVisible){
        let index = allRecipes.findIndex(element => element.name.toUpperCase() == recipe.dataset.name.toUpperCase());
        visibleRecipes.push(allRecipes[index]);
    }
    let ingredientsFromVisibleRecipes = [];
    let appliancesFromVisibleRecipes = [];
    let ustensilsFromVisibleRecipes = [];
    for(const recipe of visibleRecipes){
        for(const ingredient of recipe.ingredients){
            FilterItemsFactory.arrayItemsFromVisibleRecipes(ingredientsFromVisibleRecipes, ingredient.ingredient);
        }
        FilterItemsFactory.arrayItemsFromVisibleRecipes(appliancesFromVisibleRecipes, recipe.appliance);
        for(const ustensil of recipe.ustensils){
            FilterItemsFactory.arrayItemsFromVisibleRecipes(ustensilsFromVisibleRecipes, ustensil);
        }
    }

    if(selectedItems.children.length > 0){
        for(const item of selectedItems.children){
            FilterItemsFactory.filterFromIndex(item, ingredientsFromVisibleRecipes, "selected__items__ingredient");
            FilterItemsFactory.filterFromIndex(item, appliancesFromVisibleRecipes, "selected__items__appliance");
            FilterItemsFactory.filterFromIndex(item, ustensilsFromVisibleRecipes, "selected__items__ustensil");
        }
    }
    
    FilterItemsFactory.filterItems(ingredients, ingredientsFromVisibleRecipes);
    FilterItemsFactory.filterItems(appliances, appliancesFromVisibleRecipes);
    FilterItemsFactory.filterItems(ustensils, ustensilsFromVisibleRecipes);

    ingredientsVisible = document.querySelectorAll('.ingredient[class="ingredient d-block"]');
    appliancesVisible = document.querySelectorAll('.appliance[class="appliance d-block"]');
    ustensilsVisible = document.querySelectorAll('.ustensil[class="ustensil d-block"]');

    SizeFactory.adjustSize(ingredientsVisible, btnSearchNodes[0], 'Rechercher un ingredient');
    SizeFactory.adjustSize(appliancesVisible, btnSearchNodes[1], 'Rechercher un appareil');
    SizeFactory.adjustSize(ustensilsVisible, btnSearchNodes[2], 'Rechercher un ustensil');

}

function searchItems(input){
    if(input.id == "ingredients"){
        ItemSearchFactory.searchItems(ingredientsVisible, input.value);
    } else if(input.id == "appliances"){
        ItemSearchFactory.searchItems(appliancesVisible, input.value);
    } else if(input.id == "ustensils"){
        ItemSearchFactory.searchItems(ustensilsVisible, input.value);
    }
    SizeFactory.adjustSize(ingredientsVisible, btnSearchNodes[0], 'Rechercher un ingredient');
    SizeFactory.adjustSize(appliancesVisible, btnSearchNodes[1], 'Rechercher un appareil');
    SizeFactory.adjustSize(ustensilsVisible, btnSearchNodes[2], 'Rechercher un ustensil');
}

function selectingItems(infos){

     // hide item in its list
     let allItems = document.querySelectorAll('.btn__group li');
     let thisItem = Array.from(allItems).find(element => element.innerText.toUpperCase() == infos.innerText.toUpperCase());
     thisItem.classList.replace('d-block','d-none');
 
     // creating item in selectedSection
     let newDiv = document.createElement('div');
     selectedItems.appendChild(newDiv);
     newDiv.classList.add("item");
     newDiv.classList.add(`selected__items__${infos.classList[0]}`);
     newDiv.innerHTML = `${infos.innerHTML}<i class="far fa-times-circle"></i>`;
     // event listener to close this selected element
     let cross = document.querySelectorAll('.fa-times-circle');
     cross.forEach(element => element.addEventListener('click', removeElement));
 
     // adjust items lists
     searchRecipe();
     filterItems();

     // inputs value = ""
     inputsSearchNodes.forEach(element => element.value = "");
}

function removeElement(){
    this.parentElement.remove();
    searchRecipe();
    filterItems();
}