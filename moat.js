/*
 * MOAT js Testing Library for Node.js
 * 
 * Copyright 2012 © Inventit Inc.
 */


/**
 * Dummy implementation of init(). Not depending on Sinon JS and nodeunit.
 */
exports.init = function() {
    var session = (function() {
        var waitForResultNotification = false;
        var result = {};
        function prepareResult(token) {
            result[token] = {
                childNodes: null,
            };
            return token;
        }
        return {
            log: function(message) {
                console.log(message);
            },
            querySingleton: function(type) {
                return prepareResult('querySingleton(' + type + ')');
            },
            queryForUid: function(type, uid) {
                return prepareResult('queryForUid(' + type + ',' + uid + ')');
            },
            query: function(type) {
                return prepareResult('query(' + type + ')');
            },
            queryUids: function(type) {
                return prepareResult('queryUids(' + type + ')');
            },
            queryCount: function(type) {
                return prepareResult('queryCount(' + type + ')');
            },
            updateSingletonField: function(type, fieldName, fieldValue) {
                return prepareResult('updateSingletonField(' + type + ',' + fieldName + ',' + fieldValue + ')');
            },
            updateField: function(type, uid, fieldName, fieldValue) {
                return prepareResult('updateField(' + type + ',' + uid + ',' + fieldName + ',' + fieldValue + ')');
            },
            updateSingleton: function(type, entity) {
                return prepareResult('updateSingleton(' + type + ',' + entity + ')');
            },
            update: function(type, uid, entity) {
                return prepareResult('update(' + type + ',' + uid + ',' + entity + ')');
            },
            insertSingleton: function(type, entity) {
                return prepareResult('insertSingleton(' + type + ',' + entity + ')');
            },
            insert: function(type, uid, entity) {
                return prepareResult('insert(' + type + ',' + uid + ',' + entity + ')');
            },
            removeSingleton: function(type, entity) {
                return prepareResult('removeSingleton(' + type + ',' + entity + ')');
            },
            remove: function(type, uid, entity) {
                return prepareResult('remove(' + type + ',' + uid + ',' + entity + ')');
            },
            runSingleton: function(type, operationName, data) {
                return prepareResult('runSingleton(' + type + ',' + operationName + ',' + data + ')');
            },
            run: function(type, operationName, data) {
                return prepareResult('run(' + type + ',' + operationName + ',' + data + ')');
            },
            setWaitingForResultNotification: function(tf) {
                waitForResultNotification = tf;
            },
            // Not a public method, just for testing.
            isWaitingForResultNotification: function() {
                return waitForResultNotification;
            },
            commit: function(commitState, methodBlock) {
                var ret = result;
                result = {};
                return ret;
            },
            notifySync: function(entity, methodBlock) {
                if (typeof(entity) != 'object') {
                    throw 'The value must be an object.';
                }
                return {};
            },
            notifyAsync: function(entity) {
                if (typeof(entity) != 'object') {
                    throw 'The value must be an object.';
                }
                return {};
            },
            fetchUrlSync: function(url, params, methodBlock) {
                if (url.indexof('http:') == 0 || url.indexof('https:') == 0) {
                    return {};
                } else {
                    throw "Unsupported protocol scheme. URL=" + url;
                }
            },
        }
    } ());
    var now = new Date().toUTCString();
    return {
        session: session,
        clientRequest: {
            clientAlerts: null,
            devInfo: {
                deviceId: 'deviceId',
                manufacturer: 'manufacturer',
                model: 'model',
                dmVersion: 'dmVersion',
                language: 'language',
            },
            dmJob: {
                uid: 'uid',
                activateTimestamp: now,
                createTimestamp: now,
                expiredTimestamp: now,
                startTimestamp: now,
                deviceId: 'deviceId',
                notificationType: 'notificationType',
                notificationUri: 'notificationUri',
                postedBy: 'postedBy',
                pushAddress: 'pushAddress',
                pushAddressType: 'pushAddressType',
                pushType: 'pushType',
                regionCode: 'regionCode',
                serviceId: 'serviceId',
                sessionId: 0xfff,
                status: 'status',
                arguments: null
            }
        }
    };
};

