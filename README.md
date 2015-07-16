MOAT js Testing Library
===

This is a [node.js](http://node.js) library enabling you to run MOAT js script files on your local machine rather than a cloud server.

## What is MOAT js?
[MOAT js](http://dev.yourinventit.com/guides/moat-iot/moat-js) is a javascript API to build a server side application interacting with remote devices.
It is a part of [MOAT IoT](http://dev.yourinventit.com/guides/moat-iot), which is a specification set of creating IoT/M2M applications running on Inventit® ServiceSync environment.

*****
The library offers you:

* to create and run the unit test cases for your MOAT js scripts without deployment

## Deploy it without any change!
You can deploy a script depending on this library to a cloud server AS IT IS.
This is because Inventit® Service-Sync runtime automatically ignores the 'require' statement.

Use [IIDN-CLI Tool](https://github.com/inventit/iidn-cli) to deploy created scripts.

## How to install

For local projects:

	your-project-root> npm install moat

For installing globally (sudo will be required when you don't use nvm):

	anywhere> npm install moat -g

Then link related packages on your project root directory like this:

	your-project-root> npm link moat nodeunit sinon

## How to use

### 1. Write the following code to get a MOAT js context object.

	var moat = require('moat');
	var context = moat.init();
	var session = context.session;
	var clientRequest = context.clientRequest;
        :
        :

### 2. Save the script file and write a test code

With [Sinon.JS](http://sinonjs.org/) and [NodeUnit](https://github.com/caolan/nodeunit), you can test your scripts like this:

	var nodeUnit = require('nodeunit');
	var sinon = require('sinon');
	var script = require('path').resolve('./script.js');
	var moat = require('moat');

	module.exports = nodeUnit.testCase({
	    setUp: function(callback) {
			// IMPORTANT
			require.cache[script] = null;
	    	callback();
	    },
	    tearDown: function(callback) {
	    	callback();
	    },
	    'test your script.' : function(assert) {
			// record state
		    var context = moat.init(sinon);
		    var arguments = {
		        apps: JSON.stringify({
		            objectNameArray: ["app-1.zip"]
		        })
		    };
		    context.setDevice('uid', 'deviceId', 'name', 'status', 'clientVersion', 0);
		    context.setDmjob('uid', 'deviceId', 'name', 'status', 'jobServiceId',
					'sessionId', arguments, 'createAt', 'activateAt', 'startAt',
					'expiredAt', 'http', 'http://localhost');
		    var session = context.session;
			session.findPackage.withArgs('app-1.zip').returns({
				get: 'http://localhost/app-1.zip',
				head: 'http://localhost/app-1.zip',
				type: 'my-type'
			});

		    var mapper = session.newModelMapperStub('MyModel');
			var model = mapper.newModelStub();
			context.addCommand(model, 'myCommand',
				context.newErrorCommandEvent('fatal_error', '12345'));

		    // Run the script (replay state)
		    require(script);

		    // Assertion
		    assert.equal(true, session.commit.called);
			assert.equal(true, mapper.add.withArgs(model).called);
			assert.equal(true, session.notifyAsync.called);
		    assert.done();
	    }
	});


### 3. Run the test code

[NodeUnit](https://github.com/caolan/nodeunit) provides you 2 ways to run your test code:

* The nodeunit command line tool
* API call inside a Node js script

Here is an example test runner code with the latter way.

#### test-suite-runner.js

	var reporter = require('nodeunit').reporters.default;
	reporter.run(['path/to/your/test/code.js']);

Simply you can type 'node *test-suite-runner.js*' so that you'll see the test results.

#### Rakefile example (not jake)

This is an example code snippet for [Rake](http://rake.rubyforge.org/) task.

You can run all tests with `rake test` when you name them with `*.test.js` suffix.

Prior to running tests, you may need to run `rake setup` to prepare related npm modules.

	require 'rake/packagetask'

	task :default => [:test]

	#
	# Setting up dependent modules
	#
	task :setup do
	  system "npm link moat nodeunit sinon"
	end

	#
	# Running NodeUnit Tests
	#
	task :test do
	  runner = ""
	  Dir.glob("*.test.js") do |f|
	    runner += "\"#{f}\","
	  end
	  if runner.empty?
	    puts "Nothing to test..."
	    next
	  else
	    runner = "var reporter = require(\"nodeunit\").reporters.default;\nreporter.run([#{runner[0..-2]}]);"
	  end
	  puts "-------------Starting the following script-------------\n#{runner}"
	  system "node -e '#{runner}'"
	end

	#
	# Packaging MOAT js files (zip) for iidn jsdeploy command
	#
	# rake clobber_package package
	#
	Rake::PackageTask.new(File.basename(Dir.pwd), '1.0') do |p|
	  p.need_zip = true
	  p.package_files.include('*.js').exclude('*.test.js')
	end

## Where can you deploy?

You can deploy the created package onto Inventit IoT Developer Network(IIDN) Sandbox Server.
Visit [IIDN site](http://dev.yourinventit.com) 

## Source Code License

All program source codes are available under the MIT style License.

The use of IIDN service requires [our term of service](http://dev.yourinventit.com/legal/term-of-service).

Copyright (c) 2013 Inventit Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Change History

1.2.3 : July 16, 2015

* Adds new function `b642text` for converting a base64 encoded string to plain text.

1.2.2 : July 15, 2015

* Fixed issues
  * [#2](https://github.com/inventit/moatjs-stub/issues/2)

1.2.1 : June 24, 2015

* Unstabbed utility functions

1.2.0 : June 5, 2013

* Adds new functions for calculating a message digest value and an hmac value to MessageSession object
* Adds new functions for converting a hex ascii string to/from Base64 string to MessageSession object


1.1.0 : February 6, 2013

* Applies the latest API set changes
* Synchronizes the project version with MOAT js API version
* `nodeunit` and `sinon` are now mandatory
* Checks if the parameter used in MessageSession.newModelMapperStub() is defined in package.json
* Checks if the current directory name is same as 'name' property in pacakge.json
* As of 1.1.0, the license is changed to the MIT style

0.1.7 : December 10, 2012

* Changes the link URLs in this file
 
0.1.6 : September 28, 2012

* Adds a new function to create an arbitrary type object into MessageSession class.
* Changes Database class interfaces (insert(), update(), queryWithFilter(), queryByUid(), remove())

0.1.5 : August 23, 2012

* Introduces a new 'Database' type. The Database type provides methods to access an underlying cloud database managed by MOAT js runtime, which can be accessed from MOAT REST API as well.
* Adds a new attribute 'database' to ClientRequest type. and a new function to create a stub Database object.
* Modifies the attribute name of ClientRequest, from 'clientAlerts' to 'objects'.
* stubClientAlert() function is removed. Now a native javascript object or stub can be put in the first argument of stubClientRequest().
* Updates MOAT-js links (July 27, 2012)

0.1.4 : July 24, 2012

* Adds how to invoke a tested script in a test case on README.md.
* Adds a new argument, 'block'(a function), to MessageSession object.
* Fixes the wrong remove* and insert* function definitions.
* Removes unused function definitions.

0.1.3 : July 17, 2012

* Adds a new function 'queryCount' to the MessageSession stubs.
* Changes the function name, from 'selectUids' to 'queryUids' in the MessageSession stubs.

0.1.2 : July 9, 2012

* Fixes an issue where stubClientAlert, stubItemData, stubDmjob, and stubDevInfo didn't return SinonJS stub instances.
* Updates the example test code, adding 'assert.equals(true, session.commit.called);' so to show how to verify if a method is executed.

0.1.1 : July 1, 2012

* Updates the git URL in the package.json.

0.1.0 : June 29, 2012

* Initial Release.
