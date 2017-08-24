const rp = require('request-promise');
const detect = require('./detect-ar-marker');
const { uri } = require('./config');

const loop = () => {
	(async () => {
		const results = await detect(new Buffer(await rp(uri, { encoding: null }), 'binary'));
		console.log('looped', results);
	})().catch(console.error).then(() => setTimeout(loop, 1));
};

loop();