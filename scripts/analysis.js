function array_cosinesim(a,b){
	let dtw = new DynamicTimeWarping(a, b, function(a,b){ return 1 - cosinesim(a,b)});
    return 1 - dtw.getDistance()/dtw.getPath().length;
}

function cosinesim(Base, Comp){

    let dotproduct = 0;
    let mA = 0;
    let mB = 0;
    let baseScore = 0;
    let baseScoreSum = 0;
    let compScore = 0;
    let cosinesim = 0;

    for(let i = 0; i < Base.length; i++){
        baseScore = Base[i]["score"];
        baseScoreSum += baseScore;
        compScore = Math.min(Comp[i]["score"]/Base[i]["score"], 1);

        dotproduct += (Base[i]["position"]['x'] * Comp[i]["position"]['x']);// * compScore; // * baseScore
        mA += (Base[i]["position"]['x'] * Base[i]["position"]['x']);
        mB += (Comp[i]["position"]['x'] * Comp[i]["position"]['x']);

        dotproduct += (Base[i]["position"]['y'] * Comp[i]["position"]['y']);// * compScore; // * compScore * baseScore
        mA += (Base[i]["position"]['y'] * Base[i]["position"]['y']);
        mB += (Comp[i]["position"]['y'] * Comp[i]["position"]['y']);
    }

    //let baseFactor = Base.length/baseScoreSum;
    //dotproduct *= baseFactor;

    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
	cosinesim = (dotproduct)/((mA)*(mB))

	cosinesim = cosinesim*6 - 5

    return cosinesim>0 ? cosinesim : 0;
}

function fit_to_bound_box(points){
	var min_x = Infinity;
	var min_y = Infinity;
	var max_x = 0;
	var max_y = 0;

	for (let i = 0; i < points.length; i++) {
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
	for (let i = 0; i < points.length; i++) {
		points[i]["position"]["x"] = (points[i]["position"]["x"] - min_x) / curr_bound_box * ref_bound_box;
		points[i]["position"]["y"] = (points[i]["position"]["y"] - min_y) / curr_bound_box * ref_bound_box;
	}
	return normalize(points);
}

function normalize(points){
	let square_sum = 0;

	for (let i=0; i<points.length; i++) {
		square_sum += points[i]["position"]["x"]**2;
		square_sum += points[i]["position"]["y"]**2;
	}

	square_sum = Math.sqrt(square_sum)

	for (let i=0; i<points.length; i++) {
		points[i]["position"]["x"]/= square_sum;
		points[i]["position"]["y"]/= square_sum;
	}

	return points
}