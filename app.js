// Storage Controller
// could have used session storage but the items would go away when the broswer is closed
const StorageController = (function(){

    // Public Methods
    return {
        storeItem: function(item){
            let items;
            
            // before we put something in local storage, since we're puttin in an array of objects
            // we have to turn it into a string with JSON.stringify, then when we pull it out we need to turn it back
            // into an object with JSON.parse, we wouldnt hve to do this if we were storing single strings

            // Check if any items in local storage 
            if(localStorage.getItem('items') === null){
                // if nothing make it equal to an empty array
                items = [];
                // push new item - not in local storage yet just in this local variable need to set
                items.push(item);
                // set local storage
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // if theres something in ls get the item
                items = JSON.parse(localStorage.getItem('items'));

                // Push new item to the converted JSON object
                items.push(item);

                // Reset local storage back to a string
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                // if nothings there set item to nothing
                items = [];

            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            // loop through the items in the storage
            // if the id of the passed item is equal to the current id in local storage
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    // delete 1 item from whatever the index is and replace it with updatedItem
                    items.splice(index, 1, updatedItem);
                }
            });
            // Reset local storage again back to a string
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            // similar to update except we're not replacing the spliced value
            let items = JSON.parse(localStorage.getItem('items'));

            // loop through the items in the storage
            // if the id of the passed item is equal to the current id in local storage
            items.forEach(function(item, index){
                if(id === item.id){
                    // delete 1 item from whatever the index is
                    items.splice(index, 1);
                }
            });
            // Reset local storage again back to a string
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }

    }
})();

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
    // since we have set our local storage with items, we wont need this array of objects
    // items: [
    //     // {id: 0, name: 'steak', calories: 1200},
    //     // {id: 1, name: 'egg', calories: 300},
    //     // {id: 2, name: 'rice', calories: 200}
    // ],

    items: StorageController.getItemsFromStorage(),
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
    getItemById: function(id){
        let found = null;

        // loop through items
        // if item.id is equal to the id that we pass in, then set found equal to the item
        data.items.forEach(function(item){
            // if the item 
            if(item.id === id){
                found = item;
            }

        });
        return found;

    },
    updateItem: function(name, calories){
        // Calories to number
        calories = parseInt(calories);
        // do a similar approach like above
        let found = null;


        // rememeber once we click on edit, the item gets put into the currentItem
        data.items.forEach(function(item){
            if(item.id === data.currentItem.id){
                //make it equal the new passed in value
                item.name = name;
                item.calories = calories;
                found = item;
            }
        });
        return found;
        // will update it in the data structure not the UI
        // check it via ItemCtrl.logData() on the console
    },
    deleteItem: function(id){
        // Get ids
        // using map method - like forEach but returns something
        const ids = data.items.map(function(item){
            return item.id;
        });

        // Get index - to get the position of the item
        const index = ids.indexOf(id);

        // Remove item - remove 1 item at that index
        data.items.splice(index, 1);
        
    },
    clearAllItems: function(){
        data.items = [];
    },
    setCurrentItem: function(item){
        data.currentItem = item;
        // check if its working by logging itemController.logData() onto the console
        // check for the value in currentItem
    },
    getCurrentItem: function(){
        return data.currentItem;
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
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
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
        updateListItem: function(item){
            // we want the li's in the ul
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                // if this is true then thats the one that we want to update
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>  
                    <!-- secondary-content == a materialize class to add something to a collection like an icon or text --> 
                     <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
 
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            // .remove() remove object from the tree it belongs to
            item.remove();

        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemController.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemController.getCurrentItem().calories;
            // show buttons, we can just copy clearEditState and modify it
            UIController.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array to loop through it - like update
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function(){
            // hide the list UI - get rid of the default grey line with no items 
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            // call the clear input function above
            UIController.clearInput();
            // hide the update, delete. and back button
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },
        showEditState: function(){
            // hide the update, delete. and back button
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';

        },
        // Since UI selectors is not made public we need to return it here
        getSelectors: function(){
            return UISelectors;
        }
    }

})();




