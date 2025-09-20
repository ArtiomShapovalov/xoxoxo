//
//  GameResult.swift
//  xoxox
//
//  Created by Artem Shapovalov on 20.09.2025.
//

import Foundation

struct GameResult: Codable {
  enum Keys: CodingKey {
    case message
  }
  
  var message: String
  
  init(from decoder: any Decoder) throws {
    let container = try decoder.container(keyedBy: Keys.self)
    message = try container.decode(String.self, forKey: .message)
  }
  
  func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: Keys.self)
    try container.encode(message, forKey: .message)
  }
}
