const { Detector } = require('./ar');
const detector = new Detector();
const Canvas = require('canvas');
const { Image } = Canvas;
const w = 640;
const h = 480;
const canvas = new Canvas(w, h);
const context = canvas.getContext('2d');

/**
 * @param {Buffer} arg
 * @returns {{ id: number, corners: { x: number, y: number }[] }[]}
 */
module.exports = async (arg) => {
	const image = new Image();
	image.src = arg;
	context.drawImage(image, 0, 0, w, h);

	const imageData = context.getImageData(0, 0, w, h);
	const { data } = imageData;
	const max = data.length / 4;

	for (let i = 0; i < max; i += 1) {
		const b = 0.34 * data[i * 4] + 0.5 * data[i * 4 + 1] + 0.16 * data[i * 4 + 2];
		const c = b < 80 ? 0 : 255;
		data[i * 4] = c;
		data[i * 4 + 1] = c;
		data[i * 4 + 2] = c;
	}

	context.putImageData(imageData, 0, 0);

	return detector.detect(imageData);
};
