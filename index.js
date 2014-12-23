var request = require('request');
var parser  = require('cheerio');
var async = require('async');
var fs = require('fs');
var host = 'https://www.kaggle.com';
var url = "https://www.kaggle.com/users?page=";
var allUrls = [];

var requestOptions = {
	url: url
};

requestOptions.headers = {
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'
};

for (var i = 0; i < 100; i++) {
	allUrls.push(url + i);
}

fs.writeFileSync('indians.txt', '');

function handleURLSuccess (response, body, callback) {
	var $ = parser.load(body);
	var users = $('.users-list li');
	users.toArray().forEach(function (li) {
		if ($(li).find('p').html().indexOf('India') > 0) {
			var lineToWrite = $(li).find('.profilelink').html() + '\t' + (host + $(li).find('.profilelink').attr('href')) + '\n';
			fs.appendFileSync('indians.txt', lineToWrite);
		}
	});
}

async.each(allUrls, function (url, asyncEachCb) {
	requestOptions.url = url;
	request(requestOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			handleURLSuccess(response, body, asyncEachCb);
		} else {
			asyncEachCb('ugh oh');
		}
	});
}, function (err) {
	console.log('done');
});

