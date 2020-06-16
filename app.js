// Storage Controller

// Item Controller
const ItemController   = (function(){
// Item Constructor - to create an item and add it to the state/data structure
// each time we add an item it will have an id
const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories
}

// Data Structure / State
// All this data is hidden
const data = {
    items: [
        // {id: 0, name: 'steak', calories: 1200},
        // {id: 1, name: 'egg', calories: 300},
        // {id: 2, name: 'rice', calories: 200}
    ],
    // currentItem = the item selcted to be updated
    currentItem: null,
    totalCalories: 0
}

// Public methods
// Whatever we return from the module is public
return {
    getItems: function(){
        return data.items;
    },
    addItem: function(name, calories){
        let ID;
       // Create ID to identify each item uniquely
       if (data.items.length > 0) {
           // make the index to be the length -1, e.g. if theres 4 items index will become 3
           // then we want the ID of that particular item .id and add 1 to it, gives us a sense of auto-increment
           // Basically getting the last item and adding 1 to the ID each time we add an item
           ID = data.items[data.items.length - 1].id + 1;
       } else {
           ID = 0;
       }

       // Calories to number - parse it as a number becasue when we type it its a string
       calories = parseInt(calories);

       // Create new item
       newItem = new Item(ID, name, calories);

       // Add to items array - push the item to the Data structure above
       data.items.push(newItem);
       return newItem;
    },
    getTotalCalories: function(){
        let total = 0;

        // loop through items and add the calories
        data.items.forEach(item =>{
            total += item.calories;
            // or total = total + item.calories;
        });

        // Set total calories in the data structure
        data.totalCalories = total;

        // return total
        return data.totalCalories;

    },
    // Check our data structure on the console
  logData: function(){
      return data;
  }
}

})();




// UI Controller
const UIController = (function(){
    // class or ID can be changed at any time, and to save us from changing each individual instance of it
    // we can create the following object
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput:'#item-name',
        itemCaloriesInput:'#item-calories',
        // span tag
        totalCalories: '.total-calories'
    }

    // Public methods
    return {
        populateItemList: function(items){
            // loop through the items and make each one a list item and insert to the ul
            let html = '';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>  
                <!-- secondary-content == a materialize class to add something to a collection like an icon or text -->
                 <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`
            })

            // Insert list item
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return{
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID - its going to be dynamic, we can access it from the item object that we pass in that contains id, name and cals
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>  
            <!-- secondary-content == a materialize class to add something to a collection like an icon or text --> 
             <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            // Insert item - adds it to the DOM
            // insertAdjacentElment-inserts a given element node at a given position relative to the element it is invoked upon.
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function(){
            // hide the list UI - get rid of the default grey line with no items 
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        // Since UI selectors is not made public we need to return it here
        getSelectors: function(){
            return UISelectors;
        }
    }

})();




// App Controller
//Insert the other controllers into the main controller
const AppController = (function(ItemCtrl, UICtrl){
    // Load Event listeners
    const loadEventListeners = function(){
        // Get UI Selectors
        const UISelectors = UIController.getSelectors();

        // Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
    }

    // Add Item submit
    // need to return it with the init function to be called, since its private
    const itemAddSubmit = function(e){
        // Get form input from UI Controller
        const input = UIController.getItemInput();
        
        // Check for name and calorie input
        // .name and .calories from the UI controller
        if (input.name !== '' && input.calories !== ''){
            // Add item
            const newItem = ItemController.addItem(input.name, input.calories);

            // Add item to UI list
            UIController.addListItem(newItem);

            // Get Total Calories
            const totalCalories = ItemController.getTotalCalories();

            //Add total calories to UI
            UIController.showTotalCalories(totalCalories);

            // Clear fields
            UIController.clearInput();
        }
        e.preventDefault();
    }

    // Public Methods
    // return initilizer function - anything we need to run when the application loads
    // e.g. make sure the edit state is clear a new version of the app
    return {
        init: function(){

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check if any items
            if(items.length === 0){
                // need to unhide the list in the UI controller, since we never made it unhidden
                UIController.hideList();
            } else {
            // Populate list with items
            
             UIController.populateItemList(items);

            }

            // copy this above
            // // Populate list with items
            // UIController.populateItemList(items);

            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemController, UIController);

// Initialize App
AppController.init();