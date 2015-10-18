window.addEventListener("load", start);

function start(){
    print("Starting game");
    rendererSetup();
    controllerSetup();
    print("Game started");
}

function Entity(){
    this.drawing = {};
    this.position = Vector();
    this.draw = function(){

    };
}

var EntityHandler = {
    entities: [],
    addEntity: function(entity){
        entities.push(entity);
    },
    render: function(){

    },

}
