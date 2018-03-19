# Test training

Test examples

## How can I run run the test of this project?

If you want to use [Polymer CLI](https://www.npmjs.com/package/polymer-cli), you will need to have it installed globally. Then you just have to run `polymer serve`, and access to your reusable components url (something like this: http://127.0.0.1:8081/components/test-training/test/), with this you will run the tests of your components in the opened browser.

You can also test this component using `polymer test`, it will run the tests in all your available browsers, but if you can't install selenium webdriver it won't work (this command will try to download and install the necessary selenium webdrivers for your computer).

Furthermore you can also use `wct`command but you will need to install web-component-tester globally (this command as the previous one, will also try to download and install the necessary selenium webdrivers for your computer).

## Viewing Your Element

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

## Debug

If you need to debug a Suite of tests you will have to use `polymer serve` and access to the concrete test suite (http://127.0.0.1:8081/components/test-training/test/test-training_test.html).

## More info

* [Polymer test your elements](https://www.polymer-project.org/2.0/docs/tools/tests)
* [web-component-tester](https://github.com/Polymer/web-component-tester)
* [Mocha](https://mochajs.org/)
* [Chai](http://www.chaijs.com/)
* [Sinon](http://sinonjs.org/)
