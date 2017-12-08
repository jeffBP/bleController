function onButtonClick() {
    console.log("Attempting to Connect to a Bluetooth Device");
    navigator.bluetooth.requestDevice(
	{filters: [{services:['battery_service']}]})
    .then(device => {
        consolve.log('Connecting to GATT Server');
	return device.gatt.connect();
})
}
