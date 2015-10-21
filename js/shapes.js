// An Entity is anything that is drawn in the world
//  whether it be an item chest, a shape, a wall, or a gnat
//  it is an Entity
var Entity = function(parent){
    this.parent = parent;
    this.position = false;
    this.direction = new Vector2d([1, 0]); // Must be unit vector.  Defines Orientation
    this._active = false; // Checked later.  If dead,
};

Entity.constructor = Entity;
Entity.prototype = {
    update: function(dTime){
        // Function called by the updater.
    },
    positionSet: function(vec2d){
        this.position = vec2d;
    },
    positionGetAbsolute: function(){
        if(this.parent){
            return
        }
        return this.position;
    },
    positionGetRelative: function(){
        return this.position;
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


var EntityShape = function(){

};

var EntityItem = function(){

};

var EntityEquipment = function(){

}
