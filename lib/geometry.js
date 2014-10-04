(function(){
    'use strict';

    var g = {};

    var Point = g.Point = (function(){
        var Point = function(x,y){
            if(arguments.length===1){
                this.x = arguments[0].x;
                this.y = arguments[0].y;
            } else if (arguments.length===2) {
                this.x = arguments[0];
                this.y = arguments[1];
            }
        }

        Point.prototype.distanceToPoint= function distanceToPoint(target){
            return Math.pow(this.squareDistanceToPoint(), 0.5);
        }

        Point.prototype.squareDistanceToPoint = function squareDistanceToPoint(target){
            return Math.pow(this.x-target.x,2)+Math.pow(this.y-target.y,2);
        }

        Point.prototype.squareDistanceToLine = function squareDistanceToLine(segment){
            return this.squareDistanceToPoint(
                new Point(Math.abs(segment.p1.x-segment.p2.x),
                          Math.abs(segment.p1.y-segment.p2.y))
            );
        }

        Point.prototype.isEqual = function isEqual(point){
            return this.x === point.x && this.y === point.y;
        };

        Point.prototype.toString = function toString(){
            return '['+this.x+':'+this.y+']';
        }

        Point.prototype.clone = function(){
            return new Point(this.x, this.y);
        }

        Point.prototype.extendTo = function(angle, distance){
            return new Point(this.x + Math.cos(+angle) * distance,
                             this.y + Math.sin(+angle) * distance);
        }

        Point.prototype.angleToPoint = function(other){
            return new Angle(Math.atan2(other.y - this.y, other.x - this.x));
        }

        return Point;
    })();

    var EndPoint = g.EndPoint = (function(){
        var EndPoint = function(point, segment, angle){
            if(point){
                this.x = point.x;
                this.y = point.y;
            }
            this.segment = segment;
            this.angle = angle||new Angle(0); 
        }

        EndPoint.prototype = new Point();
        EndPoint.prototype.constructor = EndPoint; 

        EndPoint.prototype.toString = function(){
            return '< EP  '+ Point.prototype.toString.apply(this) + ' ' + this.angle+ '* >';
        };

        return EndPoint;
    })();

    var Line = g.Line = (function(){
        var Line = function Line(p1,p2){
            this.p1 = p1;
            this.p2 = p2;
        };

        Line.prototype.intersectsLine = function(line){

            var s1_x, s1_y, s2_x, s2_y;
            s1_x = this.p2.x - this.p1.x;
            s1_y = this.p2.y - this.p1.y;
            s2_x = line.p2.x - line.p1.x;
            s2_y = line.p2.y - line.p1.y;

            var s, t;
            s = (-s1_y * (this.p1.x - line.p1.x) + s1_x * (this.p1.y - line.p1.y)) / (-s2_x * s1_y + s1_x * s2_y);
            t = ( s2_x * (this.p1.y - line.p1.y) - s2_y * (this.p1.x - line.p1.x)) / (-s2_x * s1_y + s1_x * s2_y);

            if (s >= 0 && s <= 1 && t >= 0 && t <= 1){
                // Collision detected
                return true;
            }

            return false; // No collision
        }

        Line.prototype.pointOfIntersection = function pointOfIntersection(other){
            // From http://paulbourke.net/geometry/lineline2d/
            var s = ((other.p2.x - other.p1.x) * (this.p1.y - other.p1.y) - (other.p2.y - other.p1.y) * (this.p1.x - other.p1.x)) / ((other.p2.y - other.p1.y) * (this.p2.x - this.p1.x) - (other.p2.x - other.p1.x) * (this.p2.y - this.p1.y));
            return new Point(this.p1.x + s * (this.p2.x - this.p1.x),
                             this.p1.y + s * (this.p2.y - this.p1.y));
        };

        Line.prototype.dotProduct = function(other){
            return Math.abs(this.p1.x - this.p2.x) * Math.abs(other.p1.x - other.p2.x) +
                Math.abs(this.p1.y - this.p2.y) * Math.abs(other.p1.y - other.p2.y);
        };

        return Line;
    })();

    var Segment = g.Segment = (function(){
        var Segment = function(){
            Line.apply(this, arguments);
        };
        Segment.prototype = Object.create(Line.prototype);
        Segment.prototype.constructor = Segment;

        Segment.prototype.minAnglePoint = function minAnglePoint() { 
            return this.p1.angle.compareTo(this.p2.angle)>0?this.p1:this.p2;
        };

        Segment.prototype.maxAnglePoint = function maxAnglePoint() {
            return this.p1.angle.compareTo(this.p2.angle)>0?this.p2:this.p1;
        };

        Segment.prototype.toString = function toString(){ 
            return '[ SEG:  '+this.p1.toString() + ','+ this.p2.toString() + ']';
        };

        Segment.prototype.containsAngle = function containsAngle(angle){ 
            return angle.isInRange(this.startPoint.angle, this.endPoint.angle);   
        }; 
        return Segment;
    })();

    var Angle = g.Angle = (function(){
        function Angle(a){
            this.a = a;
        }

        Angle.prototype.isInRange = function isInRange(a, b){ 
            //console.log('checking if angle "', angle, '" crosses ' ,this.toString());
            a=+a, b=+b;
            if (this.a===a || this.a===b){
                //console.log('angle matches on of the EPs');
                return true;
            }

            if(a===b){
                //console.log('line is a luch\' blyat\'');
                return this.a === a;
            } 

            var result = false;
            var crossesZero = a>b;

            if(crossesZero)
                result = (this.a>a) || (this.a<b);
            else
                result = (this.a>a) && (this.a<b);

            //console.log('and the result is "', result,'"');
            return result;
        }

        Angle.prototype.compareTo = function(other){
            var dAngle = this.a - other;

            if (dAngle===0)
                return 0;

            if (dAngle <= -Math.PI) { dAngle += 2*Math.PI; }
            if (dAngle > Math.PI) { dAngle -= 2*Math.PI; }

            if(dAngle > 0.0){
                //this angle is gr8r
                return -1;
            } else {
                //other is gr8r
                return 1;
            }
        }

        Angle.prototype.valueOf = function valueOf(){
            return this.a;
        }

        Angle.prototype.isEqual = function(other){
            return this.a === (+other);
        }

        return Angle;
    })();

    var Field = g.Field = (function(){
        function Field(point1, point2){
            this.point1 = point1;
            this.point2 = point2;
        }

        Field.prototype.contains = function(point){
            return (this.point1.x <= point.x && point.x <= this.point2.x &&
                    this.point1.y <= point.y && point.y <= this.point2.y);
        };

        return Field; 
    })();

    var Circle = g.Circle= (function(){
        function Circle(point, r){
            this.center = point;
            this.radius = r;
        }

        Circle.prototype.intersectsLine = function (line){
            //E is the starting point of the ray,
            //L is the end point of the ray,
            //C is the center of sphere you're testing against
            //r is the radius of that sphere
            //Compute:
            //d = L - E ( Direction vector of ray, from start to end )
            //f = E - C ( Vector from center sphere to ray start )
            //
            //Then the intersection is found by..
            //Plugging:
            //P = E + t * d
            //This is a parametric equation:
            //Px = Ex + tdx
            //Py = Ey + tdy
            //into
            //(x - h)^2 + (y - k)^2 = r^2
            //(h,k) = center of circle.

            var d = line,
                f = new Line(this.center, line.p1),
                r = this.radius, 
                a = d.dotProduct( d ),
                b = 2*f.dotProduct( d ),
                c = f.dotProduct( f ) - r*r ;

            var discriminant = b*b-4*a*c;
            if( discriminant < 0 ) {
                // no intersection 
                return false;
            } else {
                // ray didn't totally miss sphere,
                // so there is a solution to
                // the equation.

                discriminant = Math.sqrt( discriminant );

                // either solution may be on or off the ray so need to test both
                // t1 is always the smaller value, because BOTH discriminant and
                // a are nonnegative.
                var t1 = (-b - discriminant)/(2*a);
                var t2 = (-b + discriminant)/(2*a);

                // 3x HIT cases:
                //          -o->             --|-->  |            |  --|->
                // Impale(t1 hit,t2 hit), Poke(t1 hit,t2>1), ExitWound(t1<0, t2 hit), 

                // 3x MISS cases:
                //       ->  o                     o ->              | -> |
                // FallShort (t1>1,t2>1), Past (t1<0,t2<0), CompletelyInside(t1<0, t2>1)

                if( t1 >= 0 && t1 <= 1 ) {
                    // t1 is the intersection, and it's closer than t2
                    // (since t1 uses -b - discriminant)
                    // Impale, Poke
                    return true ;
                }

                // here t1 didn't intersect so we are either started
                // inside the sphere or completely past it
                if( t2 >= 0 && t2 <= 1 ) {
                    // ExitWound
                    return true ;
                }

                // no intn: FallShort, Past, CompletelyInside
                return false ;
            }
        }

        return Circle;
    })();

    window.geometry = g;
})();
