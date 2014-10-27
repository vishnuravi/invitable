var Invitables = require('./models/invitable');
var Subscribers = require('./models/subscriber');

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
  console.log(event)
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

// exports.addUserToEvent = function(req,res){
//   Invitables.findOne(req.params.event_id, function(err,user){
//     if(err){
//       res.send(err)
//     }else{
//       user.subs.push({name:req.params.user_name})
//       console.log(user);
//       console.log(err);
//       user.save()
//     }
//   });
// }

exports.addUserToEvent = function(req,res){
  console.log(req.params.event_id);

  var subscriber = new Subscribers({
    name: req.params.user_name,
    invitable: req.params.event_id
  })
  console.log(subscriber);
  subscriber.save( function(err, result) {
    if (err) {
      console.log("err");
      res.send(err);
    }
    console.log("Y");
    res.send("Okay");
  });
}
