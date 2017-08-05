var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
var AboutPageComponent = (function () {
    function AboutPageComponent() {
    }
    AboutPageComponent.prototype.scrollToAnchor = function (acnhor) {
        var element = document.querySelector('#' + acnhor);
        if (element) {
            element.scrollIntoView();
        }
    };
    AboutPageComponent = __decorate([
        Component({
            selector: 'about-page',
            templateUrl: './about.component.html',
            styleUrls: [
                '../../styles/main.less',
                './about.component.less'
            ],
        })
    ], AboutPageComponent);
    return AboutPageComponent;
}());
export { AboutPageComponent };
//# sourceMappingURL=about.component.js.map