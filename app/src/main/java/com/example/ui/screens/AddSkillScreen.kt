package com.example.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.SkillsSwapRepository
import com.example.model.FormatType
import com.example.model.SkillCategory
import com.example.ui.theme.GoldenCoin
import com.example.ui.theme.IndigoPrimary

@Composable
fun AddSkillScreen(
    onDismiss: () -> Unit,
    onSkillAdded: () -> Unit
) {
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf(SkillCategory.PROGRAMMING) }
    var selectedFormat by remember { mutableStateOf(FormatType.ONLINE) }
    var tagsInput by remember { mutableStateOf("") }

    var categoryDropdownExpanded by remember { mutableStateOf(false) }

    Surface(
        color = MaterialTheme.colorScheme.background,
        modifier = Modifier.fillMaxSize()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(imageVector = Icons.Default.AddCircle, contentDescription = null, tint = IndigoPrimary)
                    Text(text = "Offer a New Skill", fontWeight = FontWeight.Bold, fontSize = 20.sp)
                }

                IconButton(onClick = onDismiss) {
                    Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                }
            }

            Text(
                text = "List a skill you can teach to fellow college students. Earn 20 Skill Coins per completed swap!",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            // Skill Title
            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("Skill Title") },
                placeholder = { Text("e.g. Python ML Modeling, Acoustic Guitar, Figma UI Design") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            // Category Selector
            Box(modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = selectedCategory.displayName,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Skill Category") },
                    trailingIcon = {
                        IconButton(onClick = { categoryDropdownExpanded = true }) {
                            Icon(imageVector = Icons.Default.ArrowDropDown, contentDescription = null)
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                DropdownMenu(
                    expanded = categoryDropdownExpanded,
                    onDismissRequest = { categoryDropdownExpanded = false }
                ) {
                    SkillCategory.values().filter { it != SkillCategory.ALL }.forEach { cat ->
                        DropdownMenuItem(
                            text = { Text(cat.displayName) },
                            onClick = {
                                selectedCategory = cat
                                categoryDropdownExpanded = false
                            }
                        )
                    }
                }
            }

            // Format Selection (Online / Offline)
            Text(text = "Exchange Format", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FilterChip(
                    selected = selectedFormat == FormatType.ONLINE,
                    onClick = { selectedFormat = FormatType.ONLINE },
                    label = { Text("Online (Video Call)") },
                    leadingIcon = { Icon(imageVector = Icons.Default.Computer, contentDescription = null) },
                    modifier = Modifier.weight(1f)
                )
                FilterChip(
                    selected = selectedFormat == FormatType.OFFLINE,
                    onClick = { selectedFormat = FormatType.OFFLINE },
                    label = { Text("Offline (In Person)") },
                    leadingIcon = { Icon(imageVector = Icons.Default.Person, contentDescription = null) },
                    modifier = Modifier.weight(1f)
                )
            }

            // Description
            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Description & What You Will Teach") },
                placeholder = { Text("Explain what concepts, topics, or projects you will cover in your sessions...") },
                modifier = Modifier.fillMaxWidth(),
                minLines = 4,
                shape = RoundedCornerShape(12.dp)
            )

            // Tags
            OutlinedTextField(
                value = tagsInput,
                onValueChange = { tagsInput = it },
                label = { Text("Tags (comma separated)") },
                placeholder = { Text("e.g. Python, AI, Beginner, Coding") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            // Reward callout
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = GoldenCoin.copy(alpha = 0.15f)
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(imageVector = Icons.Default.MonetizationOn, contentDescription = null, tint = GoldenCoin)
                    Text(
                        text = "You earn +20 Skill Coins for every completed swap teaching this skill!",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = GoldenCoin
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Submit Button
            Button(
                onClick = {
                    if (title.isNotBlank() && description.isNotBlank()) {
                        val tagsList = tagsInput.split(",").map { it.trim() }.filter { it.isNotEmpty() }
                        SkillsSwapRepository.addSkill(
                            title = title,
                            description = description,
                            category = selectedCategory,
                            format = selectedFormat,
                            tags = tagsList
                        )
                        onSkillAdded()
                    }
                },
                enabled = title.isNotBlank() && description.isNotBlank(),
                colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().height(50.dp)
            ) {
                Text("Publish Skill Offering 🚀", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
        }
    }
}
