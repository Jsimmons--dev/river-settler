export function getWorldPos(pos) {
    return (pos[2] % 2 == 0) ? [pos[0], pos[1], pos[2] * .77] : [pos[0] - .5, pos[1], pos[2] * .77];
}

export function getHousePos(posA, posB, posC) {
    var wA = getWorldPos(posA);
    var wB = getWorldPos(posB);
    var wC = getWorldPos(posC);
    var avgX = (wA[0] + wB[0] + wC[0]) / 3;
    var avgZ = (wA[2] + wB[2] + wC[2]) / 3;
    return (moreOdd(posA, posB, posC)) ? [avgX, posA[1], avgZ] : [avgX, posA[1], avgZ];
}

export function getRoadPos(posA, posB) {
    console.log(posA, posB);
    var wA = getWorldPos(posA);
    var wB = getWorldPos(posB);
    console.log(wA, wB);
    var avgX = (wA[0] + wB[0]) / 2;
    var avgZ = (wA[2] + wB[2]) / 2;
    return [avgX, posA[1], avgZ];
}

export function geomCenter(id, game) {
    var ids = id.split("_");
    console.log('ids '+ids);
    var points = [];
    ids.forEach((d,i) => {
        points[i] = [
            game.Hexes[d].x,
            game.Hexes[d].y
        ]
    });
	console.log('points init '+points);
    var avgs = [];
    points.forEach((d) => {
        d.forEach((p,i) => {
            if (avgs[i] === undefined) avgs[i] = 0;
            avgs[i] += p;
        });
    });
	console.log('added columns '+avgs);
	avgs.forEach((d,i)=>{
		avgs[i] /= points.length;
	});
	console.log('avgs '+avgs);
	return avgs;
}

function moreOdd(posA, posB, posC) {
    var sameY;

    var vert = 2;
    if (posA[vert] === posB[vert]) {
        sameY = posA[vert];
    } else if (posB[vert] === posC[vert]) {
        sameY = posB[vert];
    } else if (posA[vert] === posC[vert]) {
        sameY = posA[vert];
    }
    return sameY % 2 == 1;
}
