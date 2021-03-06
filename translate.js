(function (ng) {
  'use strict';
  /* Services */
  ng.module('translate', [], ['$provide', function ($provide){
    $provide.factory('translate', ['$log', function ($log) {
      var localizedStrings = {};
      var log = true;
      var translate = function translate(sourceString) {
        if (!sourceString) {
          return '';
        }
        sourceString = sourceString.trim();
        if (localizedStrings[sourceString]) {
          return localizedStrings[sourceString];
        } else {
          if (log) $log.warn('Missing localisation for "' + sourceString + '"');
          return sourceString;
        }
      };
      translate.add = function (translations) {
        ng.extend(localizedStrings, translations);
      };
      translate.remove = function(key) {
        if (localizedStrings[key]) {
          delete localizedStrings[key];
          return true;
        }
        return false;
      };
      translate.set = function(translations) {
        localizedStrings = translations;
      };
      translate.logMissedHits = function(boolLog) {
        log = boolLog;
      };
      return translate;
    }]);
  }]);

  /* Directives */
  ng.module('translate.directives', [], ['$compileProvider', function ($compileProvider) {
    $compileProvider.directive('translate', ['$compile', 'translate', function ($compile, translate) {
      return {
        priority: 10, //Should be evaluated befor e. G. pluralize
        restrict: 'ECMA',
        compile: function compile(el, attrs) {
          var translateInnerHtml = false;
          if (attrs.translate) {
            var attrsToTranslate = attrs.translate.split(' ')
            ng.forEach(attrsToTranslate , function(v, k) {
              el.attr(v, translate(attrs[v]));
            });
            translateInnerHtml = attrsToTranslate.indexOf('innerHTML') >= 0;
          } else {
            translateInnerHtml = true;
          }
          return function preLink(scope, el, attrs) {
            if (translateInnerHtml) {
              el.html(translate(el.html()));
            }
            $compile(el.contents())(scope);
          };
        }
      };
    }]);
  }]);
}(angular));
