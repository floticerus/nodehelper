/*
 * 
 */

;(function() {
	function nh() {
		this.logging = true;
	}

	nh.prototype = {
		set: function ( key, val ) {
			if ( this.hasOwnProperty( key ) )
				this[ key ] = val;
			else
				this.nhLog( 'set: invalid property' );
		},

		nhLog: function ( msg ) {
			return this.logging ? console.log( 'nodehelper: ' + msg.toString() ) : false;
		},

		isString: function ( str ) {
			return typeof str === 'string' || str instanceof String;
		},

		// http://dl.dropboxusercontent.com/u/35146/js/tests/isNumber.html
		isNumber: function ( num ) {
			return !isNaN( parseFloat( num ) ) && isFinite( num );
		},

		isObject: function ( obj ) {
			return obj === Object( obj ) && Object.prototype.toString.call( obj ) !== '[object Array]';
		},

		each: function ( obj, callback ) {
			if ( obj.isArray ) {
				// don't see the need for an isArray fallback in node
				// loops a normal array - []

				for ( var i = 0, l = obj.length; i < l; i++ )
					callback.call( obj, i, obj[ i ] );

			} else if ( obj === Object( obj ) ) {
				// loops an object - {}

				for ( var key in obj )
					callback.call( obj, key, obj[ key ] );

			} else if ( this.isNumber( obj ) ) {
				// loops a number - 23

				for ( var i = 0; i < obj; i++ )
					callback.call( obj, i );

			} else if ( this.isString( obj ) ) {
				// loops a string - 'foo'

				for ( var i = 0, l = obj.length; i < l; i++ )
					callback.call( obj, i, obj.charAt( i ) );
				
			} else {
				this.nhLog( 'each: invalid type' );
			}
		},

		// provide some bitwise math alternatives
		bitFloor: function ( num ) {
			return num | 0;
		},

		bitCeil: function ( num ) {
			return ( num + 1 ) | 0;
		},

		bitRound: function ( num ) {
			return ( num + 0.5 ) | 0;
		},

		// lerp function, not 100% sure this is useful for nodejs - possibly smoothing out test results
		lerp: function ( fromNum, toNum, t ) {
			return fromNum + ( toNum - fromNum ) * t;
		},

		// Fisher-Yates shuffle
		shuffle: function ( arr ) {
			if ( !arr || !arr.isArray )
				return false;

			var n = arr.slice( 0 ),
				i = n.length,
				j, t;

			while ( --i > 0 ) {
				j = ( Math.random() * ( i + 1 ) ) | 0;
				t = n[ j ];
				n[ j ] = n[ i ];
				n[ i ] = t;
			}

			return n;
		},

		// setting shuffleOverride to true disables the shuffle - useful for one-off randoms where performance is a concern
		randomFromArray: function ( arr, shuffleOverride ) {
			if ( !arr || !arr.isArray )
				return false;

			// make a temporary copy of the array
			var n = arr.slice( 0 );

			// shuffle the array before returning to make it really random
			if ( !shuffleOverride )
				n = this.shuffle( n );

			return n[ ( Math.random() * n.length ) | 0 ];
		},

		// using with one argument should just make a clone of the object
		extend: function () {
			var a = arguments;

			if ( a.length === 0 )
				return this.nhLog( 'extend requires at least 1 argument' );

			for ( var i = 0, l = a.length, n = Object.create( a[ 0 ] ); i < l; i++ )
				for ( var obj in a[ i ] )
					n[ obj ] = a[ i ][ obj ];

			return n;
		}
	};

	module.exports = new nh();
})();
