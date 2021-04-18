document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    applyDeviceData();
    checkConnection();

    navigator.geolocation.watchPosition(geolocationSuccess,geolocationError);
    window.addEventListener("batterystatus", onBatteryStatus, false);
    
    $("#camera-btn").click(getPicutre);
    $("#addPicture").click(sendPictureRequest);
}

function applyDeviceData() {
    $("#cordovaVersion").text(device.cordova);
    $("#manufacturer").text(device.manufacturer);
    $("#isVirtual").text(device.isVirtual);
    $("#deviceModel").text(device.model);

    $("#operatingSystem").text(device.platform);
    $("#osVersion").text(device.version);
    $("#uuid").text(device.uuid);
    $("#serial").text(device.serial);
}

function onBatteryStatus(status) {
    $("#batteryStatus").text(status.level);
    $("#isPlugged").text(status.isPlugged);
}

function checkConnection() {
    var networkState = navigator.connection.type;
    
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';
    
    $("#connectionType").text(states[networkState]);
}

function geolocationSuccess(position) {
    $('#latitude-value').text(position.coords.latitude);
    $('#longitude-value').text(position.coords.longitude);
    $('#altitude-value').text(position.coords.altitude);
    $('#accuracy-value').text(position.coords.accuracy);
    $('#altitudeAccuracy-value').text(position.coords.altitudeAccuracy);
}

function geolocationError(error) {
    alert(error);    
}

//Picture

function getPicutre() {
    navigator.camera.getPicture(succeededCameraCallback, failedCameraCallback, {
        quality: 25,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function succeededCameraCallback(imageData) {
    $('#myImage').attr('src', 'data:image/jpeg;base64,' + imageData);
    $('#myImage').css('display', 'block');
    $('#myImage').show();
}

function failedCameraCallback(message) {
    alert(message);
}

function sendPictureRequest() {
    $.mobile.loading("show");

    let base64Img = $("#myImage").attr('src');
    let userName = $('#username').val();
    let password = $('#password').val();

    let requestData = {
        UserName: userName,
        Password: password,
        Picture: base64Img
    };

    console.log({ requestData });

    $.ajax({
        type: "PUT",
        url: baseSurviceUrl + "picture",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(requestData),
        success: function() {
            $.mobile.loading("hide");
            alert("Successfully added!");
            loadDetailsPage();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $.mobile.loading("hide");
            loadDetailsPage();
        }
    });
}

function loadHomePage() {
    const homePage = $("#page1");
    $.mobile.pageContainer.pagecontainer("change", homePage, {});
}