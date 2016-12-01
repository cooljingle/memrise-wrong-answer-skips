// ==UserScript==
// @name           Memrise Wrong Answer Skips
// @namespace      https://github.com/cooljingle
// @description    Cut back on certain extra screens and item repeats when you answer incorrectly
// @match          http://www.memrise.com/course/*/garden/*
// @match          http://www.memrise.com/garden/review/*
// @version        0.0.1
// @updateURL      https://github.com/cooljingle/memrise-wrong-answer-skips/raw/master/Memrise_Wrong_Answer_Skips.user.js
// @downloadURL    https://github.com/cooljingle/memrise-wrong-answer-skips/raw/master/Memrise_Wrong_Answer_Skips.user.js
// @grant          none
// ==/UserScript==

//edit the below values to change what happens when you answer incorrectly
var skipPresentation = true; //screen showing mem
var skipCopytyping = false; //screen for typing the correct answer
var maxTestAdds = 1; //number of test boxes that get added when you answer incorrectly; standard is 3

MEMRISE.garden.boxes.load = (function() {
    var cached_function = MEMRISE.garden.boxes.load;
    return function() {
        MEMRISE.garden.boxes.add_next = (function() {
            var cached_function = MEMRISE.garden.boxes.add_next;
            var testAddCount = 0;
            var previousIsTestBox;
            return function() {
                var result,
                    boxType = arguments[0].template,
                    isTestBox = ["presentation", "copytyping"].indexOf(boxType) === -1;
                if(isTestBox) {
                    testAddCount++;
                } else {
                    testAddCount = 0;
                }

                var shouldSkip = (skipPresentation && boxType === "presentation") ||
                    (skipCopytyping && boxType === "copytyping") ||
                    testAddCount > maxTestAdds;

                if(!shouldSkip){
                    var args = arguments;
                    if(isTestBox && args[1]) { //arguments[1] represents the chosen number of places from the current box to insert a new test box
                        //I've pushed the boxes further along in the case of adding less boxes than the standard amount, you can change this to suit your tastes
                        switch(maxTestAdds){
                            case 1:
                                args[1] = (args[1] + 2)* 2;
                                break;
                            case 2:
                                switch(testAddCount){
                                    case 1:
                                        args[1] = args[1] * 2;
                                        break;
                                    case 2:
                                        args[1] = args[1] * 2;
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case 3:
                                switch(testAddCount){
                                    case 1:
                                        args[1] = args[1]; //corresponds to random(3,7)
                                        break;
                                    case 2:
                                        args[1] = args[1]; //corresponds to first add distance + random(2,6)
                                        break;
                                    case 2:
                                        args[1] = args[1]; //corresponds to second add distance + random(2,6)
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    result = cached_function.apply(this, args);
                } else {
                    return result;
                }
            };
        }());
        return cached_function.apply(this, arguments);
    };
}());
