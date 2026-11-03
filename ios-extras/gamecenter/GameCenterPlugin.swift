import Foundation
import Capacitor
import GameKit

/// Minimal Game Center bridge for the web game: sign in, post a score, show the leaderboard.
/// JS calls it through Capacitor as "GameCenter" (authenticate / submitScore / showLeaderboard).
@objc(GameCenterPlugin)
public class GameCenterPlugin: CAPPlugin, CAPBridgedPlugin, GKGameCenterControllerDelegate {
    public let identifier = "GameCenterPlugin"
    public let jsName = "GameCenter"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "authenticate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "submitScore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showLeaderboard", returnType: CAPPluginReturnPromise)
    ]

    private var pendingAuth: [CAPPluginCall] = []
    private var handlerSet = false

    @objc func authenticate(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let player = GKLocalPlayer.local
            if player.isAuthenticated {
                call.resolve(["authenticated": true])
                return
            }
            self.pendingAuth.append(call)
            if self.handlerSet { return }
            self.handlerSet = true
            player.authenticateHandler = { [weak self] viewController, _ in
                guard let self = self else { return }
                if let vc = viewController {
                    self.bridge?.viewController?.present(vc, animated: true)
                    return
                }
                let ok = GKLocalPlayer.local.isAuthenticated
                let calls = self.pendingAuth
                self.pendingAuth.removeAll()
                calls.forEach { $0.resolve(["authenticated": ok]) }
            }
        }
    }

    @objc func submitScore(_ call: CAPPluginCall) {
        guard let id = call.getString("leaderboardId"), let score = call.getInt("score") else {
            call.reject("leaderboardId and score are required")
            return
        }
        guard GKLocalPlayer.local.isAuthenticated else {
            call.reject("Game Center player is not signed in")
            return
        }
        GKLeaderboard.submitScore(score, context: 0, player: GKLocalPlayer.local, leaderboardIDs: [id]) { error in
            if let error = error { call.reject(error.localizedDescription) } else { call.resolve() }
        }
    }

    @objc func showLeaderboard(_ call: CAPPluginCall) {
        let id = call.getString("leaderboardId")
        DispatchQueue.main.async {
            let vc: GKGameCenterViewController
            if let id = id, GKLocalPlayer.local.isAuthenticated {
                vc = GKGameCenterViewController(leaderboardID: id, playerScope: .global, timeScope: .allTime)
            } else {
                vc = GKGameCenterViewController(state: .leaderboards)
            }
            vc.gameCenterDelegate = self
            self.bridge?.viewController?.present(vc, animated: true)
            call.resolve()
        }
    }

    public func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
        gameCenterViewController.dismiss(animated: true)
    }
}
