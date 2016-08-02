var router = require('./router.js');

router.addRoute('link1', function() {
    console.log('link1');
});
router.addRoute('link2', function() {
    console.log('link2');
});
router.addRoute('link3', function() {
    console.log('link3');
});

router.start();
