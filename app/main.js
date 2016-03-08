System.register(['angular2/platform/browser', './app.component', 'angular2/http', 'angular2/router', './shared/directives/subular-list-box/subular-list-box.service', './shared/services/player-service', './shared/services/subular-service', './shared/services/settings-service'], function(exports_1) {
    "use strict";
    var browser_1, app_component_1, http_1, router_1, subular_list_box_service_1, player_service_1, subular_service_1, settings_service_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (subular_list_box_service_1_1) {
                subular_list_box_service_1 = subular_list_box_service_1_1;
            },
            function (player_service_1_1) {
                player_service_1 = player_service_1_1;
            },
            function (subular_service_1_1) {
                subular_service_1 = subular_service_1_1;
            },
            function (settings_service_1_1) {
                settings_service_1 = settings_service_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.SubularApp, [http_1.HTTP_PROVIDERS, router_1.ROUTER_PROVIDERS, subular_list_box_service_1.SubularListBoxService, subular_service_1.SubularService, settings_service_1.SettingsService, player_service_1.PlayerService]);
        }
    }
});
//# sourceMappingURL=main.js.map