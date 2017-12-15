

class Kamigami {
	constructor() {
		this.device = null;
		this.onDisconnected = this.onDisconnected.bind(this);
		this.serviceUuid = '708a96f0-f200-4e2f-96f0-9bc43c3a31c8';
		this.characteristicRead = '708a96f2-f200-4e2f-96f0-96bc43c3a31c8';
		this.characteristicWrite = '708a96f1-f200-4e2f-96f0-96bc43c3a31c8';
	}

	request() {
		let options = {
			"filters": [{
				"services": [this.serviceUuid]
			}]
		}
		return navigator.bluetooth.requestDevice(options)
		.then(device => {
			this.device = device;
			this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
		});
	}
	
	connect() {
		if(!this.device) {
			return Promise.reject('Device is not connected.');
		}
		return this.device.gatt.connect();
	}
	
	writeToRobot(data) {
		return this.device.gatt.getPrimaryService(this.serviceUuid)
		.then(service => service.getCharacteristic(this.characteristicWrite))
		.then(characteristic => characteristic.writeValue(data));
	}
	
	powerOff() {
		data = '/x01/x01';
		this.writeToRobot(data);
		
		
	}
	
	disconnect() {
		if(!this.device){
			return Promise.reject('Device is not connected.');
		}
		return this.device.gatt.disconnect();
	}
	onDisconnected() {
		console.log('Device is disconnected.');
	}
}


