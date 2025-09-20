//
//  API.swift
//  xoxox
//
//  Created by Artem Shapovalov on 20.09.2025.
//

import React

@objc(API)
final class API: NSObject {
  enum Endpoint: String {
    case postGameResult = "https://xoxox.com/gameResult"
  }
  
  private let fetcher = Fetcher()
  private let decoder = JSONDecoder()
  private var userId: String {
    let ud = UserDefaults.standard
    let key = UserDefaults.Keys.userId.rawValue
    
    if let id = ud.string(forKey: key) {
      return id
    }
    
    let id = UUID().uuidString
    ud.set(id, forKey: key)
    return id
  }
  
  @objc func sendGameResult(_ result: String, onResponse: @escaping RCTResponseSenderBlock) {
    Task {
      let body = ["user-id": userId, "result": result]
      var rnResult = [NSNull(), userId]
      
      defer { onResponse(rnResult) }
      
      do {
        let (_, data) = try await fetcher.post(endpoint: Endpoint.postGameResult.rawValue,
                                               bodyParams: body)
        
        guard let data else {
          rnResult.append("Data is empty")
          return
        }
        
        let gameResult = try decoder.decode(GameResult.self, from: data)
        rnResult.append(gameResult.message)
      } catch {
        rnResult.append("Request not handled")
      }
    }
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
