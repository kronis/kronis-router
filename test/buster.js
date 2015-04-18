var config = module.exports;

config["My tests"] = {
    environment: "browser", // or "node"
    rootPath: "../",
    sources: [
        "node_modules/underscore/underscore.js",
        "js/router.js"
    ],
    tests: [
        "test/*-test.js"
    ]
};
