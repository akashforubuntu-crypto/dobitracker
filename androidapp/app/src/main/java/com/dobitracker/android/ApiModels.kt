package com.dobitracker.android

import com.google.gson.annotations.SerializedName

// Device Verification Models
data class DeviceVerificationRequest(
    @SerializedName("device_id")
    val deviceId: String,
    
    @SerializedName("android_id")
    val androidId: String
)

data class DeviceVerificationResponse(
    val message: String,
    val userId: Int? = null
)

// Notification Upload Models
data class NotificationUploadRequest(
    @SerializedName("device_id")
    val deviceId: String,
    
    val notifications: List<ApiNotificationData>,
    
    @SerializedName("permission_status")
    val permissionStatus: Boolean
)

data class NotificationUploadResponse(
    val message: String,
    val count: Int
)

// Notification Data Model (aligned with backend)
data class ApiNotificationData(
    @SerializedName("app_name")
    val appName: String,
    
    val sender: String,
    val message: String,
    val timestamp: String
)
