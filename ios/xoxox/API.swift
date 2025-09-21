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
  private var datasource: Datasource?
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
  
  override init() {
    super.init()
    Task {
      datasource = await Datasource()
    }
  }
  
  @objc func sendGameResult(_ result: String,
                            onResponse: @escaping RCTResponseSenderBlock)
  {
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
  
  @objc func saveProgress(_ isEnded: NSNumber,
                          seconds: NSNumber,
                          milliseconds: NSNumber)
  {
    Task {
      await datasource?.updateGameSession(userId: userId,
                                         seconds: seconds.intValue,
                                         milliseconds: milliseconds.intValue,
                                         isEnded: isEnded.boolValue)
    }
  }
  
  @objc func getSessions(_ onCompletion: @escaping RCTResponseSenderBlock) {
    Task {
      let sessions = await datasource?.getGameSessions() ?? []
      onCompletion([NSNull(), sessions])
    }
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
