var { Client } = require('pg');
var Tunnel = require('tunnel-ssh');

function connect() {
	return new Promise(async resolve => {
		let tunnelPort = 5432;

		Tunnel({
			//First connect to this server over ssh
			host: "onr-01.gccis.rit.edu",
			username: '*********',
			password: '********',
			//And forward the inner dstPort (on which mysql is running) to the host (where your app is running) with a random port
			dstPort: 5432,
			localPort: tunnelPort
		}, (err) => {
			if (err) throw err;
			console.log('Tunnel connected');

			let client = new Client({
				//Now that the tunnel is running, it is forwarding our above "dstPort" to localhost/tunnelPort and we connect to our mysql instance.
				host: '127.0.0.1',
				port: tunnelPort,
				user: '********',
				password: '*********',
				database: 'onr'
			});

			client.on('error', err => { throw err; });
			client.connect((err) => {
				if (err) throw err;
				console.log('Postgresql connected as id ' + client.threadId);

				resolve(client);
			});
		});
	})
}

connect()