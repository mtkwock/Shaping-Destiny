var Entity = function(parent){
    if(parent){
        this.parent = parent;
    }
    this.position = new Vector2d([-1, -1]);
    this.direction = new Vector2d([1, 0]); // Must be unit vector
    this.segments = [];
    this._dead = false; // Checked later.  If dead,
};

Entity.constructor = Entity;
Entity.prototype = {
    _update: function(dTime){
        // Function called by the updater.  Not changed

    },
    updateAlive: function(dTime){

    },
    updateDead: function(dTime){

    },
    positionSet: function(vec2d){
        this.position = vec2d;
    },
    positionAdd: function(vec2d){

    },
    directionSet: function(vec2d){

    },
    directionAdd: function(vec2d){

    },
    mousedown: function(event){
        console.log(event);
    },
    mouseup: function(event){
        console.log(event);
    },
    mouseover: function(){
        console.log("Mouse entered");
    },
    mouseout: function(){
        console.log("Mouse left");
    }
};
