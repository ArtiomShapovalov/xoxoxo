//
//  API.m
//  xoxox
//
//  Created by Artem Shapovalov on 20.09.2025.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(API, NSObject)
 RCT_EXTERN_METHOD(sendGameResult:(nonnull NSString *)result
                   onResponse:(RCTResponseSenderBlock)onResponse)
 RCT_EXTERN_METHOD(saveProgress:(nonnull NSNumber)isEnded
                   seconds:(nonnull NSNumber)seconds
                   milliseconds:(nonnull NSNumber)milliseconds)
 RCT_EXTERN_METHOD(getSessions:(RCTResponseSenderBlock)onCompletion)
@end
