/*
 * View model for ManualProbeAssistant
 *
 * Author: Joshua Orender
 * License: AGPLv3
 */
$(function() {
    function ManualProbeAssistantViewModel(parameters) {
        var self = this;

        self.delta_l = ko.observable();
        self.delta_r = ko.observable();
        self.delta_z = ko.observable();

        self.trim_x = ko.observable();
        self.trim_y = ko.observable();
        self.trim_z = ko.observable();

        self.fromCurrentData = function(data){
            //var match665 = "/[lrz]:?\s+(\d+\.\d+)/i";
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

        // assign the injected parameters, e.g.:
        // self.loginStateViewModel = parameters[0];
        // self.settingsViewModel = parameters[1];


    }

    // view model class, parameters for constructor, container to bind to
    OCTOPRINT_VIEWMODELS.push([
        ManualProbeAssistantViewModel,

        // e.g. loginStateViewModel, settingsViewModel, ...
        [ /* "loginStateViewModel", "settingsViewModel" */ ],

        // e.g. #settings_plugin_ManualProbeAssistant, #tab_plugin_ManualProbeAssistant, ...
        [ "#tab_plugin_ManualProbeAssistant" ]
    ]);
});
