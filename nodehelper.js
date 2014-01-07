/*
 * 
 */

;(function() {
	// log helper
	function nhLog( msg ) {
		return console.log( 'nodehelper: ' + msg.toString() );
	}

	// empty placeholder function
	function nh() {}

	nh.prototype.isString = function( str ) {
		return typeof str === 'string' || str instanceof String;
	};

	// http://dl.dropboxusercontent.com/u/35146/js/tests/isNumber.html
	nh.prototype.isNumber = function ( num ) {
		return !isNaN( parseFloat( num ) ) && isFinite( num );
	};

	nh.prototype.isObject = function( obj ) {
		return obj === Object( obj ) && Object.prototype.toString.call( obj ) !== '[object Array]';
	};

	nh.prototype.each = function ( obj, callback ) {
		if ( obj.isArray ) {
			for ( var i = 0, l = obj.length; i < l; i++ )
				callback.call( obj, i, obj[ i ] );
		} else if ( obj === Object( obj ) ) {
			for ( var key in obj )
				callback.call( obj, key, obj[ key ] );
		} else if ( this.isNumber( obj ) ) {
			for ( var i = 0; i < obj; i++ )
				callback.call( obj, i );
		}
	};

	// provide some bitwise math alternatives

	nh.prototype.bitFloor = function ( num ) {
		return num | 0;
	};

	nh.prototype.bitCeil = function ( num ) {
		return ( num + 1 ) | 0;
	};

	nh.prototype.bitRound = function ( num ) {
		return ( num + 0.5 ) | 0;
	};

	// lerp function, not 100% sure this is useful for nodejs - possibly smoothing out test results
	nh.prototype.lerp = function ( fromNum, toNum, t ) {
		return fromNum + ( toNum - fromNum ) * t;
	};

	// Fisher-Yates shuffle
	nh.prototype.shuffle = function ( arr ) {
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
	};

	// setting shuffleOverride to true disables the shuffle - useful for one-off randoms where performance is a concern
	nh.prototype.randomFromArray = function ( arr, shuffleOverride ) {
		if ( !arr || !arr.isArray )
			return false;

		// shuffle the array before returning to make it really random
		if ( !shuffleOverride )
			arr = this.shuffle( arr );

		return arr[ ( Math.random() * arr.length ) | 0 ];
	};

	// using with one argument should just make a clone of the object
	nh.prototype.extend = function () {
		var a = arguments;

		if ( a.length === 0 )
			return nhLog( 'extend requires at least 1 argument' );

		for ( var i = 0, l = a.length, n = Object.create( a[ 0 ] ); i < l; i++ )
			for ( var obj in a[ i ] )
				n[ obj ] = a[ i ][ obj ];

		return n;
	};

	module.exports = new nh();
})();
