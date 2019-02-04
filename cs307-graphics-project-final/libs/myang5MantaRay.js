/* Midori Yang
11/18/2018
CS 307

MIT License

Copyright (c) 2018 Midori Yang

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

var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene(); 
TW.mainInit(renderer,scene);

/* 
This code creates a manta ray of fixed size and proportions:

Main body: 11 units long, 6 units wide at mouth
Lobes: ~2.5 units long
Wings: 11 units long each
Tail: 10 units long

Total length: 23.5 units
Total width: 28 units

The whole object can be resized as necessary.
The color of the top half of the body and bottom half are customizable.
The origin of the manta ray is at the front-center i.e. in the middle of the lobes,
and it is created parallel to the floor (XZ plane).
The code requires TubeRadialGeometry to make the lobes.

DISCLAIMER: This manta ray was modeled while referencing photos of giant manta rays and
manta ray plushies for simplicity. It is not necessarily anatomically accurate.
*/

// FOR REFERENCE: BEZIER CURVE TOOL https://www.desmos.com/calculator/cahqdxeshd

// ====================================================================
/* CREATE MANTA RAY */

   function showCP(cpList) {
    for( var j=0; j < cpList.length; j++ ) {
        var subList = cpList[j];                      
        for( var i=0; i < subList.length; i++ ) {
            scene.add(TW.createPoint(subList[i]));
        }
    }
};

// NOTE: origin of the manta ray is at the front-center i.e. in the middle of the lobes
// and it is created parallel to the floor (XZ plane)

