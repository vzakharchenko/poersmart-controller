/**
 *  Poersmart Node
 *
 *  Copyright 2018 Vasiliy Zakharchenko
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License. You may obtain a copy of the License at:
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 *  for the specific language governing permissions and limitations under the License.
 *
 */
metadata {
    definition(name: "Poersmart Node", namespace: "smartthings-users", author: "Vasiliy Zakharchenko") {
        capability "Sensor"
        capability "Actuator"
        capability "Battery"
        capability "Thermostat Heating Setpoint"
        capability "Thermostat Mode"
        capability "Temperature Measurement"
        capability "Relative Humidity Measurement"
        capability "Switch"
        attribute "Id", "string"
        attribute "NodeName", "string"
        attribute "NodeSN", "string"
        attribute "manTemp", "number"
        attribute "ecoTemp", "number"
        attribute "offTemp", "number"
        attribute "sptTemp", "number"
        attribute "actuatorStatus", "string"
        attribute "actuatorErrorMessage", "string"
        attribute "actuatorLinkStatus", "string"
        attribute "actuatorHeatStatus", "string"
        attribute "supportedModes", "string"

        command "refresh"
        command "cycleMode"
        command "lowerHeatingSetpoint"
        command "raiseHeatingSetpoint"
    }


    tiles(scale: 2) {
        valueTile("modeLabel", "device.thermostatMode", width: 4, height: 2) {
            state "thermostatMode", label: 'Thermostat Mode:', unit: ""
        }
        standardTile("mode", "device.thermostatMode", width: 2, height: 2, decoration: "flat") {
            state "OFF", action: "cycleMode", nextState: "updating", icon: "st.thermostat.heating-cooling-off", backgroundColor: "#CCCCCC", defaultState: true
            state "MAN", action: "cycleMode", nextState: "updating", icon: "st.thermostat.heat"
            state "ECO", action: "cycleMode", nextState: "updating", icon: "st.thermostat.cool"
            state "AUTO", action: "cycleMode", nextState: "updating", icon: "st.thermostat.heat-auto"
            state "AUTO/MAN", action: "cycleMode", nextState: "updating", icon: "st.thermostat.emergency-heat"
            state "updating", label: "Working"
        }
        valueTile("heatingLabel", "device.actuatorHeatStatus", width: 4, height: 1) {
            state "actuatorHeatStatus", label: 'Actuator:', unit: ""
        }
        standardTile("heating", "device.actuatorHeatStatus", width: 2, height: 1, decoration: "flat") {
            state "false", backgroundColor: "#CCCCCC"
            state "true", icon: "st.thermostat.heating", backgroundColor: "#F3FF00"
        }

        valueTile("battery", "device.battery", decoration: "flat", inactiveLabel: false, width: 2, height: 2) {
            state "battery", label: '${currentValue}%', unit: "%", icon: "https://raw.githubusercontent.com/bspranger/Xiaomi/master/images/XiaomiBattery.png",
                    backgroundColors: [
                            [value: 10, color: "#bc2323"],
                            [value: 26, color: "#f1d801"],
                            [value: 51, color: "#44b621"]
                    ]
        }
        valueTile("humidity", "device.humidity", inactiveLabel: false, width: 2, height: 2) {
            state "humidity", label: '${currentValue}%', unit: "%", icon: "https://raw.githubusercontent.com/bspranger/Xiaomi/master/images/XiaomiHumidity.png",
                    backgroundColors: [
                            [value: 0, color: "#FFFCDF"],
                            [value: 4, color: "#FDF789"],
                            [value: 20, color: "#A5CF63"],
                            [value: 23, color: "#6FBD7F"],
                            [value: 56, color: "#4CA98C"],
                            [value: 59, color: "#0072BB"],
                            [value: 76, color: "#085396"]
                    ]
        }
        valueTile("temperature", "device.temperature", inactiveLabel: false, width: 2, height: 2) {
            state "temperature", label: '${currentValue}°', icon: "st.Weather.weather2",
                    backgroundColors: [
                            [value: 31, color: "#153591"],
                            [value: 44, color: "#1e9cbb"],
                            [value: 59, color: "#90d2a7"],
                            [value: 74, color: "#44b621"],
                            [value: 84, color: "#f1d801"],
                            [value: 95, color: "#d04e00"],
                            [value: 96, color: "#bc2323"]
                    ]
        }
        standardTile("lowerHeatingSetpoint", "device.heatingSetpoint", width: 2, height: 1, inactiveLabel: false, decoration: "flat") {
            state "heatingSetpoint", action: "lowerHeatingSetpoint", icon: "st.thermostat.thermostat-left"
        }
        valueTile("heatingSetpoint", "device.heatingSetpoint", width: 2, height: 1, inactiveLabel: false, decoration: "flat") {
            state "heatingSetpoint", label: '${currentValue}° heat', backgroundColor: "#ffffff"
        }
        standardTile("raiseHeatingSetpoint", "device.heatingSetpoint", width: 2, height: 1, inactiveLabel: false, decoration: "flat") {
            state "heatingSetpoint", action: "raiseHeatingSetpoint", icon: "st.thermostat.thermostat-right"
        }
        standardTile("buttonOffMode", "device.thermostatMode", width: 1, height: 1) {
            state "thermostatMode", label: 'Off', action: "off", icon: "st.thermostat.heating-cooling-off", backgroundColor: "#ffffff"
        }
        standardTile("buttonAuto", "device.thermostatMode", width: 1, height: 1, decoration: "flat") {
            state "thermostatMode", label: 'AUTO', action: "auto", backgroundColor: "#ffffff"
        }
        standardTile("buttonMan", "device.thermostatMode", width: 1, height: 1, decoration: "flat") {
            state "thermostatMode", label: 'MAN', action: "heat", backgroundColor: "#ffffff"
        }
        standardTile("buttonECO", "device.thermostatMode", width: 1, height: 1, decoration: "flat") {
            state "thermostatMode", label: 'ECO', action: "eco", backgroundColor: "#ffffff"
        }
        standardTile("buttonEmergencyHeat", "device.thermostatMode", width: 2, height: 1, decoration: "flat") {
            state "thermostatMode", label: 'Emergency Heat', action: "emergencyHeat", backgroundColor: "#ffffff"
        }
        // the "switch" tile will appear in the Things view
        main("temperature")

        // the "switch" and "power" tiles will appear in the Device Details
        // view (order is left-to-right, top-to-bottom)
        details([
                "lowerHeatingSetpoint", "heatingSetpoint", "raiseHeatingSetpoint",
                "modeLabel", "mode",
                "heatingLabel", "heating",
                "buttonOffMode", "buttonAuto", "buttonMan", "buttonECO", "buttonEmergencyHeat",
                "battery", "temperature", "humidity"
        ])
    }
}

