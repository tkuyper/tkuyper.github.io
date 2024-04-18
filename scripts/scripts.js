"use strict";
angular.module("tkuyperGithubIoApp", ["ngAnimate", "ngAria", "ngCookies", "ngResource", "ngRoute", "ngSanitize", "ngTouch"]).config(
    ["$routeProvider", function (a) {
        a.when("/", { templateUrl: "views/main.html", controller: "MainCtrl", controllerAs: "main" })
        .when("/about", { templateUrl: "views/about.html", controller: "AboutCtrl", controllerAs: "about" })
        .when("/blog", { templateUrl: "views/blog.html", controller: "BlogCtrl", controllerAs: "blog" })
        .otherwise({ redirectTo: "/" }) }
    ]
)
.run(["$rootScope", "$location", function (a, b) {
    var c = function () {
        return b.path()
    };
    a.$watch(c, function (b, c) {
        b !== c && (a.activetab = b)
    })
}]),
String.prototype.customToProperCase = function () {
    return this.replace(/\b\w+/g, function (a) {
        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase()
    })
},
String.prototype.customIsUrl = function () {
    return !!this.match(/^(https?:)|^\/|^#/)
},
angular.module("tkuyperGithubIoApp")
    .controller("MainCtrl", ["$scope", function (a) { a.welcomeMessage = "Welcome!" }]),
angular.module("tkuyperGithubIoApp")
    .controller("AboutCtrl", ["$scope", "resumeService", function (a, b) { a.resume = b.resume.get() }]),
angular.module("tkuyperGithubIoApp")
    .controller("BlogCtrl", [
        "$log", "$scope", "blogService", function (a, b, c) {
            var d = this; b.listings = d.listings = c.listings.get(function (a) {
                b.entryShown = !0, b.entryNum = 0, b.entryUrl = a[b.entryNum].file, b.listingClasses = "col-md-4", b.entryClasses = "col-md-7"
            }),
            b.$watch("entryShown", function (a, c) {
                a !== c && (a === !1 ? (b.listingClasses = "", b.entryClasses = "") : (b.listingClasses = "col-md-4", b.entryClasses = "col-md-7"))
            }),
            b.openEntry = function (a) {
                return b.entryShown = !0, 0 > a ? "404.html" : b.listings.length <= a ? "404.html" : (b.entryNum = a, void (b.entryUrl = b.listings[a].file))
            },
            b.closeEntry = function () {
                b.entryShown = !1, b.entryNum = null, b.entryUrl = null
            },
            b.toggleEntry = function (a) {
                a === b.entryNum ? b.closeEntry() : b.openEntry(a)
            }
        }]
    ),
angular.module("tkuyperGithubIoApp")
    .service("blogService", ["$resource", function (a) {
        this.listings = a("/api/bloglistings.json", {}, { get: { isArray: !0 } })
    }]),
angular.module("tkuyperGithubIoApp")
    .service("resumeService", ["$resource", function (a) {
        this.resume = a("/api/resume.json", {}, { cache: !0 })
    }]),
angular.module("tkuyperGithubIoApp")
    .run(["$templateCache", function (a) {
        a.put("views/about.html", `
        <div class="row personal-info" ng-cloak>
            <h1 ng-bind-template="{{resume.firstName}} {{resume.lastName}}"></h1>
            <div class="col-xs-1 col-sm-2">
                <img alt="{{resume.firstName}} {{resume.lastName}}" ng-src="{{resume.avatar}}">
            </div>
            <div class="col-xs-12 col-sm-10">
                <ul class="address">
                    <li class="address-line" ng-repeat="line in resume.address" ng-bind="line"></li>
                </ul>
            </div>
        </div>
        <div class="find-me-on" ng-cloak>
            <h2>Find Me On</h2>
            <ul>
                <li ng-repeat="link in resume.findMeLinks"> <a href="{{link.url}}" target="_blank" ng-bind="link.linkText"></a> </li>
            </ul>
        </div>
        <div class="find-me-on" ng-cloak>
            <h2>Find Me On</h2>
            <ul>
                <li ng-repeat="link in resume.findMeLinks"> <a href="{{link.url}}" target="_blank" ng-bind="link.linkText"></a> </li>
            </ul>
        </div>
        <div class="skills" ng-cloak>
            <h2>Skills and Languages</h2>
            <div class="skill-listing" ng-repeat="skill in resume.skills track by skill.name">
                <table class="skills-table table table-striped">
                    <thead>
                        <tr> <th ng-bind="skill.name" colspan="2"></th> </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="item in [\'experience\',\'skill-level\',\'website\']" ng-if="skill[item]"> <!-- Abuse Bootstrap\'s col-* classes to force cell width, 3 works amazingly well -->
                            <td class="col-xs-3" ng-bind="item.customToProperCase()"></td> <td ng-if="!skill[item].customIsUrl()" ng-bind="skill[item].customToProperCase()"></td>
                            <td ng-if="skill[item].customIsUrl()"> <a href="{{skill[item]}}" target="_blank" ng-bind="skill[item]"></a> </td>
                        </tr>
                        <tr ng-repeat="repo in skill.repositories">
                            <td ng-if="$index===0" rowspan="{{skill.repositories.length}}"> Repositories </td>
                            <td> <a href="{{repo.url}}" target="_blank" ng-bind="repo.linkText"></a> </td>
                        </tr>
                        <tr ng-repeat="subskill in skill.skills">
                            <td ng-if="$index===0" ng-bind-template="{{skill.name}} Subskills" rowspan="{{skill.skills.length}}"></td>
                            <td ng-bind="subskill"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`),
        a.put("views/blog.html", `
        <div class="row">
            <div class="bloglistings">
                <ul class="open-close-list" ng-hide="hideListings&&entryShown">
                    <li ng-repeat="listing in listings" ng-class="{\'open\': $index === entryNum, \'closed\': $index !== entryNum}">
                        <a href="#/blog" ng-click="toggleEntry($index)" ng-bind="listing.title"></a>
                        <div ng-if="entryNum === $index">
                            <div class="blog-entry" ng-include="entryUrl"></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>`),
        a.put("views/main.html", `
        <div class="main-image-wrapper">
            <img class="img-responsive center-block img-rounded" src="images/Code.jpeg" alt="syntax highlighted code">
        </div>
        <p class="text-center"> I am a person who is interested in learning just about anything about anything,
            especially computers in general and programming specifically. I love learning new programming styles,
            paradigms, design patterns, languages, etc. Every lesson learned is an opportunity to revisit what I
            already know and apply the newly gained knowledge. Among the things I\'ve developed an interest in
            and still wish to learn more about is functional programming (especially Haskell), event-driven
            architecture (especially Node.js), and game design.
        </p>
        <p class="text-center"> I have a philosophy about programming: </p>
        <blockquote> Programming languages are like tools in a toolbox. They all have a purpose and a specialty.
            Knowing one language is like only having a hammer; certainly everything looks like a nail, but wouldn\'t
            you rather use the right tool for the job? </blockquote>
        <p class="text-center"> Of course, in this vein Perl is a Swiss Army chainsaw and requires knowing no
            other languages (I kid). </p>`)
    }]);