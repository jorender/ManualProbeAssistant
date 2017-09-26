# coding=utf-8
from __future__ import absolute_import

### (Don't forget to remove me)
# This is a basic skeleton for your plugin's __init__.py. You probably want to adjust the class name of your plugin
# as well as the plugin mixins it's subclassing from. This is really just a basic skeleton to get you started,
# defining your plugin as a template plugin, settings and asset plugin. Feel free to add or remove mixins
# as necessary.
#
# Take a look at the documentation on what other plugin mixins are available.

import octoprint.plugin
import flask, json


class ManualProbeAssistantPlugin(octoprint.plugin.SettingsPlugin,
                                 octoprint.plugin.AssetPlugin,
                                 octoprint.plugin.TemplatePlugin,
                                 octoprint.plugin.StartupPlugin,
                                 octoprint.plugin.BlueprintPlugin):

    def is_blueprint_protected(self):
        return False

    @octoprint.plugin.BlueprintPlugin.route("/getprobe", methods=["GET"])
    def calculate_probe(self):
        # http://www.escher3d.com/pages/wizards/wizarddelta.php
        # http://www.escher3d.com/pages/wizards/js/delta_calibration_wizard.js

        # function calc()
        # function DoDeltaCalibration() {

        json_in = '"rod_length":216.5,' \
                  '"radius": 98.52, ' \
                  '"homed_height": 204.232, ' \
                  '"old_trim_x": 1.290, ' \
                  '"old_trim_y": 0.280, ' \
                  '"old_trim_z": -1.570, ' \
                  '[{"x": 0,"y": 0,"error": 5.8},' \
                  '{"x": 0.00,"y": 60.00,"error": 5.84},' \
                  '{"x": 51.96,"y": 30.00,' '"error": 5.86},' \
                  '{"x": 51.96,"y": -30.00,"error": 5.8},' \
                  '{"x": 0,"y": -60.00,"error": 5.68},' \
                  '{"x": -51.96,"y": -30.00,"error": 5.57},' \
                  '{"x": -51.96,"y": 30.00,"error": 5.69}]'

        x_stop = 0
        y_stop = 0
        z_stop = 0

        raw_json = json.loads(json_in)
        point_one_x = raw_json[0]['x']
        return flask.make_response(str(point_one_x), 200)

    def on_after_startup(self):
        message = "Manual Probe Assistant - Bed Radius - {}".format(self._settings.get(["bed_radius"]))
        self._logger.info(message)

    def get_settings_defaults(self):
        return dict(
            bed_radius="60"
        )

    def get_template_vars(self):
        return dict(
            bed_radius=self._settings.get(["bed_radius"])
        )

    # AssetPlugin mixin
    def get_assets(self):
        return dict(
            js=["js/ManualProbeAssistant.js"],
            css=["css/ManualProbeAssistant.css"],
            less=["less/ManualProbeAssistant.less"]
        )

    # Softwareupdate hook
    def get_update_information(self):
        # Define the configuration for your plugin to use with the Software Update
        #  Plugin here. See https://github.com/foosel/OctoPrint/wiki/Plugin:-Software-Update
        #  for details.
        return dict(
            ManualProbeAssistant=dict(
                displayName="ManualProbeAssistant Plugin",
                displayVersion=self._plugin_version,

            # version check: github repository
                type="github_release",
                user="jorender",
                repo="ManualProbeAssistant",
                current=self._plugin_version,

            # update method: pip
                pip="https://github.com/jorender/ManualProbeAssistant/archive/{target_version}.zip"
        )
    )


# If you want your plugin to be registered within OctoPrint under a different name than what you defined in setup.py
# ("OctoPrint-PluginSkeleton"), you may define that here. Same goes for the other metadata derived from setup.py that
# can be overwritten via __plugin_xyz__ control properties. See the documentation for that.
__plugin_name__ = "Manual Probe Assistant"


def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = ManualProbeAssistantPlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }
