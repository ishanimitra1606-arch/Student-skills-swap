package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.SkillsSwapRepository
import com.example.model.SmartMatchResult
import com.example.ui.components.*
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldenCoin
import com.example.ui.theme.IndigoPrimary
import com.example.ui.theme.VioletSecondary

@Composable
fun SmartMatchScreen(
    onRequestSwapCreated: () -> Unit
) {
    val matches = remember { SkillsSwapRepository.computeSmartMatches() }
    val currentUser by SkillsSwapRepository.currentUser.collectAsState()

    var selectedMatchToSwap by remember { mutableStateOf<SmartMatchResult?>(null) }
    var offerSkillText by remember { mutableStateOf("") }
    var noteText by remember { mutableStateOf("") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Vibrant Glass Header
        item {
            TranslucentGlassCard(
                borderColor = Color.White.copy(alpha = 0.35f),
                backgroundColor = Color.White.copy(alpha = 0.18f)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(text = "✨", fontSize = 22.sp)
                        Text(
                            text = "Smart Skill Matcher",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                    }

                    Text(
                        text = "Our recommendation algorithm connects you with students based on mutual skill interests, location proximity, and campus affinity.",
                        fontSize = 13.sp,
                        color = Color.White.copy(alpha = 0.9f)
                    )
                }
            }
        }

        item {
            Text(
                text = "Recommended Skill Matches (${matches.size})",
                fontWeight = FontWeight.Black,
                fontSize = 17.sp,
                color = Color.White
            )
        }

        if (matches.isEmpty()) {
            item {
                GlassCard {
                    Text(
                        text = "No match recommendations found yet. Update your offered and wanted skills in your Profile to get AI matches!",
                        fontSize = 13.sp,
                        color = Color(0xFF4B5563)
                    )
                }
            }
        } else {
            items(matches) { match ->
                MatchCard(
                    match = match,
                    onRequestSwap = {
                        selectedMatchToSwap = match
                        offerSkillText = match.matchedWantedSkill
                    }
                )
            }
        }
    }

    // Modal dialog to send request
    if (selectedMatchToSwap != null) {
        val match = selectedMatchToSwap!!
        AlertDialog(
            onDismissRequest = { selectedMatchToSwap = null },
            title = {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = null,
                        tint = VioletSecondary
                    )
                    Text("Swap with ${match.student.name}", fontWeight = FontWeight.Black)
                }
            },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "Proposed Exchange: Learn '${match.matchedOfferedSkill}' in exchange for teaching '${match.matchedWantedSkill}'.",
                        fontSize = 13.sp,
                        color = Color(0xFF1E293B)
                    )

                    OutlinedTextField(
                        value = offerSkillText,
                        onValueChange = { offerSkillText = it },
                        label = { Text("Skill You Will Teach") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = noteText,
                        onValueChange = { noteText = it },
                        label = { Text("Introductory Note / Schedule Note") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        SkillsSwapRepository.createSwapRequest(
                            recipientId = match.student.id,
                            skillOffered = offerSkillText,
                            skillRequested = match.matchedOfferedSkill,
                            message = noteText
                        )
                        selectedMatchToSwap = null
                        onRequestSwapCreated()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary)
                ) {
                    Text("Send Swap Request", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedMatchToSwap = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
fun MatchCard(
    match: SmartMatchResult,
    onRequestSwap: () -> Unit
) {
    val student = match.student

    GlassCard {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            // Header with match % badge
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
                    AvatarView(
                        imageUrl = student.avatarUrl,
                        name = student.name,
                        size = 48.dp,
                        isOnline = student.isOnline
                    )
                    Column {
                        Text(
                            text = student.name,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = Color(0xFF1E293B)
                        )
                        Text(
                            text = "${student.college} • ${student.city}",
                            fontSize = 12.sp,
                            color = Color.Gray,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }

                // Match Score Pill
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = EmeraldSuccess.copy(alpha = 0.15f),
                    border = androidx.compose.foundation.BorderStroke(1.dp, EmeraldSuccess)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                            tint = EmeraldSuccess,
                            modifier = Modifier.size(14.dp)
                        )
                        Text(
                            text = "${match.matchScore}% Match",
                            fontWeight = FontWeight.Black,
                            color = EmeraldSuccess,
                            fontSize = 12.sp
                        )
                    }
                }
            }

            Divider(color = Color.LightGray.copy(alpha = 0.5f))

            // Skills Match Highlight
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color(0xFFF1F5F9))
                    .padding(12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "THEY TEACH",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = IndigoPrimary
                    )
                    Text(
                        text = match.matchedOfferedSkill,
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = Color(0xFF1E293B),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                Icon(
                    imageVector = Icons.Default.SwapHoriz,
                    contentDescription = null,
                    tint = VioletSecondary,
                    modifier = Modifier
                        .padding(horizontal = 8.dp)
                        .size(24.dp)
                )

                Column(
                    modifier = Modifier.weight(1f),
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        text = "THEY WANT TO LEARN",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = VioletSecondary
                    )
                    Text(
                        text = match.matchedWantedSkill,
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = Color(0xFF1E293B),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            // Match Reasons Badges
            LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                items(match.matchReasons) { reason ->
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = IndigoPrimary.copy(alpha = 0.12f)
                    ) {
                        Text(
                            text = "✓ $reason",
                            fontSize = 11.sp,
                            color = IndigoPrimary,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                        )
                    }
                }
            }

            // Bio snippet
            Text(
                text = student.bio,
                fontSize = 12.sp,
                color = Color(0xFF4B5563),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            // Request Button
            Button(
                onClick = onRequestSwap,
                colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(imageVector = Icons.Default.Handshake, contentDescription = null)
                Spacer(modifier = Modifier.width(6.dp))
                Text("Propose Skill Exchange", fontWeight = FontWeight.Black)
            }
        }
    }
}
