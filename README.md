MOAT js Testing Library
===

This is a [node.js](http://node.js) library enabling you to run MOAT js script files on your local machine rather than a cloud server.

## What is MOAT js?
[MOAT js](http://inventit.edicy.co/guides/moat-iot/moat-js) is a javascript API to build a server side application interacting with remote devices such as [OMA-DM](http://en.wikipedia.org/wiki/OMA_Device_Management) based devices, ZigBee devices and/or Android devices.
It is a part of [MOAT IoT](http://inventit.edicy.co/guides/moat-iot), which is a specification set of creating IoT applications running on Inventit® Service-Sync environment.

*****
The library offers you:

* to create and run the unit test cases for your MOAT js scripts without deployment

## Deploy it without any change!
You can deploy a script depending on this library to a cloud server AS IT IS.
This is because Inventit® Service-Sync runtime automatically ignores the 'require' statement.

## How to install

<pre>
  npm install moat
</pre>

## How to use

### 1. Write the following code to get a MOAT js context object.
<pre>
  var moat = require('moat');
  var context = moat.init();
  var session = context.session;
  var clientRequest = context.clientRequest;
        :
        :
</pre>

### 2. Save the script file and write a test code

With [Sinon.JS](http://sinonjs.org/) and [NodeUnit](https://github.com/caolan/nodeunit), you can test your scripts like this:
<pre>
  var nodeUnit = require('nodeunit');
  var sinon = require('sinon');
  var yourScript = require('path/to/your/script.js');

  module.exports = nodeUnit.testCase({
    setUp: function(callback) {
      callback();
    },
    tearDown: function(callback) {
      callback();
    },
    'test your script.' : function(assert) {
      var sinonContext = moat.initSinon(sinon);
      var context = sinonContext.getStubContext();
      var arguments = {
          request: JSON.stringify({
              uid: "value1",
              param: "value2"
          })
      };
      var dmJob = sinonContext.stubDmJob(arguments);
      var session = sinonContext.stubMessageSession();
      var clientRequest = sinonContext.stubClientRequest(null, null, dmJob);

      context.session = session;
      context.clientRequest = clientRequest;

      session.queryForUid.withArgs('Entity1', 'value1').returns('token');
      session.commit.withArgs('Getting an entity.').returns({
          token: {
              collection: [{
                  uid: 'value1',
                  field1: 'field1Value'
              }]
          }
      });
      :
      snip
      :
      // Run the script
      require('/path/to/tested/script.js');

      // Assertion
      assert.equal(true, session.commit.called);
      assert.done();
    }
  });
</pre>


### 3. Run the test code

[NodeUnit](https://github.com/caolan/nodeunit) provides you 2 ways to run your test code:

* The nodeunit command line tool
* API call inside a Node js script

Here is an example test runner code with the latter way.

#### test-suite-runner.js
<pre>
  var reporter = require('nodeunit').reporters.default;
  reporter.run(['path/to/your/test/code.js']);
</pre>

Simply you can type 'node *test-suite-runner.js*' so that you'll see the test results.

## Where can you deploy?

Unfortunately, we don't provide any open environment for deployment so far.
However, we're planning to launch a small playground on a cloud so that you can try it as well as other MOAT IoT artifacts such MOAT REST and MOAT Android js.

## License

This library is dual-licensed under:

* [GNU GPL v2](http://www.gnu.org/licenses/gpl-2.0.txt)
* Commercial License

Copyright © 2012 Inventit Inc.

## Change History

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
* Fixes an issue where stubClientAlert, stubItemData, stubDmJob, and stubDevInfo didn't return SinonJS stub instances.
* Updates the example test code, adding 'assert.equals(true, session.commit.called);' so to show how to verify if a method is executed.

0.1.1 : July 1, 2012
* Updates the git URL in the package.json.

0.1.0 : June 29, 2012
* Initial Release.
