window.addEventListener("load", start);

function start(){
    print("Starting game");
    rendererSetup();
    controllerSetup();
    print("Game started");
}

var EntityHandler = {
    entities: [],
    addEntity: function(entity){
        entities.push(entity);
    },
    render: function(){

    },

}
