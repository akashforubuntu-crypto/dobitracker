package com.dobitracker.android

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import android.content.ComponentName
import android.provider.Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS
import android.util.Log
import kotlinx.coroutines.*

class MainActivity : AppCompatActivity() {
    
    companion object {
        private const val TAG = "MainActivity"
    }
    
    private lateinit var deviceIdInput: EditText
    private lateinit var verifyButton: Button
    private lateinit var contactAdminButton: Button
    private lateinit var statusText: TextView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Initialize views
        deviceIdInput = findViewById(R.id.deviceIdInput)
        verifyButton = findViewById(R.id.verifyButton)
        contactAdminButton = findViewById(R.id.contactAdminButton)
        statusText = findViewById(R.id.statusText)
        
        // Set click listeners
        verifyButton.setOnClickListener {
            verifyDevice()
        }
        
        contactAdminButton.setOnClickListener {
            contactAdmin()
        }
        
        // Check if this is the first launch
        val sharedPreferences = getSharedPreferences("dobitracker", MODE_PRIVATE)
        val isFirstLaunch = sharedPreferences.getBoolean("isFirstLaunch", true)
        
        if (isFirstLaunch) {
            // First launch - show device ID input
            showDeviceIdInput()
            sharedPreferences.edit().putBoolean("isFirstLaunch", false).apply()
        } else {
            // Subsequent launch - open Wi-Fi settings and start background service
            openWifiSettings()
            startBackgroundService()
        }
    }
    
    private fun showDeviceIdInput() {
        // This layout should have the device ID input fields
        // For simplicity, we'll assume the layout is already set up
        statusText.text = "Please enter your Device ID"
    }
    
    private fun verifyDevice() {
        val deviceId = deviceIdInput.text.toString()
        
        if (deviceId.isEmpty()) {
            Toast.makeText(this, "Please enter Device ID", Toast.LENGTH_SHORT).show()
            return
        }
        
        // Get Android ID
        val androidId = Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID)
        
        // Show loading state
        statusText.text = "Verifying device..."
        verifyButton.isEnabled = false
        
        // Verify device with backend using coroutines
        CoroutineScope(Dispatchers.Main).launch {
            try {
                verifyDeviceWithBackend(deviceId, androidId)
            } catch (e: Exception) {
                Log.e(TAG, "Device verification error", e)
                statusText.text = "Verification failed. Please try again."
                verifyButton.isEnabled = true
            }
        }
    }
    
    private suspend fun verifyDeviceWithBackend(deviceId: String, androidId: String) {
        try {
            // Make real API call to backend
            val request = DeviceVerificationRequest(deviceId, androidId)
            val response = ApiClient.apiService.verifyDevice(request)
            
            if (response.isSuccessful) {
                val responseBody = response.body()
                if (responseBody != null) {
                    Log.d(TAG, "Device verification successful: ${responseBody.message}")
                    
                    // Store device ID in SharedPreferences
                    saveDeviceId(deviceId)
                    
                    // Update UI on main thread
                    runOnUiThread {
                        statusText.text = "Device verified successfully"
                        
                        // Request notification access permission
                        requestNotificationAccess()
                        
                        // Request battery optimization exemption
                        requestBatteryOptimizationExemption()
                        
                        // Start background service
                        startBackgroundService()
                    }
                } else {
                    throw Exception("Empty response body")
                }
            } else {
                val errorMessage = when (response.code()) {
                    404 -> "Device ID not found. Please check your Device ID."
                    403 -> "Device ID is linked to another Android device. Contact admin."
                    else -> "Verification failed. Please try again."
                }
                
                runOnUiThread {
                    statusText.text = errorMessage
                    if (response.code() == 403) {
                        contactAdminButton.visibility = Button.VISIBLE
                    }
                    verifyButton.isEnabled = true
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Device verification error", e)
            runOnUiThread {
                statusText.text = "Network error. Please check your internet connection."
                verifyButton.isEnabled = true
            }
        }
    }
    
    private fun requestNotificationAccess() {
        // Check if notification access is already granted
        val enabledListeners = Settings.Secure.getString(contentResolver, "enabled_notification_listeners")
        val packageName = packageName
        val componentName = ComponentName(this, NotificationListener::class.java)
        
        if (enabledListeners == null || !enabledListeners.contains(componentName.flattenToString())) {
            // Request notification access
            val intent = Intent(ACTION_NOTIFICATION_LISTENER_SETTINGS)
            startActivity(intent)
            Toast.makeText(this, "Please enable notification access for DobiTracker", Toast.LENGTH_LONG).show()
        } else {
            Toast.makeText(this, "Notification access already granted", Toast.LENGTH_SHORT).show()
        }
    }
    
    private fun requestBatteryOptimizationExemption() {
        // Check if battery optimization is already disabled
        val powerManager = getSystemService(POWER_SERVICE) as android.os.PowerManager
        val packageName = packageName
        
        if (!powerManager.isIgnoringBatteryOptimizations(packageName)) {
            // Request battery optimization exemption
            val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
            intent.data = Uri.parse("package:$packageName")
            startActivity(intent)
            Toast.makeText(this, "Please allow battery optimization exemption", Toast.LENGTH_LONG).show()
        } else {
            Toast.makeText(this, "Battery optimization already disabled", Toast.LENGTH_SHORT).show()
        }
    }
    
    private fun openWifiSettings() {
        // Open Wi-Fi settings
        val intent = Intent(Settings.ACTION_WIFI_SETTINGS)
        startActivity(intent)
    }
    
    private fun startBackgroundService() {
        // Start background service
        val intent = Intent(this, BackgroundSyncService::class.java)
        startService(intent)
        
        // Finish this activity
        finish()
    }
    
    private fun contactAdmin() {
        // Open email app to contact admin
        val emailIntent = Intent(Intent.ACTION_SEND).apply {
            type = "message/rfc822"
            putExtra(Intent.EXTRA_EMAIL, arrayOf("admin@techbroom.in"))
            putExtra(Intent.EXTRA_SUBJECT, "DobiTracker Device ID Issue")
            putExtra(Intent.EXTRA_TEXT, "I'm having trouble with my Device ID. Please help!")
        }
        
        try {
            startActivity(Intent.createChooser(emailIntent, "Send mail..."))
        } catch (ex: android.content.ActivityNotFoundException) {
            Toast.makeText(this, "There are no email clients installed.", Toast.LENGTH_SHORT).show()
        }
    }
    
    // Data persistence functions
    private fun saveDeviceId(deviceId: String) {
        val sharedPreferences = getSharedPreferences("dobitracker", MODE_PRIVATE)
        sharedPreferences.edit().putString("device_id", deviceId).apply()
        Log.d(TAG, "Device ID saved: $deviceId")
    }
    
    private fun getDeviceId(): String? {
        val sharedPreferences = getSharedPreferences("dobitracker", MODE_PRIVATE)
        return sharedPreferences.getString("device_id", null)
    }
}
