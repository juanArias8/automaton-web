$(document).ready(() => {
    let graphAutomatonLink = $("#graphAutomatonLink");
    let jsonAutomatonLink = $("#jsonAutomatonLink");
    let codeAutomatonLink = $("#codeAutomatonLink");

    let graphAutomatonContainer = $("#graphAutomatonContainer");
    let jsonAutomatonContainer = $("#jsonAutomatonContainer");
    let codeAutomatonContainer = $("#codeAutomatonContainer");

    jsonAutomatonContainer.hide(0);
    codeAutomatonContainer.hide(0);

    graphAutomatonLink.click(() => {
        graphAutomatonContainer.show(0);
        jsonAutomatonContainer.hide(0);
        codeAutomatonContainer.hide(0);
    });

    jsonAutomatonLink.click(() => {
        graphAutomatonContainer.hide(0);
        jsonAutomatonContainer.show(0);
        codeAutomatonContainer.hide(0);
    });

    codeAutomatonLink.click(() => {
        graphAutomatonContainer.hide(0);
        jsonAutomatonContainer.hide(0);
        codeAutomatonContainer.show(0);
    });

    // create an array with nodes
    let nodes = [
        {id: 1, label: 'Node 1'},
        {id: 2, label: 'Node 2'},
        {id: 3, label: 'Node 3'},
        {id: 4, label: 'Node 4'}
    ];

    // create an array with edges
    let edges = [
        {from: 1, to: 2, arrows: 'to', label: 'a'},
        {from: 2, to: 3, arrows: 'to', label: 'b'},
        {from: 3, to: 4, arrows: 'to', label: 'a'},
        {from: 4, to: 4, arrows: 'to', label: 'b'}
    ];

    // create a network
    let container = document.getElementById('graphAutomatonContainer');
    let data = {
        nodes: nodes,
        edges: edges
    };

    let options = {};
    let network = new vis.Network(container, data, options);
});