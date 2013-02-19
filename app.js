// app.js

(function () {
    tbone.createModel('counter', function () {
        return {
            value: 0
        };
    }).singleton();

    tbone.render(jQuery('[tbone]')); 

    function increment() {
        // Lookup the counter model value.
        var i = tbone.lookup('counter.value');

        // Increment the counter model value.
        tbone.set('counter.value', i+1);
    }

    // Call the increment function every second.
    setInterval(increment, 1000);
}());
