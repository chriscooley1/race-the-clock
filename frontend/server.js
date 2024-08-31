"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var path_1 = require("path");
var app = (0, express_1.default)();
// Serve static files from the "dist" directory
app.use(express_1.default.static(path_1.default.join(__dirname, 'dist')));
// Handle SPA
app.get('*', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, 'dist', 'index.html'));
});
// Start the server
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
