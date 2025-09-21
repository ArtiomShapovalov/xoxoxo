//
//  XOXGameSession+CoreDataProperties.swift
//  
//
//  Created by Artem Shapovalov on 20.09.2025.
//
//

public import Foundation
public import CoreData


public typealias XOXGameSessionCoreDataPropertiesSet = NSSet

extension XOXGameSession {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<XOXGameSession> {
        return NSFetchRequest<XOXGameSession>(entityName: "XOXGameSession")
    }

    @NSManaged public var milliseconds: Int16
    @NSManaged public var seconds: Int16
    @NSManaged public var userId: String?
    @NSManaged public var winCount: Int64
    @NSManaged public var dateCreated: Date?
    @NSManaged public var isEnded: Bool

}
