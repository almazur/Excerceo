function cosinesim(a,b){

    let A = a["keypoints"];
    let B = b["keypoints"];


    let dotproduct = 0;
    let mA = 0;
    let mB = 0;
    for(i = 0; i < A.length; i++){
        dotproduct += (A[i]["position"]['x'] * B[i]["position"]['x']);
        mA += (A[i]["position"]['x']*A[i]["position"]['x']);
        mB += (B[i]["position"]['x']*B[i]["position"]['x']);

        dotproduct += (A[i]["position"]['y'] * B[i]["position"]['y']);
        mA += (A[i]["position"]['y']*A[i]["position"]['y']);
        mB += (B[i]["position"]['y']*B[i]["position"]['y']);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    return (dotproduct)/((mA)*(mB))
}