#!/usr/bin/env node

// USE:
// node bin/mutalayer.js CutAndSlice_sample.psd --layer

var argv = require('yargs')
  .option('layer', { alias: 'l', type: 'boolean' })
  .argv
var PSD = require('psd');
var fs = require('fs');
var exec = require('child_process').exec;
var util = require('util');
var assign = util._extend;


if (!module.parent) {
  if (argv._.length === 0 || argv.help || argv.h) {
    console.log("Usage:")
    console.log("  mutalayer FILENAME.psd [--layer]")
    process.exit(0)
  }

  run(argv._)
}


function run(files) {
  if (!argv.layer) {
    console.error('option missing; see --help')
    process.exit(1)
  }

  files.forEach(function (file) {
    require('psd').open(file)
    .then(function (psd) {

  		var file = process.argv[2] || psd;
			var start = new Date();
      var type, layerNames = [];

			PSD.open(file).then(function (psd) {
				
			  psd.tree().descendants().forEach(function (node) {
			  	if (node.isGroup()) return true;
			    type = node.name;
			    layerNames = layerNames.concat(type) + " { }\n";
			  });

			}).then(function () {

        fs.writeFile("master.scss", layerNames, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file master.scss was saved!");
        });

			  console.log("Finished in " + ((new Date()) - start) + "ms");
			}).catch(function (err) {
			  console.log(err.stack);
			});

  	});
  });

/*
  files.forEach(function (file) {
    require('psd').open(file)
    .then(function (psd) {
      return psd.tree().export()
    })
    .then(function (data) {

      var obj = {}
      if (argv.layer) assign(obj, getLayers(data))
      return obj
    })
    .then(function (data) {
      log(data, file)
    })
    .catch(function (err) {
      console.error(err.message)
      process.exit(1)
    })
  });
*/

}


/*
 * export
 */

exports.run = run;