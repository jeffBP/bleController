


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
		this.characteristicBatt = '00002a19-0000-1000-8000-00805f9b34fb';
		this.deviceInfoService = '0000180f-0000-1000-8000-00805f9b34fb';
		this.lastMsgType = null;
		this.lastMsg = null;
	}

	request() {
		/*
		Requests list of bluetooth devices
		*/
		let options = {
			"filters": [{
				"services": [this.serviceUuid]
			}],
			"optionalServices": [this.deviceInfoService]
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
		var rob = this;
		return this.device.gatt.getPrimaryService(this.serviceUuid)
		.then(service => service.getCharacteristic(this.characteristicWrite))
		.then(characteristic => characteristic.writeValue(data))
		.catch(error => function(){
			console.log(error);
			setTimeout(rob.writeToRobot(data), 100);
		});
	}
	getBattVal() {
	
		return this.device.gatt.getPrimaryService(this.deviceInfoService)
		.then(service => service.getCharacteristic(this.characteristicBatt))
		.then(characteristic => characteristic.startNotifications())
		.then(characteristic => {
  			characteristic.addEventListener('characteristicvaluechanged',
                                  this.handleBattValueChanged);
 		console.log('Notifications have been started.');
		})
		.catch(error => { console.log(error); });
	}
	
	startNotifications() {
		var self = this;
		return this.device.gatt.getPrimaryService(this.serviceUuid)
		.then(service => service.getCharacteristic(this.characteristicRead))
		.then(characteristic => characteristic.startNotifications())
		.then(characteristic => {
  			characteristic.addEventListener('characteristicvaluechanged',
                                  function() {
					var value = event.target.value;
  					console.log('Received :');
					var msgType = value.getInt8(0);
					self.parseMsg(msgType, value, self);
					
		});
 		console.log('Notifications have been started.');
		})
		.catch(error => { console.log(error); });
	
	}	
	
	parseMsg (msgType, msg, self){
		console.log(msg.getInt8(0));
		switch(msgType) {
			case 1 : self.getRGB(msg); break;
			case 2 : self.getMotor(msg); break;
			case 3 : self.getIR(msg); break;
			case 4 : self.getI2C(msg); break;
			case 5 : self.getIMU(msg); break;
			case 6 : self.getAmbLight(msg);break;
		}
		

  		
	}
	
	getRGB(value) {
		var r = value.getUint8(1);
		var g = value.getUint8(2);
		var b = value.getUint8(3);
		document.getElementById("response").innerHTML = "R: " + r + ", G: " + g + ", B: " + b;
	
	}
	
	getMotor(value) {
		var LPWM = value.getUint8(6);
		var RPWM = value.getUint8(7);	
		var driveMode = value.getUint8(5);
		document.getElementById("response").innerHTML = "L: " + LPWM + ", R: " + RPWM + ", Mode: " + driveMode;
	}
	
	getIR(value) {
		var dir = value.getUint8(1);
		var command = value.getUint16(2);
		document.getElementById("response").innerHTML = "Direction: " + dir + ", Command Val " + command;
	}	
	
	getI2C(value) {
		var addr = value.getUint8(1);
		var payload = value.slice(2, 19);
		document.getElementById("response").innerHTML = "Received I2C Command from Address " + addr;
	}
	
	getIMU(value) {
		var AX = value.getInt16(1);
		var AY = value.getInt16(3);
		var AZ = value.getInt16(5);
		var GX = value.getInt16(7);
		var GY = value.getInt16(9);
		var GZ = value.getInt16(11);
		document.getElementById("response").innerHTML = "AX: " + AX + ", AY: " + AY + ", AZ: " + AZ + ", GX: " + GX + ", GY: " + GY + ", GZ: " + GZ;
	}
	
	getAmbLight(value) {
		var ambLight = value.getUint16(1);
		document.getElementById("response").innerHTML = "Ambient Light Reading: " + ambLight;
				
	}


	handleBattValueChanged(event) {
  		var value = event.target.value;
  		document.getElementById("battLevel").innerHTML = "Battery Level: " + value.getInt8(0);
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
		return 16*arr[0] + arr[1];
		
	}
	
	sendSpeedArray(speed1, speed2) {
		/*
		Sends motor speeds to robot
		*/
		
		var sendArr = new Uint8Array(20);
		sendArr[0] = 3;
		sendArr[1] = speed1;
		sendArr[2] = speed2;
		this.writeToRobot(sendArr);
	}
	
	requestData(typeOfData) {
		var arr = new Uint8Array(20);
		arr[0] = 8;
		switch(typeOfData) {
				case 'rgb': arr[1] = 1; break;
				case 'motor': arr[1] = 2; break;
				case 'receivedIR': arr[1] = 3; break;
				case 'receivedI2C': arr[1] = 4; break;
				case 'imuTelemetry': arr[1] = 5; break;
				case 'ambientLight': arr[1] = 6; break;
				case 'storedDataVolatile': arr[1] = 7; break;
				case 'storedDataNonVolatile': arr[1] = 8; break;
				case 'imuConfig': arr[1] = 9; break;
				case 'notificationConfig': arr[1] = 10; break;
				case 'usn': arr[1] = 11; break;
				case 'packetCount': arr[1] = 12; break;
				case 'commandReceived': arr[1] = 13; break;
				case 'stabilizedDriveParam': arr[1] = 15; break;
				case 'filteredIMUVal': arr[1] = 16; break;
				}
		this.writeToRobot(arr);
	}
	
}



