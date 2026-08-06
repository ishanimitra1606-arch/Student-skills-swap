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
import com.example.model.ReportItem
import com.example.model.User
import com.example.ui.components.AvatarView
import com.example.ui.components.GlassCard
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.IndigoPrimary
import com.example.ui.theme.RoseDanger

@Composable
fun AdminScreen(
    onBack: () -> Unit
) {
    val allUsers by SkillsSwapRepository.allUsers.collectAsState()
    val reports by SkillsSwapRepository.reports.collectAsState()

    var selectedTab by remember { mutableStateOf(0) } // 0: Users, 1: Reports

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Header with Back button
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                IconButton(onClick = onBack) {
                    Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                }
                Text(
                    text = "Admin Moderation 🛡️",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
            }
        }

        // Tabs
        Surface(
            shape = RoundedCornerShape(14.dp),
            color = Color.White.copy(alpha = 0.9f),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(modifier = Modifier.padding(4.dp)) {
                listOf("All Users (${allUsers.size})", "Flagged Reports (${reports.size})").forEachIndexed { idx, label ->
                    val isSel = selectedTab == idx
                    Button(
                        onClick = { selectedTab = idx },
                        colors = ButtonDefaults.buttonColors(containerColor = if (isSel) IndigoPrimary else Color.Transparent),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(
                            text = label,
                            color = if (isSel) Color.White else Color(0xFF1E293B),
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }
                }
            }
        }

        if (selectedTab == 0) {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(allUsers) { u ->
                    AdminUserCard(user = u)
                }
            }
        } else {
            if (reports.isEmpty()) {
                GlassCard {
                    Text("No safety reports filed yet.", fontWeight = FontWeight.Bold, color = Color.Gray)
                }
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(reports) { rep ->
                        AdminReportCard(report = rep)
                    }
                }
            }
        }
    }
}

@Composable
fun AdminUserCard(user: User) {
    GlassCard {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.weight(1f)
            ) {
                AvatarView(imageUrl = user.avatarUrl, name = user.name, size = 42.dp)
                Column {
                    Text(
                        text = user.name + if (user.isBlocked) " (BLOCKED)" else "",
                        fontWeight = FontWeight.Bold,
                        color = if (user.isBlocked) RoseDanger else Color(0xFF1E293B),
                        fontSize = 14.sp
                    )
                    Text(
                        text = "${user.college} • ${user.coinBalance} 🪙",
                        fontSize = 11.sp,
                        color = Color.Gray
                    )
                }
            }

            if (!user.isAdmin) {
                if (!user.isBlocked) {
                    Button(
                        onClick = { SkillsSwapRepository.adminBanUser(user.id) },
                        colors = ButtonDefaults.buttonColors(containerColor = RoseDanger),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text("Block", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                } else {
                    Button(
                        onClick = { SkillsSwapRepository.adminUnbanUser(user.id) },
                        colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text("Unblock", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun AdminReportCard(report: ReportItem) {
    GlassCard {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Reported: ${report.reportedUserName}",
                fontWeight = FontWeight.Bold,
                color = RoseDanger,
                fontSize = 14.sp
            )
            Text(
                text = "Filed by: ${report.reporterName}",
                fontSize = 12.sp,
                color = Color.Gray
            )
            Text(
                text = "Reason: \"${report.reason}\"",
                fontSize = 13.sp,
                color = Color(0xFF1E293B)
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                Button(
                    onClick = { SkillsSwapRepository.adminDismissReport(report.id) },
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Resolve & Dismiss", fontSize = 12.sp)
                }
            }
        }
    }
}
