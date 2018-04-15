require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react-hot-loader");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _express = __webpack_require__(4);

var _express2 = _interopRequireDefault(_express);

var _cors = __webpack_require__(5);

var _cors2 = _interopRequireDefault(_cors);

var _wordnet = __webpack_require__(6);

var wordnet = _interopRequireWildcard(_wordnet);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = __webpack_require__(0).enterModule;

  enterModule && enterModule(module);
})();

var port = Number(process.env.PORT) || 3000;

var app = (0, _express2.default)();

app.use((0, _cors2.default)());

app.get('/wordnet/search', function (req, res) {
  var text = req.query.text;

  if (!text) return res.status(400).send({ error: 'required text param' });
  return res.status(200).send(wordnet.search(text));
});

app.listen(port, function () {
  return console.log('Started Server: http://localhost:' + port);
});
;

(function () {
  var reactHotLoader = __webpack_require__(0).default;

  var leaveModule = __webpack_require__(0).leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(port, 'port', '/app/src/server.js');
  reactHotLoader.register(app, 'app', '/app/src/server.js');
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.search = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _betterSqlite = __webpack_require__(7);

var _betterSqlite2 = _interopRequireDefault(_betterSqlite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = __webpack_require__(0).enterModule;

  enterModule && enterModule(module);
})();

var db = new _betterSqlite2.default('/resources/wnjpn.db');

var search = exports.search = function search(text) {
  var data = {};
  var senses = db.prepare('\n      SELECT sense.synset, word.lemma FROM sense\n        INNER JOIN word ON word.wordid = sense.wordid\n        WHERE word.lemma LIKE ?\n        ORDER BY sense.synset ASC\n      ').all('%' + text + '%');

  senses.forEach(function (_ref) {
    var synset = _ref.synset;

    var childSenses = db.prepare('\n        SELECT sense.synset, word.lemma FROM sense\n          INNER JOIN word ON word.wordid = sense.wordid\n          WHERE sense.synset = ?\n            AND sense.lang = \'jpn\'\n          ORDER BY sense.synset ASC\n        ').all(synset);
    data[synset] = { senses: childSenses, link: 'self' };
  });

  senses.forEach(function (_ref2) {
    var synset = _ref2.synset;

    var synsSenses = db.prepare('\n        SELECT synlink.link, synlink.synset2 FROM sense\n          INNER JOIN word ON word.wordid = sense.wordid\n          INNER JOIN synlink ON synlink.synset1 = sense.synset\n          WHERE sense.synset = ?\n            AND sense.lang = \'jpn\'\n          ORDER BY sense.synset ASC\n        ').all(synset);
    synsSenses.forEach(function (_ref3) {
      var link = _ref3.link,
          synset2 = _ref3.synset2;

      var childSenses = db.prepare('\n          SELECT sense.synset, word.lemma FROM sense\n            INNER JOIN word ON word.wordid = sense.wordid\n            WHERE sense.synset = ?\n              AND sense.lang = \'jpn\'\n            ORDER BY sense.synset ASC\n          ').all(synset2);
      if (childSenses.length > 0 && !data[synset2]) {
        data[synset2] = { senses: childSenses, link: link };
      }
    });
  });

  Object.keys(data).forEach(function (synset) {
    var linkNet = {};
    // Object.keys(data).forEach(s => {
    //   if (
    //     synset !== s &&
    //     data[synset].link === 'self' &&
    //     data[synset].link === data[s].link
    //   ) {
    //     linkNet[s] = data[s].link;
    //   }
    // });
    {
      var links = db.prepare('\n          SELECT synlink.* FROM synlink\n            WHERE synlink.synset1 = ?\n          ').all(synset);
      links.forEach(function (_ref4) {
        var synset2 = _ref4.synset2,
            link = _ref4.link;

        if (data[synset2]) linkNet[synset2] = link;
      });
    }
    // {
    //   const links = db
    //     .prepare(
    //       `
    //       SELECT synlink.* FROM synlink
    //         WHERE synlink.synset2 = ?
    //       `,
    //     )
    //     .all(synset);
    //   links.forEach(({ synset1, link }) => {
    //     if (data[synset1]) linkNet[synset1] = link;
    //   });
    // }
    data[synset] = _extends({}, data[synset], { linkNet: linkNet });
  });

  return data;
};

var _default = search;
exports.default = _default;
;

(function () {
  var reactHotLoader = __webpack_require__(0).default;

  var leaveModule = __webpack_require__(0).leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(db, 'db', '/app/src/utils/wordnet.js');
  reactHotLoader.register(search, 'search', '/app/src/utils/wordnet.js');
  reactHotLoader.register(_default, 'default', '/app/src/utils/wordnet.js');
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("better-sqlite3");

/***/ })
/******/ ]);
//# sourceMappingURL=main.map