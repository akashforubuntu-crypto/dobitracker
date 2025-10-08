package com.dobitracker.android

import android.app.Service
import android.content.Intent
import android.content.SharedPreferences
import android.os.IBinder
import android.util.Log
import android.widget.Toast
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.google.gson.Gson
import kotlinx.coroutines.*
import java.util.*
import kotlin.concurrent.timerTask

class BackgroundSyncService : Service() {
    
    companion object {
        private const val TAG = "BackgroundSyncService"
        private const val SYNC_INTERVAL: Long = 60000 // 1 minute
        private const val NOTIFICATION_ID = 1
    }
    
    private var syncTimer: Timer? = null
    private var isSyncing = false
    
    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "BackgroundSyncService created")
        
        // Create notification channel for foreground service
        createNotificationChannel()
        
        // Start foreground service
        startForeground(NOTIFICATION_ID, createNotification())
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "BackgroundSyncService started")
        
        // Start sync timer
        startSyncTimer()
        
        // Return START_STICKY to ensure service is restarted if killed
        return START_STICKY
    }
    
    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
    
    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "BackgroundSyncService destroyed")
        
        // Cancel sync timer
        syncTimer?.cancel()
    }
    
    private fun startSyncTimer() {
        syncTimer = Timer()
        syncTimer?.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                syncNotifications()
            }
        }, 0, SYNC_INTERVAL)
    }
    
    private fun syncNotifications() {
        if (isSyncing) {
            Log.d(TAG, "Sync already in progress, skipping this cycle")
            return
        }
        
        isSyncing = true
        Log.d(TAG, "Starting notification sync cycle")
        
        try {
            // Check notification access permission
            val hasNotificationAccess = checkNotificationAccess()
            
            // Get captured notifications from NotificationListener
            val notificationListener = NotificationListener()
            val notifications = notificationListener.getCapturedNotifications()
            
            // Prepare data for upload
            val deviceId = getDeviceId()
            if (deviceId == null) {
                Log.e(TAG, "Device ID not found. Cannot upload notifications.")
                return
            }
            
            val permissionStatus = hasNotificationAccess
            
            // Upload notifications to backend using coroutines
            CoroutineScope(Dispatchers.IO).launch {
                val uploadSuccess = uploadNotifications(deviceId, notifications, permissionStatus)
                
                if (uploadSuccess) {
                    notificationListener.clearNotificationQueue()
                    Log.d(TAG, "Notification queue cleared after successful upload")
                } else {
                    Log.e(TAG, "Failed to upload notifications, keeping in queue")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error during sync cycle", e)
        } finally {
            isSyncing = false
        }
    }
    
    private fun checkNotificationAccess(): Boolean {
        // In a real implementation, you would check if notification access is granted
        // For now, we'll simulate that it's always granted
        return true
    }
    
    private fun getDeviceId(): String? {
        val sharedPreferences = getSharedPreferences("dobitracker", MODE_PRIVATE)
        return sharedPreferences.getString("device_id", null)
    }
    
    private suspend fun uploadNotifications(deviceId: String, notifications: List<NotificationListener.NotificationData>, permissionStatus: Boolean): Boolean {
        return try {
            Log.d(TAG, "Uploading notifications:")
            Log.d(TAG, "Device ID: $deviceId")
            Log.d(TAG, "Permission Status: $permissionStatus")
            Log.d(TAG, "Notification Count: ${notifications.size}")
            
            // Convert NotificationListener.NotificationData to ApiModels.NotificationData
            val apiNotifications = notifications.map { notification ->
                NotificationData(
                    appName = notification.appName,
                    sender = notification.sender,
                    message = notification.message,
                    timestamp = notification.timestamp
                )
            }
            
            // Make real API call to backend
            val request = NotificationUploadRequest(deviceId, apiNotifications, permissionStatus)
            val response = ApiClient.apiService.uploadNotifications(request)
            
            if (response.isSuccessful) {
                val responseBody = response.body()
                if (responseBody != null) {
                    Log.d(TAG, "Notifications uploaded successfully: ${responseBody.message}")
                    Log.d(TAG, "Uploaded count: ${responseBody.count}")
                    true
                } else {
                    Log.e(TAG, "Empty response body")
                    false
                }
            } else {
                Log.e(TAG, "Failed to upload notifications: ${response.code()} - ${response.message()}")
                false
            }
        } catch (e: Exception) {
            Log.e(TAG, "Network error while uploading notifications", e)
            false
        }
    }
    
    private fun createNotificationChannel() {
        // In a real implementation, you would create a notification channel for Android 8.0+
        // For simplicity, we'll skip this for now
    }
    
    private fun createNotification(): android.app.Notification {
        return NotificationCompat.Builder(this, "dobitracker_channel")
            .setContentTitle("DobiTracker")
            .setContentText("Capturing and syncing notifications")
            .setSmallIcon(R.drawable.ic_notification)
            .build()
    }
    
    // In a real implementation, you would have this function to upload to backend
    /*
    private fun uploadNotificationsToBackend(deviceId: String, notifications: List<NotificationListener.NotificationData>, permissionStatus: Boolean) {
        // Create API service
        val apiService = ApiClient.createService(NotificationApi::class.java)
        
        // Prepare request data
        val requestData = NotificationUploadRequest(
            deviceId = deviceId,
            notifications = notifications.map { notification ->
                NotificationData(
                    appName = notification.appName,
                    sender = notification.sender,
                    message = notification.message,
                    timestamp = notification.timestamp
                )
            },
            permissionStatus = permissionStatus
        )
        
        // Make API call
        apiService.uploadNotifications(requestData).enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    Log.d(TAG, "Notifications uploaded successfully")
                } else {
                    Log.e(TAG, "Failed to upload notifications: ${response.code()}")
                }
            }
            
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Log.e(TAG, "Network error while uploading notifications", t)
            }
        })
    }
    */
}
