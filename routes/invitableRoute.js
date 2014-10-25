var Invitables = require('./models/invitable');

exports.create = function(req,res){
  var event = new Invitables();
  event.name=req.body.name;

  event.save(function(err){
    if(err){
      res.send(err);
    }
    res.json({message: 'user created!'});
  });
}
