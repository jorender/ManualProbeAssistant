/*
 * View model for ManualProbeAssistant
 *
 * Author: Joshua Orender
 * License: AGPLv3
 */
$(function() {
    function ManualProbeAssistantViewModel(parameters) {
        var self = this;
        self.settingsViewModel = parameters[0];
        self.loginState = parameters[1];

        self._createPoint = function(){
            return {
                idx: ko.observable(),
                x: ko.observable(),
                y: ko.observable(),
                error:ko.observable()
            }
        }

        self.probe_points = ko.observableArray([]);

        self.current_x = ko.observable();
        self.current_y = ko.observable();
        self.current_z = ko.observable();

        self.delta_l = ko.observable();
        self.delta_r = ko.observable();
        self.delta_z = ko.observable();

        self.trim_x = ko.observable();
        self.trim_y = ko.observable();
        self.trim_z = ko.observable();
        self.bed_radius = ko.observable();

        self.isOperational = ko.observable();
        self.isPrinting = ko.observable();

        self._processStateData = function(data){
            self.isOperational(data.flags.operational);
            self.isPrinting(data.flags.printing)
        }

        self.onEventPositionUpdate = function(data){
            self.current_x(data.x);
            self.current_y(data.y);
            self.current_z(data.z);
        }

        self.onUserLoggedIn = function(){
            self.getSettings();
            self.getProbePoints();
        }

        self.onBeforeBinding = function(){
            self.settings = self.settingsViewModel.settings;
        }

        self.onAfterBinding = function(){
            self.bed_radius(self.settings.plugins.ManualProbeAssistant.bed_radius())
        }

        self.getProbePoints = function(){
            var points = self.probe_points();

            if(points.length == 0){
                points[0] = self._createPoint();
            }

            points[0]["idx"](1);
            points[0]["x"](0);
            points[0]["y"](0);
            points[0]["error"](0);

            for (var i = 0; i < 6; ++i){
                if(!points[i+1]){
                    points[i+1] = self._createPoint();
                }

                points[i+1]["idx"](i+2);
                points[i+1]["x"]((self.bed_radius() * Math.sin((2 * Math.PI * i)/6)).toFixed(2));
                points[i+1]["y"]((self.bed_radius() * Math.cos((2 * Math.PI * i)/6)).toFixed(2));
                points[i+1]["error"](0);
            }

            self.probe_points(points);
        }

        self.fromCurrentData = function(data){
            self._processStateData(data.state);
            var expected_command_re = /M66[56]/;

            for (var i = 0; i < data.logs.length; i++){
                var message = data.logs[i];
                if(expected_command_re.test(message)){
                    var re = /M665.*L(-?\d+.\d{1,4})/g
                    if((match = re.exec(message)) != null)
                    {
                        self.delta_l(match[1]);
                    }

                    re = /M665.*R(-?\d+.\d{1,4})/g
                    if((match = re.exec(message)) != null)
                    {
                        self.delta_r(match[1]);
                    }

                    re = /M665.*Z(-?\d+.\d{1,4})/g
                    if((match = re.exec(message)) != null)
                    {
                        self.delta_z(match[1]);
                    }

                    re = /M666.*X(-?\d+.\d{1,4})/g
                    if((match = re.exec(message)) != null)
                    {
                        self.trim_x(match[1]);
                    }

                    re = /M666.*Y(-?\d+.\d{1,4})/g
                    if((match = re.exec(message)) != null)
                    {
                        self.trim_y(match[1]);
                    }

                    re = /M666.*Z(-?\d+.\d{1,4})/g
                    if((match = re.exec(message)) != null)
                    {
                        self.trim_z(match[1]);
                    }
                }
            }
        }

        self.getSettings = function(){
           var ret= OctoPrint.control.sendGcode('M503');
        };

        self.getPosition = function(){
            var ret = OctoPrint.control.sendGcode('M114');
        }
    }

    // view model class, parameters for constructor, container to bind to
    OCTOPRINT_VIEWMODELS.push([
        ManualProbeAssistantViewModel,

        // e.g. loginStateViewModel, settingsViewModel, ...
        [ "settingsViewModel", "loginStateViewModel"],

        // e.g. #settings_plugin_ManualProbeAssistant, #tab_plugin_ManualProbeAssistant, ...
        [ "#settings_plugin_ManualProbeAssistant", "#tab_plugin_ManualProbeAssistant" ]
    ]);
});
