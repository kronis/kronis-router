# Kronis-router
Lightweight js router

#### Methods
| Method | Argument | Description |
| ------------- |-------------| -----|
| addRoute | todo | todo |
| addRoutes | todo | todo |
| getRoutes | todo | todo |
| setNotFoundRoute | todo | todo |
| setBeforeRoute | todo | todo |
| trigger | todo | todo |
| executeMultipleRoutes | todo | todo |

#### Functions on Router function
| Function | Arguments | Description |
| ------------- |-------------| -----|
| isActiveRoute | todo | todo | 

##### Examples
```javascript
var mailFunction = function() {
    console.log('Mail page')
};
var contactsFunction = function(hash, department, id) {
    /* Get some data... */
    if (this.isActiveRoute()) {
        // Do something
    }
};
var beforeFunction = function() {
    return true;
};
var router = new Router();
router.addRoute('mail', mailFunction);
router.addRoute(/^contacts\/((?:hr|dev))\/(\d+)/, contactsFunction);
router.setBeforeRoute(beforeFunction);
router.executeMultipleRoutes(true);
router.start();
```
