definition(
        name: "PoerSmart Thermostats",
        namespace: "smartthings-users",
        author: "Vasiliy Zakharchenko",
        description: "link PoersSmart to Smartthings",
        category: "My Apps",
        iconUrl: "http://letosmart.com/ua/uploads/sliders/2-485563962.png",
        iconX2Url: "http://letosmart.com/ua/uploads/sliders/2-485563962.png")

preferences {
    page(name: "config")
}

def config() {
    dynamicPage(name: "config", title: "PoerSmart Thermostat Manager", install: true, uninstall: true) {


        section("Setup my device with this IP") {
            input "IP", "string", multiple: false, required: true
        }
        section("Setup my device first port") {
            input "port", "number", multiple: false, required: true, defaultValue: 7000
        }
        section("on this hub...") {
            input "theHub", "hub", multiple: false, required: true
        }

        if (IP && port && theHub) {

            if (!state.backendInitialized) {
                section("Info") {
                    if (!app.id) {
                        paragraph "After click save, please, open this smartapp once again!"
                    } else if (!state.accessToken) {
                        paragraph "Did you forget to enable OAuth in SmartApp IDE settings?"
                    } else {
                        paragraph "Please set \"appId\": ${app.id}, \"accessToken\": ${state.accessToken} on backend($IP:$port)"
                    }
                }
            } else {
                if (state.gateWays != null) {
                    section("Node List") {
                        def nodeOptions = [];
                        state.gateWays.each { gid, gateway ->
                            gateway.nodes.each { nid, node -> nodeOptions.push(node.NodeName + "/#" + node.NodeSN)
                            }
                        }
                        debug("nodeOptions:$nodeOptions")
                        input "nodes", "enum", multiple: true, required: false, title: "Select Nodes (${nodeOptions.size()} found)", options: nodeOptions
                    }
                }
            }
        }
    }
}

def installed() {
    createAccessToken()
    getToken()
    initialize()
//	debug("Installed Phone with rest api: $app.id")
    // debug("Installed Phone with token: $state.accessToken")
}

def updated() {
    initialize()
}

mappings {
    path("/PoerSmart/init") {
        action:
        [
                POST: "poerSmartInitialization"
        ]
    }
}

def initialize() {
    unsubscribe();
    if (nodes) {
        nodes.each {
            def gtName = it;
            def gtId = getIdFromName(gtName)
            def node = getNode(gtId)
            createNodeDevice(node)
        }
    }
}

def updateDevices() {
    def gatewayDevices = searchDevicesType("Poersmart GateWay");
    if (gatewayDevices) {
        gatewayDevices.each { d -> d.refresh() }
    }
    def nodeDevices = searchDevicesType("Poersmart Node");

    if (nodeDevices) {
        nodeDevices.each { d -> d.refresh() }
    }
}

def pollGateWay(d) {
    def gateway = state.gateWays.get(d.getDeviceNetworkId())
    debug("meta: $gateway")
    return gateway.gateway
}

def pollNode(d) {
    def gateWays = state.gateWays
    def rnode = null;
    debug("d1: $d")
    gateWays.each { gid, gateway ->
        debug("gateway1: $gateway")
        gateway.nodes.each { nid, node ->
            debug("node1: $node")
            if (node.Id.toString() == d.getDeviceNetworkId()) {
                rnode = node;
            }
        }
    }
    debug("rnode1: $rnode")
    return rnode;
}

def createNodeDevice(node) {
    // gateway
    def gatewayDevices = searchDevicesType("Poersmart GateWay");
    def gatewayDevice = gatewayDevices.find {
        return it.getDeviceNetworkId() == node.GatewayId.toString()
    }

    def gateway = state.gateWays.get(node.GatewayId.toString()).gateway;

    if (gatewayDevice == null) {
        gatewayDevice = addChildDevice("smartthings-users", "Poersmart GateWay", node.GatewayId.toString(), theHub.id, [label: gateway.GatewayName, name: gateway.GatewayName])
    }
    gatewayDevice.refresh();
    // node
    def nodeDevices = searchDevicesType("Poersmart Node");
    def nodeDevice = nodeDevices.find {
        return it.getDeviceNetworkId() == node.Id.toString()
    }

    if (nodeDevice == null) {
        nodeDevice = addChildDevice("smartthings-users", "Poersmart Node", node.Id.toString(), theHub.id, [label: node.NodeName, name: node.NodeName])
    }
    nodeDevice.refresh();

}


def poerSmartInitialization() {
    def json = request.JSON;
    debug("json: $json")
    if (json.initialization != null) {
        state.initializationDate = json.initialization
        state.gateWays = json.nodes
        state.backendInitialized = true
        updateDevices()
    }

    return [status: json.initialization != null ? "ok" : "fail"]
}


def getIdFromName(name) {
    def s = name.split("/#")
    return s[1]
}

def getNode(gtId) {
    def rNode = null;
    state.gateWays.each { gid, gateway ->
        gateway.nodes.each { nid, node ->
            if (node.NodeSN == gtId) {
                rNode = node;
            }
        }
    }
    return rNode
}


def getToken() {
    if (!state.accessToken) {
        try {
            getAccessToken()
            debug("Creating new Access Token: $state.accessToken")
        } catch (ex) {
            debug(ex)
        }
    }
}

def searchDevicesType(devType) {
    def typeDevices = []
    childDevices.each {
        if (it.getTypeName() == devType) {
            typeDevices.add(it)
        }
    }
    return typeDevices
}

def searchDeviceStateAndType(devType, stateName, stateValue) {
    def device;
    childDevices.each {
        debug("check device type ${it.getTypeName()}")
        if (it.getTypeName() == devType) {
            def value = it.currentState(stateName).getStringValue()
            if (stateValue == value) {
                device = it
            }
        }
    }
    return device
}

def apiGet(path, query) {
    def url = "${IP}:${port}";
    log.debug "request:  ${url}/${path} query= ${query}"
    def result = new physicalgraph.device.HubAction(
            method: 'GET',
            path: "/${path}",
            headers: [
                    HOST  : url,
                    Accept: "*/*",
                    test  : "testData"
            ],
            query: query
    )

    return sendHubCommand(result)
}

def debug(message) {
    def debug = false
    if (debug) {
        log.debug message
    }
}