var Invitables = require('./models/invitable');

exports.create = function(req,res){
  var event = new Invitables(
    {id:req.body.id,
      name: req.body.name,
      url: req.body.url,
      about: req.body.about,
      email: req.body.email,
      creation: req.body.creation,
      subs:[{"name": req.body.subscriber}]
      });

  console.log(req.body);
  console.log(event.subs);
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
  Invitables.findOne(req.params.event_id, function(err,user){
    if(err){
      res.send(err);
    }
    res.json(user);
  });
}

exports.addUserToEvent = function(req,res){
  Invitables.findOne(req.params.event_id, function(err,user){
    if(err){
      res.send(err)
    }else{
      user.subs.push({name:req.params.user_name})
      console.log(user);
      user.save(function(error){
        if(error){
          res.send(error);
        }else{
          res.json(user);
        }
      })
    }
  });
}
