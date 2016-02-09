angular
	.module("app")
	.service("browserService", browserService);

browserService.$inject = ["chromeService", "firefoxService"];

/**
 * Will return appropriate browserService
 * @return chromeService | firefoxService
 */
function browserService(chrome, firefox) {
    var browser = firefox;

    if (!!window.chrome)
        browser = chrome;

    return browser;
}