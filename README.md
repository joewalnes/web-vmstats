Web VMStat
==========

Display live Linux system stats (memory, CPU, IO, etc) in a pretty web-page, with charts and everything.

![Screenshot](https://github.com/joewalnes/web-vmstats/raw/master/screenshot.png)

Overview
--------

Linux (and many other UNIXy operating systems) have a command line tool called
[vmstat](http://en.wikipedia.org/wiki/Vmstat) for monitoring system stats.

It looks like this (a new line is output every second showing the latest values):
 
    $ vmstat 1
    procs -----------memory---------- ---swap-- -----io---- -system-- ----cpu----
    r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa
    3  0  43652 2742600 453820 2829164    0    0     1    10    0    0  6  1 93  0
    1  0  43652 2742784 453820 2829164    0    0     0     0 3106 5701 11  1 87  0
    0  0  43652 2742908 453820 2829164    0    0     0     0 3898 6703 11  2 87  0
    1  0  43652 2743672 453820 2829164    0    0     0    32 3844 6708 11  2 87  0
    2  0  43652 2743980 453820 2829164    0    0     0    80 4130 7164 11  2 87  0

Useful, but fugly.

This is a tiny application that streams these stats over a WebSocket using
[websocketd](https://github.com/joewalnes/websocketd) and charts them
using [SmoothieCharts](http://smoothiecharts.org).



Why?
----

Why not? A handy little process to install on machines you care about.
After building this for my own needs, I thought it would make a great
little demo.

And if you want to use it or hack on it yourself, here it is.


Running
-------

See `./run` script for instructions.
