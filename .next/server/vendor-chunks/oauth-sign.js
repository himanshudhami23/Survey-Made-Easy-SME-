/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/oauth-sign";
exports.ids = ["vendor-chunks/oauth-sign"];
exports.modules = {

/***/ "(rsc)/./node_modules/oauth-sign/index.js":
/*!******************************************!*\
  !*** ./node_modules/oauth-sign/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("var crypto = __webpack_require__(/*! crypto */ \"crypto\")\n\nfunction sha (key, body, algorithm) {\n  return crypto.createHmac(algorithm, key).update(body).digest('base64')\n}\n\nfunction rsa (key, body) {\n  return crypto.createSign('RSA-SHA1').update(body).sign(key, 'base64')\n}\n\nfunction rfc3986 (str) {\n  return encodeURIComponent(str)\n    .replace(/!/g,'%21')\n    .replace(/\\*/g,'%2A')\n    .replace(/\\(/g,'%28')\n    .replace(/\\)/g,'%29')\n    .replace(/'/g,'%27')\n}\n\n// Maps object to bi-dimensional array\n// Converts { foo: 'A', bar: [ 'b', 'B' ]} to\n// [ ['foo', 'A'], ['bar', 'b'], ['bar', 'B'] ]\nfunction map (obj) {\n  var key, val, arr = []\n  for (key in obj) {\n    val = obj[key]\n    if (Array.isArray(val))\n      for (var i = 0; i < val.length; i++)\n        arr.push([key, val[i]])\n    else if (typeof val === 'object')\n      for (var prop in val)\n        arr.push([key + '[' + prop + ']', val[prop]])\n    else\n      arr.push([key, val])\n  }\n  return arr\n}\n\n// Compare function for sort\nfunction compare (a, b) {\n  return a > b ? 1 : a < b ? -1 : 0\n}\n\nfunction generateBase (httpMethod, base_uri, params) {\n  // adapted from https://dev.twitter.com/docs/auth/oauth and \n  // https://dev.twitter.com/docs/auth/creating-signature\n\n  // Parameter normalization\n  // http://tools.ietf.org/html/rfc5849#section-3.4.1.3.2\n  var normalized = map(params)\n  // 1.  First, the name and value of each parameter are encoded\n  .map(function (p) {\n    return [ rfc3986(p[0]), rfc3986(p[1] || '') ]\n  })\n  // 2.  The parameters are sorted by name, using ascending byte value\n  //     ordering.  If two or more parameters share the same name, they\n  //     are sorted by their value.\n  .sort(function (a, b) {\n    return compare(a[0], b[0]) || compare(a[1], b[1])\n  })\n  // 3.  The name of each parameter is concatenated to its corresponding\n  //     value using an \"=\" character (ASCII code 61) as a separator, even\n  //     if the value is empty.\n  .map(function (p) { return p.join('=') })\n   // 4.  The sorted name/value pairs are concatenated together into a\n   //     single string by using an \"&\" character (ASCII code 38) as\n   //     separator.\n  .join('&')\n\n  var base = [\n    rfc3986(httpMethod ? httpMethod.toUpperCase() : 'GET'),\n    rfc3986(base_uri),\n    rfc3986(normalized)\n  ].join('&')\n\n  return base\n}\n\nfunction hmacsign (httpMethod, base_uri, params, consumer_secret, token_secret) {\n  var base = generateBase(httpMethod, base_uri, params)\n  var key = [\n    consumer_secret || '',\n    token_secret || ''\n  ].map(rfc3986).join('&')\n\n  return sha(key, base, 'sha1')\n}\n\nfunction hmacsign256 (httpMethod, base_uri, params, consumer_secret, token_secret) {\n  var base = generateBase(httpMethod, base_uri, params)\n  var key = [\n    consumer_secret || '',\n    token_secret || ''\n  ].map(rfc3986).join('&')\n\n  return sha(key, base, 'sha256')\n}\n\nfunction rsasign (httpMethod, base_uri, params, private_key, token_secret) {\n  var base = generateBase(httpMethod, base_uri, params)\n  var key = private_key || ''\n\n  return rsa(key, base)\n}\n\nfunction plaintext (consumer_secret, token_secret) {\n  var key = [\n    consumer_secret || '',\n    token_secret || ''\n  ].map(rfc3986).join('&')\n\n  return key\n}\n\nfunction sign (signMethod, httpMethod, base_uri, params, consumer_secret, token_secret) {\n  var method\n  var skipArgs = 1\n\n  switch (signMethod) {\n    case 'RSA-SHA1':\n      method = rsasign\n      break\n    case 'HMAC-SHA1':\n      method = hmacsign\n      break\n    case 'HMAC-SHA256':\n      method = hmacsign256\n      break\n    case 'PLAINTEXT':\n      method = plaintext\n      skipArgs = 4\n      break\n    default:\n     throw new Error('Signature method not supported: ' + signMethod)\n  }\n\n  return method.apply(null, [].slice.call(arguments, skipArgs))\n}\n\nexports.hmacsign = hmacsign\nexports.hmacsign256 = hmacsign256\nexports.rsasign = rsasign\nexports.plaintext = plaintext\nexports.sign = sign\nexports.rfc3986 = rfc3986\nexports.generateBase = generateBase//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvb2F1dGgtc2lnbi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQSxhQUFhLG1CQUFPLENBQUMsc0JBQVE7O0FBRTdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsNkJBQTZCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixnQkFBZ0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isb0JBQW9CO0FBQzFDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxnQkFBZ0I7QUFDaEIsbUJBQW1CO0FBQ25CLGVBQWU7QUFDZixpQkFBaUI7QUFDakIsWUFBWTtBQUNaLGVBQWU7QUFDZixvQkFBb0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYWdlLWZvcm0vLi9ub2RlX21vZHVsZXMvb2F1dGgtc2lnbi9pbmRleC5qcz8wYTA5Il0sInNvdXJjZXNDb250ZW50IjpbInZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxuXG5mdW5jdGlvbiBzaGEgKGtleSwgYm9keSwgYWxnb3JpdGhtKSB7XG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSG1hYyhhbGdvcml0aG0sIGtleSkudXBkYXRlKGJvZHkpLmRpZ2VzdCgnYmFzZTY0Jylcbn1cblxuZnVuY3Rpb24gcnNhIChrZXksIGJvZHkpIHtcbiAgcmV0dXJuIGNyeXB0by5jcmVhdGVTaWduKCdSU0EtU0hBMScpLnVwZGF0ZShib2R5KS5zaWduKGtleSwgJ2Jhc2U2NCcpXG59XG5cbmZ1bmN0aW9uIHJmYzM5ODYgKHN0cikge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgICAucmVwbGFjZSgvIS9nLCclMjEnKVxuICAgIC5yZXBsYWNlKC9cXCovZywnJTJBJylcbiAgICAucmVwbGFjZSgvXFwoL2csJyUyOCcpXG4gICAgLnJlcGxhY2UoL1xcKS9nLCclMjknKVxuICAgIC5yZXBsYWNlKC8nL2csJyUyNycpXG59XG5cbi8vIE1hcHMgb2JqZWN0IHRvIGJpLWRpbWVuc2lvbmFsIGFycmF5XG4vLyBDb252ZXJ0cyB7IGZvbzogJ0EnLCBiYXI6IFsgJ2InLCAnQicgXX0gdG9cbi8vIFsgWydmb28nLCAnQSddLCBbJ2JhcicsICdiJ10sIFsnYmFyJywgJ0InXSBdXG5mdW5jdGlvbiBtYXAgKG9iaikge1xuICB2YXIga2V5LCB2YWwsIGFyciA9IFtdXG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIHZhbCA9IG9ialtrZXldXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSlcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKVxuICAgICAgICBhcnIucHVzaChba2V5LCB2YWxbaV1dKVxuICAgIGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKVxuICAgICAgZm9yICh2YXIgcHJvcCBpbiB2YWwpXG4gICAgICAgIGFyci5wdXNoKFtrZXkgKyAnWycgKyBwcm9wICsgJ10nLCB2YWxbcHJvcF1dKVxuICAgIGVsc2VcbiAgICAgIGFyci5wdXNoKFtrZXksIHZhbF0pXG4gIH1cbiAgcmV0dXJuIGFyclxufVxuXG4vLyBDb21wYXJlIGZ1bmN0aW9uIGZvciBzb3J0XG5mdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMFxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUJhc2UgKGh0dHBNZXRob2QsIGJhc2VfdXJpLCBwYXJhbXMpIHtcbiAgLy8gYWRhcHRlZCBmcm9tIGh0dHBzOi8vZGV2LnR3aXR0ZXIuY29tL2RvY3MvYXV0aC9vYXV0aCBhbmQgXG4gIC8vIGh0dHBzOi8vZGV2LnR3aXR0ZXIuY29tL2RvY3MvYXV0aC9jcmVhdGluZy1zaWduYXR1cmVcblxuICAvLyBQYXJhbWV0ZXIgbm9ybWFsaXphdGlvblxuICAvLyBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM1ODQ5I3NlY3Rpb24tMy40LjEuMy4yXG4gIHZhciBub3JtYWxpemVkID0gbWFwKHBhcmFtcylcbiAgLy8gMS4gIEZpcnN0LCB0aGUgbmFtZSBhbmQgdmFsdWUgb2YgZWFjaCBwYXJhbWV0ZXIgYXJlIGVuY29kZWRcbiAgLm1hcChmdW5jdGlvbiAocCkge1xuICAgIHJldHVybiBbIHJmYzM5ODYocFswXSksIHJmYzM5ODYocFsxXSB8fCAnJykgXVxuICB9KVxuICAvLyAyLiAgVGhlIHBhcmFtZXRlcnMgYXJlIHNvcnRlZCBieSBuYW1lLCB1c2luZyBhc2NlbmRpbmcgYnl0ZSB2YWx1ZVxuICAvLyAgICAgb3JkZXJpbmcuICBJZiB0d28gb3IgbW9yZSBwYXJhbWV0ZXJzIHNoYXJlIHRoZSBzYW1lIG5hbWUsIHRoZXlcbiAgLy8gICAgIGFyZSBzb3J0ZWQgYnkgdGhlaXIgdmFsdWUuXG4gIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGNvbXBhcmUoYVswXSwgYlswXSkgfHwgY29tcGFyZShhWzFdLCBiWzFdKVxuICB9KVxuICAvLyAzLiAgVGhlIG5hbWUgb2YgZWFjaCBwYXJhbWV0ZXIgaXMgY29uY2F0ZW5hdGVkIHRvIGl0cyBjb3JyZXNwb25kaW5nXG4gIC8vICAgICB2YWx1ZSB1c2luZyBhbiBcIj1cIiBjaGFyYWN0ZXIgKEFTQ0lJIGNvZGUgNjEpIGFzIGEgc2VwYXJhdG9yLCBldmVuXG4gIC8vICAgICBpZiB0aGUgdmFsdWUgaXMgZW1wdHkuXG4gIC5tYXAoZnVuY3Rpb24gKHApIHsgcmV0dXJuIHAuam9pbignPScpIH0pXG4gICAvLyA0LiAgVGhlIHNvcnRlZCBuYW1lL3ZhbHVlIHBhaXJzIGFyZSBjb25jYXRlbmF0ZWQgdG9nZXRoZXIgaW50byBhXG4gICAvLyAgICAgc2luZ2xlIHN0cmluZyBieSB1c2luZyBhbiBcIiZcIiBjaGFyYWN0ZXIgKEFTQ0lJIGNvZGUgMzgpIGFzXG4gICAvLyAgICAgc2VwYXJhdG9yLlxuICAuam9pbignJicpXG5cbiAgdmFyIGJhc2UgPSBbXG4gICAgcmZjMzk4NihodHRwTWV0aG9kID8gaHR0cE1ldGhvZC50b1VwcGVyQ2FzZSgpIDogJ0dFVCcpLFxuICAgIHJmYzM5ODYoYmFzZV91cmkpLFxuICAgIHJmYzM5ODYobm9ybWFsaXplZClcbiAgXS5qb2luKCcmJylcblxuICByZXR1cm4gYmFzZVxufVxuXG5mdW5jdGlvbiBobWFjc2lnbiAoaHR0cE1ldGhvZCwgYmFzZV91cmksIHBhcmFtcywgY29uc3VtZXJfc2VjcmV0LCB0b2tlbl9zZWNyZXQpIHtcbiAgdmFyIGJhc2UgPSBnZW5lcmF0ZUJhc2UoaHR0cE1ldGhvZCwgYmFzZV91cmksIHBhcmFtcylcbiAgdmFyIGtleSA9IFtcbiAgICBjb25zdW1lcl9zZWNyZXQgfHwgJycsXG4gICAgdG9rZW5fc2VjcmV0IHx8ICcnXG4gIF0ubWFwKHJmYzM5ODYpLmpvaW4oJyYnKVxuXG4gIHJldHVybiBzaGEoa2V5LCBiYXNlLCAnc2hhMScpXG59XG5cbmZ1bmN0aW9uIGhtYWNzaWduMjU2IChodHRwTWV0aG9kLCBiYXNlX3VyaSwgcGFyYW1zLCBjb25zdW1lcl9zZWNyZXQsIHRva2VuX3NlY3JldCkge1xuICB2YXIgYmFzZSA9IGdlbmVyYXRlQmFzZShodHRwTWV0aG9kLCBiYXNlX3VyaSwgcGFyYW1zKVxuICB2YXIga2V5ID0gW1xuICAgIGNvbnN1bWVyX3NlY3JldCB8fCAnJyxcbiAgICB0b2tlbl9zZWNyZXQgfHwgJydcbiAgXS5tYXAocmZjMzk4Nikuam9pbignJicpXG5cbiAgcmV0dXJuIHNoYShrZXksIGJhc2UsICdzaGEyNTYnKVxufVxuXG5mdW5jdGlvbiByc2FzaWduIChodHRwTWV0aG9kLCBiYXNlX3VyaSwgcGFyYW1zLCBwcml2YXRlX2tleSwgdG9rZW5fc2VjcmV0KSB7XG4gIHZhciBiYXNlID0gZ2VuZXJhdGVCYXNlKGh0dHBNZXRob2QsIGJhc2VfdXJpLCBwYXJhbXMpXG4gIHZhciBrZXkgPSBwcml2YXRlX2tleSB8fCAnJ1xuXG4gIHJldHVybiByc2Eoa2V5LCBiYXNlKVxufVxuXG5mdW5jdGlvbiBwbGFpbnRleHQgKGNvbnN1bWVyX3NlY3JldCwgdG9rZW5fc2VjcmV0KSB7XG4gIHZhciBrZXkgPSBbXG4gICAgY29uc3VtZXJfc2VjcmV0IHx8ICcnLFxuICAgIHRva2VuX3NlY3JldCB8fCAnJ1xuICBdLm1hcChyZmMzOTg2KS5qb2luKCcmJylcblxuICByZXR1cm4ga2V5XG59XG5cbmZ1bmN0aW9uIHNpZ24gKHNpZ25NZXRob2QsIGh0dHBNZXRob2QsIGJhc2VfdXJpLCBwYXJhbXMsIGNvbnN1bWVyX3NlY3JldCwgdG9rZW5fc2VjcmV0KSB7XG4gIHZhciBtZXRob2RcbiAgdmFyIHNraXBBcmdzID0gMVxuXG4gIHN3aXRjaCAoc2lnbk1ldGhvZCkge1xuICAgIGNhc2UgJ1JTQS1TSEExJzpcbiAgICAgIG1ldGhvZCA9IHJzYXNpZ25cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnSE1BQy1TSEExJzpcbiAgICAgIG1ldGhvZCA9IGhtYWNzaWduXG4gICAgICBicmVha1xuICAgIGNhc2UgJ0hNQUMtU0hBMjU2JzpcbiAgICAgIG1ldGhvZCA9IGhtYWNzaWduMjU2XG4gICAgICBicmVha1xuICAgIGNhc2UgJ1BMQUlOVEVYVCc6XG4gICAgICBtZXRob2QgPSBwbGFpbnRleHRcbiAgICAgIHNraXBBcmdzID0gNFxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpZ25hdHVyZSBtZXRob2Qgbm90IHN1cHBvcnRlZDogJyArIHNpZ25NZXRob2QpXG4gIH1cblxuICByZXR1cm4gbWV0aG9kLmFwcGx5KG51bGwsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCBza2lwQXJncykpXG59XG5cbmV4cG9ydHMuaG1hY3NpZ24gPSBobWFjc2lnblxuZXhwb3J0cy5obWFjc2lnbjI1NiA9IGhtYWNzaWduMjU2XG5leHBvcnRzLnJzYXNpZ24gPSByc2FzaWduXG5leHBvcnRzLnBsYWludGV4dCA9IHBsYWludGV4dFxuZXhwb3J0cy5zaWduID0gc2lnblxuZXhwb3J0cy5yZmMzOTg2ID0gcmZjMzk4NlxuZXhwb3J0cy5nZW5lcmF0ZUJhc2UgPSBnZW5lcmF0ZUJhc2UiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/oauth-sign/index.js\n");

/***/ })

};
;