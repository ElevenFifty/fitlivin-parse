
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
