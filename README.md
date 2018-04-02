# Test training

Test examples

## How can I run the tests of this project?

If you want to use [Polymer CLI](https://www.npmjs.com/package/polymer-cli), you will need to have it installed globally. Then you just have to run `polymer serve`, and access to your reusable components url (something like this: http://127.0.0.1:8081/components/test-training/test/), with this you will run the tests of your components in the opened browser.

You can also test this component using `polymer test`, it will run the tests in all your available browsers, but if you can't install selenium webdriver it won't work (this command will try to download and install the necessary selenium webdrivers for your computer).

Furthermore you can also use `wct`command but you will need to install web-component-tester globally (this command as the previous one, will also try to download and install the necessary selenium webdrivers for your computer).

## Adding Suites to WCT

You can load more than one suite in your index file, you only have to add the new suite to the array of Suites.

```javascript
WCT.loadSuites([
    'test-training_test.html',
    'test-training_test.html?dom=shadow',
    'fire-event_test.html',
    'fire-event_test.html?dom=shadow',
    'templating-demo_test.html',
    'templating-demo_test.html?dom=shadow',
    'data-binding_test.html',
    'data-binding_test.html?dom=shadow',
    'stub-demo_test.html',
    'stub-demo_test.html?dom=shadow',
]);
```

## BDD

We prefer using Mocha's and Chai's BDD interface:

* Suites: **describe(string, function), context(string, function)** functions with a title and a function with one or more specs.
* Specs: **it(string, function), specify(string, function)** function with a title and a function with one or more expectations.
* Expectations: **expect(actual).to.be.equal(expected)** assertions that evaluate to true or false.

> **context** is an alias of **describe** and **specify** is and alias of **it** so we strongly recommend that you use **describe** and **it** although it can add more clarity to the tests:

```javascript
describe('button', function(){
    context('when it is focused', function() {
        it('should have the class focused', function() {
            expect(Array.from(button.classList)).to.include('focused');
        });
    });
});
```

## Skipping tests

Sometimes you will need to skip some tests because you don't want to run all the test (you need to debug a specific test), you could comment all the unnecessary tests but that's not the correct way to do it.

Instead you can skip a Suite of tests appending `.skip()` or prepending a `x`  to that Suite:

```javascript
describe.skip('button', function() {...});
xdescribe('button', function() {...});
```

If you need to skip only a test, you can do the same as with the Suites:

```javascript
it.skip('should have the class focused', function() {...});
xit('should have the class focused', function() {...});
```

## Sinon's spies

A test spy is a function that records arguments, returns values for all its calls.

```javascript
it('should fire two events when the button is tapped twice', () => {
    const spy = sinon.spy();

    element.addEventListener('my-fired-event', spy);

    MockInteractions.tap(button);
    MockInteractions.tap(button);

    expect(spy.calledTwice).to.be.true;
});
```

If you want to wrap the existing function so it keeps behaving as the original function, you can do it like this:

```javascript
sinon.spy(console, 'log');
```

With this you will have access to data about all the calls made to console.log:

```javascript
console.log.calledOnce
```

After you end the test (between every suit or spec) you will have to restore the function:

```javascript
afterEach(function() {
    console.log.restore();
});
```

## Sinon's stubs

They are like sinon's spies but with a custom behavior.

```javascript
beforeEach(() => {
    const response = new Response(JSON.stringify(getPersons()), {
        status: 200,
        headers: {
            'Content-type': 'application/json',
        },
    });

    sinon.stub(window, 'fetch');

    fetch.returns(Promise.resolve(response));

    element = fixture('StubDemoFixture');
});
```

After using it we have to restore it:

```javascript
afterEach(() => {
    fetch.restore();
});
```

We can use the same API as we did with spies:

```javascript
fetch.calledOnce
```

## Sinon's sandbox

Sandboxes help us removing the need to keep track of every spy or stub created in our test, which greatly simplifies the cleanup.

We just have to create the sandbox and save it in a variable to use it later.

```javascript
let sandbox;

before(() => {
    sandbox = sinon.sandbox.create();
});  
```

Then we just have to restore it after each spec or suite.

```javascript
afterEach(() => {
    sandbox.restore();
});
```

And then just use it in your specs.

```javascript
it('should call to _showResultInConsole when it is clicked', (done) => {
    flush(() => {
        const button = element.shadowRoot.querySelector('button');

        sandbox.spy(element, '_showResultInConsole');

        MockInteractions.tap(button);

        expect(element._showResultInConsole.calledOnce).to.be.true;
        done();
    });
});
```

## Testing web components

To start testing your web component you should add a `fixture` to your test file:

```html
<test-fixture id="BasicTestFixture">
    <template>
        <test-training></test-training>
    </template>
</test-fixture>
```

And then you will only need to get it using `fixture('BasicTestFixture')`:

```javascript
describe('test-training', () => {
    let element;

    beforeEach(() => {
        element = fixture('BasicTestFixture');
    });
});
```

With this, it will assign a new fixture to element before each **expecations** and **suites**. When it assigns a new fixture to element it also resets all the states, values and modifications that you could have made in your element in each test, so you can make a test without any side-effects of previous executed tests.

### iron-test-helpers

It's a set of utility classes that help us to make tests.

[TestHelpers](https://github.com/PolymerElements/iron-test-helpers/blob/master/test-helpers.js): Give us utilities to skip tests, fire events, make asynchronous operations...

[MockInteractions](https://github.com/PolymerElements/iron-test-helpers/blob/master/mock-interactions.js): Give us utilities to make touch events...

1. To install it, you have to use `bower install --save-dev PolymerElements/iron-test-helpers`
2. And then add `<link rel="import" href="../../iron-test-helpers/test-helpers.html">` or `<link rel="import" href="../../iron-test-helpers/mock-interactions.html">`

### Testing events

When you need to test events you can make asynchronous specs or add a spy when you add the event's listener (if the event is fired by an interaction with the user we can use `MockInteractions` to help us with tests):

```javascript
it('should fire an event when the button is tapped', (done) => {
    element.addEventListener('my-fired-event', () => {
        done();
    });

    MockInteractions.tap(button);
});
```

```javascript
it('should fire an event when the button is tapped', (done) => {
    const spy = sinon.spy();

    element.addEventListener('my-fired-event', spy);

    MockInteractions.tap(button);

    expect(spy.calledOnce).to.be.true;
});
```

### Testing bindings with HTML Elements and Custom Elements

When you need to test the binding between the value property of an input and the property of your component you will have to fire an event (we can use `TestHelpers` to help us with this test).

Here you can see how it works with the native `<select></select>`:

```javascript
describe('selectValue', () => {
    it('should be updated when the user selects an option', () => {
        const mySelect = element.shadowRoot.querySelector('#mySelect');
        const optionToSelect = mySelect.querySelector(`option[value="${selectValue}"]`);

        optionToSelect.setAttribute('selected', true);

        TestHelpers.fireEvent('change', {}, mySelect);

        expect(element.selectValue).to.be.equal(selectValue);
    });
});
```

And here we use it with the Custom Element `iron-input`:

```javascript
describe('ironValue', () => {
    it('should be updated when the user enters a value into the ironInput', (done) => {
        flush(() => {
            const nativeInputInsideIronInput = element.shadowRoot.querySelector('#nativeInputInsideIronInput');
            nativeInputInsideIronInput.value = ironValue;

            TestHelpers.fireEvent('input', {}, nativeInputInsideIronInput);

            expect(element.ironValue).to.be.equal(ironValue);
            done();
        });
    });
});
```

### Test DOM mutations

If your element template use a **template repeater (dom-repeat)** or a **conditional-template (dom-if)** or a **slot** or you want to test a shadow DOM mutation then you will have to wrap it with a `flush` function and mark this spec as an asynchronous one.

```javascript
it('should show the paragraph showParagraph when showProperty is true', (done) => {
    element.set('showProperty', true);

    flush(() => {
        const showParagraph = element.shadowRoot.querySelector('#showParagraph');

        expect(element.showProperty).to.be.true;
        expect(showParagraph).to.not.be.null;

        done();
    });
});
```

If you need to wait the resolution of a promise, you can use `Polymer.Base.async`.

```javascript
it('should have the expected number of persons after the component makes the request', (done) => {
    Polymer.Base.async(() => {
        expect(fetch.calledOnce).to.be.true;
        expect(element.persons).to.not.be.empty;
        expect(element.persons).to.be.deep.equal(getPersons());
        done();
    }, 100);
});
```

## Debug

If you need to debug a Suite of tests you will have to use `polymer serve` and access to the concrete test suite (http://127.0.0.1:8081/components/test-training/test/test-training_test.html).

## More info

* [Polymer test your elements](https://www.polymer-project.org/2.0/docs/tools/tests)
* [web-component-tester](https://github.com/Polymer/web-component-tester)
* [Mocha](https://mochajs.org/)
* [Chai](http://www.chaijs.com/)
* [Sinon](http://sinonjs.org/)
* [Polymer Unit Testing](https://medium.com/google-developer-experts/polymer-unit-testing-d6a69910dc31)
* [Polymer Testing Tips](https://medium.com/google-developer-experts/polymer-testing-tips-f217ba94a64)
* [Best Practices for Spies, Stubs and Mocks in Sinon.js](https://semaphoreci.com/community/tutorials/best-practices-for-spies-stubs-and-mocks-in-sinon-js)
