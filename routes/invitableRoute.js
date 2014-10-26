var Invitables = require('./models/invitable');

exports.create = function(req,res){
  var event = new Invitables({id:req.body.id, name: req.body.name, url: req.body.url, about: req.body.about, email: req.body.email, creation: req.body.creation, subs:[{"name": req.body.subscriber}]});
  console.log(req.body);
  // console.log(req.body.about);
  event.save(function(err){
    if(err){
      res.send({message: 'db problem!'});
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

exports.getSingle = function(req,res){
  Invitabes.findById
}
