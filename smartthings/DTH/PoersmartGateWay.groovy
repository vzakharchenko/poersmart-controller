/**
 *  Poersmart gateWay
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
    definition(name: "Poersmart GateWay", namespace: "smartthings-users", author: "Vasiliy Zakharchenko") {
        capability "Actuator"
        attribute "Id", "string"
        attribute "IpAddr", "string"
        attribute "GatewaySN", "string"
        attribute "GatewayName", "string"
        attribute "WifiRSSI", "number"
        attribute "Wifi", "String"
        attribute "IsOnline", "string"
        command refresh
    }


    simulator {
        // TODO: define status and reply messages here
    }

    tiles(scale: 2) {
        valueTile("GatewayNameLabel", "device.GatewayName", width: 3, height: 1) {
            state "GatewayName", label: 'GateWay Name', unit: ""
        }
        valueTile("GatewayName", "device.GatewayName", width: 3, height: 1) {
            state "GatewayName", label: '${currentValue}\n', unit: ""
        }

        valueTile("IsOnlineLabel", "device.IsOnline", width: 3, height: 2) {
            state "IsOnline", label: 'Status', unit: ""
        }
        valueTile("IsOnline", "device.IsOnline", width: 3, height: 2) {
            state "false", label: 'Offline', backgroundColor: "#ffffff"
            state "true", label: 'Online', backgroundColor: "#53a7c0"
        }

        valueTile("GatewaySNLabel", "device.GatewaySN", width: 3, height: 1) {
            state "GatewaySN", label: 'SN', unit: ""
        }

        valueTile("GatewaySN", "device.GatewaySN", width: 3, height: 1) {
            state "GatewaySN", label: '${currentValue}\n', unit: ""
        }

        valueTile("WifiLabel", "device.Wifi", width: 3, height: 2) {
            state "Wifi", label: 'WI-FI Level\n', unit: ""
        }

        valueTile("Wifi", "device.Wifi", width: 3, height: 2) {
            state "Week", label: 'Week', backgroundColor: "#ff0000"
            state "Fair", label: 'Fair', backgroundColor: "#FF7C00"
            state "Good", label: 'Good', backgroundColor: "#FFFF00"
            state "Excelent", label: 'Excelent', backgroundColor: "#00FF00"
        }
        // the "switch" tile will appear in the Things view
        main("Wifi")

        // the "switch" and "power" tiles will appear in the Device Details
        // view (order is left-to-right, top-to-bottom)
        details([
                "GatewayNameLabel", "GatewayName",
                "GatewaySNLabel", "GatewaySN",
                "IsOnline", "Wifi"
        ])
    }
}

def refresh() {
    debug("starting refreshing Device: $getDevice()")
    def gateway = parent.pollGateWay(getDevice())
    def wifiLevel = getWiFILevel(gateway.WifiRSSI);
    debug("wifiLevel: $wifiLevel")
    sendEvent(name: "Id", value: gateway.Id);
    sendEvent(name: "IpAddr", value: gateway.IpAddr);
    sendEvent(name: "GatewaySN", value: gateway.GatewaySN);
    sendEvent(name: "GatewayName", value: gateway.GatewaySN);
    sendEvent(name: "WifiRSSI", value: gateway.WifiRSSI);

    sendEvent(name: "Wifi", value: wifiLevel);
    sendEvent(name: "IsOnline", value: gateway.IsOnline);
}

def getWiFILevel(wifiRSSI) {
    def level = "Undefined"
    if (wifiRSSI < -70) {
        level = "Week"
    } else if (wifiRSSI > -70 && wifiRSSI < -60) {
        level = "Fair"
    } else if (wifiRSSI > -60 && wifiRSSI < -50) {
        level = "Good"
    } else {
        level = "Excelent"
    }
    return level
}

def debug(message) {
    def debug = false
    if (debug) {
        log.debug message
    }
}