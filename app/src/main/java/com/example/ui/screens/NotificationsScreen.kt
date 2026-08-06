package com.example.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.SkillsSwapRepository
import com.example.model.NotificationItem
import com.example.model.NotificationType
import com.example.ui.components.GlassCard
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldenCoin
import com.example.ui.theme.IndigoPrimary
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun NotificationsScreen() {
    val currentUser by SkillsSwapRepository.currentUser.collectAsState()
    val allNotifs by SkillsSwapRepository.notifications.collectAsState()

    val user = currentUser ?: return
    val userNotifs = allNotifs.filter { it.userId == user.id }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Notifications 🔔",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Text(
                    text = "Activity updates and Skill Coin rewards",
                    fontSize = 13.sp,
                    color = Color.White.copy(alpha = 0.85f)
                )
            }

            if (userNotifs.any { !it.isRead }) {
                TextButton(onClick = { SkillsSwapRepository.markNotificationsRead(user.id) }) {
                    Text("Mark all read", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
        }

        if (userNotifs.isEmpty()) {
            GlassCard {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("No notifications yet.", fontWeight = FontWeight.Bold, color = Color(0xFF1E293B))
                }
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(userNotifs) { notif ->
                    NotificationRowItem(notif = notif)
                }
            }
        }
    }
}

@Composable
fun NotificationRowItem(notif: NotificationItem) {
    val icon = when (notif.type) {
        NotificationType.SWAP_REQUEST -> Icons.Default.SwapHoriz
        NotificationType.SWAP_ACCEPTED -> Icons.Default.CheckCircle
        NotificationType.SWAP_REJECTED -> Icons.Default.Cancel
        NotificationType.MESSAGE -> Icons.Default.Chat
        NotificationType.COIN_REWARD -> Icons.Default.MonetizationOn
    }

    val iconColor = when (notif.type) {
        NotificationType.COIN_REWARD -> GoldenCoin
        NotificationType.SWAP_ACCEPTED -> EmeraldSuccess
        NotificationType.SWAP_REQUEST -> IndigoPrimary
        else -> IndigoPrimary
    }

    val sdf = SimpleDateFormat("MMM dd, hh:mm a", Locale.getDefault())
    val dateStr = sdf.format(Date(notif.timestamp))

    GlassCard {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = iconColor.copy(alpha = 0.15f),
                modifier = Modifier.size(42.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(imageVector = icon, contentDescription = null, tint = iconColor, modifier = Modifier.size(22.dp))
                }
            }

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = notif.title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Color(0xFF1E293B)
                )
                Text(
                    text = notif.message,
                    fontSize = 12.sp,
                    color = Color(0xFF4B5563)
                )
                Text(
                    text = dateStr,
                    fontSize = 10.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(top = 2.dp)
                )
            }
        }
    }
}
