"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/challenges/market",{

/***/ "./pages/challenges/market.js":
/*!************************************!*\
  !*** ./pages/challenges/market.js ***!
  \************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Market; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction Market() {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                children: \"Market\"\n            }, void 0, false, {\n                fileName: \"/Users/gabrielbenmergui/Silver/interview-practice/frontend/pages/challenges/market.js\",\n                lineNumber: 4,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                children: [\n                    \"We run a real-time brokerage that sells stocks. Build a UI that can accept a real-time feed of orders and displays the status of orders visually.\",\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"br\", {}, void 0, false, {\n                        fileName: \"/Users/gabrielbenmergui/Silver/interview-practice/frontend/pages/challenges/market.js\",\n                        lineNumber: 9,\n                        columnNumber: 9\n                    }, this),\n                    \"A Market is composed of buy orders and sell orders that are submitted to the broker. Orders have\",\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        style: {\n                            border: \"1px solid white\"\n                        },\n                        children: \"price: number quantity: Integer symbol: string type: SELL / BUY status: OPEN, CANCELLED, FULFILLED\"\n                    }, void 0, false, {\n                        fileName: \"/Users/gabrielbenmergui/Silver/interview-practice/frontend/pages/challenges/market.js\",\n                        lineNumber: 14,\n                        columnNumber: 9\n                    }, this),\n                    \"When a buy order has a price below a sell order, the quantity of each diminishes until one of the quantities goes to 0, and thus the order is fulfilled.\",\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"br\", {}, void 0, false, {\n                        fileName: \"/Users/gabrielbenmergui/Silver/interview-practice/frontend/pages/challenges/market.js\",\n                        lineNumber: 23,\n                        columnNumber: 9\n                    }, this),\n                    \"1. The UI should allow generating orders of any kind and process the input 2. The UI can be very simple but must show the best big and best offer (the price to buy and the price to sell) correctly at any point\"\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/gabrielbenmergui/Silver/interview-practice/frontend/pages/challenges/market.js\",\n                lineNumber: 7,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"iframe\", {\n                width: \"560\",\n                height: \"315\",\n                src: \"https://www.youtube.com/embed/M8fqHaJU_cc\",\n                title: \"YouTube video player\",\n                frameborder: \"0\",\n                allow: \"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\",\n                allowfullscreen: true\n            }, void 0, false, {\n                fileName: \"/Users/gabrielbenmergui/Silver/interview-practice/frontend/pages/challenges/market.js\",\n                lineNumber: 28,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n_c = Market;\nvar _c;\n$RefreshReg$(_c, \"Market\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9jaGFsbGVuZ2VzL21hcmtldC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQWUsU0FBU0E7SUFDdEIscUJBQ0U7OzBCQUNFLDhEQUFDQzswQkFBRzs7Ozs7OzBCQUdKLDhEQUFDQzs7b0JBQUU7a0NBRUQsOERBQUNDOzs7OztvQkFBSztrQ0FLTiw4REFBQ0M7d0JBQUlDLE9BQU87NEJBQUVDLFFBQVE7d0JBQWlCO2tDQUFHOzs7Ozs7b0JBTXBDO2tDQUdOLDhEQUFDSDs7Ozs7b0JBQUs7Ozs7Ozs7MEJBS1IsOERBQUNJO2dCQUFPQyxPQUFNO2dCQUFNQyxRQUFPO2dCQUFNQyxLQUFJO2dCQUE0Q0MsT0FBTTtnQkFBdUJDLGFBQVk7Z0JBQUlDLE9BQU07Z0JBQXNHQyxlQUFlOzs7Ozs7OztBQUcvUDtLQTlCd0JkIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3BhZ2VzL2NoYWxsZW5nZXMvbWFya2V0LmpzPzFmODQiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWFya2V0KCkge1xuICByZXR1cm4oXG4gICAgPD5cbiAgICAgIDxoMT5cbiAgICAgICAgTWFya2V0XG4gICAgICA8L2gxPlxuICAgICAgPHA+XG4gICAgICAgIFdlIHJ1biBhIHJlYWwtdGltZSBicm9rZXJhZ2UgdGhhdCBzZWxscyBzdG9ja3MuIEJ1aWxkIGEgVUkgdGhhdCBjYW4gYWNjZXB0IGEgcmVhbC10aW1lIGZlZWQgb2Ygb3JkZXJzIGFuZCBkaXNwbGF5cyB0aGUgc3RhdHVzIG9mIG9yZGVycyB2aXN1YWxseS5cbiAgICAgICAgPGJyIC8+XG4gICAgICAgIEEgTWFya2V0IGlzIGNvbXBvc2VkIG9mIGJ1eSBvcmRlcnMgYW5kIHNlbGwgb3JkZXJzIHRoYXQgYXJlIHN1Ym1pdHRlZCB0byB0aGUgYnJva2VyLlxuXG4gICAgICAgIE9yZGVycyBoYXZlXG5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBib3JkZXI6ICcxcHggc29saWQgd2hpdGUnfX0+XG4gICAgICAgICAgcHJpY2U6IG51bWJlclxuICAgICAgICAgIHF1YW50aXR5OiBJbnRlZ2VyXG4gICAgICAgICAgc3ltYm9sOiBzdHJpbmdcbiAgICAgICAgICB0eXBlOiBTRUxMIC8gQlVZXG4gICAgICAgICAgc3RhdHVzOiBPUEVOLCBDQU5DRUxMRUQsIEZVTEZJTExFRFxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICBXaGVuIGEgYnV5IG9yZGVyIGhhcyBhIHByaWNlIGJlbG93IGEgc2VsbCBvcmRlciwgdGhlIHF1YW50aXR5IG9mIGVhY2ggZGltaW5pc2hlcyB1bnRpbCBvbmUgb2YgdGhlIHF1YW50aXRpZXMgZ29lcyB0byAwLCBhbmQgdGh1cyB0aGUgb3JkZXIgaXMgZnVsZmlsbGVkLlxuICAgICAgICA8YnIgLz5cblxuICAgICAgICAxLiBUaGUgVUkgc2hvdWxkIGFsbG93IGdlbmVyYXRpbmcgb3JkZXJzIG9mIGFueSBraW5kIGFuZCBwcm9jZXNzIHRoZSBpbnB1dFxuICAgICAgICAyLiBUaGUgVUkgY2FuIGJlIHZlcnkgc2ltcGxlIGJ1dCBtdXN0IHNob3cgdGhlIGJlc3QgYmlnIGFuZCBiZXN0IG9mZmVyICh0aGUgcHJpY2UgdG8gYnV5IGFuZCB0aGUgcHJpY2UgdG8gc2VsbCkgY29ycmVjdGx5IGF0IGFueSBwb2ludFxuICAgICAgPC9wPlxuICAgICAgPGlmcmFtZSB3aWR0aD1cIjU2MFwiIGhlaWdodD1cIjMxNVwiIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL004ZnFIYUpVX2NjXCIgdGl0bGU9XCJZb3VUdWJlIHZpZGVvIHBsYXllclwiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93PVwiYWNjZWxlcm9tZXRlcjsgYXV0b3BsYXk7IGNsaXBib2FyZC13cml0ZTsgZW5jcnlwdGVkLW1lZGlhOyBneXJvc2NvcGU7IHBpY3R1cmUtaW4tcGljdHVyZTsgd2ViLXNoYXJlXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPlxuICAgIDwvPlxuICApXG59XG4iXSwibmFtZXMiOlsiTWFya2V0IiwiaDEiLCJwIiwiYnIiLCJkaXYiLCJzdHlsZSIsImJvcmRlciIsImlmcmFtZSIsIndpZHRoIiwiaGVpZ2h0Iiwic3JjIiwidGl0bGUiLCJmcmFtZWJvcmRlciIsImFsbG93IiwiYWxsb3dmdWxsc2NyZWVuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/challenges/market.js\n"));

/***/ })

});