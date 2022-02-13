const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
var material = [];
var links = [];
for(i=0;i<6;i++){
    loadTextures();
}
const cube = new THREE.Mesh(geometry, material);
cube.rotation.y = 0.75;
cube.rotation.x = 0.5;
scene.add(cube);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;

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
    links = [];
    for(i=0;i<6;i++){
        loadTextures();
    }
    cube.material = material;
})

document.getElementById('down').addEventListener('click', () => {
    var chars = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'; 
    var text = '';
    for (var i = 0; i < 5; i++) {
        var rand = Math.floor(Math.random() * chars.length);
        text += chars.substring(rand,rand+1);
    }
    var a = document.createElement('a');
    a.href = 'data:text/json, ["'+links.toString().replaceAll(',', '","')+'"]'
    a.download = text+'.json';
    a.click();
});

document.getElementById('up').addEventListener('click', () => {
    material = [];
    links = [];
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = function(){
        var fr = new FileReader();
        fr.onload = function(){
            var toparse = fr.result.replaceAll('[','').replaceAll(']','').replaceAll('"','').replace(' ', '');
            var array = toparse.split(',');
            array.forEach((link)=>{
                const loader = new THREE.TextureLoader();
                links.push(link);
                material.push(new THREE.MeshBasicMaterial({ map: loader.load(link) }));
                cube.material = material;
            })
        }
        fr.readAsText(input.files[0]);
    }
    input.click();
});

function loadTextures() {
    var chars = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'; 
    var text = '';

    for (var i = 0; i < 5; i++) {
        var rand = Math.floor(Math.random() * chars.length);
        text += chars.substring(rand,rand+1);
    }

    
    var image = new Image();
    image.src = 'https://i.imgur.com/' + text + '.jpg';;
    image.onload = function() {
        if (this.width == 161 && this.height/this.width > .2) {
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
                        links.push(image.src);
                        material.push(new THREE.MeshBasicMaterial({ map: loader.load(image.src) }));
                    }
                })
                .catch(error => console.log('error', error));
        }
    };
}