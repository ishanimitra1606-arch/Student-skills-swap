package com.example.ui.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// Vibrant Palette Gradient Tokens
val VibrantIndigo = Color(0xFF6366F1)
val VibrantPurple = Color(0xFFA855F7)
val VibrantPink = Color(0xFFEC4899)

val IndigoPrimary = Color(0xFF6366F1)
val VioletSecondary = Color(0xFF8B5CF6)
val PinkAccent = Color(0xFFEC4899)

val GoldenCoin = Color(0xFFF59E0B)
val GoldenCoinGlow = Color(0xFFFBBF24)
val EmeraldSuccess = Color(0xFF10B981)
val RoseDanger = Color(0xFFF43F5E)

// Vibrant Glassmorphism Colors
val DarkBackground = Color(0xFF0F172A)
val DarkSurface = Color(0x26FFFFFF) // 15% white glass
val DarkSurfaceVariant = Color(0x33FFFFFF) // 20% white glass
val DarkGlassBorder = Color(0x40FFFFFF) // 25% white border

val LightBackground = Color(0xFFF1F5F9)
val LightSurface = Color(0xF2FFFFFF) // Glossy white 95%
val LightSurfaceVariant = Color(0xFFEEF2FF)
val LightGlassBorder = Color(0x206366F1)

val TextPrimaryDark = Color(0xFFFFFFFF)
val TextSecondaryDark = Color(0xD9FFFFFF) // 85% white

val TextPrimaryLight = Color(0xFF1E293B)
val TextSecondaryLight = Color(0xFF64748B)

// Background Vibrant Gradient Brush
val VibrantBackgroundBrush = Brush.linearGradient(
    colors = listOf(VibrantIndigo, VibrantPurple, VibrantPink)
)
