function Router() {
    var options = {
        routes: [],
        notFoundRoute: undefined,
        beforeRoute: undefined,
        executeMultipleRoutes: false,
        activeRoute: undefined
    };

    function executeRoute(routeWrapper) {
        options.activeRoute = routeWrapper;
        routeWrapper.route.work.apply(routeWrapper.route, routeWrapper.args);
    }

    function prepareRoute(routeWrapper) {
        if (_.isFunction(options.beforeRoute) && options.beforeRoute.apply()) {
            executeRoute(routeWrapper);
        } else if (!_.isFunction(options.beforeRoute)) {
            executeRoute(routeWrapper);
        }
    }

    function hasMatchingRegExp(hash) {
        _.find(options.routes, function(route, key) {
            key = new RegExp(key);
            if (key.test(hash)) {}
        });
    }

    function isRouteMatching(route, hash) {
        if (route.isRegExp && route.hash.test(hash)) {
            var parts = route.hash.exec(hash);
            return {
                url: hash,
                args: parts,
                route: route
            };
        } else if (route.hash === hash) {
            return {
                url: hash,
                args: undefined,
                route: route
            };
        }
    }

    function getMatchingRoutes(hash) {
        var returnArray = [];
        _.each(options.routes, function(route) {
            var match = isRouteMatching(route, hash);
            if (match) {
                returnArray.push(match);
            }
        });
        return returnArray;
    }

    function startupCode(obj) {
        var hash = window.location.hash.replace('#', '');
        var matchingRoutes = getMatchingRoutes(hash);
        if (matchingRoutes.length > 1 && !options.executeMultipleRoutes) {
            matchingRoutes.splice(1);
        }
        if (matchingRoutes.length > 0) {
            _.each(matchingRoutes, function(route) {
                prepareRoute(route);
            });
        } else if (options.notFoundRoute && _.isFunction(options.notFoundRoute.work)) {
            obj.trigger(options.notFoundRoute);
        }
    }

    return {
        start: function(baseHash) {
            window.onhashchange = function(e) {
                startupCode(this);
            }.bind(this);

            if (baseHash && window.location.hash === '') {
                window.location = baseHash;
            } else if (window.location.hash !== '') {
                startupCode(this);
            }
        },
        addRoute: function(hash, work) {
            options.routes.push({
                hash: hash,
                work: work,
                isRegExp: _.isRegExp(hash),
                isActiveRoute: function() {
                    return isRouteMatching(options.activeRoute.route, this.hash) ? true : false;
                }
            });
        },
        addRoutes: function(newRoutes) {
            _.each(newRoutes, function(route) {
                this.addRoute(route.hash, route.work);
            }.bind(this));
        },
        getRoutes: function() {
            return options.routes;
        },
        setNotFoundRoute: function(work) {
            options.notFoundRoute = {
                work: work
            };
        },
        setBeforeRoute: function(func) {
            options.beforeRoute = func;
        },
        trigger: function(route) {
            prepareRoute({
                url: undefined,
                args: undefined,
                route: route
            });
        },
        executeMultipleRoutes: function(value) {
            if (!_.isBoolean(value)) {
                return;
            }
            options.executeMultipleRoutes = value;
        }
    };
}
