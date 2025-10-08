package com.dobitracker.android

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("auth/verify-device")
    suspend fun verifyDevice(@Body request: DeviceVerificationRequest): Response<DeviceVerificationResponse>

    @POST("notifications/upload-notifications")
    suspend fun uploadNotifications(@Body request: NotificationUploadRequest): Response<NotificationUploadResponse>
}
