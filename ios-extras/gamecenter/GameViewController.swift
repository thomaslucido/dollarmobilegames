import UIKit
import Capacitor

/// Bridge view controller that registers the app's local plugins (Game Center).
class GameViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(GameCenterPlugin())
    }
}
