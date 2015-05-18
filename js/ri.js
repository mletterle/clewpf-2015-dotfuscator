/*!
 * Copyright 2014 PreEmptive Solutions LLC.
 * You may not use this file except in compliance with the PreEmptive Solutions API License.
 * You may obtain a copy of the License at http://www.preemptive.com/eula 
 * or by downloading the package from the downloads page at https://www.preemptive.com/my-account/downloads.
 * This software is distributed on an "AS IS" basis.
 */
(function() {
var util = {
	extend: function( dest, src0, src1, etc ) {
		for ( var i = 1, il = arguments.length; i < il; i++ ) {
			for ( var prop in arguments[i] ) {
				dest[ prop ] = arguments[i][prop];
			}
		}

		return dest;
	},

	empty: function( obj ) {
		for ( var p in obj ) {
			return false;
		}
		return true;
	},

	isFunction: function( obj ) {
		return ({}).toString.call( obj ) === "[object Function]";
	},

	unique: function( ary ) {
		var tmp = [];
		for ( var i = 0, il = ary.length; i < il; i++ ) {
			for ( var j = i + 1; j < il; j++ ) {
				if ( ary[i] === ary[j] ) {
					j = ++i;
				}
			}
			tmp.push( ary[i] );
		}
		return tmp;
	}
};

//Copyright (c) 2010 Robert Kieffer
//Dual licensed under the MIT and GPL licenses.
(function() {
/*
* Generate a RFC4122(v4) UUID
*
* Documentation at https://github.com/broofa/node-uuid
*/

// Use node.js Buffer class if available, otherwise use the Array class
var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

// Buffer used for generating string uuids
var _buf = new BufferClass(16);

// Cache number <-> hex string for octet values
var toString = [];
var toNumber = {};
for (var i = 0; i < 256; i++) {
  toString[i] = (i + 0x100).toString(16).substr(1);
  toNumber[toString[i]] = i;
}

function parse(s) {
  var buf = new BufferClass(16);
  var i = 0;
  s.toLowerCase().replace(/[0-9a-f][0-9a-f]/g, function(octet) {
    buf[i++] = toNumber[octet];
  });
  return buf;
}

function unparse(buf) {
  var tos = toString, b = buf;
  return (tos[b[0]] + tos[b[1]] + tos[b[2]] + tos[b[3]] + '-' +
         tos[b[4]] + tos[b[5]] + '-' +
         tos[b[6]] + tos[b[7]] + '-' +
         tos[b[8]] + tos[b[9]] + '-' +
         tos[b[10]] + tos[b[11]] + tos[b[12]] +
         tos[b[13]] + tos[b[14]] + tos[b[15]]).toUpperCase();
		 // Added toUpperCase() jdsharp
}

var b32 = 0x100000000, ff = 0xff;
function uuid(fmt, buf, offset) {
  var b = fmt != 'binary' ? _buf : (buf ? buf : new BufferClass(16));
  var i = buf && offset || 0;

  var r = Math.random()*b32;
  b[i++] = r & ff;
  b[i++] = r>>>8 & ff;
  b[i++] = r>>>16 & ff;
  b[i++] = r>>>24 & ff;
  r = Math.random()*b32;
  b[i++] = r & ff;
  b[i++] = r>>>8 & ff;
  b[i++] = r>>>16 & 0x0f | 0x40; // See RFC4122 sect. 4.1.3
  b[i++] = r>>>24 & ff;
  r = Math.random()*b32;
  b[i++] = r & 0x3f | 0x80; // See RFC4122 sect. 4.4
  b[i++] = r>>>8 & ff;
  b[i++] = r>>>16 & ff;
  b[i++] = r>>>24 & ff;
  r = Math.random()*b32;
  b[i++] = r & ff;
  b[i++] = r>>>8 & ff;
  b[i++] = r>>>16 & ff;
  b[i++] = r>>>24 & ff;

  return fmt === undefined ? unparse(b) : b;
};

uuid.parse = parse;
uuid.unparse = unparse;
uuid.BufferClass = BufferClass;

// modified to attach to util
util.uuid = uuid;
})();
/*
    http://www.JSON.org/json2.js
    2011-02-23
    
	---
    Modified by Jonathan Sharp to attach JSON.stringify to util.encodeJSON. Closed scope so JSON
    detection is specific to this closure (won't leak JSON library to global scope.
*/
(function () {
	// Moved these declarations inside of the closure to close the scope
	var JSON;
	if (!JSON) {
	    JSON = {};
	}
	
    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }
    
    // modified to attach to util
    util.encodeJSON = JSON.stringify;
})();
(function() {

// Domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Øyvind Sean Kinsey http://kinsey.no/blog (2010)
//
// Information and discussions
// http://jspoker.pokersource.info/skin/test-printstacktrace.html
// http://eriwen.com/javascript/js-stack-trace/
// http://eriwen.com/javascript/stacktrace-update/
// http://pastie.org/253058
//
// guessFunctionNameFromLines comes from firebug
//
// Software License Agreement (BSD License)
//
// Copyright (c) 2007, Parakey Inc.
// All rights reserved.
//
// Redistribution and use of this software in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above
//   copyright notice, this list of conditions and the
//   following disclaimer.
//
// * Redistributions in binary form must reproduce the above
//   copyright notice, this list of conditions and the
//   following disclaimer in the documentation and/or other
//   materials provided with the distribution.
//
// * Neither the name of Parakey Inc. nor the names of its
//   contributors may be used to endorse or promote products
//   derived from this software without specific prior
//   written permission of Parakey Inc.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
// IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
// IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
// OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/**
 * Main function giving a function stack trace with a forced or passed in Error 
 *
 * @cfg {Error} e The error to create a stacktrace from (optional)
 * @return {Array} of Strings with functions, lines, files, and arguments where possible 
 */
function printStackTrace(options) {
    var ex = (options && options.e) ? options.e : null;
    
    var p = new printStackTrace.implementation();
    return p.run(ex);
}

printStackTrace.implementation = function() {};

printStackTrace.implementation.prototype = {
    run: function(ex) {
        ex = ex ||
            (function() {
                try {
                    var _err = __undef__ << 1;
                } catch (e) {
                    return e;
                }
            })();
        // Use either the stored mode, or resolve it
        var mode = this._mode || this.mode(ex);
        if (mode === 'other') {
            return this.other(arguments.callee);
        } else {
            return this[mode](ex);
        }
    },

    /**
     * @return {String} mode of operation for the environment in question.
     */
    mode: function(e) {
        if (e['arguments']) {
            return (this._mode = 'chrome');
        } else if (window.opera && e.stacktrace) {
            return (this._mode = 'opera10');
        } else if (e.stack) {
            return (this._mode = 'firefox');
        } else if (window.opera && !('stacktrace' in e)) { //Opera 9-
            return (this._mode = 'opera');
        }
        return (this._mode = 'other');
    },

    /**
     * Given an Error object, return a formatted Array based on Chrome's stack string.
     * 
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    chrome: function(e) {
        return e.stack.replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@').split('\n');
    },

    /**
     * Given an Error object, return a formatted Array based on Firefox's stack string.
     * 
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    firefox: function(e) {
        return e.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n');
    },

    /**
     * Given an Error object, return a formatted Array based on Opera 10's stacktrace string.
     * 
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    opera10: function(e) {
        var stack = e.stacktrace;
        var lines = stack.split('\n'), ANON = '{anonymous}',
            lineRE = /.*line (\d+), column (\d+) in ((<anonymous function\:?\s*(\S+))|([^\(]+)\([^\)]*\))(?: in )?(.*)\s*$/i, i, j, len;
        for (i = 2, j = 0, len = lines.length; i < len - 2; i++) {
            if (lineRE.test(lines[i])) {
                var location = RegExp.$6 + ':' + RegExp.$1 + ':' + RegExp.$2;
                var fnName = RegExp.$3;
                fnName = fnName.replace(/<anonymous function\:?\s?(\S+)?>/g, ANON);
                lines[j++] = fnName + '@' + location;
            }
        }
        
        lines.splice(j, lines.length - j);
        return lines;
    },

    // Opera 7.x-9.x only!
    opera: function(e) {
        var lines = e.message.split('\n'), ANON = '{anonymous}', 
            lineRE = /Line\s+(\d+).*script\s+(http\S+)(?:.*in\s+function\s+(\S+))?/i, 
            i, j, len;
        
        for (i = 4, j = 0, len = lines.length; i < len; i += 2) {
            //TODO: RegExp.exec() would probably be cleaner here
            if (lineRE.test(lines[i])) {
                lines[j++] = (RegExp.$3 ? RegExp.$3 + '()@' + RegExp.$2 + RegExp.$1 : ANON + '()@' + RegExp.$2 + ':' + RegExp.$1) + ' -- ' + lines[i + 1].replace(/^\s+/, '');
            }
        }
        
        lines.splice(j, lines.length - j);
        return lines;
    },

    // Safari, IE, and others
    other: function(curr) {
        var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i,
            stack = [], j = 0, fn, args;
        
        var maxStackSize = 10;
        while (curr && stack.length < maxStackSize) {
            fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
            
            cargs = curr['arguments'];
            if (cargs != null) {
                args = Array.prototype.slice.call(cargs);
                stack[j] = fn + '(' + this.stringifyArguments(args) + ')';
            }
            else {                    
                stack[j] = fn + '()';
            }                               
			j++;
            curr = curr.caller;
        }
        return stack;
    },

    /**
     * Given arguments array as a String, subsituting type names for non-string types.
     *
     * @param {Arguments} object
     * @return {Array} of Strings with stringified arguments
     */
    stringifyArguments: function(args) {
        for (var i = 0; i < args.length; ++i) {
            var arg = args[i];
            if (arg === undefined) {
                args[i] = 'undefined';
            } else if (arg === null) {
                args[i] = 'null';
            } else if (arg.constructor) {
                if (arg.constructor === Array) {
                    if (arg.length < 3) {
                        args[i] = '[' + this.stringifyArguments(arg) + ']';
                    } else {
                        args[i] = '[' + this.stringifyArguments(Array.prototype.slice.call(arg, 0, 1)) + '...' + this.stringifyArguments(Array.prototype.slice.call(arg, -1)) + ']';
                    }
                } else if (arg.constructor === Object) {
                    args[i] = '#object';
                } else if (arg.constructor === Function) {
                    args[i] = '#function';
                } else if (arg.constructor === String) {
                    args[i] = '"' + arg + '"';
                }
            }
        }
        return args.join(',');
    }
};

util.stackTrace = printStackTrace;
})();
var rsendDisabled = /^.*\RI_sendDisabled=([^;]+).*$/;
var app = {
	started: false,
	disabled: false,
	plugins: {},
	settings: {},
	envelope: {},	
	endPoint: "https://so-s.info/endpoint",
	
	// Timeout in ms for endpoint
	timeout: 10000,

	apiVersion: "1.1.0",

	start: function( settings, properties ) {
	
		if ( !settings.sessionId ) {			
			uuid = util.uuid();
		}
		else {
			uuid = settings.sessionId;	
		}
	
		if ( this.started ) {
			this.logError( "The application has already been started." );
			return false;
		}
		if ( !settings.companyId ) {
			this.logError( "Cannot start the application without a company ID." );
			return false;
		}
		if ( !settings.appId ) {
			this.logError( "Cannot start the application without an application ID." );
			return false;
		}
		if ( !settings.appName ) {
			this.logError( "Cannot start the application without an application name." );
			return false;
		}
		if ( !settings.appVersion ) {
			this.logError( "Cannot start the application without an application version." );
			return false;
		}

		this.started = true;

		// Set our default settings
		settings = this.settings = util.extend({
			messageGroup: uuid,
			tzOffset: -(new Date).getTimezoneOffset()
		}, settings );

		this.plugins = util.extend({}, RI.plugins);

		this.envelope = {
			apiVer: this.apiVersion,
			app: { 
				id: settings.appId,
				name: settings.appName,
				version: settings.appVersion
			},
			companyId: settings.companyId,
			companyName: settings.companyName,
			instanceId: settings.instanceId,
			messageGroup: settings.messageGroup,
			tzOffset: settings.tzOffset
		};

		if ( util.isFunction( this.envelope.instanceId ) ) {
			this.envelope.instanceId = settings.instanceId();
		}

		if ( !this.envelope.instanceId ) {
			delete this.envelope.instanceId;
		}

		if ( settings.endPoint ) {
			this.endPoint = settings.endPoint;
		}

		// First, check if the user has Do Not Track enabled.
		// http://ie.microsoft.com/testdrive/browser/donottrack/default.html
		if ( navigator.doNotTrack == "1" || navigator.msDoNotTrack == "1" ) {
			this.disabled = true;
		}
		try {
			if ( window.external.InPrivateFilteringEnabled() || window.external.msTrackingProtectionEnabled()) {
				this.disabled = true;
			}
		} catch ( e ) {
			// we can't detect if window.external.InPrivateFilteringEnabled exists
			// IE will throw an error
		}

		// Next, check if a cookie is set.
		if ( rsendDisabled.test( document.cookie ) ) {
			this.disabled = document.cookie.replace( rsendDisabled, "$1" ) === "1";
		}

		// Finally, check for the optIn setting.
		if ( "optIn" in settings ) {
			if ( typeof settings.optIn === "boolean") {
				this.disabled = !settings.optIn;
			} else if ( util.isFunction( settings.optIn ) ) {
				this.disabled = !settings.optIn();
			}
		}

		if ( !settings.sessionId ) {		
			this.message({
				type: "app-start",
				properties: properties
			});
			this.sessionStart();
		}
		
		// execute any loaded plugins with start actions
		for ( var plugin in this.plugins ) {
			if ( plugin != null && util.isFunction( plugin.start ) ) {
				plugin.start();
			}
		}
		
		return settings.messageGroup;
	},

	stop: function( properties ) {
		if ( !this.started ) {
			this.logError( "Cannot stop the application because it has not been started." );
			return false;
		}

		// execute any loaded plugins with stop actions
		for ( var plugin in this.plugins ) {
			if ( plugin != null && util.isFunction( plugin.stop ) ) {
				plugin.stop();
			}
		}

		this.sessionStop();

		this.message({
			type: "app-stop",
			properties: properties
		});
		this.started = false;
	},

	sessionStart: function() {
		this.message({
			type: "session-start"
		});
	},

	sessionStop: function() {
		this.message({
			type: "session-stop"
		});
	},

	message: function( message ) {
		if ( this.disabled ) {
			return;
		}

		util.extend( message, {
			generated: +new Date,
			id: message.id || util.uuid(),
			properties: this.cleanProperties( message.properties )
		});

		if ( !message.properties || util.empty( message.properties ) ) {
			delete message.properties;
		}

		this.queue( message );
	},

	// clones the data to leave the original object untouched
	cleanProperties: function( original ) {
		var origKey, key, value,
			cleaned = {};

		for ( origKey in original ) {
			// truncate keys to 2,000 characters
			key = origKey.substring( 0, 2000 );

			value = original[ origKey ];

			// ignore null/undefined
			if ( value == null ) {
				continue;
			}

			// normalize values
			// execute functions
			if ( util.isFunction( value ) ) {
				value = value();
			// object with s property
			} else if ( value && value.s ) {
				value = value.s;
			// object with n property
			} else if ( value && value.n ) {
				if ( typeof value.n !== "number" ) {
					continue;
				}
				value = value.n;
			} 

			// all non-numeric values are converted to strings (including strings)
			// and truncated to 4000 characters
			if ( typeof value !== "number" ) {
				value = String( value ).substring( 0, 4000 );
			}

			// ignore empty values
			if ( value === "" ) {
				continue;
			}

			cleaned[ key ] = value;
		}

		return cleaned;
	},

	log: window.console && console.log ?
		function( message ) {
			console.log( "RI: " + message );
		} :
		function() {},

	logError: window.console && console.error ?
		function( message ) {
			console.error( "RI: " + message );
		} :
		function() {}
};
var Queue = {
	messages: [],

	add: function( message ) {
		this.messages.push( message );
		this.flush();
	},

	flush: function() {
		this.send( util.extend({
			messages: this.messages,
			generated: +new Date,
			id: util.uuid()
		}, app.envelope ) );
		this.messages = [];
	},

	send: function( data ) {
		if (typeof WinJS != 'undefined') {
			var httpHeaders = {"Content-Type": "application/x-www-form-urlencoded"};
			WinJS.xhr({
				type: "POST",
				url: app.endPoint,
				headers: httpHeaders,
				data: "data=" + encodeURIComponent(util.encodeJSON(data))
			}).done();
		}
		else {
			var frame = document.documentElement.appendChild( document.createElement( "iframe" ) ),
				doc = frame.contentWindow.document;
			doc.write( "<body></body>" );
			var form = doc.body.appendChild( doc.createElement( "form" ) ),
				input = form.appendChild( doc.createElement( "textarea" ) );

			if ( !window.RI_DEBUG ) {
				frame.style.display = "none";
			} else {
				input.style.width = "100%";
				input.style.height = "500px";
				frame.style.width = "800px";
				frame.style.height = "600px";
			}

			form.method = "POST";
			form.action = app.endPoint;

			input.name = "data";
			input.value = util.encodeJSON( data );

			form.submit();
			if ( !window.RI_DEBUG ) {
				setTimeout(function() {
					document.documentElement.removeChild( frame );
				}, app.timeout || 10000 );
			}
		}
	}
};

app.queue = function( message ) {
	Queue.add( message );
};
var Feature = {
	groups: {},

	groupStart: function( feature ) {
		var uuid = util.uuid();

		if ( !this.groups[ feature ] ) {
			this.groups[ feature ] = [];
		}

		this.groups[ feature ].push( uuid );
		return uuid;
	},

	groupStop: function( feature ) {
		return (this.groups[ feature ] || []).pop();
	}
};

util.extend( app, {
	featureTick: function( feature, properties ) {
		if ( typeof feature !== "string" || !feature.length ) {
			this.logError( "Cannot send a feature tick because no feature was specified." );
			return false;
		}
		if ( !this.started ) {
			this.logError( "Cannot send a feature tick because the application has not been started." );
			return false;
		}

		this.message({
			type: "feature-tick",
			name: feature,
			properties: properties
		});
	},

	featureStart: function( feature, properties ) {
		if ( typeof feature !== "string" || !feature.length ) {
			this.logError( "Cannot send a feature start because no feature was specified." );
			return false;
		}
		if ( !this.started ) {
			this.logError( "Cannot send a feature start because the application has not been started." );
			return false;
		}

		this.message({
			id: Feature.groupStart( feature ),
			type: "feature-start",
			name: feature,
			properties: properties
		});
	},

	featureStop: function( feature, properties ) {
		if ( typeof feature !== "string" || !feature.length ) {
			this.logError( "Cannot send a feature stop because no feature was specified." );
			return false;
		}
		if ( !this.started ) {
			this.logError( "Cannot send a feature stop because the application has not been started." );
			return false;
		}

		var featureGroup = Feature.groupStop( feature );
		if ( !featureGroup ) {
			this.logError( "Cannot stop feature '" + feature + "' because it has not been started." );
			return false;
		}

		this.message({
			featureGroup: featureGroup,
			type: "feature-stop",
			name: feature,
			properties: properties
		});
	}
});
rerrorClass = /^\[object (\w+)\]$/,
rerrorTypeMessage = /^(\w+):.*$/;

util.extend( app, {
	exception: function( type, e, contact, comment, properties ) {
		if ( !this.started ) {
			this.logError( "Cannot send an exception because the application has not been started." );
			return false;
		}

		var i, src,
			message = e.message || "",
			stack,
			name = e.toString(),
			scripts = document.getElementsByTagName( "script" ),
			length = scripts.length,
			components = [];

		try {
			stack = util.stackTrace({ e: e });
		} catch ( e ) {
			stack = [];
		}

		if ( rerrorClass.test( name ) ) {
			name = name.replace( rerrorClass, "$1" );
		} else if ( rerrorTypeMessage.test( name ) ) {
			name = name.replace( rerrorTypeMessage, "$1" )
		}

		// stacktrace.js includes all of the calls after the exception in IE
		// so we strip them off
		for ( i = 0; i < stack.length; i++ ) {
			if ( /printStackTrace/.test( stack[i] ) ) {
				stack.splice( 0, i + 2 );
				break;
			}
		}

		// Determine the page's scripts (components)
		for ( i = 0; i < length; i++ ) {
			src = scripts[i].getAttribute( "src" );
			components.push( src || location.href );
		}
		components = util.unique( components );

		message = {
			type: "fault-" + type,
			components: components,
			message: message,
			name: name,
			stack: stack,
			properties: properties
		};
		if ( contact ) {
			message.contact = contact;
		}
		if ( comment ) {
			message.comment = comment;
		}
		this.message( message );
	}
});
window.RI = {
	apiVersion: app.apiVersion,

	plugins: {},

	appStart: function( settings, properties ) {
		return app.start( settings, properties );
	},

	appStop: function( properties ) {
		app.stop( properties );
	},

	featureTick: function( feature, properties ) {
		app.featureTick( feature, properties );
	},

	featureStart: function( feature, properties ) {
		app.featureStart( feature, properties );
	},

	featureStop: function( feature, properties ) {
		app.featureStop( feature, properties );
	},

	errorCaught: function( error, contact, comment, properties ) {
		app.exception( "caught", error, contact, comment, properties );
	},

	errorUncaught: function( error, contact, comment, properties ) {
		app.exception( "uncaught", error, contact, comment, properties );
	},

	errorThrown: function( error, contact, comment, properties ) {
		app.exception( "thrown", error, contact, comment, properties );
	}
};
})();
