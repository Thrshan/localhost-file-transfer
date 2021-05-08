const socket = io();

socket.on('startup', data => {
    console.log(data.rawImageData);
    loadProfilePic(data.rawImageData);
});


window.addEventListener('load', (event) => {
    socket.emit('loaded','Loaded');
});


function loadProfilePic(rawImageData) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    // size the canvas to your desired image
    const imageHeight = 100;
    const imageWidth = 100;

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // get the imageData and pixel array from the canvas
    var imgData = ctx.getImageData(0, 0, imageWidth, imageHeight);
    var data = imgData.data;

    // scale and save the pixels
    k = 0;
    let heightPosition = 0;
    let widthPosition = 0;
    for (let i = 0 ; i < imageHeight ; i++){
        heightPosition = Math.floor(i / (imageHeight / rawImageData.height));
        for(let j = 0 ; j < imageWidth ; j++){
            widthPosition = Math.floor(j / (imageWidth / rawImageData.width));
            data[k] = rawImageData.imageData.R[heightPosition][widthPosition];
            data[k + 1] = rawImageData.imageData.G[heightPosition][widthPosition];
            data[k + 2] = rawImageData.imageData.B[heightPosition][widthPosition];
            data[k + 3] = rawImageData.imageData.O[heightPosition][widthPosition];
            k += 4;
        }
    }

    // put the modified pixels back on the canvas
    ctx.putImageData(imgData, 0, 0);

    // create a new img object
    var image = new Image();

    // set the img.src to the canvas data url
    image.src = canvas.toDataURL();

    // document.body.appendChild(image);

    const ProfilePic = document.getElementById("profilePhoto");
    ProfilePic.setAttribute("src", image.src);
}
// append the new img object to the page



