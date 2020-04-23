export function pose_to_vec(pose) {
	var positions = []
	var scores = []
	var norm2 = 0;
	
	var i;
	for (i = 0; i < 17; i++) {
	  positions.push([pose["keypoints"][i]["position"]["x"], pose["keypoints"][i]["position"]["y"]]);
	  scores.push(pose["keypoints"][i]["score"]);
	  //const p = positions[i]
	  //norm2 += Math.pow(p[0], 2) + Math.pow(p[1], 2);
	}
	
	//TODO scaling and normalization	
	
	return [positions, scores]
}

export function calc_similarity(pose, pose_ref) {
	const [positions, scores] = pose;
	const [positions_ref, scores_ref] = pose_ref;
	
	var scores_sum = 0;
	var dists_sum = 0;
	var i;
	
	for (i=0; i<17; i++) {
		scores_sum += scores[i];
		dists_sum += scores[i] * calc_distance(positions[i], positions_ref[i]);
	}
	
	return 1 / scores_sum * dists_sum;
}

function calc_distance(p, p_ref) {
	return Math.sqrt(Math.pow(p[0] - p_ref[0], 2) + Math.pow(p[1] - p_ref[1], 2));
}
