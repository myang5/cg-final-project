/*  
syang5Submarine.js
Soo Bin Yang
Hwk6 CS 307
Fall 2018

Creates a submarine using lathes and splines, along with 
spheres and cylinders. The sub is approximately 
92 units long (including submarine body and propeller) and
is approximately 35 units wide at the widest point. 
Material of submarine uses Phong and Lambert materials. 
The origin sits at the center of the submarine.  

MIT License

Copyright (c) 2016 Soo Bin Yang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
*/

function syang5Submarine() {

  var subMat = new THREE.MeshLambertMaterial({ color: 0xffff00,
                                               side: THREE.BackSide,
                                               shadowSide: THREE.DoubleSide});

  var windowMat = new THREE.MeshPhongMaterial({ color: 0xB1D9F4,
                                                side: THREE.DoubleSide,
                                                specular: 0x000000,
                                                shininess: 50,
                                                shadowSide: THREE.DoubleSide});
                                                
  var decoMat = new THREE.MeshPhongMaterial({ color: 0xcccc00,
                                                side: THREE.DoubleSide,
                                                specular: 0x000000,
                                                shininess: 20,
                                                shadowSide: THREE.DoubleSide});
                                                
  var metalMat = new THREE.MeshPhongMaterial({ color: 0xb2b2b2,
                                                side: THREE.DoubleSide,
                                                specular: 0x000000,
                                                shininess: 50,
                                                shadowSide: THREE.DoubleSide});
  
  var submarine = new THREE.Object3D();
  var body = createBody();
  submarine.add(body);
  
  var subTower = createTower();
  subTower.position.set( 0, 17.5, 0 );
  submarine.add(subTower);
  
  var propeller = createPropeller();
  propeller.position.set( 50, 0, 0 );
  submarine.add(propeller);
  
  addRudder(submarine);
  
  function createBody() {
    var body = new THREE.Object3D();
    var bodyMain = createBodyMain();
    bodyMain.position.set( 50, 0, 0 );
    bodyMain.rotation.z = TW.degrees2radians(90);
    body.add(bodyMain);
    
    var bodyFront = createWindow(34/2);
    bodyFront.position.set( -30, 0, 0 );
    body.add(bodyFront);
    
    addBodyFrames(body);
    addWindows(body);
    
    return body;
  } 
  
  function createBodyMain() {
    var upper_cp = [ [34/2, 81],
                     [35/2, 76],
                     [35/2, 65],
                     [35/2, 54] ];

    var middle_cp = [ [35/2,  54],
                  [35/2,  45],
                  [33/2, 36],
                  [29/2, 27] ];
                          
    var lower_cp = [ [29/2, 27],
                 [25/2, 18],
                 [21/2,  9],
                 [0,  0.0] ];
    
    var bodyPts = Array.prototype.concat(upper_cp, middle_cp, lower_cp);
    
    // returns an array of Vector3 objects made from the input 2D points
    var bodyPoints = makePoints(bodyPts);
    
    // create a spline curve to use for the lathe geometry
    var splineObj = makeSplineObj(bodyPoints);
    
    var geom = new THREE.LatheGeometry(splineObj.geometry.vertices, 30);
    bodyObj = new THREE.Mesh(geom, subMat);
    return bodyObj;
  }
  
  function createWindow(radius) {
    var windowGeom = new THREE.SphereGeometry(radius, 30, 30);
    var windowMesh = new THREE.Mesh(windowGeom, windowMat);
    return windowMesh;
  }
  
  function addWindows(sub){
    var window1 = createWindow(15/2);
    window1.position.set( -20, 0, 15 );
    sub.add(window1);
    
    var window2 = createWindow(15/2);
    window2.position.set( 0, 0, 15 );
    sub.add(window2);
    
    var window3 = createWindow(15/2);
    window3.position.set( 20, 0, 12.5 );
    sub.add(window3);
    
    var window4 = createWindow(15/2);
    window4.position.set( -20, 0, -15 );
    sub.add(window4);
    
    var window5 = createWindow(15/2);
    window5.position.set( 0, 0, -15 );
    sub.add(window5);
    
    var window6 = createWindow(15/2);
    window6.position.set( 20, 0, -12.5 );
    sub.add(window6);
    
    return sub;
  }
  
  function createSubFrame(radius) {
    var frameGeom = new THREE.TorusGeometry(radius, 0.75, 3, 100);
    var frameMesh = new THREE.Mesh(frameGeom, decoMat);
    frameMesh.rotation.y = TW.degrees2radians(90);

    return frameMesh;
  }
  
  function addBodyFrames(sub){
    var frame1 = createSubFrame(34/2);
    frame1.position.set(-30.5, 0, 0);
    sub.add(frame1);
    
    var frame2 = createSubFrame(35/2);
    frame2.position.set(-10, 0, 0);
    sub.add(frame2);
    
    var frame3 = createSubFrame(34/2);
    frame3.position.set(10, 0, 0);
    sub.add(frame3);
    
    var frame4 = createSubFrame(26/2);
    frame4.position.set(30, 0, 0);
    sub.add(frame4);
    
    return sub;
  }
  
  function createPeriscope() {
    var scope = new THREE.Object3D();
    
    var tubeGeom = new THREE.CylinderGeometry( 1, 1, 10, 50 );
    var tubeMesh = new THREE.Mesh(tubeGeom, decoMat);
    tubeMesh.position.set( 0, 10, 0 );
    scope.add(tubeMesh)
    
    var jointGeom = new THREE.TorusGeometry(2, 1, 30, 100, Math.PI/2);
    var jointMesh = new THREE.Mesh(jointGeom, decoMat);
    jointMesh.position.set( -2, 15, 0 );
    scope.add(jointMesh)
    
    var scopeGeom = new THREE.SphereGeometry(1, 30, 30);
    var scopeMesh = new THREE.Mesh(scopeGeom, windowMat);
    scopeMesh.position.set( -2.25, 17, 0 );
    scope.add(scopeMesh)
    
    return scope;
  }
  
  function createTower() {
    var tower = new THREE.Object3D();
    
    var towerGeom = new THREE.CylinderGeometry( 7.5, 12, 10, 50 );
    var towerMesh = new THREE.Mesh(towerGeom, decoMat);
    tower.add(towerMesh);
    
    var periscope = createPeriscope();
    periscope.rotation.y = TW.degrees2radians(180);
    tower.add(periscope);
    
    return tower;
  }
  
  function createPropeller() {
    var propeller = new THREE.Object3D();
    
    var baseGeom = new THREE.CylinderGeometry( 1, 1, 10, 50 );
    var baseMesh = new THREE.Mesh(baseGeom, decoMat);
    baseMesh.rotation.x = TW.degrees2radians(90);
    baseMesh.rotation.z = TW.degrees2radians(90);
    propeller.add(baseMesh);
    
    var headGeom = new THREE.CylinderGeometry( 2, 2, 2, 50 );
    var headMesh = new THREE.Mesh(headGeom, metalMat);
    headMesh.rotation.z = TW.degrees2radians(90);
    headMesh.position.set( 4, 0, 0 );
    propeller.add(headMesh);
    
    var blade1 = createPropellerBlade();
    blade1.position.set( 3.5, -5, 6.5 );
    blade1.rotation.y = TW.degrees2radians(90);
    blade1.rotation.z = TW.degrees2radians(45);
    propeller.add(blade1);
    
    var blade2 = createPropellerBlade();
    blade2.position.set( 3.5, 5.5, 5);
    blade2.rotation.y = TW.degrees2radians(90);
    blade2.rotation.z = TW.degrees2radians(-45);
    propeller.add(blade2);
    
    var blade3 = createPropellerBlade();
    blade3.position.set( 3.5, 0, -8);
    blade3.rotation.y = TW.degrees2radians(90);
    blade3.rotation.z = TW.degrees2radians(180);
    propeller.add(blade3);
    
    return propeller;
  }

  function createPropellerBlade() {
    // create a basic shape
    var shape = new THREE.Shape();
    shape.moveTo( 8,0 );

    shape.splineThru([new THREE.Vector2(4, 10),
                      new THREE.Vector2(8, 15),
                      new THREE.Vector2(12, 10),
                      new THREE.Vector2(8, 0)])
    
    var extrudeSettings = {
    	amount: 1,
    	steps: 2,
    	depth: 1,
    	bevelEnabled: false,
    	bevelThickness: 1,
    	bevelSize: 0,
    	bevelSegments: 1
    };
    
    var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    var mesh = new THREE.Mesh( geometry, metalMat ) ;
    return mesh
    
  }
  
  function createRudder() {
    var shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    shape.lineTo( 2, 12 );
    shape.lineTo( 8, 14 );
    shape.lineTo( 8, 0 );
    shape.lineTo( 0, 0 );
    
    var extrudeSettings = {
    	amount: 1,
    	steps: 2,
    	depth: 1,
    	bevelEnabled: false,
    	bevelThickness: 1,
    	bevelSize: 0,
    	bevelSegments: 1
    };
    
    var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    var mesh = new THREE.Mesh( geometry, decoMat ) ;
    return mesh
  }
  
  function addRudder(sub) {
    var ruddertop = createRudder();
    ruddertop.position.set( 40, 5, 0 );
    ruddertop.rotation.z = TW.degrees2radians(-45);
    sub.add(ruddertop);
    
    var rudderbot = createRudder();
    rudderbot.position.set( 47, -1, 0 );
    rudderbot.rotation.z = TW.degrees2radians(225);
    sub.add(rudderbot);
    
    return sub;
  }

  return submarine;
  
  //Helper Functions
  
  function makePoints (pts) {
       var points = [];
       for(var i = 0; i < pts.length; i++) {
           points.push(new THREE.Vector3(pts[i][0], pts[i][1], 0));
       }
       return points;
  }
  
  function makeSplineObj (points) {
       var mat = new THREE.MeshBasicMaterial( {color: 0xff0000} );
       // var curve = new THREE.SplineCurve3(points);
       var curve1 = new THREE.CubicBezierCurve3(points[0],points[1],points[2],points[3]);
       var curve2 = new THREE.CubicBezierCurve3(points[4],points[5],points[6],points[7]);
       var curve3 = new THREE.CubicBezierCurve3(points[8],points[9],points[10],points[11]);
       var geom = new THREE.Geometry();
       // geom.vertices = curve.getPoints(50);
       geom.vertices = Array.prototype.concat( curve1.getPoints(10),
                                               curve2.getPoints(10),
                                               curve3.getPoints(10) );
       splineObj = new THREE.Line( geom, new THREE.LineBasicMaterial( { linewidth: 3, color: 0x0000ff }) );
      splineObj.translateX(0.1);
      return splineObj;
  }
  
}