/**
 * Creates a factory instance to instantiate stub objects with Sinon.JS.
 *
 * You need to install Sinon.JS to use this function.
 * 
 * @param object sinonObject
 */
exports.initSinon = function(sinonObject) {
    return (function() {
        var sinon = sinonObject;
        var stubContext = {
            session: null,
            clientRequest: null,
        };
        var context = {
            /**
             * Not a factory method.
             */
            getStubContext: function() {
                return stubContext;
            },

            /**
             * A factory method for MessageSession stub object.
             */
            stubMessageSession: function() {
                var stub = sinon.stub({
                    querySingleton: function(type) {
                        },
                    queryForUid: function(type, uid) {
                        },
                    query: function(type) {
                        },
                    queryUids: function(type) {
                        },
                    queryCount: function(type) {
                        },
                    updateSingletonField: function(type, fieldName, fieldValue) {
                        },
                    updateField: function(type, uid, fieldName, fieldValue) {
                        },
                    updateSingleton: function(type, entity) {
                        },
                    update: function(type, uid, entity) {
                        },
                    insertSingleton: function(type, entity) {
                        },
                    insert: function(type, uid, entity) {
                        },
                    removeSingleton: function(type, entity) {
                        },
                    remove: function(type, uid, entity) {
                        },
                    runSingleton: function(type, operationName, data) {
                        },
                    run: function(type, operationName, data) {
                        },
                    setWaitingForResultNotification: function(tf) {
                        },
                    commit: function(commitState, methodBlock) {
                        },
                    notifySync: function(entity, methodBlock) {
                        },
                    notifyAsync: function(entity) {
                        },
                    fetchUrlSync: function(url, params, methodBlock) {
                        },
                });

                // 'log' is not a stub method.
                stub.log = function(message) {
                    console.log(message);
                };

                return stub;
            },

            /**
             * A factory method for ClientRequest stub object.
             * 
             * @param Array clientAlerts
             * @param object:stubDevInfo() devInfo
             * @param object:stubDmJob() dmJob
             * @return object (ClientRequest)
             */
            stubClientRequest: function(clientAlerts, devInfo, dmJob) {
                return {
                    // An Association Array
                    clientAlerts: clientAlerts,
                    devInfo: devInfo,
                    dmJob: dmJob,
                };
            },

            /**
             * A factory method for DevInfo stub object.
             *
             * @param String deviceId
             * @param String manufacturer
             * @param String model
             * @param String dmVersion
             * @param String language
             * @return object (DevInfo)
             */
            stubDevInfo: function(deviceId, manufacturer, model, dmVersion, language) {
                return sinon.stub({
                    deviceId: deviceId,
                    manufacturer: manufacturer,
                    model: model,
                    dmVersion: dmVersion,
                    language: language,
                });
            },

            /**
             * A factory method for DmJob stub object.
             *
             * @param object arguments
             * @return object (DmJob)
             */
            stubDmJob: function(arguments) {
                return sinon.stub({
                    uid: null,
                    activateTimestamp: null,
                    createTimestamp: null,
                    expiredTimestamp: null,
                    startTimestamp: null,
                    deviceId: null,
                    notificationType: null,
                    notificationUri: null,
                    postedBy: null,
                    pushAddress: null,
                    pushAddressType: null,
                    pushType: null,
                    regionCode: null,
                    serviceId: null,
                    sessionId: null,
                    status: null,
                    arguments: arguments
                });
            },

            /**
             * A factory method for ClientAlert stub object.
             *
             * @param String data
             * @return object (ClientAlert)
             */
            stubClientAlert: function(data) {
                var stub = sinon.stub({
                    isGenericAlert: function() {},
                });
                stub.data = data;
                return stub;
            },

            /**
             * A factory method for ItemData stub object.
             *
             * @param String status
             * @return object (ItemData)
             */
            stubItemData: function(status) {
                return sinon.stub({
                    status: status,
                });
            }
        };
        // Overwrite the default init() method.
        exports.init = function() {
            return stubContext;
        };
        return context;
    })();
};