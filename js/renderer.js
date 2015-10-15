var svg;

var rendererSetup = function() {
    svg = document.getElementById("game");
    renderer.canvas = svg;
};

var renderer = {
    canvas: {},
    refresh: function(){
        print("Refreshing Canvas");
    },
    render: function(drawing){
        canvas.render;
        print("Rendering Drawing");
    },
};