function myang5MantaRay(topColor,bottomColor){ // function takes in params object
    
    this.topColor  =  topColor, // color of top surface
    this.bottomColor =  bottomColor; // color of bottom surface (underside)
    this.bodyLength = 11; // length of main body
    this.bodyWidth = 10; // width of main body at widest point (manta's mouth)
    this.tailLength = 10;
    this.tailRadius =  0.3; //tail is ConeGeometry
    this.speed;
    
    var manta = new THREE.Object3D();
    var topMaterial = new THREE.MeshLambertMaterial({color: topColor, side: THREE.DoubleSide});
    var bottomMaterial = new THREE.MeshLambertMaterial({color: bottomColor, side: THREE.DoubleSide})
    
    // making the body
    
    var body = new THREE.Object3D();
    
    var bodyTopCps = [ //results in body length of 11 units and width of 6
    [ [0.5,0,-3],   [3.2,0,-3.2],    [7.5,0,-2.5],  [10,0,-1] ],
    [ [-0.17,0,-2], [-0.17,3,-3.2],  [7,2,-2.5],    [11.34,0,-0.2] ],
    [ [-0.17,0,2],  [-0.17,3,3.2],   [7,2,2.5],     [11.34,0,0.2] ],
    [ [0.5,0,3],    [3.2,0,3.2],     [7.5,0,2.5],   [10,0,1] ]
    ];    
    
    var bodyTop = new THREE.Mesh(new THREE.BezierSurfaceGeometry(bodyTopCps,20,20),topMaterial);
    body.add(bodyTop);
    
    var bodyBottomCps = [ 
    [ [0.5,0,-3],   [3.2,0,-3.2],     [7.5,0,-2.5],  [10,0,-1] ],
    [ [-0.17,0,-2], [-0.17,-3,-3.2],  [7,-2,-2.5],   [11.34,0,-0.2] ],
    [ [-0.17,0,2],  [-0.17,-3,3.2],   [7,-2,2.5],    [11.34,0,0.2] ],
    [ [0.5,0,3],    [3.2,0,3.2],      [7.5,0,2.5],   [10,0,1] ]
    ];    
    
    var bodyBottom = new THREE.Mesh(new THREE.BezierSurfaceGeometry(bodyBottomCps,20,20),bottomMaterial);
    body.add(bodyBottom);
    
   
    // body.scale.set(params.bodyLength/11,1,params.bodyWidth/6); !!! implement after fixing wings
    manta.add(body);
    
    //showCP(bodyTopCps); 
    //showCP(bodyBottomCps); 
    
    // making the fins
    
    var fin = new THREE.Object3D(); 
    // !!! still need to make fins resize where it meets body
    // !!! still need to make fins resize to user length
    
     var finTopCps = [ 
    [ [6,0,10.5],  [6.5,0,10.8],  [7,0,11.1],     [7,0,10.5] ],
    [ [2,0,8],     [2,0.5,8],     [6.2,0.5,6.3],  [6.2,0,6.3] ],
    [ [1,0,4.4],   [1,0.5,4.4],   [8.3,0.5,3.4],  [8.3,0,3.4] ],
    [ [0.5,0.2,2], [4,0.2,2.3],   [7,0.2,2],      [10.6,0.2,0] ] 
    ]; 
    var finTop = new THREE.Mesh(new THREE.BezierSurfaceGeometry(finTopCps,20,20),topMaterial);
    fin.add(finTop);
    
     var finBottomCps = [ 
    [ [6,0,10.5],   [6.5,0,10.8],    [7,0,11.1],       [7,0,10.5] ],
    [ [2,0,8],      [2,-0.5,8],      [6.2,-0.5,6.3],   [6.2,0,6.3] ],
    [ [1,0,4.4],    [1,-0.5,4.4],    [8.3,-0.5,3.4],   [8.3,0,3.4] ],
    [ [0.5,-0.2,2], [4,-0.2,2.3],    [7,-0.2,2],       [10.6,-0.2,0] ] 
    ]; 
    var finBottom = new THREE.Mesh(new THREE.BezierSurfaceGeometry(finBottomCps,20,20),bottomMaterial);
    fin.add(finBottom);
    manta.add(fin);
    
    //showCP(finTopCps); 
    //showCP(finBottomCps); 
    
    var fin2 = fin.clone();
    fin2.rotation.x += Math.PI;
    fin2.children[1].material = topMaterial;
    fin2.children[0].material = bottomMaterial;
    manta.add(fin2);
    
    //making the tail
    
    var insideBody = bodyLength*0.1; // tail goes partially into body to hide end of cone
    
    var tailCont = new THREE.Object3D();
    var tail = new THREE.Mesh(new THREE.ConeGeometry(tailRadius,tailLength+insideBody,32),topMaterial);
    tailCont.add(tail);
    tailCont.rotation.z += -Math.PI/2;
    tailCont.position.set(bodyLength+tailLength/2-insideBody/2,0,0);
    manta.add(tailCont);
    
    // making the lobes
    
    var lobe = new THREE.Object3D();
    // !!! still need to make lobes change position with body width
    // !!! stil need to make lobes change with user length (and width?)
    
    var bezierCurve = new THREE.CubicBezierCurve3(
       new THREE.Vector3(0.8,0,-2.5), // first point from bodyTop
       new THREE.Vector3(-0.2,0,-3),
       new THREE.Vector3(-1.2,0,-3.25),
       new THREE.Vector3(-2.2,0,-3)
    );
    var radii = [0.5,0.7];
    var lobeGeom = new THREE.TubeRadialGeometry(bezierCurve, 32, radii, 32, false);
    var lobeMesh = new THREE.Mesh(lobeGeom,topMaterial);
    lobe.add(lobeMesh);
    manta.add(lobe);
    
    var lobe2 = lobe.clone();
    lobe2.rotation.x = -Math.PI;
    manta.add(lobe2);
    
    return manta;
}


// function that creates guides of for debugging purposes
function drawGuides(guidesXmin,guidesXmax,guidesZmin, guidesZmax, height){
    var geometryX = new THREE.Geometry();
    geometryX.vertices.push(new THREE.Vector3(0,height,0));
    geometryX.vertices.push(new THREE.Vector3(0,0,0));
    
    var geometryZ = new THREE.Geometry();
    geometryZ.vertices.push(new THREE.Vector3(0,height,0));
    geometryZ.vertices.push(new THREE.Vector3(0,0,0));
    
    var lineX = new THREE.Line(geometryX, 
                              new THREE.LineBasicMaterial( {color: 0x0000ff }));
    var lineZ = new THREE.Line(geometryZ, 
                              new THREE.LineBasicMaterial( {color: 0x0000ff }));
    
    for(var i = guidesXmin;i<=guidesXmax; i++){
        var guide = lineX.clone();
        guide.position.x += i
        scene.add(guide)
    }
    for(var i = guidesZmin;i<=guidesZmax; i++){
        var guide = lineZ.clone();
        guide.position.z += i
        scene.add(guide)
    }
}

