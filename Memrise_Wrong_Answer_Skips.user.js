// ==UserScript==
// @name           Memrise Wrong Answer Skips
// @namespace      https://github.com/cooljingle
// @description    Cut back on certain extra screens and item repeats when you answer incorrectly
// @match          https://www.memrise.com/course/*/garden/*
// @match          https://www.memrise.com/garden/review/*
// @version        0.0.7
// @updateURL      https://github.com/cooljingle/memrise-wrong-answer-skips/raw/master/Memrise_Wrong_Answer_Skips.user.js
// @downloadURL    https://github.com/cooljingle/memrise-wrong-answer-skips/raw/master/Memrise_Wrong_Answer_Skips.user.js
// @grant          none
// ==/UserScript==

$(document).ready(function() {
    MEMRISE.garden.boxes.load = (function() {
        var cached_function = MEMRISE.garden.boxes.load;
        return function() {
            MEMRISE.garden.boxes.add_next = (function() {
                var cached_function = MEMRISE.garden.boxes.add_next;
                return function() {
                    var result = cached_function.apply(this, arguments);
                    if(arguments[0].template === "copytyping" && MEMRISE.garden.boxes._list[MEMRISE.garden.boxes.num + 1].template === "presentation")
                        MEMRISE.garden.boxes._list.splice(MEMRISE.garden.boxes.num + 1, 1);
                    return result;
                };
            }());
            return cached_function.apply(this, arguments);
        };
    }());
});
