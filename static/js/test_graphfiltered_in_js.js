const elem = document.getElementById('graph');
var nodes = [];
var links = [];
let nodes_url = "http://localhost:5000/api/nodes"
let links_url = "http://localhost:5000/api/edges"
var $range = $(".js-range-slider")

getNodesOrEdges(nodes_url)
getNodesOrEdges(links_url)
function getNodesOrEdges(url) {
    return $.ajax({
        url: url,
        async: false,
        dataType: 'json',
        success: function (json) {
            if (url.includes("nodes")) {
                nodes = json
            }
            if (url.includes("edges")) {
                links = json
            }
        }
    });
}
$range.ionRangeSlider({
    type: "double",
    grid: true,
    min: 0,
    max: 30000,
    from: 10000,
    to: 15000,
    onFinish: function (data) {
        createGdata(data.from, data.to)
    }
});

function createGdata(from, to) {
    let filtered_nodes = nodes.filter(function (d) { return d.nb_publis > from & d.nb_publis < to})
    let yFilter = filtered_nodes.map(itemY => { return itemY.id; });
    console.log(filtered_nodes)
    let filtered_links = links.filter(itemX => yFilter.includes(itemX.source) && yFilter.includes(itemX.target));
    console.log(filtered_links)
    const gData = {
        nodes: filtered_nodes,
        links: filtered_links
    };
    draw(gData)
}
function draw(gData) {
    const Graph = ForceGraph3D()(elem)
            .graphData(gData)
            .enableNodeDrag(true)
            .onNodeDragEnd(node => {
                node.fx = node.x;
                node.fy = node.y;
                node.fz = node.z;
            })
            .enableNavigationControls(true)
            .showNavInfo(true)
            // .nodeVal(node => `${node.size}` / 100)
            .nodeAutoColorBy('type_s')
            .linkOpacity(0.8)
            .linkDirectionalArrowLength(2.5)
            .linkDirectionalArrowRelPos(1)
            .nodeLabel(node => `${node.label_s}`)
            .cameraPosition({ z: 1000 })
            .nodeThreeObject(node => {
                const obj = new THREE.Mesh(new THREE.SphereGeometry(10), new THREE.MeshBasicMaterial({depthWrite: false, transparent: true, opacity: 0}));
                if (`${node.type_s}` == "institution" || `${node.type_s}` == "regroupinstitution") {
                    const sprite = new SpriteText(node.label_s);
                    sprite.color = node.color;
                    sprite.textHeight = 8;
                    obj.add(sprite);
                    return obj;
                }
            })       
            .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
}