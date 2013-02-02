/*
 * MOAT js Testing Library for Node.js
 * 
 * Copyright 2013 © Inventit Inc.
 */

/**
 * MOAT.init()
 */
exports.init = function(sinonObject) {
	if (sinonObject) {
		// recorded state (stub objects)
		exports.state = record(sinonObject, loadPackageJson());
		return exports.state;
	} else {
		return replay();
	}
}

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
            stub.log = function(tag, message) {
	            console.log('[' + tag + ']:' + message);
            };
			var mapperHash = [];
			var modelHash = [];
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
					var model = modelHash[type];
					if (model) {
						return model;
					}
					model = sinon.stub();
					modelHash[type] = model;
					return model;
				};
				mapperHash[type] = mapper;
				return mapper;
			};
            return stub;
        })();
		var clientRequest = {
            objects: null,
            device: null,
            dmjob: null,
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
				entity[name] = function(session, parameter, block) {
					session.commit();
					if (block && block[event.id]) {
						block[event.id].apply({}, event.args);
					}
				}
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
             * @param object createAt
             * @param object activateAt
             * @param object startAt
             * @param object expiredAt
             * @param object notificationType
             * @param object notificationUri
             * @return object (Dmjob)
             */
            setDmjob: function(uid, deviceId, name, status, jobServiceId, sessionId, arguments, createAt, activateAt, startAt, expiredAt, notificationType, notificationUri) {
                if (uid) {
					clientRequest.dmjob = {
					    uid: uid,
		                deviceId: deviceId,
		                name: name,
		                status: status,
		                jobServiceId: jobServiceId,
		                sessionId: sessionId,
		                arguments: arguments,
		                createAt: createAt,
		                activateAt: activateAt,
		                startAt: startAt,
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
	return require(require('path').resolve('./package.json'));
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
            console.log('token-->' + token);
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
        commit: function(commitState, block) {
            var result = stub.commit(commitState, block);
            for (var i = 0; i < blocks.length; i++) {
                if (blocks[i]) {
                    blocks[i](result[tokens[i]]);
                }
            }
            if (block) {
                block(result);
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
        },
    };

    return state;
};
