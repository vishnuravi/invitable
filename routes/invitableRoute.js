var Invitables = require('./models/invitable');

exports.create = function(req,res){
  var event = new Invitables({ name: req.body.name});

  event.save(function(err){
    if(err){
      res.send(err);
    }
    res.json({message: 'user created!'});
  });
}

exports.get = function(req, res){
  Invitables.find(function(err, events){
    if(err){
      res.send(err);
    }
    res.json(events)
  })

}
