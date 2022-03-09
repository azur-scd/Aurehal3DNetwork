const elem = document.getElementById('graph');
var nodes = [];
var links = [];
let nodes_url = "/api/nodes"
let links_url = "/api/edges"
var $range = $(".js-range-slider")
var group_colors = {
  "institution": "MediumAquamarine",
  "regroupinstitution": "DodgerBlue",
  "regrouplaboratory": "orange",
  "laboratory": "Chocolate",
  "department": "Violet",
  "researchteam": "Silver"
}
//init
let start_nodes_url = $("a.nodes_url").attr("href")
let start_links_url = $("a.links_url").attr("href")
main(start_nodes_url, start_links_url)


function main(current_nodes_url, current_links_url) {
  $("a.nodes_url").attr("href", current_nodes_url);
  $("a.links_url").attr("href", current_links_url);
  getNodesOrEdgesData(current_nodes_url)
  getNodesOrEdgesData(current_links_url)
  createGdata()
}

function getNodesOrEdgesData(url) {
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
  skin: "sharp",
  grid: true,
  min: 0,
  max: 30000,
  from: 1000,
  to: 7000,
  onFinish: function (data) {
    var current_nodes_url = `${nodes_url}?nbPublis=${data.from}-${data.to}`
    var current_links_url = `${links_url}?nbPublis=${data.from}-${data.to}`
    main(current_nodes_url, current_links_url)
  }
});

function createGdata(from, to) {
  const gData = {
    nodes: nodes,
    links: links
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
    .nodeColor(node => group_colors[node.type_s])
    //.nodeAutoColorBy('type_s')
    .linkOpacity(0.8)
    .linkDirectionalArrowLength(2.5)
    .linkDirectionalArrowRelPos(1)
    .nodeLabel(node => `${node.label_s}`)
    .cameraPosition({ z: 1000 })
    .nodeThreeObject(node => {
      const obj = new THREE.Mesh(new THREE.SphereGeometry(10), new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 }));
      if (`${node.type_s}` == "institution" || `${node.type_s}` == "regroupinstitution") {
        const sprite = new SpriteText(node.label_s);
        //sprite.color = node.color;
        sprite.color = group_colors[node.type_s];
        sprite.textHeight = 10;
        obj.add(sprite);
        return obj;
      }
    })
    .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
}