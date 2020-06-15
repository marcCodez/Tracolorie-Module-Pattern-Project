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
        {id: 0, name: 'steak', calories: 1200},
        {id: 1, name: 'egg', calories: 300},
        {id: 2, name: 'rice', calories: 200}
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
        itemList: '#item-list'
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
                <!-- <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`
            })

            // Insert list item
            document.querySelector(UISelectors.itemList).innerHTML = html;
        }

    }

})();




// App Controller
//Insert the other controllers into the main controller
const AppController = (function(ItemCtrl, UICtrl){

    // Public Methods
    // return initilizer function - anything we need to run when the application loads
    // e.g. make sure the edit state is clear a new version of the app
    return {
        init: function(){

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Populate list with items
            UIController.populateItemList(items);
        }
    }

})(ItemController, UIController);

// Initialize App
AppController.init();