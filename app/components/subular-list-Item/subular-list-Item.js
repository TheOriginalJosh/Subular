System.register(['angular2/core'], function(exports_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var SubularListItem;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SubularListItem = (function () {
                function SubularListItem() {
                    console.log(this.song);
                }
                SubularListItem.prototype.ngOnInit = function () { };
                SubularListItem = __decorate([
                    core_1.Component({
                        selector: 'subular-list-item',
                        templateUrl: '/app/components/subular-list-Item/subular-list-Item.html',
                        inputs: ['song', 'number']
                    }), 
                    __metadata('design:paramtypes', [])
                ], SubularListItem);
                return SubularListItem;
            }());
            exports_1("SubularListItem", SubularListItem);
        }
    }
});
//# sourceMappingURL=subular-list-Item.js.map