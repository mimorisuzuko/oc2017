const rp = require('request-promise');
const detect = require('./detect-ar-marker');
const Drone = require('./drone');
const noble = require('noble');
const { uri } = require('./config');

const knownId = [];
/** @type {Drone} */
let drone = null;

noble.on('stateChange', () => {
	noble.startScanning();
	noble.on('discover', (peripheral) => {
		const { uuid, advertisement: { localName } } = peripheral;

		console.log(localName, uuid);
		knownId.push(uuid);
		if (!Drone.isDronePeripheral(peripheral) || knownId.indexOf(uuid) === -1) { return; }
		drone = new Drone({ uuid });
		drone.peripheral = peripheral;
		drone.connect(() => {
			console.log('1. connect');
			drone.connect(() => {
				console.log('2. setup');
				drone.flatTrim();
				drone.startPing();
				drone.flatTrim();
				noble.stopScanning();
				loop();
			});
		});
	});
});

/**
 * @param {Drone} drone
 * @param {string} key
 * @param {any} args
 */
const perform = (drone, key, ...args) => {
	if (drone !== null) {
		drone[key](...args);
	}
};

/**
 * @param {number} ms
 */
const delay = (ms) => new Promise((resolve) => {
	setTimeout(() => resolve(), ms);
});

const loop = () => {
	(async () => {
		const results = await detect(new Buffer(await rp(uri, { encoding: null }), 'binary'));
		const { length } = results;

		console.log('looped', results);

		for (let i = 0; i < length; i += 1) {
			const { id } = results[i];
			if (id === 806) {
				perform(drone, 'takeOff');
				await delay(3000);
				break;
			} else if (id === 901) {
				perform(drone, 'land');
				await delay(3000);
				break;
			} else if (id === 680) {
				perform(drone, 'up', { speed: 30, steps: 30 });
				await delay(3000);
				break;
			} else if (id === 415) {
				perform(drone, 'down', { speed: 30, steps: 30 });
				await delay(3000);
				break;
			} else if (id === 326) {
				perform(drone, 'turnRight', { speed: 30, steps: 30 });
				await delay(3000);
				break;
			} else if (id === 281) {
				perform(drone, 'turnLeft', { speed: 30, steps: 30 });
				await delay(3000);
				break;
			} else if (id === 176) {
				perform(drone, 'forward', { speed: 30, steps: 30 });
				await delay(3000);
				break;
			} else if (id === 87) {
				perform(drone, 'backward', { speed: 30, steps: 30 });
				await delay(3000);
				break;
			} else if (id === 1012) {
				perform(drone, 'left', { speed: 30, steps: 30 });
				await delay(3000);
				break;
			} else if (id === 781) {
				perform(drone, 'right', { speed: 30, steps: 30 });
				await delay(3000);
				break;
			} else if (id === 777) {
				perform(drone, 'frontFlip');
				await delay(3000);
				break;
			} else if (id === 1) {
				perform(drone, 'backFlip');
				await delay(3000);
				break;
			}
		}

	})().catch(console.error).then(() => setTimeout(loop, 1));
};
