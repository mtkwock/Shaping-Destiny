var Vector = function(components) {
    this._val = components;
    this._dim = components.length;
};

Vector.prototype = {
    _check: function(vec) {
        if (this._val.length !== vec._val.length) {
            throw "Vector dimensionalities do not match";
        }
    },
    _wrap: function(vals) {
        return new Vector(vals);
    },
    get: function() {
        return this._val.slice();
    },
    scale: function(scale) {
        return this._wrap(
            this._val.map(function(value) {
                return value * scale;
            })
        );
    },
    scaleTo: function(length) {
        var scale = length / this.magnitude();
        return this._wrap(
            this._val.map(function(value) {
                return value * scale;
            })
        );
    },
    magnitude: function() {
        return Math.sqrt(
            this._val.reduce(function(a, val) {
                return a + val * val;
            }, 0)
        );
    },
    add: function(vec) {
        this._check(vec);
        return this._wrap(
            this._val.map(function(val, idx) {
                return val + vec._val[idx];
            })
        );
    },
    sub: function(vec) {
        this._check(vec);
        return this._wrap(
            this._val.map(function(val, idx) {
                return val - vec._val[idx];
            })
        );
    },
    equals: function(vec) {
        this._check(vec);
        return this._val.reduce(function(a, val, idx) {
            return a && (val === vec._val[idx]);
        }, true);
    },
    dot: function(vec) {
        this._check(vec);
        return this._val.reduce(function(a, val, idx) {
            return a + val * vec._val[idx];
        }, 0);
    },
    unit: function() {
        var magnitude = this.magnitude();
        return this._wrap(
            this._val.map(function(val) {
                return val / magnitude;
            })
        );
    },
    angleBetween: function(vec) {
        this._check(vec);
        var normDot = this.dot(vec) / (this.magnitude() * vec.magnitude());
        if(normDot >= 1){
            return 0;
        }
        if(normDot <= -1){
            return Math.PI;
        }
        return Math.acos(normDot);
    },
};

var Vector2d = function(x, y) {
    Vector.call(this, [x, y]);
    this.x = x;
    this.y = y;
};

Vector2d.prototype = Object.create(Vector.prototype);
Vector2d.constructor = Vector2d;

Vector2d.prototype._wrap = function(vals) {
    if (vals.length !== 2) {
        throw "Expected 2d Array";
    }
    return new Vector2d(vals[0], vals[1]);
};
Vector2d.prototype.rotate = function(theta) {
    return new Vector2d(
        this._val[0] * Math.cos(theta) - this._val[1] * Math.sin(theta),
        this._val[0] * Math.sin(theta) + this._val[1] * Math.cos(theta)
    );
};
Vector2d.prototype.rotateTo = function(theta) {
    return new Vector2d(
        this.magnitude() * Math.cos(theta),
        this.magnitude() * Math.sin(theta)
    );
};
Vector2d.prototype.angle = function() {
    return Math.atan2(this._val[0], this._val[1]);
};
Vector2d.prototype.cross = function(vec2d) {
    this._check(vec2d);
    return this._val[0] * vec2d._val[1] - this._val[1] * vec2d._val[0];
};

var Vector3d = function(x, y, z) {
    Vector.call(this, [x || 0, y || 0, z || 0]);
    this.x = x;
    this.y = y;
    this.z = z;
};

Vector3d.prototype = Object.create(Vector.prototype);
Vector3d.constructor = Vector3d;
Vector3d.prototype._wrap = function(vals) {
    if (vals.length !== 3) {
        throw "Expected 3d array";
    }
    return new Vector3d(vals[0], vals[1], vals[2]);
};
Vector3d.prototype.cross = function(vec3d) {
    this._check(vec3d);
    return new Vector3d(
        this._val[1] * vec3d._val[2] - this._val[2] * vec3d._val[1],
        this._val[2] * vec3d._val[0] - this._val[0] * vec3d._val[2],
        this._val[0] * vec3d._val[1] - this._val[1] * vec3d._val[0]
    );
};
Vector3d.prototype.perpendicular = function(vec3d){
    this._check(vec3d);
    return this.cross(vec3d).unit();
};

var Segment = function(p0, p1){
    p0 = p0 instanceof Array ? new Vector(p0) : p0;
    p1 = p1 instanceof Array ? new Vector(p1) : p1;
    p0._check(p1);
    this.points = [p0, p1];
    this.dir = p1.sub(p0);
    this._dim = p0._dim;
};

