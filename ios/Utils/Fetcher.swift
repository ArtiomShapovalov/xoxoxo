//
//  Fetcher.swift
//  xoxox
//
//  Created by Artem Shapovalov on 20.09.2025.
//

import Foundation

final class Fetcher {
  typealias AsyncResult = (URLResponse, Data?)
  
  enum Failure: Error {
    case cantBuildRequest
    case unexpectedResponse
    case tokenExpired
    case urlError(URLError)
    case unexpectedError
  }
  
  private let session = URLSession.shared
  private var jsonContentType: String { "application/json" }
  
  func post(endpoint: String,
            params: [String: String?]? = nil,
            bodyParams: [String: Any]
  ) async throws -> AsyncResult {
    let data = try? JSONSerialization.data(withJSONObject: bodyParams, options: [])
    
    guard let data else {
      throw Failure.cantBuildRequest
    }
    guard let url = endpoint.url(query: params) else {
      throw Failure.cantBuildRequest
    }
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.httpBody = data
    request.setValue(jsonContentType, forHTTPHeaderField: "Content-Type")
    request.setValue(jsonContentType, forHTTPHeaderField: "Accept")

    let res = try await call(request: &request)
    return res
  }
  
  func call(request: inout URLRequest) async throws -> AsyncResult {
    let (data, response) = try await session.data(for: request)
    
    if let res = response as? HTTPURLResponse,
       [400, 401, 403].contains(res.statusCode) {
      throw Failure.tokenExpired
    }
    
    if data.count == 0 {
      return (response, nil)
    }
    
    return (response, data)
  }
}
