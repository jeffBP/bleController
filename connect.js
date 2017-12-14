function onButtonClick() {
    console.log("Attempting to Connect to a Bluetooth Device");
    navigator.bluetooth.requestDevice({
	filters: [{
	services: ['708a96f0-f200-4e2f-96f0-9bc43c3a31c8']
	}]})
    .then(device => {
        consolve.log('Connecting to GATT Server');
	return device.gatt.connect();

	})
    .catch(error =>{console.log(error); });
}
