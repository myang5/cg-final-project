/*
Copyright 2014 Katherine Kjeer
	
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see http://www.gnu.org/licenses/.

Katherine Kjeer
THREE.TubeRadialGeometry
Extends THREE.TubeGeometry
Rather than taking a constant radius as a parameter,
takes an array of values for the radius, uses the array to construct
a THREE.SplineCurve3, and uses the y-values along the curve to find the varying radii.

Example:
//the path used to create the tube
var bezierCurve = new THREE.CubicBezierCurve3(new THREE.Vector3(0, 0, 0),
                                              new THREE.Vector3(12.5, 5, 0),
                                              new THREE.Vector3(34.5, 5, 0),
                                              new THREE.Vector3(50, 0, 0));
//quadratic function for the radius
var radii = [];
for (var i = 0; i < 4; i+= 0.25) {
  radii.push(i*i);
}

//geometry, material and mesh
var geom = new THREE.TubeRadialGeometry(bezierCurve, 64, radii, 64, false);
var mat = new THREE.MeshNormalMaterial({size: THREE.DoubleSide});
var mesh = new THREE.Mesh(geom, mat);
scene.add(mesh);

You can view the output of the above example at http://cs.wellesley.edu/~cs307/threejs/contrib/
*/

THREE.TubeRadialGeometry = function (path, segments, radius, radialSegments, closed) {
	THREE.Geometry.call(this);

	this.type = 'TubeGeometry';

	this.parameters = {
		path: path,
		segments: segments,
		radius: radius,
		radialSegments: radialSegments,
		closed: closed
	};

	segments = segments || 64;
	radius = radius || 1;
	radialSegments = radialSegments || 8;
	closed = closed || false;

	var grid = [];

	var scope = this,

		tangent,
		normal,
		binormal,

		numpoints = segments + 1,

		x, y, z,
		tx, ty, tz,
		u, v,

		cx, cy,
		pos, pos2 = new THREE.Vector3(),
		i, j,
		ip, jp,
		a, b, c, d,
		uva, uvb, uvc, uvd;

	var frames = new THREE.TubeGeometry.FrenetFrames( path, segments, closed ),
		tangents = frames.tangents,
		normals = frames.normals,
		binormals = frames.binormals;

	// proxy internals
	this.tangents = tangents;
	this.normals = normals;
	this.binormals = binormals;

	function vert( x, y, z ) {

		return scope.vertices.push( new THREE.Vector3( x, y, z ) ) - 1;

	}

	// consruct the grid

	//kkjeer: construct the SplineCurve3 from the array of radius values
	var radialPoints = [];
	for (var p in radius) {
		radialPoints.push(new THREE.Vector3(0, radius[p], 0));
	}
	var radialCurve = new THREE.SplineCurve3(radialPoints);

	for (i = 0; i < numpoints; i++) {

		grid[i] = [];

		u = i/(numpoints - 1);

		pos = path.getPoint(u);

		tangent = tangents[i];
		normal = normals[i];
		binormal = binormals[i];

		//kkjeer: get the point on the radialCurve at u and use its y-value for the radius at u
		var radiusValue = radialCurve.getPoint(u).y;

		for (j = 0; j < radialSegments; j++) {

			v = j/radialSegments * 2 * Math.PI;

			cx = -radiusValue * Math.cos( v ); // TODO: Hack: Negating it so it faces outside.
			cy = radiusValue * Math.sin( v );

			pos2.copy(pos);
			pos2.x += cx * normal.x + cy * binormal.x;
			pos2.y += cx * normal.y + cy * binormal.y;
			pos2.z += cx * normal.z + cy * binormal.z;

			grid[i][j] = vert(pos2.x, pos2.y, pos2.z);

		}
	}


	// construct the mesh

	for (i = 0; i < segments; i ++) {

		for (j = 0; j < radialSegments; j ++) {

			ip = (closed) ? (i + 1) % segments : i + 1;
			jp = (j + 1) % radialSegments;

			a = grid[ i ][ j ];		// *** NOT NECESSARILY PLANAR ! ***
			b = grid[ ip ][ j ];
			c = grid[ ip ][ jp ];
			d = grid[ i ][ jp ];

			uva = new THREE.Vector2(i/segments, j/radialSegments);
			uvb = new THREE.Vector2((i + 1)/segments, j/radialSegments);
			uvc = new THREE.Vector2((i + 1)/segments, (j + 1)/radialSegments);
			uvd = new THREE.Vector2(i/segments, (j + 1)/radialSegments);

			this.faces.push(new THREE.Face3(a, b, d));
			this.faceVertexUvs[0].push([uva, uvb, uvd]);

			this.faces.push(new THREE.Face3(b, c, d));
			this.faceVertexUvs[0].push([uvb.clone(), uvc, uvd.clone()]);

		}
	}

	this.computeFaceNormals();
	this.computeVertexNormals();

};

THREE.TubeRadialGeometry.prototype = Object.create(THREE.TubeGeometry.prototype);