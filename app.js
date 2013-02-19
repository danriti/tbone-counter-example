// app.js

(function () {
    // Models
    tbone.createModel('counter', function () {
        return {
            intervalId: 0,
            value: 0
        };
    }).singleton();

    // Views
    tbone.createView('counterStart', function() {
        var that = this.$el;
        function increment() {
            // Lookup the counter model value.
            var i = tbone.lookup('counter.value');

            // Increment the counter model value.
            tbone.set('counter.value', i+1);
        }
        function start() {
            var intervalId = setInterval(increment, 1000);
            tbone.set('counter.intervalId', intervalId);
        }
        that.click(start);
    });

    tbone.createView('counterStop', function() {
        var that = this.$el;
        function stop() {
            var intervalId = tbone.lookup('counter.intervalId');
            clearInterval(intervalId);
        }
        that.click(stop);
    });

    tbone.createView('counterReset', function() {
        var that = this.$el;
        function reset() {
            console.log('counterReset called!');
            tbone.set('counter.value', 0);
        }
        that.click(reset);
    });

    tbone.render(jQuery('[tbone]')); 
}());
