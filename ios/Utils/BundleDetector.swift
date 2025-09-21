//
//  BundleDetector.swift
//  xoxox
//
//  Created by Artem Shapovalov on 20.09.2025.
//

import Foundation

final class BundleDetector {
    public static func get() -> Bundle {
        Bundle(for: BundleDetector.self)
    }
}
