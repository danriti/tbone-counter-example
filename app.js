// app.js

(function () {
    // Models
    tbone.createModel('counter', function () {
        return {
            intervalId: 0,
            value: 0
        };
    }).singleton();

    tbone.createModel('timer', tbone.models.base, {
        depends: {
            '*': ['counter']
        },
        calc: function(state) {
            var count = state.value || 0;
            var rval = {};

            // Calculate seconds and minutes.
            var seconds = count % 60;
            var minutes = Math.floor(count / 60);

            // Pad the left side (i.e. 09 instead of 9) of the seconds
            // and minutes.
            rval.seconds = _.string.pad(seconds, 2, '0');
            rval.minutes = _.string.pad(minutes, 2, '0');

            return rval;
        }
    }).singleton();

    // Views
    tbone.createView('counterControl', function() {
        var self = this;

        var startBtn = self.$('button#start');
        var stopBtn = self.$('button#stop');
        var resetBtn = self.$('button#reset');

        // Initially disable the stop button.
        stopBtn.attr("disabled", true);

        startBtn.click(function() {
            // Set button states.
            startBtn.attr('disabled', true);
            stopBtn.removeAttr('disabled');

            var intervalId = setInterval(function() {
                // Lookup the counter model value.
                var i = tbone.lookup('counter.value');

                // Increment the counter model value.
                tbone.set('counter.value', i+1);
            }, 1000);
            tbone.set('counter.intervalId', intervalId);
        });

        stopBtn.click(function() {
            // Set button states.
            stopBtn.attr('disabled', true);
            startBtn.removeAttr('disabled');

            var intervalId = tbone.lookup('counter.intervalId');
            clearInterval(intervalId);
        });

        resetBtn.click(function() {
            tbone.set('counter.value', 0);
        });
    });

    tbone.render(jQuery('[tbone]'));
}());
