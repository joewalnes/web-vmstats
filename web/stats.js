var descriptions = {
    'Processes': {
        'r': 'Number of processes waiting for run time',
        'b': 'Number of processes in uninterruptible sleep'
    },
    'Memory': {
        'swpd': 'Amount of virtual memory used',
        'free': 'Amount of idle memory',
        'buff': 'Amount of memory used as buffers',
        'cache': 'Amount of memory used as cache'
    },
    'Swap': {
        'si': 'Amount of memory swapped in from disk',
        'so': 'Amount of memory swapped to disk'
    },
    'IO': {
        'bi': 'Blocks received from a block device (blocks/s)',
        'bo': 'Blocks sent to a block device (blocks/s)'
    },
    'System': {
        'in': 'Number of interrupts per second, including the clock',
        'cs': 'Number of context switches per second'
    },
    'CPU': {
        'us': 'Time spent running non-kernel code (user time, including nice time)',
        'sy': 'Time spent running kernel code (system time)',
        'id': 'Time spent idle',
        'wa': 'Time spent waiting for IO'
    }
}

function ServerStats(host) {
    this.host = host;
    this.allTimeSeries = {};
    this.allValueLabels = {};
}

ServerStats.prototype.streamStats = function(host) {
    var self = this;
    var ws = new ReconnectingWebSocket('ws://' + this.host + '/');
    var lineCount;
    var colHeadings;

    ws.onopen = function() {
        console.log('connect');
        lineCount = 0;
        self.server.addClass('connected');
    };

    ws.onclose = function() {
        console.log('disconnect');
        self.server.removeClass('connected');
    };

    ws.onmessage = function(e) {
        switch (lineCount++) {
            case 0: // ignore first line
                break;

            case 1: // column headings
                colHeadings = e.data.trim().split(/ +/);
                break;

            default: // subsequent lines
                var colValues = e.data.trim().split(/ +/);
                var stats = {};
                for (var i = 0; i < colHeadings.length; i++) {
                    stats[colHeadings[i]] = parseInt(colValues[i]);
                }
                self.receiveStats(stats);
        }
    };
}

ServerStats.prototype.initCharts = function() {
    var self = this;
    self.server = $('.server.template').clone().removeClass('template').appendTo('#servers');
    self.server.find('.hostname').text(this.host.split(/:/)[0]);

    Object.each(descriptions, function(sectionName, values) {
        var section = self.server.find('.chart.template').clone().removeClass('template').appendTo(self.server.find('.charts'));

        section.find('.title').text(sectionName);

        var smoothie = new SmoothieChart({
            grid: {
                sharpLines: true,
                verticalSections: 5,
                strokeStyle: 'rgba(119,119,119,0.45)',
                millisPerLine: 1000
            },
            minValue: 0,
            labels: {
                disabled: true
            }
        });
        smoothie.streamTo(section.find('canvas').get(0), 1000);

        var colors = chroma.brewer['Pastel2'];
        var index = 0;
        Object.each(values, function(name, valueDescription) {
            var color = colors[index++];

            var timeSeries = new TimeSeries();
            smoothie.addTimeSeries(timeSeries, {
                strokeStyle: color,
                fillStyle: chroma(color).darken().alpha(0.5).css(),
                lineWidth: 3
            });
            self.allTimeSeries[name] = timeSeries;

            var statLine = section.find('.stat.template').clone().removeClass('template').appendTo(section.find('.stats'));
            statLine.attr('title', valueDescription).css('color', color);
            statLine.find('.stat-name').text(name);
            self.allValueLabels[name] = statLine.find('.stat-value');
        });
    });
}

ServerStats.prototype.receiveStats = function(stats) {
    var self = this;
    Object.each(stats, function(name, value) {
        var timeSeries = self.allTimeSeries[name];
        if (timeSeries) {
            timeSeries.append(Date.now(), value);
            self.allValueLabels[name].text(value);
        }
    });
}

$(function() {
    var hosts = [
      location.host
    ];

    Object.each(hosts, function(i, host) {
      var stats = new ServerStats(host);
      stats.initCharts();
      stats.streamStats();
    });

});