Segment.constructor = Segment;
Segment.prototype = {
    _wrap: function(p0, p1){
        return new Segment(p0, p1);
    },
    length: function(){
        return this.dir.magnitude();
    },
    shortestSegment: function(segment){
        // Algorithm from: http://geomalgorithms.com/a07-_distance.html
        // Returns the shortest segment connecting this segment and another
        var u = this.dir;
        var v = segment.dir;

        var a = u.dot(u);
        var b = u.dot(v);
        var c = v.dot(v);

        var den = a * c - b * b;

        // Handle parallel case (Colinear)
        if(den <= 0){
            var cases = [
                this._wrap(this.points[0], segment.points[0]),
                this._wrap(this.points[0], segment.points[1]),
                this._wrap(this.points[1], segment.points[0]),
                this._wrap(this.points[1], segment.points[1])
            ]

            // If these two cases are on different sides of the point
            // That is, if the dot products have different signs because
            //   one angle is acute and the other obtuse, then the closest
            //   segment is a projection of the point onto the other segment
            if(u.dot(cases[0].dir) * u.dot(cases[1].dir) <= 0){
                // Point Projection onto N-Dimensional Line http://gamedev.stackexchange.com/questions/72528/how-can-i-project-a-3d-point-onto-a-3d-line
                var p0 = this.points[0];
                var p1 = segment.points[0].add(
                    segment.dir.scale(
                        p0.sub(segment.points[0]).dot(segment.dir) /
                        segment.dir.dot(segment.dir)
                    )
                );

                return this._wrap(p0, p1);

                /* Cleaner, but more memory
                var A = segment.points[0];
                var AP = p0.sub(segment.points[0]);
                var AB = segment.dir;

                var p1 = A.add(AB.scale(AP.dot(AB)/AB.dot(AB)));
                */
            }

            if(u.dot(cases[2].dir) * u.dot(cases[3].dir) <= 0){
                var p0 = this.points[1];
                var p1 = segment.points[0].add(
                    segment.dir.scale(
                        p0.sub(segment.points[0]).dot(segment.dir) /
                        segment.dir.dot(segment.dir)
                    )
                );

                return this._wrap(p0, p1);
            }

            return cases.reduce(function(a, segment){
                return a.dir.magnitude() < segment.dir.magnitude() ? a : segment;
            });
        }

        var w0 = this.points[0].sub(segment.points[0]);
        var d = u.dot(w0);
        var e = v.dot(w0);

        var mulA = (b * e - c * d)/den;
        var mulB = (a * e - b * d)/den;
        var p0, p1;

        if(mulA <= 0){
            p0 = this.points[0];
        }
        else if(mulA >= 1){
            p0 = this.points[1];
        }
        else {
            p0 = this.points[0].add(u.scale(mulA));
        }
        if(mulB <= 0){
            p1 = segment.points[0];
        }
        else if(mulB >= 1){
            p1 = segment.points[1];
        }
        else {
            p1 = segment.points[0].add(v.scale(mulB));
        }

        return this._wrap(p0, p1);
    }
};

var vectorTests = function() {
    var a = new Vector([1, 2]);
    var a2 = new Vector([2, 4]);
    var b = new Vector([2, 3]);
    var c = new Vector([3, 5]);
    var d = new Vector([-1, -1]);
    var e = new Vector2d(3, 4);
    var f = new Vector([1, 1, 1, 1]);

    var okay = true;

    var assert = function(truth, expected) {
        if (!truth) {
            okay = false;
            console.error("FAILED: " + expected || "FAILED: Failed Assertion");
        }
        else{
            console.log("PASSED: " + expected || "PASSED: Anonymous test");
        }
    };

    var approxEqual = function(a, b, threshold) {
        threshold = threshold || 0.00001;
        return (a - b) < threshold && (b - a) < threshold;
    }

    assert(a.add(b).equals(c), "a + b = c");
    assert(a.add(a).equals(a2), "a + a = a2")
    assert(a.sub(b).equals(d), "a - b = d");
    assert(a.dot(b) === 8, "a dot b = 8");
    assert(e.magnitude() === 5, "mag(e) = 5");
    assert(f.magnitude() === 2, "mag(f) = 2");
    assert(a.scale(2).equals(a2), "a * 2 = a2");
    assert(e.scale(2).angle() === e.angle(), "arg(e) = arg(2e)")
    assert(e.unit() instanceof Vector2d, "e.unit() should be Vector2d");

    var a3 = new Vector3d(1, 0, 0);
    var b3 = new Vector3d(0, 1, 0);
    var c3 = new Vector3d(0, 0, 1);
    var d3 = new Vector([0, 0, 2]);
    assert(a3.dot(b3) === 0, "a3 and b3 are perpendicular");
    assert(a3.cross(b3).equals(c3), "a3 x b3 = c3");
    assert(b3.cross(a3).equals(c3.scale(-1)), "b3 x a3 = -c3");
    assert(a3.cross(b3).scale(2).equals(d3), "a3 x b3 * 2 = d3");

    assert(approxEqual(a3.angleBetween(b3), Math.PI/2), "Angle(a3, b3) ~~ pi/2");

    var randVec = new Vector([
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100
    ]);

    assert(approxEqual(randVec.angleBetween(randVec.scale(-1)), Math.PI), "Angle(v, -v) = pi");

    var p0 = new Vector3d(0, 0, 0);
    var p1 = new Vector3d(3, 3, 3);
    var p2 = new Vector3d(2, 2, 2);
    var p3 = new Vector3d(5, 5, 5);

    var s0 = new Segment(p0, p1);
    var s1 = new Segment(p2, p3);

    var segCheck0 = s0.shortestSegment(s1);
    assert(segCheck0.dir.magnitude() === 0, "Segments are intersecting");
    assert(segCheck0.points[0].equals(p1) || segCheck0.points[0].equals(p2),
        "Segment start on overlap should prefer end");

    var s2 = new Segment(p0, p2);
    var s3 = new Segment(p1, p3);

    var segCheck1 = s2.shortestSegment(s3);
    assert(segCheck1.dir.magnitude() === Math.sqrt(3), "Segment should have length sqrt(3)");

    if(okay){
        console.log("All is good");
    }
    return okay;
};
