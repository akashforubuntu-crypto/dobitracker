package com.dobitracker.android

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    
    companion object {
        private const val TAG = "BootReceiver"
    }
    
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Intent.ACTION_BOOT_COMPLETED) {
            Log.d(TAG, "Device booted, starting services")
            
            // Start the notification listener service
            val notificationIntent = Intent(context, NotificationListener::class.java)
            context?.startService(notificationIntent)
            
            // Start the background sync service
            val serviceIntent = Intent(context, BackgroundSyncService::class.java)
            context?.startService(serviceIntent)
            
            Log.d(TAG, "Both services started on boot")
        }
    }
}
