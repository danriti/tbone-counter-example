# TBone Counter Example

## Welcome

Hey! I'm Dan Riti, the latest addition to the Tracelytics (or AppNeta?) team! I
recently joined as a full stack engineer in the Providence office and it's been
an exciting past couple of weeks learning about the world of tracing web-based
applications.

## TraceView

I've been working primarily on a new version of our TraceView page, which provides
in-depth performance insight into dynamic web-based applications. This means
learning about both Backbone.js and TBone.js

- Working on trace details page
- Plug what the TraceView page does!
- It is built upon Backbone.js and TBone.js
- TBone.js is an open source library for Backbone.js that provides "automagic"
  event-binding.

## Enter TBone

TBone removes the complexity of manually managing data dependencies in Backbone,
enabling "live" templates as well as functions that automatically re-execute when
the data they reference changes.

TBone is designed to scale with your application, enabling simple re-use of data
throughout your application without you needing to tell the page what to update
when that data changes.

At AppNeta, we've used TBone to eliminate a set of custom page events
corresponding such as "refresh data" and "add filter"; with a large application,
it becomes difficult to manage what exactly needs to be refreshed when something
changes. While Backbone is a critical step toward reducing this complexity,
TBone enables us to do so without even thinking about event binding; every view
and model stays in sync by design and without unnecessary work.

## Digging into TBone

Let's implement a sample application that demonstrates some of the "automagic"
of TBone. For this example, we will build a simple counter that increments
every second, implement some simple controls (Start/Stop/Reset), and finally demonstrate data
dependency by introducing a model that depends on the counter. Let's get
started!

**NOTE**: This code can be viewed [here](https://github.com/danriti/tbone-counter-example) or cloned using git:

    $ git clone git@github.com:danriti/tbone-counter-example.git

First, we will create a model to represent the `counter` using TBone:

```javascript
tbone.createModel('counter', function () {
    return {
        intervalId: 0,
        value: 0
    };
}).singleton();
```

Our `counter` model contains two attributes, `intervalId` and `value`.
We will be using the [setInterval](https://developer.mozilla.org/en-US/docs/DOM/window.setInterval) method to increment the counter, so `intervalId`
will store the interval id and `value` will simply store the counter value.

Next, we will create a view for controlling (Start, Stop, Reset) the counter:

```javascript
tbone.createView('counterControl', function() {
    var self = this;

    var startBtn = self.$('button#start');
    var stopBtn = self.$('button#stop');
    var resetBtn = self.$('button#reset');

    // Initially disable the stop button.
    stopBtn.attr("disabled", true);

    // Event handler for the start button click.
    startBtn.click(function() {
        // Set button states.
        startBtn.attr('disabled', true);
        stopBtn.removeAttr('disabled');

        // Increment the counter every second.
        var intervalId = setInterval(function() {
            // Lookup the counter model value.
            var i = tbone.lookup('counter.value');

            // Increment the counter model value.
            tbone.set('counter.value', i+1);
        }, 1000);

        tbone.set('counter.intervalId', intervalId);
    });

    // Event handler for the stop button click.
    stopBtn.click(function() {
        // Set button states.
        stopBtn.attr('disabled', true);
        startBtn.removeAttr('disabled');

        // Fetch the interval id and stop incrementing the counter.
        var intervalId = tbone.lookup('counter.intervalId');
        clearInterval(intervalId);
    });

    // Event handler for the reset button click.
    resetBtn.click(function() {
        // Reset the counter value to 0.
        tbone.set('counter.value', 0);
    });
});
```

Finally, we will bind our model and views to our template:

```html
<div class="container">
  <h1>TBone Counter Example!</h1>
  <hr>
  <div tbone="inline counter">
      <h3>Counter - <%=counter.value%></h3>
  </div>
  <div tbone="view counterControl">
      <button class="btn" id="start">Start</button>
      <button class="btn" id="stop">Stop</button>
      <button class="btn" id="reset">Reset</button>
  </div>
</div>
```

So what's happening? When you click **Start**, the `value` attribute in the
`counter` model is being incremented each second. Everytime the  model changes,
the template is forced to update to display the newest data. As you play with
the other controls, you will notice that template responds accordingly. This is
an example of "live" templating in TBone.

So now let's make things interesting. Let's introduce a new model called `timer`, however let's
assume it is depends on the `counter` model to keep track of time. Well in TBone,
this is pretty simple:

```javascript
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
```

When creating `timer`, we tell it TBone that this model depends on the `counter`
model. Thus, anytime the `counter` model changes, the `calc` method will fire,
and recalculate the attributes (seconds & minutes) for the `timer` model. Pretty
neat huh? Well let's see it in action!

Just update your template to add the timer:

```html
<div tbone="inline timer">
    <h3>Timer (MM:SS) - <%=timer.minutes%>:<%=timer.seconds%></h3>
</div>
```

Now the newly created `timer` model will update seemlessly as the `counter`
model increments away! Isn't TBone delicious?
