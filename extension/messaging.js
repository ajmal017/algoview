var nativePort = null;

var getKeys = function(obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }
  return keys;
};

function sendNativeMessage(message) {
  if (nativePort == null) {
    connectNative();
  }
  nativePort.postMessage(JSON.stringify(message));
  console.log("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
  console.log("Received message:", message);
  if (
    typeof message == "object" &&
    "underlying" in message &&
    "description" in message
  ) {
    update_db(message);
  }
}

function onDisconnected() {
  console.log("Failed to connect: " + chrome.runtime.lastError.message);
  nativePort = null;
}

function connectNative() {
  var hostName = "com.google.chrome.example.echo";
  console.log("Connecting to native messaging host <b>" + hostName + "</b>");
  nativePort = chrome.runtime.connectNative(hostName);
  nativePort.onMessage.addListener(onNativeMessage);
  nativePort.onDisconnect.addListener(onDisconnected);
}