// App Controller
//Insert the other controllers into the main controller
const AppController = (function(ItemController, StorageController, UIController){
    // Load Event listeners
    const loadEventListeners = function(){
        // Get UI Selectors
        const UISelectors = UIController.getSelectors();

        // Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function(e){
            // some older browsers dont support keycode so we need the "which"
            if(e.keycode === 13 || e.which === 13){
                // basically disabling the enter key
                e.preventDefault();
                return false;
            }
        })

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back button event
        // we can just use the clearEditState function again
        document.querySelector(UISelectors.backBtn).addEventListener('click', UIController.clearEditState);

        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
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

            // Store in local storage
            // the newItem is coming from the itemController, few lines above we returned addItem to bariable newItem
            StorageController.storeItem(newItem);

            // Clear fields
            UIController.clearInput();
        }
        e.preventDefault();
    }

    // Click edit item
    const itemEditClick = function(e){
        // we need to actually target the edit button. edit button has class edit-item
        // We have to do this because the edit button isnt initially loaded when the page loads
        // its added after the page loads so we need to use event delegation
        if(e.target.classList.contains('edit-item')){
            // We want to add the item we want to edit to the currentItem variable we created in our data structure
            // which is initially set to null
            
            // Get list item id (item-0, item-1)
            // from the target i tag we go up a parent elment then up again
            const listId = e.target.parentNode.parentNode.id;
            // to check console.log(listID)

            // now we need to get the regular id e.g. 0, 1
            // Break into an array
            // split() method is used to split a string into an array of substrings, and returns the new array
            // e.g. [item, 0]
            const listIdArr = listId.split('-');

            // get the actual id - since it will be the second value in the array
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToEdit = ItemController.getItemById(id);
            // check if it works, should return the entrire item object - console.log(itemToEdit);

            // Set current item
            // pass the item object into setCurrentItem
            ItemController.setCurrentItem(itemToEdit);

            // Add item to form
            // we dont have to pass in item since its in the currentItem variable
            UIController.addItemToForm();

        }
        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = e => {
        // Get item input
        const input = UIController.getItemInput();

        // Update item
        const updatedItem = ItemController.updateItem(input.name, input.calories);

        // Update UI
        UIController.updateListItem(updatedItem);

        // TOTAL CALS ARE UPDATED WHEN ITEM IS UPDATED
        // Get Total Calories
        const totalCalories = ItemController.getTotalCalories();

        //Add total calories to UI
        UIController.showTotalCalories(totalCalories);

        // Update local storage
        // pass in the updatedItem we created above, which grabs the updated item from ItemController
        StorageController.updateItemStorage(updatedItem);


        UIController.clearEditState();


        e.preventDefault();
    }

    // Delete button event
    const itemDeleteSubmit = function(e) {
        // Get current item
        const currentItem = ItemController.getCurrentItem();

        // Delete from data structure
        ItemController.deleteItem(currentItem.id);

        // Delete from UI
        UIController.deleteListItem(currentItem.id);

        // Update Calories again when we delete an item
         // Get Total Calories
         const totalCalories = ItemController.getTotalCalories();

         //Add total calories to UI
         UIController.showTotalCalories(totalCalories);

         // Delete from local storage
         StorageController.deleteItemFromStorage(currentItem.id);

        // Clear all input and hide buttons back to default state
         UIController.clearEditState();

        e.preventDefault();
    }

    // Clear items event
    const clearAllItemsClick = function() {
        // Delete all items from data structure
        ItemController.clearAllItems();

         // Update Calories again when we click the clear button
         // Get Total Calories
         const totalCalories = ItemController.getTotalCalories();

         //Add total calories to UI
         UIController.showTotalCalories(totalCalories); 

        // Remove from UI
        UIController.removeItems();

        // Clear from local storage
        StorageController.clearItemsFromStorage();
        
        // Clear all input and hide buttons back to default state
         UIController.clearEditState();

         // Hide Ul grey bar again
         UIController.hideList();
    }



    // Public Methods
    // return initilizer function - anything we need to run when the application loads
    // e.g. make sure the edit state is clear a new version of the app
    return {
        init: function(){
            // Clear edit state / set initial set
            UIController.clearEditState();

            // Fetch items from data structure
            const items = ItemController.getItems();

            // Check if any items
            if(items.length === 0){
                // need to unhide the list in the UI controller, since we never made it unhidden
                UIController.hideList();
            } else {
            // Populate list with items
            
             UIController.populateItemList(items);

            }

            // Will fetch from local storage
            // Get Total Calories
            const totalCalories = ItemController.getTotalCalories();
             //Add total calories to UI
             UIController.showTotalCalories(totalCalories);

            // copy this above
            // // Populate list with items
            // UIController.populateItemList(items);

            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemController, StorageController, UIController);

// Initialize App
AppController.init();