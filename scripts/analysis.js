/*
 * 0 -> body - ground
 * 1 -> leftKnee
 * 2 -> rightKnee
 * 3 -> leftHip
 * 4 -> rightHip
 * 5 -> leftShoulder
 * 6 -> rightShoulder
 * 7 -> leftElbow
 * 8 -> rightElbow
 */
function pose_to_vec(pose) {
	const points = pose["keypoints"];
	
	function position(i) {
		return points[i]["position"];
	}
	
	const body_up_center_x = 0.5 * (points[5]["position"]["x"] + points[6]["position"]["x"]);
	const body_up_center_y = 0.5 * (points[5]["position"]["y"] + points[6]["position"]["y"]);
	const body_down_center_x = 0.5 * (points[11]["position"]["x"] + points[12]["position"]["x"]);
	const body_down_center_y = 0.5 * (points[11]["position"]["y"] + points[12]["position"]["y"]);
	const horizontal_x = body_down_center_x + 10;
	const horizontal_y = body_down_center_y;
	
	const body_up_center = {"x": body_up_center_x, "y": body_up_center_y};	
	const body_down_center = {"x": body_down_center_x, "y": body_down_center_y};	
	const horizontal = {"x": horizontal_x, "y": horizontal_y};
	
	const leftAnkle = position(15);
	const rightAnkle = position(16);
	const leftKnee = position(13);
	const rightKnee = position(14);
	const leftHip = position(11);
	const rightHip = position(12);
	const leftShoulder = position(5);
	const rightShoulder = position(6);
	const leftElbow = position(7);
	const rightElbow = position(8);
	const leftWrist = position(9);
	const rightWrist = position(10);
	
	const angles = [
		calc_angle(horizontal, body_down_center, body_up_center),
		calc_angle(leftAnkle, leftKnee, leftHip),
		calc_angle(rightAnkle, rightKnee, rightHip),
		calc_angle(leftKnee, leftHip, leftShoulder),
		calc_angle(rightKnee, rightHip, rightShoulder),
		calc_angle(leftHip, leftShoulder, leftElbow),
		calc_angle(rightHip, rightShoulder, rightElbow),
		calc_angle(leftShoulder, leftElbow, leftWrist),
		calc_angle(rightShoulder, rightElbow, rightWrist),
		calc_angle(leftShoulder, rightShoulder, rightElbow),
		calc_angle(rightShoulder, leftShoulder, leftElbow),
	];
	
	console.log(angles);
	
	// normalization
	var square_sum = 0;
	
	for (let i=0; i<angles.length; i++) {
		square_sum += Math.pow(angles[i], 2);
	}
	for (let i=0; i<angles.length; i++) {
		angles[i] /= Math.sqrt(square_sum);
	}
	
	return angles;
}

function pose_to_vec2(pose) {
	console.log(pose);
	const points = pose["keypoints"];
	
	const [positions, scores] = fit_to_bound_box(points);
	
	console.log(positions);
	console.log(scores);
	
	// normalization
	var square_sum = 0;
	
	for (let i=0; i<positions.length; i++) {
		square_sum += Math.pow(positions[i], 2);
	}
	for (let i=0; i<positions.length; i++) {
		positions[i] /= Math.sqrt(square_sum);
	}
	//console.log(positions);
	return [positions, scores];
}

function fit_to_bound_box(points){
	var positions = [];
	var scores = [];
	
	var min_x = Infinity;
	var min_y = Infinity;
	var max_x = 0;
	var max_y = 0;
	
	for (let i = 0; i < 17; i++) {
		positions.push(points[i]["position"]["x"]);
		positions.push(points[i]["position"]["y"]);
		scores.push(points[i]["score"]);
		
		if(points[i]["position"]["x"] > max_x) {
			max_x = points[i]["position"]["x"];
		} else if(points[i]["position"]["x"] < min_x) {
			min_x = points[i]["position"]["x"];
		}
		if(points[i]["position"]["y"] > max_y) {
			max_y = points[i]["position"]["y"];
		} else if(points[i]["position"]["y"] < min_y) {
			min_y = points[i]["position"]["y"];
		}
	}
	
	const ref_bound_box = 1000;
	const curr_bound_box = Math.max(max_x - min_x, max_y - min_y);
	
	// scaling
	for (let i=0; i<positions.length; i+=2) {
		positions[i] = (positions[i] - min_x) / curr_bound_box * ref_bound_box;
		positions[i+1] = (positions[i+1] - min_y) / curr_bound_box * ref_bound_box;
	}
	return [positions, scores];
}

function calc_similarity(pose, pose_ref) {
	let sim = cos_similarity(pose, pose_ref);
	//let distance = 2 * (1 - sim);
	//return Math.sqrt(distance);
	return sim;
}

function calc_angle(p1, p0, p2) {
	const u = [p1["x"] - p0["x"], p1["y"] - p0["y"]];
	const v = [p2["x"] - p0["x"], p2["y"] - p0["y"]];
	
	var angle =  Math.atan2(u[1], u[0]) - Math.atan2(v[1], v[0]);
	if (angle < 0) {
		angle += 2 * Math.PI;
	}
	return angle / (Math.PI / 180);
}

function cos_similarity(v1, v2){
  var sim = 0;
  var sumV = 0; 
  var v1Square = 0;
  var v2Square = 0;
   
  if (v1.length === v2.length) {
    for(let count = 0; count < v1.length; count++){
      sumV = sumV + (v1[count] * v2[count]);
      //v1Square = v1Square + Math.pow(v1[count], 2);
      //v2Square = v2Square + Math.pow(v2[count], 2);
    }      
  }
  sim = sumV;// / (Math.sqrt(v1Square)*Math.sqrt(v2Square));
  return sim;   
}

function calc_similarity2(pose, pose_ref) {
	const [positions, scores] = pose;
	const [positions_ref, scores_ref] = pose_ref;
	
	var scores_sum = 0;
	var dists_sum = 0;
	
	for (let i=0; i<positions.length; i+=2) {
		scores_sum += scores[Math.floor(i/2)];
		dists_sum += scores[Math.floor(i/2)] * calc_distance(positions[i], positions[i+1], positions_ref[i], positions_ref[i+1]);
	}	
	return 1 / scores_sum * dists_sum;
}

function calc_distance(p_x, p_y, p_ref_x, p_ref_y) {
	return Math.sqrt(Math.pow(p_x - p_ref_x, 2) + Math.pow(p_y - p_ref_y, 2));
}

