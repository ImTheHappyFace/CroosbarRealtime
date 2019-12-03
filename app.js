var connection = new autobahn.Connection({url: 'wss://ws.syrow.com:443/ws', realm: 'default'});
var app = angular.module("PubSubAngApp", []);

app.controller("PublishingCtrl", function($scope) {
    $scope.model = { message: "" };

    $scope.clickMe = function(outgoingMsg) {
        if (connection.session) {
           connection.session.publish("com.myapp.mytopic1", [outgoingMsg]);
           console.log("event published!");
           // $scope.model = { message: " " };
        } else {
           console.log("cannot publish: no session");
        }
    };
});

app.controller("ReceivingCtrl", ['$scope', function($scope) {
    $scope.model = {message: " "};

    $scope.mglist = [];
    $scope.showMe = function(incomingMsg) {
        $scope.model.message = incomingMsg;
        $scope.mglist.push(incomingMsg);
        console.log($scope.mglist,"sssssssss");

    };
}]);


// "onopen" handler will fire when WAMP session has been established ..
connection.onopen = function (session) {

   console.log("session established!");

   // our event handler we will subscribe on our topic
   //
   function onevent1(args, kwargs) {
      console.log("got event:", args, kwargs);
      var scope = angular.element(document.getElementById('Receiver')).scope();
      scope.$apply(function() {
          scope.showMe(args[0]);
      });
   }

   // subscribe to receive events on a topic ..
   //
   session.subscribe('com.myapp.mytopic1', onevent1).then(
      function (subscription) {
         console.log("ok, subscribed with ID " + subscription.id);
      },
      function (error) {
         console.log(error);
      }
   );
};


// "onclose" handler will fire when connection was lost ..
connection.onclose = function (reason, details) {
   console.log("connection lost", reason);
}


// initiate opening of WAMP connection ..
connection.open();
