const Drone = require('rolling-spider');

Drone.prototype.connect = function (callback) {
	this.connectPeripheral(this.peripheral, () => {
		this.connected = true;
		this.setup(callback);
	});
};

Drone.prototype.connectPeripheral = function (peripheral, onConnected) {
	this.discovered = true;
	this.uuid = peripheral.uuid;
	this.name = peripheral.advertisement.localName;
	this.peripheral.connect(onConnected);
	this.peripheral.on('disconnect', () => {
		this.onDisconnect();
	});
};

Drone.prototype.setup = function (callback) {
	this.peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
		if (error) {
			if (typeof callback === 'function') {
				callback(error);
			}
		} else {
			this.services = services;
			this.characteristics = characteristics;
			this.handshake(callback);
		}
	});
};

module.exports = Drone;