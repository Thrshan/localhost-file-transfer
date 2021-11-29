const generateProfilePic =  ()=>{
    const height = 7;
    const width = 7;
    const backColor = {R:255, G:0, B:255, O:255};
    const splashColor = {R:255, G:255, B:0, O:255};
  
    // let points = [[0,0],[2,5], [1,3], [4,4], [5,5], [3,2]];
    const points = [];
    for (let i = 0 ; i < 10 ; i++){
      points.push([Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)]);
    }
  
    let mirrorPoints = [];
    const middle = Math.floor(width / 2)
    for ( point of points ){
      let newPointX = 0;
      newPointX = (2 * middle) - point[1];
      mirrorPoints.push([point[0], newPointX]);
    }
    const allPoints = points.concat(mirrorPoints);
  
    const imageData = {R: [], G: [], B: [], O: []};
  
    for (let i = 0 ; i < height ; i++){
      imageData.R.push([]);
      imageData.G.push([]);
      imageData.B.push([]);
      imageData.O.push([]);
    }
  
    for (let i = 0 ; i < 7 ; i++){
        for (let j = 0 ; j < 7 ; j++){
          if (pointHas(allPoints, [i,j])){
            imageData.G[i].push(splashColor.G);
            imageData.B[i].push(splashColor.B);
            imageData.R[i].push(splashColor.R);
            imageData.O[i].push(splashColor.O);
          } else {
            imageData.R[i].push(backColor.R);
            imageData.G[i].push(backColor.G);
            imageData.B[i].push(backColor.B);
            imageData.O[i].push(backColor.O);
          }
        }
    }
    // console.log(rawImgData);
    return {
      height,
      width,
      imageData
    }
  };

  function pointHas(pointsArray, reqPoint){
    for ( point of pointsArray ){
      if (JSON.stringify(point) == JSON.stringify(reqPoint)){
        return true;
      }
    }
    return false;
  }

  module.exports = {generateProfilePic};
