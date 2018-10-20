const employeeapimethods = require('../controllers/employeeapimethods');

module.exports = (app) => {
    // url.com/api default response
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Sample API!',
    }));

    app.get('/api/fetchemployee', employeeapimethods.fetch);
}