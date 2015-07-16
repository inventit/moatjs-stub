/*
 * MOAT js Testing Library for Node.js
 * 
 * Copyright 2013 © Inventit Inc.
 */

var assert = require('assert'),
    crypto = require('crypto');

/**
 * MOAT.init()
 */
exports.init = function(sinonObject) {
  if (sinonObject) {
    // recorded state (stub objects)
    exports.replay = false;
    exports.state = record(sinonObject, loadPackageJson());
    return exports.state;
  } else {
    exports.replay = true;
    return replay();
  }
};

/**
 * Returns a factory object to instantiate SinonJS stub object
 *
 * @param object sinon
 * @param object packageJson
 */
function record(sinon, packageJson) {
  return (function() {
    var session = (function() {
      var stub = sinon.stub({
        setWaitingForResultNotification: function(tf) {},
        commit: function(commitState, block) {},
        notifySync: function(entity, block) {},
        notifyAsync: function(entity) {},
        fetchUrlSync: function(url, params, block) {},
        findPackage: function(objectName) {},
        setDmjobArgument: function(name, value) {}
      });
      // applicationId is NOT included in package.json.
      stub.applicationId = 'applicationId';
      stub.packageId = packageJson.name;
      stub.log = function(tag, message) {
        console.log('[' + tag + ']:' + message);
      };
      stub.digest = function(algorithm, encoding, value) {
        assert(algorithm, 'Set the algorithm, one of MD5, SHA1, or SHA256 is available.');
        assert(algorithm === 'MD5' || algorithm === 'SHA1' || algorithm === 'SHA256',
               'Set the algorithm, one of MD5, SHA1, or SHA256 is available.');
        assert(encoding, 'Set the encoding, one of hex, b64 or plain is available.');
        assert(encoding === 'hex' || encoding === 'b64' || encoding === 'plain',
               'Set the encoding, one of hex, b64 or plain is available.');
        assert(value, 'value is missing.');
        assert(typeof(value) === 'string', 'value should be string.');
        var shasum = crypto.createHash(algorithm);
        shasum.update(value);
        var digest = null;
        switch (encoding) {
          default:
        case 'hex':
          digest = shasum.digest('hex');
          break;
        case 'b64':
          digest = shasum.digest('base64');
          break;
        case 'plain':
          digest = shasum.digest('binary').toString('utf8');
          break;
        }
        return digest;
      };
      stub.hmac = function(algorithm, encoding, secret, value) {
        assert(algorithm, 'Set the algorithm, one of MD5, SHA1, or SHA256 is available.');
        assert(algorithm === 'MD5' || algorithm === 'SHA1' || algorithm === 'SHA256',
               'Set the algorithm, one of MD5, SHA1, or SHA256 is available.');
        assert(encoding, 'Set the encoding, one of hex, b64 or plain is available.');
        assert(encoding == 'hex' || encoding == 'b64' || encoding == 'plain',
               'Set the encoding, one of hex, b64 or plain is available.');
        assert(secret, 'secret is missing.');
        assert(typeof(secret) === 'string', 'secret should be string.');
        assert(value, 'value is missing');
        assert(typeof(value) === 'string', 'value should be string.');
        var shasum = crypto.createHmac(algorithm, secret);
        shasum.update(value);
        var digest = null;
        switch (encoding) {
          default:
        case 'hex':
          digest = shasum.digest('hex');
          break;
        case 'b64':
          digest = shasum.digest('base64');
          break;
        case 'plain':
          digest = shasum.digest('binary').toString('utf8');
          break;
        }
        return digest;
      };
			stub.hex2b64 = function(hex) {
        assert(hex, 'hex is missing.');
        assert(typeof(hex) === 'string', 'hex should be string.');
        var buf = new Buffer(hex, 'hex');
        return buf.toString('base64');
      };
			stub.b642hex = function(b64) {
        assert(b64, 'b64 is missing.');
        assert(typeof(b64) === 'string', 'b64 should be string.');
        var buf = new Buffer(b64, 'base64');
        return buf.toString('hex');
      };
      function text2_(target, arg1, arg2) {
        var text = null,
            encoding = 'utf8',
            format = target;
        if (arg2) {
          text = arg2;
          encoding = arg1;
        } else {
          assert(arg1, 'text is missing.');
          text = arg1;
        }
        assert(typeof(text) === 'string', 'text should be string.');
        if (format === 'b64') {
          format = 'base64';
        }
        var buf = new Buffer(text, encoding);
        return buf.toString(format);
      }
      function textFrom_(target, arg1, arg2) {
        var str = null,
            encoding = 'utf8',
            format = target;
        if (arg2) {
          str = arg2;
          encoding = arg1;
        } else {
          assert(arg1, target + ' is missing.');
          str = arg1;
        }
        assert(typeof(str) === 'string', target + ' should be string.');
        if (format === 'b64') {
          format = 'base64';
        }
        var buf = new Buffer(str, format);
        return buf.toString(encoding);
      }      
			stub.text2b64 = function(arg1, arg2) {
        return text2_('b64', arg1, arg2);
      };
      stub.b642text = function(arg1, arg2) {
        return textFrom_('b64', arg1, arg2);
      };
			stub.text2hex = function(arg1, arg2) {
        return text2_('hex', arg1, arg2);
      };
      var mapperHash = [];
      var modelArrayHash = [];
      stub.newModelMapperStub = function(type) {
        if (!packageJson.models[type]) {
          throwError(type + ' is not defined in package.json!');
        }
        var mapper = mapperHash[type];
        if (mapper) {
          return mapper;
        }
        mapper = sinon.stub({
          add: function(entity, block) {},
          update: function(entity, block) {},
          updateFields: function(entity, fields, block) {},
          remove: function(uid, block) {},
          findByUid: function(uid, block) {},
          findAllUids: function(block) {},
          count: function(block) {}
        });
        mapper.newModelStub = function() {
          var modelArray = modelArrayHash[type];
          if (exports.replay) {
            if (!modelArray || modelArray.length == 0) {
              console.log('No record for the model!, type:' + type);
              throw "No record for the model!";
            } else {
              return modelArray.shift();
            }
          } else {
            if (!modelArray) {
              modelArray = [];
              modelArrayHash[type] = modelArray;
            }
            var model = sinon.stub();
            model.__type = function() {
              return type;
            };
            modelArray.push(model);
            return model;
          }
        };
        mapperHash[type] = mapper;
        return mapper;
      };
      return stub;
    })();
    var clientRequest = {
      objects: null,
      device: null,
      dmjob: null
    };
    var database = sinon.stub({
      insert: function(entity) {},
      update: function(entity) {},
      remove: function(type, uids) {},
      query: function(type, offsetOrToken, limit) {},
      queryByUids: function(type, uids, f, r) {},
      querySharedByUids: function(type, uids, f, r) {}
    });
    var context = {
      /**
       * MessageSession stub object.
       */
      session: session,

      /**
       * Returns ClientRequest stub object.
       *
       * @return object (ClientRequest)
       */
      clientRequest: clientRequest,

      /**
       * Returns Database stub object.
       *
       * @return object (Database)
       */
      database: database,
      
      // packageJson (internal property)
      packageJson: packageJson,
      
      // For command operations
      addCommand: function(entity, name, event) {
        var type = entity.__type();
        if (!type) {
          throwError('entity must be a return value of newModelStub().');
        }
        var descriptor = packageJson.models[type];
        if (!descriptor) {
          throwError('Unknown type:' + type);
        }
        var commands = descriptor.commands;
        if (!commands || !commands[name]) {
          throwError('Command :' + name + ' is NOT defined in the type:' + type);
        }
        entity[name] = function(session, parameter, block) {
          session.commit();
          if (block && block[event.id]) {
            block[event.id].apply({}, event.args);
          }
        };
      },
      
      // clientRequest attributes manipulation
      /**
       * A setter method for Device object.
       *
       * @param Array objects
       * @return objects (Array)
       */
      setObjects: function(objects) {
        clientRequest.objects = objects;
        return objects;
      },
      
      /**
       * A setter method for Device object.
       *
       * @param String uid
       * @param String deviceId
       * @param String name
       * @param String status
       * @param String clientVerion
       * @param Number rev
       * @return object (Device)
       */
      setDevice: function(uid, deviceId, name, status, clientVersion, rev) {
        if (uid) {
          clientRequest.device = {
            uid: uid,
            deviceId: deviceId,
            name: name,
            status: status,
            clientVersion: clientVersion,
            rev: rev
          };
        } else {
          clientRequest.device = null;
        }
        return clientRequest.device;
      },

      /**
       * A setter method for Dmjob object.
       *
       * @param object uid
       * @param object deviceId
       * @param object name
       * @param object status
       * @param object jobServiceId
       * @param object sessionId
       * @param object arguments
       * @param object createdAt
       * @param object activatedAt
       * @param object startedAt
       * @param object expiredAt
       * @param object notificationType
       * @param object notificationUri
       * @return object (Dmjob)
       */
      setDmjob: function(uid, deviceId, name, status, jobServiceId, sessionId, arguments, createdAt, activatedAt, startedAt, expiredAt, notificationType, notificationUri) {
        if (uid) {
          clientRequest.dmjob = {
            uid: uid,
            deviceId: deviceId,
            name: name,
            status: status,
            jobServiceId: jobServiceId,
            sessionId: sessionId,
            arguments: arguments,
            createdAt: createdAt,
            activatedAt: activatedAt,
            startedAt: startedAt,
            expiredAt: expiredAt,
            notificationType: notificationType,
            notificationUri: notificationUri
          };
        } else {
          clientRequest.dmjob = null;
        }
        return clientRequest.dmjob;
      },

      // factory function
      /**
       * A factory method for an event object used for addCommand().
       *
       * @param Boolean async
       * @param Array array
       * @return object
       */
      newSuccessfulCommandEvent: function(async, array) {
        return {
          id: 'success',
          args: [{
            success: true,
            async: async,
            array: array
          }]
        };
      },
      /**
       * A factory method for an event object used for addCommand().
       *
       * @param String code
       * @param String type
       * @return object
       */
      newErrorCommandEvent: function(code, type) {
        return {
          id: 'error',
          args: [code, type]
        };
      },
      /**
       * A factory method for an event object used for addCommand().
       *
       * @param String eventId
       * @return object
       */
      newIntrruptCommandEvent: function(eventId) {
        return {
          id: 'interrupt',
          args: [eventId]
        };
      },
      /**
       * A factory method for QueryResult stub object.
       *
       * @param Array array
       * @param String offset
       * @param int limit
       * @return object (QueryResult)
       */
      newQueryResult: function(array, offset, limit) {
        return {
          array: array,
          offset: offset,
          limit: limit
        };
      }
    };
    return context;
  })();
};

