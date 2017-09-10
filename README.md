[![Build Status](https://travis-ci.org/ngInferno/ngInferno.svg?branch=master)](https://travis-ci.org/ngInferno/ngInferno) [![Pair on this](https://tf-assets-staging.s3.amazonaws.com/badges/thinkful_repo_badge.svg)](http://start.thinkful.com/react/?utm_source=github&utm_medium=badge&utm_campaign=ngInferno)

# ngInferno

[Inferno](https://github.com/infernojs/inferno)
> An extremely fast, React-like JavaScript library for building modern user interfaces

The [React.js](http://facebook.github.io/react/) library can be used as a view component in web applications. Along with being a port of [ngInferno](https://github.com/ngInferno/ngInferno), ngInferno is an Angular module that allows Inferno Components to be used in [AngularJS](https://angularjs.org/) applications.

Motivation for this could be any of the following:

- You need greater performance than Angular can offer (two way data binding, Object.observe, too many scope watchers on the page) where React and especially Inferno, are typically more performant due to the Virtual DOM and other optimizations it can make

- React/Inferno both offers an easier way to think about the state of your UI; instead of data flowing both ways between controller and view as in two way data binding, React/Inferno typically eschews this for a more unidirectional/reactive paradigm

- Someone in the React/Inferno community released a component that you would like to try out

- You're already deep into an Angular application and can't move away, but would like to experiment with React/Inferno

# Installation

Install via Bower:

```bash
bower install ngInferno
```

or via npm:

```bash
npm install nginferno
```

or via yarn:

```bash
yarn add nginferno
```

# Usage

Then, just make sure Angular, Inferno, and ngInferno are on the page,
```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/inferno/inferno.js"></script>
<script src="bower_components/inferno/inferno-compat.js"></script>
<script src="bower_components/ngInferno/ngInferno.min.js"></script>
```

and include the 'inferno' Angular module as a dependency for your new app

```html
<script>
    angular.module('app', ['inferno']);
</script>
```

and you're good to go.

# Features

Specifically, ngInferno is composed of:

- `inferno-component`, an Angular directive that delegates off to a Inferno Component
- `infernoDirective`, a service for converting Inferno components into the `inferno-component` Angular directive

**ngInferno** can be used in existing angular applications, to replace entire or partial views with inferno components.

## The inferno-component directive

The `inferno-component` directive is a generic wrapper for embedding your Inferno components.

With an Angular app and controller declaration like this:

```javascript
angular.module('app', ['inferno'])
  .controller('helloController', function($scope) {
    $scope.person = { fname: 'Clark', lname: 'Kent' };
  });
```

And a Inferno Component like this

```javascript
var HelloComponent = Inferno.createClass({
  propTypes: {
    fname : Inferno.PropTypes.string.isRequired,
    lname : Inferno.PropTypes.string.isRequired
  },
  render: function() {
    return <span>Hello {this.props.fname} {this.props.lname}</span>;
  }
})
app.value('HelloComponent', HelloComponent);
```

The component can be used in an Angular view using the inferno-component directive like so:

```html
<body ng-app="app">
  <div ng-controller="helloController">
    <inferno-component name="HelloComponent" props="person" watch-depth="reference"/>
  </div>
</body>
```

Here:

- `name` attribute checks for an Angular injectable of that name and falls back to a globally exposed variable of the same name
- `props` attribute indicates what scope properties should be exposed to the Inferno component
- `watch-depth` attribute indicates what watch strategy to use to detect changes on scope properties.  The possible values for inferno-component are `reference`, `collection` and `value` (default)

## The infernoDirective service

The infernoDirective factory, in contrast to the infernoComponent directive, is meant to create specific directives corresponding to Inferno components. In the background, this actually creates and sets up directives specifically bound to the specified Inferno component.

If, for example, you wanted to use the same Inferno component in multiple places, you'd have to specify `<inferno-component name="yourComponent" props="props"></inferno-component>` repeatedly, but if you used infernoDirective factory, you could create a `<your-component></your-component>` directive and simply use that everywhere.

The service takes the Inferno component as the argument.

```javascript
app.directive('helloComponent', function(infernoDirective) {
  return infernoDirective(HelloComponent);
});
```

Alternatively you can provide the name of the component

```javascript
app.directive('helloComponent', function(infernoDirective) {
  return infernoDirective('HelloComponent');
});
```

This creates a directive that can be used like this:

```html
<body ng-app="app">
  <div ng-controller="helloController">
    <hello-component fname="person.fname" lname="person.lname" watch-depth="reference"></hello-component>
  </div>
</body>
```

The `infernoDirective` service will read the Inferno component `propTypes` and watch attributes with these names. If your inferno component doesn't have `propTypes` defined you can pass in an array of attribute names to watch.  By default, attributes will be watched by value however you can also choose to watch by reference or collection by supplying the watch-depth attribute.  Possible values are `reference`, `collection` and `value` (default).

```javascript
app.directive('hello', function(infernoDirective) {
  return infernoDirective(HelloComponent, ['fname', 'lname']);
});
```

You may also customize the watch depth per prop/attribute by wrapping the name and an options object in an array inside the props array:

```javascript
app.directive('hello', function(infernoDirective) {
  return infernoDirective(HelloComponent, [
    'person', // takes on the watch-depth of the entire directive
    ['place', {watchDepth: 'reference'}],
    ['things', {watchDepth: 'collection'}],
    ['ideas', {watchDepth: 'value'}]
  ]);
});
```

By default, ngInferno will wrap any functions you pass as in `scope.$apply`. You may want to override this behavior, for instance, if you are passing a Inferno component as a prop. You can achieve this by explicitly adding a `wrapApply: false` in the prop config:

```javascript
app.directive('hello', function(infernoDirective) {
  return infernoDirective(HelloComponent, [
    'person',
    ['place', {watchDepth: 'reference'}],
    ['func', {watchDepth: 'reference', wrapApply: false}]
  ]);
});
```


If you want to change the configuration of the directive created the `infernoDirective` service, e.g. change `restrict: 'E'` to `restrict: 'C'`, you can do so by passing in an object literal with the desired configuration.

```javascript
app.directive('hello', function(infernoDirective) {
  return infernoDirective(HelloComponent, undefined, {restrict: 'C'});
});
```

### Minification
A lot of automatic annotation libraries including ng-annotate skip implicit annotations of directives. Because of that you might get the following error when using directive in minified code:
```
Unknown provider: eProvider <- e <- helloDirective
```
To fix it add explicit annotation of dependency
```javascript
var helloDirective = function(infernoDirective) {
  return infernoDirective('HelloComponent');
};
helloDirective.$inject = ['infernoDirective'];
app.directive('hello', helloDirective);
```


## Reusing Angular Injectables

In an existing Angular application, you'll often have existing services or filters that you wish to access from your Inferno component. These can be retrieved using Angular's dependency injection. The Inferno component will still be render-able as aforementioned, using the inferno-component directive.

It's also possible to pass Angular injectables and other variables as fourth parameter straight to the infernoDirective, which will then attach them to the props

```javascript
app.directive('helloComponent', function(infernoDirective, $ngRedux) {
  return infernoDirective(HelloComponent, undefined, {}, {store: $ngRedux});
});
```

Be aware that you can not inject Angular directives into JSX.

```javascript
app.filter('hero', function() {
  return function(person) {
    if (person.fname === 'Clark' && person.lname === 'Kent') {
      return 'Superman';
    }
    return person.fname + ' ' + person.lname;
  };
});

/** @jsx Inferno.DOM */
app.factory('HelloComponent', function($filter) {
  return Inferno.createClass({
    propTypes: {
      person: Inferno.PropTypes.object.isRequired,
    },
    render: function() {
      return <span>Hello $filter('hero')(this.props.person)</span>;
    }
  });
});
```

```html
<body ng-app="app">
  <div ng-controller="helloController">
    <inferno-component name="HelloComponent" props="person" />
  </div>
</body>
```

## Jsx Transformation in the browser
During testing you may want to run the `JSXTransformer` in the browser. For this to work with angular you need to make sure that the jsx code has been transformed before the angular application is bootstrapped. To do so you can [manually bootstrap](https://docs.angularjs.org/guide/bootstrap#manual-initialization) the angular application. For a working example see the [jsx-transformer example](https://github.com/davidchang/ngInferno/tree/master/examples/jsx-transformer).

NOTE: The workaround for this is hacky as the angular bootstap is postponed in with a `setTimeout`, so consider [transforming jsx in a build step](http://facebook.github.io/react/docs/getting-started.html#offline-transform).

## Usage with [webpack](https://webpack.github.io/) and AngularJS < 1.3.14

CommonJS support was [added to AngularJS in version 1.3.14](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#1314-instantaneous-browserification-2015-02-24). If you use webpack and need to support AngularJS < 1.3.14, you should use webpack's [exports-loader](https://github.com/webpack/exports-loader) so that `require('angular')` returns the correct value. Your webpack configuration should include the following loader config:

```js
...
module: {
  loaders: [
    {
      test: path.resolve(__dirname, 'node_modules/angular/angular.js'),
      loader: 'exports?window.angular'
    }
  ]
},
...
```

## Developing
Before starting development run

```bash
npm install
bower install
```

Build minified version and run tests with

```bash
grunt
```

Continually run test during development with

```bash
grunt karma:background watch
```

### Running the examples
The examples in the `examples/` folder use `bower_components`. To install these first install bower on your machine

```
npm install --global bower
```

Then install the bower components

```
bower install
```

The examples need to be run on a local webserver like https://www.npmjs.com/package/http-server.

Run the examples by starting a webserver in the project root folder.

# Community

## Maintainers

- Kasper Bøgebjerg Pedersen (@kasperp)
- David Chang (@davidchang)

## Contributors

- Guilherme Hermeto (@ghermeto)
- @thorsten
- @katgeorgeek
- @rosston
- Tihomir Kit (@pootzko)
- Alexander Beletsky (@alexanderbeletsky)
- @matthieu-ravey
- @ethul
- Devin Jett (@djett41)
- Marek Kalnik (@marekkalnik)
- @oriweingart
- Basarat Ali Syed (@basarat)
- Rene Bischoff (@Fjandin)
- Zach Pratt (@zpratt)
- Alex Abenoja (@aabenoja)
- @villesau
- @bdwain
- @onumossn
