var btn = document.getElementById("sendcoords");
btn.addEventListener("click", function(event) {
  if (navigator.geolocation) {
    console.log("browser supports geolocation");
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }
});

function onSuccess(position) {
  //
  var mycoords = [position.coords.latitude, position.coords.longitude];
  console.log("MY COORDS: " + mycoords);
  sendToWorker(mycoords);
}

function onError(error) {
  //
  console.log(error);
}

function sendToWorker(mycoords) {
  var url = "http://s.codepen.io/catburston/pen/jsIgk.js";
  var task = new Worker(url);
  console.log("TASK: " + task);

  task.postMessage(mycoords);
  task.onmessage = function(event) {
    console.log("EVENT DATA: " + event.data);
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification"); // Let's check if the browser supports notifications
      }
      else if (Notification.permission === "granted") {
        console.log("Browser supports notifications");
        constructNotification(event.data, mycoords);
      }
      else if (Notification.permission !== 'denied') { // Otherwise, we need to ask the user for permission
        Notification.requestPermission(function (permission) {
          if(!('permission' in Notification)) {
            Notification.permission = permission;
          }
          if (permission === "granted") {
            constructNotification(event.data, mycoords);
          }
        });
      }
  }
}

function constructNotification(url, coords) { 
  console.log("URL: " + url);
  console.log("COORDS: " + coords);
  var notification = new Notification("Current Coordinates", {
    icon: url,
    body: "Latitude: " + coords[0] + "\nLongitude: " + coords[1]
  });
}