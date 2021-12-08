const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + "/public"));
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));
app.use('/delaunator/', express.static(path.join(__dirname, 'node_modules/delaunator')));
app.use('/robust-predicates/', express.static(path.join(__dirname, 'node_modules/robust-predicates')));

app.listen(3000, () =>
    console.log('Visit http://127.0.0.1:3000')
);