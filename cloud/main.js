
// targetUser = "hEwk3OS9Pp", alert="Hello World"
Parse.Cloud.define('sendPush', function(request, response) {

  var recipientUser = new Parse.User();
  recipientUser.id = request.params.targetUser;

  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("user", recipientUser);

  var data = {
    aps: {
      alert: request.params.title,
      badge:1
    },
    alert    : request.params.title,
    category : request.params.categoryString || '',
    objectId : request.params.objectId || '',
    badge    : "Increment"
  };

  Parse.Push.send(
      { where: pushQuery, data: data },
      { useMasterKey: true,
        success: function() {
          // console.log("Successfully sent the push");
      }, error: function(err) {
          console.log(err);
      }
  }).then(function() {
      response.success("Push Sent!");
    }, function(error) {
      response.error("Error while trying to send push " + error.message);
    });
});

Parse.Cloud.define('markAllRead', function(request,response) {
  var theUser = request.user;
  var batchUpdate = [];

  var query = new Parse.Query("Notification");
  query.equalTo("user", theUser);
  query.notEqualTo("read", true);
  query.limit(1000);

  query.find().then( function(result) {
    result.forEach(function(note) {
      note.set("read", true);
      batchUpdate.push(note);
    },
    function(error) {});
  }).then(function(foo) {
    if(batchUpdate.length > 0) {
      Parse.Object.saveAll(batchUpdate).then(
        function(list) {
			      // All the objects were saved.
						// console.log("all notes marked read");
            response.success();
			    },
			    function(error) {
			      // An error occurred while saving one of the objects.
						console.log(error);
            response.error(error);
			    }
				);
    }
  });

});
