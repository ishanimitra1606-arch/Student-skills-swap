package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.SkillsSwapRepository
import com.example.model.ChatMessage
import com.example.model.SwapRequest
import com.example.ui.components.AvatarView
import com.example.ui.components.GlassCard
import com.example.ui.theme.IndigoPrimary
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun ChatScreen(
    swapIdFilter: String? = null
) {
    val currentUser by SkillsSwapRepository.currentUser.collectAsState()
    val allMessages by SkillsSwapRepository.chatMessages.collectAsState()
    val swapRequests by SkillsSwapRepository.swapRequests.collectAsState()

    val user = currentUser ?: return

    var activeSwapId by remember(swapIdFilter) {
        mutableStateOf(swapIdFilter ?: swapRequests.firstOrNull { it.requesterId == user.id || it.recipientId == user.id }?.id)
    }

    var messageInput by remember { mutableStateOf("") }

    val activeSwap = swapRequests.find { it.id == activeSwapId }
    val partnerName = if (activeSwap?.requesterId == user.id) activeSwap?.recipientName else activeSwap?.requesterName
    val partnerAvatar = if (activeSwap?.requesterId == user.id) activeSwap?.recipientAvatar else activeSwap?.requesterAvatar
    val partnerId = if (activeSwap?.requesterId == user.id) activeSwap?.recipientId else activeSwap?.requesterId

    val filteredMessages = allMessages.filter { it.swapId == activeSwapId }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Header
        Column {
            Text(
                text = "Swap Messages 💬",
                fontSize = 22.sp,
                fontWeight = FontWeight.Black,
                color = Color.White
            )
            Text(
                text = "Real-time communication with your skill exchange partners",
                fontSize = 13.sp,
                color = Color.White.copy(alpha = 0.85f)
            )
        }

        if (activeSwap == null) {
            GlassCard {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "No active swap conversations yet.",
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1E293B)
                    )
                }
            }
        } else {
            // Active Conversation Header Card
            GlassCard {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        AvatarView(imageUrl = partnerAvatar ?: "", name = partnerName ?: "", size = 44.dp, isOnline = true)
                        Column {
                            Text(
                                text = partnerName ?: "Partner",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = Color(0xFF1E293B)
                            )
                            Text(
                                text = "Exchanging: ${activeSwap.skillRequested}",
                                fontSize = 12.sp,
                                color = Color.Gray
                            )
                        }
                    }

                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = IndigoPrimary.copy(alpha = 0.15f)
                    ) {
                        Text(
                            text = "Online",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = IndigoPrimary,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
            }

            // Chat Messages Container
            GlassCard(modifier = Modifier.weight(1f)) {
                if (filteredMessages.isEmpty()) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Say hello to $partnerName to organize your first skill session! 👋",
                            fontSize = 13.sp,
                            color = Color.Gray
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(filteredMessages) { msg ->
                            val isMe = msg.senderId == user.id
                            ChatMessageBubble(msg = msg, isMe = isMe)
                        }
                    }
                }
            }

            // Message Input Box
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = messageInput,
                    onValueChange = { messageInput = it },
                    placeholder = { Text("Type a message to $partnerName...", color = Color.Gray) },
                    modifier = Modifier
                        .weight(1f)
                        .background(Color.White, RoundedCornerShape(20.dp)),
                    shape = RoundedCornerShape(20.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = IndigoPrimary,
                        unfocusedBorderColor = Color.White,
                        focusedTextColor = Color(0xFF1E293B),
                        unfocusedTextColor = Color(0xFF1E293B)
                    )
                )

                IconButton(
                    onClick = {
                        if (messageInput.isNotBlank() && partnerId != null && activeSwapId != null) {
                            SkillsSwapRepository.sendMessage(
                                swapId = activeSwapId!!,
                                receiverId = partnerId,
                                text = messageInput
                            )
                            messageInput = ""
                        }
                    },
                    modifier = Modifier
                        .size(50.dp)
                        .clip(CircleShape)
                        .background(IndigoPrimary)
                ) {
                    Icon(
                        imageVector = Icons.Default.Send,
                        contentDescription = "Send",
                        tint = Color.White
                    )
                }
            }
        }
    }
}

@Composable
fun ChatMessageBubble(msg: ChatMessage, isMe: Boolean) {
    val alignment = if (isMe) Alignment.End else Alignment.Start
    val bgColor = if (isMe) IndigoPrimary else Color(0xFFF1F5F9)
    val textColor = if (isMe) Color.White else Color(0xFF1E293B)
    val sdf = SimpleDateFormat("hh:mm a", Locale.getDefault())
    val timeStr = sdf.format(Date(msg.timestamp))

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = alignment
    ) {
        Surface(
            shape = RoundedCornerShape(
                topStart = 16.dp,
                topEnd = 16.dp,
                bottomStart = if (isMe) 16.dp else 4.dp,
                bottomEnd = if (isMe) 4.dp else 16.dp
            ),
            color = bgColor,
            shadowElevation = 2.dp
        ) {
            Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)) {
                Text(
                    text = msg.text,
                    color = textColor,
                    fontSize = 14.sp
                )
                Text(
                    text = timeStr,
                    color = if (isMe) Color.White.copy(alpha = 0.7f) else Color.Gray,
                    fontSize = 10.sp,
                    modifier = Modifier.align(Alignment.End)
                )
            }
        }
    }
}
