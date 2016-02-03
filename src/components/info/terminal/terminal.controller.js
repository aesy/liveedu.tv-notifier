angular
    .module("app")
    .controller("terminalCtrl", terminalCtrl);

terminalCtrl.$inject = ["$location", "livecodingService"];

function terminalCtrl($location, livecoding) {
    var vm = this;

    var name = "user";
    vm.user = name + "@livecoding: ~";

    vm.output = [];

    if ($location.search().hasOwnProperty("auth")) {
        auth();
    } else if($location.search().hasOwnProperty("update")) {
        //update();
    } else if ($location.search().hasOwnProperty("install")) {
        install();
    }

    function auth() {
        vm.output.push.apply(vm.output, [
            {
                preword: vm.user + "$ ",
                words: ["curl -H \"Authorization: Basic user@livecoding\""],
                typeTime: 50,
                delay: 2000
            }, {
                words: ["Content-Type: application/x-www-form-urlencoded;charset=utf-8"],
                typeTime: 50
            }, {
                words: ["https://www.livecoding.tv/o/token/"],
                typeTime: 50,
                pause: 1000
            }
        ]);

        livecoding.authorize($location.search().code).then(function() {
            vm.output.push({
                words: ["Authorization Successful :-)"],
                typeTime: 100
            });
        }, function() {
            vm.output.push({
                words: ["Authorization Failed :-("],
                typeTime: 100
            });
        });

        $location.url($location.path());
    }

    function update() {
        vm.output.push.apply(vm.output, [
            {
                preword: vm.user + "$ ",
                words: ["wget https://clients2.google.com/service/update2/LiveCoding.tv-Notifier.zip"],
                typeTime: 100,
                delay: 2000,
                pause: 500
            }, {
                words: ["Resolving clients2.google.com (clients2.google.com)... 192.168.0.1, 18b02:35:1:7::1"],
                pause: 200
            }, {
                words: ["Connecting to clients2.google.com (clients2.google.com)|192.168.0.1|:80... connected."],
                pause: 200
            }, {
                words: ["HTTP request sent, awaiting response... 200 OK"],
                pause: 200
            }, {
                words: ["Length: 65557980 (6.5MB) [application/zip]"],
                pause: 200
            }, {
                words: ["Saving to: 'LiveCoding.tv-Notifier.zip'"],
                pause: 200
            }, {
                preword: "6.52MB ",
                words: [".", ".", ".", "."],
                typeTime: 1000,
                pause: 1000
            }, {
                words: [new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + " (1.08 MB/s) - 'LiveCoding.tv-Notifier.zip' saved [65557980/65557980]"],
                pause: 200
            }, {
                preword: vm.user + "$ ",
                words: ["aptitude update LiveCoding.tv-Notifier.zip"],
                typeTime: 100,
                delay: 1000,
                pause: 500
            }, {
                words: ["(Reading database... 36453 files and directories currently installed.)"],
                pause: 200
            }, {
                words: ["Unpacking undefined (from ./LiveCoding.tv-Notifier.zip) ..."],
                pause: 200
            }, {
                words: ["Removing any system startup links for /etc/init.d/LiveCoding.tv-Notifier ..."],
                pause: 200
            }, {
                words: ["Processing triggers for install-info (50.2.00.2fsg.1-2) ..."],
                pause: 200
            }, {
                words: ["Setting up LiveCoding.tv-Notifier (3.5-0ubuntu1) ..."],
                pause: 200
            }, {
                words: ["LiveCoding.tv-Notifier successfully updated!"],
                pause: 2000
            }
        ]);
    }

    function install() {
        vm.output.push.apply(vm.output, [
            {
                preword: vm.user + "$ ",
                words: ["apt-get install LiveCoding.tv-Notifier"],
                typeTime: 100,
                delay: 2000,
                pause: 500
            }, {
                words: ["E: Could not open lock file /var/lib/dpkg/lock - open (13: Permission denied)"],
                pause: 200
            }, {
                words: ["E: Unable to lock the administration directory (/var/lib/dpkg/), are you root?"],
                pause: 200
            }, {
                preword: vm.user + "$ ",
                words: ["sudo apt-get -f install LiveCoding.tv-Notifier"],
                typeTime: 100,
                delay: 1000,
                pause: 500
            }, {
                preword: "[sudo] password for " + name + ": ",
                words: ["hunter2"],
                typeTime: 100,
                delay: 1000,
                pause: 1000
            }, {
                words: ["Reading package lists... Done"],
                pause: 200
            }, {
                words: ["Building dependency tree"],
                pause: 200
            }, {
                words: ["Reading state information... Done"],
                pause: 200
            }, {
                words: ["0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded."],
                pause: 200
            }, {
                words: ["Need to get 0 B/2.51 MB of archives."],
                pause: 200
            }, {
                words: ["After this operation, " + (Math.random() * 3 + 5).toFixed(2) + " MB of additional disk space will be used."],
                pause: 200
            }, {
                words: ["Selecting previously unselected package LiveCoding.tv-Notifier."],
                pause: 200
            }, {
                words: ["(Reading database ... " + Math.floor(Math.random() * 500) + " files and directories currently installed. )"],
                pause: 200
            }, {
                words: ["Preparing to unpack .../LiveCoding.tv-Notifier_0.9.0-1ubuntu1_amd64.deb ..."],
                pause: 200
            }, {
                words: ["Unpacking LiveCoding.tv-Notifier (0.9.0-1ubuntu1) ..."],
                pause: 200
            }, {
                words: ["Processing triggers for install-info (50.2.00.2fsg.1-2) ..."],
                pause: 200
            }, {
                words: ["Processing triggers for man-db (2.6.7.1-1ubuntu1) ..."],
                pause: 200
            }, {
                words: ["Setting up LiveCoding.tv-Notifier (0.9.0-1ubuntu1) ..."],
                pause: 200
            }, {
                words: ["LiveCoding.tv-Notifier successfully installed!"],
                pause: 200
            }, {
                words: [" "],
                pause: 2000
            }, {
                preword: vm.user + "$ ",
                words: ["Make sure to authorize your account in the settings to sync your favorites!"],
                typeTime: 100,
                pause: 200
            }, {
                words: ["No command 'Make' found."],
                pause: 200
            }, {
                preword: vm.user + "$ ",
                words: ["And feel free to submit issues and feature requests on Github!"],
                typeTime: 100,
                pause: 200
            }, {
                words: ["No command 'And' found."],
                pause: 200
            }
        ]);
    }

}