package com.dobitracker.android

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import java.util.*

class NotificationListener : NotificationListenerService() {
    
    companion object {
        private const val TAG = "NotificationListener"
        @Volatile
        private var INSTANCE: NotificationListener? = null
        
        fun getInstance(): NotificationListener? = INSTANCE
    }
    
    // Queue to store notifications
    private val notificationQueue = mutableListOf<NotificationData>()
    
    override fun onCreate() {
        super.onCreate()
        INSTANCE = this
        Log.d(TAG, "NotificationListener service created")
    }
    
    override fun onDestroy() {
        super.onDestroy()
        INSTANCE = null
        Log.d(TAG, "NotificationListener service destroyed")
    }
    
    override fun onNotificationPosted(sbn: StatusBarNotification) {
        super.onNotificationPosted(sbn)
        
        try {
            // Extract notification data
            val packageName = sbn.packageName
            val notification = sbn.notification
            val extras = notification.extras
            
            // Get sender (app name)
            val appName = getAppName(packageName)
            
            // Get sender name (if available)
            val sender = extras.getString("android.title") ?: "Unknown"
            
            // Get message content
            val message = extras.getString("android.text") ?: ""
            
            // Get timestamp as ISO string
            val timestamp = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.getDefault())
                .format(Date(sbn.postTime))
            
            // Create notification data object
            val notificationData = NotificationData(
                appName = appName,
                sender = sender,
                message = message,
                timestamp = timestamp
            )
            
            // Add to queue
            notificationQueue.add(notificationData)
            
            Log.d(TAG, "Notification captured: $notificationData")
        } catch (e: Exception) {
            Log.e(TAG, "Error capturing notification", e)
        }
    }
    
    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        super.onNotificationRemoved(sbn)
        // We don't need to handle removed notifications for this app
    }
    
    private fun getAppName(packageName: String): String {
        return when (packageName) {
            "com.whatsapp" -> "WhatsApp"
            "com.instagram.android" -> "Instagram"
            "com.facebook.orca" -> "Facebook"
            "com.google.android.gm" -> "Gmail"
            "com.snapchat.android" -> "Snapchat"
            "com.twitter.android" -> "Twitter"
            "com.linkedin.android" -> "LinkedIn"
            "org.telegram.messenger" -> "Telegram"
            "com.google.android.youtube" -> "YouTube"
            "com.discord" -> "Discord"
            "com.pinterest" -> "Pinterest"
            "com.zhiliaoapp.musically" -> "TikTok"
            "com.facebook.katana" -> "Facebook"
            "com.microsoft.office.outlook" -> "Outlook"
            "com.android.email" -> "Email"
            "com.skype.raider" -> "Skype"
            "com.spotify.music" -> "Spotify"
            "com.netflix.mediaclient" -> "Netflix"
            "com.amazon.mShop.android.shopping" -> "Amazon"
            "com.ubercab" -> "Uber"
            "com.google.android.apps.maps" -> "Google Maps"
            "com.whatsapp.w4b" -> "WhatsApp Business"
            "com.instagram.business" -> "Instagram Business"
            else -> packageName
        }
    }
    
    // Get all captured notifications
    fun getCapturedNotifications(): List<NotificationData> {
        return notificationQueue.toList()
    }
    
    // Clear notification queue
    fun clearNotificationQueue() {
        notificationQueue.clear()
    }
    
    // Clear oldest notifications to prevent memory issues
    fun clearOldNotifications(count: Int) {
        if (count > 0 && count <= notificationQueue.size) {
            repeat(count) {
                if (notificationQueue.isNotEmpty()) {
                    notificationQueue.removeAt(0) // Remove oldest (first) notification
                }
            }
            Log.d(TAG, "Cleared $count oldest notifications from queue")
        }
    }
    
    // Data class for notification information (aligned with backend)
    data class NotificationData(
        val appName: String,
        val sender: String,
        val message: String,
        val timestamp: String
    )
}
