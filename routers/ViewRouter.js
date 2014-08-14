module.exports = {
  setup: function(express, app){

    var viewRouter = express.Router();
        
    viewRouter.get('/', function(req, res) {
      res.render('index',{title:'PayTime'});
    });
    viewRouter.get('/partials/:name', function(req, res) {
      res.render('partials/' + req.params.name,{ });
    });
    
		app.use('/', viewRouter);
	}
}