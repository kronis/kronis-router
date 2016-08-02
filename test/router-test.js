var expect = buster.referee.expect;
var assert = buster.referee.assert;
buster.spec.expose(); // Make some functions global

function getRouter() {
    debugger;
    console.log(router);
    return new Router();
}

function addRoute(router, route, func) {
    if (!func) {
        func = function() {};
    }
    router.addRoute(route, func);
}

describe("Routing tests", function() {
    it('Router should have all functions', function() {
        var router = getRouter();
        router.start();
        assert.defined(router, 'start');
        assert.defined(router, 'addRoutes');
        assert.defined(router, 'getRoutes');
        assert.defined(router, 'setNotFoundRoute');
        assert.defined(router, 'setBeforeRoute');
        assert.defined(router, 'trigger');
        assert.defined(router, 'getStatus');
        assert.defined(router, 'executeMultipleRoutes');
    });

    it('Number of routes', function() {
        var router = getRouter();
        addRoute(router, 'route1');
        addRoute(router, 'route2');
        router.start();
        assert.equals(_.size(router.getRoutes()), 2);
    });

    it('Number of routes after adding another one', function() {
        var router = getRouter();
        addRoute(router, 'route3');
        addRoute(router, 'route4');
        router.addRoutes([{
            hash: 'page3',
            work: function() {}
        }]);
        router.start();
        assert.equals(_.size(router.getRoutes()), 3);
    });

    it('Should call function on URL change, page1', function(done) {
        var router = getRouter();
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        addRoute(router, 'page5', spy1);
        addRoute(router, 'page6', spy2);
        router.start();
        window.location = '#page5';

        setTimeout(done(function() {
            assert.isTrue(spy1.called);
            assert.isFalse(spy2.called);
        }), 20);
    });

    it('Should call function on URL change, page2', function(done) {
        var router = getRouter();
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        addRoute(router, 'page7', spy1);
        addRoute(router, 'page8', spy2);
        router.start();
        window.location = '#page8';

        setTimeout(done(function() {
            assert.isFalse(spy1.called);
            assert.isTrue(spy2.called);
        }), 20);
    });

    it('Should not call function on URL change, page3', function(done) {
        var router = getRouter();
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        addRoute(router, 'page9', spy1);
        addRoute(router, 'page10', spy2);
        router.start();
        window.location = '#page999';

        setTimeout(done(function() {
            assert.isFalse(spy1.called);
            assert.isFalse(spy2.called);
        }), 20);
    });

    it('Should have a custom 404 page ', function(done) {
        var router = getRouter();
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        var spy404 = sinon.spy();
        addRoute(router, 'page11', spy1);
        addRoute(router, 'page12', spy2);
        router.setNotFoundRoute(spy404);
        router.start();
        window.location = '#pageNotFound';
        setTimeout(done(function() {
            assert.isFalse(spy1.called);
            assert.isFalse(spy2.called);
            assert.isTrue(spy404.called);
        }), 20);
    });

    it('Execute should only execute if before execute returns true', function(done) {
        var router = getRouter();
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        addRoute(router, 'page13', spy1);
        addRoute(router, 'page14', spy2);
        var beforeFunction = function() {
            return true;
        };

        router.setBeforeRoute(beforeFunction);
        router.start();
        window.location = '#page13';
        setTimeout(done(function() {
            assert.isTrue(spy1.called);
            assert.isFalse(spy2.called);
        }), 20);
    });

    it('Execute should not execute if before execute returns false', function(done) {
        var router = getRouter();
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        addRoute(router, 'page15', spy1);
        addRoute(router, 'page16', spy2);
        var beforeFunction = function() {
            return false;
        };

        router.setBeforeRoute(beforeFunction);
        router.start();
        window.location = '#page15';
        setTimeout(done(function() {
            assert.isFalse(spy1.called);
            assert.isFalse(spy2.called);
        }), 20);
    });

    it('Should use regexp as route', function(done) {
        var router = getRouter();
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        var page17 = new RegExp('^page17$');
        var page18 = new RegExp('^page18$');
        addRoute(router, page17, spy1);
        addRoute(router, page18, spy2);
        router.start();
        window.location = '#page17';
        setTimeout(done(function() {
            assert.isTrue(spy1.called);
            assert.isFalse(spy2.called);
        }), 20);
    });

    it('Should use regexp as route, more complex regexp, and returns param', function(done) {
        var router = getRouter();
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        var page1 = new RegExp('^page19\/((?:mail|contacts))$');
        var page2 = new RegExp('^page19$');
        addRoute(router, page1, spy1);
        addRoute(router, page2, spy2);
        router.start();
        window.location = '#page19/contacts';
        setTimeout(done(function() {
            assert.isTrue(spy1.called);
            assert.isTrue(spy1.calledWith('page19/contacts', 'contacts'));
            assert.isFalse(spy2.called);
        }), 20);
    });

    it('Should use regexp as route, more complex regexp, and returns multiple params', function(done) {
        var router = getRouter();
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        var page1 = /^page19\/((?:mail|contacts))\/(\d+)/;
        var page2 = new RegExp('^page19$');
        addRoute(router, page1, spy1);
        addRoute(router, page2, spy2);
        router.start();
        window.location = '#page19/contacts/75463';
        setTimeout(done(function() {
            assert.isTrue(spy1.called);
            assert.isTrue(spy1.calledWith('page19/contacts/75463', 'contacts', '75463'));
            assert.isFalse(spy2.called);
        }), 20);
    });

    it('Should only execute first matching route', function(done) {
        var router = getRouter();
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        var page1 = /^page2(0|1)$/;
        var page2 = /^page2(0|1)$/;
        addRoute(router, page1, spy1);
        addRoute(router, page2, spy2);
        router.start();
        window.location = '#page20';
        setTimeout(done(function() {
            assert.isTrue(spy1.called);
            assert.isFalse(spy2.called);
        }), 20);
    });

    it('Should execute all matching routes', function(done) {
        var router = getRouter();
        router.executeMultipleRoutes(true);
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        var page1 = /^page2(2|3)$/;
        var page2 = /^page2(2|3)$/;
        addRoute(router, page1, spy1);
        addRoute(router, page2, spy2);
        router.start();
        window.location = '#page22';
        setTimeout(done(function() {
            assert.isTrue(spy1.called);
            assert.isTrue(spy2.called);
        }), 20);
    });

    it('Url is the same one as we started to execute', function(done) {
        var func = done(function() {
            assert.isTrue(this.isActiveRoute());
        });
        var router = getRouter();
        addRoute(router, 'page24', func);
        router.start();
        window.location = '#page24';
    });

    it('Url is not the same one as we started to execute', function(done) {
        var func1 = function() {
            setTimeout(done(function() {
                assert.isFalse(this.isActiveRoute());
            }.bind(this)), 20);
        };
        var func2 = function() {};
        var router = getRouter();
        addRoute(router, 'page25', func1);
        addRoute(router, 'page26', func2);
        router.start();
        window.location = '#page25';
        setTimeout(function() {
            window.location = '#page26';
        }, 1);
    });

    it('// Enable direct linking', function(done) {
            });

});

describe('//Base url tests', function() {
    it('Enable executeOnRootPath', function() {
        window.location = '';
        console.log('----');
        var router = getRouter();
        var spy1 = sinon.spy();
        var page1 = /^page24$/;
        addRoute(router, page1, spy1);
        router.start('#page24');
        setTimeout(function() {
            assert.isTrue(spy1.called);
        }, 20);
    });
});
