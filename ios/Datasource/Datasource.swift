//
//  Datasource.swift
//  xoxox
//
//  Created by Artem Shapovalov on 20.09.2025.
//

import CoreData

@MainActor
final class Datasource {
  private lazy var persistentStoreCoordinator: NSPersistentStoreCoordinator? = {
      let modelURL = BundleDetector.get().url(
          forResource: "UserData",
          withExtension: "momd"
      )
      
      guard let modelURL, let model = NSManagedObjectModel(contentsOf: modelURL)
      else { return nil }
      
      let dirURL = FileManager.default.urls(
          for: .documentDirectory,
          in: .userDomainMask
      ).last
      
      let storeURL = URL(
          string: "UserData.sqlite",
          relativeTo: dirURL
      )
      
      guard let storeURL else { return nil }

      let coordinator = NSPersistentStoreCoordinator(managedObjectModel: model)
      
      let options = [NSMigratePersistentStoresAutomaticallyOption: true,
                           NSInferMappingModelAutomaticallyOption: true]
      _ = try? coordinator.addPersistentStore(
          type: .sqlite,
          at: storeURL,
          options: options
      )
      return coordinator
  }()
  
  private lazy var context: NSManagedObjectContext? = {
      guard let persistentStoreCoordinator else { return nil }
      
      let context = NSManagedObjectContext(concurrencyType: .mainQueueConcurrencyType)
      context.persistentStoreCoordinator = persistentStoreCoordinator
      return context
  }()
  
  private func createGameSession(userId: String,
                                 winCount: Int = 0,
                                 seconds: Int = 0,
                                 milliseconds: Int = 0)
  {
    guard let context else { return }
    
    let newSession = XOXGameSession(context: context)
    newSession.userId = userId
    newSession.winCount = Int64(winCount)
    newSession.seconds = Int16(seconds)
    newSession.milliseconds = Int16(milliseconds)
    newSession.isEnded = false
    newSession.dateCreated = Date()
    try? context.save()
  }
  
  func updateGameSession(userId: String, seconds: Int, milliseconds: Int, isEnded: Bool) {
    guard let context else { return }
    
    let request = XOXGameSession.fetchRequest()
    let sortKey = "dateCreated"
    let sortDescriptor = NSSortDescriptor(key: sortKey, ascending: false)
    request.sortDescriptors = [sortDescriptor]
    request.fetchLimit = 1
    
    guard let results = try? context.fetch(request) else { return }
    
    /// No sessions yet, create the first one
    guard let lastSession = results.first else {
      if isEnded {
        return
      }
      
      createGameSession(userId: userId,
                        winCount: 1,
                        seconds: seconds,
                        milliseconds: milliseconds)
      return
    }
    
    /// Lost, mark the last session as ended
    if isEnded {
      if lastSession.winCount == 0 {
        return
      }
      
      lastSession.isEnded = true
      try? context.save()
      createGameSession(userId: userId)
      return
    }
    
    /// Won, increase the win count and overall time
    var ms = Int(lastSession.milliseconds) + milliseconds
    let secs = Int(Float(ms) / 1000) + seconds
    ms = ms % 1000
    lastSession.seconds += Int16(secs)
    lastSession.milliseconds = Int16(ms)
    lastSession.winCount += 1
    try? context.save()
  }
  
  func getGameSessions() -> Array<[String: Any]>? {
    guard let context else { return nil }
    
    let request = XOXGameSession.fetchRequest()
    let sortByWinCount = NSSortDescriptor(key: "winCount", ascending: false)
    let sortBySecs = NSSortDescriptor(key: "seconds", ascending: true)
    let sortByMs = NSSortDescriptor(key: "milliseconds", ascending: true)
    request.sortDescriptors = [sortByWinCount, sortBySecs, sortByMs]
    
    guard let results = try? context.fetch(request) else { return nil }
    
    return results.map {
      ["userId": $0.userId,
       "seconds": $0.seconds,
       "milliseconds": $0.milliseconds,
       "winCount": $0.winCount,
       "isEnded": $0.isEnded]
    }
  }
  
  func clearStore() {
    guard let context,
          let entities = persistentStoreCoordinator?.managedObjectModel.entities
    else { return }
    
    for entity in entities {
      guard let name = entity.name else { continue }
      
      let fetchReq: NSFetchRequest<NSFetchRequestResult> = NSFetchRequest(entityName: name)
      let deleteReq = NSBatchDeleteRequest(fetchRequest: fetchReq)
      _ = try? context.execute(deleteReq)
    }
    
    try? context.save()
  }
}
