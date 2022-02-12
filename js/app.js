const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
var material = [];
for(i=0;i<6;i++){
    loadTextures();
}
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

camera.position.z = 1.75;
controls.update();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();

document.getElementById('go').addEventListener('click', () => {
    material = [];
    for(i=0;i<6;i++){
        loadTextures();
    }
    cube.material = material;
})

function loadTextures() {
    var chars = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'; 
    var text = '';

    for (var i = 0; i < 5; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        text += chars.substring(rnum,rnum+1);
    }

    
    var image = new Image();
    image.src = 'https://i.imgur.com/' + text + '.jpg';;
    image.onload = function() {
        if (this.width == 161) {
            loadTextures();
        } else {
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Client-ID 26e01ce3527714a');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };

            fetch('https://api.imgur.com/3/image/'+text, requestOptions)
                .then(response => response.text())
                .then(result => {
                    if(!JSON.parse(result).data.nsfw){
                        const loader = new THREE.TextureLoader();
                        material.push(new THREE.MeshBasicMaterial({ map: loader.load(image.src) }));
                    }
                })
                .catch(error => console.log('error', error));
        }
    };
}