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
  logData: function(){
      return data;
  }
}

})();




// UI Controller
const UIController = (function(){

    // Public methods
    return {

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
            console.log('Initializing App...')
        }
    }

})(ItemController, UIController);

// Initialize App
AppController.init();