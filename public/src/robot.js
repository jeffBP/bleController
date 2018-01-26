

class Kamigami {
	constructor() {
		/*
		Kamigami robot object. Allows for sending and receiving data from kamigami robot.
		*/
		this.device = null;
		this.onDisconnected = this.onDisconnected.bind(this);
		this.serviceUuid = '708a96f0-f200-4e2f-96f0-9bc43c3a31c8';
		this.characteristicRead = '708a96f2-f200-4e2f-96f0-9bc43c3a31c8';
		this.characteristicWrite = '708a96f1-f200-4e2f-96f0-9bc43c3a31c8';
	}

	request() {
		/*
		Requests list of bluetooth devices
		*/
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
		/*
		Connects to device selected from bluetooth drop down
		*/
		if(!this.device) {
			return Promise.reject('Device is not connected.');
		}
		return this.device.gatt.connect();
	}
	
	writeToRobot(data) {
		/*
		Writes data to robot
		args:
		data: Byte Array (Uint8Array)
		*/
		return this.device.gatt.getPrimaryService(this.serviceUuid)
		.then(service => service.getCharacteristic(this.characteristicWrite))
		.then(characteristic => characteristic.writeValue(data));
	}
	
	powerOff() {
		/*
		Sends byte array to power off robot
		*/
		data = '/x01/x01';
		this.writeToRobot(data);
		
		
	}
	
	disconnect() {
		/*
		Disconnects from bluetooth device
		*/
		if(!this.device){
			return Promise.reject('Device is not connected.');
		}
		return this.device.gatt.disconnect();
	}

	onDisconnected() {
		/*
		Code executes when robot is disconnected
		*/
		console.log('Device is disconnected.');
	}

	getColorArray(str) {
		/*
		Converts Hex string to rgb values
		args:
		str, color Hex string
		returns:
		sendArr, Byte array with rgb values prepared
		*/
		var r = str.substr(1, 2);
		var g = str.substr(3, 4);
		var b = str.substr(5, 6);
	
		var redVal = this.packVal(r);
		var greVal = this.packVal(g);
		var bluVal = this.packVal(b);
		
		var sendArr = new Uint8Array(20);
		sendArr[0] = 2;
		sendArr[1] = redVal;
		sendArr[2] = greVal;
		sendArr[3] = bluVal;
	
		return sendArr;
	}

	packVal(str) {
		/*
		Packs hex byte string into value 0-255
		*/
		var arr = new Uint8Array(2);
	
		for(var i = 0; i < str.length; i++) {
			switch(str.charAt(i)) {
				case '0': arr[i] = 0; break;
				case '1': arr[i] = 1; break;
				case '2': arr[i] = 2; break;
				case '3': arr[i] = 3; break;
				case '4': arr[i] = 4; break;
				case '5': arr[i] = 5; break;
				case '6': arr[i] = 6; break;
				case '7': arr[i] = 7; break;
				case '8': arr[i] = 8; break;
				case '9': arr[i] = 9; break;
				case 'a': arr[i] = 10; break;
				case 'b': arr[i] = 11; break;
				case 'c': arr[i] = 12; break;
				case 'd': arr[i] = 13; break;
				case 'e': arr[i] = 14; break;
				case 'f': arr[i] = 15; break;
			}
		}
		return 15*arr[0] + arr[1];
		
	}
	
	getSpeedArray(speed1, speed2) {
		/*
		Sends motor speeds to robot
		*/
		
		var sendArr = new Uint8Array(20);
		sendArr[0] = 3;
		sendArr[1] = speed1;
		sendArr[2] = speed2;
	}
	
}



