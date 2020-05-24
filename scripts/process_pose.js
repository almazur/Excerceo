

/**
 * Circular Buffer
 * @param maxLength
 * @constructor
 */

function CircularArray(maxLength) {
    this.maxLength = maxLength;
}

CircularArray.prototype = Object.create(Array.prototype);

CircularArray.prototype.push = function(element) {
    Array.prototype.push.call(this, element);
    while (this.length > this.maxLength) {
        this.shift();
    }
}

const startPoses = [];
let fittedStartPoses = []
const comparisonGap = 3;
const threshold = 0.95;
const countDelayFactor = 0.7;
let countDelayMin;
let bufferLen;
let posesBuffer;

function initBuffer() {
    bufferLen = Math.ceil(startPoses.length * referenceDelayRate);
    countDelayMin = Math.floor(bufferLen * countDelayFactor)
    posesBuffer = new CircularArray(bufferLen);
    console.log(startPoses.length, bufferLen)
    fittedStartPoses = startPoses.map(fit_to_bound_box);
}

function processStartPose(keypoints, minPartConfidence, scale) {
    startPoses.push(keypoints)
}

let gap = 0;
let countDelay = 0;
function processCameraPose(keypoints, minPartConfidence, scale) {
    posesBuffer.push(keypoints)
    let cos;
    if (gap === comparisonGap) {
        if (posesBuffer.length > bufferLen/2) {
            cos = array_cosinesim(fittedStartPoses, posesBuffer.map(fit_to_bound_box));
            setCorrectness(cos)
            if(countDelay >= countDelayMin && cos > threshold){
                incrementRepetitionsCount();
                countDelay = 0;
            }


            /*
            console.log(
                'normal: ' + array_cosinesim(startPoses, posesBuffer) + '\n' +
                'fitted: ' + array_cosinesim(startPoses.map(fit_to_bound_box), posesBuffer.map(fit_to_bound_box)) + '\n' );

             */
        }
        gap = 0;
    }

    gap++;
    countDelay++;
}

