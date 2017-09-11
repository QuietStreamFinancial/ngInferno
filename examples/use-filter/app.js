var app = angular.module( 'app', ['inferno'] );

app.controller( 'mainCtrl', function( $scope ) {
  $scope.person = { fname: 'Clark', lname: 'Kent' };
} );

app.filter( 'hero', function() {
  return function( person ) {
    if ( person.fname === 'Clark' && person.lname === 'Kent' ) {
      return 'Superman';
    }
    return person.fname + ' ' + person.lname;
  };
} );

app.factory( "Hello", function( $filter ) {
  return Inferno.createClass( {
    propTypes: {
      person: Inferno.PropTypes.object.isRequired,
    },

    render: function() {
      return Inferno.DOM.span( null,
        'Hello ' + $filter( 'hero' )( this.props.person )
      );
    }
  } );
} );

app.directive( 'hello', function( infernoDirective ) {
  return infernoDirective( 'Hello' );
} );
