angular
    .module("app")
    .filter("trustedHTML", ["$sce", function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);

angular
    .module("app")
    .controller("terminalCtrl", terminalCtrl);

terminalCtrl.$inject = ["$q", "$timeout"];

function terminalCtrl($q, $timeout) {
    var vm = this;

    var name = "user";

    vm.user = name + "@livecoding: ~";
    vm.output = [];
    vm.maximized = false;
    vm.quit = function() {
        // Close window
    };

    var install = [
        show(vm.user + "$ "),
        pause(2),
        clear(1),
        write("apt-get install LiveCoding.tv-Notifier", 0.1, 0.1),
        pause(0.5),
        show("E: Could not open lock file /var/lib/dpkg/lock - open (13: Permission denied)", 0.2, 0.2),
        show("E: Unable to lock the administration directory (/var/lib/dpkg/), are you root?", 0.2, 0.2),
        show(vm.user + "$ "),
        pause(1),
        clear(1),
        write("sudo apt-get -f install LiveCoding.tv-Notifier", 0.1, 0.1),
        pause(0.5),
        show("[sudo] password for " + name + ": ", 0.2, 0.2),
        pause(1),
        input("hunter2", 0.1, 0.1),
        pause(1),
        show("Reading package lists... Done", 0.2, 0.2),
        show("Building dependency tree", 0.2, 0.2),
        show("Reading state information... Done", 0.2, 0.2),
        show("0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.", 0.2, 0.2),
        show("Need to get 0 B/2.51 MB of archives.", 0.2, 0.2),
        show("After this operation, " + (Math.random() * 3 + 5).toFixed(2) + " MB of additional disk space will be used.", 0.2, 0.2),
        show("Selecting previously unselected package LiveCoding.tv-Notifier.", 0.2, 0.2),
        show("(Reading database ... " + Math.floor(Math.random() * 500) + " files and directories currently installed. )", 0.2, 0.2),
        show("Preparing to unpack .../LiveCoding.tv-Notifier_0.9.0-1ubuntu1_amd64.deb ...", 0.2, 0.2),
        show("Unpacking LiveCoding.tv-Notifier (0.9.0-1ubuntu1) ...", 0.2, 0.2),
        show("Processing triggers for install-info (50.2.00.2fsg.1-2) ...", 0.2, 0.2),
        show("Processing triggers for man-db (2.6.7.1-1ubuntu1) ...", 0.2, 0.2),
        show("Setting up LiveCoding.tv-Notifier (0.9.0-1ubuntu1) ...", 0.2, 0.2),
        show("LiveCoding.tv-Notifier successfully installed!", 0.2, 0.2),
        show(" "),
        pause(2),
        write("Make sure to authorize your account in the settings to sync your favorites!", 0.1, 0.1),
        show("No command 'Make' found.", 0.2, 0.2),
        write("And feel free to submit issues and feature requests on ", 0.1, 0.1),
        input("<a href='https://github.com/easyfuckingpeasy/LiveCoding.tv-Notifier/issues'>Github</a>!"),
        show("No command 'And' found.", 0.2, 0.2)
    ];

    var update = [
        show(vm.user + "$ "),
        pause(2),
        clear(1),
        write("wget https://clients2.google.com/service/update2/LiveCoding.tv-Notifier.zip", 0.1, 0.1),
        pause(0.5),
        show("Resolving clients2.google.com (clients2.google.com)... 192.168.0.1, 18b02:35:1:7::1", 0.2, 0.2),
        show("Connecting to clients2.google.com (clients2.google.com)|192.168.0.1|:80... connected.", 0.2, 0.2),
        show("HTTP request sent, awaiting response... 200 OK", 0.2, 0.2),
        show("Length: 65557980 (6.5MB) [application/zip]", 0.2, 0.2),
        show("Saving to: 'LiveCoding.tv-Notifier.zip'", 0.2, 0.2),
        show("6.52MB [             ]", 0.2, 0.2),
        pause(1), clear(1),
        show("6.52MB [>            ]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [=>           ]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [==>          ]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [===>         ]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [====>        ]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [=====>       ]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [======>      ]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [=======>     ]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [========>    ]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [=========>   ]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [==========>  ]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [===========> ]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [============>]", 0.2, 0.2),
        pause(0.1), clear(1),
        show("6.52MB [=============]", 0.2, 0.2),
        show(
            new Date().toLocaleDateString() + " " +
            new Date().toLocaleTimeString() +
            " (1.08 MB/s) - 'LiveCoding.tv-Notifier.zip' saved [65557980/65557980]", 0.2, 0.2
        ),
        show(vm.user + "$ "),
        pause(1),
        clear(1),
        write("aptitude update LiveCoding.tv-Notifier.zip", 0.1, 0.1),
        pause(0.5),
        show("(Reading database ... 36453 files and directories currently installed.)", 0.2, 0.2),
        show("Unpacking undefined (from ./LiveCoding.tv-Notifier.zip) ...", 0.2, 0.2),
        show("Removing any system startup links for /etc/init.d/LiveCoding.tv-Notifier ...", 0.2, 0.2),
        show("Processing triggers for install-info (50.2.00.2fsg.1-2) ...", 0.2, 0.2),
        show("Setting up LiveCoding.tv-Notifier (3.5-0ubuntu1) ...", 0.2, 0.2),
        show("LiveCoding.tv-Notifier successfully updated!", 0.2, 0.2),
        pause(2),
        write("New in this version:", 0.1, 0.1),
        show("* ???", 0.2, 0.2),
        show("* ???", 0.2, 0.2),
        show("* ???", 0.2, 0.2)
    ];

    var log = window.location.search.indexOf("update") > -1 ? update : install;

    asyncForEach(log).then(function() {
        vm.output.push("<div class='cursor'></div>");
    });

    function asyncForEach(arr) {
        var deferred = $q.defer(),
            i = -1;

        function loop() {
            i++;

            if (i > arr.length - 1) {
                deferred.resolve();
                return;
            }

            $q.when(arr[i](), loop);
        }

        loop();

        return deferred.promise;
    }

    function input(string, seconds, variation) {
        return write(string, seconds, variation, true);
    }

    function write(string, seconds, variation, sameLine) {
        return function() {
            if (!sameLine)
                vm.output.push(vm.user + "$ ");

            var steps = string.split("").map(function(char) {
                return function() {
                    var deferred = $q.defer(),
                        pauseFunc = pause(seconds, variation);

                    pauseFunc().then(function() {
                        vm.output[vm.output.length - 1] += char;
                        deferred.resolve();
                    });

                    return deferred.promise;
                };
            });

            return asyncForEach(steps);
        };
    }

    function show(string, seconds, variation) {
        return function() {
            var deferred = $q.defer(),
                pauseFunc = pause(seconds, variation);

            pauseFunc().then(function() {
                vm.output.push(string);
                deferred.resolve();
            });

            return deferred.promise;
        };
    }

    function clear(rows) {
        return function() {
            if (!rows)
                rows = vm.output.length;

            vm.output.splice(vm.output.length - rows, rows);
        };
    }

    function pause(seconds, variation) {
        return function() {
            var timeout = seconds*1000;

            if (variation)
                timeout += Math.random() * variation * 2000 - variation * 1000;

            return $timeout(function() {}, Math.floor(timeout) || 0);
        };
    }
}