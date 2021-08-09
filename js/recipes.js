const myRequest = new Request('recipes.json')
const recipesSection = document.querySelector('.recipes')
const ingredientsMenu = document.querySelector('.ingredients__menu')
const applianceMenu = document.querySelector('.appliance__menu')
const ustensilsMenu = document.querySelector('.ustensils__menu')

let newIngredientUl = document.createElement('ul')
ingredientsMenu.appendChild(newIngredientUl)
let newIngredientsArray = []

let newApplianceUl = document.createElement('ul')
applianceMenu.appendChild(newApplianceUl)
let newApplianceArray = []

fetch(myRequest)
.then(response => response.json())
.then(function extractRecipes(data){
    for (let i = 0; i < data.recipes.length; i++){
        // Adding all recipies to recipes section
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
        // adding all ingredients/appliance/ustensils to the ingredients input
        for(let i = 0; i < allIngredients.length; i++){
            if(! newIngredientsArray.includes(allIngredients[i].ingredient)){
                newIngredientsArray.push(allIngredients[i].ingredient)
                let newLi = document.createElement('li')
                newIngredientUl.appendChild(newLi)
                newLi.textContent = allIngredients[i].ingredient
            } 
        }
        if(! newApplianceArray.includes(data.recipes[i].appliance)){
            newApplianceArray.push(data.recipes[i].appliance)
            let newLi = document.createElement('li')
            newApplianceUl.appendChild(newLi)
            newLi.textContent = data.recipes[i].appliance
        }
        /*for(let i = 0; i < allIngredients.length; i++){
            if(! newIngredientsArray.includes(allIngredients[i].ingredient)){
                newIngredientsArray.push(allIngredients[i].ingredient)
                let newLi = document.createElement('li')
                newIngredientUl.appendChild(newLi)
                newLi.textContent = allIngredients[i].ingredient
            } 
        }*/
    } 
    }
    );