module.exports = function(app) { 
    app.get('*', function(req, res) {
        res.sendfile('./src/index.html'); // load our src/index.html file
    });

    app.get('/sendRsvp', function(req, res) {
    });
};