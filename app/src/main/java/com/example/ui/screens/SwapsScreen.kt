package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.SkillsSwapRepository
import com.example.model.SwapRequest
import com.example.model.SwapStatus
import com.example.ui.components.*
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldenCoin
import com.example.ui.theme.IndigoPrimary
import com.example.ui.theme.RoseDanger

@Composable
fun SwapsScreen(
    onOpenChat: (String) -> Unit
) {
    val currentUser by SkillsSwapRepository.currentUser.collectAsState()
    val swapRequests by SkillsSwapRepository.swapRequests.collectAsState()

    var selectedTabIndex by remember { mutableStateOf(0) } // 0: Active, 1: Pending, 2: Completed

    val user = currentUser ?: return
    val mySwaps = swapRequests.filter { it.requesterId == user.id || it.recipientId == user.id }

    val activeSwaps = mySwaps.filter { it.status == SwapStatus.ACCEPTED }
    val pendingSwaps = mySwaps.filter { it.status == SwapStatus.PENDING }
    val completedSwaps = mySwaps.filter { it.status == SwapStatus.COMPLETED }

    var swapToComplete by remember { mutableStateOf<SwapRequest?>(null) }
    var ratingValue by remember { mutableStateOf(5) }
    var reviewText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        Column {
            Text(
                text = "My Skill Swaps 🔄",
                fontSize = 22.sp,
                fontWeight = FontWeight.Black,
                color = Color.White
            )
            Text(
                text = "Manage pending requests, active exchanges, and completed sessions",
                fontSize = 13.sp,
                color = Color.White.copy(alpha = 0.85f)
            )
        }

        // Glass Segmented Tabs
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = Color.White.copy(alpha = 0.9f),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(modifier = Modifier.padding(4.dp)) {
                val tabs = listOf("Active (${activeSwaps.size})", "Pending (${pendingSwaps.size})", "Completed (${completedSwaps.size})")
                tabs.forEachIndexed { index, label ->
                    val isSelected = selectedTabIndex == index
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSelected) IndigoPrimary else Color.Transparent)
                            .clickable { selectedTabIndex = index }
                            .padding(vertical = 10.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = label,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
                            color = if (isSelected) Color.White else Color(0xFF1E293B)
                        )
                    }
                }
            }
        }

        // List Content based on tab
        val currentList = when (selectedTabIndex) {
            0 -> activeSwaps
            1 -> pendingSwaps
            else -> completedSwaps
        }

        if (currentList.isEmpty()) {
            GlassCard {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.SwapHoriz,
                        contentDescription = null,
                        modifier = Modifier.size(48.dp),
                        tint = Color.Gray
                    )
                    Text(
                        text = when (selectedTabIndex) {
                            0 -> "No active swaps in progress"
                            1 -> "No pending swap requests"
                            else -> "No completed swaps yet"
                        },
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = Color(0xFF1E293B)
                    )
                    Text(
                        text = "Explore the Marketplace or Smart Match to initiate skill exchanges!",
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                }
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(currentList) { swap ->
                    SwapCardItem(
                        swap = swap,
                        currentUserId = user.id,
                        onAccept = { SkillsSwapRepository.acceptSwapRequest(swap.id) },
                        onReject = { SkillsSwapRepository.rejectSwapRequest(swap.id) },
                        onChat = { onOpenChat(swap.id) },
                        onMarkComplete = {
                            swapToComplete = swap
                            ratingValue = 5
                            reviewText = ""
                        }
                    )
                }
            }
        }
    }

    // Complete Swap & Review Dialog Modal
    if (swapToComplete != null) {
        val swap = swapToComplete!!
        val isRequester = user.id == swap.requesterId
        val partnerName = if (isRequester) swap.recipientName else swap.requesterName

        AlertDialog(
            onDismissRequest = { swapToComplete = null },
            title = {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = EmeraldSuccess
                    )
                    Text("Complete Swap & Review", fontWeight = FontWeight.Black)
                }
            },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Did you complete the skill exchange session with $partnerName?",
                        fontSize = 13.sp,
                        color = Color(0xFF1E293B)
                    )

                    Text(
                        text = "Rate your experience (1-5 Stars):",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = Color(0xFF1E293B)
                    )

                    // Star Rating Bar
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        (1..5).forEach { star ->
                            val isSelected = star <= ratingValue
                            IconButton(
                                onClick = { ratingValue = star },
                                modifier = Modifier.size(36.dp)
                            ) {
                                Icon(
                                    imageVector = if (isSelected) Icons.Default.Star else Icons.Outlined.Star,
                                    contentDescription = "$star Stars",
                                    tint = if (isSelected) GoldenCoin else Color.LightGray,
                                    modifier = Modifier.size(32.dp)
                                )
                            }
                        }
                    }

                    OutlinedTextField(
                        value = reviewText,
                        onValueChange = { reviewText = it },
                        label = { Text("Write a brief review / feedback...") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 3
                    )

                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = Color(0xFFFEF3C7)
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(text = "🪙", fontSize = 16.sp)
                            Text(
                                text = "Transfers 20 Skill Coins. Teacher receives +5 Bonus Coins if rated 5 stars!",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF92400E)
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        SkillsSwapRepository.completeSwapAndReview(
                            swapId = swap.id,
                            rating = ratingValue,
                            reviewComment = reviewText.ifBlank { "Great skill exchange session!" }
                        )
                        swapToComplete = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess)
                ) {
                    Text("Confirm & Submit Review", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { swapToComplete = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
fun SwapCardItem(
    swap: SwapRequest,
    currentUserId: String,
    onAccept: () -> Unit,
    onReject: () -> Unit,
    onChat: () -> Unit,
    onMarkComplete: () -> Unit
) {
    val isRequester = currentUserId == swap.requesterId
    val partnerName = if (isRequester) swap.recipientName else swap.requesterName
    val partnerAvatar = if (isRequester) swap.recipientAvatar else swap.requesterAvatar

    GlassCard {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    AvatarView(imageUrl = partnerAvatar, name = partnerName, size = 44.dp)
                    Column {
                        Text(
                            text = partnerName,
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = Color(0xFF1E293B)
                        )
                        Text(
                            text = if (isRequester) "You requested swap" else "Requested to swap with you",
                            fontSize = 11.sp,
                            color = Color.Gray
                        )
                    }
                }

                StatusBadge(status = swap.status)
            }

            Divider(color = Color.LightGray.copy(alpha = 0.5f))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "LEARNING",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = IndigoPrimary
                    )
                    Text(
                        text = swap.skillRequested,
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = Color(0xFF1E293B),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                Column(
                    modifier = Modifier.weight(1f),
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        text = "TEACHING",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = EmeraldSuccess
                    )
                    Text(
                        text = swap.skillOffered,
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = Color(0xFF1E293B),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            if (swap.message.isNotBlank()) {
                Text(
                    text = "Note: \"${swap.message}\"",
                    fontSize = 12.sp,
                    color = Color.Gray,
                    style = androidx.compose.ui.text.TextStyle(fontStyle = androidx.compose.ui.text.font.FontStyle.Italic)
                )
            }

            // Action Row
            when (swap.status) {
                SwapStatus.PENDING -> {
                    if (!isRequester) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = onAccept,
                                colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(imageVector = Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Accept", fontWeight = FontWeight.Bold)
                            }
                            OutlinedButton(
                                onClick = onReject,
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = RoseDanger),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(imageVector = Icons.Default.Close, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Decline", fontWeight = FontWeight.Bold)
                            }
                        }
                    } else {
                        Text(
                            text = "Waiting for $partnerName to accept your request...",
                            fontSize = 12.sp,
                            color = Color.Gray
                        )
                    }
                }
                SwapStatus.ACCEPTED -> {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = onChat,
                            colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(imageVector = Icons.Default.Chat, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Open Chat", fontWeight = FontWeight.Bold)
                        }

                        Button(
                            onClick = onMarkComplete,
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Complete & Review", fontWeight = FontWeight.Bold)
                        }
                    }
                }
                SwapStatus.COMPLETED -> {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "✓ 20 Skill Coins Exchanged",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Black,
                            color = GoldenCoin
                        )
                        OutlinedButton(
                            onClick = onChat,
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text("Chat History", fontSize = 11.sp, color = IndigoPrimary)
                        }
                    }
                }
                else -> {}
            }
        }
    }
}
