var controllerSetup = function() {
    print("Setting up Controller");
    document.getElementById("game").keydown = handleKeyDown;
    document.getElementById("game").keypress = handleKeyPress;
    document.getElementById("game").keyup = handleKeyUp;
    print("Controller set up");
};

var handleKeyDown = function(event){
    print("Keydown");
    print(event);
};

var handleKeyPress = function(event){
    print("Keypress");
    print(event);
};

var handleKeyUp = function(event){
    print("Keyup");
    print(event);
};
