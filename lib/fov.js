(function(window, document, undefined){
    'use strict';

    var PRECISION = 0.0000001;

    var Point = geometry.Point,
        EndPoint = geometry.EndPoint,
        Segment = geometry.Segment,
        Line = geometry.Line,
        Angle = geometry.Angle;

    var FOV = (function(){ 
        function FOV (){
            this.segments=[];
            this.endpoints=[];
            this.center = new Point();
        };

        function getSegmentsIntersectingAngle(angle, segments){
            return segments.filter(function(segment){
                return segment.containsAngle(angle);
            }); 
        }

        function getVisiblePoints(centerPoint, targetEP, segments){
            var resultPoints = [];

            segments.forEach(function(s){ 
                if (s.startPoint.angle.isEqual(targetEP.angle)){
                    s._xisep = true;
                    s._xpoint = s.startPoint;
                    s._status = 0;
                } else if (s.endPoint.angle.isEqual(targetEP.angle)){
                    s._xisep = true;
                    s._xpoint = s.endPoint;
                    s._status = 2;
                } else {
                    s._xisep = false;
                    s._status = 1;
                    s._xpoint = new EndPoint(
                        new Line(centerPoint, targetEP).pointOfIntersection(s), s, targetEP.angle
                    );
                }

                s._tdist = centerPoint.squareDistanceToPoint(s._xpoint); 
            });

            segments.sort(function(a, b){ return a._tdist - b._tdist; });
            var minDistance = segments[0]._tdist,
                startingStatus = segments[0]._status;

            for(var i=0, j=segments.length; i<j; i++){ 
                resultPoints.push(segments[i]._xpoint);
                if(startingStatus!= segments[i]._status || segments[i]._tdist>minDistance && !segments[i]._xisep)
                    break;
            }

            return resultPoints;
        }

        FOV.prototype.calc = function calc(minAngle, maxAngle){
            minAngle = minAngle || 0.0;
            maxAngle = maxAngle || 0.0;

            if(typeof minAngle === 'number')
                minAngle= new Angle(minAngle);

            if(typeof maxAngle === 'number')
                maxAngle= new Angle(maxAngle);

            var self = this,
                center = this.center,
                angles = [],
                output = [],
                currentSegment,
                iss,
                vps,
                restrictedView = false,
                endpoints = this.endpoints,
                startPoint,
                endPoint,
                xzero;
            
            if(endpoints.length===0){
                throw 'no walls loaded';
            }
            var _angleDiff = Math.abs(minAngle-maxAngle);
            if(//the angle view is 360deg(2PI) or less
               !minAngle.isEqual(maxAngle)//minA != maxA
                   && (!((Math.abs(_angleDiff - 2*Math.PI) > PRECISION)         //minA ~= maxA -- due to JS bad precision
                         ^                                                      //OR
                         (Math.abs(_angleDiff) > PRECISION))                    //angle is less then PI, ergo angle is not 2PI(360deg)
                      )
              ){
                //console.log('restricted view');
                //console.log('restricted view', minAngle, maxAngle);
                //getting start visible point for restricted view
                restrictedView = true;
                iss = getSegmentsIntersectingAngle(minAngle, self.segments);
                vps = getVisiblePoints(center, center.extendTo(minAngle, 10), iss);
                startPoint = vps[0];

                iss = getSegmentsIntersectingAngle(maxAngle, self.segments);
                vps = getVisiblePoints(center, center.extendTo(maxAngle, 10), iss);
                endPoint = vps[0];

                xzero = startPoint.angle > endPoint.angle;

                endpoints = endpoints.filter(function(ep){
                    return ep.angle.isInRange(minAngle, maxAngle);
                });
            }

            /*
            endpoints.sort(function(a,b){ 
                    a.angle.compareTo(b.angle);
            });
            */
            if(restrictedView && xzero){
                endpoints.sort(function(a,b){ 
                    //TODO: check what happens when one is equal to 0
                    if(a.angle*b.angle>=0)
                        return a.angle - b.angle;
                    else
                        return a.angle>0?-1:1;
                });
            } else {
                endpoints.sort(function(a,b){ return a.angle - b.angle; });
            }

            endpoints.forEach(function(ep){
                //push only if last angle was different
                if(!(!angles.length || angles.length && !angles[angles.length-1].isEqual(ep.angle))){
                    return;
                }

                //console.log('------------------------');
                //console.log('calculating vps for ', ep.toString());

                angles.push(ep.angle);
                iss = getSegmentsIntersectingAngle(ep.angle, self.segments);
                vps = getVisiblePoints(center, ep, iss);

                if(vps[0].segment.startPoint.angle.isEqual(ep.angle))
                    output = output.concat(vps.reverse()); 
                else if(vps[0].segment.endPoint.angle.isEqual(ep.angle))
                    output = output.concat(vps);
                else
                    output.push(vps[0]);

            });

            if(restrictedView){
                output.push(endPoint);
                output.push(center);
                output.push(startPoint); 
            }
            
            return output;
        };

        // Set the light location. Segment and EndPoint data can't be
        // processed until the light location is known.
        FOV.prototype.setCenter =  function setCenter(point) {
            var center = this.center = new Point(point.x, point.y);
            this.segments.forEach(function(segment){

                // NOTE: future optimization: we could record the quadrant
                // and the y/x or x/y ratio, and sort by (quadrant,
                // ratio), instead of calling atan2. See
                // <https://github.com/mikolalysenko/compare-slope> for a
                // library that does this.
                segment.p1.angle = center.angleToPoint(segment.p1);
                segment.p2.angle = center.angleToPoint(segment.p2);

                segment.startPoint = segment.minAnglePoint();
                segment.endPoint = segment.maxAnglePoint();
            });
        };

        FOV.prototype.addSegment = function(point1, point2) { 
            if(arguments.length === 4){
                point1 = new Point(arguments[0], arguments[1]);
                point2 = new Point(arguments[2], arguments[3]);
            }

            var ep1 = new EndPoint(point1),
            ep2 = new EndPoint(point2),
            segment = new Segment(ep1, ep2);

            ep1.segment = ep2.segment = segment;

            this.segments.push(segment);
            this.endpoints.push(ep1);
            this.endpoints.push(ep2);
        };

        FOV.prototype.loadMap = function loadMap(size, walls) {
            var self=this;
            this.segments = [];
            this.endpoints=[];
            this.output = null;
            this.open = [];

            //load edge of the map
            this.addSegment(0, 0, 0, size);
            this.addSegment(0, size, size, size);
            this.addSegment(size, size, size, 0);
            this.addSegment(size,0,0,0);

            //load walls
            walls.forEach(function(wall){
                self.addSegment(wall.p1.x, wall.p1.y, wall.p2.x, wall.p2.y);
            });
        }

        return FOV;
    })();

    window.FOV=FOV;

})(window, document);
