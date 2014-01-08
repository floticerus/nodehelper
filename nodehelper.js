/** @preserve nodehelper
 *  @copyright 2014 Kevin von Flotow <vonflow@gmail.com>
 *  @license MIT License <http://opensource.org/licenses/MIT>
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

		// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
		isNumber: function ( num ) {
			return !isNaN( parseFloat( num ) ) && isFinite( num );
		},

		isObject: function ( obj ) {
			return obj === Object( obj ) && Object.prototype.toString.call( obj ) !== '[object Array]';
		},

		isFunction: function ( obj ) {
			return Object.prototype.toString.call( obj ) === '[object Function]';
		},

		each: function ( obj, callback ) {
			if ( !obj )
				return this.nhLog( 'each: obj is required' );

			if ( !callback )
				return this.nhLog( 'each: callback is required' );
			else if ( !this.isFunction( callback ) )
				return this.nhLog( 'each: callback must be a function' );

			if ( Array.isArray( obj ) ) {
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

		// http://en.wikipedia.org/wiki/Lerp_(computing)
		// not 100% sure this is useful for nodejs - possibly smoothing out test results
		lerp: function ( fromNum, toNum, t ) {
			return fromNum + ( toNum - fromNum ) * t;
		},

		// example: nh.getPointInRange( 0.2, 0, 523 ) returns 104.6
		getPointInRange: function ( targetPoint, rangeMin, rangeMax ) {
			return ( ( rangeMax - rangeMin ) * targetPoint ) + rangeMin;
		},

		// Fisher-Yates shuffle
		// http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
		shuffle: function ( arr ) {
			if ( !arr || !Array.isArray( arr ) )
				return false;

			var n = arr.slice( 0 ),
				i = n.length,
				j, t;

			while ( --i > 0 ) {
				j = this.bitFloor( Math.random() * ( i + 1 ) );
				t = n[ j ];
				n[ j ] = n[ i ];
				n[ i ] = t;
			}

			return n;
		},

		// setting shuffleOverride to true disables the shuffle - useful for one-off randoms where performance is a concern
		randomFromArray: function ( arr, shuffleOverride ) {
			if ( !arr || !Array.isArray( arr ) )
				return false;

			// make a temporary copy of the array
			var n = arr.slice( 0 );

			// shuffle the array before returning to make it really random
			if ( !shuffleOverride )
				n = this.shuffle( n );

			return n[ this.bitFloor( Math.random() * n.length ) ];
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
