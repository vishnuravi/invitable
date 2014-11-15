var Invitables = require('./models/invitable');
var Subscribers = require('./models/subscriber');
var Users = require('./models/users');
var Q = require('q');

exports.create = function(req,res){
  var event = new Invitables(
    {id:req.body.id,
      name: req.body.name,
      url: req.body.url,
      about: req.body.about,
      email: req.body.email,
      creation: req.body.creation,
      sendable: req.body.sendable
      });
  // console.log(req.body.about);
  event.save(function(err){
    if(err){
      res.send("500");
    }
    res.send("200");
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

exports.getSub = function(req,res){
  /**
  Gets the events a user is subbed to
  **/
  Subscribers.find({name: req.params.user_name}).populate('invitable', 'name').exec(function (err, subscription){
    (err ? res.send(err) : res.send(subscription));

  })
}

exports.addUserToEvent = function(req,res){
  console.log(req.params.event_id);

  var subscriber = new Subscribers({
    name: req.params.user_name,
    invitable: req.params.event_id
  })
  // console.log(subscriber);
  subscriber.save( function(err, result) {
    if (err) {
      // console.log("err");
      res.send(err);
    }
    // console.log("Y");
    res.send("200");
  });
}

exports.deleteSub = function(req, res){
  Subscribers.remove({name: req.body.user_id, invitable: req.body.event_id}).exec(function (err, subscription){
    (err ? res.send(err) : res.send("200"));

  })
}

exports.deleteInvitable = function(req,res){
  Invitables.remove({_id: req.body.event_id}).exec(function (err, subscription){
    (err ? res.send(err) : res.send("200"));
  })
}

exports.getInvitableSubs= function(req,res){
  Subscribers.find({invitable: req.params.event_name}).populate('name').populate('invitable','name').sort({name: 1}).exec(function (err, subscription){
    var key;
    var f;
    for(key in subscription){
      if(subscription[key].name != null  ){
        if(subscription[key].name.local.password ){
          subscription[key].name.local.password = null;
        }
        if(subscription[key].name.facebook.token){
          subscription[key].name.facebook.token = null;
        }
      }
    }
    (err ? res.send(err) : res.send(subscription));
  })
}

exports.incSend = function(req,res){
  // req.params.user_name
  Users.findById(req.params._id).exec(function (err, user){
    if(err) return handleError(err);
    user.invitesGiven = ++user.invitesGiven;
    user.inviteRatio = user.invitesGiven/user.invitesReceived;
    user.save(function(err){
      (err ? res.send(err) : res.send(user));
    })

  })

}
exports.incRec = function(req,res){
  Users.findById(req.params._id).exec(function (err, user){
    if(err) return handleError(err);
    user.invitesReceived = ++user.invitesReceived;
    user.inviteRatio = user.invitesGiven/user.invitesReceived;
    user.save(function(err){
      (err ? res.send(err) : res.send(user));
    })
  })
}
