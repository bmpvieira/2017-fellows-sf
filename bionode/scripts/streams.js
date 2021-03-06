// npm install mississippi split2 JSONstream request through2

var os = require('os')
var url = require('url')
var miss = require('mississippi')
var split = require('split2')
var JSONstream = require('JSONstream')
var request = require('request')
var through = require('through2')


var urlObject = {
  protocol: 'http',
  host: 'www.ebi.ac.uk',
  pathname: '/eva/webservices/rest/v1/meta/studies/list',
  search: '?species=hsapiens_grch37'
}

var urlString = url.format(urlObject)

var filterStream = through.obj(filter)

function filter(object, encoding, callback) {
  var self = this
  var results = object.response[0].result
  results.forEach(filterAndPush)
  function filterAndPush(result) {
    if (result.studyName.match('1000 Genomes')) {
      self.push(JSON.stringify(result) + os.EOL)
    }
  }
  callback()
}

request(urlString)
.pipe(split())
.pipe(JSONstream.parse())
.pipe(filterStream)
.pipe(process.stdout)
