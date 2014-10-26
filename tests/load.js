var request=require('request');

function eventLoad(count, user){
  if (count > 0){

    request('http://localhost:3000/invitables/32/' + user, function(error, response,html){
      if(!error && response.statusCode === 200){
        eventLoad(count-1, makeid());
      }else{
        console.log(error);
      }
    })
  }
}


function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

eventLoad(process.argv[2],makeid());