function loadPackageJson() {
  var path = require('path');
  return require(path.resolve('./package.json'));
}

function throwError(message) {
  console.trace('[ERROR] ' + message);
  throw message;
}

/**
 * Returns the root stub object.
 * This function should be invoked after tweaking sinon stubs.
 *
 * @param object sinonContext
 */
function replay() {
  var blocks = [];
  var tokens = [];

  function prepare(token, block) {
    if (block) {
      console.log('token-->' + token + ', block == null? => ' + (block == null));
      blocks.push(block);
      tokens.push(token);
    }
    return token;
  }
  var state = exports.state;
  if (!state) {
    throw "Invalid State. Invoke init(sinon) at first!";
  }
  var stub = state.session;
  state.session = {
    applicationId: stub.applicationId,
    packageId: stub.packageId,
    setWaitingForResultNotification: function(tf) {
      return stub.setWaitingForResultNotification(tf);
    },
    notifySync: function(entity, block) {
      return stub.notifySync(entity, block);
    },
    notifyAsync: function(entity) {
      return stub.notifyAsync(entity);
    },
    fetchUrlSync: function(url, params, block) {
      return stub.fetchUrlSync(url, params, block);
    },
    commit: function(commitState, methodBlock) {
      var result = stub.commit(commitState, methodBlock);
      if (!result) {
        console.log('INFO: commit() returns undefined.');
        return null;
      }
      var interrupt = (result['event'] != null);
      for (var i = 0; i < blocks.length; i++) {
        var lb = blocks[i];
        if (lb) {
          var obj = result[tokens[i]];
          if (!obj) {
            console.log('INFO: Missing object for the token['
                        + tokens[i] + '] in result[' + JSON.stringify(result) + ']');
          }
          if (interrupt) {
            if (lb.interrupt) {
              lb.interrupt(result['event']);
              continue;
            }
          } else if (obj.errorType || obj.errorCode) {
            if (lb.error) {
              lb.error(obj.errorType, obj.errorCode);
              continue;
            }
          } else {
            if (lb.success) {
              lb.success(obj);
              continue;
            }
          }
        }
      }
      if (methodBlock) {
        if (interrupt) {
          if (methodBlock.interrupt) {
            return methodBlock.interrupt(result['event']);
          }
        } else {
          if (methodBlock.success) {
            return methodBlock.success(result);
          }
        }
      } else {
        if (interrupt) {
          console.log('INTERRUPT: event => ' + result['event']);
          throw result['event'];
        }
      }
      blocks = [];
      tokens = [];
      return result;
    },
    log: function(tag, message) {
      console.log('[' + tag + ']:' + message);
    },
    findPackage: function(objectName) {
      return stub.findPackage(objectName);
    },
    setDmjobArgument: function(name, value) {
      return stub.setDmjobArgument(name, value);
    },
    digest: function(algorithm, encoding, value) {
      return stub.digest(algorithm, encoding, value);
    },
    hmac: function(algorithm, encoding, secret, value) {
      return stub.hmac(algorithm, encoding, secret, value);
    },
    hex2b64: function(hex) {
      return stub.hex2b64(hex);
    },
    b642hex: function(b64) {
      return stub.b642hex(b64);
    },
    text2hex: function(arg1, arg2) {
      return stub.text2hex(arg1, arg2);
    },
    text2b64: function(arg1, arg2) {
      return stub.text2b64(arg1, arg2);
    },
    newModelMapperStub: function(type) {
      var mapper = stub.newModelMapperStub(type);
      return {
        add: function(entity, block) {
          return prepare(mapper.add(entity, block), block);
        },
        update: function(entity, block) {
          return prepare(mapper.update(entity, block), block);
        },
        updateFields: function(entity, fields, block) {
          return prepare(mapper.updateFields(entity, fields, block), block);
        },
        remove: function(uid, block) {
          return prepare(mapper.remove(uid, block), block);
        },
        findByUid: function(uid, block) {
          return prepare(mapper.findByUid(uid, block), block);
        },
        findAllUids: function(block) {
          return prepare(mapper.findAllUids(block), block);
        },
        count: function(block) {
          return prepare(mapper.count(block), block);
        },
        newModelStub: function() {
          return mapper.newModelStub();
        }
      };
    }
  };

  return state;
};