// handle commands
def setHeatingSetpoint(degrees) {
    runIn(2, "updateSetpoints", [data: [degrees: degrees, mode: device.currentValue("thermostatMode")], overwrite: true])
}

def off() {
    updateThermostatMode('OFF')
}

// handle commands
def on() {
    auto();
}

def heat() {
    updateThermostatMode('MAN')
}

def eco() {
    updateThermostatMode('ECO')
}

def emergencyHeat() {
    runIn(2, "setGetThermostatMode", [data: [nextMode: 'MAN'], overwrite: true])
    runIn(5, "updateSetpoints", [data: [degrees: 25, mode: device.currentValue("thermostatMode")], overwrite: true])
}

def cool() {
    off();
}

def auto() {
    updateThermostatMode('AUTO')
}

def setThermostatMode(String value) {
    updateThermostatMode(value)
}

def refresh() {

    def supportedModes = []
    supportedModes << "OFF"
    supportedModes << "MAN"
    supportedModes << "ECO"
    supportedModes << "AUTO"
    debug("supportedModes:" + new groovy.json.JsonBuilder(supportedModes).toPrettyString())
    sendEvent(name: "supportedModes", value: new groovy.json.JsonBuilder(supportedModes).toPrettyString())
    debug("starting refreshing Device: $getDevice()")

    def node = parent.pollNode(getDevice())
    def curTemp = node.currentTemp / 10
    def manTemp = node.manTemp / 10
    def ecoTemp = node.ecoTemp / 10
    def offTemp = node.offTemp / 10
    def sptTemp = node.sptTemp / 10
    def modeTemp = sptTemp
    sendEvent(name: "Id", value: node.Id)
    sendEvent(name: "NodeName", value: node.NodeName)
    sendEvent(name: "NodeSN", value: node.NodeSN)
    sendEvent(name: "battery", value: node.BatteryPercent)
    sendEvent(name: "humidity", value: node.Humidity)
    sendEvent(name: "thermostatMode", value: node.mode)
    sendEvent(name: "temperature", value: curTemp)

    sendEvent(name: "manTemp", value: manTemp)
    sendEvent(name: "ecoTemp", value: ecoTemp)
    sendEvent(name: "offTemp", value: offTemp)
    sendEvent(name: "sptTemp", value: sptTemp)

    sendEvent(name: "heatingSetpoint", value: modeTemp)

    sendEvent(name: "actuatorStatus", value: node.actuatorStatus.GetStatus)
    sendEvent(name: "actuatorErrorMessage", value: node.actuatorStatus.ErrorMessage)
    sendEvent(name: "actuatorLinkStatus", value: node.actuatorStatus.LinkStatus)
    sendEvent(name: "actuatorHeatStatus", value: node.actuatorStatus.HeatStatus)

}

def updateThermostatMode(mode) {
    runIn(2, "setGetThermostatMode", [data: [nextMode: mode], overwrite: true])
}

def cycleMode() {
    log.trace "Executing 'cycleMode'"
    def currentMode = device.currentValue("thermostatMode")

    if (currentMode == 'AUTO/MAN') {
        updateThermostatMode('OFF')
    } else {
        def supportedModes = new groovy.json.JsonSlurper().parseText(device.currentValue("supportedModes"))
        def next = { supportedModes[supportedModes.indexOf(it) + 1] ?: supportedModes[0] }
        def nextMode = next(currentMode)
        updateThermostatMode(nextMode)
    }
}

def setGetThermostatMode(data) {
    debug("setGetThermostatModeData = ${data}")
    parent.apiGet("changeMode", [mode: data.nextMode, nodeId: device.currentValue("Id")])
}

def updateSetpoints(data) {
    debug("updateSetpoints = ${data}")
    parent.apiGet("setTemp", [value: data.degrees, type: data.mode, nodeId: device.currentValue("Id")])
}

def raiseHeatingSetpoint() {
    alterSetpoint(true)
}

def lowerHeatingSetpoint() {
    alterSetpoint(false)
}

def alterSetpoint(raise) {
    def modeTemp = device.currentValue("heatingSetpoint");
    def delta = 0.5;
    def targetValue = modeTemp
    targetValue += raise ? delta : -delta
    sendEvent(name: "heatingSetpoint", value: targetValue, eventType: "ENTITY_UPDATE", displayed: false);
    targetValue = targetValue * 10
    setHeatingSetpoint(targetValue.intValue())

}

def debug(message) {
    def debug = false
    if (debug) {
        log.debug message
    }
}