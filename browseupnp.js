var Client = require('node-ssdp').Client;
var client = new Client();
var xml2js = require('xml2js');
var http = require('http');


client.search('urn:schemas-upnp-org:device:MediaServer:1')


client.on('response', function inResponse(headers, code, rinfo) {
    var urlraw = headers.LOCATION.replace('http://', '').split('/')[0].split(':');
    var server = {'url': 'http://'+urlraw[0], 'port': urlraw[1], 'endpoint': headers}
    addUpnpServer(server);
})

setTimeout(function() {

    client.search('urn:schemas-upnp-org:device:MediaServer:1')
}, 30000)


function addUpnpServer(server) {
    xmlToJson(server.endpoint.LOCATION, function(err, data) {
        if (err) {
            // Handle this however you like
            return console.err(err);
        }
        console.log(data.host);
        var headers = headers;
        var upnpServerName = data.device.friendlyName;
        var upnpServerUDN = data.device.udn;
        var upnpServerIcon = data.device.iconList.icon[0].url;

        var upnpServer = {'name': upnpServerName, 'UDN':upnpServerUDN, 'icon': upnpServerUDN}

        //console.log(upnpServerName)
        //console.log(upnpServerUDN)
        //console.log(upnpServerIcon)
        console.log(JSON.stringify(data, null, 2));
        //console.log(JSON.stringify(upnpServer));
    });
}






function xmlToJson(url, callback) {

    var req = http.get(url, function(res) {
        var xml = '';

        res.on('data', function(chunk) {
            xml += chunk;
        });

        res.on('error', function(e) {
            callback(e, null);
        });

        res.on('timeout', function(e) {
            callback(e, null);
        });

        res.on('end', function() {
            var parser = new xml2js.Parser();
            parser.parseString(xml, function(err, result) {
                callback(null, result);
            });
        });
    });
}